
import { Upload } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export function FileUpload({ onFileUpload, label }: FileUploadProps) {
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
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

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
      className="flex-1"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn(
        "flex items-center gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200",
        isDragging ? "bg-gray-100 border-gray-400" : "hover:bg-gray-50 border-gray-200"
      )}>
        <Upload className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">
          {isDragging ? "Drop files here..." : `${label} (Images and Videos)`}
        </span>
      </div>
      <input
        type="file"
        multiple
        className="hidden"
        onChange={onFileUpload}
        accept="image/*,video/*"
      />
    </label>
  );
}
