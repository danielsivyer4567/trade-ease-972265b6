import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  customerId: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  onAddressUpdate?: (address: string) => void;
  className?: string;
}

export function ProfilePictureUpload({
  customerId,
  address = '',
  city = '',
  state = '',
  zipCode = '',
  onAddressUpdate,
  className = ''
}: ProfilePictureUploadProps) {
  const [streetViewUrl, setStreetViewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Google Maps API key - should be moved to environment variables
  const API_KEY = "AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw";

  const generateStreetViewUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    // Optimized parameters for a better property view
    return `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${encodedLocation}&key=${API_KEY}&pitch=0&fov=90&heading=0&source=outdoor`;
  };

  const updateStreetView = async (location: string) => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    try {
      // First, verify the address using Geocoding API
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status === 'OK') {
        const formattedAddress = geocodeData.results[0].formatted_address;
        const streetViewUrl = generateStreetViewUrl(formattedAddress);
        
        // Verify if Street View is available
        const streetViewResponse = await fetch(streetViewUrl);
        if (streetViewResponse.ok) {
          setStreetViewUrl(streetViewUrl);
          if (onAddressUpdate) {
            onAddressUpdate(formattedAddress);
          }
        } else {
          throw new Error('Street View not available for this location');
        }
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find Street View for this address",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load Street View immediately when component mounts or address changes
  useEffect(() => {
    const fullAddress = `${address}, ${city}, ${state} ${zipCode}`.trim();
    if (fullAddress) {
      updateStreetView(fullAddress);
    }
  }, [address, city, state, zipCode]);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className="h-32 w-32">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <MapPin className="h-8 w-8 animate-pulse text-primary" />
            </div>
          ) : streetViewUrl ? (
            <AvatarImage 
              src={streetViewUrl} 
              alt="Property Street View" 
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="text-2xl">
              {customerId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        <p className="font-medium">Property Address:</p>
        <p>{address}, {city}, {state} {zipCode}</p>
      </div>
    </div>
  );
} 