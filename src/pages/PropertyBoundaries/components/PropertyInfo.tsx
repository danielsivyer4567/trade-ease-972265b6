
import React from 'react';
import { Card } from '@/components/ui/card';
import { Property } from '../types';
import { MapPin, Calendar, User } from 'lucide-react';

interface PropertyInfoProps {
  property: Property | null;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({
  property
}) => {
  if (!property) {
    return <Card className="p-4 bg-secondary/10">
        <div className="text-center text-muted-foreground py-6">
          Select a property to view details
        </div>
      </Card>;
  }

  return (
    <Card className="p-4 bg-white">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">{property.name}</h3>
          {property.description && (
            <p className="text-sm text-muted-foreground mt-1">{property.description}</p>
          )}
        </div>

        {property.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <span className="text-sm">{property.address}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-xs">
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{property.location[0].toFixed(6)}, {property.location[1].toFixed(6)}</p>
          </div>
          
          <div className="text-xs">
            <p className="text-muted-foreground">Boundaries</p>
            <p className="font-medium">{property.boundaries.length} polygon(s)</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
