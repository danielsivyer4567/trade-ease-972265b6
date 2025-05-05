/**
 * Mock boundary service that provides sample property boundaries data
 * This replaces all ArcGIS-dependent functionality with static mock data
 */

import { Property } from '../types';

// Sample mock properties for development and testing
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Central Business Property',
    description: 'Office building in central location',
    address: '123 Main Street, Brisbane QLD 4000, Australia',
    location: [-27.4698, 153.0251],
    boundaries: [
      [
        [-27.4698, 153.0251],
        [-27.4701, 153.0256],
        [-27.4707, 153.0252],
        [-27.4704, 153.0247],
        [-27.4698, 153.0251]
      ]
    ]
  },
  {
    id: '2',
    name: 'Suburban Residence',
    description: 'Residential property in quiet suburb',
    address: '45 Exhibition Street, Melbourne VIC 3000',
    location: [-37.8136, 144.9631],
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
  },
  {
    id: '4',
    name: 'Retail Space',
    description: 'Corner retail location with parking',
    address: '25 Pitt Street, Sydney NSW 2000',
    location: [-33.8636, 151.2092],
    boundaries: [
      [
        [-33.8636, 151.2092],
        [-33.8640, 151.2098],
        [-33.8646, 151.2094],
        [-33.8642, 151.2088],
        [-33.8636, 151.2092]
      ]
    ]
  },
  {
    id: '5',
    name: 'Industrial Park',
    description: 'Manufacturing and industry complex',
    address: '375 William Street, Perth WA 6000',
    location: [-31.9505, 115.8605],
    boundaries: [
      [
        [-31.9505, 115.8605],
        [-31.9510, 115.8615],
        [-31.9520, 115.8610],
        [-31.9515, 115.8600],
        [-31.9505, 115.8605]
      ]
    ]
  }
];

/**
 * Get property boundaries by address
 * @param address Full address string
 * @returns Property boundaries data
 */
export const getPropertyBoundariesByAddress = async (address: string) => {
  try {
    console.log('Searching mock boundaries for address:', address);
    const searchTerms = address.toLowerCase().split(/[\s,]+/);
    
    // Find a property that matches some of the search terms
    const matchedProperty = mockProperties.find(property => {
      const propertyTerms = property.address.toLowerCase().split(/[\s,]+/);
      return searchTerms.some(term => 
        term.length > 2 && propertyTerms.some(propTerm => propTerm.includes(term))
      );
    });
    
    if (matchedProperty) {
      console.log('Found matching mock property:', matchedProperty.name);
      return { data: matchedProperty, error: null };
    }
    
    // No match found, create a synthetic property based on the search
    const syntheticProperty: Property = {
      id: `gen-${Date.now().toString(36)}`,
      name: `Property at ${address}`,
      description: 'Generated property',
      address: address,
      location: [-27.5 + Math.random() * 0.1, 153 + Math.random() * 0.1], // Random location near Brisbane
      boundaries: [
        [
          [-27.5 + Math.random() * 0.1, 153 + Math.random() * 0.1],
          [-27.5 + Math.random() * 0.1, 153.01 + Math.random() * 0.1],
          [-27.51 + Math.random() * 0.1, 153.01 + Math.random() * 0.1],
          [-27.51 + Math.random() * 0.1, 153 + Math.random() * 0.1],
          [-27.5 + Math.random() * 0.1, 153 + Math.random() * 0.1]
        ]
      ]
    };
    
    console.log('Created synthetic property for:', address);
    return { data: syntheticProperty, error: null };
  } catch (error) {
    console.error('Error in mock property boundary service:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Get property boundaries by address components
 * @param houseNumber House number
 * @param streetName Street name
 * @param suburb Suburb (optional)
 * @param postcode Postcode (optional)
 * @returns Property boundaries data
 */
export const getPropertyBoundariesByComponents = async (
  houseNumber: string,
  streetName: string,
  suburb?: string,
  postcode?: string
) => {
  // Combine components into an address and use the address search
  const address = `${houseNumber} ${streetName}${suburb ? `, ${suburb}` : ''}${postcode ? ` ${postcode}` : ''}`;
  return getPropertyBoundariesByAddress(address);
};

/**
 * Get property boundaries by location coordinates
 * @param location [longitude, latitude] coordinates
 * @returns Property boundaries data
 */
export const getPropertyBoundariesByLocation = async (location: [number, number]) => {
  try {
    console.log('Searching mock boundaries for location:', location);
    
    // Find the closest property to the given coordinates
    let closestProperty = mockProperties[0];
    let closestDistance = calculateDistance(
      location[0], location[1], 
      closestProperty.location[0], closestProperty.location[1]
    );
    
    for (let i = 1; i < mockProperties.length; i++) {
      const property = mockProperties[i];
      const distance = calculateDistance(
        location[0], location[1], 
        property.location[0], property.location[1]
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestProperty = property;
      }
    }
    
    console.log('Found closest mock property:', closestProperty.name);
    return { data: closestProperty, error: null };
  } catch (error) {
    console.error('Error in mock property boundary service:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Helper function to calculate distance between two points
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Mock function to simulate address search
 */
export const searchAddress = async (query: string) => {
  try {
    console.log('Mock address search for:', query);
    
    // Generate 3 fake candidates based on the query
    const candidates = [
      {
        address: query,
        location: {
          x: 153 + Math.random() * 0.1,
          y: -27.5 + Math.random() * 0.1
        },
        score: 95 + Math.random() * 5
      },
      {
        address: query.replace(/(\d+)/, (m) => (parseInt(m) + 2).toString()),
        location: {
          x: 153 + Math.random() * 0.1,
          y: -27.5 + Math.random() * 0.1
        },
        score: 85 + Math.random() * 10
      },
      {
        address: query + ' EAST',
        location: {
          x: 153.02 + Math.random() * 0.1,
          y: -27.48 + Math.random() * 0.1
        },
        score: 75 + Math.random() * 10
      }
    ];
    
    return { 
      data: { candidates },
      error: null 
    };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Save property boundary to database
 */
export const savePropertyBoundary = async (property: Partial<Property>) => {
  // In a real app, this would save to a database
  console.log('Mock saving property boundary:', property);
  
  // Return the same property with an ID
  const savedProperty = {
    ...property,
    id: property.id || `gen-${Date.now().toString(36)}`
  } as Property;
  
  return { data: savedProperty, error: null };
}; 