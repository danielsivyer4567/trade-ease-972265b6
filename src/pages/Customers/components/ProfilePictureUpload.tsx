import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddressStreetView } from './AddressStreetView';

interface ProfilePictureUploadProps {
  customerId: string;
  currentImage?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  onImageUpdate?: (imageUrl: string) => void;
  onAddressUpdate?: (address: string) => void;
  className?: string;
}

export function ProfilePictureUpload({
  customerId,
  currentImage,
  address = '',
  city = '',
  state = '',
  zipCode = '',
  onImageUpdate,
  onAddressUpdate,
  className = ''
}: ProfilePictureUploadProps) {
  const [image, setImage] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('customerId', customerId);

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setImage(data.imageUrl);
      if (onImageUpdate) {
        onImageUpdate(data.imageUrl);
      }

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await fetch(`/api/remove-profile-picture/${customerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove image');

      setImage(null);
      if (onImageUpdate) {
        onImageUpdate('');
      }

      toast({
        title: "Success",
        description: "Profile picture removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove profile picture",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-32 w-32">
            <AvatarImage src={image || undefined} alt="Profile" />
            <AvatarFallback className="text-2xl">
              {customerId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {image && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            {image ? 'Change Photo' : 'Upload Photo'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {(address || city || state || zipCode) && (
        <AddressStreetView
          address={address}
          city={city}
          state={state}
          zipCode={zipCode}
          onAddressUpdate={onAddressUpdate}
        />
      )}
    </div>
  );
} 