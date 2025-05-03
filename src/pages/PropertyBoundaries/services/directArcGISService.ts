import { appendArcGISToken, withArcGISToken } from '../utils/arcgisToken';

// Brisbane Property Boundaries FeatureServer URL
const BRISBANE_PROPERTY_URL = "https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/property_boundaries_holding/FeatureServer/0";

// Brisbane Roads/Streets FeatureServer URL (for identifying front/back of house)
const BRISBANE_ROADS_URL = "https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Road_corridor/FeatureServer/0";

/**
 * Direct geocode service using ArcGIS
 * @param address Address to geocode
 * @returns Geocoded results
 */
export const directGeocode = async (address: string) => {
  try {
    if (!address.trim()) {
      return { data: null, error: 'Address is required' };
    }

    const geocodeUrl = appendArcGISToken(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(address)}&outFields=*&maxLocations=5&forStorage=false`
    );

    const response = await fetch(geocodeUrl, withArcGISToken());
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in direct geocode service:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Direct property boundaries using ArcGIS for an address
 * @param address Address to search for
 * @returns Property boundary data
 */
export const directPropertyBoundariesByAddress = async (address: string) => {
  try {
    console.log('Starting direct property boundaries search for address:', address);
    
    // First geocode the address
    const { data: geocodeData, error: geocodeError } = await directGeocode(address);
    
    if (geocodeError || !geocodeData?.candidates?.length) {
      console.error('Geocoding failed or no candidates found:', geocodeError);
      return { data: null, error: geocodeError || 'No matching addresses found' };
    }
    
    console.log('Geocode succeeded with candidates:', geocodeData.candidates.length);
    
    // Use the first candidate
    const candidate = geocodeData.candidates[0];
    const location = candidate.location;
    
    console.log('Using location for boundary search:', location);
    
    // Now query for property boundaries using point
    const boundaryUrl = appendArcGISToken(
      `${BRISBANE_PROPERTY_URL}/query?f=json&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&where=1=1&outFields=*&returnGeometry=true&geometry=${encodeURIComponent(JSON.stringify({
        x: location.x,
        y: location.y,
        spatialReference: { wkid: 4326 }
      }))}&inSR=4326&outSR=4326`
    );
    
    console.log('Requesting boundary data with URL (token hidden):', boundaryUrl.replace(/token=[^&]+/, 'token=HIDDEN'));
    
    const response = await fetch(boundaryUrl, withArcGISToken());
    
    if (!response.ok) {
      console.error('Boundary API response not OK:', response.status, response.statusText);
      throw new Error(`Property boundary query failed: ${response.statusText}`);
    }
    
    const boundaryData = await response.json();
    console.log('Received boundary data:', boundaryData);
    
    // Check if we actually got features
    if (!boundaryData.features || boundaryData.features.length === 0) {
      console.warn('No boundary features found for this location');
      
      // Create a fallback feature with a small boundary around the point
      const size = 0.0004; // Roughly 50 meters
      const fallbackFeature = {
        geometry: {
          rings: [[
            [location.x - size, location.y - size],
            [location.x + size, location.y - size],
            [location.x + size, location.y + size],
            [location.x - size, location.y + size],
            [location.x - size, location.y - size]
          ]],
          spatialReference: { wkid: 4326 }
        },
        attributes: {
          OBJECTID: 0,
          HOUSE_NUMBER: candidate.attributes?.House || '',
          STREET_NAME: candidate.attributes?.Street || '',
          SUBURB: candidate.attributes?.City || '',
          POSTCODE: candidate.attributes?.Postal || '',
        }
      };
      
      console.log('Created fallback boundary:', fallbackFeature);
      boundaryData.features = [fallbackFeature];
    }
    
    // Return combined results
    const result = { 
      data: {
        geocode: candidate,
        boundaries: boundaryData
      },
      error: null 
    };
    
    console.log('Returning final result with features:', 
      boundaryData.features ? boundaryData.features.length : 0);
    
    return result;
  } catch (error) {
    console.error('Error in direct property boundary service:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Direct property boundaries using ArcGIS by components
 * @param houseNumber House number
 * @param streetName Street name
 * @param suburb Suburb (optional)
 * @param postcode Postcode (optional)
 * @returns Property boundary data
 */
export const directPropertyBoundariesByComponents = async (
  houseNumber: string,
  streetName: string,
  suburb?: string,
  postcode?: string
) => {
  try {
    // Build a query to find the property by address components
    let queryString = "";
    
    if (houseNumber) {
      queryString += `HOUSE_NUMBER = ${houseNumber} `;
    }
    
    if (streetName) {
      // Remove suffixes like St, Road etc for better matching
      const streetBase = streetName.includes(' ') ? streetName.split(' ')[0] : streetName;
      if (queryString) {
        queryString += "AND ";
      }
      queryString += `CORRIDOR_NAME LIKE '%${streetBase}%' `;
    }
    
    if (suburb) {
      if (queryString) {
        queryString += "AND ";
      }
      queryString += `SUBURB LIKE '%${suburb}%' `;
    }
    
    if (postcode) {
      if (queryString) {
        queryString += "AND ";
      }
      queryString += `POSTCODE = ${postcode} `;
    }
    
    // Execute query against Brisbane property boundaries
    const url = appendArcGISToken(
      `${BRISBANE_PROPERTY_URL}/query?f=json&where=${encodeURIComponent(queryString)}&outFields=*&returnGeometry=true`
    );
    
    const response = await fetch(url, withArcGISToken());
    
    if (!response.ok) {
      throw new Error(`Property component query failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in direct component boundary service:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}; 