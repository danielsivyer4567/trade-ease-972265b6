import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';

interface JobStreetViewProps {
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  height?: string;
  className?: string;
}

export function JobStreetView({ address, city, state, zipCode, height = "300px", className = "" }: JobStreetViewProps) {
  const [streetViewUrl, setStreetViewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { apiKey, isLoading, error: apiKeyError } = useGoogleMapsApiKey();

  useEffect(() => {
    if (!address) {
      setError("No address provided");
      return;
    }

    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    if (apiKeyError) {
      setError(apiKeyError);
      return;
    }

    try {
      const formattedAddress = encodeURIComponent([address, city, state, zipCode].filter(Boolean).join(", "));
      setStreetViewUrl(`https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${formattedAddress}&heading=210&pitch=10&fov=90`);
      setError(null);
    } catch (err) {
      setError("Failed to generate Street View URL");
    }
  }, [address, city, state, zipCode, apiKey, apiKeyError]);

  if (isLoading) {
    return (
      <Card className={`w-full h-[${height}] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full h-[${height}] ${className}`}>
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
    <Card className={`w-full h-[${height}] ${className}`}>
      <CardContent className="p-0 h-full">
        <iframe
          src={streetViewUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </CardContent>
    </Card>
  );
} 