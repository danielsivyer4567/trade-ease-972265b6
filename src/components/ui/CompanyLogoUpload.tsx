import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompanyLogoUploadProps {
  logo?: File | null;
  logoUrl?: string;
  onFileUpload: (file: File | null) => void;
  onRemove?: () => void;
  useInAllDocuments?: boolean;
  onUseInAllDocumentsChange?: (checked: boolean) => void;
  useInAllDocumentsLabel?: string;
  className?: string;
}

export function CompanyLogoUpload({
  logo,
  logoUrl,
  onFileUpload,
  onRemove,
  useInAllDocuments,
  onUseInAllDocumentsChange,
  useInAllDocumentsLabel = "Use in all documents",
  className = ""
}: CompanyLogoUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed', event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 2MB',
          variant: 'destructive'
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (PNG, JPG, or SVG)',
          variant: 'destructive'
        });
        return;
      }

      onFileUpload(file);
      toast({
        title: 'Logo uploaded',
        description: 'Your company logo has been selected successfully',
      });
    }
    
    // Reset file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked, triggering file input');
    fileInputRef.current?.click();
  };

  // Generate unique ID for this component instance
  const uniqueId = React.useId();

  const handleRemove = () => {
    onFileUpload(null);
    if (onRemove) onRemove();
  };

  const hasLogo = logo || logoUrl;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file (PNG, JPG, or SVG)',
          variant: 'destructive'
        });
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 2MB',
          variant: 'destructive'
        });
        return;
      }

      onFileUpload(file);
      toast({
        title: 'Logo uploaded',
        description: 'Your company logo has been selected successfully',
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Company Logo
        </h4>
        {useInAllDocuments !== undefined && onUseInAllDocumentsChange && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`useLogoEverytime-${uniqueId}`}
              checked={useInAllDocuments}
              onChange={(e) => onUseInAllDocumentsChange(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor={`useLogoEverytime-${uniqueId}`} className="text-sm">
              {useInAllDocumentsLabel}
            </Label>
          </div>
        )}
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasLogo ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="Company logo" 
                  className="h-12 w-12 object-contain rounded"
                />
              )}
              <Image className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">
                  {logo ? logo.name : 'Company Logo'}
                </p>
                {logo && (
                  <p className="text-xs text-gray-500">
                    {(logo.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
                                              <div 
                    className="text-center cursor-pointer" 
                    onClick={handleButtonClick}
                  >
                    <Upload className={`h-12 w-12 mx-auto mb-4 ${
                      isDragOver ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm mb-2 ${
                      isDragOver 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {isDragOver ? 'Drop your logo here' : 'Upload your company logo'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {isDragOver ? 'Release to upload' : 'Drag & drop or click to browse • PNG, JPG, SVG up to 2MB'}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      style={{ display: 'none' }}
                    />
                    <Button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleButtonClick();
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Choose File
                    </Button>
                  </div>
        )}
      </div>
    </div>
  );
} 