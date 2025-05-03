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

  // Convert boundaries from GeoJSON format to the format expected by CustomPropertyMap
  // Make sure each boundary point is explicitly cast as [number, number]
  const processedBoundaries = property.boundaries.map(boundary => {
    return boundary.map(point => {
      // Ensure each point is a tuple of exactly two numbers [lng, lat]
      return [point[1], point[0]] as [number, number];
    });
  });

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
