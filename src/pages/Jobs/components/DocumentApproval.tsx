
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Check, FileCheck, AlertCircle } from "lucide-react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentApprovalProps {
  jobId: string;
  onFinancialDataExtracted: (data: any) => void;
}

interface FinancialData {
  amount: number;
  vendor?: string;
  date?: string;
  description?: string;
  source: string;
  timestamp: string;
  jobId: string;
  category?: string;
  status?: string;
}

export function DocumentApproval({ jobId, onFinancialDataExtracted }: DocumentApprovalProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCurrentFile(event.target.files[0]);
      setExtractedText(null); // Reset extracted text when a new file is selected
      setExtractionError(null); // Reset any previous errors
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

  const extractFinancialData = (text: string, docName: string): FinancialData | null => {
    try {
      // Get the full text from OCR
      const fullText = text.toLowerCase();
      
      // Advanced regex patterns to extract financial information
      const currencyRegex = /\$\s*(\d{1,3}(,\d{3})*(\.\d{2})?)/g;
      const dateRegex = /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)?\d{2}\b/g;
      const vendorKeywords = ["from:", "vendor:", "supplier:", "bill from:", "company:", "business:"];
      
      // Extract amounts
      const amounts: number[] = [];
      let match;
      while ((match = currencyRegex.exec(fullText)) !== null) {
        amounts.push(parseFloat(match[1].replace(/,/g, '')));
      }
      
      if (amounts.length === 0) {
        throw new Error("No financial amounts found in the document");
      }
      
      // Find the largest amount (likely the total)
      const maxAmount = Math.max(...amounts);
      
      // Try to extract date (use the first one found)
      const dates = fullText.match(dateRegex);
      const date = dates ? dates[0] : null;
      
      // Try to extract vendor name
      let vendor = null;
      for (const keyword of vendorKeywords) {
        const keywordIndex = fullText.indexOf(keyword);
        if (keywordIndex !== -1) {
          // Extract the text after the keyword until a newline or period
          const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
          vendor = afterKeyword.split(/[\n\r\.,]/)[0].trim();
          break;
        }
      }
      
      // Try to extract description based on contextual clues
      const descriptionKeywords = ["description:", "details:", "item:", "service:"];
      let description = null;
      for (const keyword of descriptionKeywords) {
        const keywordIndex = fullText.indexOf(keyword);
        if (keywordIndex !== -1) {
          const afterKeyword = fullText.substring(keywordIndex + keyword.length).trim();
          description = afterKeyword.split(/[\n\r\.,]/)[0].trim();
          break;
        }
      }
      
      // Determine if this is an invoice, receipt, quote, or other document type
      let category = "unknown";
      if (fullText.includes("invoice") || fullText.includes("inv#")) {
        category = "invoice";
      } else if (fullText.includes("receipt")) {
        category = "receipt";
      } else if (fullText.includes("quote") || fullText.includes("estimate")) {
        category = "quote";
      } else if (fullText.includes("bill") || fullText.includes("statement")) {
        category = "bill";
      }
      
      return {
        amount: maxAmount,
        vendor: vendor || undefined,
        date: date || undefined,
        description: description || undefined,
        source: docName,
        timestamp: new Date().toISOString(),
        jobId: jobId,
        category: category
      };
    } catch (error) {
      console.error("Error extracting financial data:", error);
      setExtractionError(error.message);
      return null;
    }
  };

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
      
      // Create an XMLHttpRequest to track upload progress manually
      // since Supabase doesn't support progress tracking directly
      setUploadProgress(10); // Start progress indication
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-documents')
        .upload(filePath, currentFile, {
          cacheControl: '3600',
          upsert: false
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
        
        setUploadProgress(80); // OCR processing complete
        
        // 3. Handle the extracted data
        let extractedData: FinancialData | null = null;
        
        if (visionData.success && visionData.data.visionResult?.responses?.[0]?.fullTextAnnotation) {
          // Extract the full text from the OCR result
          const fullText = visionData.data.visionResult.responses[0].fullTextAnnotation.text;
          setExtractedText(fullText);
          
          // Use the advanced extraction logic to get financial data
          extractedData = extractFinancialData(fullText, currentFile.name);
          
          // If we couldn't extract structured data but we have raw OCR text, 
          // create a basic record with just the amount from the API response
          if (!extractedData && visionData.data.extractedFinancialData) {
            extractedData = visionData.data.extractedFinancialData;
          }
        } else if (visionData.data.extractedFinancialData) {
          // Use the basic extraction from the edge function if available
          extractedData = visionData.data.extractedFinancialData;
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
        
        toast.info("Document saved successfully but not processed for financial data (unsupported file type)");
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
    } finally {
      setIsProcessing(false);
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
          
          {extractionError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Extraction Error</AlertTitle>
              <AlertDescription>
                {extractionError}
              </AlertDescription>
            </Alert>
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
