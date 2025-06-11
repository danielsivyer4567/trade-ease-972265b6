import React from "react";
import { FileText, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagesGridProps {
  images: File[];
  title?: string;
  onDelete?: (index: number) => void;
}

export function ImagesGrid({ images, title, onDelete }: ImagesGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="relative group border rounded-lg overflow-hidden bg-gray-50"
          >
            <div className="aspect-square flex items-center justify-center">
              {file.type.startsWith("image/") ? (
                <Image className="h-12 w-12 text-gray-400" />
              ) : (
                <FileText className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 