import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';

interface ProfilePictureUploadProps {
  imageUrl: string;
  onImageUpdate?: (url: string) => void;
  className?: string;
}

export function ProfilePictureUpload({ imageUrl, onImageUpdate, className = "" }: ProfilePictureUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const { apiKey, isLoading, error: apiKeyError } = useGoogleMapsApiKey();

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    if (apiKeyError) {
      setError(apiKeyError);
      return;
    }

    setError(null);
  }, [apiKey, apiKeyError]);

  if (isLoading) {
    return (
      <Card className={`w-full h-[300px] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full h-[300px] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full h-[300px] ${className}`}>
      <CardContent className="p-0 h-full">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </CardContent>
    </Card>
  );
} 