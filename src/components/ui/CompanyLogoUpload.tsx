import React from 'react';
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
  };

  const handleRemove = () => {
    onFileUpload(null);
    if (onRemove) onRemove();
  };

  const hasLogo = logo || logoUrl;

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
              id="useLogoEverytime"
              checked={useInAllDocuments}
              onChange={(e) => onUseInAllDocumentsChange(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="useLogoEverytime" className="text-sm">
              {useInAllDocumentsLabel}
            </Label>
          </div>
        )}
      </div>
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
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
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Upload your company logo
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PNG, JPG, SVG up to 2MB
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="company-logo-upload"
            />
            <Label htmlFor="company-logo-upload" className="cursor-pointer">
              <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                Choose File
              </Button>
            </Label>
          </div>
        )}
      </div>
    </div>
  );
} 