
import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomerNode } from './nodes/CustomerNode';
import { JobNode } from './nodes/JobNode';
import { TaskNode } from './nodes/TaskNode';
import { QuoteNode } from './nodes/QuoteNode';
import { CustomNode } from './nodes/CustomNode';
import { VisionNode } from './nodes/VisionNode';
import { toast } from 'sonner';

// Define node types
const nodeTypes = {
  customerNode: CustomerNode,
  jobNode: JobNode,
  taskNode: TaskNode,
  quoteNode: QuoteNode,
  customNode: CustomNode,
  visionNode: VisionNode
};

export function Flow({ onInit }) {
  // Initial nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useRef(null);

  // Handle connections between nodes
  const onConnect = useCallback((params) => {
    // Special handling for vision nodes connecting to financial nodes
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
    
    if (sourceNode?.type === 'visionNode' && targetNode?.type === 'quoteNode') {
      toast.info('Vision analysis will feed data to financial node');
      
      // Simulate processing - in a real app, this would trigger actual data processing
      setTimeout(() => {
        toast.success('Financial data extracted and applied');
      }, 1500);
    }
    
    setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true
    }, eds));
  }, [nodes, setEdges]);

  // Handle node dropping from sidebar
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    
    if (!type || !reactFlowInstance.current) {
      return;
    }

    // Get drop position
    const position = reactFlowInstance.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create a new node
    const nodeId = `${type}-${Date.now()}`;
    let newNode = {
      id: nodeId,
      type,
      position,
      data: { label: `New ${type.replace('Node', '')}` },
    };
    
    // Add special handling for vision nodes
    if (type === 'visionNode') {
      newNode.data.label = 'Extract Financial Data';
    }

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Handle drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Set up flow on init
  const onInitFlow = useCallback((instance) => {
    reactFlowInstance.current = instance;
    onInit && onInit(instance);
    
    // Try to load saved workflow if any
    const savedFlow = localStorage.getItem('workflow-data');
    if (savedFlow) {
      try {
        const flow = JSON.parse(savedFlow);
        if (flow.nodes && flow.edges) {
          setNodes(flow.nodes);
          setEdges(flow.edges);
          toast.info('Loaded saved workflow');
        }
      } catch (error) {
        console.error('Error loading saved workflow:', error);
      }
    }
  }, [onInit, setNodes, setEdges]);

  // Handle custom node deletion
  useEffect(() => {
    const handleDeleteNode = (event) => {
      const { id } = event.detail;
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) => edges.filter((edge) => 
        edge.source !== id && edge.target !== id
      ));
    };

    const handleUpdateNode = (event) => {
      const { id, data } = event.detail;
      setNodes((nodes) => nodes.map((node) => 
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ));
    };

    document.addEventListener('delete-node', handleDeleteNode);
    document.addEventListener('update-node', handleUpdateNode);
    
    return () => {
      document.removeEventListener('delete-node', handleDeleteNode);
      document.removeEventListener('update-node', handleUpdateNode);
    };
  }, [setNodes, setEdges]);

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInitFlow}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="bottom-right">
            <div className="bg-white p-2 rounded shadow text-xs">
              Drag nodes from left sidebar • Connect nodes by dragging handles
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
