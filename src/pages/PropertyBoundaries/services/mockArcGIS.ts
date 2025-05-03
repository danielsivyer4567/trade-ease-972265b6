/**
 * Mock ArcGIS responses for development
 * This provides a fallback when the API key is not available
 */

// Mock geocoding response for an address search
export const mockGeocodeResponse = {
  spatialReference: { wkid: 4326 },
  candidates: [
    {
      address: "123 Example Street, Brisbane QLD 4000",
      location: { x: 152.9814, y: -27.4698 },
      score: 100,
      attributes: {
        Match_addr: "123 Example Street, Brisbane QLD 4000",
        House: "123",
        Street: "Example Street",
        City: "Brisbane",
        Postal: "4000",
        Region: "QLD"
      }
    },
    {
      address: "123 Sample Road, Brisbane QLD 4000",
      location: { x: 152.9875, y: -27.4710 },
      score: 95,
      attributes: {
        Match_addr: "123 Sample Road, Brisbane QLD 4000",
        House: "123",
        Street: "Sample Road",
        City: "Brisbane",
        Postal: "4000",
        Region: "QLD"
      }
    }
  ]
};

// Mock property boundary response
export const mockBoundaryResponse = {
  features: [
    {
      geometry: {
        rings: [
          [
            [152.9814, -27.4698],
            [152.9818, -27.4698],
            [152.9818, -27.4702],
            [152.9814, -27.4702],
            [152.9814, -27.4698]
          ]
        ],
        spatialReference: { wkid: 4326 }
      },
      attributes: {
        OBJECTID: 1,
        HOUSE_NUMBER: "123",
        HOUSE_NUMBER_SUFFIX: "",
        CORRIDOR_NAME: "Example",
        CORRIDOR_SUFFIX_CODE: "Street",
        SUBURB: "Brisbane",
        POSTCODE: "4000",
        LAND_USE: "Residential",
        LOT_AREA: "450",
        Shape__Length: 0.0008,
        Shape__Area: 0.00000016
      }
    }
  ]
};

// Mock search function that returns mock data based on search query
export const mockSearchAddress = async (searchQuery: string) => {
  console.log(`Mock searching for address: ${searchQuery}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Customize mock response based on search query
  const customizedResponse = {
    ...mockGeocodeResponse,
    candidates: mockGeocodeResponse.candidates.map(candidate => ({
      ...candidate,
      address: searchQuery || candidate.address
    }))
  };
  
  return { data: customizedResponse, error: null };
};

// Mock function to get property boundaries
export const mockGetPropertyBoundaries = async (
  address?: string,
  houseNumber?: string,
  streetName?: string,
  suburb?: string,
  postcode?: string
) => {
  console.log(`Mock getting property boundaries for: ${address || `${houseNumber} ${streetName}, ${suburb} ${postcode}`}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a customized response with the input address
  const customizedBoundary = {
    ...mockBoundaryResponse,
    features: mockBoundaryResponse.features.map(feature => ({
      ...feature,
      attributes: {
        ...feature.attributes,
        HOUSE_NUMBER: houseNumber || "123",
        CORRIDOR_NAME: streetName?.split(' ')[0] || "Example",
        CORRIDOR_SUFFIX_CODE: streetName?.includes(' ') ? 
          streetName.substring(streetName.indexOf(' ') + 1) : "Street",
        SUBURB: suburb || "Brisbane",
        POSTCODE: postcode || "4000"
      }
    }))
  };
  
  return { data: customizedBoundary, error: null };
};

// Function to randomly generate property boundary coordinates around a center point
export const generateRandomBoundary = (centerX: number, centerY: number, size: number = 0.0004) => {
  const points = [];
  
  // Generate 4 points for a simple rectangle
  points.push([centerX - size, centerY - size]);
  points.push([centerX + size, centerY - size]);
  points.push([centerX + size, centerY + size]);
  points.push([centerX - size, centerY + size]);
  points.push([centerX - size, centerY - size]); // Close the polygon
  
  return points;
};

// Mock function to simulate more realistic property boundaries
export const mockGetAdvancedPropertyBoundaries = async (address: string) => {
  console.log(`Mock getting advanced property boundaries for: ${address}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a random center point in Brisbane area
  const centerX = 152.9814 + (Math.random() - 0.5) * 0.01;
  const centerY = -27.4698 + (Math.random() - 0.5) * 0.01;
  
  // Generate a random boundary around this center
  const boundary = generateRandomBoundary(centerX, centerY);
  
  // Extract address components or generate placeholders
  let houseNumber = "123";
  let streetName = "Example Street";
  let suburb = "Brisbane";
  let postcode = "4000";
  
  // Try to extract house number
  const houseNumMatch = address.match(/^(\d+)/);
  if (houseNumMatch) {
    houseNumber = houseNumMatch[1];
  }
  
  // Try to extract street name
  const streetMatch = address.match(/^\d+\s+([^,]+)/);
  if (streetMatch) {
    streetName = streetMatch[1];
  }
  
  // Try to extract suburb
  const suburbMatch = address.match(/,\s*([^,]+)/);
  if (suburbMatch) {
    suburb = suburbMatch[1];
  }
  
  // Try to extract postcode
  const postcodeMatch = address.match(/\b(\d{4})\b/);
  if (postcodeMatch) {
    postcode = postcodeMatch[1];
  }
  
  // Format in the style our UI expects from the ArcGIS API
  const mockPropertyData = {
    // This is the direct ArcGIS-style format
    features: [
      {
        geometry: {
          rings: [boundary],
          spatialReference: { wkid: 4326 }
        },
        attributes: {
          OBJECTID: Math.floor(Math.random() * 10000),
          HOUSE_NUMBER: houseNumber,
          HOUSE_NUMBER_SUFFIX: "",
          CORRIDOR_NAME: streetName.split(' ')[0],
          CORRIDOR_SUFFIX_CODE: streetName.includes(' ') ? 
            streetName.substring(streetName.indexOf(' ') + 1) : "Street",
          SUBURB: suburb,
          POSTCODE: postcode,
          LAND_USE: Math.random() > 0.5 ? "Residential" : "Commercial",
          LOT_AREA: Math.floor(Math.random() * 1000 + 300).toString(),
          Shape__Length: 0.0008,
          Shape__Area: 0.00000016
        }
      }
    ]
  };
  
  // Also create the processed format that matches what we get after processing in our service
  const processedFormat = {
    // This will be used by the UI
    boundary: {
      coordinates: [boundary],
      type: "Polygon"
    },
    properties: mockPropertyData.features[0].attributes,
    location: { x: centerX, y: centerY },
    address: `${houseNumber} ${streetName}, ${suburb} ${postcode}`,
    // Raw geometry for rendering
    geometry: mockPropertyData.features[0].geometry
  };
  
  // Create an array of one result
  return { data: [processedFormat], error: null };
}; 