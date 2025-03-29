
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Ruler, Copy, RotateCw, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

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

  return (
    <Card className="w-full">
      <CardHeader>
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
      </CardHeader>
      
      <CardContent>
        <div ref={mapContainerRef} className="relative w-full" style={mapContainerStyle}>
          <LoadScript 
            googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw"
            libraries={["marker", "geometry"]}
            onLoad={() => console.log("Google Maps script loaded")}
            onError={handleLoadScriptError}
            version="beta"
          >
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
        
        {(boundaryLength > 0 || boundaryArea > 0) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Boundary Length
              </h3>
              <div className="text-2xl font-bold">
                {(boundaryLength).toFixed(2)} m
              </div>
              <div className="text-sm text-muted-foreground">
                ({(boundaryLength / 1000).toFixed(2)} km)
              </div>
            </div>
            
            <div className="bg-secondary/10 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Property Area
              </h3>
              <div className="text-2xl font-bold">
                {(boundaryArea).toFixed(2)} m²
              </div>
              <div className="text-sm text-muted-foreground">
                ({(boundaryArea / 10000).toFixed(4)} hectares)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyBoundaryMap;
