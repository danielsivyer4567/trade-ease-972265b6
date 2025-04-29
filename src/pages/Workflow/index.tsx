import React, { useState, useCallback, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Key, Check, FileText, ArrowRightLeft, Workflow, FolderOpen, Plus, Settings2 } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GCPVisionForm } from "@/components/messaging/dialog-sections/GCPVisionForm";
import { AutomationSelector } from './components/AutomationSelector';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowLoadDialog } from './components/WorkflowLoadDialog';
import { useAuth } from '@/contexts/AuthContext';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  const workflowId = searchParams.get('id');
  const { user, session } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState(null);
  const [gcpVisionKeyDialogOpen, setGcpVisionKeyDialogOpen] = useState(false);
  const [gcpVisionKey, setGcpVisionKey] = useState('');
  const [hasGcpVisionKey, setHasGcpVisionKey] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState('inactive');
  const [addedAutomationFromURL, setAddedAutomationFromURL] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>(workflowId || undefined);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [targetData, setTargetData] = useState<{
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null>(null);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  useEffect(() => {
    checkGcpVisionApiKey();
    
    if (location.state) {
      const { targetType, targetId, createAutomationNode } = location.state as any;
      if (targetType && targetId) {
        setTargetData({
          targetType,
          targetId,
          createAutomationNode: !!createAutomationNode
        });
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (automationId && flowInstance && !addedAutomationFromURL) {
      const addAutomationFromURL = async () => {
        try {
          const automationDetail = await getMockAutomation(parseInt(automationId, 10));
          
          if (automationDetail) {
            const event = new CustomEvent('add-automation', {
              detail: {
                automationData: {
                  label: automationDetail.title,
                  description: automationDetail.description,
                  triggers: automationDetail.triggers,
                  actions: automationDetail.actions,
                  automationId: automationDetail.id,
                  premium: automationDetail.premium
                }
              }
            });
            
            document.dispatchEvent(event);
            setAddedAutomationFromURL(true);
          }
        } catch (error) {
          console.error('Failed to add automation from URL:', error);
          toast.error('Failed to add automation from URL');
        }
      };
      
      addAutomationFromURL();
    }
  }, [automationId, flowInstance, addedAutomationFromURL]);

  async function getMockAutomation(id) {
    const mockAutomations = [
      {
        id: 1,
        title: 'New Job Alert',
        description: 'Send notifications when jobs are created',
        isActive: true,
        triggers: ['New job created'],
        actions: ['Send notification'],
        category: 'team'
      },
      {
        id: 2,
        title: 'Quote Follow-up',
        description: 'Follow up on quotes after 3 days',
        isActive: true,
        triggers: ['Quote age > 3 days'],
        actions: ['Send email'],
        category: 'sales'
      },
      {
        id: 3,
        title: 'Customer Feedback Form',
        description: 'Send feedback forms after job completion',
        isActive: true,
        triggers: ['Job marked complete'],
        actions: ['Send form to customer'],
        category: 'forms'
      },
      {
        id: 4,
        title: 'Social Media Post',
        description: 'Post job completion to social media',
        isActive: true,
        triggers: ['Job marked complete'],
        actions: ['Post to social media'],
        category: 'social',
        premium: true
      },
      {
        id: 5,
        title: 'SMS Appointment Reminder',
        description: 'Send SMS reminder 24 hours before appointment',
        isActive: true,
        triggers: ['24h before appointment'],
        actions: ['Send SMS'],
        category: 'messaging',
        premium: true
      }
    ];
    
    return mockAutomations.find(a => a.id === id) || null;
  }

  useEffect(() => {
    if (flowInstance && targetData?.createAutomationNode) {
      const loadAutomations = async () => {
        try {
          const { success, automations } = await AutomationIntegrationService.getAssociatedAutomations(
            targetData.targetType!, 
            targetData.targetId!
          );
          
          if (success && automations && automations.length > 0) {
            const automation = automations[0];
            
            const newNode = {
              id: `automation-${Date.now()}`,
              type: 'automationNode',
              position: { x: 100, y: 100 },
              data: {
                label: automation.title,
                description: automation.description,
                triggers: automation.triggers,
                actions: automation.actions,
                automationId: automation.id,
                targetType: targetData.targetType,
                targetId: targetData.targetId
              }
            };
            
            flowInstance.addNodes(newNode);
            toast.success(`Added "${automation.title}" automation to workflow`);
          } else {
            toast.info('No automations associated with this item. Please select one to add.');
          }
        } catch (error) {
          console.error('Error loading automations:', error);
        }
        
        setTargetData(prevData => ({
          ...prevData!,
          createAutomationNode: false
        }));
      };
      
      loadAutomations();
    }
  }, [flowInstance, targetData]);

  const checkGcpVisionApiKey = async () => {
    setIsLoadingKey(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoadingKey(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('gcp-vision-key', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      if (data.apiKey) {
        setGcpVisionKey(data.apiKey);
        setHasGcpVisionKey(true);
        setIntegrationStatus('ready');
      } else {
        setHasGcpVisionKey(false);
        setIntegrationStatus('inactive');
      }
    } catch (error) {
      console.error('Error checking GCP Vision API key:', error);
      setHasGcpVisionKey(false);
      setIntegrationStatus('error');
    } finally {
      setIsLoadingKey(false);
    }
  };

  const handleSave = useCallback(async (name: string, description: string) => {
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
  }, [flowInstance]);

  const handleLoadWorkflow = useCallback((id: string) => {
    setCurrentWorkflowId(id);
    navigate(`/workflow?id=${id}`, { replace: true });
  }, [navigate]);

  const handleSendToFinancials = useCallback(() => {
    if (integrationStatus !== 'ready') {
      toast.error('Please configure the GCP Vision API key first');
      return;
    }
    
    toast.info('Vision analysis will feed data to financial sections');
    
    setTimeout(() => {
      toast.success('Workflow configured to send vision data to financials');
    }, 1000);
  }, [integrationStatus]);

  const handleAddAutomation = useCallback((automationNode) => {
    if (!flowInstance) return;
    
    automationNode.id = `automation-${Date.now()}`;
    
    if (targetData?.targetType && targetData?.targetId) {
      AutomationIntegrationService.associateAutomation(
        automationNode.data.automationId,
        targetData.targetType,
        targetData.targetId
      );
      
      automationNode.data.targetType = targetData.targetType;
      automationNode.data.targetId = targetData.targetId;
    }
    
    flowInstance.addNodes(automationNode);
    
    toast.success(`Added "${automationNode.data.label}" automation to workflow`);
  }, [flowInstance, targetData]);

  const handleManageAutomations = () => {
    navigate('/automations');
  };

  const handleLoadTemplate = () => {
    navigate('/workflow/templates');
  };

  // Add keyboard shortcut handlers
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if Ctrl/Cmd key is pressed
      const ctrlPressed = e.ctrlKey || e.metaKey;
      
      if (ctrlPressed) {
        switch (e.key.toLowerCase()) {
          case 'o':
            e.preventDefault();
            setLoadDialogOpen(true);
            break;
          case 't':
            e.preventDefault();
            handleLoadTemplate();
            break;
          case 's':
            e.preventDefault();
            setSaveDialogOpen(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleLoadTemplate, setSaveDialogOpen]);

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
              {currentWorkflowId ? workflowName : "New Workflow"}
            </h2>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManageAutomations}
                      className="flex items-center gap-2"
                    >
                      <Settings2 className="h-4 w-4" />
                      Manage Automations
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure and manage automations</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLoadDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="h-4 w-4" />
                      Load Workflow
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Load existing workflow (Ctrl+O)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/workflow/templates')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Templates
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start from template (Ctrl+T)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setLoadDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Automation
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new automation to workflow</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSaveDialogOpen(true)}
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

        {/* Main Content */}
        <div className="flex-1 flex">
          <NodeSidebar targetData={targetData} />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} workflowId={currentWorkflowId} />
          </div>
        </div>

        {!isLoadingKey && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {hasGcpVisionKey && (
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Key className="h-4 w-4 text-green-500" />
                    Google Cloud Vision API Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Google Cloud Vision API key is configured and ready to use
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Financial Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ol className="text-sm space-y-1 list-decimal pl-4">
                  <li>Add a Vision Analysis node to your workflow</li>
                  <li>Connect it to a Quote or Custom node</li>
                  <li>Save your workflow to enable automated data extraction</li>
                  <li>Extracted data will appear in financial sections</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-blue-500" />
                  Automation Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <ol className="text-sm space-y-1 list-decimal pl-4">
                  <li>Click "Add Automation" to include existing automations</li>
                  <li>Connect automation nodes to jobs, quotes, or customers</li>
                  <li>Save your workflow to enable the connected automations</li>
                  <li>Manage automations from the Automations page</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        )}
        
        <WorkflowSaveDialog 
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          onSave={handleSave}
          isLoading={isLoading}
          initialName=""
          initialDescription=""
        />
        
        <WorkflowLoadDialog 
          open={loadDialogOpen}
          onOpenChange={setLoadDialogOpen}
          onLoad={handleLoadWorkflow}
        />
      </div>
    </AppLayout>
  );
}
