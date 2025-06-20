import { supabase } from '@/lib/supabase';

export interface QBCCForm {
  id: string;
  form_code: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  form_type: string | null;
  version: string | null;
  status: string | null;
  notes: string | null;
  keywords: string[] | null;
  external_url: string | null;
  relevance_score: number;
}

export interface QBCCSearchResponse {
  results: QBCCForm[];
  total: number;
  query: string;
  category: string | null;
}

export class QBCCSearchService {
  /**
   * Search QBCC forms using voice or text query
   */
  static async searchQBCCForms(query: string, limit: number = 20, category?: string): Promise<QBCCSearchResponse> {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('No active session found');
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('qbcc-search', {
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
        console.error('QBCC search function error:', error);
        throw new Error(error.message || 'Failed to search QBCC forms');
      }

      return data as QBCCSearchResponse;
    } catch (error) {
      console.error('Error in QBCCSearchService.searchQBCCForms:', error);
      throw error;
    }
  }

  /**
   * Get QBCC form by ID
   */
  static async getQBCCFormById(id: string): Promise<QBCCForm | null> {
    try {
      const { data, error } = await supabase
        .from('qbcc_forms')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching QBCC form by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in QBCCSearchService.getQBCCFormById:', error);
      return null;
    }
  }

  /**
   * Get QBCC forms by category
   */
  static async getQBCCFormsByCategory(category: string, limit: number = 50): Promise<QBCCForm[]> {
    try {
      const { data, error } = await supabase
        .from('qbcc_forms')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('form_code', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching QBCC forms by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in QBCCSearchService.getQBCCFormsByCategory:', error);
      return [];
    }
  }

  /**
   * Get all available categories
   */
  static async getQBCCCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('qbcc_forms')
        .select('category')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching QBCC categories:', error);
        return [];
      }

      // Remove duplicates and return unique categories
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    } catch (error) {
      console.error('Error in QBCCSearchService.getQBCCCategories:', error);
      return [];
    }
  }

  /**
   * Get QBCC forms by form type
   */
  static async getQBCCFormsByType(formType: string, limit: number = 50): Promise<QBCCForm[]> {
    try {
      const { data, error } = await supabase
        .from('qbcc_forms')
        .select('*')
        .eq('form_type', formType)
        .eq('is_active', true)
        .order('form_code', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching QBCC forms by type:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in QBCCSearchService.getQBCCFormsByType:', error);
      return [];
    }
  }

  /**
   * Get recent QBCC forms
   */
  static async getRecentQBCCForms(limit: number = 10): Promise<QBCCForm[]> {
    try {
      const { data, error } = await supabase
        .from('qbcc_forms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent QBCC forms:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in QBCCSearchService.getRecentQBCCForms:', error);
      return [];
    }
  }
} 