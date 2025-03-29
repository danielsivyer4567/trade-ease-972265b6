
import React, { useState, useEffect } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Map, File, Eye, Plus, MapPin, Ruler, Upload as UploadIcon, AlertCircle } from 'lucide-react';
import PropertyBoundaryMap from '@/components/PropertyBoundaryMap';
import { toast } from "sonner";

// Sample property boundaries data with correct typing
const sampleProperties = [
  {
    id: 1,
    name: "Residential Property",
    location: [151.209900, -33.865143] as [number, number], // Explicitly typed as [number, number]
    description: "Single family home with backyard",
    boundaries: [
      [
        [151.209300, -33.864743] as [number, number],
        [151.210300, -33.864843] as [number, number],
        [151.210400, -33.865443] as [number, number],
        [151.209400, -33.865543] as [number, number],
        [151.209300, -33.864743] as [number, number],
      ]
    ]
  },
  {
    id: 2,
    name: "Commercial Lot",
    location: [151.211000, -33.863000] as [number, number],
    description: "Commercial property with parking",
    boundaries: [
      [
        [151.210600, -33.862600] as [number, number],
        [151.211400, -33.862700] as [number, number],
        [151.211500, -33.863300] as [number, number],
        [151.210700, -33.863400] as [number, number],
        [151.210600, -33.862600] as [number, number],
      ]
    ]
  },
  {
    id: 3,
    name: "Construction Site",
    location: [151.208000, -33.866000] as [number, number],
    description: "New development project",
    boundaries: [
      [
        [151.207600, -33.865600] as [number, number],
        [151.208400, -33.865500] as [number, number],
        [151.208600, -33.866200] as [number, number],
        [151.207800, -33.866300] as [number, number],
        [151.207600, -33.865600] as [number, number],
      ]
    ]
  }
];

// Type definition for a property
interface Property {
  id: number;
  name: string;
  location: [number, number]; // Tuple type for location
  description: string;
  boundaries: Array<Array<[number, number]>>; // Correct type for boundaries
}

const PropertyBoundaries = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(sampleProperties[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mapVisible, setMapVisible] = useState<boolean>(true);
  
  useEffect(() => {
    // Force re-render of map after component is mounted to prevent Google Maps initialization issues
    setMapVisible(false);
    const timer = setTimeout(() => setMapVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    toast.success(`Selected: ${property.name}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
        setUploadedFile(file);
        toast.success(`File uploaded: ${file.name}`);
        
        // In a real app, you would parse the GeoJSON file and convert to boundary format
        // For this demo, we'll just show a success message
        toast.info("GeoJSON parsing would happen here in a production app");
      } else {
        toast.error("Please upload a GeoJSON or JSON file with coordinates");
      }
    }
  };

  const handleRefreshMap = () => {
    setMapVisible(false);
    setTimeout(() => setMapVisible(true), 100);
    toast.info("Refreshing map view");
  };

  return (
    <BaseLayout>
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Property Boundary Viewer</h1>
            <p className="text-muted-foreground">View and measure property boundaries for job sites</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('boundaryFileUpload')?.click()}
              className="flex items-center gap-1"
            >
              <UploadIcon className="h-4 w-4" />
              <span>Upload GeoJSON</span>
            </Button>
            <input 
              id="boundaryFileUpload" 
              type="file" 
              accept=".json,.geojson" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefreshMap}
              className="flex items-center gap-1"
            >
              <RotateCw className="h-4 w-4" />
              <span>Refresh Map</span>
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>New Boundary</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Properties List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property List</CardTitle>
                <CardDescription>Select a property to view</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className={`p-3 rounded-md cursor-pointer border transition-all ${
                        selectedProperty.id === property.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/40'
                      }`}
                      onClick={() => handlePropertySelect(property)}
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
                            handlePropertySelect(property);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {uploadedFile && (
                    <div 
                      className="p-3 rounded-md cursor-pointer border border-dashed border-primary bg-primary/5"
                    >
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
                          onClick={() => setUploadedFile(null)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p>{selectedProperty.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{selectedProperty.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Coordinates</h3>
                    <p className="text-sm font-mono">
                      {selectedProperty.location[1].toFixed(6)}, {selectedProperty.location[0].toFixed(6)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Boundary Points</h3>
                    <p>{selectedProperty.boundaries[0].length} points</p>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshMap}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Map className="h-4 w-4" />
                      <span>Refresh Map View</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Map View */}
          <div className="lg:col-span-3">
            {mapVisible ? (
              <PropertyBoundaryMap 
                center={selectedProperty.location}
                boundaries={selectedProperty.boundaries}
                title={selectedProperty.name}
                description={selectedProperty.description}
              />
            ) : (
              <Card className="w-full h-[500px] flex items-center justify-center">
                <div className="text-center p-6">
                  <RotateCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Loading Map View</h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait while the map initializes...
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PropertyBoundaries;
