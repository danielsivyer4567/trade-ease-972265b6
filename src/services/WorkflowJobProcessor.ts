import { supabase } from '@/integrations/supabase/client';
import { WorkflowExecutorService } from './WorkflowExecutorService';
import { logger } from '@/utils/logger';

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  execution_data?: any;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export class WorkflowJobProcessor {
  private static instance: WorkflowJobProcessor;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    console.log('WorkflowJobProcessor: Initialized');
  }

  static getInstance(): WorkflowJobProcessor {
    if (!WorkflowJobProcessor.instance) {
      WorkflowJobProcessor.instance = new WorkflowJobProcessor();
    }
    return WorkflowJobProcessor.instance;
  }

  async start(): Promise<void> {
    if (this.intervalId) {
      console.log('WorkflowJobProcessor: Already running');
      return;
    }

    console.log('WorkflowJobProcessor: Starting job processor');
    
    // Check for pending executions immediately
    await this.processExecutions();
    
    // Set up interval to check for pending executions every 30 seconds
    this.intervalId = setInterval(async () => {
      await this.processExecutions();
    }, 30000);
  }

  async processExecutions(): Promise<void> {
    try {
      // Get pending workflow executions
      const { data: executions, error } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          workflows:workflow_id (
            id,
            name,
            data
          )
        `)
        .eq('status', 'pending')
        .limit(10);

      if (error) {
        logger.error('Failed to fetch pending executions:', error);
        return;
      }

      if (!executions || executions.length === 0) {
        return;
      }

      logger.info(`Processing ${executions.length} pending workflow executions`);

      // Process each execution
      for (const execution of executions) {
        try {
          await this.processExecution(execution);
        } catch (error) {
          logger.error(`Failed to process execution ${execution.id}:`, error);
          
          // Mark execution as failed
          await supabase
            .from('workflow_executions')
            .update({
              status: 'failed',
              error_message: error instanceof Error ? error.message : 'Unknown error',
              completed_at: new Date().toISOString()
            })
            .eq('id', execution.id);
        }
      }
    } catch (error) {
      logger.error('Failed to process workflow jobs:', error);
    }
  }

  private async processExecution(execution: WorkflowExecution): Promise<void> {
    try {
      logger.info(`WorkflowJobProcessor: Starting execution ${execution.id}`);

      // Mark as running
      await supabase
        .from('workflow_executions')
        .update({
          status: 'running',
          started_at: new Date().toISOString()
        })
        .eq('id', execution.id);

      // Get workflow data
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', execution.workflow_id)
        .single();

      if (workflowError || !workflow) {
        throw new Error(`Workflow ${execution.workflow_id} not found`);
      }

      // Execute the workflow
      const result = await WorkflowExecutorService.executeWorkflow(
        workflow.data,
        execution.execution_data || {}
      );

      // Mark as completed
      await supabase
        .from('workflow_executions')
        .update({
          status: 'completed',
          result_data: result,
          completed_at: new Date().toISOString()
        })
        .eq('id', execution.id);

      logger.info(`WorkflowJobProcessor: Completed execution ${execution.id}`);
    } catch (error) {
      logger.error(`WorkflowJobProcessor: Error in execution ${execution.id}:`, error);
      throw error;
    }
  }

  // Add execution to queue (for manual triggering)
  async queueExecution(workflowId: string, inputData: any = {}): Promise<string> {
    try {
      const { data: execution, error } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: workflowId,
          status: 'pending',
          execution_data: inputData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      logger.info(`WorkflowJobProcessor: Queued execution ${execution.id} for workflow ${workflowId}`);
      return execution.id;
    } catch (error) {
      logger.error('WorkflowJobProcessor: Error queueing execution:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('WorkflowJobProcessor: Stopped');
    }
  }
}

// Export singleton instance
export const workflowJobProcessor = WorkflowJobProcessor.getInstance();