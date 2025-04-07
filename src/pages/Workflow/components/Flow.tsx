
import React from 'react';
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

// Internal component that uses the hook
const FlowComponent: React.FC<FlowProps> = ({ onInit, workflowId, initialData }) => {
  const {
    nodes,
    edges,
    isLoading,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    handleInit
  } = useFlow({ workflowId, initialData, onInit });

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
};

// Wrapper component that provides the ReactFlowProvider
export const Flow: React.FC<FlowProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowComponent {...props} />
    </ReactFlowProvider>
  );
};
