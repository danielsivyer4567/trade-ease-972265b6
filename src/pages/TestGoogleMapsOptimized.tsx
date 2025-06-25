import React, { useEffect, useRef, useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';
import { loadGoogleMaps } from '@/services/google-maps-loader';

const TestGoogleMapsOptimized = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();

  useEffect(() => {
    if (!apiKey || isApiKeyLoading || !mapRef.current) return;

    const startTime = performance.now();
    
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps using optimized loader
        await loadGoogleMaps(apiKey);

        if (!mapRef.current) return;

        // Create map with performance settings
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: -28.0167, lng: 153.4000 },
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          clickableIcons: false,
          mapTypeId: 'roadmap',
        });

        // Add a test marker
        const marker = new window.google.maps.Marker({
          position: { lat: -28.0167, lng: 153.4000 },
          map,
          title: 'Gold Coast',
          animation: window.google.maps.Animation.DROP,
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: '<div style="padding: 8px;"><h3>Gold Coast</h3><p>Test marker with optimized loading</p></div>',
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        setMapInstance(map);
        const endTime = performance.now();
        setLoadTime(Math.round(endTime - startTime));
        setIsLoading(false);

      } catch (err) {
        console.error('Map initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
        setIsLoading(false);
      }
    };

    initMap();
  }, [apiKey, isApiKeyLoading]);

  const addRandomMarker = () => {
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const lat = sw.lat() + (ne.lat() - sw.lat()) * Math.random();
    const lng = sw.lng() + (ne.lng() - sw.lng()) * Math.random();

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance,
      title: `Random Marker ${Date.now()}`,
      animation: window.google.maps.Animation.DROP,
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div style="padding: 8px;"><p>Random marker at:<br/>Lat: ${lat.toFixed(4)}<br/>Lng: ${lng.toFixed(4)}</p></div>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(mapInstance, marker);
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Google Maps Performance Test</h1>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">API Key:</span>
                {isApiKeyLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : apiKey ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">{apiKey.substring(0, 10)}...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">Not configured</span>
                  </>
                )}
              </div>
              
              {loadTime && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Load Time:</span>
                  <span className={`text-sm ${loadTime < 1000 ? 'text-green-500' : loadTime < 2000 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {loadTime}ms
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="font-medium">Map Status:</span>
                {isLoading ? (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                ) : mapInstance ? (
                  <span className="text-sm text-green-500">Ready</span>
                ) : (
                  <span className="text-sm text-red-500">Not initialized</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {(error || apiKeyError) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || apiKeyError}
            </AlertDescription>
          </Alert>
        )}

        {/* Map Container */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Map View</CardTitle>
              <Button 
                onClick={addRandomMarker} 
                disabled={!mapInstance || isLoading}
                size="sm"
              >
                Add Random Marker
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
                  </div>
                </div>
              )}
              <div 
                ref={mapRef} 
                className="map-container rounded-b-lg"
                style={{ height: '500px' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Optimizations Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Using singleton Google Maps loader with caching</li>
              <li>Optimized map settings (disabled clickable icons)</li>
              <li>Proper CSS for map container to prevent layout shifts</li>
              <li>Environment variable API key with fallback to database</li>
              <li>Async loading with proper error handling</li>
              <li>Performance timing measurement</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TestGoogleMapsOptimized; 