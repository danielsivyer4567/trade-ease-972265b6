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
import { AutomationNode } from './nodes/AutomationNode';
import { MessagingNode } from './nodes/MessagingNode';
import { NodeDetailsPanel } from './NodeDetailsPanel';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { WorkflowService } from '@/services/WorkflowService';
import { supabase } from '@/integrations/supabase/client';

// Define node data types for better type safety
interface BaseNodeData {
  label: string;
  [key: string]: any; // Allow additional properties
}

// Define node types
const nodeTypes = {
  customerNode: CustomerNode,
  jobNode: JobNode,
  taskNode: TaskNode,
  quoteNode: QuoteNode,
  customNode: CustomNode,
  visionNode: VisionNode,
  automationNode: AutomationNode,
  messagingNode: MessagingNode,
  emailNode: MessagingNode,
  whatsappNode: MessagingNode,
  socialNode: CustomNode,
};

interface FlowProps {
  onInit?: (instance: any) => void;
  workflowId?: string;
}

export function Flow({ onInit, workflowId }: FlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowInstance = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  // Load workflow if ID is provided
  useEffect(() => {
    const loadWorkflow = async () => {
      if (!workflowId) return;

      try {
        const { data: workflow, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('id', workflowId)
          .single();

        if (error) throw error;

        if (workflow?.data) {
          setNodes(workflow.data.nodes || []);
          setEdges(workflow.data.edges || []);
        }
      } catch (error) {
        console.error('Error loading workflow:', error);
        toast.error('Failed to load workflow');
      }
    };

    loadWorkflow();
  }, [workflowId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    event.preventDefault();
    setSelectedNode(node);
  }, []);

  const handleNodeUpdate = useCallback(async (nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );

    // Save workflow if authenticated
    if (isAuthenticated && workflowId) {
      try {
        const { error } = await supabase
          .from('workflows')
          .update({
            data: {
              nodes: nodes.map(n => 
                n.id === nodeId 
                  ? { ...n, data: { ...n.data, ...data } }
                  : n
              ),
              edges
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', workflowId);

        if (error) throw error;
        toast.success('Workflow updated');
      } catch (error) {
        console.error('Error saving workflow:', error);
        toast.error('Failed to save workflow');
      }
    }
  }, [nodes, edges, isAuthenticated, workflowId]);

  // Set up flow on init
  const onInitFlow = useCallback((instance) => {
    reactFlowInstance.current = instance;
    onInit && onInit(instance);
  }, [onInit]);

  return (
    <ReactFlowProvider>
      <div className="relative w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInitFlow}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className={selectedNode ? 'pr-[400px]' : ''}
        >
          <Background />
          <Controls />
          <Panel position="bottom-right">
            <div className="bg-white p-2 rounded shadow text-xs">
              Drag nodes from left sidebar • Connect nodes by dragging handles
              {!isAuthenticated && (
                <div className="mt-1 text-amber-600">
                  Sign in to save workflows to cloud
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>
        {selectedNode && (
          <NodeDetailsPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleNodeUpdate}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}
