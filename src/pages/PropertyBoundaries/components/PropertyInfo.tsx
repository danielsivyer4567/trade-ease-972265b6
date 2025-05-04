import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomPropertyMap from '@/components/property-map/CustomPropertyMap';
import { AerialPropertyMap } from './AerialPropertyMap';
import { Property } from '../types';
import { formatCoordinate } from '../utils/formatters';

interface PropertyInfoProps {
  property: Property | null;
  isLoading: boolean;
  isMeasuring: boolean;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ 
  property, 
  isLoading, 
  isMeasuring 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!property) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Select a property to view its boundaries
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ensure property.boundaries is valid
  if (!property.boundaries || !Array.isArray(property.boundaries) || property.boundaries.length === 0) {
    console.error('Invalid or missing boundaries in property:', property);
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            This property has invalid or missing boundaries
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert boundaries from GeoJSON format to the format expected by CustomPropertyMap
  // Make sure each boundary point is explicitly cast as [number, number]
  const processedBoundaries = property.boundaries.map(boundary => {
    if (!Array.isArray(boundary)) {
      console.error('Boundary is not an array:', boundary);
      return [];
    }
    
    return boundary.map(point => {
      if (!Array.isArray(point) || point.length !== 2) {
        console.error('Invalid boundary point:', point);
        return [0, 0] as [number, number]; // Default value
      }
      
      const x = typeof point[0] === 'number' ? point[0] : parseFloat(point[0]);
      const y = typeof point[1] === 'number' ? point[1] : parseFloat(point[1]);
      
      if (isNaN(x) || isNaN(y)) {
        console.error('NaN values in boundary point:', point);
        return [0, 0] as [number, number]; // Default value
      }
      
      // Ensure each point is a tuple of exactly two numbers [lng, lat]
      return [y, x] as [number, number];
    }).filter(point => point[0] !== 0 || point[1] !== 0); // Filter out default values
  }).filter(boundary => boundary.length >= 3); // Require at least 3 points to form a polygon

  if (processedBoundaries.length === 0) {
    console.error('No valid boundaries after processing:', property.boundaries);
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Could not process property boundaries. The data may be corrupted.
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log('Processed boundaries:', processedBoundaries);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{property.address}</p>
        {property.location && (
          <p className="text-xs text-muted-foreground mt-1">
            Location: {formatCoordinate(property.location[0])}, {formatCoordinate(property.location[1])}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="aerial" className="w-full">
          <div className="px-6 border-b">
            <TabsList className="mb-2">
              <TabsTrigger value="aerial">Aerial Map</TabsTrigger>
              <TabsTrigger value="boundary">Boundary Map</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="aerial" className="mt-0">
            <AerialPropertyMap property={property} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="boundary" className="mt-0">
            <CustomPropertyMap 
              boundaries={processedBoundaries}
              title={property.name}
              description={property.description || property.address || "Property boundary view"}
              centerPoint={property.location || [0, 0]}
              measureMode={isMeasuring}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
