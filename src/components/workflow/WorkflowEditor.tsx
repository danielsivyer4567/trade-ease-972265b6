import React, { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { NodeData, WorkflowData } from '@/types/workflow';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);

  // Update nodes when workflow changes
  useEffect(() => {
    if (workflow?.data.nodes) {
      setNodes(ensureNodeData(workflow.data.nodes));
    }
  }, [workflow?.data.nodes]);

  return null; // Add your JSX here
} 