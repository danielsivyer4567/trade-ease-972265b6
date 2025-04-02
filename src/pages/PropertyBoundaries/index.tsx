
import React, { useRef } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import CustomPropertyMap from '@/components/property-map';
import { PageHeader } from './components/PageHeader';
import { PropertyList } from './components/PropertyList';
import { PropertyInfo } from './components/PropertyInfo';
import { usePropertyBoundaries } from './hooks/usePropertyBoundaries';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Map } from "lucide-react";

const PropertyBoundaries = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    properties,
    selectedProperty,
    uploadedFile,
    searchQuery,
    isMeasuring,
    isLoading,
    handlePropertySelect,
    handleFileUpload,
    handleFileRemove,
    handleSearchChange,
    handleToggleMeasurement,
    handleDeleteProperty
  } = usePropertyBoundaries();
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fadeIn">
        <PageHeader onFileUploadClick={handleFileUploadClick} />
        
        <input 
          ref={fileInputRef}
          id="boundaryFileUpload" 
          type="file" 
          accept=".json,.geojson" 
          className="hidden" 
          onChange={handleFileUpload}
        />

        {properties.length === 0 && !isLoading ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">No Properties Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                Upload a GeoJSON file to add property boundaries or create a new property manually.
              </p>
              <button
                onClick={handleFileUploadClick}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 h-9"
              >
                Upload Boundaries
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Properties List & Info */}
            <div className="lg:col-span-1 space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-[400px] rounded-lg" />
                  <Skeleton className="w-full h-[200px] rounded-lg" />
                </>
              ) : (
                <>
                  <PropertyList 
                    properties={properties}
                    selectedProperty={selectedProperty}
                    uploadedFile={uploadedFile}
                    searchQuery={searchQuery}
                    isMeasuring={isMeasuring}
                    onPropertySelect={handlePropertySelect}
                    onFileRemove={handleFileRemove}
                    onSearchChange={handleSearchChange}
                    onToggleMeasurement={handleToggleMeasurement}
                    onPropertyDelete={handleDeleteProperty}
                  />
                  
                  {selectedProperty ? (
                    <PropertyInfo property={selectedProperty} />
                  ) : (
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <h3 className="text-sm font-medium">No Property Selected</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select a property from the list above to view details
                      </p>
                    </Card>
                  )}
                </>
              )}
            </div>
            
            {/* Map View */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <Skeleton className="w-full h-[600px] rounded-lg" />
              ) : selectedProperty ? (
                <CustomPropertyMap 
                  boundaries={selectedProperty?.boundaries || []}
                  title={selectedProperty?.name || "No Property Selected"}
                  description={selectedProperty?.description || "Please select a property to view details"}
                  centerPoint={selectedProperty?.location || [0, 0]}
                  measureMode={isMeasuring}
                />
              ) : (
                <Card className="w-full">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="rounded-full bg-secondary/10 p-3 mb-4">
                      <Map className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Property Selected</h3>
                    <p className="text-center text-muted-foreground">
                      Please select a property from the list to view its boundaries
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default PropertyBoundaries;
