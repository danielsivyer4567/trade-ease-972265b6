
import React from 'react';
import { Button } from '@/components/ui/button';
import { Property } from '../types';
import { PropertySearch } from './PropertySearch';
import { PropertyItem } from './PropertyItem';
import { PropertyFileInfo } from './PropertyFileInfo';
import { PropertyActions } from './PropertyActions';
import { usePropertyListState } from '../hooks/usePropertyListState';

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
  const {
    addressPreviews,
    isPreviewVisible,
    setIsPreviewVisible,
    filteredProperties,
    handleKeyPress,
    handleAddressPreviewClick
  } = usePropertyListState(properties, searchQuery, selectedProperty, onPropertySelect);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Properties</h2>
      
      {/* Search Box */}
      <PropertySearch 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onKeyDown={handleKeyPress}
        addressPreviews={addressPreviews}
        isPreviewVisible={isPreviewVisible}
        setIsPreviewVisible={setIsPreviewVisible}
        onAddressPreviewClick={handleAddressPreviewClick}
      />
      
      {/* Properties List */}
      <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyItem 
              key={property.id}
              property={property}
              isSelected={selectedProperty?.id === property.id}
              onClick={onPropertySelect}
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
