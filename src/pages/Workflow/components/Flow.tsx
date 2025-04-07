
import React, { useImperativeHandle, forwardRef } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, ReactFlowInstance, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlow } from '../hooks/useFlow';
import { FlowLoading } from './flow/FlowLoading';
import { nodeTypes } from './flow/NodeTypes';

interface FlowProps {
  onInit?: (instance: ReactFlowInstance) => void;
  workflowId?: string;
  initialData?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface FlowHandle {
  getNodes: () => Node[];
  getEdges: () => Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

// Internal component that uses the hook
const FlowComponent = forwardRef<FlowHandle, FlowProps>(({ onInit, workflowId, initialData }, ref) => {
  const {
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
  } = useFlow({ workflowId, initialData, onInit });

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getNodes: () => reactFlowInstance ? reactFlowInstance.getNodes() : [],
    getEdges: () => reactFlowInstance ? reactFlowInstance.getEdges() : [],
    setNodes: (nodes) => reactFlowInstance && reactFlowInstance.setNodes(nodes),
    setEdges: (edges) => reactFlowInstance && reactFlowInstance.setEdges(edges)
  }));

  if (isLoading) {
    return <FlowLoading />;
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={handleInit}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.5}
      maxZoom={1.5}
      deleteKeyCode={['Backspace', 'Delete']}
      className="bg-white"
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
});

// Wrapper component that provides the ReactFlowProvider
export const Flow = forwardRef<FlowHandle, FlowProps>((props, ref) => {
  return (
    <ReactFlowProvider>
      <FlowComponent ref={ref} {...props} />
    </ReactFlowProvider>
  );
});

Flow.displayName = 'Flow';
