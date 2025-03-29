
import { useState, useCallback, useEffect } from 'react';
import { Property } from '../types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Sample mock properties for initial UI rendering when no data is available
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Main Office',
    description: 'Company headquarters location',
    address: '123 Collins Street, Melbourne VIC 3000',
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
            setProperties(mockProperties);
            setSelectedProperty(mockProperties[0] || null);
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
            
            setProperties(transformedData);
            setSelectedProperty(transformedData[0] || null);
            toast.success('Properties loaded successfully');
          } else {
            // If no properties found, use mock data
            setProperties(mockProperties);
            setSelectedProperty(mockProperties[0] || null);
          }
        } else {
          // If user is not logged in, use mock data
          setProperties(mockProperties);
          setSelectedProperty(mockProperties[0] || null);
          toast.warning('Using demo data - log in to save your properties');
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        // Fall back to mock data
        setProperties(mockProperties);
        setSelectedProperty(mockProperties[0] || null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  const handlePropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
    console.log('Selected property:', property);
  }, []);
  
  // Extract address from GeoJSON properties with better fallbacks
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
            setProperties(prev => [...prev, ...newProperties]);
            setSelectedProperty(newProperties[0]);
            
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
            setProperties(mockProperties);
            setSelectedProperty(mockProperties[0] || null);
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
            
            setProperties(transformedData);
            setSelectedProperty(transformedData[0] || null);
          } else {
            setProperties(mockProperties);
            setSelectedProperty(mockProperties[0] || null);
          }
        } else {
          setProperties(mockProperties);
          setSelectedProperty(mockProperties[0] || null);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setProperties(mockProperties);
        setSelectedProperty(mockProperties[0] || null);
      }
    };
    
    fetchProperties();
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
    isLoading,
    handlePropertySelect,
    handleFileUpload,
    handleFileRemove,
    handleSearchChange,
    handleToggleMeasurement,
    savePropertyToSupabase
  };
};
