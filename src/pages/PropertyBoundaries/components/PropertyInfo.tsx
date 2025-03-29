
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
    <Card className="p-4 bg-secondary/10">
      <h2 className="text-xl font-bold mb-3">{property.name}</h2>
      <p className="text-sm text-muted-foreground mb-4">{property.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            {property.location[0].toFixed(4)}, {property.location[1].toFixed(4)}
          </span>
        </div>
        
        {/* Simulated data - could be replaced with real data from the Property type */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Added on {new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-primary" />
          <span>Owner: Company Admin</span>
        </div>
      </div>
    </Card>
  );
};
