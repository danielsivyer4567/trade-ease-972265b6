
import React from 'react';
import { Property } from '../types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  return (
    <div 
      className={cn(
        "p-3 rounded-md border transition-all cursor-pointer relative group",
        isSelected 
          ? "bg-primary/10 border-primary/30 shadow-sm" 
          : "bg-white hover:bg-gray-50 border-gray-100"
      )}
      onClick={() => onClick(property)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={cn(
            "font-medium text-sm truncate pr-6",
            isSelected ? "text-primary" : "text-gray-800"
          )}>
            {property.name}
          </h3>
          
          {property.address && (
            <p className="text-xs text-gray-500 truncate mt-1">
              {property.address}
            </p>
          )}
        </div>
        
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-3.5 w-3.5 text-gray-500 hover:text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{property.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(property);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs",
          isSelected ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-600"
        )}>
          {property.boundaries.length} {property.boundaries.length === 1 ? 'boundary' : 'boundaries'}
        </span>
      </div>
    </div>
  );
};
