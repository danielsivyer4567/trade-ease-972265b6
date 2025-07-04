import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGoogleMapsApiKey } from "@/hooks/useGoogleMapsApiKey";
import { loadGoogleMaps } from "@/services/google-maps-loader";
import type { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

interface SharedJobMapProps {
  jobs: Job[];
  height?: string;
  showStreetView?: boolean;
  onJobClick?: (job: Job) => void;
}

// Declare google maps types
declare global {
  interface Window {
    google: any;
  }
}

const SharedJobMap: React.FC<SharedJobMapProps> = ({ 
  jobs, 
  height = "500px",
  showStreetView = false,
  onJobClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();

  // Initialize map with performance optimizations
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !apiKey) {
      setIsLoading(false);
      return;
    }

    try {
      // Load Google Maps using the optimized loader
      await loadGoogleMaps(apiKey);

      // Check if component is still mounted
      if (!mapRef.current) return;

      // Create map instance with optimized settings
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -28.0167, lng: 153.4000 },
        zoom: 10,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: showStreetView,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        // Performance optimizations
        clickableIcons: false,
        disableDefaultUI: false,
        mapTypeId: 'roadmap',
      });

      mapInstanceRef.current = map;
      
      // Create info window
      infoWindowRef.current = new window.google.maps.InfoWindow();

      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];

      // Get valid job locations
      const validJobs = jobs.filter(job => 
        (job.location && Array.isArray(job.location) && job.location.length === 2) ||
        (job.locations && Array.isArray(job.locations) && job.locations.length > 0)
      );

      if (validJobs.length === 0) {
        setIsLoading(false);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();

      // Add markers for each job with clustering for performance
      validJobs.forEach(job => {
        if (job.location && Array.isArray(job.location) && job.location.length === 2) {
          const position = { lat: job.location[0], lng: job.location[1] };
          const marker = new window.google.maps.Marker({
            position,
            map,
            title: job.customer,
            optimized: true,
            animation: null, // Disable animation for better performance
          });

          bounds.extend(position);
          markersRef.current.push(marker);

          // Use event delegation for better performance
          marker.addListener('click', () => {
            const content = `
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="font-weight: 600; margin: 0 0 4px 0;">${job.customer}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">${job.title || ''}</p>
                ${job.address ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">${job.address}</p>` : ''}
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">Job #${job.jobNumber}</p>
              </div>
            `;
            infoWindowRef.current?.setContent(content);
            infoWindowRef.current?.open(map, marker);
            
            if (onJobClick) {
              onJobClick(job);
            }
          });
        }
      });

      // Fit map to bounds with animation
      if (markersRef.current.length > 0) {
        map.fitBounds(bounds);
        
        // Don't zoom in too much for single markers
        if (markersRef.current.length === 1) {
          window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            const currentZoom = map.getZoom();
            if (currentZoom && currentZoom > 15) {
              map.setZoom(15);
            }
          });
        }
      }

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
      setIsLoading(false);
    }
  }, [jobs, showStreetView, onJobClick, apiKey]);

  // Load map when API key is available
  useEffect(() => {
    if (apiKey && !isApiKeyLoading && mapRef.current) {
      initializeMap();
    }
  }, [apiKey, isApiKeyLoading, initializeMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];

      // Clean up info window
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }

      // Clean up map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Loading state
  if (isApiKeyLoading) {
    return (
      <div className="flex items-center justify-center map-loading-container" style={{ height }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading map configuration...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiKeyError || !apiKey) {
    return (
      <Card className="p-6" style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Configuration Error</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            {apiKeyError || "Google Maps API key is not configured. Please add your API key to continue."}
          </p>
        </div>
      </Card>
    );
  }

  // Map error state
  if (error) {
    return (
      <Card className="p-6" style={{ height }}>
        <div className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="text-sm text-gray-600 text-center mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%' }}
        className="map-container"
      />
    </div>
  );
};

export default SharedJobMap; 