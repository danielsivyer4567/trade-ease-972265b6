import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppLayout } from "@/components/ui/AppLayout";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  const workflowId = searchParams.get('id');
  const { user } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState(null);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSave = async (name: string, description: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement save functionality
      setWorkflowName(name);
      setSaveDrawerOpen(false);
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Top Navigation Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/workflow/list')}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Workflows</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <h2 className="text-lg font-semibold flex-1">
              {workflowId ? workflowName : "New Workflow"}
            </h2>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSaveDrawerOpen(true)}
                      className="flex items-center gap-2"
                      disabled={!user}
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save workflow (Ctrl+S)</p>
                    {!user && <p className="text-xs text-muted-foreground">Login required to save</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Flow Area */}
        <div className="flex-1 flex">
          <NodeSidebar 
            targetData={null}
          />
          <Flow 
            onInit={setFlowInstance}
            workflowId={workflowId || undefined}
          />
        </div>

        {/* Drawers */}
        <WorkflowDrawer
          title="Manage Automations"
          isOpen={automationDrawerOpen}
          onClose={() => setAutomationDrawerOpen(false)}
        >
          <AutomationSelector
            onSelectAutomation={(automationNode) => {
              setFlowInstance(prev => ({
                ...prev,
                nodes: [...(prev?.nodes || []), automationNode]
              }));
              setAutomationDrawerOpen(false);
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
            onSave={handleSave}
            isLoading={isLoading}
            initialName={workflowName}
            initialDescription=""
          />
        </WorkflowDrawer>
      </div>
    </AppLayout>
  );
}
