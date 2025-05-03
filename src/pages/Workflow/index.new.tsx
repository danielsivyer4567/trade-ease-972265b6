import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
      if (location.state.useTemplate && location.state.templateData) {
        // Store template data for use after flow instance is initialized
        pendingTemplateData.current = {
          templateName: location.state.templateName,
          templateData: location.state.templateData
        };
        
        // Apply template data immediately to nodes and edges
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
      } else if (location.state.addWorkflow && location.state.workflowId) {
        // Store workflow ID for loading after flow instance is initialized
        pendingWorkflowId.current = {
          workflowId: location.state.workflowId,
          workflowName: location.state.workflowName || 'Workflow'
        };
        
        // Fetch and apply workflow data
        loadWorkflowData(location.state.workflowId);
      } else if (location.state.addAutomation && location.state.automationId) {
        // Handle automation data
        if (flowInstance) {
          // Add automation node
          addAutomationNode();
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
          setNodes(workflowData.nodes.map(node => ensureNodeIcon({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data
          })));
        }
        
        if (workflowData.edges && Array.isArray(workflowData.edges)) {
          setEdges(workflowData.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: 'animated',
            animated: true
          })));
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
      
      // Handle automation node addition if needed
      if (location.state?.addAutomation && location.state?.automationId) {
        addAutomationNode();
      }
    }
  }, [flowInstance]);

  // Function to add automation node
  const addAutomationNode = () => {
    if (!flowInstance || !location.state?.automationId) return;
    
    const position = { x: 100, y: 100 }; // Default position
    const newNode = {
      id: `automation-${location.state.automationId}`,
      type: 'automation',
      position,
      data: {
        automationId: location.state.automationId,
        title: location.state.automationTitle || `Automation ${location.state.automationId}`,
        description: location.state.automationDescription || '',
        label: location.state.automationTitle || `Automation ${location.state.automationId}`,
        icon: nodeTypeIcons.automationNode
      }
    };
    
    setNodes(nds => [...nds, ensureNodeIcon(newNode)]);
    toast.success(`Added automation: ${location.state.automationTitle || `Automation ${location.state.automationId}`}`);
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