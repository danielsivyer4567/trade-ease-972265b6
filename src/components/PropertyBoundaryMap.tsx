import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Ruler, Copy, RotateCw, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { WithGoogleMaps } from './GoogleMapsProvider';

interface PropertyBoundaryMapProps {
  center: [number, number]; // [longitude, latitude]
  boundaries?: Array<Array<[number, number]>>; // Array of polygon coordinates
  title?: string;
  description?: string;
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
  const polygonRefs = useRef<Array<google.maps.Polygon>>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  // Calculate boundary area in square meters
  const calculateBoundaryArea = (polygon: google.maps.Polygon): number => {
    return google.maps.geometry.spherical.computeArea(polygon.getPath());
  };

  // Calculate measurements for all polygons
  const calculateAllMeasurements = () => {
    setIsCalculating(true);
    let totalLength = 0;
    let totalArea = 0;
    
    polygonRefs.current.forEach(polygon => {
      const length = calculateBoundaryLength(polygon);
      const area = calculateBoundaryArea(polygon);
      
      totalLength += length;
      totalArea += area;
    });
    
    setBoundaryLength(totalLength);
    setBoundaryArea(totalArea);
    setIsCalculating(false);
  };

  // Format measurements to display
  const formatLength = (meters: number): string => {
    if (meters < 1) return '0 m';
    if (meters < 1000) return `${meters.toFixed(1)} m`;
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatArea = (squareMeters: number): string => {
    if (squareMeters < 1) return '0 m²';
    if (squareMeters < 10000) return `${squareMeters.toFixed(1)} m²`;
    const hectares = squareMeters / 10000;
    return `${hectares.toFixed(2)} ha`;
  };

  // Copy measurements to clipboard
  const copyMeasurements = () => {
    const text = `Property Boundary Measurements\n` +
                `Perimeter: ${formatLength(boundaryLength)}\n` +
                `Area: ${formatArea(boundaryArea)}`;
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Measurements copied to clipboard"))
      .catch(err => toast.error(`Failed to copy: ${err.message}`));
  };

  const handlePolygonLoad = (polygon: google.maps.Polygon, index: number) => {
    polygonRefs.current[index] = polygon;
    
    // If this is the first boundary, calculate measurements automatically
    if (index === 0 && boundaries.length > 0) {
      calculateAllMeasurements();
    }
  };

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

  const handleMapError = (error: Error) => {
    console.error("Google Maps error:", error);
    setMapError("Failed to load map properly");
  };

  // Polygon styling
  const polygonOptions = {
    fillColor: "rgba(75, 85, 199, 0.3)",
    fillOpacity: 0.5,
    strokeColor: "#4B55C7",
    strokeOpacity: 1,
    strokeWeight: 3,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
  };
  
  // Reset map view
  const resetMapView = () => {
    if (mapInstance) {
      if (boundaries.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        
        boundaries.forEach(boundary => {
          boundary.forEach(([lng, lat]) => {
            bounds.extend(new google.maps.LatLng(lat, lng));
          });
        });
        
        mapInstance.fitBounds(bounds);
      } else {
        mapInstance.setCenter({ lat: center[1], lng: center[0] });
        mapInstance.setZoom(15);
      }
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
          
          <div className="flex gap-2">
            {isMapLoaded && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5" 
                onClick={resetMapView}
                title="Reset map view"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Reset</span>
              </Button>
            )}
            
            {boundaryArea > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5" 
                onClick={copyMeasurements}
                title="Copy measurements"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Copy</span>
              </Button>
            )}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
        
        {boundaryArea > 0 && (
          <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm mt-1">
            <div className="flex items-center">
              <Ruler className="h-4 w-4 mr-1 text-primary" />
              <span className="text-muted-foreground">Perimeter:</span>
              <span className="ml-1 font-medium">{formatLength(boundaryLength)}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-1">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
              <span className="text-muted-foreground">Area:</span>
              <span className="ml-1 font-medium">{formatArea(boundaryArea)}</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div ref={mapContainerRef} className="relative w-full" style={mapContainerStyle}>
          <WithGoogleMaps>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{ lat: center[1], lng: center[0] }}
              zoom={15}
              options={{
                mapTypeId: 'satellite',
                tilt: 0,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
                mapId: '8f348c1e276da9d5'
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
            </GoogleMap>
          </WithGoogleMaps>
          
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
      </CardContent>
    </Card>
  );
};

export default PropertyBoundaryMap;
