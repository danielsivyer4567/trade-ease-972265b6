import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, InfoWindow, LoadScriptProps, Polyline } from '@react-google-maps/api';
import { MapPin, AlertCircle, Pencil, X, Ruler, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { GOOGLE_MAPS_CONFIG, validateGoogleMapsApiKey, getSafeApiKey, getMapId } from "@/config/google-maps";
import { useGoogleMapsApiKey } from '@/hooks/useGoogleMapsApiKey';

// Define types for locations and map properties
type Location = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  jobNumber: string;
  jobTitle: string;
  customer: string;
  status: Job['status'];
  locationLabel?: string;
};

// Map view state type
interface MapViewState {
  zoom: number;
  tilt: number;
  center: google.maps.LatLngLiteral;
}

// Define libraries to load OUTSIDE of the component
// This prevents the array from being recreated on each render
const mapLibraries = ["marker", "geometry"] as ["marker", "geometry"];

// Google Maps API key - defined once outside component
// Use the validateGoogleMapsApiKey function to check if API key is valid
const isApiKeyValid = validateGoogleMapsApiKey();
let GOOGLE_MAPS_API_KEY = '';

// Only set the API key if it's valid to prevent errors
try {
  GOOGLE_MAPS_API_KEY = isApiKeyValid ? getSafeApiKey() : '';
  // Log the API key (partial) for debugging
  console.log("Google Maps API Key loaded:", GOOGLE_MAPS_API_KEY ? `${GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : "NOT LOADED");
} catch (error) {
  console.error("Failed to get Google Maps API key:", error);
}

// Default map center - Gold Coast coordinates
const DEFAULT_CENTER = {
  lat: -28.017112731933594,
  lng: 153.4014129638672
};

// Default map options
const DEFAULT_MAP_OPTIONS = {
  tilt: 45,
  zoom: 13,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapId: getMapId(),
  mapTypeId: 'satellite'  // Set satellite as default
};

// Default map container style
const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
  position: 'relative' as 'relative',
  border: '4px solid black'
};

// Use React.memo to prevent unnecessary rerenders
const JobSiteMap = memo(() => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [measurementPath, setMeasurementPath] = useState<Array<{lat: number, lng: number}>>([]);
  const [measurementDistance, setMeasurementDistance] = useState<number>(0);
  const [mapViewState, setMapViewState] = useState<MapViewState | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [preventAutoZoom, setPreventAutoZoom] = useState(false);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const viewChangeListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const isUserInteracting = useRef<boolean>(false);
  const userControlledZoom = useRef<number | null>(null);
  const zoomChangeTimeout = useRef<NodeJS.Timeout | null>(null);
  const initialFitDone = useRef<boolean>(false);
  const mapListeners = useRef<google.maps.MapsEventListener[]>([]);
  
  // Keep a stable reference to prevent script reloading issues
  const loadScriptRef = useRef<any>(null);

  // Add the hook
  const { apiKey, isLoading: isApiKeyLoading, error: apiKeyError } = useGoogleMapsApiKey();

  // Update the API key validation
  const isApiKeyValid = apiKey && apiKey.startsWith('AIzaSy');

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('jobs').select('*');
        if (error) {
          console.error("Failed to fetch jobs:", error);
        } else {
          setJobs(data || []);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Process jobs into locations for the map
  const extractLocations = useCallback((): Location[] => {
    if (jobs.length === 0) {
      // Return empty array instead of mockup data
      return [];
    }

    // Extract all job locations
    const locations: Location[] = [];

    jobs.forEach(job => {
      // Process locations array if available
      if (job.locations && job.locations.length > 0) {
        job.locations.forEach((location, index) => {
          if (location.coordinates && location.coordinates[0] && location.coordinates[1]) {
            locations.push({
              id: `${job.id}-loc-${index}`,
              name: job.title || `Job ${job.jobNumber}`,
              lat: location.coordinates[1],
              lng: location.coordinates[0],
              type: job.type || "Job",
              jobNumber: job.jobNumber || "N/A",
              jobTitle: job.title || "Unnamed Job",
              customer: job.customer || "N/A",
              status: job.status,
              locationLabel: location.label || (index === 0 ? "Primary" : `Location ${index + 1}`)
            });
          }
        });
      } 
      // Fallback to legacy location field
      else if (job.location && job.location[0] && job.location[1]) {
        locations.push({
          id: job.id,
          name: job.title || `Job ${job.jobNumber}`,
          lat: job.location[1],
          lng: job.location[0],
          type: job.type || "Job",
          jobNumber: job.jobNumber || "N/A",
          jobTitle: job.title || "Unnamed Job",
          customer: job.customer || "N/A",
          status: job.status
        });
      }
    });

    return locations;
  }, [jobs]);
  
  const locations = extractLocations();

  // Clean up map listeners when component unmounts
  useEffect(() => {
    return () => {
      // Clean up all listeners when component unmounts
      mapListeners.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      mapListeners.current = [];
    };
  }, []);

  // Track map view changes, but only when map becomes idle after user interaction
  useEffect(() => {
    if (!mapInstance) return;
    
    // Clean up any existing listeners first
    mapListeners.current.forEach(listener => {
      google.maps.event.removeListener(listener);
    });
    mapListeners.current = [];
    
    // Record initial map state when first loaded (but only once)
    if (!mapViewState) {
      const initialState = {
        zoom: mapInstance.getZoom() || DEFAULT_MAP_OPTIONS.zoom,
        tilt: mapInstance.getTilt() || DEFAULT_MAP_OPTIONS.tilt,
        center: {
          lat: mapInstance.getCenter()?.lat() || DEFAULT_CENTER.lat,
          lng: mapInstance.getCenter()?.lng() || DEFAULT_CENTER.lng
        }
      };
      setMapViewState(initialState);
      console.log("Recorded initial map state:", initialState);
    }
    
    // Set up user interaction detection
    const dragStartListener = mapInstance.addListener('dragstart', () => {
      isUserInteracting.current = true;
      setPreventAutoZoom(true); // Prevent auto-zoom after user starts dragging
    });
    mapListeners.current.push(dragStartListener);
    
    // Improved zoom change handling with throttling to prevent zoom oscillation
    const zoomChangedListener = mapInstance.addListener('zoom_changed', () => {
      isUserInteracting.current = true;
      setPreventAutoZoom(true); // Prevent auto-zoom after user changes zoom
      
      // Store the current zoom level as user controlled
      userControlledZoom.current = mapInstance.getZoom();
      
      // Clear any existing timeout to prevent multiple rapid updates
      if (zoomChangeTimeout.current) {
        clearTimeout(zoomChangeTimeout.current);
      }
      
      // Update the map view state after a delay to avoid multiple updates
      zoomChangeTimeout.current = setTimeout(() => {
        if (mapInstance) {
          setMapViewState(prev => ({
            ...prev!,
            zoom: mapInstance.getZoom() || prev!.zoom,
            center: {
              lat: mapInstance.getCenter()?.lat() || prev!.center.lat,
              lng: mapInstance.getCenter()?.lng() || prev!.center.lng
            }
          }));
        }
      }, 300);
    });
    mapListeners.current.push(zoomChangedListener);
    
    // Add listener to track map view state changes only when map becomes idle after user interaction
    const idleListener = mapInstance.addListener('idle', () => {
      if (!mapInstance) return;
      
      if (isUserInteracting.current) {
        // User just finished interacting with the map, save the new state
        setMapViewState({
          zoom: mapInstance.getZoom() || DEFAULT_MAP_OPTIONS.zoom,
          tilt: mapInstance.getTilt() || DEFAULT_MAP_OPTIONS.tilt,
          center: {
            lat: mapInstance.getCenter()?.lat() || DEFAULT_CENTER.lat,
            lng: mapInstance.getCenter()?.lng() || DEFAULT_CENTER.lng
          }
        });
        
        isUserInteracting.current = false;
      }
    });
    mapListeners.current.push(idleListener);
    
    return () => {
      // Clean up listeners when dependencies change
      mapListeners.current.forEach(listener => {
        google.maps.event.removeListener(listener);
      });
      mapListeners.current = [];
    };
  }, [mapInstance, mapViewState]);
  
  // Define handleMapLoad using useCallback to prevent recreation on re-renders
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    console.log("Map loaded");
    setMapInstance(mapInstance);
    
    // Only auto-fit to locations if we haven't done so yet or if user hasn't interacted
    if (locations.length > 0 && (!initialFitDone.current || !preventAutoZoom)) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      
      mapInstance.fitBounds(bounds);
      
      // Set minimum and maximum zoom levels to prevent extreme zoom levels
      const listener = mapInstance.addListener('idle', () => {
        if (mapInstance.getZoom() > 17) {
          mapInstance.setZoom(17);
        } else if (mapInstance.getZoom() < 8 && locations.length < 5) {
          mapInstance.setZoom(12);
        }
        
        // Remove the listener after first bounds_changed event
        google.maps.event.removeListener(listener);
        initialFitDone.current = true;
      });
    }
    // Otherwise, restore the previous state if available
    else if (mapViewState) {
      mapInstance.setZoom(mapViewState.zoom);
      mapInstance.setCenter(mapViewState.center);
      mapInstance.setTilt(mapViewState.tilt);
    }
    
    // If the component is in drawing mode, configure the listeners
    if (drawingMode) {
      configureDrawingListeners(mapInstance);
    }
  }, [locations, preventAutoZoom, mapViewState, drawingMode]);
  
  // Define the configureDrawingListeners function using useCallback
  const configureDrawingListeners = useCallback((mapInstance: google.maps.Map) => {
    // Remove any existing listener
    if (listenerRef.current) {
      google.maps.event.removeListener(listenerRef.current);
      listenerRef.current = null;
    }
    
    // Add click listener for drawing mode
    if (drawingMode) {
      listenerRef.current = mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        
        const newPoint = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        
        setMeasurementPath(prevPath => {
          const newPath = [...prevPath, newPoint];
          
          // Calculate total distance
          let totalDistance = 0;
          for (let i = 1; i < newPath.length; i++) {
            const p1 = new google.maps.LatLng(newPath[i-1].lat, newPath[i-1].lng);
            const p2 = new google.maps.LatLng(newPath[i].lat, newPath[i].lng);
            totalDistance += google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
          }
          
          setMeasurementDistance(totalDistance);
          return newPath;
        });
      });
    }
  }, [drawingMode]);
  
  // Update the error handling
  const handleLoadError = useCallback((error: Error) => {
    console.error("Error loading Google Maps:", error);
    console.error("API Key present:", !!apiKey);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check for specific error types
    let specificError = "Failed to load Google Maps. ";
    
    if (error.message?.includes('RefererNotAllowedMapError')) {
      specificError += "API key referrer restrictions issue. Please check Google Cloud Console.";
    } else if (error.message?.includes('ApiNotActivatedMapError')) {
      specificError += "Maps JavaScript API is not activated. Please enable it in Google Cloud Console.";
    } else if (error.message?.includes('InvalidKeyMapError')) {
      specificError += "Invalid API key. Please check your API key configuration.";
    } else if (error.message?.includes('OverQuotaMapError')) {
      specificError += "API quota exceeded. Please check your Google Cloud billing.";
    } else if (!apiKey) {
      specificError += "API key not configured. Please add your Google Maps API key in settings.";
    } else {
      specificError += "Please check browser console for details.";
    }
    
    setMapError(specificError);
  }, [apiKey]);
  
  // Format distance for display
  const formatDistance = useCallback((meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(1)} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  }, []);
  
  // Toggle drawing mode
  const toggleDrawingMode = useCallback(() => {
    setDrawingMode(prev => !prev);
    if (!drawingMode) {
      // Entering drawing mode
      setMeasurementPath([]);
      setMeasurementDistance(0);
      if (mapInstance) {
        configureDrawingListeners(mapInstance);
      }
    } else {
      // Exiting drawing mode
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
    }
  }, [drawingMode, mapInstance, configureDrawingListeners]);
  
  // Clear measurement
  const clearMeasurement = useCallback(() => {
    setMeasurementPath([]);
    setMeasurementDistance(0);
  }, []);

  // Options for the measurement line
  const polylineOptions = {
    strokeColor: "#FF5722",
    strokeOpacity: 1,
    strokeWeight: 3,
    zIndex: 2
  };

  // Update the loading state check
  if (isApiKeyLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Update the error state check
  if (apiKeyError || !isApiKeyValid) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900">API Key Missing</h3>
          <p className="mt-1 text-sm text-gray-500">
            Google Maps API key is not configured or invalid. Please add a valid key in settings.
          </p>
          <div className="mt-3">
            <Button 
              onClick={() => window.open('/settings', '_blank')} 
              className="w-full"
              size="sm"
            >
              Go to Settings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full h-full p-0 overflow-hidden">
      {/* Display measurement result if needed above the map */}
      {measurementDistance > 0 && (
        <div className="p-2 bg-secondary/20 rounded-md text-sm m-2">
          <p className="font-medium">Measured distance: {formatDistance(measurementDistance)}</p>
          {drawingMode && <p className="text-xs text-muted-foreground">Continue clicking to add more points or click "Stop Measuring" when done.</p>}
        </div>
      )}
      
      <div className="relative h-full">
        {/* Title overlay */}
        <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-md text-white font-semibold shadow-lg">
          <h2 className="text-lg">Job Site Map</h2>
        </div>
        
        {/* Map control buttons - positioned on the left side below the title */}
        <div className="absolute top-14 left-3 z-10 flex gap-2">
          <Button 
            variant={drawingMode ? "secondary" : "default"}
            size="sm"
            onClick={toggleDrawingMode}
            className="flex items-center gap-1 shadow-md bg-white/90 text-black hover:bg-white/100"
          >
            <Ruler className="h-4 w-4" />
            <span>{drawingMode ? "Stop Measuring" : "Measure"}</span>
          </Button>
          
          {measurementPath.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearMeasurement}
              className="flex items-center gap-1 shadow-md bg-white/90 text-black hover:bg-white/100"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          )}
          
          {/* Reset map view button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!mapInstance) return;
              
              // Reset to show all markers
              if (locations.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                locations.forEach(location => {
                  bounds.extend({ lat: location.lat, lng: location.lng });
                });
                mapInstance.fitBounds(bounds);
                
                // Don't zoom in too much for single markers
                if (locations.length === 1) {
                  setTimeout(() => {
                    if (mapInstance.getZoom() > 15) mapInstance.setZoom(15);
                  }, 100);
                }
              } else {
                // Reset to default view
                mapInstance.setZoom(DEFAULT_MAP_OPTIONS.zoom);
                mapInstance.setCenter(DEFAULT_CENTER);
              }
              
              toast.success("Map view reset");
            }}
            className="flex items-center gap-1 shadow-md bg-white/90 text-black hover:bg-white/100"
          >
            <span>Reset View</span>
          </Button>
        </div>
        
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/90 rounded-lg">
            <div className="text-center p-4 max-w-md">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">Map Error</h3>
              <p className="mt-1 text-sm text-gray-500">{mapError}</p>
              
              <div className="mt-3 flex gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="flex-1"
                  size="sm"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => window.open('/debug-maps', '_blank')} 
                  className="flex-1"
                  size="sm"
                  variant="outline"
                >
                  Run Diagnostics
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!isApiKeyValid ? (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/90 rounded-lg">
            <div className="text-center p-4 max-w-md">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">API Key Missing</h3>
              <p className="mt-1 text-sm text-gray-500">
                Google Maps API key is not configured or invalid. Please add a valid key to your .env file.
              </p>
              <div className="mt-3">
                <Button 
                  onClick={() => window.open('/debug-maps', '_blank')} 
                  className="w-full"
                  size="sm"
                >
                  Go to Maps Diagnostic Page
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <LoadScript 
            googleMapsApiKey={apiKey} 
            libraries={mapLibraries}
            version="weekly"
            onError={handleLoadError}
            mapIds={[getMapId()]}
            onLoad={() => {
              console.log("Google Maps script loaded successfully");
              // Check if google.maps is available
              if ((window as any).google && (window as any).google.maps) {
                console.log("Google Maps API is available");
              } else {
                console.error("Google Maps API not available after script load");
                setMapError("Google Maps API not available after script load. Please check the console for details.");
              }
            }}
            loadingElement={<div className="h-full w-full flex items-center justify-center">Loading Maps...</div>}
            id="google-map-script"
            preventGoogleFontsLoading={false}
          >
            <GoogleMap 
              mapContainerStyle={MAP_CONTAINER_STYLE} 
              center={mapViewState?.center || DEFAULT_CENTER} 
              zoom={mapViewState?.zoom || DEFAULT_MAP_OPTIONS.zoom} 
              options={{
                ...DEFAULT_MAP_OPTIONS,
                tilt: mapViewState?.tilt || DEFAULT_MAP_OPTIONS.tilt
              }}
              onLoad={handleMapLoad}
            >
              {selectedLocation && (
                <InfoWindow
                  position={{
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng
                  }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <div className="p-2 max-w-[250px]">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{selectedLocation.jobTitle}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100">
                        {selectedLocation.status === 'ready' && 'Ready'}
                        {selectedLocation.status === 'in-progress' && 'In Progress'}
                        {selectedLocation.status === 'to-invoice' && 'To Invoice'}
                        {selectedLocation.status === 'invoiced' && 'Invoiced'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">#{selectedLocation.jobNumber}</p>
                    <p className="text-gray-700 text-sm">{selectedLocation.customer}</p>
                    {selectedLocation.locationLabel && (
                      <p className="text-blue-600 text-xs font-medium mt-1">{selectedLocation.locationLabel}</p>
                    )}
                    <div className="mt-2">
                      <Button 
                        className="w-full text-sm mt-1" 
                        size="sm"
                        onClick={() => navigate(`/jobs/${selectedLocation.id.split('-')[0]}`)}
                      >
                        View Job Details
                      </Button>
                    </div>
                  </div>
                </InfoWindow>
              )}
              
              {/* Render measurement line */}
              {measurementPath.length > 1 && (
                <Polyline
                  path={measurementPath}
                  options={polylineOptions}
                />
              )}
              
              {/* Render measurement points */}
              {measurementPath.map((point, index) => (
                <Marker
                  key={`measure-point-${index}`}
                  position={point}
                  label={index === 0 ? 'Start' : index === measurementPath.length - 1 ? 'End' : `${index}`}
                />
              ))}
              
            </GoogleMap>
          </LoadScript>
        )}
      </div>
    </Card>
  );
});

// Standard Marker component for measurement points
const Marker = ({ position, label }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        whiteSpace: 'nowrap'
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#FF5722',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      />
      {label && (
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            position: 'absolute',
            top: '-24px',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default JobSiteMap;
