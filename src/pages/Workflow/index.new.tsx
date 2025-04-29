import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Key, Check, FileText, ArrowRightLeft, Workflow, FolderOpen, Plus, FileBox } from "lucide-react";
import { NodeSidebar } from './components/NodeSidebar';
import { Flow } from './components/Flow';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowLoadDialog } from './components/WorkflowLoadDialog';
import { AutomationSelector } from './components/AutomationSelector';
import { WorkflowDrawer } from './components/WorkflowDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// This is a new version of the Workflow index.tsx file with a simpler structure
export default function WorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  const workflowId = searchParams.get('id');
  const { user } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState(null);
  const [activeTab, setActiveTab] = useState('builder');
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [loadDrawerOpen, setLoadDrawerOpen] = useState(false);
  const [saveDrawerOpen, setSaveDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the current view from the URL or default to 'builder'
  const currentView = searchParams.get('view') || 'builder';

  // Function to update URL with new view
  const updateView = (view) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('view', view);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
    setActiveTab(view);
  };

  // Handle tab navigation
  const handleTabClick = (view) => {
    if (!workflowId && view !== 'builder') {
      toast.error('Please save the workflow first to access this feature');
      return;
    }
    updateView(view);
  };

  // Check if workflow exists when accessing non-builder tabs
  useEffect(() => {
    if (!workflowId && currentView !== 'builder') {
      updateView('builder');
      toast.error('Please save the workflow first to access this feature');
    }
  }, [currentView, workflowId]);

  const handleSave = async (name: string, description: string) => {
    if (!flowInstance) {
      toast.error('No workflow to save');
      return;
    }

    setIsLoading(true);
    try {
      const flow = flowInstance.toObject();
      // Here you would typically save to your backend
      // For now, we'll save to localStorage
      const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const newWorkflow = {
        id: Date.now().toString(),
        name,
        description,
        flow,
        createdAt: new Date().toISOString(),
      };
      workflows.push(newWorkflow);
      localStorage.setItem('workflows', JSON.stringify(workflows));
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadTemplate = () => {
    navigate('/workflow/templates');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-700 bg-slate-300 overflow-y-auto">
        <div className="p-4 pt-20">
          {activeTab === 'builder' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Workflow Nodes</h2>
              <NodeSidebar />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-gray-700 bg-slate-300 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setAutomationDrawerOpen(true)}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Manage Automations
            </Button>
            <Button
              variant="outline"
              onClick={() => setLoadDrawerOpen(true)}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Load Workflow
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadTemplate}
            >
              <FileBox className="h-4 w-4 mr-2" />
              Load Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaveDrawerOpen(true)}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex-1">
          <Flow
            onInit={setFlowInstance}
            workflowId={workflowId}
          />
        </div>
      </div>

      {/* Dialogs */}
      <WorkflowSaveDialog 
        open={saveDrawerOpen}
        onOpenChange={setSaveDrawerOpen}
        onSave={handleSave}
        isLoading={isLoading}
        initialName=""
        initialDescription=""
      />
      
      <WorkflowLoadDialog 
        open={loadDrawerOpen}
        onOpenChange={setLoadDrawerOpen}
        onLoad={(id) => navigate(`/workflow?id=${id}`)}
      />

      <WorkflowDrawer
        title="Manage Automations"
        isOpen={automationDrawerOpen}
        onClose={() => setAutomationDrawerOpen(false)}
      >
        <AutomationSelector
          onSelectAutomation={(automationNode) => {
            if (flowInstance) {
              flowInstance.addNodes(automationNode);
              toast.success(`Added "${automationNode.data.label}" automation to workflow`);
            }
          }}
          open={automationDrawerOpen}
          onOpenChange={setAutomationDrawerOpen}
        />
      </WorkflowDrawer>
    </div>
  );
} 