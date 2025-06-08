import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface CreateJobParams {
  customer_id: string;
  title: string;
  description?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  assigned_to?: string[];
  location?: string;
  quote_id?: string;
}

export interface Job {
  id: string;
  customer_id: string;
  quote_id?: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at?: string;
  assigned_to?: string[];
  location?: string;
}

export const JobService = {
  /**
   * Create a new job
   */
  createJob: async (params: CreateJobParams): Promise<{ success: boolean; job?: Job; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: job, error } = await supabase
        .from('jobs')
        .insert({
          ...params,
          status: params.status || 'scheduled',
          created_at: new Date().toISOString(),
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Job created successfully:', job);
      return { success: true, job };
    } catch (error) {
      logger.error('Failed to create job:', error);
      return { success: false, error };
    }
  },

  /**
   * Update job status
   */
  updateJobStatus: async (jobId: string, status: Job['status']): Promise<{ success: boolean; job?: Job; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: job, error } = await supabase
        .from('jobs')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      logger.info('Job status updated:', { jobId, status });
      return { success: true, job };
    } catch (error) {
      logger.error('Failed to update job status:', error);
      return { success: false, error };
    }
  },

  /**
   * Get job by ID
   */
  getJob: async (jobId: string): Promise<{ success: boolean; job?: Job; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      return { success: true, job };
    } catch (error) {
      logger.error('Failed to get job:', error);
      return { success: false, error };
    }
  },

  /**
   * List jobs with optional filters
   */
  listJobs: async (filters?: { customer_id?: string; status?: Job['status'] }): Promise<{ success: boolean; jobs?: Job[]; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      let query = supabase
        .from('jobs')
        .select('*')
        .eq('user_id', session.user.id);

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data: jobs, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, jobs };
    } catch (error) {
      logger.error('Failed to list jobs:', error);
      return { success: false, error };
    }
  }
}; 