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
  return;
};