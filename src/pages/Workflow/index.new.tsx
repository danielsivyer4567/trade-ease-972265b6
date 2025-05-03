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
          setNodes(templateData.nodes.map(node => ({
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
        label: location.state.automationTitle || `Automation ${location.state.automationId}`
      }
    };
    
    setNodes(nds => [...nds, newNode]);
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