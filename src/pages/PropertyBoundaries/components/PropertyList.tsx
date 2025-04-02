
import React from 'react';
import { Button } from '@/components/ui/button';
import { Property } from '../types';
import { PropertySearch } from './PropertySearch';
import { PropertyItem } from './PropertyItem';
import { PropertyFileInfo } from './PropertyFileInfo';
import { PropertyActions } from './PropertyActions';
import { usePropertyListState } from '../hooks/usePropertyListState';
import { Badge } from '@/components/ui/badge';
import { Map } from 'lucide-react';

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
  onPropertyDelete?: (property: Property) => void;
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
  onToggleMeasurement,
  onPropertyDelete
}) => {
  const {
    addressPreviews,
    isPreviewVisible,
    setIsPreviewVisible,
    filteredProperties,
    handleKeyPress,
    handleAddressPreviewClick,
    handleSearchClick
  } = usePropertyListState(properties, searchQuery, selectedProperty, onPropertySelect);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Map className="h-4 w-4 text-primary" />
          Properties
          <Badge variant="outline" className="ml-2">
            {properties.length}
          </Badge>
        </h2>
      </div>
      
      {/* Search Box */}
      <PropertySearch 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onKeyDown={handleKeyPress}
        addressPreviews={addressPreviews}
        isPreviewVisible={isPreviewVisible}
        setIsPreviewVisible={setIsPreviewVisible}
        onAddressPreviewClick={handleAddressPreviewClick}
        onSearchClick={handleSearchClick}
      />
      
      {/* Properties List */}
      <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50 pr-1">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyItem 
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={onPropertySelect}
              onDelete={onPropertyDelete}
            />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No properties found
          </div>
        )}
      </div>
      
      {/* Upload Info */}
      {uploadedFile && (
        <PropertyFileInfo file={uploadedFile} onRemove={onFileRemove} />
      )}
      
      {/* Action Buttons */}
      <PropertyActions 
        isMeasuring={isMeasuring} 
        onToggleMeasurement={onToggleMeasurement}
        selectedProperty={selectedProperty}
      />
    </div>
  );
};
