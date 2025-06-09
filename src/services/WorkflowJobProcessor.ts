import { supabase } from '@/integrations/supabase/client';
import { WorkflowExecutorService } from './WorkflowExecutorService';
import { logger } from '@/utils/logger';

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  input_data?: any;
  result_data?: any;
}

class WorkflowJobProcessor {
  private intervalId: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private isOfflineMode = false;

  constructor() {
    // Check if we're in offline mode by looking at the Supabase URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.isOfflineMode = !supabaseUrl || 
      supabaseUrl.includes('your-project.supabase.co') || 
      supabaseUrl === 'https://your-project.supabase.co';
    
    if (this.isOfflineMode) {
      console.log('🔧 WorkflowJobProcessor: Running in offline mode');
    }
  }

  start(intervalMs: number = 5000) {
    if (this.intervalId) {
      console.log('WorkflowJobProcessor: Already running');
      return;
    }

    if (this.isOfflineMode) {
      console.log('🔧 WorkflowJobProcessor: Starting in offline simulation mode');
      this.startOfflineSimulation(intervalMs);
      return;
    }

    console.log(`WorkflowJobProcessor: Starting with ${intervalMs}ms interval`);
    this.intervalId = setInterval(() => {
      this.processJobs().catch(error => {
        logger.error('WorkflowJobProcessor: Error in processJobs:', error);
      });
    }, intervalMs);

    // Process jobs immediately on start
    this.processJobs().catch(error => {
      logger.error('WorkflowJobProcessor: Error in initial processJobs:', error);
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('WorkflowJobProcessor: Stopped');
    }
  }

  private startOfflineSimulation(intervalMs: number) {
    // In offline mode, just simulate processing without actual database calls
    this.intervalId = setInterval(() => {
      if (!this.isProcessing) {
        console.log('🔧 WorkflowJobProcessor: Simulating job check (offline mode)');
        // Simulate some processing time
        this.isProcessing = true;
        setTimeout(() => {
          this.isProcessing = false;
        }, 100);
      }
    }, intervalMs);
  }

  async processJobs(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    if (this.isOfflineMode) {
      // Don't actually process jobs in offline mode
      return;
    }

    this.isProcessing = true;

    try {
      // Get pending workflow executions
      const { data: executions, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // Limit to 10 executions per batch
      const limitedExecutions = executions?.slice(0, 10) || [];

      if (!limitedExecutions || limitedExecutions.length === 0) {
        logger.info('WorkflowJobProcessor: No pending executions found');
        return;
      }

      logger.info(`WorkflowJobProcessor: Processing ${limitedExecutions.length} pending executions`);

      // Process each execution
      for (const execution of limitedExecutions) {
        try {
          await this.processExecution(execution);
        } catch (error) {
          logger.error(`WorkflowJobProcessor: Error processing execution ${execution.id}:`, error);
          
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
    } finally {
      this.isProcessing = false;
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
        execution.input_data || {}
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
    if (this.isOfflineMode) {
      const executionId = crypto.randomUUID();
      console.log(`🔧 WorkflowJobProcessor: Simulated queueing execution ${executionId} for workflow ${workflowId}`);
      return executionId;
    }

    try {
      const { data: execution, error } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: workflowId,
          status: 'pending',
          input_data: inputData,
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
}

export const workflowJobProcessor = new WorkflowJobProcessor();