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
import './workflow.css'; // Import our custom workflow CSS
import CustomerNode from './nodes/CustomerNode';
import JobNode from './nodes/JobNode';
import TaskNode from './nodes/TaskNode';
import QuoteNode from './nodes/QuoteNode';
import CustomNode from './nodes/CustomNode';
import VisionNode from './nodes/VisionNode';
import AutomationNode from './nodes/AutomationNode';
import MessagingNode from './nodes/MessagingNode';
import { NodeDetailsPanel } from './NodeDetailsPanel';
import AnimatedEdge from './AnimatedEdge';
import { WorkflowAnimationExample } from './WorkflowAnimationExample';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { WorkflowService } from '@/services/WorkflowService';
import { supabase } from '@/integrations/supabase/client';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useWorkflowAnimation } from '@/hooks/useWorkflowAnimation';
import { ZoomIn, ZoomOut, Maximize, Lock, Unlock, User, Briefcase, ClipboardList, FileText, MessageSquare, Eye, Zap, Share2, Layout } from 'lucide-react';
import { DARK_GOLD, DARK_BG, DARK_TEXT, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

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

// Node type to icon mapping
const nodeTypeIcons = {
  customerNode: <User className="h-5 w-5 text-white" />,
  jobNode: <Briefcase className="h-5 w-5 text-white" />,
  taskNode: <ClipboardList className="h-5 w-5 text-white" />,
  quoteNode: <FileText className="h-5 w-5 text-white" />,
  messagingNode: <MessageSquare className="h-5 w-5 text-white" />,
  emailNode: <MessageSquare className="h-5 w-5 text-white" />,
  whatsappNode: <MessageSquare className="h-5 w-5 text-white" />,
  visionNode: <Eye className="h-5 w-5 text-white" />,
  automationNode: <Zap className="h-5 w-5 text-white" />,
  socialNode: <Share2 className="h-5 w-5 text-white" />,
  customNode: <Layout className="h-5 w-5 text-white" />
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
  nodes?: any[];
  edges?: any[];
  setNodes?: (nodes: any) => void;
  setEdges?: (edges: any) => void;
}

const defaultNodes = [];
const defaultEdges = [];

// The actual Flow component content
function FlowContent({ onInit, workflowId, onNodeSelect, workflowDarkMode = true, nodes: externalNodes, edges: externalEdges, setNodes: externalSetNodes, setEdges: externalSetEdges }: FlowProps) {
  // Always use dark mode
  const actualDarkMode = true;
  
  // Use external state if provided, otherwise use internal state
  const [internalNodes, setInternalNodes, onNodesChange] = useNodesState(defaultNodes);
  const [internalEdges, setInternalEdges, onEdgesChange] = useEdgesState(defaultEdges);
  
  const nodes = externalNodes || internalNodes;
  const edges = externalEdges || internalEdges;

  // Handle state updates based on whether external state is provided
  const setNodes = useCallback((updater) => {
    if (externalSetNodes) {
      if (typeof updater === 'function') {
        externalSetNodes(updater);
      } else {
        externalSetNodes(updater);
      }
    } else {
      setInternalNodes(updater);
    }
  }, [externalSetNodes, setInternalNodes]);

  const setEdges = useCallback((updater) => {
    if (externalSetEdges) {
      if (typeof updater === 'function') {
        externalSetEdges(updater);
      } else {
        externalSetEdges(updater);
      }
    } else {
      setInternalEdges(updater);
    }
  }, [externalSetEdges, setInternalEdges]);

  // Handle node changes based on whether external state is provided
  const handleNodesChange = useCallback((changes) => {
    if (externalSetNodes) {
      // Apply changes to external nodes
      externalSetNodes((nds) => {
        const nextNodes = [...nds];
        changes.forEach((change) => {
          if (change.type === 'remove') {
            const index = nextNodes.findIndex((n) => n.id === change.id);
            if (index !== -1) {
              nextNodes.splice(index, 1);
            }
          } else if (change.type === 'add') {
            nextNodes.push(change.item);
          } else if (change.type === 'position' || change.type === 'dimensions') {
            const index = nextNodes.findIndex((n) => n.id === change.id);
            if (index !== -1) {
              nextNodes[index] = { ...nextNodes[index], ...change };
            }
          }
        });
        return nextNodes;
      });
    } else {
      onNodesChange(changes);
    }
  }, [externalSetNodes, onNodesChange]);

  // Handle edge changes based on whether external state is provided
  const handleEdgesChange = useCallback((changes) => {
    if (externalSetEdges) {
      // Apply changes to external edges
      externalSetEdges((eds) => {
        const nextEdges = [...eds];
        changes.forEach((change) => {
          if (change.type === 'remove') {
            const index = nextEdges.findIndex((e) => e.id === change.id);
            if (index !== -1) {
              nextEdges.splice(index, 1);
            }
          } else if (change.type === 'add') {
            nextEdges.push(change.item);
          }
        });
        return nextEdges;
      });
    } else {
      onEdgesChange(changes);
    }
  }, [externalSetEdges, onEdgesChange]);

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

  // Track active nodes and edges
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
  
  // Handle setting an edge as active
  const setEdgeActive = useCallback((edgeId: string, isActive: boolean) => {
    setActiveEdges(prev => {
      const newSet = new Set(prev);
      if (isActive) {
        newSet.add(edgeId);
      } else {
        newSet.delete(edgeId);
      }
      return newSet;
    });
  }, []);

  // Handle setting a node as active
  const setNodeActive = useCallback((nodeId: string, isActive: boolean) => {
    setActiveNodeIds(prev => {
      const newSet = new Set(prev);
      if (isActive) {
        newSet.add(nodeId);
      } else {
        newSet.delete(nodeId);
      }
      return newSet;
    });

    // Also activate connected edges
    if (isActive) {
      // Find all edges that have this node as source
      const connectedEdges = edges.filter(edge => edge.source === nodeId);
      connectedEdges.forEach(edge => {
        setEdgeActive(edge.id, true);
      });
    }
  }, [edges, setEdgeActive]);

  // Update edges with active state
  useEffect(() => {
    if (!edges.length) return;

    const updatedEdges = edges.map(edge => {
      // Check if this edge is active
      const isActive = activeEdges.has(edge.id);
      
      // Get source node type for color styling
      const sourceType = edge.data?.sourceType || '';
      
      // Only update if the active state changed
      if (isActive !== edge.data?.isActive) {
        return {
          ...edge,
          data: {
            ...edge.data,
            isActive
          },
          className: isActive ? `workflow-edge-active ${sourceType}` : sourceType
        };
      }
      
      // Ensure the class is always added, even if active state didn't change
      if (!edge.className && sourceType) {
        return {
          ...edge,
          className: isActive ? `workflow-edge-active ${sourceType}` : sourceType
        };
      }
      
      return edge;
    });
    
    // Only update if there were changes
    if (JSON.stringify(updatedEdges) !== JSON.stringify(edges)) {
      if (externalSetEdges) {
        externalSetEdges(updatedEdges);
      } else {
        setEdges(updatedEdges);
      }
    }
  }, [edges, activeEdges, externalSetEdges, setEdges]);

  const onConnect = useCallback(
    (params) => {
      // Find source node to get its type for coloring
      const sourceNode = nodes.find(node => node.id === params.source);
      const sourceType = sourceNode ? sourceNode.type : null;
      
      const newEdge = {
        ...params,
        type: 'animated',
        animated: true,
        data: {
          isActive: false, // Start inactive
          sourceType: sourceType // Store source type for coloring
        },
        style: { 
          stroke: actualDarkMode ? 'rgba(165, 149, 255, 0.6)' : '#3b82f6',
          strokeWidth: actualDarkMode ? 2 : 1.5
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: actualDarkMode ? 'rgba(165, 149, 255, 0.8)' : '#3b82f6',
          width: 15,
          height: 15
        }
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [actualDarkMode, setEdges, nodes]
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

      // Create a unique ID with timestamp to avoid conflicts
      const uniqueId = `${type}-${Date.now()}`;
      
      const newNode = {
        id: uniqueId,
        type,
        position,
        data: { 
          label: type.replace('Node', ''),
          workflowDarkMode: actualDarkMode,
          icon: nodeTypeIcons[type],
          iconComponent: nodeTypeIcons[type],
          // Add default description based on node type
          description: getNodeDescription(type)
        },
        className: `resizable ${type}`,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [instance, actualDarkMode, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Initialize the animation hook
  const {
    activeEdges: animationActiveEdges,
    activateEdge: animationActivateEdge,
    deactivateEdge: animationDeactivateEdge,
    activateNodeOutgoingEdges: animationActivateNodeOutgoingEdges,
    activateEdgePath: animationActivateEdgePath,
    deactivateAllEdges: animationDeactivateAllEdges
  } = useWorkflowAnimation({ 
    edges, 
    setEdges: (newEdges) => {
      if (externalSetEdges) {
        externalSetEdges(newEdges);
      } else {
        setEdges(newEdges);
      }
    },
    animationDuration: 3000 // 3 seconds by default
  });

  // Handle node click with activation
  const onNodeClick = (event, node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
    setSelectedNode(node);
    
    // Add active class to the node
    setNodes(nds => 
      nds.map(n => ({
        ...n,
        className: n.id === node.id 
          ? `resizable ${n.type} active-node` 
          : `resizable ${n.type}`
      }))
    );
    
    // Activate all outgoing edges from this node
    animationActivateNodeOutgoingEdges(node.id);
  };

  const handleClosePanel = () => setSelectedNode(null);
  const handleUpdateNode = (nodeId, data) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n));
  };

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

  // Update all nodes when dark mode changes
  useEffect(() => {
    console.log('Flow dark mode state:', actualDarkMode);
    setNodes((nds) => 
      nds.map(node => ({
        ...node,
        data: { 
          ...node.data,
          workflowDarkMode: actualDarkMode
        },
        className: `resizable ${node.type}`
      }))
    );
  }, [actualDarkMode, setNodes]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}
      className={animationActiveEdges.size > 0 ? 'workflow-active-edges' : ''}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.2, // Adjust opacity as needed
        }}
        onError={(e) => {
          console.error("Video loading error:", e);
        }}
      >
        <source src="https://wxwbxupdisbofesaygqj.supabase.co/storage/v1/object/sign/publicvideos/workflow-background.mp4..mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGU0Y2FiMy0zZTc4LTRkOWMtYjA4ZS00NTVjNDFkZjZiMjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWN2aWRlb3Mvd29ya2Zsb3ctYmFja2dyb3VuZC5tcDQuLm1wNCIsImlhdCI6MTc0ODg4MzE0NiwiZXhwIjoxNzgwNDE5MTQ2fQ.bMS3YBMRBfkcqgjuQUXZ9c6GG4O2F59RlgMw-a_lEsg" type="video/mp4" />
        Background video could not be loaded. Please ensure your browser supports HTML5 video.
      </video>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onInit={handleInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className={`${actualDarkMode ? 'workflow-dark-mode-flow' : ''}`}
        style={actualDarkMode ? { 
          background: `linear-gradient(135deg, ${DARK_SECONDARY} 0%, ${DARK_BG} 50%, #0a0a18 100%)`, 
          color: DARK_TEXT, 
          border: `3px solid rgba(165, 149, 255, 0.3)`,
          boxShadow: 'inset 0 0 40px rgba(86, 28, 198, 0.15)',
          fontFamily: "'Roboto', sans-serif",
          backgroundSize: '400% 400%',
          animation: 'gradientFlow 15s ease infinite',
          position: 'relative',
          zIndex: 1 // Ensure it's above the video
        } : {
          fontFamily: "'Roboto', sans-serif",
          position: 'relative',
          zIndex: 1 // Ensure it's above the video
        }}
        defaultEdgeOptions={{
          type: 'animated',
          animated: true,
          style: { 
            strokeWidth: actualDarkMode ? 2 : 1.5,
            stroke: actualDarkMode ? 'rgba(165, 149, 255, 0.6)' : '#3b82f6'
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: actualDarkMode ? 'rgba(165, 149, 255, 0.8)' : '#3b82f6',
            width: 15,
            height: 15
          },
          data: {
            isActive: false
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
          color={actualDarkMode ? "#ffffff" : "#999"} 
          gap={20}
          size={actualDarkMode ? 0.8 : 1}
          variant={BackgroundVariant.Dots}
          style={{
            opacity: actualDarkMode ? 0.05 : 0.15,
            backgroundImage: actualDarkMode ? 
              'radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px)' : 
              'radial-gradient(circle, rgba(0, 0, 0, 0.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
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
        
        {/* Add a panel with animation controls for demo purposes */}
        <Panel position="top-right">
          <button 
            onClick={animationDeactivateAllEdges}
            className="px-2 py-1 rounded bg-gray-200 text-xs mr-2"
          >
            Reset Animations
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

      {/* Add the animation example component */}
      {nodes.length > 0 && (
        <WorkflowAnimationExample
          nodes={nodes}
          edges={edges}
          setEdges={(newEdges) => {
            if (externalSetEdges) {
              externalSetEdges(newEdges);
            } else {
              setEdges(newEdges);
            }
          }}
        />
      )}
    </div>
  );
}

// Export the Flow with ReactFlowProvider to fix the zustand error
export default function Flow(props: FlowProps) {
  return (
    <ReactFlowProvider>
      <FlowContent {...props} />
    </ReactFlowProvider>
  );
}

// Helper function to get node description
const getNodeDescription = (nodeType: string): string => {
  switch (nodeType) {
    case 'customerNode': return 'Customer data';
    case 'jobNode': return 'Job details';
    case 'taskNode': return 'Task assignment';
    case 'quoteNode': return 'Quote details';
    case 'visionNode': return 'Vision analysis';
    case 'messagingNode': return 'SMS notifications';
    case 'emailNode': return 'Email messages';
    case 'whatsappNode': return 'WhatsApp messages';
    case 'socialNode': return 'Social media';
    case 'automationNode': return 'Automated workflow';
    case 'calendarNode': return 'Calendar events';
    default: return 'Custom component';
  }
};
