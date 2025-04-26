
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
    let { imageBase64, apiKey } = await req.json();
    
    // If no API key provided, try to get it from the database using the authorization header
    if (!apiKey) {
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
            apiKey = data.api_key;
          }
        }
      }
    }
    
    if (!imageBase64 || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Call Google Cloud Vision API
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: imageBase64.split(',')[1], // Remove data URL prefix if present
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'TEXT_DETECTION', maxResults: 10 },
            { type: 'DOCUMENT_TEXT_DETECTION' }
          ],
        }],
      }),
    });
    
    const result = await response.json();
    
    console.log('GCP Vision API response:', JSON.stringify(result));
    
    return new Response(
      JSON.stringify({ 
        success: true,
        data: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error calling Google Cloud Vision API:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
