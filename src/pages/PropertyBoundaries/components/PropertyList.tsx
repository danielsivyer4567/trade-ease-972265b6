
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, File, Search, Ruler } from 'lucide-react';
import { Property } from '../types';
import { Input } from "@/components/ui/input";

interface PropertyListProps {
  properties: Property[];
  selectedProperty: Property;
  uploadedFile: File | null;
  searchQuery: string;
  isMeasuring: boolean;
  onPropertySelect: (property: Property) => void;
  onFileRemove: () => void;
  onSearchChange: (query: string) => void;
  onToggleMeasurement: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedProperty,
  uploadedFile,
  searchQuery,
  isMeasuring,
  onPropertySelect,
  onFileRemove,
  onSearchChange,
  onToggleMeasurement
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property List</CardTitle>
        <CardDescription>Select a property to view</CardDescription>
        
        <div className="mt-2 relative">
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => onSearchChange('')}
            >
              <span className="sr-only">Clear</span>
              <span aria-hidden="true">×</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant={isMeasuring ? "default" : "outline"} 
            size="sm"
            className="w-full mb-2 flex items-center justify-center gap-2"
            onClick={onToggleMeasurement}
          >
            <Ruler className="h-4 w-4" />
            {isMeasuring ? "Stop Measuring" : "Measure Boundaries"}
          </Button>
          
          {properties.length > 0 ? (
            properties.map((property) => (
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
                  <div className="flex">
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
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No properties match your search
            </div>
          )}
          
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
