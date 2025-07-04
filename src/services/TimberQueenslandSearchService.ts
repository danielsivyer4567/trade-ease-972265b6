import { supabase } from '@/lib/supabase';

export interface TimberQueenslandData {
  id: string;
  data_code: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  timber_type: string | null;
  grade: string | null;
  dimensions: string | null;
  properties: any;
  specifications: string | null;
  notes: string | null;
  keywords: string[] | null;
  external_url: string | null;
  relevance_score: number;
}

export interface TimberQueenslandSearchResponse {
  results: TimberQueenslandData[];
  total: number;
  query: string;
  category: string | null;
}

export class TimberQueenslandSearchService {
  /**
   * Search Timber Queensland data using voice or text query
   */
  static async searchTimberQueenslandData(query: string, limit: number = 20, category?: string): Promise<TimberQueenslandSearchResponse> {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found');
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('timber-queensland-search', {
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
        console.error('Timber Queensland search function error:', error);
        throw new Error(error.message || 'Failed to search Timber Queensland data');
      }

      return data as TimberQueenslandSearchResponse;
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.searchTimberQueenslandData:', error);
      throw error;
    }
  }

  /**
   * Get Timber Queensland data by ID
   */
  static async getTimberQueenslandDataById(id: string): Promise<TimberQueenslandData | null> {
    try {
      const { data, error } = await supabase
        .from('timber_queensland_data')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching Timber Queensland data by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.getTimberQueenslandDataById:', error);
      return null;
    }
  }

  /**
   * Get Timber Queensland data by category
   */
  static async getTimberQueenslandDataByCategory(category: string, limit: number = 50): Promise<TimberQueenslandData[]> {
    try {
      const { data, error } = await supabase
        .from('timber_queensland_data')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('data_code', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching Timber Queensland data by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.getTimberQueenslandDataByCategory:', error);
      return [];
    }
  }

  /**
   * Get all available categories
   */
  static async getTimberQueenslandCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('timber_queensland_data')
        .select('category')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching Timber Queensland categories:', error);
        return [];
      }

      // Remove duplicates and return unique categories
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.getTimberQueenslandCategories:', error);
      return [];
    }
  }

  /**
   * Get Timber Queensland data by timber type
   */
  static async getTimberQueenslandDataByType(timberType: string, limit: number = 50): Promise<TimberQueenslandData[]> {
    try {
      const { data, error } = await supabase
        .from('timber_queensland_data')
        .select('*')
        .eq('timber_type', timberType)
        .eq('is_active', true)
        .order('data_code', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching Timber Queensland data by type:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.getTimberQueenslandDataByType:', error);
      return [];
    }
  }

  /**
   * Get Timber Queensland data by grade
   */
  static async getTimberQueenslandDataByGrade(grade: string, limit: number = 50): Promise<TimberQueenslandData[]> {
    try {
      const { data, error } = await supabase
        .from('timber_queensland_data')
        .select('*')
        .eq('grade', grade)
        .eq('is_active', true)
        .order('data_code', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching Timber Queensland data by grade:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.getTimberQueenslandDataByGrade:', error);
      return [];
    }
  }

  /**
   * Get recent Timber Queensland data
   */
  static async getRecentTimberQueenslandData(limit: number = 10): Promise<TimberQueenslandData[]> {
    try {
      const { data, error } = await supabase
        .from('timber_queensland_data')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent Timber Queensland data:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in TimberQueenslandSearchService.getRecentTimberQueenslandData:', error);
      return [];
    }
  }
} 