
import { useCallback, useState } from 'react';
import ReactFlow, { ReactFlowInstance, Node, Edge, Connection, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

// This is a simplified version - implement as needed
export const useFlow = (initialNodes = [], initialEdges = []) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        id: `edge-${uuidv4()}`,
        source: connection.source,
        target: connection.target,
        type: 'default',
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    []
  );

  const addNode = useCallback(
    (nodeData) => {
      const newNode = {
        id: `node-${uuidv4()}`,
        type: nodeData.type || 'default',
        position: { x: 250, y: 250 },
        data: { label: nodeData.label, ...nodeData },
      };
      setNodes((nds) => [...nds, newNode]);
      return newNode;
    },
    []
  );

  const updateNode = useCallback(
    (nodeId, data) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, ...data },
            };
          }
          return node;
        })
      );
    },
    []
  );

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        )
      );
    },
    []
  );

  const fitView = useCallback(() => {
    if (reactFlowInstance) {
      // Use setTimeout to ensure the flow is properly mounted
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [reactFlowInstance]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      // Use reactFlowInstance.toObject() to get the current flow state
      const flowObject = reactFlowInstance.toObject();
      return {
        nodes: flowObject.nodes,
        edges: flowObject.edges,
        viewport: flowObject.viewport,
      };
    }
    return { nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } };
  }, [reactFlowInstance, nodes, edges]);

  const onRestore = useCallback(
    (flowData) => {
      if (flowData) {
        const { nodes: restoredNodes, edges: restoredEdges, viewport } = flowData;
        setNodes(restoredNodes || []);
        setEdges(restoredEdges || []);
        
        if (reactFlowInstance && viewport) {
          reactFlowInstance.setViewport(viewport);
        }
      }
    },
    [reactFlowInstance]
  );

  const getNodeById = useCallback(
    (id) => {
      return nodes.find((node) => node.id === id);
    },
    [nodes]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    addNode,
    updateNode,
    deleteNode,
    setReactFlowInstance,
    reactFlowInstance,
    fitView,
    onSave,
    onRestore,
    getNodeById,
  };
};
