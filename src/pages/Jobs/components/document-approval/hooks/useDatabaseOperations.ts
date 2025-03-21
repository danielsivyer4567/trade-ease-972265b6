
import { supabase } from "@/integrations/supabase/client";
import { FinancialData } from "../types";

export const useDatabaseOperations = () => {
  const saveExtractedData = async (
    jobId: string, 
    filePath: string, 
    extractedData: FinancialData, 
    status: 'draft' | 'approved'
  ) => {
    try {
      // Check if the table exists and create it if necessary
      const { error: tableError } = await supabase.rpc('create_job_financial_data_table_if_not_exists');
      
      if (tableError) {
        console.error('Error creating table:', tableError);
        return false;
      }
      
      // Create a record in the database with the appropriate status
      const { error: statusError } = await supabase
        .from('job_financial_data')
        .insert({
          job_id: jobId,
          file_path: filePath,
          status: status,
          extracted_data: extractedData
        });
        
      if (statusError) {
        console.error('Error saving approval status:', statusError);
        return false;
      }
      
      return true;
    } catch (dbError) {
      console.error('Database error:', dbError);
      return false;
    }
  };
  
  const saveDocumentReference = async (
    jobId: string, 
    filePath: string, 
    fileName: string, 
    status: 'draft' | 'approved'
  ) => {
    try {
      const { error: docError } = await supabase
        .from('job_document_approvals')
        .insert({
          job_id: jobId,
          file_path: filePath,
          status: status,
          document_name: fileName
        });
        
      if (docError) {
        console.error('Error saving document reference:', docError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error saving document:', error);
      return false;
    }
  };
  
  return {
    saveExtractedData,
    saveDocumentReference
  };
};
