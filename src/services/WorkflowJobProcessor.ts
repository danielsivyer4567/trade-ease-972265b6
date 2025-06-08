import { supabase } from '@/integrations/supabase/client';
import { WorkflowExecutorService } from './WorkflowExecutorService';
import { logger } from '@/utils/logger';

export class WorkflowJobProcessor {
  private static instance: WorkflowJobProcessor;
  private isProcessing: boolean = false;
  private interval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): WorkflowJobProcessor {
    if (!WorkflowJobProcessor.instance) {
      WorkflowJobProcessor.instance = new WorkflowJobProcessor();
    }
    return WorkflowJobProcessor.instance;
  }

  /**
   * Start the job processor
   */
  public start(intervalMs: number = 5000): void {
    if (this.interval) {
      logger.warn('Job processor is already running');
      return;
    }

    logger.info('Starting workflow job processor');
    this.interval = setInterval(() => this.processJobs(), intervalMs);
  }

  /**
   * Stop the job processor
   */
  public stop(): void {
    if (this.interval) {
      logger.info('Stopping workflow job processor');
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Process pending workflow jobs
   */
  private async processJobs(): Promise<void> {
    if (this.isProcessing) {
      logger.debug('Job processor is already processing jobs');
      return;
    }

    this.isProcessing = true;

    try {
      // Get pending executions
      const { data: executions, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) {
        throw error;
      }

      if (!executions || executions.length === 0) {
        logger.debug('No pending workflow executions found');
        return;
      }

      logger.info(`Processing ${executions.length} pending workflow executions`);

      // Process each execution
      for (const execution of executions) {
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

          logger.info(`Successfully processed workflow execution: ${execution.id}`);
        } catch (error) {
          logger.error(`Failed to process workflow execution: ${execution.id}`, error);

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
      }
    } catch (error) {
      logger.error('Failed to process workflow jobs:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}

// Export singleton instance
export const workflowJobProcessor = WorkflowJobProcessor.getInstance(); 