import { supabase } from '@/lib/supabase';

export interface NCCCode {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  section: string | null;
  volume: string | null;
  part: string | null;
  clause: string | null;
  notes: string | null;
  keywords: string[] | null;
  relevance_score: number;
}

export interface NCCSearchResponse {
  results: NCCCode[];
  total: number;
  query: string;
  category: string | null;
  error?: string;
}

export class NCCSearchService {
  /**
   * Search NCC codes using voice or text query
   */
  static async searchNCCCodes(query: string, limit: number = 20, category?: string): Promise<NCCSearchResponse> {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found');
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ncc-search', {
        body: {
          query,
          limit,
          category
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('NCC search function error:', error);
        throw new Error(error.message || 'Failed to search NCC codes');
      }

      return data as NCCSearchResponse;
    } catch (error) {
      console.error('Error in NCCSearchService.searchNCCCodes:', error);
      throw error;
    }
  }

  /**
   * Get NCC code by ID
   */
  static async getNCCCodeById(id: string): Promise<NCCCode | null> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching NCC code by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in NCCSearchService.getNCCCodeById:', error);
      return null;
    }
  }

  /**
   * Get NCC codes by category
   */
  static async getNCCCodesByCategory(category: string, limit: number = 50): Promise<NCCCode[]> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('code', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching NCC codes by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in NCCSearchService.getNCCCodesByCategory:', error);
      return [];
    }
  }

  /**
   * Get all available categories
   */
  static async getNCCCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('category')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching NCC categories:', error);
        return [];
      }

      // Remove duplicates and return unique categories
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    } catch (error) {
      console.error('Error in NCCSearchService.getNCCCategories:', error);
      return [];
    }
  }

  /**
   * Check if user has access to NCC voice search
   */
  static async hasNCCVoiceSearchAccess(): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return false;
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          subscription_tier,
          is_active,
          subscription_features!inner(
            feature_key,
            enabled
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('subscription_features.feature_key', 'ncc_voice_search')
        .eq('subscription_features.enabled', true)
        .single();

      return !error && !!data;
    } catch (error) {
      console.error('Error checking NCC voice search access:', error);
      return false;
    }
  }
} 