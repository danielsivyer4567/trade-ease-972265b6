
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Workflow {
  id?: string;
  name: string;
  description?: string;
  data: any;
}

export const WorkflowService = {
  /**
   * Save workflow to Supabase
   */
  saveWorkflow: async (workflow: Workflow): Promise<{ success: boolean; id?: string; error?: any }> => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be signed in to save workflows');
        return { success: false, error: 'Authentication required' };
      }

      const { data, error } = await supabase
        .from('workflows')
        .upsert({
          id: workflow.id,
          name: workflow.name,
          description: workflow.description || '',
          data: workflow.data,
          user_id: session.user.id
        })
        .select('id')
        .single();

      if (error) throw error;

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Failed to save workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Load workflow from Supabase
   */
  loadWorkflow: async (id: string): Promise<{ success: boolean; workflow?: Workflow; error?: any }> => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { 
        success: true, 
        workflow: {
          id: data.id,
          name: data.name,
          description: data.description,
          data: data.data
        }
      };
    } catch (error) {
      console.error('Failed to load workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Get all user workflows
   */
  getUserWorkflows: async (): Promise<{ success: boolean; workflows?: Workflow[]; error?: any }> => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return { 
        success: true, 
        workflows: data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          data: item.data
        }))
      };
    } catch (error) {
      console.error('Failed to get user workflows:', error);
      return { success: false, error };
    }
  },

  /**
   * Delete workflow from Supabase
   */
  deleteWorkflow: async (id: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Save automation connection
   */
  saveAutomationConnection: async (automationId: number, workflowId: string, targetType?: string, targetId?: string): Promise<{ success: boolean; error?: any }> => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { error } = await supabase
        .from('automation_workflow_connections')
        .insert({
          automation_id: automationId,
          workflow_id: workflowId,
          target_type: targetType,
          target_id: targetId,
          user_id: session.user.id
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to save automation connection:', error);
      return { success: false, error };
    }
  }
};
