
import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, useReactFlow, Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';
import { useAuth } from '@/contexts/AuthContext';

export interface UseFlowProps {
  workflowId?: string;
  initialData?: {
    nodes: Node[];
    edges: Edge[];
  };
  onInit?: (instance: any) => void;
}

export const useFlow = ({ workflowId, initialData, onInit }: UseFlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const reactFlowInstance = useReactFlow();
  const { user } = useAuth();

  const handleInit = useCallback((instance: any) => {
    if (onInit) {
      // Add saveWorkflow method to the instance
      const enhancedInstance = {
        ...instance,
        saveWorkflow: async (name: string) => {
          if (!user) {
            toast.error("You need to be logged in to save workflows");
            return;
          }
          
          try {
            const flowObj = instance.toObject();
            
            const workflowData = {
              id: workflowId || crypto.randomUUID(),
              name,
              data: flowObj,
            };
            
            const result = await WorkflowService.saveWorkflow(workflowData);
            
            if (result.success) {
              return result.id;
            } else {
              throw new Error("Failed to save workflow");
            }
          } catch (error) {
            console.error("Error saving workflow:", error);
            throw error;
          }
        }
      };
      
      onInit(enhancedInstance);
    }
  }, [onInit, workflowId, user]);

  // Load workflow by ID
  useEffect(() => {
    if (workflowId) {
      const loadWorkflow = async () => {
        setIsLoading(true);
        try {
          const { success, workflow, error } = await WorkflowService.loadWorkflow(workflowId);
          
          if (success && workflow) {
            if (workflow.data?.nodes) {
              setNodes(workflow.data.nodes);
            }
            
            if (workflow.data?.edges) {
              setEdges(workflow.data.edges);
            }
          } else {
            console.error("Error loading workflow:", error);
            toast.error("Failed to load workflow");
          }
        } catch (error) {
          console.error("Error loading workflow:", error);
          toast.error("Failed to load workflow");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadWorkflow();
    } else if (initialData && !isLoading) {
      // Apply initial data from template if provided and not loading a workflow
      if (initialData.nodes) {
        setNodes(initialData.nodes);
      }
      
      if (initialData.edges) {
        setEdges(initialData.edges);
      }
    }
  }, [workflowId, setNodes, setEdges, initialData, isLoading]);

  // Event handlers
  const onConnect = useCallback((params) => {
    setEdges((eds) => [...eds, { ...params, id: `e-${params.source}-${params.target}` }]);
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      // Check if the dropped element is valid
      if (!nodeData) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${nodeData.type}-${crypto.randomUUID().substring(0, 8)}`,
        type: nodeData.type,
        position,
        data: { ...nodeData.data },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  // Add event listeners for custom events
  useEffect(() => {
    const handleAddAutomation = (event: CustomEvent) => {
      if (!event.detail?.automationData) return;
      
      const { automationData } = event.detail;
      
      // Create an automation node at a fixed position (or calculate a position)
      const newNode = {
        id: `automation-${Date.now()}`,
        type: 'automationNode',
        position: { x: 100, y: 100 },
        data: automationData,
      };
      
      setNodes((nds) => [...nds, newNode]);
    };
    
    // Register event listener
    document.addEventListener('add-automation', handleAddAutomation as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('add-automation', handleAddAutomation as EventListener);
    };
  }, [setNodes]);

  return {
    nodes,
    edges,
    isLoading,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    handleInit
  };
};
