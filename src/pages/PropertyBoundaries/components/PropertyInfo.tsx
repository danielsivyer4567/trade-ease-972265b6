
import React from 'react';
import { Card } from '@/components/ui/card';
import { Property } from '../types';
import { MapPin, Calendar, User } from 'lucide-react';

interface PropertyInfoProps {
  property: Property | null;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  if (!property) {
    return (
      <Card className="p-4 bg-secondary/10">
        <div className="text-center text-muted-foreground py-6">
          Select a property to view details
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">{property.name}</h3>
      
      {property.description && (
        <p className="text-sm text-muted-foreground mb-4">{property.description}</p>
      )}
      
      {property.address && (
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary mt-0.5" />
          <span className="text-sm">{property.address}</span>
        </div>
      )}
      
      <div className="flex items-start gap-2">
        <Calendar className="h-4 w-4 text-primary mt-0.5" />
        <span className="text-sm">Coordinates: {property.location[0].toFixed(4)}, {property.location[1].toFixed(4)}</span>
      </div>
      
      <div className="mt-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Boundary points: {
            property.boundaries?.[0]?.length || 0
          }</span>
        </div>
      </div>
    </Card>
  );
};
