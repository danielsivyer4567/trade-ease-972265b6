
import { DocumentApprovalProps } from "./types";
import { FileUploadSection } from "./FileUploadSection";
import { ActionButtons } from "./ActionButtons";
import { useDocumentApproval } from "./hooks/useDocumentApproval";
import { useIsMobile } from "@/hooks/use-mobile";

export function DocumentApproval({
  jobId,
  onFinancialDataExtracted
}: DocumentApprovalProps) {
  const {
    currentFile,
    setCurrentFile,
    isProcessing,
    uploadProgress,
    isUploading,
    extractionError,
    handleApproveDocument
  } = useDocumentApproval(jobId, onFinancialDataExtracted);
  
  const isMobile = useIsMobile();
  
  return (
    <div className="border-t-2 sm:border-t-4 border-gray-200 pt-6 sm:pt-8">
      <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 px-2">Document Approval</h3>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'} items-start`}>
        <FileUploadSection
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          extractionError={extractionError}
        />
        
        <ActionButtons
          currentFile={currentFile}
          isProcessing={isProcessing}
          onApprove={() => handleApproveDocument(false)}
          onSaveDraft={() => handleApproveDocument(true)}
        />
      </div>
    </div>
  );
}
