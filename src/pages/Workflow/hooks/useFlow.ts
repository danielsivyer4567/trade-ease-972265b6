
import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, Node, Edge, Connection, ReactFlowInstance } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export const useFlow = ({ 
  workflowId, 
  initialData, 
  onInit,
  readOnly 
}: { 
  workflowId?: string; 
  initialData?: { nodes: Node[]; edges: Edge[] }; 
  onInit?: (instance: ReactFlowInstance) => void;
  readOnly?: boolean;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize flow with workflow data or initial data
  useEffect(() => {
    const loadWorkflow = async () => {
      setIsLoading(true);

      try {
        if (workflowId) {
          // In a real app, load workflow from API
          console.log(`Loading workflow with ID: ${workflowId}`);
          
          // Simulate loading delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock data for demonstration purposes
          setNodes([
            {
              id: '1',
              type: 'default',
              data: { label: 'Loaded Node 1' },
              position: { x: 250, y: 5 }
            },
            {
              id: '2',
              type: 'default',
              data: { label: 'Loaded Node 2' },
              position: { x: 100, y: 100 }
            }
          ]);
          
          setEdges([
            { id: 'e1-2', source: '1', target: '2', animated: true }
          ]);
        } else if (initialData) {
          // Use provided initial data
          setNodes(initialData.nodes || []);
          setEdges(initialData.edges || []);
        } else {
          // Start with an empty canvas
          setNodes([]);
          setEdges([]);
        }
      } catch (error) {
        console.error('Failed to load workflow:', error);
        // Reset to empty state on error
        setNodes([]);
        setEdges([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflow();
  }, [workflowId, initialData, setNodes, setEdges]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return; // Don't allow connections in readOnly mode
      setEdges((eds) => addEdge({ ...params, id: `e-${uuidv4()}` }, eds));
    },
    [setEdges, readOnly]
  );

  // Initialize ReactFlow
  const handleInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
      
      if (onInit) {
        onInit(instance);
      }
      
      setTimeout(() => {
        instance.fitView({ padding: 0.2 });
      }, 100);
    },
    [onInit]
  );

  // Handle drag over event for drag & drop functionality
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (readOnly) return; // Don't allow drag & drop in readOnly mode
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, [readOnly]);

  // Handle drop event for drag & drop functionality
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (readOnly) return; // Don't allow drops in readOnly mode
      
      event.preventDefault();
      
      if (!reactFlowInstance) return;
      
      // Get the data from the drag event
      const nodeType = event.dataTransfer.getData('application/reactflow/type');
      const nodeData = event.dataTransfer.getData('application/reactflow/data');
      
      if (!nodeType) return;
      
      // Get position of drop
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      // Create new node
      const newNode = {
        id: `node-${uuidv4()}`,
        type: nodeType,
        position,
        data: nodeData ? JSON.parse(nodeData) : { label: `${nodeType} node` },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, readOnly]
  );

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
    reactFlowInstance,
  };
};
