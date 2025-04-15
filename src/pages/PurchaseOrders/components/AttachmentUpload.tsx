
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, X } from "lucide-react";
import { useState } from "react";
import { PurchaseOrderAttachment } from "../types";

interface AttachmentUploadProps {
  attachments: PurchaseOrderAttachment[];
  onAttach: (files: FileList) => void;
  onRemove: (attachmentId: string) => void;
}

export function AttachmentUpload({ attachments, onAttach, onRemove }: AttachmentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onAttach(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-[#00A3BE] bg-[#00A3BE]/10" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <PaperclipIcon className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drag and drop files here, or{" "}
            <label className="text-[#00A3BE] hover:text-[#008CA3] cursor-pointer">
              browse
              <Input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && onAttach(e.target.files)}
                multiple
              />
            </label>
          </p>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Attached Files</h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <PaperclipIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{attachment.fileName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(attachment.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
