
import { useState } from "react";
import { toast } from "sonner";
import { DocumentApprovalHookReturn } from "./types";
import { useFileUpload } from "./useFileUpload";
import { useDocumentProcessing } from "./useDocumentProcessing";
import { useDatabaseOperations } from "./useDatabaseOperations";
import { FinancialData } from "../types";

export const useDocumentApproval = (
  jobId: string,
  onFinancialDataExtracted: (data: FinancialData) => void
): DocumentApprovalHookReturn => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Use our helper hooks
  const { 
    uploadProgress, 
    setUploadProgress, 
    isUploading, 
    setIsUploading, 
    uploadFileToStorage 
  } = useFileUpload(jobId);
  
  const { extractedText, processDocument } = useDocumentProcessing(jobId);
  const { saveExtractedData, saveDocumentReference } = useDatabaseOperations();

  const handleApproveDocument = async (asDraft = false) => {
    if (!currentFile) {
      toast.error("Please select a document first");
      return;
    }

    setIsProcessing(true);
    setIsUploading(true);
    setExtractionError(null);
    
    try {
      console.log("Processing document:", currentFile.name, "for job:", jobId);
      
      // 1. Upload file to Supabase Storage
      const filePath = await uploadFileToStorage(currentFile);
      
      // 2. Process and extract data from the document
      const extractedData = await processDocument(currentFile, filePath, setUploadProgress);
      
      // 3. Handle the extracted data
      if (extractedData) {
        // Add the approval status
        extractedData.status = asDraft ? 'draft' : 'approved';
        
        console.log("Extracted financial data:", extractedData);
        
        // 4. Update local storage for compatibility with existing code
        const storageKey = `job-${jobId}-financial-data`;
        const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([...existingData, extractedData]));
        
        // Call the callback to update the UI with the extracted data
        onFinancialDataExtracted(extractedData);
        
        toast.success(`Financial data extracted: $${extractedData.amount.toFixed(2)}${extractedData.vendor ? ` from ${extractedData.vendor}` : ''}`);
        
        // 5. Save to database
        await saveExtractedData(jobId, filePath, extractedData, asDraft ? 'draft' : 'approved');
      } else {
        // Just save the document reference even if no financial data was extracted
        setExtractionError("Couldn't extract financial data. The document has been saved.");
        
        // Try to save it anyway
        await saveDocumentReference(jobId, filePath, currentFile.name, asDraft ? 'draft' : 'approved');
        
        toast.info("Document saved, but no financial data could be extracted");
      }
      
      setUploadProgress(100); // Process complete
      
      // Reset state after successful processing
      setTimeout(() => {
        setCurrentFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error in document approval process:', error);
      toast.error(error.message || "An error occurred during document processing");
      setExtractionError(error.message || "An error occurred during processing");
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
      // Make sure to always clean up the uploading state even if there was an error
      setTimeout(() => {
        if (isUploading) {
          setIsUploading(false);
        }
      }, 500);
    }
  };

  return {
    currentFile,
    setCurrentFile,
    extractedText,
    isProcessing,
    uploadProgress,
    isUploading,
    extractionError,
    setExtractionError,
    handleApproveDocument
  };
};
