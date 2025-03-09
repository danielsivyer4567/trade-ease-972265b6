
import React, { useCallback, useEffect, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskNode } from './nodes/TaskNode';
import { CustomerNode } from './nodes/CustomerNode';
import { JobNode } from './nodes/JobNode';
import { QuoteNode } from './nodes/QuoteNode';

const nodeTypes = {
  taskNode: TaskNode,
  customerNode: CustomerNode,
  jobNode: JobNode,
  quoteNode: QuoteNode
};

// Initial nodes and edges if no saved state
const initialNodes = [
  {
    id: '1',
    type: 'customerNode',
    data: { label: 'Customer' },
    position: { x: 250, y: 50 },
  },
];

const initialEdges = [];

export function Flow({ onInit }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);

  const onConnect = useCallback((params) => 
    setEdges((eds) => addEdge(params, eds)), 
  []);

  // Pass the flow instance to the parent
  useEffect(() => {
    if (rfInstance) {
      onInit(rfInstance);
    }
  }, [rfInstance, onInit]);

  // Load saved workflow from localStorage
  useEffect(() => {
    const storedFlow = localStorage.getItem('workflow-data');
    if (storedFlow) {
      try {
        const flow = JSON.parse(storedFlow);
        if (flow.nodes && flow.edges) {
          setNodes(flow.nodes);
          setEdges(flow.edges);
        }
      } catch (error) {
        console.error('Failed to parse stored workflow:', error);
      }
    }
  }, [setNodes, setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow/type');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow/data') || '{}');
      
      // Check if the dropped element is valid
      if (!nodeType) return;

      // Get the position where the element was dropped
      const reactFlowBounds = event.target.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setRfInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.DOTS} gap={12} size={1} />
      <Panel position="top-right">
        <div className="bg-white p-2 rounded shadow-md text-xs">
          Drag nodes from the sidebar to create your workflow
        </div>
      </Panel>
    </ReactFlow>
  );
}
