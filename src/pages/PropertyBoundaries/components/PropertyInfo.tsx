
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property } from '../types';

interface PropertyInfoProps {
  property: Property;
}

export const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p>{property.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p>{property.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Coordinates</h3>
            <p className="text-sm font-mono">
              {property.location[1].toFixed(6)}, {property.location[0].toFixed(6)}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Boundary Points</h3>
            <p>{property.boundaries[0].length} points</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
