import { useState, useEffect, useCallback } from 'react';
import { WorkflowService } from '@/services/WorkflowService';
import { WorkflowJobService } from '@/services/WorkflowJobService';
import { Workflow, WorkflowData, CreateWorkflowParams, UpdateWorkflowParams, ExecuteWorkflowParams } from '@/types/workflow';
import { toast } from 'sonner';

export function useWorkflow() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load workflows
  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, workflows, error } = await WorkflowService.listWorkflows();
      if (!success) throw error;
      setWorkflows(workflows || []);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setError(error instanceof Error ? error : new Error('Failed to load workflows'));
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load a single workflow
  const loadWorkflow = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, workflow, error } = await WorkflowService.getWorkflow(id);
      if (!success) throw error;
      setCurrentWorkflow(workflow || null);
    } catch (error) {
      console.error('Failed to load workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to load workflow'));
      toast.error('Failed to load workflow');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new workflow
  const createWorkflow = useCallback(async (params: CreateWorkflowParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, workflow, error } = await WorkflowService.createWorkflow(params);
      if (!success) throw error;
      setWorkflows(prev => [...prev, workflow!]);
      setCurrentWorkflow(workflow || null);
      toast.success('Workflow created successfully');
      return workflow;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to create workflow'));
      toast.error('Failed to create workflow');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a workflow
  const updateWorkflow = useCallback(async (params: UpdateWorkflowParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, workflow, error } = await WorkflowService.updateWorkflow(params);
      if (!success) throw error;
      setWorkflows(prev => prev.map(w => w.id === workflow!.id ? workflow! : w));
      setCurrentWorkflow(workflow || null);
      toast.success('Workflow updated successfully');
      return workflow;
    } catch (error) {
      console.error('Failed to update workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to update workflow'));
      toast.error('Failed to update workflow');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a workflow
  const deleteWorkflow = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, error } = await WorkflowService.deleteWorkflow(id);
      if (!success) throw error;
      setWorkflows(prev => prev.filter(w => w.id !== id));
      if (currentWorkflow?.id === id) {
        setCurrentWorkflow(null);
      }
      toast.success('Workflow deleted successfully');
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to delete workflow'));
      toast.error('Failed to delete workflow');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkflow]);

  // Execute a workflow
  const executeWorkflow = useCallback(async (params: ExecuteWorkflowParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, executionId, error } = await WorkflowService.executeWorkflow(params);
      if (!success) throw error;
      toast.success('Workflow execution started');
      return executionId;
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to execute workflow'));
      toast.error('Failed to execute workflow');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize workflow job processor
  useEffect(() => {
    WorkflowJobService.startProcessor();
    return () => {
      WorkflowJobService.stopProcessor();
    };
  }, []);

  // Load workflows on mount
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  return {
    workflows,
    currentWorkflow,
    isLoading,
    error,
    loadWorkflows,
    loadWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow
  };
} 