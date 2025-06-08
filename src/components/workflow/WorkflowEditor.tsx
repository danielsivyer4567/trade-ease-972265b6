import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
} from '@xyflow/react';
import { NodeData, WorkflowData } from '@/types/workflow';

import '@xyflow/react/dist/style.css';

interface WorkflowEditorProps {
  workflow?: {
    data: WorkflowData;
  };
  workflowDarkMode?: boolean;
  globalDarkMode?: boolean;
  isDarkModeLocked?: boolean;
}

export function WorkflowEditor({ workflow, workflowDarkMode, globalDarkMode, isDarkModeLocked }: WorkflowEditorProps) {
  // Ensure all nodes have the required label property
  const ensureNodeData = (nodes: any[]) => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        label: node.data.label || node.type || 'Unnamed Node'
      }
    }));
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(ensureNodeData(workflow?.data.nodes || []));
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.data.edges || []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
} 