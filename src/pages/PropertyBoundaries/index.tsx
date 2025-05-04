import React, { useCallback, useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { PropertyList } from './components/PropertyList';
import { PropertyInfo } from './components/PropertyInfo';
import { PageHeader } from './components/PageHeader';
import { AuthNotice } from './components/AuthNotice';
import { AddressSearch } from './components/AddressSearch';
import { TokenInput } from './components/TokenInput';
import { usePropertyBoundaries } from './hooks/usePropertyBoundaries';
import { supabase } from '@/integrations/supabase/client';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getArcGISToken } from './utils/arcgisToken';

const PropertyBoundariesContent: React.FC = () => {
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

  const [tokenConfigVisible, setTokenConfigVisible] = useState(!getArcGISToken());

  const handleUploadClick = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleTokenSet = useCallback(() => {
    setTokenConfigVisible(false);
  }, []);

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-6">
        <PageHeader 
          title="Property Boundaries"
          description="View, search and manage property boundaries"
          onFileUploadClick={handleUploadClick}
        />
        
        {/* Only show token config if no token is available or if explicitly opened */}
        {tokenConfigVisible && (
          <TokenInput onTokenSet={handleTokenSet} />
        )}
        
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
            
            {/* Add button to open token configuration if hidden */}
            {!tokenConfigVisible && (
              <div className="flex justify-center">
                <button 
                  onClick={() => setTokenConfigVisible(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Configure ArcGIS Token
                </button>
              </div>
            )}
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

// Wrap with ErrorBoundary
const PropertyBoundaries: React.FC = () => {
  return (
    <ErrorBoundary>
      <PropertyBoundariesContent />
    </ErrorBoundary>
  );
};

export default PropertyBoundaries;
