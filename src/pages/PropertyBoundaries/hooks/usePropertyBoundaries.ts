import { useState, useCallback, useEffect, useTransition } from 'react';
import { Property } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  getPropertyBoundariesByAddress, 
  getPropertyBoundariesByComponents,
  savePropertyBoundary 
} from '../services/propertyBoundaryService';
import { searchAddress } from '../services/geocodeService';

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
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
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
  
  /**
   * Search for a property by address
   */
  const handleAddressSearch = useCallback(async (address: string) => {
    if (!address.trim()) {
      toast.error('Please enter an address to search');
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // First, geocode the address to find its location
      const geocodeResult = await searchAddress(address);
      
      if (geocodeResult.error) {
        toast.error(`Geocoding error: ${geocodeResult.error}`);
        return;
      }
      
      if (!geocodeResult.data || !geocodeResult.data.candidates || geocodeResult.data.candidates.length === 0) {
        toast.error('No addresses found. Please try a different search.');
        return;
      }
      
      // We found some addresses, now get property boundaries for each one
      const candidates = geocodeResult.data.candidates;
      
      // Get property boundaries for the top result
      const topCandidate = candidates[0];
      const { data: boundaryData, error: boundaryError } = await getPropertyBoundariesByAddress(topCandidate.address);
      
      if (boundaryError) {
        toast.error(`Error fetching property boundaries: ${boundaryError}`);
        return;
      }
      
      if (!boundaryData) {
        toast.error('No property boundaries found for this address.');
        return;
      }
      
      // If we have multiple properties, show them all
      if (Array.isArray(boundaryData)) {
        setSearchResults(boundaryData);
        toast.success(`Found ${boundaryData.length} properties`);
      } else {
        // If we have a single property, add it to results
        setSearchResults([boundaryData]);
        toast.success('Found property boundaries');
      }
    } catch (error) {
      console.error('Error in address search:', error);
      toast.error('An error occurred during the search');
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  /**
   * Search for a property by address components
   */
  const handleAddressComponentSearch = useCallback(async (
    houseNumber: string,
    streetName: string,
    suburb?: string,
    postcode?: string
  ) => {
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const { data, error } = await getPropertyBoundariesByComponents(
        houseNumber,
        streetName,
        suburb,
        postcode
      );
      
      if (error) {
        toast.error(`Error: ${error}`);
        return;
      }
      
      if (!data) {
        toast.error('No property boundaries found for these address details.');
        return;
      }
      
      // Handle results
      if (Array.isArray(data)) {
        setSearchResults(data);
        toast.success(`Found ${data.length} properties`);
      } else {
        setSearchResults([data]);
        toast.success('Found property boundaries');
      }
    } catch (error) {
      console.error('Error in component search:', error);
      toast.error('An error occurred during the search');
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  /**
   * Convert property boundary search result to Property type
   */
  const createPropertyFromBoundary = useCallback((boundaryData: any, name: string = ''): Property => {
    // Check if the boundary data is properly structured
    console.log('Creating property from boundary data:', boundaryData);
    
    // Extract coordinates for the property boundary
    let boundaries: Array<Array<[number, number]>> = [];
    
    if (boundaryData.boundary && boundaryData.boundary.coordinates) {
      boundaries = boundaryData.boundary.coordinates;
    } else if (boundaryData.geometry && boundaryData.geometry.rings) {
      // Direct geometry from ArcGIS
      boundaries = boundaryData.geometry.rings;
    } else {
      // Create a fallback boundary if none exists
      console.warn('No boundary coordinates found, creating fallback');
      const centerX = boundaryData.location ? boundaryData.location.x : 152.9814;
      const centerY = boundaryData.location ? boundaryData.location.y : -27.4698;
      const size = 0.0004;
      boundaries = [
        [
          [centerX - size, centerY - size],
          [centerX + size, centerY - size],
          [centerX + size, centerY + size],
          [centerX - size, centerY + size],
          [centerX - size, centerY - size]
        ]
      ];
    }
    
    // Use the boundary data location or calculate centroid if not available
    let location: [number, number] = [0, 0];
    
    if (boundaryData.location) {
      location = Array.isArray(boundaryData.location) 
        ? boundaryData.location 
        : [boundaryData.location.x, boundaryData.location.y];
    } else if (boundaries.length > 0 && boundaries[0].length > 0) {
      // Calculate centroid from the first ring
      const ring = boundaries[0];
      const sumX = ring.reduce((sum: number, point: number[]) => sum + point[0], 0);
      const sumY = ring.reduce((sum: number, point: number[]) => sum + point[1], 0);
      location = [sumX / ring.length, sumY / ring.length];
    }
    
    // Extract address from the boundary data
    let address = '';
    if (boundaryData.address) {
      address = boundaryData.address;
    } else if (boundaryData.properties && boundaryData.properties.Match_addr) {
      address = boundaryData.properties.Match_addr;
    } else if (boundaryData.attributes) {
      // Construct from ArcGIS attributes
      const attrs = boundaryData.attributes;
      if (attrs.HOUSE_NUMBER) {
        address += attrs.HOUSE_NUMBER;
        if (attrs.HOUSE_NUMBER_SUFFIX) address += attrs.HOUSE_NUMBER_SUFFIX;
        address += ' ';
      }
      if (attrs.CORRIDOR_NAME) {
        address += attrs.CORRIDOR_NAME;
        if (attrs.CORRIDOR_SUFFIX_CODE) address += ' ' + attrs.CORRIDOR_SUFFIX_CODE;
        address += ', ';
      }
      if (attrs.SUBURB) address += attrs.SUBURB;
      if (attrs.POSTCODE) address += ' ' + attrs.POSTCODE;
    }
    
    // Generate a unique ID for the property
    const id = `tmp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
    
    return {
      id,
      name: name || address || 'New Property',
      description: 'Property from address search',
      location: location,
      boundaries: boundaries,
      address: address || ''
    };
  }, []);
  
  /**
   * Add a property from search results to the properties list
   */
  const handleAddPropertyFromSearch = useCallback((boundaryData: any, name?: string) => {
    try {
      console.log('Adding property from search result:', boundaryData);
      
      const newProperty = createPropertyFromBoundary(boundaryData, name);
      console.log('Created new property:', newProperty);
      
      // Add the property to the list and select it immediately
      startTransition(() => {
        setProperties(prev => [...prev, newProperty]);
        setSelectedProperty(newProperty);
        // Enable measurement mode by default when adding a new property
        setIsMeasuring(true);
      });
      
      toast.success('Property added and selected');
      
      // Try to save to database if user is logged in
      savePropertyBoundary(newProperty)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error saving property:', error);
            toast.error('Property added locally only - could not save to database');
          } else if (data) {
            toast.success('Property saved to database');
            // Update the temporary ID with the database ID
            startTransition(() => {
              setProperties(prev => 
                prev.map(p => p.id === newProperty.id ? { ...p, id: data[0].id } : p)
              );
              
              if (selectedProperty?.id === newProperty.id) {
                setSelectedProperty(prev => prev ? { ...prev, id: data[0].id } : null);
              }
            });
          }
        })
        .catch(err => {
          console.error('Exception during save:', err);
          toast.error('Error saving property to database');
        });
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [properties, selectedProperty, startTransition, createPropertyFromBoundary, setIsMeasuring]);
  
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
    handleDeleteProperty,
    addressSearchQuery,
    isSearching,
    searchResults,
    handleAddressSearch,
    handleAddressComponentSearch,
    handleAddPropertyFromSearch,
    setAddressSearchQuery
  };
};
