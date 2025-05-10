import { supabase } from '@/integrations/supabase/client';
import { Property } from '../types';

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

/**
 * Fetch all property boundaries for the logged-in user
 */
export const fetchPropertyBoundaries = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: [], error: 'You must be logged in to view properties' };
    }
    const { data, error } = await supabase
      .from('property_boundaries')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      console.error('Error fetching properties:', error);
      return { data: [], error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error in fetch property service:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Delete a property boundary by ID
 */
export const deletePropertyBoundary = async (propertyId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: 'You must be logged in to delete properties' };
    }
    const { data, error } = await supabase
      .from('property_boundaries')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error deleting property:', error);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error in delete property service:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}; 