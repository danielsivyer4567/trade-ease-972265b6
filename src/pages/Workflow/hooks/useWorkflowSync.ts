
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ReactFlowInstance } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { WorkflowService } from '@/services/WorkflowService';
import { useAuth } from '@/contexts/AuthContext';

export const useWorkflowSync = (
  flowInstance: ReactFlowInstance | null,
  workflowId?: string,
  workflowName?: string,
  workflowDescription?: string,
  workflowCategory?: string
) => {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { user } = useAuth();

  // Function to save workflow to the database
  const saveWorkflow = useCallback(async (force = false) => {
    if (!flowInstance || !user) return false;
    if (isSyncing && !force) return false;

    try {
      setIsSyncing(true);
      
      const nodes = flowInstance.getNodes();
      const edges = flowInstance.getEdges();
      
      const workflowData = {
        id: workflowId || crypto.randomUUID(),
        name: workflowName || 'Untitled Workflow',
        description: workflowDescription || '',
        category: workflowCategory || '',
        data: {
          nodes,
          edges,
          updated_at: new Date().toISOString()
        }
      };
      
      const result = await WorkflowService.saveWorkflow(workflowData);
      
      if (result.success) {
        setLastSavedAt(new Date());
        setHasUnsavedChanges(false);
        return true;
      } else {
        throw new Error(result.error || 'Failed to save workflow');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow. Please try again.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [flowInstance, workflowId, workflowName, workflowDescription, workflowCategory, isSyncing, user]);

  // Set up auto-save on nodes/edges change
  useEffect(() => {
    if (!flowInstance) return;

    const handleChange = () => {
      setHasUnsavedChanges(true);
    };

    // Use Event Listeners via DOM events instead of ReactFlow instance methods
    const container = document.querySelector('.react-flow');
    if (container) {
      container.addEventListener('nodechange', handleChange);
      container.addEventListener('edgechange', handleChange);
      container.addEventListener('nodeschange', handleChange);
      container.addEventListener('edgeschange', handleChange);
      container.addEventListener('connect', handleChange);
    }

    return () => {
      if (container) {
        container.removeEventListener('nodechange', handleChange);
        container.removeEventListener('edgechange', handleChange);
        container.removeEventListener('nodeschange', handleChange);
        container.removeEventListener('edgeschange', handleChange);
        container.removeEventListener('connect', handleChange);
      }
    };
  }, [flowInstance]);

  // Set up auto-save interval
  useEffect(() => {
    if (!hasUnsavedChanges || !user) return;

    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveWorkflow();
      }
    }, 60000); // Auto-save every minute if there are unsaved changes

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [hasUnsavedChanges, saveWorkflow, user]);

  // Set up real-time collaboration through Supabase realtime
  useEffect(() => {
    if (!workflowId || !user) return;

    const channel = supabase
      .channel(`workflow-${workflowId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'workflows',
        filter: `id=eq.${workflowId}`,
      }, (payload) => {
        // Only update if change was made by another user
        if (payload.new && payload.new.user_id !== user.id) {
          toast.info('Workflow updated by another user. Refreshing...');
          
          // Reload the workflow data
          if (flowInstance && payload.new.data) {
            const { nodes, edges } = payload.new.data;
            if (nodes && edges) {
              flowInstance.setNodes(nodes);
              flowInstance.setEdges(edges);
              flowInstance.fitView();
              toast.success('Workflow synchronized successfully');
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workflowId, flowInstance, user]);

  return {
    lastSavedAt,
    isSyncing,
    hasUnsavedChanges,
    saveWorkflow,
  };
};
