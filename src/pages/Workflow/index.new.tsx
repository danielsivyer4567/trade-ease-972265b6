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
  Plus,
  Construction,
  Building
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
import TemplateSelector from '@/components/workflow/TemplateSelector';

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

  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

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

  const [activeTab, setActiveTab] = useState('builder');

  const handleTriggerSelect = (triggerId: string) => {
    // Handle trigger selection
    console.log('Selected trigger:', triggerId);
    setIsTemplateSelectorOpen(false);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Top Navigation Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex flex-col w-full">
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
              </div>
            </div>
            {/* Tabs and Template Buttons */}
            <div className="border-b px-4">
              <div className="flex items-center justify-between">
                <div className="flex -mb-px">
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${
                      activeTab === 'builder'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('builder')}
                  >
                    Builder
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${
                      activeTab === 'settings'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${
                      activeTab === 'enrollment'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('enrollment')}
                  >
                    Enrollment History
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium border-b-2 ${
                      activeTab === 'execution'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab('execution')}
                  >
                    Execution Logs
                  </button>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/workflow/templates', { state: { category: 'construction' } });
                    }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Construction className="h-4 w-4" />
                    Construction Templates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/workflow/templates', { state: { category: 'admin' } });
                    }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Building className="h-4 w-4" />
                    Admin Templates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {activeTab === 'builder' && (
            <>
              <NodeSidebar 
                targetData={null}
              />
              <Flow 
                onInit={setFlowInstance}
                workflowId={workflowId || undefined}
              />
            </>
          )}
          {activeTab === 'settings' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Workflow Settings</h2>
              {/* Add settings content here */}
            </div>
          )}
          {activeTab === 'enrollment' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Enrollment History</h2>
              {/* Add enrollment history content here */}
            </div>
          )}
          {activeTab === 'execution' && (
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Execution Logs</h2>
              {/* Add execution logs content here */}
            </div>
          )}
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

        {/* Template Selector Modal */}
        <TemplateSelector
          isOpen={isTemplateSelectorOpen}
          onClose={() => setIsTemplateSelectorOpen(false)}
          onSelectTrigger={handleTriggerSelect}
        />
      </div>
    </AppLayout>
  );
}
