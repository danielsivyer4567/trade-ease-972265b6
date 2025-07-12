
import { FileUpload } from "@/components/tasks/FileUpload";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    const files = event.target.files;
    if (files && files.length > 0) {
      setCurrentFile(files[0]);
    }
  };

  return (
    <div className="col-span-2 space-y-3">
      {!currentFile ? (
        <FileUpload 
          onFileUpload={handleFileUpload}
          label="Upload an invoice, receipt or financial document"
          allowGcpVision={true} // Enable Vision API text extraction
        />
      ) : (
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-sm truncate">{currentFile.name}</p>
              <p className="text-xs text-gray-500">{Math.round(currentFile.size / 1024)} KB</p>
            </div>
            <button
              onClick={() => setCurrentFile(null)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Remove
            </button>
          </div>

          {isUploading && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">
                {uploadProgress < 50 
                  ? "Uploading document..." 
                  : uploadProgress < 80 
                    ? "Processing with Google Cloud Vision..." 
                    : "Extracting financial data..."}
              </p>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </div>
      )}

      {extractionError && (
        <Alert variant="destructive" className="mt-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{extractionError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
