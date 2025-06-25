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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class NCCCodesService {
  /**
   * Fetch all active NCC codes
   */
  static async getAllNCCCodes(): Promise<NCCCode[]> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('*')
        .eq('is_active', true)
        .order('code', { ascending: true });

      if (error) {
        console.error('Error fetching NCC codes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in NCCCodesService.getAllNCCCodes:', error);
      throw error;
    }
  }

  /**
   * Search NCC codes using the database function
   */
  static async searchNCCCodes(query: string): Promise<NCCCode[]> {
    try {
      const { data, error } = await supabase
        .rpc('search_ncc_codes', { search_query: query });

      if (error) {
        console.error('Error searching NCC codes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in NCCCodesService.searchNCCCodes:', error);
      throw error;
    }
  }

  /**
   * Get NCC codes by category
   */
  static async getNCCCodesByCategory(category: string): Promise<NCCCode[]> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('code', { ascending: true });

      if (error) {
        console.error('Error fetching NCC codes by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in NCCCodesService.getNCCCodesByCategory:', error);
      throw error;
    }
  }

  /**
   * Get a single NCC code by code
   */
  static async getNCCCodeByCode(code: string): Promise<NCCCode | null> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching NCC code:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in NCCCodesService.getNCCCodeByCode:', error);
      throw error;
    }
  }

  /**
   * Get all unique categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .select('category')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Extract unique categories
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories.filter(Boolean);
    } catch (error) {
      console.error('Error in NCCCodesService.getCategories:', error);
      throw error;
    }
  }

  /**
   * Add a new NCC code (admin only)
   */
  static async addNCCCode(nccCode: Omit<NCCCode, 'id' | 'created_at' | 'updated_at'>): Promise<NCCCode> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .insert([nccCode])
        .select()
        .single();

      if (error) {
        console.error('Error adding NCC code:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in NCCCodesService.addNCCCode:', error);
      throw error;
    }
  }

  /**
   * Update an existing NCC code (admin only)
   */
  static async updateNCCCode(id: string, updates: Partial<NCCCode>): Promise<NCCCode> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating NCC code:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in NCCCodesService.updateNCCCode:', error);
      throw error;
    }
  }

  /**
   * Delete an NCC code (soft delete by setting is_active to false)
   */
  static async deleteNCCCode(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ncc_codes')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting NCC code:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in NCCCodesService.deleteNCCCode:', error);
      throw error;
    }
  }

  /**
   * Bulk import NCC codes (admin only)
   */
  static async bulkImportNCCCodes(codes: Omit<NCCCode, 'id' | 'created_at' | 'updated_at'>[]): Promise<NCCCode[]> {
    try {
      const { data, error } = await supabase
        .from('ncc_codes')
        .insert(codes)
        .select();

      if (error) {
        console.error('Error bulk importing NCC codes:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in NCCCodesService.bulkImportNCCCodes:', error);
      throw error;
    }
  }
} 