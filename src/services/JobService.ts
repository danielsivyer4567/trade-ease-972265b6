import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const JobService = {
  async createJob(jobData: any) {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, job };
    } catch (error) {
      logger.error('Failed to create job:', error);
      return { success: false, error };
    }
  },

  async updateJob(jobId: string, updateData: any) {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, job };
    } catch (error) {
      logger.error('Failed to update job:', error);
      return { success: false, error };
    }
  },

  async getJob(jobId: string) {
    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      return { success: true, job };
    } catch (error) {
      logger.error('Failed to get job:', error);
      return { success: false, error };
    }
  }
}; 