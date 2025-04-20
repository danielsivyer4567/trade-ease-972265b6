import { useState, useCallback, useEffect, useTransition } from 'react';
import { Property } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

export const usePropertyBoundaries = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
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
              .map((item): Property => ({
                id: item.id,
                name: item.name,
                description: item.description || '',
                address: item.address || '',
                location: item.location,
                boundaries: item.boundaries
              }))
              // Filter out any property with the name "Main Office"
              .filter(property => property.name !== 'Main Office');
            
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
              location: [centerLat, centerLng],
              boundaries: coords
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
            const transformedData = data.map((item): Property => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              address: item.address || '',
              location: item.location,
              boundaries: item.boundaries
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
  
  return {
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
    savePropertyToSupabase,
    handleDeleteProperty
  };
};
