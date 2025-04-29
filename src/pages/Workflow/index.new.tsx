import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Key, 
  Check, 
  FileText, 
  ArrowRightLeft, 
  Workflow, 
  FolderOpen, 
  Plus 
} from 'lucide-react';
import { NodeSidebar } from './components/NodeSidebar';
import { Flow } from './components/Flow';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowLoadDialog } from './components/WorkflowLoadDialog';
import { AutomationSelector } from './components/AutomationSelector';
import { WorkflowDrawer } from './components/WorkflowDrawer';
import { useAuth } from '@/contexts/AuthContext';

// This is a new version of the Workflow index.tsx file with a simpler structure
export default function WorkflowPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  const workflowId = searchParams.get('id');
  const { user } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState(null);
  
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Workflow Nodes</h2>
          <div className="space-y-4">
            {workflowNodes.map(node => (
              <div
                key={node.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                draggable
              >
                <h3 className="font-medium">{node.label}</h3>
                <p className="text-sm text-gray-500">{node.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold mt-8 mb-4">Messaging Nodes</h2>
          <div className="space-y-4">
            {messagingNodes.map(node => (
              <div
                key={node.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                draggable
              >
                <h3 className="font-medium">{node.label}</h3>
                <p className="text-sm text-gray-500">{node.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">New Workflow</h1>
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
              variant="default"
              onClick={() => setSaveDrawerOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Automation
            </Button>
          </div>
        </div>

        {/* Flow Area */}
Based on the lint error shown in the context, the `Flow` component is not accepting the `instance` and `setInstance` props as they are currently defined. Let me help fix this issue.

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
Based on the lint error shown in the context, the `AutomationSelector` component doesn't accept `open` and `onOpenChange` props. Since these props are not part of the component's interface, we should remove them. Here's the fix:

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