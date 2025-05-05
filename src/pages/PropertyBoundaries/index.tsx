import React, { useCallback } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { PropertyList } from './components/PropertyList';
import { PropertyInfo } from './components/PropertyInfo';
import { PageHeader } from './components/PageHeader';
import { AuthNotice } from './components/AuthNotice';
import { AddressSearch } from './components/AddressSearch';
import { usePropertyBoundaries } from './hooks/usePropertyBoundaries';
import { supabase } from '@/integrations/supabase/client';

const PropertyBoundaries: React.FC = () => {
  const {
    properties,
    selectedProperty,
    uploadedFile,
    searchQuery,
    isMeasuring,
    isLoading,
    isPending,
    handlePropertySelect,
    handleFileUpload,
    handleFileRemove,
    handleSearchChange,
    handleToggleMeasurement,
    handleDeleteProperty
  } = usePropertyBoundaries();

  const handleUploadClick = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
  }, []);

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-6">
        <PageHeader 
          title="Property Boundaries"
          description="View, search and manage property boundaries"
          onFileUploadClick={handleUploadClick}
        />
        
        {!isAuthenticated && (
          <AuthNotice />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <AddressSearch />
            
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
            
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleUploadClick}>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-muted-foreground text-center">
                    Upload GeoJSON boundary file
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json,.geojson"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <PropertyInfo 
              property={selectedProperty} 
              isLoading={isLoading || isPending}
              isMeasuring={isMeasuring} 
            />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PropertyBoundaries;
