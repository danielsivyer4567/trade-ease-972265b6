
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';

export const useWorkflowSync = (workflowId?: string) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Load workflow data when ID changes
  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    setIsSyncing(true);
    try {
      const response = await WorkflowService.getWorkflow(id);
      if (response.success && response.workflows && response.workflows.length > 0) {
        const workflow = response.workflows[0];
        setLastSynced(new Date());
        return workflow;
      } else {
        toast.error('Failed to load workflow');
        return null;
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
      toast.error('Error loading workflow');
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const saveWorkflow = async (workflow: any) => {
    setIsSyncing(true);
    try {
      const result = await WorkflowService.saveWorkflow(workflow);
      if (result.success) {
        setLastSynced(new Date());
        setNeedsSaving(false);
        toast.success('Workflow saved');
        return result.id;
      } else {
        toast.error(result.error || 'Failed to save workflow');
        return null;
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Error saving workflow');
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const markAsChanged = useCallback(() => {
    setNeedsSaving(true);
  }, []);

  return {
    loadWorkflow,
    saveWorkflow,
    isSyncing,
    lastSynced,
    needsSaving,
    markAsChanged,
  };
};
