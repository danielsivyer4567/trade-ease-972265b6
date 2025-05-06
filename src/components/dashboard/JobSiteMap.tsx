import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, InfoWindow, LoadScriptProps, Polyline } from '@react-google-maps/api';
import { MapPin, AlertCircle, Pencil, X, Ruler } from "lucide-react";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

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

const JobSiteMap = () => {
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

  // Gold Coast coordinates
  const center = {
    lat: -28.017112731933594,
    lng: 153.4014129638672
  };
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
    position: 'relative' as 'relative',
    border: '4px solid black'
  };
  const mapOptions = {
    mapTypeId: 'satellite',
    tilt: 45,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: true,
    fullscreenControl: true,
    mapId: '8f348c1e276da9d5'
  };

  // Process jobs into locations for the map
  const extractLocations = (): Location[] => {
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
  };
  
  const locations = extractLocations();

  // Track map view changes, but only when map becomes idle after user interaction
  useEffect(() => {
    if (!mapInstance) return;
    
    // Set up user interaction detection
    const dragStartListener = mapInstance.addListener('dragstart', () => {
      isUserInteracting.current = true;
      setPreventAutoZoom(true);
    });
    
    // Improved zoom change handling with throttling to prevent zoom oscillation
    const zoomChangedListener = mapInstance.addListener('zoom_changed', () => {
      isUserInteracting.current = true;
      setPreventAutoZoom(true);
      
      // Store the current zoom level as user controlled
      userControlledZoom.current = mapInstance.getZoom();
      
      // Clear any existing timeout to prevent multiple rapid updates
      if (zoomChangeTimeout.current) {
        clearTimeout(zoomChangeTimeout.current);
      }
    });
    
    // Add listener to track map view state changes only when map becomes idle after user interaction
    viewChangeListenerRef.current = mapInstance.addListener('idle', () => {
      if (!mapInstance) return;
      
      // Only update the state if this was triggered by a user interaction
      if (isUserInteracting.current) {
        // Small delay to ensure the zoom operation has fully completed
        zoomChangeTimeout.current = setTimeout(() => {
          const currentZoom = mapInstance.getZoom();
          
          setMapViewState({
            zoom: currentZoom || mapOptions.zoom,
            tilt: mapInstance.getTilt() || mapOptions.tilt,
            center: {
              lat: mapInstance.getCenter()?.lat() || center.lat,
              lng: mapInstance.getCenter()?.lng() || center.lng
            }
          });
          
          // Reset the interaction flag
          isUserInteracting.current = false;
        }, 100); // Short delay to ensure zoom is settled
      }
    });
    
    return () => {
      if (viewChangeListenerRef.current) {
        google.maps.event.removeListener(viewChangeListenerRef.current);
      }
      google.maps.event.removeListener(dragStartListener);
      google.maps.event.removeListener(zoomChangedListener);
      if (zoomChangeTimeout.current) {
        clearTimeout(zoomChangeTimeout.current);
      }
    };
  }, [mapInstance]);

  // Handle cleanup of map click listener
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
      }
    };
  }, []);

  // Effect to update measurement mode
  useEffect(() => {
    if (!mapInstance) return;
    
    if (drawingMode) {
      // Set cursor and add click listener when drawing mode is active
      mapInstance.setOptions({ draggableCursor: 'crosshair' });
      
      listenerRef.current = mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const newPoint = { 
            lat: e.latLng.lat(), 
            lng: e.latLng.lng() 
          };
          
          setMeasurementPath(prev => {
            const newPath = [...prev, newPoint];
            
            // Calculate distance if we have at least 2 points
            if (newPath.length >= 2) {
              let totalDistance = 0;
              
              for (let i = 1; i < newPath.length; i++) {
                const p1 = new google.maps.LatLng(newPath[i-1].lat, newPath[i-1].lng);
                const p2 = new google.maps.LatLng(newPath[i].lat, newPath[i].lng);
                
                totalDistance += google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
              }
              
              setMeasurementDistance(totalDistance);
            }
            
            return newPath;
          });
        }
      });
      
      toast.info("Measurement mode active. Click on the map to add points.", {
        duration: 3000,
      });
    } else {
      // Reset cursor when drawing mode is inactive
      mapInstance.setOptions({ draggableCursor: '' });
      
      // Remove click listener
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current);
        listenerRef.current = null;
      }
    }
  }, [drawingMode, mapInstance]);

  // Effect to handle jobs or locations change - but DON'T auto-fit if user has interacted with the map
  useEffect(() => {
    if (!mapInstance || preventAutoZoom || initialFitDone.current) return;
    
    if (locations.length > 0) {
      // Only do initial fit if we have locations and user hasn't interacted with map yet
      const bounds = new google.maps.LatLngBounds();
      
      // Add all locations to bounds
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      
      // Fit map to these bounds
      mapInstance.fitBounds(bounds);
      
      // If there's only one marker, don't zoom in too much
      if (locations.length === 1) {
        const listener = mapInstance.addListener('idle', () => {
          if (mapInstance.getZoom() > 15) mapInstance.setZoom(15);
          google.maps.event.removeListener(listener);
        });
      }
      
      initialFitDone.current = true;
    }
  }, [mapInstance, locations, preventAutoZoom]);

  const handleLoadError = (error: Error) => {
    console.error("Failed to load Google Maps:", error);
    setMapError("Failed to load Google Maps. Please check your internet connection.");
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    } else {
      return `${Math.round(meters)} m`;
    }
  };

  const toggleDrawingMode = () => {
    setDrawingMode(prev => !prev);
    if (drawingMode) {
      // If turning off drawing mode, show the measurement result
      if (measurementDistance > 0) {
        toast.success(`Measured distance: ${formatDistance(measurementDistance)}`);
      }
    } else {
      // If turning on drawing mode, reset previous measurements but preserve the view
      setMeasurementPath([]);
      setMeasurementDistance(0);
    }
  };

  const clearMeasurement = () => {
    setMeasurementPath([]);
    setMeasurementDistance(0);
    toast.info("Measurement cleared");
  };

  // Options for the measurement line
  const polylineOptions = {
    strokeColor: "#FF5722",
    strokeOpacity: 1,
    strokeWeight: 3,
    zIndex: 2
  };

  // Prevent re-renders from resetting zoom by using a consistent callback
  const handleMapLoad = (map) => {
    console.log("Map loaded");
    setMapInstance(map);
    
    // Set initial tilt for Earth-like view (only on first load)
    if (!mapViewState) {
      map.setTilt(45);
    }

    // Place markers for each location
    try {
      locations.forEach(location => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.innerHTML = `
          <div class="flex items-center gap-2 font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20">
            <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" class="object-contain" />
            <span>${location.jobNumber || 'N/A'}${location.locationLabel ? ` - ${location.locationLabel}` : ''}</span>
          </div>
        `;
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: {
            lat: location.lat,
            lng: location.lng
          },
          map,
          content: markerElement,
          title: location.name
        });
        marker.addListener('gmp-click', () => {
          setSelectedLocation(location);
        });
      });

      // Only fit to markers on initial load and if we have locations
      if (!initialFitDone.current && locations.length > 0) {
        // Create bounds object
        const bounds = new google.maps.LatLngBounds();
        
        // Add all locations to bounds
        locations.forEach(location => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });
        
        // Fit map to these bounds
        map.fitBounds(bounds);
        
        // If there's only one marker, don't zoom in too much
        if (locations.length === 1) {
          const listener = map.addListener('idle', () => {
            if (map.getZoom() > 15) map.setZoom(15);
            google.maps.event.removeListener(listener);
          });
        }
        
        initialFitDone.current = true;
      }
    }
    catch (error) {
      console.error("Error loading map:", error);
      setMapError("Failed to initialize map components.");
    }
  };

  return (
    <Card className="w-full p-0 overflow-hidden">
      {/* Display measurement result if needed above the map */}
      {measurementDistance > 0 && (
        <div className="p-2 bg-secondary/20 rounded-md text-sm m-2">
          <p className="font-medium">Measured distance: {formatDistance(measurementDistance)}</p>
          {drawingMode && <p className="text-xs text-muted-foreground">Continue clicking to add more points or click "Stop Measuring" when done.</p>}
        </div>
      )}
      
      <div className="relative">
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
        </div>
        
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/90 rounded-lg">
            <div className="text-center p-4 max-w-md">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">Map Error</h3>
              <p className="mt-1 text-sm text-gray-500">{mapError}</p>
            </div>
          </div>
        )}
        
        <LoadScript 
          googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw" 
          libraries={["marker", "geometry"]}
          version="beta"
          onError={handleLoadError}
        >
          <GoogleMap 
            mapContainerStyle={mapContainerStyle} 
            center={mapViewState?.center || center} 
            zoom={mapViewState?.zoom || mapOptions.zoom} 
            options={{
              ...mapOptions,
              // Use stored tilt if available to prevent resetting the view
              tilt: mapViewState?.tilt || mapOptions.tilt
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
      </div>
    </Card>
  );
};

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
