
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, File } from 'lucide-react';
import { toast } from "sonner";
import { Property } from '../types';

interface PropertyListProps {
  properties: Property[];
  selectedProperty: Property;
  uploadedFile: File | null;
  onPropertySelect: (property: Property) => void;
  onFileRemove: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedProperty,
  uploadedFile,
  onPropertySelect,
  onFileRemove
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property List</CardTitle>
        <CardDescription>Select a property to view</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className={`p-3 rounded-md cursor-pointer border transition-all ${
                selectedProperty.id === property.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/40'
              }`}
              onClick={() => onPropertySelect(property)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{property.name}</h3>
                  <p className="text-xs text-muted-foreground">{property.description}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertySelect(property);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          
          {uploadedFile && (
            <div className="p-3 rounded-md cursor-pointer border border-dashed border-primary bg-primary/5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium flex items-center">
                    <File className="h-3.5 w-3.5 mr-1" />
                    {uploadedFile.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">Uploaded GeoJSON file</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onFileRemove}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
