
import { supabase } from '@/integrations/supabase/client';
import { FinancialData } from './types';

export const createTablesIfNeeded = async (): Promise<void> => {
  try {
    await supabase.functions.invoke('create-tables');
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

export const fetchFinancialDataFromDatabase = async (jobId: string): Promise<FinancialData[]> => {
  if (!jobId) return [];
  
  try {
    console.log("Checking database for financial data...");
    const { data, error } = await supabase
      .from('job_financial_data')
      .select('*')
      .eq('job_id', jobId);
      
    if (error) {
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        console.log("Table doesn't exist yet, will be created when needed");
      } else {
        console.error("Database error:", error);
      }
      return [];
    }
    
    if (data && data.length > 0) {
      console.log("Found data in database:", data.length, "items");
      // Format the data to match our expected structure
      return data.map(item => ({
        ...item.extracted_data,
        id: item.id,
        status: item.status
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error querying database:", error);
    return [];
  }
};
