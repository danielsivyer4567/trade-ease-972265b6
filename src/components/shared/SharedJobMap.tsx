import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, InfoWindow } from '@react-google-maps/api';
import type { Job } from '@/types/job';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { GOOGLE_MAPS_CONFIG, getMapId } from '@/config/google-maps';
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';
import { toast } from 'sonner';

// Define libraries to load
const libraries = ["marker"] as ["marker"];

interface SharedJobMapProps {
  jobs: Job[];
  height?: string;
  showStreetView?: boolean;
  onJobClick?: (job: Job) => void;
}

const SharedJobMap = ({ 
  jobs, 
  height = '400px',
  showStreetView = false,
  onJobClick 
}: SharedJobMapProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Add the hook for API key management
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();

  // Process jobs to extract locations
  const locationMarkers = jobs.reduce<Array<{
    coordinates: [number, number];
    job: Job;
    label?: string;
  }>>((markers, job) => {
    // Add markers from the new locations array if available
    if (job.locations && job.locations.length > 0) {
      job.locations.forEach(location => {
        if (location.coordinates && location.coordinates[0] && location.coordinates[1]) {
          markers.push({
            coordinates: location.coordinates,
            job,
            label: location.label || location.address
          });
        }
      });
    } 
    // Fallback to legacy location if no locations array
    else if (job.location && job.location[0] && job.location[1]) {
      markers.push({
        coordinates: job.location,
        job,
        label: job.address || 'Primary'
      });
    }
    return markers;
  }, []);

  // Default map center - Gold Coast coordinates
  const DEFAULT_CENTER = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };

  // Default map options
  const DEFAULT_MAP_OPTIONS = {
    tilt: 45,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: showStreetView,
    fullscreenControl: true,
    mapTypeId: 'satellite',
    mapId: getMapId()
  };

  // Map container style
  const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem',
    position: 'relative' as 'relative'
  };

  // Handle map loading errors
  const handleMapError = (error: Error) => {
    console.error('Map loading error:', error);
    setMapError(error.message);
    toast.error('Failed to load Google Maps. Please check your internet connection and try again.');
  };

  // Handle script loading errors
  const handleScriptError = (error: Error) => {
    console.error('Script loading error:', error);
    setMapError('Failed to load Google Maps script. Please check your internet connection and try again.');
    toast.error('Failed to load Google Maps script. Please check your internet connection and try again.');
  };

  // Show loading state or error message
  if (isApiKeyLoading) {
    return (
      <Card className="p-4 flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading map...</p>
        </div>
      </Card>
    );
  }

  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    return (
      <Card className="p-4 flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="h-8 w-8" />
          <p>Google Maps API key is not configured or invalid</p>
          <p className="text-sm text-gray-500">Please check your environment variables or contact support</p>
        </div>
      </Card>
    );
  }

  if (mapError) {
    return (
      <Card className="p-4 flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center gap-2 text-red-500">
          <AlertCircle className="h-8 w-8" />
          <p>{mapError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 relative" style={{ height }}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        onError={handleScriptError}
      >
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_MAP_OPTIONS.zoom}
          options={DEFAULT_MAP_OPTIONS}
          onLoad={(map) => {
            console.log('Map loaded successfully');
            setMapInstance(map);
            setMapError(null);
            setLoading(false);

            // Fit map to markers if we have any
            if (locationMarkers.length > 0) {
              const bounds = new google.maps.LatLngBounds();
              locationMarkers.forEach(marker => {
                bounds.extend({ lat: marker.coordinates[1], lng: marker.coordinates[0] });
              });
              map.fitBounds(bounds);

              // Don't zoom in too much for single markers
              if (locationMarkers.length === 1) {
                setTimeout(() => {
                  if (map.getZoom() > 15) map.setZoom(15);
                }, 100);
              }
            }

            // Create markers after map is loaded
            locationMarkers.forEach((marker) => {
              const { coordinates, job, label } = marker;
              
              // Create marker element
              const markerElement = document.createElement('div');
              markerElement.className = 'marker';
              markerElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; background: transparent; padding: 0; margin: 0;">
                  <img src='/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png' alt='Trade Ease Logo' width='16' height='16' style='object-fit: contain; display: block; margin-bottom: 2px;' />
                  <span style="color: #fff; font-weight: bold; font-size: 10px; line-height: 1; text-align: center;">${job.jobNumber || 'N/A'}</span>
                </div>
              `;

              try {
                // Create the advanced marker
                const marker = new google.maps.marker.AdvancedMarkerElement({
                  position: { lat: coordinates[1], lng: coordinates[0] },
                  map: map,
                  content: markerElement,
                  title: job.customer,
                  zIndex: 1000
                });

                // Add click listener
                marker.addListener('gmp-click', () => {
                  setSelectedJob(job);
                  if (onJobClick) {
                    onJobClick(job);
                  }
                });
              } catch (error) {
                console.error("Error creating advanced marker, falling back to standard marker:", error);
                
                // Fallback to standard marker
                const standardMarker = new google.maps.Marker({
                  position: { lat: coordinates[1], lng: coordinates[0] },
                  map: map,
                  title: job.customer,
                  zIndex: 1000
                });
                
                standardMarker.addListener('click', () => {
                  setSelectedJob(job);
                  if (onJobClick) {
                    onJobClick(job);
                  }
                });
              }
            });
          }}
        >
          {selectedJob && (
            <InfoWindow
              position={{
                lat: selectedJob.location?.[1] || selectedJob.locations?.[0]?.coordinates[1] || DEFAULT_CENTER.lat,
                lng: selectedJob.location?.[0] || selectedJob.locations?.[0]?.coordinates[0] || DEFAULT_CENTER.lng
              }}
              onCloseClick={() => setSelectedJob(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedJob.title || `Job #${selectedJob.jobNumber}`}</h3>
                <p className="text-sm text-gray-600">{selectedJob.customer}</p>
                {selectedJob.address && (
                  <p className="text-sm text-gray-500 mt-1">{selectedJob.address}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SharedJobMap; 