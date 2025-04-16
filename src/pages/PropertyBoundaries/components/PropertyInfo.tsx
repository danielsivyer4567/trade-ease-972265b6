
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CustomPropertyMap from '@/components/property-map/CustomPropertyMap';
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
  const processedBoundaries = property.boundaries.map(boundary => {
    return boundary.map(point => [point[1], point[0]]);
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{property.address}</p>
      </CardHeader>
      <CardContent className="p-0">
        {property.location && (
          <div className="mb-4 px-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Location:</span> {formatCoordinate(property.location[0])}, {formatCoordinate(property.location[1])}
            </p>
          </div>
        )}
        
        <CustomPropertyMap 
          boundaries={processedBoundaries}
          title={property.name}
          description={property.description || property.address || "Property boundary view"}
          centerPoint={property.location || [0, 0]}
          measureMode={isMeasuring}
        />
      </CardContent>
    </Card>
  );
};
