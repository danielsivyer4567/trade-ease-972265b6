
import { useState, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  ReactFlowInstance, 
  Connection,
  XYPosition
} from '@xyflow/react';
import { WorkflowService } from '@/services/WorkflowService';

interface UseFlowProps {
  workflowId?: string;
  initialData?: {
    nodes: Node[];
    edges: Edge[];
  };
  onInit?: (instance: ReactFlowInstance) => void;
}

export const useFlow = ({ workflowId, initialData, onInit }: UseFlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialData?.edges || []);
  const [isLoading, setIsLoading] = useState(workflowId ? true : false);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const nodeIdCounter = useRef(1);

  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
    
    if (onInit) {
      onInit(instance);
    }

    // If a workflowId is provided, load that workflow
    if (workflowId) {
      loadWorkflow(workflowId, instance);
    } else {
      setIsLoading(false);
    }
  }, [workflowId, onInit]);

  // Connect nodes
  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge(connection, eds));
  }, [setEdges]);

  // Load workflow
  const loadWorkflow = async (id: string, instance: ReactFlowInstance) => {
    try {
      setIsLoading(true);
      const { success, workflow, error } = await WorkflowService.loadWorkflow(id);
      
      if (!success || !workflow) {
        throw new Error(error || 'Failed to load workflow');
      }
      
      // Update nodes and edges from the loaded workflow
      if (workflow.data && instance) {
        if (workflow.data.nodes) {
          instance.setNodes(workflow.data.nodes);
        }
        
        if (workflow.data.edges) {
          instance.setEdges(workflow.data.edges);
        }
      }
      
      // Find the highest node ID to continue from
      if (workflow.data?.nodes?.length) {
        const highestId = workflow.data.nodes.reduce((max, node) => {
          const idNum = parseInt(node.id.toString().split('-').pop() || '0', 10);
          return idNum > max ? idNum : max;
        }, 0);
        nodeIdCounter.current = highestId + 1;
      }
      
      setTimeout(() => {
        instance.fitView({ padding: 0.2 });
      }, 100);
    } catch (error) {
      console.error('Error loading workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dropping nodes onto the canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!reactFlowInstance) return;

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow/type');
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow/data') || '{}');
    
    // Check if the dropped element is valid
    if (!type) return;

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: `${type}-${nodeIdCounter.current++}`,
      type,
      position,
      data: { ...data },
    };

    setNodes(nds => [...nds, newNode]);
  }, [reactFlowInstance, setNodes]);

  return {
    nodes,
    edges,
    isLoading,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    handleInit,
    reactFlowInstance
  };
};
