import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddressStreetViewProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  onAddressUpdate?: (address: string) => void;
  className?: string;
}

export function AddressStreetView({ 
  address, 
  city, 
  state, 
  zipCode,
  onAddressUpdate,
  className = ''
}: AddressStreetViewProps) {
  const [streetViewUrl, setStreetViewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Google Maps API key - should be moved to environment variables
  const API_KEY = "AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY";

  const generateStreetViewUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    // Changed dimensions to be more rectangular (600x400)
    return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodedLocation}&key=${API_KEY}&pitch=10&fov=90`;
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
        setStreetViewUrl(streetViewUrl);
        
        if (onAddressUpdate) {
          onAddressUpdate(formattedAddress);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      updateStreetView(searchQuery);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : streetViewUrl ? (
          <img
            src={streetViewUrl}
            alt="Street View"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8 mb-2" />
            <p>No Street View available</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a different address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Current Address:</p>
        <p>{address}, {city}, {state} {zipCode}</p>
      </div>
    </div>
  );
} 