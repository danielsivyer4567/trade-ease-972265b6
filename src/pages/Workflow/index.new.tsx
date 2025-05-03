import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Sun,
  Moon,
  Sparkles,
  LayoutTemplate
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
import { WorkflowSettings } from '@/components/workflow/WorkflowSettings';
import { toast } from 'sonner';
import { WorkflowEnrollmentHistory } from '@/components/workflow/WorkflowEnrollmentHistory';
import WorkflowExecutionLogs from './WorkflowExecutionLogs';

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

const DARK_GOLD = '#bfa14a';
const DARK_BG = '#18140c';
const DARK_TEXT = '#ffe082';

export default function WorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const tab = searchParams.get('tab');
  const { user } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState(null);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tab || 'builder');
  const [workflowDarkMode, setWorkflowDarkMode] = useState(false);
  
  // Drawer states
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [loadDrawerOpen, setLoadDrawerOpen] = useState(false);
  const [saveDrawerOpen, setSaveDrawerOpen] = useState(false);
  const [isTriggerSelectorOpen, setIsTriggerSelectorOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [aiMessages, setAIMessages] = useState([]);

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
                toast.error('Failed to parse workflow data');
              }
            }
          }
        } catch (error) {
          console.error('Failed to load workflow:', error);
          toast.error('Failed to load workflow');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadWorkflow();
  }, [workflowId, flowInstance]);

  // Update active tab when URL changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Update URL when active tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(location.search);
    params.set('tab', newTab);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSave = async (name: string, description: string) => {
    setIsLoading(true);
    try {
      if (!flowInstance) {
        throw new Error('Flow instance not initialized');
      }

      const workflowData = {
        nodes: flowInstance.getNodes(),
        edges: flowInstance.getEdges()
      };

      const { success } = await WorkflowService.saveWorkflow({
        id: workflowId,
        name,
        description,
        data: workflowData
      });

      if (success) {
        setWorkflowName(name);
        setSaveDrawerOpen(false);
        toast.success('Workflow saved successfully');
      } else {
        throw new Error('Failed to save workflow');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerSelect = (triggerId: string) => {
    if (!flowInstance) return;

    const triggerNode = {
      id: `trigger-${Date.now()}`,
      type: 'triggerNode',
      position: { x: 100, y: 100 },
      data: { 
        label: `Trigger: ${triggerId}`,
        triggerId
      }
    };

    flowInstance.setNodes(prev => [...prev, triggerNode]);
    setIsTriggerSelectorOpen(false);
    toast.success('Trigger added successfully');
  };

  const handleTemplateSelect = (template: Template) => {
    if (!flowInstance) return;

    try {
      flowInstance.setNodes([]);
      flowInstance.setEdges([]);

      if (template.data) {
        flowInstance.setNodes(template.data.nodes);
        flowInstance.setEdges(template.data.edges);
      }

      setWorkflowName(template.name);
      setIsTemplateSelectorOpen(false);
      toast.success('Template loaded successfully');
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    }
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleEditWorkflow = (nodeId: string, changes: any) => {
    if (!flowInstance) return;

    flowInstance.setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...changes
            }
          };
        }
        return node;
      })
    );

    toast.success('Node updated successfully');
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!flowInstance) return;

    flowInstance.setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    flowInstance.setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    toast.success('Node deleted successfully');
  };

  const getAvailableNodes = () => {
    if (!flowInstance) return [];
    return flowInstance.getNodes().map((node) => ({
      id: node.id,
      type: node.type || 'custom',
      label: node.data.label
    }));
  };

  const toggleDarkMode = useCallback(() => {
    setWorkflowDarkMode(prev => !prev);
    toast.success(`Dark Mode ${!workflowDarkMode ? 'Enabled' : 'Disabled'}`, {
      duration: 3000,
      position: 'top-center',
      style: {
        backgroundColor: !workflowDarkMode ? DARK_BG : '#ffffff',
        color: !workflowDarkMode ? DARK_GOLD : '#333333',
        border: `2px solid ${!workflowDarkMode ? DARK_GOLD : '#dddddd'}`,
      },
    });
  }, [workflowDarkMode]);

  const handleGenerateWorkflow = async (prompt: string) => {
    try {
      const userMessage = { role: 'user', content: prompt };
      setAIMessages(prev => [...prev, userMessage]);

      const thinkingMessage = {
        role: 'assistant',
        content: 'Analyzing your requirements and generating a workflow...'
      };
      setAIMessages(prev => [...prev, thinkingMessage]);

      // Generate workflow based on prompt
      const workflowData = await generateWorkflowFromPrompt(prompt);
      
      if (!flowInstance) {
        throw new Error('Flow instance not initialized');
      }

      // Clear existing nodes and edges
      flowInstance.setNodes([]);
      flowInstance.setEdges([]);

      // Add generated nodes and edges
      flowInstance.setNodes(workflowData.nodes);
      flowInstance.setEdges(workflowData.edges);

      // Update workflow name
      setWorkflowName(workflowData.name);

      // Add success message
      const successMessage = {
        role: 'assistant',
        content: `I've generated a workflow for "${workflowData.name}". The workflow has been added to your canvas. You can now customize it further or save it.`
      };
      setAIMessages(prev => [...prev, successMessage]);

      // Close the modal after a short delay
      setTimeout(() => {
        setIsAIModalOpen(false);
      }, 2000);

    } catch (error) {
      console.error('Error generating workflow:', error);
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while generating the workflow. Please try again with a more specific prompt or try a different approach.'
      };
      setAIMessages(prev => [...prev, errorMessage]);
    }
  };

  // Helper function to generate workflow from prompt
  const generateWorkflowFromPrompt = async (prompt: string) => {
    // This is where you would integrate with an actual AI service
    // For now, we'll use a simple template-based approach
    
    // Extract key information from the prompt
    const promptLower = prompt.toLowerCase();
    
    // Determine workflow type based on keywords
    let workflowType = 'general';
    if (promptLower.includes('customer') || promptLower.includes('onboard')) {
      workflowType = 'customer-onboarding';
    } else if (promptLower.includes('job') || promptLower.includes('project')) {
      workflowType = 'job-management';
    } else if (promptLower.includes('quote') || promptLower.includes('estimate')) {
      workflowType = 'quote-process';
    }

    // Generate appropriate workflow structure
    const workflow = {
      name: `Generated Workflow - ${new Date().toLocaleDateString()}`,
      nodes: [],
      edges: []
    };

    // Add nodes based on workflow type
    switch (workflowType) {
      case 'customer-onboarding':
        workflow.nodes = [
          {
            id: 'create-customer',
            type: 'customerNode',
            position: { x: 100, y: 100 },
            data: { label: 'Create Customer' }
          },
          {
            id: 'send-welcome',
            type: 'emailNode',
            position: { x: 300, y: 100 },
            data: { label: 'Send Welcome Email' }
          },
          {
            id: 'schedule-followup',
            type: 'taskNode',
            position: { x: 500, y: 100 },
            data: { label: 'Schedule Follow-up' }
          }
        ];
        workflow.edges = [
          { id: 'e1', source: 'create-customer', target: 'send-welcome' },
          { id: 'e2', source: 'send-welcome', target: 'schedule-followup' }
        ];
        break;

      case 'job-management':
        workflow.nodes = [
          {
            id: 'create-job',
            type: 'jobNode',
            position: { x: 100, y: 100 },
            data: { label: 'Create Job' }
          },
          {
            id: 'assign-team',
            type: 'taskNode',
            position: { x: 300, y: 100 },
            data: { label: 'Assign Team' }
          },
          {
            id: 'notify-customer',
            type: 'emailNode',
            position: { x: 500, y: 100 },
            data: { label: 'Notify Customer' }
          }
        ];
        workflow.edges = [
          { id: 'e1', source: 'create-job', target: 'assign-team' },
          { id: 'e2', source: 'assign-team', target: 'notify-customer' }
        ];
        break;

      case 'quote-process':
        workflow.nodes = [
          {
            id: 'create-quote',
            type: 'quoteNode',
            position: { x: 100, y: 100 },
            data: { label: 'Create Quote' }
          },
          {
            id: 'send-quote',
            type: 'emailNode',
            position: { x: 300, y: 100 },
            data: { label: 'Send Quote' }
          },
          {
            id: 'follow-up',
            type: 'taskNode',
            position: { x: 500, y: 100 },
            data: { label: 'Follow Up' }
          }
        ];
        workflow.edges = [
          { id: 'e1', source: 'create-quote', target: 'send-quote' },
          { id: 'e2', source: 'send-quote', target: 'follow-up' }
        ];
        break;

      default:
        // Generic workflow
        workflow.nodes = [
          {
            id: 'start',
            type: 'customNode',
            position: { x: 100, y: 100 },
            data: { label: 'Start' }
          },
          {
            id: 'process',
            type: 'customNode',
            position: { x: 300, y: 100 },
            data: { label: 'Process' }
          },
          {
            id: 'complete',
            type: 'customNode',
            position: { x: 500, y: 100 },
            data: { label: 'Complete' }
          }
        ];
        workflow.edges = [
          { id: 'e1', source: 'start', target: 'process' },
          { id: 'e2', source: 'process', target: 'complete' }
        ];
    }

    return workflow;
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleEditWorkflow = (nodeId: string, changes: any) => {
    if (!flowInstance) return;

    // Update the node in the flow
    flowInstance.setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...changes
            }
          };
        }
        return node;
      })
    );

    // Show success message
    toast.success('Node updated successfully');
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!flowInstance) return;

    // Remove the node and its connected edges
    flowInstance.setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    flowInstance.setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    // Show success message
    toast.success('Node deleted successfully');
  };

  // Get available nodes for tagging
  const getAvailableNodes = () => {
    if (!flowInstance) return [];
    return flowInstance.getNodes().map((node) => ({
      id: node.id,
      type: node.type || 'custom',
      label: node.data.label
    }));
  };

  const toggleDarkMode = useCallback(() => {
    console.log("Toggle dark mode clicked, current state:", workflowDarkMode);
    setWorkflowDarkMode(prev => !prev);
    
    // Show a very visible notification
    toast.success(`Dark Mode ${!workflowDarkMode ? 'Enabled' : 'Disabled'}`, {
      duration: 3000,
      position: 'top-center',
      style: {
        backgroundColor: !workflowDarkMode ? DARK_BG : '#ffffff',
        color: !workflowDarkMode ? DARK_GOLD : '#333333',
        border: `2px solid ${!workflowDarkMode ? DARK_GOLD : '#dddddd'}`,
      },
    });
  }, [workflowDarkMode]);

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Top Navigation Bar */}
        <div className="border border-black bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 mr-2 border-2"
                  style={{
                    backgroundColor: workflowDarkMode ? DARK_GOLD : 'white',
                    color: workflowDarkMode ? '#000000' : '#333333',
                    borderColor: workflowDarkMode ? DARK_GOLD : '#ccc',
                  }}
                >
                  {workflowDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {workflowDarkMode ? 'Light Mode' : 'Dark Mode'}
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
                <div className="inline-flex -mb-px space-x-1 p-1 bg-gray-50 rounded-lg border-2 border-gray-200/50 shadow-sm mt-2">
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'builder'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTabChange('builder')}
                  >
                    Builder
                  </button>
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'settings'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTabChange('settings')}
                  >
                    Settings
                  </button>
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'enrollment'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTabChange('enrollment')}
                  >
                    Enrollment History
                  </button>
                  <button
                    className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                      activeTab === 'execution'
                        ? 'border-2 border-primary bg-white text-gray-900 shadow-sm'
                        : 'border-2 border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => handleTabChange('execution')}
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
                workflowDarkMode={workflowDarkMode}
              />
              <div className="flex-1">
                <Flow 
                  onInit={setFlowInstance}
                  workflowId={workflowId || undefined}
                  onNodeSelect={handleNodeSelect}
                  workflowDarkMode={workflowDarkMode}
                />
              </div>
            </>
          )}
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-auto">
              <WorkflowSettings 
                onSettingsChange={(settings) => {
                  console.log('Settings updated:', settings);
                  // TODO: Implement settings update logic
                }} 
              />
            </div>
          )}
          {activeTab === 'enrollment' && (
            <div className="flex-1 overflow-auto">
              <WorkflowEnrollmentHistory />
            </div>
          )}
          {activeTab === 'execution' && (
            <div className="flex-1 overflow-auto">
              <WorkflowExecutionLogs />
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
          onEditWorkflow={handleEditWorkflow}
          onDeleteNode={handleDeleteNode}
          messages={aiMessages}
          onUpdateMessages={setAIMessages}
          availableNodes={getAvailableNodes()}
          userId={user?.id || ''}
          userRole={user?.role || 'user'}
        />

        {/* Dark mode toggle - VISIBLE VERSION */}
        <div className="fixed top-20 right-4 z-[99999]" style={{ pointerEvents: 'all' }}>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-3 rounded-full shadow-2xl focus:outline-none transform hover:scale-105 transition-all duration-200"
            style={{
              backgroundColor: workflowDarkMode ? DARK_GOLD : '#ffffff',
              color: workflowDarkMode ? '#000000' : '#333333',
              border: `3px solid ${workflowDarkMode ? DARK_GOLD : '#dddddd'}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              width: '48px',
              height: '48px'
            }}
          >
            {workflowDarkMode ? (
              <Sun size={24} />
            ) : (
              <Moon size={24} />
            )}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
