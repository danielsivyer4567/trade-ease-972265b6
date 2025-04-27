import { supabase } from '@/integrations/supabase/client';
import { WorkflowService } from './WorkflowService';
import { logger } from '@/utils/logger';

interface ScheduleConfig {
  cronExpression: string;
  timezone: string;
  enabled: boolean;
}

interface WorkflowSchedule {
  id: string;
  workflow_id: string;
  schedule_config: ScheduleConfig;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export class WorkflowSchedulerService {
  private static instance: WorkflowSchedulerService;
  private interval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): WorkflowSchedulerService {
    if (!WorkflowSchedulerService.instance) {
      WorkflowSchedulerService.instance = new WorkflowSchedulerService();
    }
    return WorkflowSchedulerService.instance;
  }

  /**
   * Start the scheduler
   */
  public start(intervalMs: number = 60000): void {
    if (this.interval) {
      logger.warn('Workflow scheduler is already running');
      return;
    }

    logger.info('Starting workflow scheduler');
    this.interval = setInterval(() => this.checkSchedules(), intervalMs);
  }

  /**
   * Stop the scheduler
   */
  public stop(): void {
    if (this.interval) {
      logger.info('Stopping workflow scheduler');
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Create a new workflow schedule
   */
  public async createSchedule(
    workflowId: string,
    scheduleConfig: ScheduleConfig
  ): Promise<{ success: boolean; schedule?: WorkflowSchedule; error?: any }> {
    try {
      const { data: schedule, error } = await supabase
        .from('workflow_schedules')
        .insert({
          workflow_id: workflowId,
          schedule_config: scheduleConfig,
          next_run_at: this.calculateNextRun(scheduleConfig)
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created workflow schedule: ${schedule.id}`);
      return { success: true, schedule };
    } catch (error) {
      logger.error('Failed to create workflow schedule:', error);
      return { success: false, error };
    }
  }

  /**
   * Update an existing workflow schedule
   */
  public async updateSchedule(
    scheduleId: string,
    scheduleConfig: ScheduleConfig
  ): Promise<{ success: boolean; schedule?: WorkflowSchedule; error?: any }> {
    try {
      const { data: schedule, error } = await supabase
        .from('workflow_schedules')
        .update({
          schedule_config: scheduleConfig,
          next_run_at: this.calculateNextRun(scheduleConfig)
        })
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Updated workflow schedule: ${scheduleId}`);
      return { success: true, schedule };
    } catch (error) {
      logger.error('Failed to update workflow schedule:', error);
      return { success: false, error };
    }
  }

  /**
   * Delete a workflow schedule
   */
  public async deleteSchedule(scheduleId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('workflow_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      logger.info(`Deleted workflow schedule: ${scheduleId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete workflow schedule:', error);
      return { success: false, error };
    }
  }

  /**
   * Check and execute scheduled workflows
   */
  private async checkSchedules(): Promise<void> {
    try {
      const now = new Date().toISOString();

      // Get due schedules
      const { data: schedules, error } = await supabase
        .from('workflow_schedules')
        .select('*')
        .eq('schedule_config->enabled', true)
        .lte('next_run_at', now);

      if (error) throw error;

      if (!schedules || schedules.length === 0) {
        return;
      }

      logger.info(`Found ${schedules.length} due workflow schedules`);

      // Execute each due schedule
      for (const schedule of schedules) {
        try {
          // Create workflow execution
          const { success, error } = await WorkflowService.executeWorkflow({
            workflowId: schedule.workflow_id
          });

          if (!success) throw error;

          // Update schedule
          await supabase
            .from('workflow_schedules')
            .update({
              last_run_at: now,
              next_run_at: this.calculateNextRun(schedule.schedule_config)
            })
            .eq('id', schedule.id);

          logger.info(`Executed scheduled workflow: ${schedule.id}`);
        } catch (error) {
          logger.error(`Failed to execute scheduled workflow: ${schedule.id}`, error);
        }
      }
    } catch (error) {
      logger.error('Failed to check workflow schedules:', error);
    }
  }

  /**
   * Calculate next run time based on cron expression
   */
  private calculateNextRun(scheduleConfig: ScheduleConfig): string {
    // TODO: Implement proper cron expression parsing
    // For now, just add 1 hour to current time
    const nextRun = new Date();
    nextRun.setHours(nextRun.getHours() + 1);
    return nextRun.toISOString();
  }
}

// Export singleton instance
export const workflowScheduler = WorkflowSchedulerService.getInstance(); 