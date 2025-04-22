import { useState, useCallback, useEffect, useTransition } from 'react';
import { Property } from '../types';
import { toast } from 'sonner';
import { supabase } from '../../../integrations/supabase/client';
import { searchAddressAndFetchBoundary } from '../../../integrations/arcgis/propertyBoundaries';

// Sample mock properties for initial UI rendering when no data is available
const mockProperties: Property[] = [
  {
    id: '2',
    name: 'Client Site A',
    description: 'Major construction project',
    address: '45 Exhibition Street, Melbourne VIC 3000',
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
  },
  {
    id: '3',
    name: 'Warehouse Facility',
    description: 'Storage and distribution center',
    address: '789 Docklands Drive, Docklands VIC 3008',
    location: [-37.8150, 144.9450],
    boundaries: [
      [
        [-37.8150, 144.9450],
        [-37.8155, 144.9465],
        [-37.8165, 144.9460],
        [-37.8160, 144.9445],
        [-37.8150, 144.9450]
      ]
    ]
  }
];

interface PropertyData {
  id: string;
  name: string;
  description?: string;
  address?: string;
  location: number[];
  boundaries: number[][][];
  user_id?: string;
  [key: string]: any;
}

interface BoundaryGeometryData {
  rings: number[][][];
  [key: string]: any;
}

