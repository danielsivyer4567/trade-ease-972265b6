<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';

const PropertyBoundaries: React.FC = () => {
  const [ParcelMap, setParcelMap] = useState<React.FC | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParcelMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const mod = await import('@/components/parcel/parcel');
        setParcelMap(() => mod.default);
      } catch (err) {
        console.error('Failed to load parcel map component:', err);
        setError('Failed to load the map component. Please refresh the page.');
=======
import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import PropertyBoundaryMap from '@/components/PropertyBoundaryMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BoundaryMeasurements } from '@/components/property-map/BoundaryMeasurements';
import { useBoundaryProcessing } from '@/components/property-map/hooks/useBoundaryProcessing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Upload, Download, FileText, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

// Sample property boundaries for testing
const sampleBoundaries: Array<Array<[number, number]>> = [
  [
    [-122.084111, 37.422019],
    [-122.082111, 37.422019],
    [-122.082111, 37.424019],
    [-122.084111, 37.424019],
    [-122.084111, 37.422019]
  ]
];

const PropertyBoundaries: React.FC = () => {
  const [boundaries, setBoundaries] = useState<Array<Array<[number, number]>>>(sampleBoundaries);
  const [center, setCenter] = useState<[number, number]>([-122.083111, 37.423019]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(true);
  
  // Process boundaries using the hook
  const { measurements } = useBoundaryProcessing(boundaries);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    setIsLoading(true);
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (Array.isArray(data) && data.length > 0) {
          setBoundaries(data);
          
          // Set center to the first point of the first boundary
          if (data[0] && data[0][0]) {
            setCenter([data[0][0][0], data[0][0][1]]);
          }
          
          toast.success("Property boundaries loaded successfully");
        } else {
          toast.error("Invalid boundary data format");
        }
      } catch (error) {
        console.error("Error parsing boundary file:", error);
        toast.error("Error parsing boundary file");
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
      } finally {
        setIsLoading(false);
      }
    };
<<<<<<< HEAD

    loadParcelMap();
  }, []);

  return (
    <AppLayout>
      <div className="w-full h-screen relative">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
        
        {ParcelMap && !isLoading && !error && <ParcelMap />}
=======
    
    reader.onerror = () => {
      toast.error("Error reading file");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleExportBoundaries = () => {
    const dataStr = JSON.stringify(boundaries, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `property-boundaries-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Boundaries exported successfully");
  };
  
  const toggleMeasurements = () => {
    setShowMeasurements(!showMeasurements);
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Property Boundaries
            </h1>
            <p className="text-muted-foreground">View, measure, and manage property boundaries</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <label htmlFor="boundary-upload" className="cursor-pointer flex items-center gap-1">
                <Upload className="h-4 w-4" />
                <span>Import Boundaries</span>
              </label>
              <input 
                id="boundary-upload" 
                type="file" 
                accept=".json,.geojson" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleExportBoundaries}
              disabled={boundaries.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            
            <Button
              variant={showMeasurements ? "secondary" : "outline"}
              className="flex items-center gap-1"
              onClick={toggleMeasurements}
            >
              <FileText className="h-4 w-4" />
              <span>Measurements</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <Card className="w-full h-[500px] flex items-center justify-center">
            <div className="text-center">
              <RotateCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Loading property boundaries...</p>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map">
              <PropertyBoundaryMap 
                center={center}
                boundaries={boundaries}
                title="Property Boundary Map"
                description="View and measure property boundaries"
              />
            </TabsContent>
            
            <TabsContent value="measurements">
              <Card>
                <CardHeader>
                  <CardTitle>Property Measurements</CardTitle>
                  <CardDescription>Detailed measurements of property boundaries</CardDescription>
                </CardHeader>
                <CardContent>
                  {boundaries.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Perimeter</h3>
                          <p className="text-2xl font-bold">{(measurements.boundaryLength / 1000).toFixed(2)} km</p>
                        </div>
                        <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Area</h3>
                          <p className="text-2xl font-bold">{(measurements.boundaryArea / 10000).toFixed(2)} hectares</p>
                        </div>
                      </div>
                      
                      <BoundaryMeasurements 
                        edges={measurements.edges || []}
                        showMeasurements={true}
                      />
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No boundary data available</p>
                      <p className="text-sm">Import boundary data to see measurements</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
      </div>
    </AppLayout>
  );
};

<<<<<<< HEAD
export default PropertyBoundaries;
=======
export default PropertyBoundaries; 
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
