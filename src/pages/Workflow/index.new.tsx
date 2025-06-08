import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Flow from './components/Flow';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { NodeSidebar } from './components/NodeSidebar';
import { NodeDetailsPanel } from './components/NodeDetailsPanel';
import { WorkflowDrawer } from './components/WorkflowDrawer';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowTemplateDialog } from './components/WorkflowTemplateDialog';
import { WorkflowAIAssistant } from './components/WorkflowAIAssistant';
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';
import { User, Briefcase, ClipboardList, FileText, MessageSquare, Eye, Zap, Share2, Layout } from 'lucide-react';
import { DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';
import { WorkflowTemplate } from '@/types/workflow';

// Define interfaces for workflow data
interface NodeData {
  label?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  iconComponent?: React.ReactNode;
  automationId?: string;
  [key: string]: any;
}

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  data?: {
    isActive: boolean;
    [key: string]: any;
  };
}

interface WorkflowData {
  nodes?: Node[];
  edges?: Edge[];
  [key: string]: any;
}

export default function WorkflowPage() {
  console.log('DEBUG: WorkflowPage component rendering');
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [isCreatingAutomation, setIsCreatingAutomation] = useState(false);
  const [automationCategory, setAutomationCategory] = useState('');
  const [flowInstance, setFlowInstance] = useState(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isAIAssistantCollapsed, setIsAIAssistantCollapsed] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const pendingTemplateData = useRef(null);
  const pendingWorkflowId = useRef(null);
  const pendingAutomationData = useRef(null);
  const hasProcessedLocationState = useRef(false);
  
  // Clear location state to prevent the same action from happening again on refresh
  useEffect(() => {
    if (location.state && !hasProcessedLocationState.current) {
      // Mark as processed to prevent duplicate handling
      hasProcessedLocationState.current = true;
      
      // This will clear the state but keep the current URL
      const currentPath = location.pathname;
      window.history.replaceState({}, '', currentPath);
      
      console.log('Processing location state:', location.state);
      
      // Continue with location state processing...
    }
  }, [location]);

  // Node type to icon mapping
  const nodeTypeIcons = {
    customerNode: <User className="h-5 w-5" />,
    jobNode: <Briefcase className="h-5 w-5" />,
    taskNode: <ClipboardList className="h-5 w-5" />,
    quoteNode: <FileText className="h-5 w-5" />,
    messagingNode: <MessageSquare className="h-5 w-5" />,
    emailNode: <MessageSquare className="h-5 w-5" />,
    whatsappNode: <MessageSquare className="h-5 w-5" />,
    visionNode: <Eye className="h-5 w-5" />,
    automationNode: <Zap className="h-5 w-5" />,
    socialNode: <Share2 className="h-5 w-5" />,
    customNode: <Layout className="h-5 w-5" />
  };

  // Ensure node data has appropriate icon based on type
  const ensureNodeIcon = (node) => {
    const nodeType = node.type;
    
    return {
      ...node,
      data: {
        ...node.data,
        icon: node.data.icon || nodeTypeIcons[nodeType],
        iconComponent: nodeTypeIcons[nodeType] // Add a direct reference to the icon component
      }
    };
  };

  // Handle incoming location state when component mounts
  useEffect(() => {
    if (location.state && !hasProcessedLocationState.current) {
      // Mark as processed immediately to prevent duplicate handling
      hasProcessedLocationState.current = true;
      console.log('Processing location state once:', location.state);
      
      if (location.state.addWorkflow && location.state.workflowId) {
        // Store workflow ID for loading after flow instance is initialized
        pendingWorkflowId.current = {
          workflowId: location.state.workflowId,
          workflowName: location.state.workflowName || 'Workflow'
        };
        
        // Fetch and apply workflow data
        loadWorkflowData(location.state.workflowId);
      } else if (location.state.addAutomation && location.state.automationId) {
        console.log('Adding automation, preserveExisting:', location.state.preserveExisting);
        
        // Store automation data for use after flow instance is initialized
        pendingAutomationData.current = {
          automationId: location.state.automationId,
          automationTitle: location.state.automationTitle,
          automationDescription: location.state.automationDescription,
          preserveExisting: location.state.preserveExisting !== false // Default to true if not specified
        };
        
        // IMPORTANT: We DO NOT clear the canvas here, even if preserveExisting is false
        // The actual node addition will happen in the flowInstance effect or directly if flowInstance is available
        
        // If flowInstance is already available, add the automation node immediately
        if (flowInstance) {
          addAutomationNode(
            location.state.automationId, 
            location.state.automationTitle, 
            location.state.automationDescription,
            location.state.preserveExisting !== false // Pass the preserveExisting flag
          );
          pendingAutomationData.current = null; // Clear to prevent duplicate processing
        }
      } else {
        setIsCreatingAutomation(location.state.createAutomation || false);
        setAutomationCategory(location.state.category || '');
      }
    }
  }, [location.state, flowInstance]);

  // Load workflow data by ID
  const loadWorkflowData = async (workflowId) => {
    try {
      const result = await WorkflowService.getWorkflow(workflowId);
      if (result.success && result.workflow) {
        const workflowData = result.workflow.data as WorkflowData;
        
        // Initialize nodes and edges
        if (workflowData && workflowData.nodes && Array.isArray(workflowData.nodes)) {
          const initializedNodes = workflowData.nodes.map(node => ensureNodeIcon({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data
          }));
          setNodes(initializedNodes);
        }
        
        if (workflowData && workflowData.edges && Array.isArray(workflowData.edges)) {
          const initializedEdges = workflowData.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'animated',
            animated: edge.animated !== false,
            data: {
              ...edge.data,
              isActive: false
            }
          }));
          setEdges(initializedEdges);
        }
      } else {
        toast.error(result.error?.message || 'Failed to load workflow data');
      }
    } catch (error) {
      console.error('Error loading workflow data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load workflow data');
    }
  };

  // Effect for handling changes to flowInstance
  useEffect(() => {
    if (flowInstance) {
      // Handle pending template data after flow instance is available
      if (pendingTemplateData.current) {
        // Simply show success message without fitView
        toast.success(`Template "${pendingTemplateData.current.templateName}" applied to workflow`);
        pendingTemplateData.current = null;
      }
      
      // Handle pending workflow data after flow instance is available
      if (pendingWorkflowId.current) {
        // Simply show success message without fitView
        toast.success(`Workflow "${pendingWorkflowId.current.workflowName}" added to canvas`);
        pendingWorkflowId.current = null;
      }
      
      // Handle pending automation node addition
      if (pendingAutomationData.current) {
        const { automationId, automationTitle, automationDescription, preserveExisting } = pendingAutomationData.current;
        console.log('Adding pending automation node from effect:', automationId, 'preserveExisting:', preserveExisting);
        addAutomationNode(automationId, automationTitle, automationDescription, preserveExisting);
        pendingAutomationData.current = null; // Clear to prevent duplicate processing
      }
    }
  }, [flowInstance]);

  // Function to add automation node
  const addAutomationNode = (automationId, automationTitle, automationDescription, preserveExisting = true) => {
    if (!flowInstance) return;
    
    console.log('Adding automation node with preserveExisting =', preserveExisting);
    
    // Calculate position - place it to the right of existing nodes if there are any
    const existingNodes = nodes;
    let xPosition = 100;
    let yPosition = 100;
    
    if (existingNodes.length > 0) {
      // Find the rightmost node
      const rightmostNode = existingNodes.reduce((rightmost, node) => {
        return (node.position.x > rightmost.position.x) ? node : rightmost;
      }, existingNodes[0]);
      
      // Position the new node to the right with some spacing
      xPosition = rightmostNode.position.x + 250;
      yPosition = rightmostNode.position.y;
    }
    
    const position = { x: xPosition, y: yPosition };
    
    // Create a unique ID with timestamp to avoid conflicts
    const uniqueId = `automation-${automationId}-${Date.now()}`;
    
    const newNode = {
      id: uniqueId,
      type: 'automationNode',
      position,
      data: {
        automationId: automationId,
        title: automationTitle || `Automation ${automationId}`,
        description: automationDescription || '',
        label: automationTitle || `Automation ${automationId}`,
        icon: nodeTypeIcons.automationNode,
        workflowDarkMode: true
      },
      // Disable animations
      style: {
        transition: 'none',
        animation: 'none'
      }
    };
    
    // Batch update nodes and edges together
    if (preserveExisting === false) {
      // Clear and add in one update
      setNodes([ensureNodeIcon(newNode)]);
      setEdges([]);
    } else {
      // Add to existing nodes
      const newNodes = [...nodes, ensureNodeIcon(newNode)];
      setNodes(newNodes);
      
      // If there are existing nodes, connect to the rightmost one
      if (existingNodes.length > 0) {
        const rightmostNode = existingNodes.reduce((rightmost, node) => {
          return (node.position.x > rightmost.position.x) ? node : rightmost;
        }, existingNodes[0]);
        
        const newEdge = {
          id: `e-${rightmostNode.id}-${uniqueId}`,
          source: rightmostNode.id,
          target: uniqueId,
          type: 'animated',
          animated: true,
          data: {
            isActive: false
          }
        };
        
        setEdges(eds => [...eds, newEdge]);
      }
    }
    
    // Remove automatic fitView to prevent zoom animations
    // Users can manually fit view if needed
    
    toast.success(`Added automation: ${automationTitle || `Automation ${automationId}`}`);
  };

  return (
    <div className="flex h-screen bg-[#0e0e20]">
      {/* Left sidebar for node types */}
      <NodeSidebar workflowDarkMode={true} nodes={nodes} edges={edges} />

      {/* Main workflow area */}
      <div className="flex-1 flex flex-col h-full bg-[#0e0e20] relative">
        {/* Top navigation */}
        <WorkflowNavigation 
          workflowDarkMode={true}
          onToggleAIAssistant={() => setShowAIAssistant(!showAIAssistant)}
          showAIAssistant={showAIAssistant}
        />

        {/* Flow canvas */}
        <div className="flex-1 h-full">
          <Flow 
            workflowId={id} 
            onNodeSelect={setSelectedNode}
            onInit={(instance) => {
              setFlowInstance(instance);
              console.log('Flow initialized:', instance);
              if (isCreatingAutomation) {
                // Initialize with automation-specific nodes based on category
                console.log('Initializing automation workflow for category:', automationCategory);
              }
            }}
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            workflowDarkMode={true}
          />
        </div>

        {/* AI Assistant */}
        {showAIAssistant && (
          <WorkflowAIAssistant 
            workflowDarkMode={true}
            isCollapsed={isAIAssistantCollapsed}
            onToggleCollapse={() => setIsAIAssistantCollapsed(!isAIAssistantCollapsed)}
            onClose={() => setShowAIAssistant(false)}
          />
        )}
      </div>

      {/* Right panel for node details */}
      {selectedNode && (
        <NodeDetailsPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={(updatedNode) => setSelectedNode(updatedNode)}
          workflowDarkMode={true}
        />
      )}

      {/* Workflow drawer */}
      <WorkflowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Workflow Details"
      >
        <div>Workflow content goes here</div>
      </WorkflowDrawer>

      {/* Save dialog */}
      <WorkflowSaveDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={async (name, description) => {
          // TODO: Implement save functionality
          console.log('Saving workflow:', { name, description });
        }}
        isLoading={false}
        initialName=""
        initialDescription=""
      />

      {/* Load dialog */}
      <WorkflowTemplateDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        onLoad={(template: WorkflowTemplate) => {
          if (template.data) {
            if (template.data.nodes) {
              setNodes(template.data.nodes.map(ensureNodeIcon));
            }
            if (template.data.edges) {
              setEdges(template.data.edges);
            }
            if (flowInstance) {
              setTimeout(() => flowInstance.fitView(), 100);
            }
          }
        }}
      />
    </div>
  );
}