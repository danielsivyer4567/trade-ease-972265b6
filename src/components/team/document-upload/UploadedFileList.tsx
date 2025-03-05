
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { UploadedFileListProps } from './types';

export function UploadedFileList({ files, onSubmit, isSubmitting, disabled = false }: UploadedFileListProps) {
  if (files.length === 0) return null;
  
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700">{files.length} file(s) ready to submit</p>
      <ul className="text-xs text-gray-500 mt-1 mb-3 max-h-20 overflow-y-auto">
        {files.map((file, index) => (
          <li key={index} className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</li>
        ))}
      </ul>
      <Button 
        className="w-full border-2 border-black h-7 text-xs py-0" 
        onClick={onSubmit}
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? "Processing..." : "Process Uploaded Files"} <Send className="ml-2 h-3 w-3" />
      </Button>
    </div>
  );
}
