import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const TaskService = {
  async createTask(taskData: any) {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, task };
    } catch (error) {
      logger.error('Failed to create task:', error);
      return { success: false, error };
    }
  },

  async updateTask(taskId: string, updateData: any) {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, task };
    } catch (error) {
      logger.error('Failed to update task:', error);
      return { success: false, error };
    }
  },

  async getTask(taskId: string) {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;

      return { success: true, task };
    } catch (error) {
      logger.error('Failed to get task:', error);
      return { success: false, error };
    }
  }
}; 