import React, { useCallback, useState, useEffect, useRef, CSSProperties } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  PanelPosition,
  BackgroundVariant
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
import { Moon, Sun, ZoomIn, ZoomOut, Maximize, Lock, Unlock } from 'lucide-react';
import { useWorkflowDarkMode, DARK_GOLD, DARK_BG, DARK_TEXT, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

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

// The actual Flow component content
function FlowContent({ onInit, workflowId, onNodeSelect, workflowDarkMode, toggleDarkMode }: FlowProps) {
  // Use the global dark mode context
  const { darkMode: globalDarkMode, toggleDarkMode: toggleGlobalDarkMode, isDarkModeLocked } = useWorkflowDarkMode();
  
  // Respect props if provided, otherwise use global state
  // When dark mode is locked, always use dark mode regardless of props
  const actualDarkMode = isDarkModeLocked ? true : (workflowDarkMode !== undefined ? workflowDarkMode : globalDarkMode);
  const actualToggleDarkMode = toggleDarkMode || toggleGlobalDarkMode;
  
  // Sync with global state when props change
  useEffect(() => {
    console.log('Flow component received workflowDarkMode prop:', workflowDarkMode, 'Lock state:', isDarkModeLocked);
  }, [workflowDarkMode, isDarkModeLocked]);

  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [instance, setInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isInteractive, setIsInteractive] = useState(true);

  const handleInit = useCallback((flowInstance) => {
    setInstance(flowInstance);
    onInit(flowInstance);
    
    // Initial fit view after a small delay to ensure nodes are loaded
    setTimeout(() => {
      if (flowInstance) {
        flowInstance.fitView({ padding: 0.2 });
      }
    }, 100);
  }, [onInit]);

  // Direct control handlers
  const handleZoomIn = () => {
    if (instance) {
      instance.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (instance) {
      instance.zoomOut({ duration: 300 });
    }
  };

  const handleFitView = () => {
    if (instance) {
      instance.fitView({ padding: 0.2, duration: 400 });
    }
  };

  const toggleInteractivity = () => {
    if (instance) {
      const nextInteractiveValue = !isInteractive;
      instance.setInteractive(nextInteractiveValue);
      setIsInteractive(nextInteractiveValue);
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      if (!instance) return;

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
    [instance, actualDarkMode, setNodes]
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

  // Update all nodes when dark mode changes
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

  // Styles for the standalone control buttons
  const controlButtonStyle: CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: actualDarkMode ? DARK_SECONDARY : 'white',
    color: actualDarkMode ? DARK_TEXT : '#333',
    border: `2px solid ${actualDarkMode ? DARK_GOLD : '#ddd'}`,
    borderRadius: '4px',
    marginBottom: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    zIndex: 5000
  };

  return (
    <div 
      className={`h-full w-full relative ${actualDarkMode ? 'workflow-dark-mode' : ''} ${isDarkModeLocked ? 'dark-mode-locked' : ''}`} 
      style={actualDarkMode ? { background: DARK_BG, color: DARK_TEXT, borderColor: DARK_GOLD } : {}}
    >
      {/* Add back styling for background dots */}
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
          
          /* Dark mode specific styling for ReactFlow */
          .workflow-dark-mode .react-flow__pane {
            background-color: ${DARK_BG} !important;
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0.6px, transparent 0.6px) !important;
            background-size: 14px 14px !important;
            background-position: 0px 0px !important;
          }
          
          .workflow-dark-mode .react-flow__node.selected {
            border-width: 2px !important;
            box-shadow: 0 0 0 2px ${DARK_GOLD}, 0 4px 20px rgba(0, 0, 0, 0.7) !important;
          }
          
          .workflow-dark-mode .react-flow__edge.animated path {
            stroke-dasharray: 5, 5 !important;
            animation: electricity 0.5s linear infinite !important;
          }
        `}
      </style>
      
      {/* Standalone Controls - Outside of ReactFlow */}
      <div 
        className="absolute bottom-20 left-4 z-50 flex flex-col"
        style={{
          zIndex: 5000,
          pointerEvents: 'all'
        }}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          style={controlButtonStyle}
          className="control-button zoom-in"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
        
        <button
          type="button"
          onClick={handleZoomOut}
          style={controlButtonStyle}
          className="control-button zoom-out"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        
        <button
          type="button"
          onClick={handleFitView}
          style={controlButtonStyle}
          className="control-button fit-view"
          title="Fit View"
          aria-label="Fit view"
        >
          <Maximize size={20} />
        </button>
        
        <button
          type="button"
          onClick={toggleInteractivity}
          style={controlButtonStyle}
          className="control-button toggle-interactive"
          title={isInteractive ? "Lock View" : "Unlock View"}
          aria-label="Toggle interactivity"
        >
          {isInteractive ? <Unlock size={20} /> : <Lock size={20} />}
        </button>
      </div>
      
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
            style: { 
              stroke: actualDarkMode ? DARK_GOLD : '#3b82f6',
              strokeWidth: actualDarkMode ? 2 : 1.5
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: actualDarkMode ? DARK_GOLD : '#3b82f6',
              width: 15,
              height: 15
            }
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
        fitViewOptions={{ padding: 0.2 }}
        className={`${actualDarkMode ? 'workflow-dark-mode-flow' : ''} ${isDarkModeLocked ? 'dark-mode-locked' : ''}`}
        style={actualDarkMode ? { 
          background: DARK_BG, 
          color: DARK_TEXT, 
          border: `3px solid ${DARK_GOLD}`,
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.3)'
        } : {}}
        defaultEdgeOptions={{
          style: { strokeWidth: actualDarkMode ? 2 : 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: actualDarkMode ? DARK_GOLD : '#3b82f6'
          }
        }}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={true}
        panOnScroll={false}
        selectionOnDrag={false}
        elementsSelectable={true}
        nodesDraggable={true}
        nodesConnectable={true}
        zoomOnDoubleClick={true}
        panOnDrag={true}
      >
        <Background 
          color={actualDarkMode ? "#ffffff" : undefined} 
          gap={20}
          size={actualDarkMode ? 1.2 : 1}
          variant={BackgroundVariant.Dots}
        />
        
        <MiniMap 
          className="!bottom-20 !right-4" 
          style={actualDarkMode ? { 
            background: DARK_BG, 
            borderColor: DARK_GOLD,
            borderWidth: '2px',
            borderStyle: 'solid',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          } : {}} 
          nodeColor={actualDarkMode ? DARK_GOLD : undefined}
          maskColor={actualDarkMode ? 'rgba(24, 20, 12, 0.6)' : undefined}
        />
        
        {/* Add dark mode toggle button inside flow */}
        <Panel position="top-right" className="mt-2 mr-2">
          <button
            onClick={actualToggleDarkMode}
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
            style={{
              background: actualDarkMode ? DARK_GOLD : 'white',
              border: `2px solid ${actualDarkMode ? DARK_GOLD : '#ccc'}`,
              color: actualDarkMode ? '#18140c' : '#333',
              transform: 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}
            title={actualDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {actualDarkMode ? (
              <Sun size={16} />
            ) : (
              <Moon size={16} />
            )}
          </button>
        </Panel>
      </ReactFlow>

      {selectedNode && (
        <NodeDetailsPanel
          node={selectedNode}
          onClose={handleClosePanel}
          onUpdate={handleUpdateNode}
          workflowDarkMode={actualDarkMode}
        />
      )}

      {/* Floating fit view button on the right side as an additional option */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleFitView}
          className="p-2 rounded-full shadow-lg focus:outline-none"
          style={{
            background: actualDarkMode ? DARK_GOLD : 'white',
            border: `2px solid ${actualDarkMode ? DARK_GOLD : '#ccc'}`,
            color: actualDarkMode ? '#18140c' : '#333',
          }}
          title="Fit View"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Export the Flow with ReactFlowProvider to fix the zustand error
export function Flow(props: FlowProps) {
  return (
    <ReactFlowProvider>
      <FlowContent {...props} />
    </ReactFlowProvider>
  );
}
