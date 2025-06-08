import React, { useCallback, useState, useEffect, useRef, CSSProperties, useMemo } from 'react';
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
  socialNode: MessagingNode,
  automation: AutomationNode // Added to ensure proper mapping for 'automation' type
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
  console.log('DEBUG: FlowContent component rendering', { 
    hasNodes: externalNodes && externalNodes.length > 0,
    hasEdges: externalEdges && externalEdges.length > 0,
    nodes: externalNodes,
    edges: externalEdges
  });
  // Always use dark mode
  const actualDarkMode = true;
  
  // Use external state if provided, otherwise use internal state
  const [internalNodes, setInternalNodes, onNodesChange] = useNodesState(externalNodes || defaultNodes);
  const [internalEdges, setInternalEdges, onEdgesChange] = useEdgesState(externalEdges || defaultEdges);
  
  const nodes = externalNodes || internalNodes;
  const edges = externalEdges || internalEdges;

  // Update internal state when external state changes
  useEffect(() => {
    if (externalNodes) {
      setInternalNodes(externalNodes);
    }
  }, [externalNodes, setInternalNodes]);

  useEffect(() => {
    if (externalEdges) {
      setInternalEdges(externalEdges);
    }
  }, [externalEdges, setInternalEdges]);

  // Add debug logging for dimensions
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      console.log('DEBUG: Flow canvas dimensions:', { width, height });
    }
  }, []);
  
  // Debug when nodes change
  useEffect(() => {
    console.log('DEBUG: Flow nodes changed:', nodes);
  }, [nodes]);

  // Debug when edges change
  useEffect(() => {
    console.log('DEBUG: Flow edges changed:', edges);
  }, [edges]);

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
    console.log('DEBUG: Flow instance initialized', flowInstance);
    setInstance(flowInstance);
    onInit(flowInstance);
    
    // Initial fit view after a small delay to ensure nodes are loaded
    setTimeout(() => {
      if (flowInstance) {
        console.log('DEBUG: Performing initial fit view');
        flowInstance.fitView({ padding: 0.2 });
        
        // Debug - get current viewport state
        const viewport = flowInstance.getViewport();
        console.log('DEBUG: Initial viewport state:', viewport);
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

  const onConnect = useCallback((params) => {
    console.log('DEBUG: Creating new edge connection:', params);
    
    setEdges((eds) => 
      addEdge({
        ...params,
        type: 'animated',
        animated: true, 
        data: { 
          isActive: false 
        }
      }, eds)
    );
  }, [setEdges]);

  // Create stable node objects to prevent unnecessary re-renders
  const createStableNode = useCallback((type, position, data) => {
    // Create a unique ID with timestamp to avoid conflicts
    const uniqueId = `${type}-${Date.now()}`;
    
    // Create a stable node object
    return {
      id: uniqueId,
      type,
      position,
      data: { 
        ...data,
        label: data.label || type.replace('Node', ''),
        workflowDarkMode: actualDarkMode,
        icon: data.icon || nodeTypeIcons[type],
        iconComponent: data.iconComponent || nodeTypeIcons[type],
        description: data.description || getNodeDescription(type)
      },
      // Apply fixed classes only
      className: `resizable ${type}`,
      // Disable all drag animations in React Flow
      draggable: true,
      selectable: true,
      // Add custom styling to prevent style changes
      style: {
        transition: 'none',
        animationDuration: '0ms',
        transform: 'translate3d(0,0,0)'
      }
    };
  }, [actualDarkMode]);

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
      
      const newNode = createStableNode(type, position, { 
        label: type.replace('Node', ''),
        description: getNodeDescription(type)
      });

      setNodes((nds) => nds.concat(newNode));
    },
    [instance, createStableNode, setNodes]
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

  // Handle node click with activation - completely rewritten
  const onNodeClick = (event, node) => {
    console.log('DEBUG: Node clicked:', node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
    
    // Store selected node in state
    setSelectedNode(node);
    
    // Force stable class updates - never modify node data during selection
    // This prevents any re-rendering of the actual node component
    setNodes(nds => 
      nds.map(n => {
        // If this is the node that was clicked
        if (n.id === node.id) {
          return {
            ...n,
            // ONLY update the className - nothing else
            className: `resizable ${n.type} active-node`,
            // Add a style override with !important-like priority
            style: {
              ...n.style,
              zIndex: 10,
              boxShadow: '0 0 0 2px #fff, 0 0 0 4px rgba(191, 161, 74, 0.8)'
            }
          };
        } 
        // For all other nodes, ensure they don't have the active class
        else if (n.className && n.className.includes('active-node')) {
          return {
            ...n,
            className: `resizable ${n.type}`,
            // Reset any style overrides
            style: {
              ...n.style,
              zIndex: undefined,
              boxShadow: undefined
            }
          };
        }
        // Return unchanged for all other nodes
        return n;
      })
    );
    
    // Handle edge animations separately from node styling
    animationDeactivateAllEdges();
    
    // Use a delay to prevent animation conflicts
    setTimeout(() => {
      animationActivateNodeOutgoingEdges(node.id);
    }, 100);
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

  // Complete replacement for the dark mode effect - preserve all node data and state
  useEffect(() => {
    console.log('Flow dark mode state:', actualDarkMode);
    
    // Do nothing - we don't need to update dark mode on existing nodes
    // This prevents unnecessary re-renders
    
  }, [actualDarkMode]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%'
      }}
      className={animationActiveEdges.size > 0 ? 'workflow-active-edges' : ''}
    >
      {/* Animated Background */}
      <div className="workflow-background">
        {/* Smoke effect */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`smoke-${i}`} 
            className="smoke"
            style={{
              width: `${Math.random() * 200 + 150}px`,
              height: `${Math.random() * 200 + 150}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `smoke ${Math.random() * 15 + 20}s ease-out infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
        
        {/* Animated particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              width: `${Math.random() * 10 + 5}px`, // Larger particles
              height: `${Math.random() * 10 + 5}px`, // Larger particles
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatParticle ${Math.random() * 15 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

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
        fitViewOptions={{ padding: 0.2, duration: 0 }}
        className={`${actualDarkMode ? 'workflow-dark-mode-flow' : ''} workflow-no-animations`}
        style={actualDarkMode ? { 
          color: DARK_TEXT, 
          fontFamily: "'Roboto', sans-serif",
          position: 'relative',
          zIndex: 1 // Ensure it's above the video
        } : {
          fontFamily: "'Roboto', sans-serif",
          position: 'relative',
          zIndex: 1 // Ensure it's above the video
        }}
        defaultEdgeOptions={{
          type: 'animated',
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
        zoomOnDoubleClick={false}
        panOnDrag={true}
        snapToGrid={true}
        snapGrid={[10, 10]}
        nodeExtent={[[-1000, -1000], [2000, 2000]]}
        minZoom={0.1}
        maxZoom={2}
        translateExtent={[[-2000, -2000], [2000, 2000]]}
        preventScrolling={true}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        // Disable all animations and transitions
        connectOnClick={false}
        disableKeyboardA11y={true}
        autoPanOnConnect={false}
        autoPanOnNodeDrag={false}
      >
        <Background 
          color={actualDarkMode ? "#ffffff" : "#999"} 
          gap={20}
          size={actualDarkMode ? 0.8 : 1}
          variant={BackgroundVariant.Dots}
          style={{
            opacity: actualDarkMode ? 0.05 : 0.15,
            backgroundImage: 'none',
          }}
        />
      </ReactFlow>

      {/* MiniMap visually below the sidebar, but inside ReactFlow context */}
      <div style={{ position: 'absolute', left: 0, bottom: 16, zIndex: 1001, width: '16rem', pointerEvents: 'auto' }}>
        <MiniMap
          className="w-full h-32"
          style={{
            background: actualDarkMode ? DARK_BG : '#fff',
            borderColor: actualDarkMode ? DARK_GOLD : '#ccc',
            borderWidth: '2px',
            borderStyle: 'solid',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            margin: '0 auto',
            display: 'block',
          }}
          nodeColor={actualDarkMode ? DARK_GOLD : undefined}
          maskColor={actualDarkMode ? 'rgba(24, 20, 12, 0.6)' : undefined}
        />
      </div>

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
