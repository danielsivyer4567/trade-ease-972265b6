import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Polygon, Polyline, Marker as GoogleMapsMarker, LoadScriptProps, Libraries } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Ruler, Copy, RotateCw, AlertCircle, Pencil, X, Move, Maximize, Download, XCircle, Check, Plus, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { getMapId, GOOGLE_MAPS_CONFIG } from '@/config/google-maps';

// Define libraries as an array with the correct type
// Must be declared outside component to avoid recreation on each render
const libraries: Libraries = ["places", "geometry", "drawing"];

// Map ID from config
const mapId = getMapId();

// Use the API key from environment variables
const apiKey = GOOGLE_MAPS_CONFIG.apiKey;

interface PropertyBoundaryMapProps {
  center: [number, number]; // [longitude, latitude]
  boundaries?: Array<Array<[number, number]>>; // Array of polygon coordinates
  title?: string;
  description?: string;
}

// Map view state type
interface MapViewState {
  zoom: number;
  tilt: number;
  center: google.maps.LatLngLiteral;
}

const PropertyBoundaryMap = ({ 
  center, 
  boundaries = [], 
  title = "Property Boundary Viewer",
  description = "View and measure property boundaries" 
}: PropertyBoundaryMapProps) => {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [boundaryLength, setBoundaryLength] = useState<number>(0);
  const [boundaryArea, setBoundaryArea] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [measurementPath, setMeasurementPath] = useState<Array<{lat: number, lng: number}>>([]);
  const [measurementDistance, setMeasurementDistance] = useState<number>(0);
  const [mapViewState, setMapViewState] = useState<MapViewState | null>(null);
  const polygonRefs = useRef<Array<google.maps.Polygon>>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const viewChangeListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const isUserInteracting = useRef<boolean>(false);
  const userControlledZoom = useRef<number | null>(null);
  const zoomChangeTimeout = useRef<NodeJS.Timeout | null>(null);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '0.5rem'
  };

  useEffect(() => {
    // Check if the map container has rendered properly
    if (mapContainerRef.current) {
      const containerHeight = mapContainerRef.current.clientHeight;
      const containerWidth = mapContainerRef.current.clientWidth;
      
      if (containerHeight === 0 || containerWidth === 0) {
        console.error("Map container has zero height or width", { height: containerHeight, width: containerWidth });
      }
    }
  }, []);

  // Track map view changes, but only when map becomes idle after user interaction
  useEffect(() => {
    if (!mapInstance) return;
    
    // Set up user interaction detection
    const dragStartListener = mapInstance.addListener('dragstart', () => {
      isUserInteracting.current = true;
    });
    
    // Improved zoom change handling with throttling to prevent zoom oscillation
    const zoomChangedListener = mapInstance.addListener('zoom_changed', () => {
      isUserInteracting.current = true;
      
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
            zoom: currentZoom || 15,
            tilt: mapInstance.getTilt() || 0,
            center: {
              lat: mapInstance.getCenter()?.lat() || center[1],
              lng: mapInstance.getCenter()?.lng() || center[0]
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
  }, [mapInstance, center]);

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

  // Convert boundary coordinates to Google Maps format
  const convertBoundariesToPolygons = () => {
    return boundaries.map(boundary => 
      boundary.map(([lng, lat]) => ({ lat, lng }))
    );
  };

  const polygons = convertBoundariesToPolygons();

  // Calculate boundary length (perimeter) in meters
  const calculateBoundaryLength = (polygon: google.maps.Polygon): number => {
    const path = polygon.getPath();
    let length = 0;
    
    for (let i = 0; i < path.getLength(); i++) {
      const point1 = path.getAt(i);
      const point2 = path.getAt((i + 1) % path.getLength());
      
      length += google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    }
    
    return length;
  };

  // Calculate area in square meters
  const calculateArea = (polygon: google.maps.Polygon): number => {
    return google.maps.geometry.spherical.computeArea(polygon.getPath());
  };

  const handleCalculate = () => {
    if (polygonRefs.current.length === 0) {
      toast.error("No boundaries available to measure");
      return;
    }
    
    setIsCalculating(true);
    
    let totalLength = 0;
    let totalArea = 0;
    
    polygonRefs.current.forEach(polygon => {
      totalLength += calculateBoundaryLength(polygon);
      totalArea += calculateArea(polygon);
    });
    
    setBoundaryLength(totalLength);
    setBoundaryArea(totalArea);
    setIsCalculating(false);
    
    toast.success("Boundary measurements calculated");
  };

  const handleCopyCoordinates = () => {
    const formattedCoordinates = boundaries.map(boundary => 
      boundary.map(coord => `[${coord[0]}, ${coord[1]}]`).join(',\n  ')
    ).join('\n\n');
    
    navigator.clipboard.writeText(`[\n  ${formattedCoordinates}\n]`);
    toast.success("Coordinates copied to clipboard");
  };

  const toggleDrawingMode = () => {
    setDrawingMode(prev => !prev);
    if (drawingMode) {
      // If turning off drawing mode, show the measurement result
      if (measurementDistance > 0) {
        toast.success(`Measured distance: ${formatDistance(measurementDistance)}`);
      }
    } else {
      // If turning on drawing mode, reset previous measurements but preserve view state
      setMeasurementPath([]);
      setMeasurementDistance(0);
    }
  };

  const clearMeasurement = () => {
    setMeasurementPath([]);
    setMeasurementDistance(0);
    toast.info("Measurement cleared");
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    } else {
      return `${Math.round(meters)} m`;
    }
  };

  // Prevent re-renders from resetting zoom by using a consistent callback
  const handleMapLoad = (map: google.maps.Map) => {
    console.log("Map loaded successfully");
    setMapInstance(map);
    setIsMapLoaded(true);
    setMapError(null);
    
    // Fit map to boundaries if they exist
    if (boundaries.length > 0 && boundaries[0].length > 0) {
      const bounds = new google.maps.LatLngBounds();
      
      boundaries.forEach(boundary => {
        boundary.forEach(([lng, lat]) => {
          bounds.extend(new google.maps.LatLng(lat, lng));
        });
      });
      
      map.fitBounds(bounds);
    }
    
    // Add center marker if no boundaries
    if (boundaries.length === 0) {
      const markerElement = document.createElement('div');
      markerElement.className = 'marker';
      markerElement.innerHTML = `
        <div class="flex items-center gap-2 font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/20">
          <img src="/lovable-uploads/34bca7f1-d63b-45a0-b1ca-a562443686ad.png" alt="Trade Ease Logo" width="20" height="20" class="object-contain" />
          <span>Property Location</span>
        </div>
      `;
      
      try {
        new google.maps.marker.AdvancedMarkerElement({
          position: { lat: center[1], lng: center[0] },
          map,
          content: markerElement,
          title: "Property Location"
        });
      } catch (error) {
        console.error("Error creating marker:", error);
        
        // Fallback to standard marker if advanced marker fails
        new google.maps.Marker({
          position: { lat: center[1], lng: center[0] },
          map,
          title: "Property Location"
        });
      }
    }
  };

  const handleLoadScriptError = (error: Error) => {
    console.error("Google Maps script error:", error);
    setMapError("Failed to load Google Maps script");
  };

  const handlePolygonLoad = (polygon: google.maps.Polygon, index: number) => {
    polygonRefs.current[index] = polygon;
  };

  const polygonOptions = {
    fillColor: "#9b87f5",
    fillOpacity: 0.3,
    strokeColor: "#6E59A5",
    strokeOpacity: 1,
    strokeWeight: 3,
    clickable: true,
    editable: false,
    draggable: false,
    zIndex: 1
  };

  // Options for the measurement line
  const polylineOptions = {
    strokeColor: "#FF5722",
    strokeOpacity: 1,
    strokeWeight: 3,
    zIndex: 2
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCalculate}
              disabled={isCalculating || !isMapLoaded}
              className="flex items-center gap-1"
            >
              {isCalculating ? <RotateCw className="h-4 w-4 animate-spin" /> : <Ruler className="h-4 w-4" />}
              <span>Measure Boundary</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyCoordinates}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Coordinates</span>
            </Button>
          </div>
        </div>
        
        {/* Display measurement result */}
        {measurementDistance > 0 && (
          <div className="mt-2 p-2 bg-secondary/20 rounded-md text-sm">
            <p className="font-medium">Measured distance: {formatDistance(measurementDistance)}</p>
            {drawingMode && <p className="text-xs text-muted-foreground">Continue clicking to add more points or click "Stop Measuring" when done.</p>}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-2">
        <div ref={mapContainerRef} className="relative w-full" style={mapContainerStyle}>
          {/* Measurement control buttons positioned on the top-left of the map */}
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            <Button 
              variant={drawingMode ? "secondary" : "default"}
              size="sm"
              onClick={toggleDrawingMode}
              disabled={!isMapLoaded}
              className="flex items-center gap-1 shadow-md bg-white/90 text-black hover:bg-white/100"
            >
              <Pencil className="h-4 w-4" />
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
          
          <LoadScript 
            googleMapsApiKey={apiKey}
            libraries={libraries}
            onLoad={() => console.log("Google Maps script loaded")}
            onError={handleLoadScriptError}
            version="beta"
            mapIds={[mapId]}
            id="google-maps-script"
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapViewState ? { lat: mapViewState.center.lat, lng: mapViewState.center.lng } : { lat: center[1], lng: center[0] }}
              zoom={mapViewState?.zoom || 15}
              options={{
                // Removing mapTypeId when mapId is present to avoid conflicts
                // The map styles are now controlled via Cloud Console
                tilt: mapViewState?.tilt || 0,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
                mapId: mapId
              }}
              onLoad={handleMapLoad}
            >
              {polygons.map((polygon, index) => (
                <Polygon
                  key={`boundary-${index}`}
                  paths={polygon}
                  options={polygonOptions}
                  onLoad={(polygon) => handlePolygonLoad(polygon, index)}
                />
              ))}
              
              {/* Render measurement line */}
              {measurementPath.length > 1 && (
                <Polyline
                  path={measurementPath}
                  options={polylineOptions}
                />
              )}
              
              {/* Render measurement points */}
              {measurementPath.map((point, index) => (
                <GoogleMapsMarker
                  key={`measure-point-${index}`}
                  position={point}
                  label={index === 0 ? 'Start' : index === measurementPath.length - 1 ? 'End' : `${index}`}
                />
              ))}
                          </GoogleMap>
           </LoadScript>
          
          {mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 rounded-lg">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-md text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Map Error</h3>
                <p className="text-gray-700">{mapError}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Check console for more details. This could be due to API key restrictions, network issues, or script loading errors.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Display boundary measurements if calculated */}
        {(boundaryLength > 0 || boundaryArea > 0) && (
          <div className="mt-4 p-3 bg-secondary/10 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            {boundaryLength > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Perimeter</h4>
                <p className="text-lg font-semibold">{formatDistance(boundaryLength)}</p>
              </div>
            )}
            {boundaryArea > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Area</h4>
                <p className="text-lg font-semibold">
                  {boundaryArea >= 10000 
                    ? `${(boundaryArea / 10000).toFixed(2)} ha` 
                    : `${Math.round(boundaryArea)} m²`}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
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

export default PropertyBoundaryMap;
