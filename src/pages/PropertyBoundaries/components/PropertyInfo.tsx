
import React from 'react';
import { Property } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Ruler, Landmark } from 'lucide-react';
import { formatCoordinates } from '../utils/formatters';

interface PropertyInfoProps {
  property: Property | null;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  if (!property) {
    return null;
  }

  // Calculate total boundaries
  const totalBoundaries = property.boundaries.length;
  
  // Calculate total points across all boundaries
  const totalPoints = property.boundaries.reduce(
    (sum, boundary) => sum + boundary.length,
    0
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Landmark className="h-4 w-4 text-primary" />
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          {property.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>{property.address}</div>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <Ruler className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Boundaries</div>
              <div className="text-xs text-gray-600 mt-1">
                {totalBoundaries} {totalBoundaries === 1 ? 'boundary' : 'boundaries'} with {totalPoints} total points
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Coordinates</div>
              <div className="text-xs text-gray-600 mt-1">
                {formatCoordinates(property.location)}
              </div>
            </div>
          </div>
          
          {property.description && (
            <div className="pt-2 border-t border-gray-100 mt-3">
              <div className="font-medium mb-1">Description</div>
              <p className="text-xs text-gray-600">{property.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
