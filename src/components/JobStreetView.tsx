import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';

interface JobStreetViewProps {
  location: [number, number]; // [lng, lat]
  height?: string;
  className?: string;
}

export function JobStreetView({
  location,
  height = "300px",
  className = "",
}: JobStreetViewProps) {
  const [streetViewUrl, setStreetViewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { apiKey, isLoading, error: apiKeyError } = useGoogleMapsApiKey();

  useEffect(() => {
    if (!location || location.length !== 2) {
      setError("Invalid location coordinates");
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

    const [lng, lat] = location;
    const coords = `${lat},${lng}`; // Note the order: lat,lng
    setStreetViewUrl(
      `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${coords}&heading=210&pitch=10&fov=90`
    );
    setError(null);
  }, [location, apiKey, apiKeyError]);

  if (isLoading) {
    return (
      <Card className={`w-full h-[${height}] ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
