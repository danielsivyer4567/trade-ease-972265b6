import React, { useState, useEffect } from 'react';
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
  Building,
  LayoutTemplate,
  Zap,
  Sparkles
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
import { WorkflowAIModal } from '@/components/workflow/WorkflowAIModal';
import { TriggerSelector } from '@/components/workflow/TriggerSelector';
import { WorkflowService } from '@/services/WorkflowService';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  data: {
    nodes: any[];
    edges: any[];
  };
}

interface WorkflowData {
  nodes: any[];
  edges: any[];
}

interface Workflow {
  id: string;
  name: string;
  data: WorkflowData;
}

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; [key: string]: any };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

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

  // Load workflow data when ID is provided
  useEffect(() => {
    const loadWorkflow = async () => {
      if (workflowId) {
        setIsLoading(true);
        try {
          const { success, workflow } = await WorkflowService.getWorkflow(workflowId);
          if (success && workflow) {
            setWorkflowName(workflow.name);
            if (flowInstance && workflow.data) {
              try {
                const workflowData = typeof workflow.data === 'string' 
                  ? JSON.parse(workflow.data) 
                  : workflow.data;
                flowInstance.setNodes(workflowData.nodes || []);
                flowInstance.setEdges(workflowData.edges || []);
              } catch (error) {
                console.error('Failed to parse workflow data:', error);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load workflow:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadWorkflow();
  }, [workflowId, flowInstance]);

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

  const [isTriggerSelectorOpen, setIsTriggerSelectorOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);

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
    console.log('Selected trigger:', triggerId);
    setIsTriggerSelectorOpen(false);
  };

  const handleTemplateSelect = (template: Template) => {
    if (!flowInstance) return;

    // Clear existing nodes and edges
    flowInstance.setNodes([]);
    flowInstance.setEdges([]);

    // Add template nodes and edges
    if (template.data) {
      flowInstance.setNodes(template.data.nodes);
      flowInstance.setEdges(template.data.edges);
    }

    // Update workflow name
    setWorkflowName(template.name);

    // Close template selector
    setIsTemplateSelectorOpen(false);
  };

  const handleGenerateWorkflow = async (prompt: string) => {
    // Here you would integrate with an AI service to generate the workflow
    console.log('Generating workflow from prompt:', prompt);
    
    // For now, we'll close the modal
    setIsAIModalOpen(false);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
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
                      onClick={() => navigate('/')}
                      className="mr-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to Main Menu</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <h2 className="text-lg font-semibold flex-1">
                {workflowId ? workflowName : "New Workflow"}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAIModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 mr-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Workflow AI
                </Button>
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
            <div className="border-b px-4 flex justify-center">
              <div className="flex items-center justify-center max-w-4xl w-full">
                <div className="inline-flex -mb-px space-x-1 p-1 bg-gray-50 rounded-lg border-2 border-gray-200/50 shadow-sm">
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'builder'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('builder')}
                  >
                    Builder
                  </button>
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'settings'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'enrollment'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('enrollment')}
                  >
                    Enrollment History
                  </button>
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'execution'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('execution')}
                  >
                    Execution Logs
                  </button>
                  <div className="flex items-center gap-2 py-1">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate('/workflow/templates')}
                      className="flex items-center gap-2"
                    >
                      <LayoutTemplate className="h-4 w-4" />
                      Templates
                    </Button>
                  </div>
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
                targetData={selectedNode ? {
                  targetType: selectedNode.type?.replace('Node', '').toLowerCase(),
                  targetId: selectedNode.id,
                } : null}
              />
              <div className="flex-1">
                <Flow 
                  onInit={setFlowInstance}
                  workflowId={workflowId || undefined}
                  onNodeSelect={handleNodeSelect}
                />
              </div>
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
          onSelectTemplate={handleTemplateSelect}
        />

        {/* Trigger Selector Modal */}
        <TriggerSelector
          isOpen={isTriggerSelectorOpen}
          onClose={() => setIsTriggerSelectorOpen(false)}
          onSelectTrigger={handleTriggerSelect}
        />

        {/* AI Modal */}
        <WorkflowAIModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onGenerateWorkflow={handleGenerateWorkflow}
        />
      </div>
    </AppLayout>
  );
}
