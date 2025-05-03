import { supabase } from '@/integrations/supabase/client';
import { Property } from '../types';
import { 
  mockGetPropertyBoundaries, 
  mockGetAdvancedPropertyBoundaries 
} from './mockArcGIS';
import {
  directPropertyBoundariesByAddress,
  directPropertyBoundariesByComponents
} from './directArcGISService';
import { getArcGISToken } from '../utils/arcgisToken';

// Environment detection - helps determine if we should use mock data
const isDevelopment = process.env.NODE_ENV === 'development';
const hasDirectToken = !!getArcGISToken();

/**
 * Get property boundaries by address
 * @param address Full address string
 * @returns Property boundaries data
 */
export const getPropertyBoundariesByAddress = async (address: string) => {
  try {
    if (!address.trim()) {
      return { data: null, error: 'Address is required' };
    }
    
    // If we have a direct token in the browser, use it instead of Edge Function
    if (isDevelopment && hasDirectToken) {
      console.log('Using direct ArcGIS API with token for address search...');
      const result = await directPropertyBoundariesByAddress(address);
      if (result.data) {
        const processedData = processArcGISResponse(result.data);
        return { data: processedData, error: null };
      }
      // If direct API fails, fall back to mock data
      if (isDevelopment) {
        console.log('Direct API failed, using mock data...');
        return await mockGetAdvancedPropertyBoundaries(address);
      }
      return result;
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('arcgis-boundaries', {
      body: { address }
    });

    if (error) {
      console.error('Error getting property boundaries by address:', error);
      
      // If we're in development, fall back to mock data
      if (isDevelopment) {
        console.log('Using mock data for address boundaries in development...');
        const mockResult = await mockGetAdvancedPropertyBoundaries(address);
        
        // Mock data is already processed, no need to call processArcGISResponse
        return mockResult;
      }
      
      return { data: null, error: error.message };
    }

    // Process the response data to extract boundary information
    const processedData = processArcGISResponse(data);
    
    return { data: processedData, error: null };
  } catch (error) {
    console.error('Error in property boundary service:', error);
    
    // If we're in development, fall back to mock data
    if (isDevelopment) {
      console.log('Using mock data for address boundaries after error...');
      const mockResult = await mockGetAdvancedPropertyBoundaries(address);
      
      // Mock data is already processed, no need to call processArcGISResponse
      return mockResult;
    }
    
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
  try {
    if (!houseNumber || !streetName) {
      return { data: null, error: 'House number and street name are required' };
    }
    
    // If we have a direct token in the browser, use it instead of Edge Function
    if (isDevelopment && hasDirectToken) {
      console.log('Using direct ArcGIS API with token for component search...');
      const result = await directPropertyBoundariesByComponents(
        houseNumber, 
        streetName, 
        suburb, 
        postcode
      );
      if (result.data) {
        const processedData = processArcGISResponse(result.data);
        return { data: processedData, error: null };
      }
      // If direct API fails, fall back to mock data
      if (isDevelopment) {
        console.log('Direct API failed, using mock data...');
        return await mockGetPropertyBoundaries(
          undefined, 
          houseNumber, 
          streetName, 
          suburb, 
          postcode
        );
      }
      return result;
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('arcgis-boundaries', {
      body: { houseNumber, streetName, suburb, postcode }
    });

    if (error) {
      console.error('Error getting property boundaries by components:', error);
      
      // If we're in development, fall back to mock data
      if (isDevelopment) {
        console.log('Using mock data for component boundaries in development...');
        return await mockGetPropertyBoundaries(
          undefined, 
          houseNumber, 
          streetName, 
          suburb, 
          postcode
        );
      }
      
      return { data: null, error: error.message };
    }

    // Process the response data to extract boundary information
    const processedData = processArcGISResponse(data);
    
    return { data: processedData, error: null };
  } catch (error) {
    console.error('Error in property boundary service:', error);
    
    // If we're in development, fall back to mock data
    if (isDevelopment) {
      console.log('Using mock data for component boundaries after error...');
      return await mockGetPropertyBoundaries(
        undefined, 
        houseNumber, 
        streetName, 
        suburb, 
        postcode
      );
    }
    
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Get property boundaries by location coordinates
 * @param location [longitude, latitude] coordinates
 * @returns Property boundaries data
 */
export const getPropertyBoundariesByLocation = async (location: [number, number]) => {
  try {
    if (!location || location.length !== 2) {
      return { data: null, error: 'Valid location coordinates are required' };
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('arcgis-boundaries', {
      body: { location: { x: location[0], y: location[1] } }
    });

    if (error) {
      console.error('Error getting property boundaries by location:', error);
      
      // If we're in development, fall back to mock data
      if (isDevelopment) {
        console.log('Using mock data for location boundaries in development...');
        return await mockGetAdvancedPropertyBoundaries(`${location[1]}, ${location[0]}`);
      }
      
      return { data: null, error: error.message };
    }

    // Process the response data to extract boundary information
    const processedData = processArcGISResponse(data);
    
    return { data: processedData, error: null };
  } catch (error) {
    console.error('Error in property boundary service:', error);
    
    // If we're in development, fall back to mock data
    if (isDevelopment) {
      console.log('Using mock data for location boundaries after error...');
      return await mockGetAdvancedPropertyBoundaries(`${location[1]}, ${location[0]}`);
    }
    
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Process the ArcGIS response to extract property information
 * @param arcgisResponse Raw response from ArcGIS API
 * @returns Processed property data
 */
const processArcGISResponse = (arcgisResponse: any) => {
  console.log('Processing ArcGIS response:', arcgisResponse);
  
  // Handle response from full address search which contains both geocode and boundaries
  if (arcgisResponse.geocode && arcgisResponse.boundaries) {
    console.log('Processing combined geocode and boundaries response');
    const { geocode, boundaries } = arcgisResponse;
    
    // Extract boundary information from features
    if (boundaries.features && boundaries.features.length > 0) {
      console.log('Found boundary features:', boundaries.features.length);
      const feature = boundaries.features[0];
      
      // Extract boundary coordinates
      const boundaryCoordinates = extractBoundaryCoordinates(feature.geometry);
      
      // Extract address details
      const address = geocode.address || '';
      const location: [number, number] = [geocode.location.x, geocode.location.y];
      
      // Build a structured property object
      const result = {
        boundary: {
          coordinates: boundaryCoordinates,
          type: feature.geometry.type || 'Polygon'
        },
        properties: feature.attributes,
        location,
        address,
        // Add any additional info needed for display
        display: {
          address: geocode.address,
          score: geocode.score,
          location_type: geocode.location_type
        }
      };
      
      console.log('Processed combined result:', result);
      return result;
    } else {
      console.warn('No boundary features found in combined response');
      // Create a fallback boundary
      const size = 0.0004; // Roughly 50 meters
      const centerX = geocode.location.x;
      const centerY = geocode.location.y;
      
      const fallbackBoundary = [
        [
          [centerX - size, centerY - size],
          [centerX + size, centerY - size],
          [centerX + size, centerY + size],
          [centerX - size, centerY + size],
          [centerX - size, centerY - size]
        ]
      ];
      
      // Create fallback result
      const result = {
        boundary: {
          coordinates: fallbackBoundary,
          type: 'Polygon'
        },
        properties: {
          address: geocode.address
        },
        location: [geocode.location.x, geocode.location.y] as [number, number],
        address: geocode.address || '',
        display: {
          address: geocode.address,
          score: geocode.score,
          location_type: geocode.location_type
        }
      };
      
      console.log('Created fallback result for combined response:', result);
      return result;
    }
  }
  
  // Handle direct query responses (address components or location)
  if (arcgisResponse.features && arcgisResponse.features.length > 0) {
    console.log('Processing direct features response, found features:', arcgisResponse.features.length);
    const features = arcgisResponse.features;
    
    return features.map((feature: any) => {
      // Extract boundary coordinates
      const boundaryCoordinates = extractBoundaryCoordinates(feature.geometry);
      
      // Extract location point (usually centroid)
      let location: [number, number] = [0, 0];
      if (feature.geometry && feature.geometry.rings && feature.geometry.rings.length > 0) {
        // Calculate centroid from the first ring
        const ring = feature.geometry.rings[0];
        const sumX = ring.reduce((sum: number, point: number[]) => sum + point[0], 0);
        const sumY = ring.reduce((sum: number, point: number[]) => sum + point[1], 0);
        location = [sumX / ring.length, sumY / ring.length];
      }
      
      // Construct address from attributes if available
      let address = '';
      if (feature.attributes) {
        const attrs = feature.attributes;
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
      
      // For consistency with other code that expects specific format
      const processedFeature = {
        boundary: {
          coordinates: boundaryCoordinates,
          type: feature.geometry.type || 'Polygon'
        },
        properties: feature.attributes,
        location,
        address,
        // Raw geometry for rendering
        geometry: feature.geometry
      };
      
      console.log('Processed feature:', processedFeature);
      return processedFeature;
    });
  }
  
  console.warn('No recognizable format in ArcGIS response, returning null');
  // Return empty result if no features found
  return null;
};

/**
 * Extract boundary coordinates from ArcGIS geometry
 * @param geometry ArcGIS geometry object
 * @returns Array of coordinate arrays for each boundary part
 */
const extractBoundaryCoordinates = (geometry: any): Array<Array<[number, number]>> => {
  if (!geometry) return [];
  
  // Handle polygon geometry (most common for property boundaries)
  if (geometry.rings && geometry.rings.length > 0) {
    return geometry.rings.map((ring: number[][]) => 
      ring.map((point: number[]): [number, number] => [point[0], point[1]])
    );
  }
  
  // Handle polyline geometry
  if (geometry.paths && geometry.paths.length > 0) {
    return geometry.paths.map((path: number[][]) => 
      path.map((point: number[]): [number, number] => [point[0], point[1]])
    );
  }
  
  // Handle point geometry
  if (geometry.x !== undefined && geometry.y !== undefined) {
    return [[[geometry.x, geometry.y]]];
  }
  
  return [];
};

/**
 * Save a property boundary to the database
 * @param property Property data to save
 * @returns Result of the save operation
 */
export const savePropertyBoundary = async (property: Partial<Property>) => {
  try {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'You must be logged in to save properties' };
    }
    
    // Prepare data for Supabase
    const propertyData = {
      name: property.name || 'Unnamed Property',
      description: property.description || '',
      address: property.address || '',
      location: property.location || [0, 0],
      boundaries: property.boundaries || [],
      user_id: user.id
    };
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('property_boundaries')
      .insert([propertyData])
      .select();
      
    if (error) {
      console.error('Error saving property:', error);
      return { data: null, error: error.message };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in save property service:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}; 