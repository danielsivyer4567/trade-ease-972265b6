import { supabase } from '@/integrations/supabase/client';
import { mockSearchAddress } from './mockArcGIS';
import { ARCGIS_CONFIG } from '@/config/arcgis';

// Environment detection - helps determine if we should use mock data
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Search for an address using ArcGIS geocoding service
 * @param address The address to search for
 * @returns Geocoding results
 */
export const searchAddress = async (address: string) => {
  try {
    if (!address.trim()) {
      return { data: null, error: 'Address is required' };
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('arcgis-boundaries', {
      body: { 
        address,
        apiKey: ARCGIS_CONFIG.apiKey
      }
    });

    if (error) {
      console.error('Error searching address:', error);
      
      // If we're in development, fall back to mock data
      if (isDevelopment) {
        console.log('Using mock data for geocoding in development...');
        return mockSearchAddress(address);
      }
      
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in geocode service:', error);
    
    // If we're in development, fall back to mock data
    if (isDevelopment) {
      console.log('Using mock data for geocoding in development after error...');
      return mockSearchAddress(address);
    }
    
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Get property boundaries for a location
 * @param location The location coordinates [longitude, latitude]
 * @returns Property boundary data
 */
export const getPropertyBoundaries = async (location: [number, number]) => {
  try {
    if (!location || location.length !== 2) {
      return { data: null, error: 'Valid location is required' };
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('arcgis-boundaries', {
      body: { 
        location: { x: location[0], y: location[1] },
        apiKey: ARCGIS_CONFIG.apiKey
      }
    });

    if (error) {
      console.error('Error getting property boundaries:', error);
      
      // If we're in development, fall back to mock data
      if (isDevelopment) {
        console.log('Using mock data for boundaries in development...');
        // Mock data will be based on coordinates
        const mockAddress = `${location[1]}, ${location[0]}`; // Not a real address, just using coords
        const { data: mockData } = await mockSearchAddress(mockAddress);
        return { data: { features: mockData.candidates }, error: null };
      }
      
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in boundaries service:', error);
    
    // If we're in development, fall back to mock data
    if (isDevelopment) {
      console.log('Using mock data for boundaries in development after error...');
      // Mock data will be based on coordinates
      const mockAddress = `${location[1]}, ${location[0]}`; // Not a real address, just using coords
      const { data: mockData } = await mockSearchAddress(mockAddress);
      return { data: { features: mockData.candidates }, error: null };
    }
    
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
