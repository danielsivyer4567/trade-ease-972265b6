
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const { fileBase64, jobId, documentName, apiKey } = await req.json();
    
    // If no API key provided, try to get it from the database
    let gcpVisionKey = apiKey;
    if (!gcpVisionKey) {
      const authHeader = req.headers.get('Authorization')?.split(' ')[1];
      if (authHeader) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Verify the token and get the user
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader);
        if (!authError && user) {
          const userId = user.id;
          
          // Get the API key from the database
          const { data, error } = await supabase
            .from('user_api_keys')
            .select('api_key')
            .eq('user_id', userId)
            .eq('service', 'gcp_vision')
            .single();
            
          if (!error && data) {
            gcpVisionKey = data.api_key;
          }
          
          // If not found in user_api_keys, try messaging_accounts
          if (!gcpVisionKey) {
            const { data: msgData, error: msgError } = await supabase
              .from('messaging_accounts')
              .select('gcp_vision_key, api_key')
              .eq('user_id', userId)
              .eq('service_type', 'gcpvision')
              .single();
              
            if (!msgError && msgData) {
              gcpVisionKey = msgData.gcp_vision_key || msgData.api_key;
            }
          }
        }
      }
    }
    
    if (!fileBase64 || !jobId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Call Google Cloud Vision API
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${gcpVisionKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: fileBase64.split(',')[1], // Remove data URL prefix if present
          },
          features: [
            { type: 'DOCUMENT_TEXT_DETECTION' },
            { type: 'TEXT_DETECTION' }
          ],
        }],
      }),
    });
    
    const visionResult = await response.json();
    
    // Extract financial data from the document (looking for currency/amounts)
    let extractedFinancialData = null;
    if (visionResult.responses && visionResult.responses[0] && visionResult.responses[0].fullTextAnnotation) {
      const fullText = visionResult.responses[0].fullTextAnnotation.text;
      
      // Simple regex to find dollar amounts (can be improved based on document formats)
      const currencyRegex = /\$\s*(\d{1,3}(,\d{3})*(\.\d{2})?)/g;
      const dateRegex = /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)?\d{2}\b/g;
      
      const matches = [...fullText.matchAll(currencyRegex)];
      const dates = [...fullText.matchAll(dateRegex)];
      
      if (matches.length > 0) {
        // Take the largest amount as the quote amount (this is a simple heuristic)
        const amounts = matches.map(match => {
          return parseFloat(match[1].replace(/,/g, ''));
        });
        
        const maxAmount = Math.max(...amounts);
        
        // Try to identify vendor/supplier information
        // This is a simple approach that looks for common terms near the beginning of the document
        let vendor = null;
        const vendorKeywords = ['from:', 'vendor:', 'supplier:', 'bill from:', 'company:'];
        for (const keyword of vendorKeywords) {
          const keywordIndex = fullText.toLowerCase().indexOf(keyword);
          if (keywordIndex !== -1) {
            // Extract the text after the keyword until a newline
            const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
            vendor = afterKeyword.split(/[\n\r]/)[0].trim();
            break;
          }
        }
        
        // Try to extract a date
        let extractedDate = null;
        if (dates.length > 0) {
          extractedDate = dates[0][0]; // Get the first date found
        }
        
        extractedFinancialData = {
          amount: maxAmount,
          vendor: vendor,
          date: extractedDate,
          source: documentName,
          timestamp: new Date().toISOString(),
          jobId: jobId
        };
      }
    }
    
    // Save the result to job_financial_data if data was extracted
    if (extractedFinancialData) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error } = await supabase
        .from('job_financial_data')
        .insert({
          job_id: jobId,
          extracted_data: extractedFinancialData,
          status: 'draft',
          document_name: documentName
        });
        
      if (error) {
        console.error('Error saving extracted data:', error);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          extractedFinancialData,
          visionResult
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing document:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
