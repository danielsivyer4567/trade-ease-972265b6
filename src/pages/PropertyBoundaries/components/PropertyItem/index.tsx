
import React from 'react';
import { Property } from '../../types';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyItemProps {
  property: Property;
  isSelected: boolean;
  onClick: (property: Property) => void;
  onDelete?: (property: Property) => void;
}

export const PropertyItem: React.FC<PropertyItemProps> = ({
  property,
  isSelected,
  onClick,
  onDelete
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    if (onDelete) {
      onDelete(property);
    }
  };

  return (
    <div
      className={`p-3 rounded-md cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "bg-secondary/10 hover:bg-primary/5 border border-transparent"
      }`}
      onClick={() => onClick(property)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
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
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-destructive" 
            onClick={handleDeleteClick}
            title="Delete property"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
