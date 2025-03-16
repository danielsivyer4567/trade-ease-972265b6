
-- Create a function to create the job_financial_data table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_job_financial_data_table_if_not_exists()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'job_financial_data'
  ) THEN
    -- Create the table
    CREATE TABLE public.job_financial_data (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      job_id TEXT NOT NULL,
      file_path TEXT,
      status TEXT DEFAULT 'draft',
      extracted_data JSONB,
      document_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Grant access to authenticated users
    GRANT ALL ON public.job_financial_data TO authenticated;
    GRANT ALL ON public.job_financial_data TO service_role;
    
    -- Create an RLS policy for the table
    ALTER TABLE public.job_financial_data ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own organization's job financial data"
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
  END IF;

  RETURN TRUE;
END;
$$;

-- Create a function to execute arbitrary SQL (for admin use only)
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query TEXT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_job_financial_data_table_if_not_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_job_financial_data_table_if_not_exists() TO service_role;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO service_role;
