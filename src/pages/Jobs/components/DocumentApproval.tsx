
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Check, FileCheck } from "lucide-react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface DocumentApprovalProps {
  jobId: string;
  onFinancialDataExtracted: (data: any) => void;
}

export function DocumentApproval({ jobId, onFinancialDataExtracted }: DocumentApprovalProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCurrentFile(event.target.files[0]);
      setExtractedText(null); // Reset extracted text when a new file is selected
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleApproveDocument = async (asDraft = false) => {
    if (!currentFile) {
      toast.error("Please select a document first");
      return;
    }

    setIsProcessing(true);
    setIsUploading(true);
    
    try {
      // 1. Upload file to Supabase Storage
      const fileName = `${jobId}_${Date.now()}_${currentFile.name}`;
      const fileExt = currentFile.name.split('.').pop();
      const filePath = `${jobId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-documents')
        .upload(filePath, currentFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 50)); // First 50% is upload
          }
        });
        
      if (uploadError) {
        throw new Error(`Error uploading document: ${uploadError.message}`);
      }
      
      setUploadProgress(50); // Upload complete
      
      // 2. Process with GCP Vision if it's an image or PDF
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
          throw new Error(`Error processing document: ${visionError.message}`);
        }
        
        setUploadProgress(100); // Processing complete
        
        // 3. Handle the extracted data
        if (visionData.success && visionData.data.extractedFinancialData) {
          const extractedData = visionData.data.extractedFinancialData;
          
          // 4. Update local storage for compatibility with existing code
          const storageKey = `job-${jobId}-financial-data`;
          const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
          localStorage.setItem(storageKey, JSON.stringify([...existingData, extractedData]));
          
          onFinancialDataExtracted(extractedData);
          
          toast.success(`Financial data extracted: $${extractedData.amount.toFixed(2)}`);
          
          // Create a record in the database with the appropriate status
          const { error: statusError } = await supabase
            .from('job_document_approvals')
            .insert({
              job_id: jobId,
              file_path: filePath,
              status: asDraft ? 'draft' : 'approved',
              extracted_amount: extractedData.amount,
              document_name: currentFile.name
            });
            
          if (statusError) {
            console.error('Error saving approval status:', statusError);
          }
        } else {
          // Just save the document reference even if no financial data was extracted
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
          }
          
          toast.info("Document saved, but no financial data could be extracted");
        }
      } else {
        // For non-processable files, just save the reference
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
        }
        
        setUploadProgress(100);
        toast.success("Document saved successfully");
      }
      
      // Reset state after successful processing
      setCurrentFile(null);
    } catch (error) {
      console.error('Error in document approval process:', error);
      toast.error(error.message || "An error occurred during document processing");
    } finally {
      setIsProcessing(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="border-t-2 pt-4 mt-8">
      <h3 className="text-lg font-medium mb-4">Document Approval</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-2">
          <FileUpload 
            onFileUpload={handleFileUpload}
            label="Upload invoice, quote, or other financial document"
            allowGcpVision={true}
            onTextExtracted={(text, filename) => {
              setExtractedText(text);
              toast.info(`Text extracted from ${filename}`);
            }}
          />
          
          {currentFile && (
            <div className="mt-2 flex items-center space-x-2 bg-blue-50 p-2 rounded border border-blue-200">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700 font-medium">{currentFile.name}</span>
            </div>
          )}
          
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{uploadProgress === 100 ? 'Processing complete' : 'Uploading and processing...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
        
        <div className="space-y-3 bg-gray-50 p-4 rounded border">
          <h4 className="font-medium text-sm">Document Actions</h4>
          
          <div className="space-y-2">
            <Button
              variant="default"
              className="w-full justify-start"
              disabled={!currentFile || isProcessing}
              onClick={() => handleApproveDocument(false)}
            >
              <Check className="mr-2 h-4 w-4" />
              Approve Document
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={!currentFile || isProcessing}
              onClick={() => handleApproveDocument(true)}
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Approving a document will extract financial data and add it to the job record.
            Draft documents are saved but not marked as approved.
          </p>
        </div>
      </div>
    </div>
  );
}
