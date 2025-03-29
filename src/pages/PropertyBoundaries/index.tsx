
import React, { useRef } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import CustomPropertyMap from '@/components/property-map';
import { PageHeader } from './components/PageHeader';
import { PropertyList } from './components/PropertyList';
import { PropertyInfo } from './components/PropertyInfo';
import { usePropertyBoundaries } from './hooks/usePropertyBoundaries';

const PropertyBoundaries = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    properties,
    selectedProperty,
    uploadedFile,
    searchQuery,
    isMeasuring,
    handlePropertySelect,
    handleFileUpload,
    handleFileRemove,
    handleSearchChange,
    handleToggleMeasurement
  } = usePropertyBoundaries();
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseLayout>
      <div className="p-6 space-y-6 animate-fadeIn">
        <PageHeader onFileUploadClick={handleFileUploadClick} />
        
        <input 
          ref={fileInputRef}
          id="boundaryFileUpload" 
          type="file" 
          accept=".json,.geojson" 
          className="hidden" 
          onChange={handleFileUpload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Properties List & Info */}
          <div className="lg:col-span-1 space-y-4">
            <PropertyList 
              properties={properties}
              selectedProperty={selectedProperty}
              uploadedFile={uploadedFile}
              searchQuery={searchQuery}
              onPropertySelect={handlePropertySelect}
              onFileRemove={handleFileRemove}
              onSearchChange={handleSearchChange}
            />
            
            <PropertyInfo property={selectedProperty} />
          </div>
          
          {/* Map View */}
          <div className="lg:col-span-3">
            <CustomPropertyMap 
              boundaries={selectedProperty.boundaries}
              title={selectedProperty.name}
              description={selectedProperty.description}
              centerPoint={selectedProperty.location}
              measureMode={isMeasuring}
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PropertyBoundaries;
