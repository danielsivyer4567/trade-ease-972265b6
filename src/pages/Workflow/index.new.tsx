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

  // Drawer states
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [loadDrawerOpen, setLoadDrawerOpen] = useState(false);
  const [saveDrawerOpen, setSaveDrawerOpen] = useState(false);

  // Node categories for the sidebar
  const workflowNodes = [
    { id: 'customer', label: 'Customer', description: 'Contact info & history' },
    { id: 'job', label: 'Job', description: 'Schedule & assignments' },
    { id: 'quote', label: 'Quote', description: 'Terms & approvals' },
    { id: 'task', label: 'Task', description: 'To-dos & assignments' },
    { id: 'vision', label: 'Vision Analysis', description: 'Extract/process data' },
    { id: 'custom', label: 'Custom', description: 'Blank node' },
  ];

  const messagingNodes = [
    { id: 'sms', label: 'SMS', description: 'Text notifications' },
    { id: 'email', label: 'Email', description: 'Email notifications' },
    { id: 'whatsapp', label: 'WhatsApp', description: 'WhatsApp messages' },
    { id: 'social', label: 'Social Media', description: 'Social media integrations' },
    { id: 'social-post', label: 'Social Post', description: 'Facebook & Instagram' },
  ];

  const handleLoadTemplate = () => {
    navigate('/workflow/templates');
  };

  const handleSave = () => {
    // Implement the save logic
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-700 bg-slate-300 overflow-y-auto">
        <div className="p-4 pt-20">
          {currentView === 'builder' && (
            <>
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Workflow Nodes</h2>
              <div className="space-y-4">
                {workflowNodes.map(node => (
                  <div
                    key={node.id}
                    className="p-3 border border-gray-600 rounded-lg cursor-pointer hover:bg-slate-400 text-slate-900"
                    draggable
                  >
                    <h3 className="font-medium">{node.label}</h3>
                    <p className="text-sm text-slate-700">{node.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {currentView === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Workflow Settings</h2>
              {/* Add settings options here */}
            </div>
          )}
          {currentView === 'enrollment' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Enrollment Rules</h2>
              {/* Add enrollment options here */}
            </div>
          )}
          {currentView === 'logs' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Execution History</h2>
              {/* Add logs display here */}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-700 bg-slate-300 flex items-center justify-between px-4 fixed top-0 right-0 left-64 z-10">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold ml-2">
              {workflowId ? 'Edit Workflow' : 'New Workflow'}
            </h1>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Button
              variant="ghost"
              className={`${currentView === 'builder' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-700 hover:text-slate-900'}`}
              onClick={() => handleTabClick('builder')}
              title="Design and build your workflow"
            >
              Builder
            </Button>
            <Button
              variant="ghost"
              className={`${currentView === 'settings' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-700 hover:text-slate-900'}`}
              onClick={() => handleTabClick('settings')}
              title="Configure workflow settings and permissions"
            >
              Settings
            </Button>
            <Button
              variant="ghost"
              className={`${currentView === 'enrollment' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-700 hover:text-slate-900'}`}
              onClick={() => handleTabClick('enrollment')}
              title="Manage enrollment rules and triggers"
            >
              Enrollment History
            </Button>
            <Button
              variant="ghost"
              className={`${currentView === 'logs' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'text-slate-700 hover:text-slate-900'}`}
              onClick={() => handleTabClick('logs')}
              title="View execution history and debug logs"
            >
              Execution Logs
            </Button>
          </div>
          
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
              className="text-slate-900 border-gray-600 hover:bg-slate-400"
              onClick={handleLoadTemplate}
            >
              <FileBox className="h-4 w-4 mr-2" />
              Load Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-900 border-gray-600 hover:bg-slate-400"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-50 pt-16">
          {currentView === 'builder' && (
            <Flow
              instance={flowInstance}
              setInstance={setFlowInstance}
            />
          )}
          {currentView === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Workflow Settings</h2>
              {/* Add workflow settings form */}
            </div>
          )}
          {currentView === 'enrollment' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Enrollment History</h2>
              {/* Add enrollment history table */}
            </div>
          )}
          {currentView === 'logs' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Execution Logs</h2>
              {/* Add execution logs table */}
            </div>
          )}
        </div>
      </div>

      {/* Drawers */}
      <WorkflowDrawer
        title="Manage Automations"
        isOpen={automationDrawerOpen}
        onClose={() => setAutomationDrawerOpen(false)}
      >
        <AutomationSelector
          onSelectAutomation={(automationNode) => {
            // Handle automation selection
            setFlowInstance(prev => ({
              ...prev,
              nodes: [...(prev?.nodes || []), automationNode]
            }));
          }}
          open={automationDrawerOpen}
          onOpenChange={setAutomationDrawerOpen}
        />
      </WorkflowDrawer>

      <WorkflowDrawer
        title="Load Workflow"
        isOpen={loadDrawerOpen}
        onClose={() => setLoadDrawerOpen(false)}
      >
        <WorkflowLoadDialog
          open={loadDrawerOpen}
          onOpenChange={setLoadDrawerOpen}
          onLoad={setFlowInstance}
        />
      </WorkflowDrawer>

      <WorkflowDrawer
        title="Save Workflow"
        isOpen={saveDrawerOpen}
        onClose={() => setSaveDrawerOpen(false)}
      >
        <WorkflowSaveDialog
          open={saveDrawerOpen}
          onOpenChange={setSaveDrawerOpen}
          flowInstance={flowInstance}
        />
      </WorkflowDrawer>
    </div>
  );
} 