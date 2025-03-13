
import { useState } from "react";
import { FileText } from "lucide-react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadSectionProps {
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  isUploading: boolean;
  uploadProgress: number;
  extractionError: string | null;
}

export function FileUploadSection({
  currentFile,
  setCurrentFile,
  isUploading,
  uploadProgress,
  extractionError
}: FileUploadSectionProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCurrentFile(event.target.files[0]);
    }
  };

  return (
    <div className="md:col-span-2">
      <FileUpload 
        onFileUpload={handleFileUpload}
        label="Upload invoice, quote, or other financial document"
        allowGcpVision={true}
        onTextExtracted={(text, filename) => {
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
  );
}
