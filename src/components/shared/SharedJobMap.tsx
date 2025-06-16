import React, { useEffect, useRef, useState, useCallback } from "react";
import { useGoogleMapsApiKey } from "@/hooks/useGoogleMapsApiKey";
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
    initMap?: () => void;
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

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    try {
      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -28.0167, lng: 153.4000 },
        zoom: 10,
        mapTypeControl: true,
        streetViewControl: showStreetView,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      });

      mapInstanceRef.current = map;
      
      // Create info window
      infoWindowRef.current = new window.google.maps.InfoWindow();

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
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

      // Add markers for each job
      validJobs.forEach(job => {
        if (job.location && Array.isArray(job.location) && job.location.length === 2) {
          const position = { lat: job.location[0], lng: job.location[1] };
          const marker = new window.google.maps.Marker({
            position,
            map,
            title: job.customer,
            optimized: true,
          });

          bounds.extend(position);
          markersRef.current.push(marker);

          marker.addListener('click', () => {
            const content = `
              <div style="padding: 8px;">
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

      // Fit map to bounds
      if (markersRef.current.length > 0) {
        map.fitBounds(bounds);
        
        // Don't zoom in too much for single markers
        if (markersRef.current.length === 1) {
          window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() > 15) {
              map.setZoom(15);
            }
          });
        }
      }

      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  }, [jobs, showStreetView, onJobClick]);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey || isApiKeyLoading) return;

    // Check if script is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Set up callback
    window.initMap = () => {
      initializeMap();
    };

    // Handle script errors
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initMap;
    };
  }, [apiKey, isApiKeyLoading, initializeMap]);

  // Update markers when jobs change
  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      initializeMap();
    }
  }, [jobs, initializeMap]);

  // Loading state
  if (isApiKeyLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
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
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default SharedJobMap; 