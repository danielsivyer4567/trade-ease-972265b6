
import { DocumentApprovalProps } from "./types";
import { FileUploadSection } from "./FileUploadSection";
import { ActionButtons } from "./ActionButtons";
import { useDocumentApproval } from "./useDocumentApproval";

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
  
  return (
    <div className="border-t-4 border-gray-300 pt-12 mt-20">
      <h3 className="text-xl font-medium mb-6">Document Approval</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
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
