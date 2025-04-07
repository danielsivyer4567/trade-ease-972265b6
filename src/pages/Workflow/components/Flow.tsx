
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export interface FlowHandle {
  saveWorkflow: (name: string) => Promise<string>;
}

interface FlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setReactFlowInstance?: (instance: any) => void;
  workflowId?: string;
  readOnly?: boolean;
}

const Flow: React.FC<FlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setReactFlowInstance,
  workflowId,
  readOnly = false,
}) => {
  const handleInit = useCallback((instance: any) => {
    if (setReactFlowInstance) {
      setReactFlowInstance(instance);
    }
  }, [setReactFlowInstance]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Handle drop implementation if needed
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={handleInit}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Flow;
