
import { useState } from 'react';
import { toast } from "sonner";
import { Property, sampleProperties } from '../types';

export const usePropertyBoundaries = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property>(sampleProperties[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  
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
        toast.info("GeoJSON parsing would happen here in a production app");
      } else {
        toast.error("Please upload a GeoJSON or JSON file with coordinates");
      }
    }
  };
  
  const handleFileRemove = () => {
    setUploadedFile(null);
    toast.info("File removed");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleToggleMeasurement = () => {
    setIsMeasuring(prev => !prev);
    if (!isMeasuring) {
      toast.info("Boundary measurement mode activated. View details in the map section.");
    } else {
      toast.info("Boundary measurement mode deactivated.");
    }
  };

  // Filter properties based on search query
  const filteredProperties = sampleProperties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    properties: filteredProperties,
    selectedProperty,
    uploadedFile,
    searchQuery,
    isMeasuring,
    handlePropertySelect,
    handleFileUpload,
    handleFileRemove,
    handleSearchChange,
    handleToggleMeasurement
  };
};
