
import { useState, useCallback } from 'react';
import { Property } from '../types';

// Sample mock properties to ensure the component works even without real data
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Main Office',
    description: 'Company headquarters location',
    location: [-37.8136, 144.9631], // Melbourne
    boundaries: [
      [
        [-37.8136, 144.9631],
        [-37.8140, 144.9640],
        [-37.8150, 144.9635],
        [-37.8146, 144.9626],
        [-37.8136, 144.9631]
      ]
    ]
  },
  {
    id: '2',
    name: 'Client Site A',
    description: 'Major construction project',
    location: [-37.8236, 144.9531],
    boundaries: [
      [
        [-37.8236, 144.9531],
        [-37.8240, 144.9540],
        [-37.8250, 144.9535],
        [-37.8246, 144.9526],
        [-37.8236, 144.9531]
      ]
    ]
  }
];

export const usePropertyBoundaries = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(mockProperties[0] || null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMeasuring, setIsMeasuring] = useState(false);
  
  const handlePropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);
  
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // Read and parse the GeoJSON file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.features && Array.isArray(data.features)) {
          // Process GeoJSON features
          const newProperties: Property[] = data.features.map((feature: any, index: number) => {
            const coords = feature.geometry.coordinates || [];
            const name = feature.properties?.name || `Property ${properties.length + index + 1}`;
            
            // Find center point (simplified)
            let centerLat = 0, centerLng = 0;
            let numPoints = 0;
            
            if (coords && coords.length > 0 && coords[0].length > 0) {
              coords[0].forEach((point: [number, number]) => {
                centerLat += point[1];
                centerLng += point[0];
                numPoints++;
              });
              
              centerLat /= numPoints;
              centerLng /= numPoints;
            }
            
            return {
              id: `uploaded-${index}`,
              name,
              description: feature.properties?.description || `Uploaded boundary ${index + 1}`,
              location: [centerLat, centerLng],
              boundaries: coords
            };
          });
          
          setProperties([...properties, ...newProperties]);
          if (newProperties.length > 0) {
            setSelectedProperty(newProperties[0]);
          }
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        // Handle error - could show toast notification here
      }
    };
    
    reader.readAsText(file);
  }, [properties]);
  
  const handleFileRemove = useCallback(() => {
    setUploadedFile(null);
    
    // Reset to original properties
    setProperties(mockProperties);
    setSelectedProperty(mockProperties[0] || null);
  }, []);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  const handleToggleMeasurement = useCallback(() => {
    setIsMeasuring(prev => !prev);
  }, []);
  
  return {
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
  };
};