export const usePropertyBoundaries = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  
  // Fetch properties from Supabase on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch properties from Supabase
          const { data, error } = await supabase
            .from('property_boundaries')
            .select('*');
            
          if (error) {
            console.error('Error fetching properties:', error);
            toast.error('Failed to load properties');
            // Fall back to mock data if there's an error
            startTransition(() => {
              setProperties(mockProperties);
              setSelectedProperty(mockProperties[0] || null);
            });
          } else if (data && data.length > 0) {
            // Transform Supabase data to match Property type
            const transformedData = data
              .map((item: PropertyData) => ({
                id: item.id,
                name: item.name,
                description: item.description || '',
                address: item.address || '',
                location: item.location as [number, number],
                boundaries: item.boundaries as Array<Array<[number, number]>>
              }))
              // Filter out any property with the name "Main Office"
              .filter((property: Property) => property.name !== 'Main Office');
            
            startTransition(() => {
              setProperties(transformedData);
              setSelectedProperty(transformedData[0] || null);
            });
            toast.success('Properties loaded successfully');
          } else {
            // If no properties found, use mock data
            startTransition(() => {
              setProperties(mockProperties);
              setSelectedProperty(mockProperties[0] || null);
            });
          }
        } else {
          // If user is not logged in, use mock data
          startTransition(() => {
            setProperties(mockProperties);
            setSelectedProperty(mockProperties[0] || null);
          });
          toast.warning('Using demo data - log in to save your properties');
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        // Fall back to mock data
        startTransition(() => {
          setProperties(mockProperties);
          setSelectedProperty(mockProperties[0] || null);
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const handlePropertySelect = useCallback((property: Property) => {
    // Don't allow Main Office to be selected
    if (property.name === 'Main Office') {
      toast.error('This property cannot be selected');
      return;
    }
    
    startTransition(() => {
      setSelectedProperty(property);
    });
    console.log('Selected property:', property);
  }, []);
  
  const extractAddress = (properties: any): string => {
    if (!properties) return '';
    
    // Try different common address field names
    const addressFields = [
      'address',
      'formatted_address',
      'location',
      'addr',
      'street_address',
      'full_address',
      'postal_address'
    ];
    
    // Look for any field containing "address" in its name
    const addressKey = Object.keys(properties).find(key => 
      addressFields.includes(key.toLowerCase()) || 
      key.toLowerCase().includes('address')
    );
    
    if (addressKey && properties[addressKey]) {
      return properties[addressKey];
    }
    
    // Try to construct address from components if available
    if (properties.street && properties.city) {
      let constructedAddress = properties.street;
      if (properties.number) constructedAddress = `${properties.number} ${constructedAddress}`;
      if (properties.city) constructedAddress += `, ${properties.city}`;
      if (properties.state) constructedAddress += ` ${properties.state}`;
      if (properties.postcode || properties.zip || properties.zipcode || properties.postal_code) {
        constructedAddress += ` ${properties.postcode || properties.zip || properties.zipcode || properties.postal_code}`;
      }
      return constructedAddress;
    }
    
    return '';
  };
  
  const savePropertyToSupabase = async (property: Property) => {
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to save properties');
        return false;
      }
      
      // Prepare data for Supabase
      const propertyData = {
        name: property.name,
        description: property.description,
        address: property.address,
        location: property.location,
        boundaries: property.boundaries,
        user_id: user.id
      };
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('property_boundaries')
        .insert([propertyData])
        .select();
        
      if (error) {
        console.error('Error saving property:', error);
        toast.error('Failed to save property');
        return false;
      }
      
      toast.success('Property saved successfully');
      return data && data[0];
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
      return false;
    }
  };
  
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.features && Array.isArray(data.features)) {
          let savedPropertiesCount = 0;
          const newProperties: Property[] = [];
          
          for (let index = 0; index < data.features.length; index++) {
            const feature = data.features[index];
            const coords = feature.geometry.coordinates || [];
            const name = feature.properties?.name || `Property ${properties.length + index + 1}`;
            
            // Skip properties named "Main Office"
            if (name === "Main Office") {
              toast.warning(`Skipped property "Main Office" as it's not allowed`);
              continue;
            }
            
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
            
            // Use enhanced address extraction
            const address = extractAddress(feature.properties);
            
            const newProperty: Property = {
              id: `temp-${Date.now()}-${index}`,
              name,
              description: feature.properties?.description || `Uploaded boundary ${index + 1}`,
              address,
              location: [centerLat, centerLng] as [number, number],
              boundaries: coords as Array<Array<[number, number]>>
            };
            
            newProperties.push(newProperty);
            
            // Try to save to Supabase if user is authenticated
            const savedProperty = await savePropertyToSupabase(newProperty);
            if (savedProperty) {
              savedPropertiesCount++;
              // Update the ID with the one from Supabase
              newProperty.id = savedProperty.id;
            }
          }
          
          if (newProperties.length > 0) {
            startTransition(() => {
              setProperties(prev => [...prev, ...newProperties]);
              setSelectedProperty(newProperties[0]);
            });
            
            if (savedPropertiesCount > 0) {
              toast.success(`Saved ${savedPropertiesCount} properties to your account`);
            } else {
              toast.success(`Loaded ${newProperties.length} properties`);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
        toast.error('Failed to parse the uploaded file. Please check the format.');
      }
    };
    
    reader.readAsText(file);
  }, [properties]);
  
  const handleFileRemove = useCallback(() => {
    setUploadedFile(null);
    
    // Refetch properties from Supabase
    const fetchProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('property_boundaries')
            .select('*');
            
          if (error) {
            console.error('Error fetching properties:', error);
            startTransition(() => {
              setProperties(mockProperties);
              setSelectedProperty(mockProperties[0] || null);
            });
          } else if (data && data.length > 0) {
            // Transform Supabase data to match Property type
            const transformedData = data.map((item: PropertyData) => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              address: item.address || '',
              location: item.location as [number, number],
              boundaries: item.boundaries as Array<Array<[number, number]>>
            }));
            
            startTransition(() => {
              setProperties(transformedData);
              setSelectedProperty(transformedData[0] || null);
            });
          } else {
            startTransition(() => {
              setProperties(mockProperties);
              setSelectedProperty(mockProperties[0] || null);
            });
          }
        } else {
          startTransition(() => {
            setProperties(mockProperties);
            setSelectedProperty(mockProperties[0] || null);
          });
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        startTransition(() => {
          setProperties(mockProperties);
          setSelectedProperty(mockProperties[0] || null);
        });
      }
    };
    
    fetchProperties();
  }, []);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Block searching for "Main Office"
    const value = e.target.value;
    if (value.toLowerCase().includes('main office')) {
      toast.error('This property cannot be searched');
      setSearchQuery('');
      return;
    }
    setSearchQuery(value);
  }, []);
  
  const handleToggleMeasurement = useCallback(() => {
    setIsMeasuring(prev => !prev);
  }, []);

  const handleDeleteProperty = useCallback(async (propertyToDelete: Property) => {
    try {
      // Check if user is deleting a property that's currently selected
      const isSelectedProperty = selectedProperty?.id === propertyToDelete.id;
      
      // First check if this is a mock property (has temp- prefix in ID)
      if (propertyToDelete.id.startsWith('temp-')) {
        // Just remove from local state
        startTransition(() => {
          setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
          
          if (isSelectedProperty) {
            // If deleting the selected property, select another one or null
            const remainingProperties = properties.filter(p => p.id !== propertyToDelete.id);
            setSelectedProperty(remainingProperties.length > 0 ? remainingProperties[0] : null);
          }
        });
        
        toast.success(`Deleted property: ${propertyToDelete.name || propertyToDelete.address}`);
        return;
      }
      
      // Check if user is logged in before trying to delete from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('property_boundaries')
          .delete()
          .eq('id', propertyToDelete.id)
          .eq('user_id', user.id); // Ensure user only deletes their own properties
          
        if (error) {
          console.error('Error deleting property:', error);
          toast.error('Failed to delete property');
          return;
        }
      }
      
      // Remove from local state
      startTransition(() => {
        setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
        
        if (isSelectedProperty) {
          // If deleting the selected property, select another one or null
          const remainingProperties = properties.filter(p => p.id !== propertyToDelete.id);
          setSelectedProperty(remainingProperties.length > 0 ? remainingProperties[0] : null);
        }
      });
      
      toast.success(`Deleted property: ${propertyToDelete.name || propertyToDelete.address}`);
    } catch (error) {
      console.error('Error in handleDeleteProperty:', error);
      toast.error('An error occurred while deleting the property');
    }
  }, [selectedProperty, properties]);
  
  const handleAddressBoundarySearch = useCallback(async (address: string) => {
    setIsSearchingAddress(true);
    
    try {
      const result = await searchAddressAndFetchBoundary(address);
      
      if (!result) {
        toast.error(`No property boundary found for ${address}`);
        return;
      }

      // Extract the boundary ring from the geometry
      const boundaryRing = result.geometry.rings[0];
      
      // Calculate boundary measurements
      const segmentLengths: { length: number; coordinates: [number, number][] }[] = [];
      let totalLength = 0;
      
      // Calculate length of each segment and total perimeter
      for (let i = 0; i < boundaryRing.length - 1; i++) {
        const point1 = boundaryRing[i];
        const point2 = boundaryRing[i + 1];
        
        // Calculate Euclidean distance (this is a simplification - for a more accurate
        // calculation, we would use the Haversine formula for geographic coordinates)
        const length = Math.sqrt(
          Math.pow(point2[0] - point1[0], 2) + 
          Math.pow(point2[1] - point1[1], 2)
        );
        
        // Convert to meters (this is an approximation based on the coordinate system)
        const lengthInMeters = length * 111319.9; // Approx meters per degree at the equator
        
        segmentLengths.push({
          length: lengthInMeters,
          coordinates: [point1, point2]
        });
        
        totalLength += lengthInMeters;
      }
      
      // Create a property object from the result with measurement data
      const newProperty: Property = {
        id: `temp-${Date.now()}`,
        name: result.address || address,
        description: "Property from address search",
        address: result.address || address,
        location: [
          boundaryRing[0][0],
          boundaryRing[0][1]
        ],
        boundaries: [
          boundaryRing.map((point: number[]): [number, number] => [point[0], point[1]])
        ],
        measurements: {
          totalLength: totalLength,
          segments: segmentLengths.map(segment => ({
            length: segment.length,
            coordinates: segment.coordinates
          })),
          area: calculatePolygonArea(boundaryRing)
        }
      };

      // Add to properties list
      setProperties(prev => [newProperty, ...prev]);
      
      // Select the new property
      setSelectedProperty(newProperty);
      
      // Automatically toggle measurement mode on
      setIsMeasuring(true);
      
      // Show success message with measurement info
      toast.success(
        `Found property boundary for ${result.address || address}\n` +
        `Total perimeter: ${(totalLength).toFixed(2)}m\n` +
        `Area: ${(newProperty.measurements?.area || 0).toFixed(2)}m²`,
        { duration: 5000 }
      );
      
      // Save the property if user is authenticated
      const savedProperty = await savePropertyToSupabase(newProperty);
      if (savedProperty) {
        // Update the property with the saved ID
        const updatedProperty = {
          ...newProperty,
          id: savedProperty.id
        };
        
        setProperties(prev => 
          prev.map(p => p.id === newProperty.id ? updatedProperty : p)
        );
        setSelectedProperty(updatedProperty);
      }
    } catch (error) {
      console.error('Error searching property by address:', error);
      toast.error(`Failed to find property boundary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSearchingAddress(false);
    }
  }, []);
  
  return {
    properties,
    selectedProperty,
    uploadedFile,
    searchQuery,
    isMeasuring,
    isLoading,
    isPending,
    isSearchingAddress,
    handlePropertySelect,
    handleFileUpload,
    handleFileRemove,
    handleSearchChange,
    handleToggleMeasurement,
    savePropertyToSupabase,
    handleDeleteProperty,
    handleAddressBoundarySearch
  };
};

// Add this helper function for calculating polygon area if it doesn't exist already
function calculatePolygonArea(points: number[][]) {
  let area = 0;
  
  // Apply the Shoelace formula for polygon area calculation
  for (let i = 0; i < points.length - 1; i++) {
    area += points[i][0] * points[i + 1][1] - points[i + 1][0] * points[i][1];
  }
  
  // Close the polygon loop
  area += points[points.length - 1][0] * points[0][1] - points[0][0] * points[points.length - 1][1];
  
  // Take the absolute value and scale
  area = Math.abs(area) / 2;
  
  // Convert to square meters (approximate conversion based on coordinate system)
  return area * 111319.9 * 111319.9; // Square meters per square degree at the equator
}
