
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Ruler, Copy, RotateCw } from 'lucide-react';
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
  const polygonRefs = useRef<Array<google.maps.Polygon>>([]);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '0.5rem'
  };

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
    setMapInstance(map);
    
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
      
      new google.maps.marker.AdvancedMarkerElement({
        position: { lat: center[1], lng: center[0] },
        map,
        content: markerElement,
        title: "Property Location"
      });
    }
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
              disabled={isCalculating}
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
        <LoadScript 
          googleMapsApiKey="AIzaSyAnIcvNA_ZjRUnN4aeyl-1MYpBSN-ODIvw"
          libraries={["marker", "geometry"]}
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
