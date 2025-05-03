import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (location.state) {
      if (location.state.addAutomation && location.state.automationId) {
        // Add automation to existing workflow
        if (flowInstance) {
          const position = { x: 100, y: 100 }; // Default position
          flowInstance.addNode({
            id: `automation-${location.state.automationId}`,
            type: 'automation',
            position,
            data: {
              automationId: location.state.automationId,
              title: location.state.automationTitle || `Automation ${location.state.automationId}`,
              description: location.state.automationDescription || '',
              label: location.state.automationTitle || `Automation ${location.state.automationId}`
            }
          });
          toast.success(`Added automation: ${location.state.automationTitle || `Automation ${location.state.automationId}`}`);
        }
      } else {
        setIsCreatingAutomation(location.state.createAutomation || false);
        setAutomationCategory(location.state.category || '');
      }
    }
  }, [location.state, flowInstance]);

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
        onClose={() => setIsSaveDialogOpen(false)}
      />

      {/* Load dialog */}
      <WorkflowLoadDialog
        open={isLoadDialogOpen}
        onClose={() => setIsLoadDialogOpen(false)}
      />
    </div>
  );
}