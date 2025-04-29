import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const QuoteService = {
  async createQuote(quoteData: any) {
    try {
      const { data: quote, error } = await supabase
        .from('quotes')
        .insert([quoteData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, quote };
    } catch (error) {
      logger.error('Failed to create quote:', error);
      return { success: false, error };
    }
  },

  async updateQuote(quoteId: string, updateData: any) {
    try {
      const { data: quote, error } = await supabase
        .from('quotes')
        .update(updateData)
        .eq('id', quoteId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, quote };
    } catch (error) {
      logger.error('Failed to update quote:', error);
      return { success: false, error };
    }
  },

  async getQuote(quoteId: string) {
    try {
      const { data: quote, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (error) throw error;

      return { success: true, quote };
    } catch (error) {
      logger.error('Failed to get quote:', error);
      return { success: false, error };
    }
  }
}; 