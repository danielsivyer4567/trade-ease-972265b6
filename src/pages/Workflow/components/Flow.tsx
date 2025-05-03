import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
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
import AnimatedEdge from './AnimatedEdge';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { WorkflowService } from '@/services/WorkflowService';
import { supabase } from '@/integrations/supabase/client';
import { useWorkflow } from '@/hooks/useWorkflow';
import { Moon, Sun } from 'lucide-react';
import { useWorkflowDarkMode, DARK_GOLD, DARK_BG, DARK_TEXT } from '@/contexts/WorkflowDarkModeContext';

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

const edgeTypes = {
  animated: AnimatedEdge,
};

interface FlowProps {
  onInit: (flowInstance: any) => void;
  workflowId?: string;
  onNodeSelect?: (node: any) => void;
  workflowDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const defaultNodes = [];
const defaultEdges = [];

export function Flow({ onInit, workflowId, onNodeSelect, workflowDarkMode = false, toggleDarkMode }: FlowProps) {
  // Use the global dark mode context
  const { darkMode, toggleDarkMode: toggleGlobalDarkMode } = useWorkflowDarkMode();
  
  // Use either the prop or global state, preferring global
  const actualDarkMode = workflowDarkMode || darkMode;
  const actualToggleDarkMode = toggleDarkMode || toggleGlobalDarkMode;
  
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [instance, setInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleInit = useCallback((flowInstance) => {
    setInstance(flowInstance);
    onInit(flowInstance);
  }, [onInit]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = instance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: type,
          workflowDarkMode: actualDarkMode
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [instance, actualDarkMode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  const handleClosePanel = () => setSelectedNode(null);
  const handleUpdateNode = (nodeId, data) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n));
  };

  // Update all nodes when actualDarkMode changes
  useEffect(() => {
    console.log('Flow dark mode state:', actualDarkMode);
    setNodes((nds) => 
      nds.map(node => ({
        ...node,
        data: { 
          ...node.data,
          workflowDarkMode: actualDarkMode
        }
      }))
    );
  }, [actualDarkMode, setNodes]);

  return (
    <div className="h-full w-full relative" style={actualDarkMode ? { background: DARK_BG, color: DARK_TEXT, borderColor: DARK_GOLD } : {}}>
      <style>
        {`
          @keyframes electricity {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -20;
            }
          }
          
          .react-flow__controls {
            pointer-events: auto !important;
            z-index: 5 !important;
          }
        `}
      </style>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => {
          const newEdge = {
            ...params,
            type: 'animated',
            animated: true,
            style: { stroke: actualDarkMode ? DARK_GOLD : '#3b82f6' },
          };
          setEdges((eds) => addEdge(newEdge, eds));
        }}
        onInit={handleInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={actualDarkMode ? { 
          background: DARK_BG, 
          color: DARK_TEXT, 
          border: `3px solid ${DARK_GOLD}` 
        } : {}}
      >
        <Background 
          color={actualDarkMode ? DARK_GOLD : undefined} 
          gap={16}
          size={1}
        />
        
        <Controls 
          className="!bottom-20 !left-4" 
          style={actualDarkMode ? { 
            color: DARK_GOLD,
            background: DARK_BG, 
            borderColor: DARK_GOLD,
            borderWidth: '2px',
            borderStyle: 'solid'
          } : {}} 
        />
        
        <MiniMap 
          className="!bottom-20 !right-4" 
          style={actualDarkMode ? { 
            background: DARK_BG, 
            borderColor: DARK_GOLD,
            borderWidth: '2px',
            borderStyle: 'solid'
          } : {}} 
        />
      </ReactFlow>

      {selectedNode && (
        <NodeDetailsPanel
          node={selectedNode}
          onClose={handleClosePanel}
          onUpdate={handleUpdateNode}
          workflowDarkMode={actualDarkMode}
        />
      )}
    </div>
  );
}
