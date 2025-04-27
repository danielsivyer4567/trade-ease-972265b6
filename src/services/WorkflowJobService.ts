import { supabase } from '@/integrations/supabase/client';
import { WorkflowExecutorService } from './WorkflowExecutorService';
import { WorkflowExecution } from '@/types/workflow';

export const WorkflowJobService = {
  /**
   * Process pending workflow executions
   */
  processPendingExecutions: async (): Promise<void> => {
    try {
      // Get pending executions
      const { data: executions, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process each execution
      for (const execution of executions) {
        await WorkflowJobService.processExecution(execution);
      }
    } catch (error) {
      console.error('Failed to process pending executions:', error);
    }
  },

  /**
   * Process a single workflow execution
   */
  processExecution: async (execution: WorkflowExecution): Promise<void> => {
    try {
      // Update status to running
      await supabase
        .from('workflow_executions')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', execution.id);

      // Execute workflow
      const { success, error } = await WorkflowExecutorService.executeWorkflow(
        execution.workflow_id,
        execution.execution_data?.input
      );

      if (!success) {
        throw error || new Error('Failed to execute workflow');
      }
    } catch (error) {
      console.error(`Failed to process execution ${execution.id}:`, error);

      // Update execution status to failed
      await supabase
        .from('workflow_executions')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', execution.id);
    }
  },

  /**
   * Start the background job processor
   */
  startProcessor: (intervalMs: number = 5000): void => {
    // Process pending executions immediately
    WorkflowJobService.processPendingExecutions();

    // Set up interval for processing
    setInterval(() => {
      WorkflowJobService.processPendingExecutions();
    }, intervalMs);
  },

  /**
   * Stop the background job processor
   */
  stopProcessor: (): void => {
    // Clear all intervals
    for (let i = 1; i < 99999; i++) {
      window.clearInterval(i);
    }
  }
}; 