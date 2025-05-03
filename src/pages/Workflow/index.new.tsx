import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Flow from './components/Flow';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { NodeSidebar } from './components/NodeSidebar';
import { NodeDetailsPanel } from './components/NodeDetailsPanel';
import { WorkflowDrawer } from './components/WorkflowDrawer';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowLoadDialog } from './components/WorkflowLoadDialog';
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';
import { User, Briefcase, ClipboardList, FileText, MessageSquare, Eye, Zap, Share2, Layout } from 'lucide-react';

export default function WorkflowPage() {
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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const pendingTemplateData = useRef(null);
  const pendingWorkflowId = useRef(null);
  const pendingAutomationData = useRef(null);
  
  // Clear location state to prevent the same action from happening again on refresh
  useEffect(() => {
    if (location.state) {
      // This will clear the state but keep the current URL
      const currentPath = location.pathname;
      window.history.replaceState({}, '', currentPath);
    }
  }, []);

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
    if (location.state) {
      console.log('Processing location state:', location.state);
      
      if (location.state.useTemplate && location.state.templateData) {
        // Check if we should preserve existing content
        if (location.state.preserveExisting) {
          console.log('Preserving existing content while applying template');
          
          // Store template data for use after flow instance is initialized
          pendingTemplateData.current = {
            templateName: location.state.templateName,
            templateData: location.state.templateData,
            preserveExisting: true
          };
          
          // Apply template data by appending to existing nodes and edges
          const templateData = location.state.templateData;
          
          if (templateData.nodes && Array.isArray(templateData.nodes)) {
            // Create unique IDs for new nodes from template to avoid conflicts
            const newTemplateNodes = templateData.nodes.map(node => ensureNodeIcon({
              id: `template-${node.id}-${Date.now()}`,
              type: node.type,
              position: node.position,
              data: node.data
            }));
            
            // Append new nodes to existing ones
            setNodes(currentNodes => [...currentNodes, ...newTemplateNodes]);
          }
          
          if (templateData.edges && Array.isArray(templateData.edges)) {
            // Create unique IDs for new edges, and update source/target references
            const newTemplateEdges = templateData.edges.map(edge => ({
              id: `template-${edge.id}-${Date.now()}`,
              source: `template-${edge.source}-${Date.now()}`,
              target: `template-${edge.target}-${Date.now()}`,
              type: 'animated',
              animated: true
            }));
            
            // Append new edges to existing ones
            setEdges(currentEdges => [...currentEdges, ...newTemplateEdges]);
          }
          
        } else {
          console.log('Replacing existing content with template');
          
          // Store template data for use after flow instance is initialized
          pendingTemplateData.current = {
            templateName: location.state.templateName,
            templateData: location.state.templateData
          };
          
          // Apply template data immediately to nodes and edges (replacing existing content)
          const templateData = location.state.templateData;
          
          if (templateData.nodes && Array.isArray(templateData.nodes)) {
            setNodes(templateData.nodes.map(node => ensureNodeIcon({
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data
            })));
          }
          
          if (templateData.edges && Array.isArray(templateData.edges)) {
            setEdges(templateData.edges.map(edge => ({
              id: edge.id,
              source: edge.source,
              target: edge.target,
              type: 'animated',
              animated: true
            })));
          }
        }
      } else if (location.state.addWorkflow && location.state.workflowId) {
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
        
        // If we're not preserving existing content, clear the canvas
        if (location.state.preserveExisting === false) {
          console.log('Clearing canvas for new automation (preserveExisting is false)');
          setNodes([]);
          setEdges([]);
        } else {
          console.log('Preserving existing content for new automation');
        }

        // If flowInstance is already available, add the automation node immediately
        if (flowInstance) {
          addAutomationNode(
            location.state.automationId, 
            location.state.automationTitle, 
            location.state.automationDescription
          );
          pendingAutomationData.current = null; // Clear to prevent duplicate processing
        }
      } else {
        setIsCreatingAutomation(location.state.createAutomation || false);
        setAutomationCategory(location.state.category || '');
      }
    }
  }, [location.state]);

  // Load workflow data by ID
  const loadWorkflowData = async (workflowId) => {
    try {
      const result = await WorkflowService.getWorkflow(workflowId);
      if (result.success && result.workflow) {
        const workflowData = result.workflow.data;
        
        if (workflowData.nodes && Array.isArray(workflowData.nodes)) {
          // Create a map of existing node IDs to check for duplicates
          const existingNodeIds = new Set(nodes.map(node => node.id));
          
          // Get new nodes to add (avoid duplicates)
          const newNodes = workflowData.nodes
            .filter(node => !existingNodeIds.has(node.id))
            .map(node => ensureNodeIcon({
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data
            }));
          
          // Append new nodes to existing ones
          setNodes(currentNodes => [...currentNodes, ...newNodes]);
        }
        
        if (workflowData.edges && Array.isArray(workflowData.edges)) {
          // Create a map of existing edge IDs to check for duplicates
          const existingEdgeIds = new Set(edges.map(edge => edge.id));
          
          // Get new edges to add (avoid duplicates)
          const newEdges = workflowData.edges
            .filter(edge => !existingEdgeIds.has(edge.id))
            .map(edge => ({
              id: edge.id,
              source: edge.source,
              target: edge.target,
              type: 'animated',
              animated: true
            }));
          
          // Append new edges to existing ones
          setEdges(currentEdges => [...currentEdges, ...newEdges]);
        }
      } else {
        toast.error('Failed to load workflow data');
      }
    } catch (error) {
      console.error('Error loading workflow data:', error);
      toast.error('Failed to load workflow data');
    }
  };

  // Effect for handling changes to flowInstance
  useEffect(() => {
    if (flowInstance) {
      // Handle pending template data after flow instance is available
      if (pendingTemplateData.current) {
        // Fit view to show all nodes
        setTimeout(() => {
          flowInstance.fitView({ padding: 0.2 });
          toast.success(`Template "${pendingTemplateData.current.templateName}" applied to workflow`);
          pendingTemplateData.current = null;
        }, 100);
      }
      
      // Handle pending workflow data after flow instance is available
      if (pendingWorkflowId.current) {
        setTimeout(() => {
          flowInstance.fitView({ padding: 0.2 });
          toast.success(`Workflow "${pendingWorkflowId.current.workflowName}" added to canvas`);
          pendingWorkflowId.current = null;
        }, 100);
      }
      
      // Handle pending automation node addition
      if (pendingAutomationData.current) {
        const { automationId, automationTitle, automationDescription } = pendingAutomationData.current;
        console.log('Adding pending automation node from effect:', automationId);
        addAutomationNode(automationId, automationTitle, automationDescription);
        pendingAutomationData.current = null; // Clear to prevent duplicate processing
      }
    }
  }, [flowInstance]);

  // Function to add automation node
  const addAutomationNode = (automationId, automationTitle, automationDescription) => {
    if (!flowInstance) return;
    
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
      yPosition = rightmostNode.position.y; // Keep same Y coordinate as rightmost node
    }
    
    const position = { x: xPosition, y: yPosition };
    
    // Create a unique ID with timestamp to avoid conflicts
    const uniqueId = `automation-${automationId}-${Date.now()}`;
    
    const newNode = {
      id: uniqueId,
      type: 'automation',
      position,
      data: {
        automationId: automationId,
        title: automationTitle || `Automation ${automationId}`,
        description: automationDescription || '',
        label: automationTitle || `Automation ${automationId}`,
        icon: nodeTypeIcons.automationNode
      }
    };
    
    setNodes(nds => [...nds, ensureNodeIcon(newNode)]);
    
    // Auto-fit the view to show all nodes
    setTimeout(() => {
      if (flowInstance) {
        flowInstance.fitView({ padding: 0.2 });
      }
    }, 100);
    
    toast.success(`Added automation: ${automationTitle || `Automation ${automationId}`}`);
    
    // If there are existing nodes, try to connect to the rightmost one
    if (existingNodes.length > 0) {
      const rightmostNode = existingNodes.reduce((rightmost, node) => {
        return (node.position.x > rightmost.position.x) ? node : rightmost;
      }, existingNodes[0]);
      
      const newEdge = {
        id: `e-${rightmostNode.id}-${uniqueId}`,
        source: rightmostNode.id,
        target: uniqueId,
        type: 'animated',
        animated: true
      };
      
      setEdges(eds => [...eds, newEdge]);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left sidebar for node types */}
      <NodeSidebar />

      {/* Main workflow area */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <WorkflowNavigation />

        {/* Flow canvas */}
        <div className="flex-1">
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
          />
        </div>
      </div>

      {/* Right panel for node details */}
      {selectedNode && (
        <NodeDetailsPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={(updatedNode) => setSelectedNode(updatedNode)}
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
      <WorkflowLoadDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        onLoad={(instance) => {
          // TODO: Implement load functionality
          console.log('Loading workflow:', instance);
        }}
      />
    </div>
  );
}