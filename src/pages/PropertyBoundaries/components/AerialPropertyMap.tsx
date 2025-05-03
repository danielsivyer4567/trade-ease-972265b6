import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getArcGISToken } from '../utils/arcgisToken';

// Fix Leaflet marker icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface AerialPropertyMapProps {
  property: Property | null;
  isLoading?: boolean;
}

export const AerialPropertyMap: React.FC<AerialPropertyMapProps> = ({ property, isLoading = false }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasBoundaries, setHasBoundaries] = useState(false);
  
  // Check if property has valid boundaries
  useEffect(() => {
    if (property && property.boundaries && property.boundaries.length > 0) {
      const hasValidBoundaries = property.boundaries.some(
        boundary => boundary && boundary.length > 2
      );
      setHasBoundaries(hasValidBoundaries);
    } else {
      setHasBoundaries(false);
    }
  }, [property]);
  
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading property data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!property) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Select a property to view its aerial map
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Prepare coordinates for Leaflet
  // Leaflet uses [lat, lng] format while many GIS systems use [lng, lat]
  const center = property.location ? [property.location[1], property.location[0]] : [-27.5, 153.0];
  
  // Process boundaries for Leaflet
  const processedBoundaries = property.boundaries.map(boundary => {
    return boundary.map(point => {
      // Swap coordinates for Leaflet [lat, lng]
      return [point[1], point[0]];
    });
  });

  // Use ArcGIS tiles if we have a token, otherwise use OpenStreetMap
  const hasToken = !!getArcGISToken();
  
  // Calculate area in square meters
  const calculateArea = (boundary: any[]) => {
    if (!boundary || boundary.length < 3) return 0;
    let area = 0;
    
    for (let i = 0; i < boundary.length; i++) {
      const j = (i + 1) % boundary.length;
      area += boundary[i][0] * boundary[j][1];
      area -= boundary[j][0] * boundary[i][1];
    }
    
    return Math.abs(area * 111319.9 * 111319.9) / 2;
  };

  // Format area into human-readable text
  const formatArea = (squareMeters: number) => {
    if (squareMeters < 1) return '0 m²';
    if (squareMeters < 10000) {
      return `${squareMeters.toFixed(1)} m²`;
    } else {
      const hectares = squareMeters / 10000;
      return `${hectares.toFixed(2)} ha`;
    }
  };
  
  // Calculate area for the first boundary
  const areaInSquareMeters = hasBoundaries ? calculateArea(processedBoundaries[0]) : 0;
  const formattedArea = formatArea(areaInSquareMeters);
  
  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden">
        <div style={{ height: '400px', width: '100%' }}>
          <MapContainer
            center={center as [number, number]}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
            whenReady={() => setMapLoaded(true)}
          >
            {/* Base map layer - OpenStreetMap */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Aerial imagery - Esri World Imagery */}
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            
            {/* Property boundary polygons */}
            {hasBoundaries && processedBoundaries.map((boundary, index) => (
              <Polygon
                key={`boundary-${index}`}
                positions={boundary as any}
                pathOptions={{
                  color: 'blue',
                  weight: 3,
                  opacity: 0.7,
                  fillColor: 'rgba(0, 0, 255, 0.1)',
                  fillOpacity: 0.3
                }}
              >
                <Popup>
                  <div>
                    <h3 className="font-medium">{property.name || 'Property'}</h3>
                    <p className="text-sm">{property.address || 'No address'}</p>
                    <p className="text-sm">Area: {formattedArea}</p>
                  </div>
                </Popup>
              </Polygon>
            ))}
            
            {/* Property center marker */}
            <Marker position={center as [number, number]}>
              <Popup>
                <div>
                  <h3 className="font-medium">{property.name || 'Property'}</h3>
                  <p className="text-sm">{property.address || 'No address'}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 