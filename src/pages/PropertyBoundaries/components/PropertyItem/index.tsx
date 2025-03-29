
import React from 'react';
import { Property } from '../../types';

interface PropertyItemProps {
  property: Property;
  isSelected: boolean;
  onClick: (property: Property) => void;
}

export const PropertyItem: React.FC<PropertyItemProps> = ({
  property,
  isSelected,
  onClick
}) => {
  return (
    <div
      className={`p-3 rounded-md cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "bg-secondary/10 hover:bg-primary/5 border border-transparent"
      }`}
      onClick={() => onClick(property)}
    >
      <h3 className="font-medium">{property.name}</h3>
      <p className="text-sm text-muted-foreground truncate">
        {property.description}
      </p>
      {property.address && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">Address:</span> {property.address}
        </p>
      )}
    </div>
  );
};
