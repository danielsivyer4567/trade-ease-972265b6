
import { Upload } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  allowGcpVision?: boolean;
}

export function FileUpload({
  onFileUpload,
  label,
  allowGcpVision = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // Create a synthetic event to match the onChange interface
      const event = {
        target: {
          files: files as unknown as FileList
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(event);
    }
  };

  return (
    <label 
      className={cn("flex-1 cursor-pointer", isDragging && "opacity-70")} 
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop}
    >
      <div className={cn("bg-slate-50 p-4 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2", 
        allowGcpVision && "border-blue-300 bg-blue-50")}>
        <Upload className={cn("h-10 w-10 text-gray-400", allowGcpVision && "text-blue-500")} />
        <span className="text-sm text-center text-gray-600">
          {isDragging ? "Drop files here..." : label}
        </span>
        <span className="text-xs text-gray-500">
          Drag & drop or click to browse
          {allowGcpVision && " (Google Cloud Vision enabled)"}
        </span>
      </div>
      <input 
        type="file" 
        className="hidden" 
        onChange={onFileUpload} 
        accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png,.mp4,.mov" 
        multiple 
      />
    </label>
  );
}
