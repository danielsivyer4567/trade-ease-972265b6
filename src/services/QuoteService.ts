import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface CreateQuoteParams {
  customer_id: string;
  title: string;
  description?: string;
  amount: number;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  valid_until?: string;
  items?: QuoteItem[];
  discount?: number;
  tax_rate?: number;
  notes?: string;
  job_id?: string;
}

export interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Quote {
  id: string;
  customer_id: string;
  title: string;
  description?: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  valid_until?: string;
  items?: QuoteItem[];
  discount?: number;
  tax_rate?: number;
  notes?: string;
  job_id?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export const QuoteService = {
  /**
   * Create a new quote
   */
  createQuote: async (params: CreateQuoteParams): Promise<{ success: boolean; quote?: Quote; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: quote, error } = await supabase
        .from('quotes')
        .insert({
          ...params,
          status: params.status || 'draft',
          created_at: new Date().toISOString(),
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Quote created successfully:', quote);
      return { success: true, quote };
    } catch (error) {
      logger.error('Failed to create quote:', error);
      return { success: false, error };
    }
  },

  /**
   * Update quote
   */
  updateQuote: async (quoteId: string, updates: Partial<CreateQuoteParams>): Promise<{ success: boolean; quote?: Quote; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: quote, error } = await supabase
        .from('quotes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      logger.info('Quote updated successfully:', { quoteId, updates });
      return { success: true, quote };
    } catch (error) {
      logger.error('Failed to update quote:', error);
      return { success: false, error };
    }
  },

  /**
   * Get quote by ID
   */
  getQuote: async (quoteId: string): Promise<{ success: boolean; quote?: Quote; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: quote, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      return { success: true, quote };
    } catch (error) {
      logger.error('Failed to get quote:', error);
      return { success: false, error };
    }
  },

  /**
   * List quotes with optional filters
   */
  listQuotes: async (filters?: { 
    customer_id?: string;
    status?: Quote['status'];
    job_id?: string;
  }): Promise<{ success: boolean; quotes?: Quote[]; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      let query = supabase
        .from('quotes')
        .select('*')
        .eq('user_id', session.user.id);

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.job_id) {
        query = query.eq('job_id', filters.job_id);
      }

      const { data: quotes, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, quotes };
    } catch (error) {
      logger.error('Failed to list quotes:', error);
      return { success: false, error };
    }
  },

  /**
   * Send quote to customer
   */
  sendQuote: async (quoteId: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Update quote status to pending
      const { error } = await supabase
        .from('quotes')
        .update({
          status: 'pending',
          sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      // TODO: Implement actual email sending logic here
      logger.info('Quote sent successfully:', quoteId);
      return { success: true };
    } catch (error) {
      logger.error('Failed to send quote:', error);
      return { success: false, error };
    }
  },

  /**
   * Calculate quote total
   */
  calculateTotal: (items: QuoteItem[], discount: number = 0, taxRate: number = 0): number => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (discount / 100);
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    return taxableAmount + taxAmount;
  }
}; 