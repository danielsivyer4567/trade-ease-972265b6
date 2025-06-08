import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface CreateTaskParams {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
  job_id?: string;
  customer_id?: string;
  tags?: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
  job_id?: string;
  customer_id?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  user_id: string;
}

export const TaskService = {
  /**
   * Create a new task
   */
  createTask: async (params: CreateTaskParams): Promise<{ success: boolean; task?: Task; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          ...params,
          status: params.status || 'pending',
          priority: params.priority || 'medium',
          created_at: new Date().toISOString(),
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Task created successfully:', task);
      return { success: true, task };
    } catch (error) {
      logger.error('Failed to create task:', error);
      return { success: false, error };
    }
  },

  /**
   * Update task
   */
  updateTask: async (taskId: string, updates: Partial<CreateTaskParams>): Promise<{ success: boolean; task?: Task; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // If task is being completed, set completed_at
      if (updates.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      logger.info('Task updated successfully:', { taskId, updates });
      return { success: true, task };
    } catch (error) {
      logger.error('Failed to update task:', error);
      return { success: false, error };
    }
  },

  /**
   * Get task by ID
   */
  getTask: async (taskId: string): Promise<{ success: boolean; task?: Task; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      return { success: true, task };
    } catch (error) {
      logger.error('Failed to get task:', error);
      return { success: false, error };
    }
  },

  /**
   * List tasks with optional filters
   */
  listTasks: async (filters?: { 
    status?: Task['status']; 
    priority?: Task['priority'];
    assigned_to?: string;
    job_id?: string;
    customer_id?: string;
  }): Promise<{ success: boolean; tasks?: Task[]; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      if (filters?.job_id) {
        query = query.eq('job_id', filters.job_id);
      }

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      const { data: tasks, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, tasks };
    } catch (error) {
      logger.error('Failed to list tasks:', error);
      return { success: false, error };
    }
  },

  /**
   * Delete task
   */
  deleteTask: async (taskId: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      logger.info('Task deleted successfully:', taskId);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete task:', error);
      return { success: false, error };
    }
  }
}; 