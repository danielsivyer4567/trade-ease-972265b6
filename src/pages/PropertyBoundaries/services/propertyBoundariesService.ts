
import { supabase } from '@/integrations/supabase/client';
import { Property } from '../types';

/**
 * Search for properties using the search-property-boundaries edge function
 * @param searchQuery The search query to filter properties
 * @param limit The maximum number of properties to return
 * @param offset The offset for pagination
 * @returns Search results with properties and pagination info
 */
export const searchProperties = async (
  searchQuery?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ 
  data: Property[] | null, 
  pagination: { 
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean
  }, 
  error: string | null 
}> => {
  try {
    // Get the current user for authenticated requests
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Call the search-property-boundaries edge function
    const { data, error } = await supabase.functions.invoke('search-property-boundaries', {
      body: { searchQuery, userId, limit, offset }
    });

    if (error) {
      console.error('Error searching properties:', error);
      return { 
        data: null, 
        pagination: { total: 0, limit, offset, hasMore: false },
        error: error.message 
      };
    }

    // Transform the data to match the Property type if needed
    const properties = data?.data?.map((item: any): Property => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      address: item.address || '',
      location: item.location,
      boundaries: item.boundaries
    })) || [];

    return { 
      data: properties, 
      pagination: {
        total: data?.pagination?.total || 0,
        limit: data?.pagination?.limit || limit,
        offset: data?.pagination?.offset || offset,
        hasMore: data?.pagination?.hasMore || false
      },
      error: null 
    };
  } catch (error) {
    console.error('Error in property search service:', error);
    return { 
      data: null, 
      pagination: { total: 0, limit, offset, hasMore: false },
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
