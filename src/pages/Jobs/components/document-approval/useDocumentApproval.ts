
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertToBase64 } from "./utils/fileUtils";
import { extractFinancialData } from "./utils/extractFinancialData";
import { FinancialData } from "./types";

export const useDocumentApproval = (
  jobId: string,
  onFinancialDataExtracted: (data: any) => void
) => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const handleApproveDocument = async (asDraft = false) => {
    if (!currentFile) {
      toast.error("Please select a document first");
      return;
    }

    setIsProcessing(true);
    setIsUploading(true);
    setExtractionError(null);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileName = `${jobId}_${Date.now()}_${currentFile.name}`;
      const fileExt = currentFile.name.split('.').pop();
      const filePath = `${jobId}/${fileName}`;
      
      setUploadProgress(10); // Start progress indication
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-documents')
        .upload(filePath, currentFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        // More specific error message based on the type of error
        if (uploadError.message.includes("bucket") || uploadError.message.includes("404")) {
          throw new Error("Storage system not available. Please contact your administrator.");
        }
        throw new Error(`Error uploading document: ${uploadError.message}`);
      }
      
      setUploadProgress(50); // Upload complete
      
      // 2. Process with GCP Vision if it's an image or PDF
      let extractedData: FinancialData | null = null;
      
      if (['jpg', 'jpeg', 'png', 'pdf'].includes(fileExt?.toLowerCase() || '')) {
        // Convert file to base64
        const base64File = await convertToBase64(currentFile);
        
        // Call our Edge Function
        const { data: visionData, error: visionError } = await supabase.functions
          .invoke('job-document-extract', {
            body: {
              fileBase64: base64File,
              jobId: jobId,
              documentName: currentFile.name
            }
          });
          
        if (visionError) {
          console.error("Vision API error:", visionError);
          throw new Error(`Error processing document: ${visionError.message}`);
        }
        
        setUploadProgress(80); // OCR processing complete
        
        // 3. Handle the extracted data
        if (visionData.success && visionData.data.visionResult?.responses?.[0]?.fullTextAnnotation) {
          // Extract the full text from the OCR result
          const fullText = visionData.data.visionResult.responses[0].fullTextAnnotation.text;
          setExtractedText(fullText);
          
          // Use the advanced extraction logic to get financial data
          extractedData = extractFinancialData(fullText, currentFile.name, jobId);
          
          // If we couldn't extract structured data but we have raw OCR text, 
          // create a basic record with just the amount from the API response
          if (!extractedData && visionData.data.extractedFinancialData) {
            extractedData = visionData.data.extractedFinancialData;
          }
        } else if (visionData.data.extractedFinancialData) {
          // Use the basic extraction from the edge function if available
          extractedData = visionData.data.extractedFinancialData;
        }
      }
      
      if (extractedData) {
        // Add the approval status
        extractedData.status = asDraft ? 'draft' : 'approved';
        
        // 4. Update local storage for compatibility with existing code
        const storageKey = `job-${jobId}-financial-data`;
        const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([...existingData, extractedData]));
        
        onFinancialDataExtracted(extractedData);
        
        toast.success(`Financial data extracted: $${extractedData.amount.toFixed(2)}${extractedData.vendor ? ` from ${extractedData.vendor}` : ''}`);
        
        // Create a record in the database with the appropriate status
        const { error: statusError } = await supabase
          .from('job_document_approvals')
          .insert({
            job_id: jobId,
            file_path: filePath,
            status: asDraft ? 'draft' : 'approved',
            extracted_amount: extractedData.amount,
            extracted_vendor: extractedData.vendor,
            extracted_date: extractedData.date,
            extracted_description: extractedData.description,
            extracted_category: extractedData.category,
            document_name: currentFile.name
          });
          
        if (statusError) {
          console.error('Error saving approval status:', statusError);
          toast.error("Financial data was extracted but could not be saved to the database");
        }
      } else {
        // Just save the document reference even if no financial data was extracted
        setExtractionError("Couldn't extract financial data. The document has been saved.");
        
        const { error: docError } = await supabase
          .from('job_document_approvals')
          .insert({
            job_id: jobId,
            file_path: filePath,
            status: asDraft ? 'draft' : 'approved',
            document_name: currentFile.name
          });
          
        if (docError) {
          console.error('Error saving document reference:', docError);
          toast.error("Document was uploaded but details could not be saved to the database");
        } else {
          toast.info("Document saved, but no financial data could be extracted");
        }
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
