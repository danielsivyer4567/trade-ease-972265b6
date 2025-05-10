import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, X } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
      </div>

      {/* Always show Street View if address components are available */}
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