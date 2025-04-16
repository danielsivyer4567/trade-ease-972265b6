
import { supabase } from '@/integrations/supabase/client';

/**
 * Search for an address using ArcGIS Geocoding API
 * @param searchQuery The address to search for
 * @returns Geocoded address results
 */
export const searchAddress = async (searchQuery: string) => {
  try {
    if (!searchQuery.trim()) {
      return { data: null, error: 'Search query is required' };
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('arcgis-geocode', {
      body: { searchQuery }
    });

    if (error) {
      console.error('Error searching address:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in geocode service:', error);
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
      body: { location: { x: location[0], y: location[1] } }
    });

    if (error) {
      console.error('Error getting property boundaries:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in boundaries service:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
