import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SimplePropertyMap } from '@/components/LeafletProvider';
import { getArcGISToken } from '../utils/arcgisToken';

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
      // Validate each boundary to ensure it has at least 3 points and valid coordinates
      const hasValidBoundaries = property.boundaries.some(boundary => {
        if (!Array.isArray(boundary)) return false;
        if (boundary.length < 3) return false;
        
        // Check that each point is a valid coordinate
        return boundary.every(point => 
          Array.isArray(point) && 
          point.length === 2 && 
          typeof point[0] === 'number' && 
          typeof point[1] === 'number' &&
          !isNaN(point[0]) && 
          !isNaN(point[1])
        );
      });
      
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

  // Validate property.location
  let center: [number, number];
  if (property.location && 
      Array.isArray(property.location) && 
      property.location.length === 2 && 
      typeof property.location[0] === 'number' && 
      typeof property.location[1] === 'number' &&
      !isNaN(property.location[0]) && 
      !isNaN(property.location[1])) {
    // Leaflet uses [lat, lng] format while many GIS systems use [lng, lat]
    center = [property.location[1], property.location[0]];
  } else {
    console.warn('Invalid property location, using default:', property.location);
    center = [-27.5, 153.0]; // Default location
  }
  
  // Process boundaries for Leaflet, with validation
  const processedBoundaries = property.boundaries ? property.boundaries.map(boundary => {
    if (!Array.isArray(boundary)) return null;
    if (boundary.length < 3) return null; // Need at least 3 points to form a polygon
    
    return boundary.map(point => {
      if (!Array.isArray(point) || point.length !== 2) return null;
      const x = typeof point[0] === 'number' ? point[0] : parseFloat(point[0]);
      const y = typeof point[1] === 'number' ? point[1] : parseFloat(point[1]);
      
      if (isNaN(x) || isNaN(y)) return null;
      
      // Swap coordinates for Leaflet [lat, lng]
      return [y, x] as [number, number];
    }).filter(Boolean) as [number, number][]; // Filter out any null points
  }).filter(boundary => boundary && boundary.length >= 3) as [number, number][][] : [];
  
  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden">
        <div style={{ height: '400px', width: '100%', position: 'relative' }}>
          <SimplePropertyMap 
            center={center}
            zoom={15}
            boundaries={processedBoundaries}
            title={property.name || property.address || 'Property Location'}
            onMapReady={() => setMapLoaded(true)}
          />
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {mapLoaded && processedBoundaries.length === 0 && (
            <div className="absolute bottom-4 left-0 right-0 mx-auto w-max bg-white px-4 py-2 rounded-md shadow-md z-20">
              <p className="text-sm text-muted-foreground">
                No valid boundaries available for this property
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 