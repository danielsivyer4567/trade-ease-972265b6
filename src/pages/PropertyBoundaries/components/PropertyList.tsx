
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, FileUp, Search, Ruler } from 'lucide-react';
import { Property } from '../types';

interface PropertyListProps {
  properties: Property[];
  selectedProperty: Property | null;
  uploadedFile: File | null;
  searchQuery: string;
  isMeasuring: boolean;
  onPropertySelect: (property: Property) => void;
  onFileRemove: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  // Filter properties based on search query - now including address search
  const filteredProperties = properties.filter(prop => 
    prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prop.address && prop.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Properties</h2>
      
      {/* Search Box */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      {/* Properties List */}
      <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div
              key={property.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedProperty?.id === property.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary/10 hover:bg-primary/5 border border-transparent"
              }`}
              onClick={() => onPropertySelect(property)}
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
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No properties found
          </div>
        )}
      </div>
      
      {/* Upload Info */}
      {uploadedFile && (
        <div className="bg-secondary/20 p-3 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-sm">Uploaded File</h4>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                {uploadedFile.name}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onFileRemove}
              className="h-7 w-7"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button variant="outline" className="w-full justify-start gap-2">
          <FileUp className="h-4 w-4" />
          Upload Property
        </Button>
        <Button 
          variant={isMeasuring ? "default" : "outline"} 
          className="w-full justify-start gap-2"
          onClick={onToggleMeasurement}
        >
          <Ruler className="h-4 w-4" />
          {isMeasuring ? "Stop Measuring" : "Measure"}
        </Button>
      </div>
    </div>
  );
};
