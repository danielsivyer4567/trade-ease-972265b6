
import { useState } from "react";
import { FileText, AlertTriangle, Upload } from "lucide-react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

  const handleClearSelection = () => {
    setCurrentFile(null);
  };

  return (
    <div className="md:col-span-2 border border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/30 flex flex-col items-center justify-center text-center">
      {!currentFile ? (
        <>
          <div className="mb-4 bg-blue-100 p-4 rounded-full">
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
          <h4 className="text-base font-medium mb-2">Upload invoice, quote, or other financial document</h4>
          <p className="text-sm text-gray-500 mb-4">Drag & drop or click to browse (Text extraction enabled)</p>
          <FileUpload 
            onFileUpload={handleFileUpload}
            label=""
            allowGcpVision={true}
            onTextExtracted={(text, filename) => {
              toast.info(`Text extracted from ${filename}`);
            }}
          />
        </>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between space-x-2 bg-blue-100 p-3 rounded-lg mb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium truncate">{currentFile.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearSelection} 
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          
          {isUploading && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{uploadProgress === 100 ? 'Processing complete' : `Uploading and processing... ${uploadProgress}%`}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
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
