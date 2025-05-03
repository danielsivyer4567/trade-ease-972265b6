import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Workflow, 
  WorkflowData, 
  CreateWorkflowParams, 
  UpdateWorkflowParams, 
  ExecuteWorkflowParams,
  WorkflowExecutionData
} from '@/types/workflow';
import { logger } from '@/utils/logger';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category?: string;
  data: any;
  is_template?: boolean;
}

export const WorkflowService = {
  /**
   * Create a new workflow
   */
  createWorkflow: async (params: CreateWorkflowParams): Promise<{ success: boolean; workflow?: Workflow; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: workflow, error } = await supabase
        .from('workflows')
        .insert({
          name: params.name,
          description: params.description,
          data: params.data,
          category: params.category,
          is_template: params.isTemplate || false,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, workflow };
    } catch (error) {
      console.error('Failed to create workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Update an existing workflow
   */
  updateWorkflow: async (params: UpdateWorkflowParams): Promise<{ success: boolean; workflow?: Workflow; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: workflow, error } = await supabase
        .from('workflows')
        .update({
          name: params.name,
          description: params.description,
          data: params.data,
          category: params.category,
          is_template: params.isTemplate,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, workflow };
    } catch (error) {
      console.error('Failed to update workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Get a workflow by ID
   */
  getWorkflow: async (id: string): Promise<{ success: boolean; workflow?: Workflow; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: workflow, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      return { success: true, workflow };
    } catch (error) {
      console.error('Failed to get workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * List all workflows for the current user
   */
  listWorkflows: async (): Promise<{ success: boolean; workflows?: Workflow[]; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: workflows, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, workflows };
    } catch (error) {
      console.error('Failed to list workflows:', error);
      return { success: false, error };
    }
  },

  /**
   * Delete a workflow
   */
  deleteWorkflow: async (id: string): Promise<{ success: boolean; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Execute a workflow
   */
  executeWorkflow: async (params: ExecuteWorkflowParams): Promise<{ success: boolean; executionId?: string; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Create execution record
      const { data: execution, error: executionError } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: params.workflowId,
          status: 'pending',
          execution_data: {
            input: params.input,
            steps: []
          }
        })
        .select()
        .single();

      if (executionError) throw executionError;

      // Start execution process (this would be handled by a background job in production)
      // For now, we'll just update the status
      const { error: updateError } = await supabase
        .from('workflow_executions')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', execution.id);

      if (updateError) throw updateError;

      return { success: true, executionId: execution.id };
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      return { success: false, error };
    }
  },

  /**
   * Get workflow execution status
   */
  getExecutionStatus: async (executionId: string): Promise<{ success: boolean; execution?: WorkflowExecution; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: execution, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('id', executionId)
        .single();

      if (error) throw error;

      return { success: true, execution };
    } catch (error) {
      console.error('Failed to get execution status:', error);
      return { success: false, error };
    }
  },

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
          category: workflow.category || '',
          data: workflow.data,
          user_id: session.user.id,
          is_template: workflow.is_template || false
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
   * Save workflow as template
   */
  saveAsTemplate: async (workflow: Workflow): Promise<{ success: boolean; id?: string; error?: any }> => {
    // Create a new copy of the workflow with is_template set to true
    const templateWorkflow = {
      ...workflow,
      id: crypto.randomUUID(), // Generate new ID for the template
      is_template: true
    };
    
    return WorkflowService.saveWorkflow(templateWorkflow);
  },

  /**
   * Get all user workflows
   */
  getUserWorkflows: async (): Promise<{ success: boolean; workflows?: Workflow[]; error?: any }> => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('is_template', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return { 
        success: true, 
        workflows: data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          data: item.data,
          is_template: item.is_template
        }))
      };
    } catch (error) {
      console.error('Failed to get user workflows:', error);
      return { success: false, error };
    }
  },

  /**
   * Get user templates
   */
  getUserTemplates: async (): Promise<{ success: boolean; templates?: Workflow[]; error?: any }> => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('is_template', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return { 
        success: true, 
        templates: data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          data: item.data,
          is_template: item.is_template
        }))
      };
    } catch (error) {
      console.error('Failed to get user templates:', error);
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
  },

  async createWorkflowFromTemplate(templateId: string, darkMode: boolean = false): Promise<{ success: boolean; workflow?: Workflow; error?: any }> {
    try {
      // Get template data from the database
      const { data: template, error: templateError } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Apply darkMode to all nodes in the template
      const templateData = { ...template.data };
      
      console.log("Template data before darkMode application:", JSON.stringify(templateData, null, 2));
      console.log("Creating workflow template with darkMode =", darkMode);
      
      if (templateData.nodes && Array.isArray(templateData.nodes)) {
        console.log(`Found ${templateData.nodes.length} nodes to apply darkMode=${darkMode} to`);
        
        templateData.nodes = templateData.nodes.map((node, index) => {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              workflowDarkMode: darkMode
            }
          };
          
          console.log(`Node ${index} (${node.id}) updated:`, {
            before: node.data.workflowDarkMode,
            after: updatedNode.data.workflowDarkMode
          });
          
          return updatedNode;
        });
      }
      
      console.log("Template data after darkMode application:", 
        templateData.nodes.map(n => ({ 
          id: n.id, 
          type: n.type, 
          darkMode: n.data.workflowDarkMode 
        }))
      );

      // Create new workflow from template with darkMode applied
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .insert({
          name: template.name,
          description: template.description,
          data: {
            ...templateData,
            workflowDarkMode: darkMode  // Set at the root level too
          },
          template_id: templateId
        })
        .select()
        .single();

      if (workflowError) throw workflowError;

      // Apply darkMode to returned workflow data for immediate use
      if (workflow && workflow.data) {
        workflow.data.workflowDarkMode = darkMode;
      }

      logger.info(`Created workflow from template: ${templateId} with darkMode=${darkMode}`);
      return { success: true, workflow };
    } catch (error) {
      logger.error('Failed to create workflow from template:', error);
      return { success: false, error };
    }
  }
};
