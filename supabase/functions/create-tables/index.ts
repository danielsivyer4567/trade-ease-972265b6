
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Creating necessary tables...");
    
    // Create job_financial_data table if it doesn't exist
    const { error: financialDataError } = await supabase.rpc('create_job_financial_data_table_if_not_exists');
    
    if (financialDataError) {
      console.error('Error creating job_financial_data table:', financialDataError);
      
      // Try to create it directly with SQL
      const { error: sqlError } = await supabase.rpc(
        'exec_sql',
        {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.job_financial_data (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              job_id TEXT NOT NULL,
              file_path TEXT,
              status TEXT DEFAULT 'draft',
              extracted_data JSONB,
              document_name TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE public.job_financial_data ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view job financial data"
            ON public.job_financial_data
            FOR SELECT
            USING (auth.uid() IS NOT NULL);
            
            CREATE POLICY "Users can insert job financial data"
            ON public.job_financial_data
            FOR INSERT
            WITH CHECK (auth.uid() IS NOT NULL);
            
            CREATE POLICY "Users can update job financial data"
            ON public.job_financial_data
            FOR UPDATE
            USING (auth.uid() IS NOT NULL);
          `
        }
      );
      
      if (sqlError) {
        throw new Error(`Failed to create tables: ${sqlError.message}`);
      }
    }
    
    // Create storage bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets.some(bucket => bucket.name === 'job-documents')) {
        const { error: bucketError } = await supabase.storage.createBucket('job-documents', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
        } else {
          console.log('Created job-documents bucket');
        }
      }
    } catch (bucketError) {
      console.error('Error checking/creating bucket:', bucketError);
    }
    
    // Create job_document_approvals table if it doesn't exist
    const { error: approvalsError } = await supabase.rpc(
      'exec_sql',
      {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.job_document_approvals (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            job_id TEXT NOT NULL,
            file_path TEXT,
            status TEXT DEFAULT 'draft',
            extracted_amount NUMERIC,
            extracted_vendor TEXT,
            extracted_date TEXT,
            extracted_description TEXT,
            extracted_category TEXT,
            document_name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          ALTER TABLE public.job_document_approvals ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view job document approvals"
          ON public.job_document_approvals
          FOR SELECT
          USING (auth.uid() IS NOT NULL);
          
          CREATE POLICY "Users can insert job document approvals"
          ON public.job_document_approvals
          FOR INSERT
          WITH CHECK (auth.uid() IS NOT NULL);
          
          CREATE POLICY "Users can update job document approvals"
          ON public.job_document_approvals
          FOR UPDATE
          USING (auth.uid() IS NOT NULL);
        `
      }
    );
    
    if (approvalsError) {
      throw new Error(`Failed to create job_document_approvals table: ${approvalsError.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Tables created successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating tables:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
