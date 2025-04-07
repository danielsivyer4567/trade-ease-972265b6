import React, { useState, useCallback, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Key, Check, FileText, ArrowRightLeft, Workflow, FolderOpen, Plus } from "lucide-react";
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
  const [workflowCategory, setWorkflowCategory] = useState("");
  const [initialFlowData, setInitialFlowData] = useState<any>(null);
  
  const [targetData, setTargetData] = useState<{
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null>(null);

  useEffect(() => {
    checkGcpVisionApiKey();
    
    if (location.state) {
      if (location.state.templateData) {
        setInitialFlowData(location.state.templateData);
        setWorkflowName(location.state.templateName || "New Workflow from Template");
        setWorkflowDescription(location.state.templateDescription || "");
        setWorkflowCategory(location.state.templateCategory || "");
      }
      
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
    if (flowInstance && initialFlowData && !currentWorkflowId) {
      flowInstance.setNodes([]);
      flowInstance.setEdges([]);
      
      if (initialFlowData.nodes) {
        flowInstance.addNodes(initialFlowData.nodes);
      }
      
      if (initialFlowData.edges) {
        flowInstance.addEdges(initialFlowData.edges);
      }
      
      setInitialFlowData(null);
      
      toast.success("Template applied successfully");
      
      setTimeout(() => {
        flowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  }, [flowInstance, initialFlowData, currentWorkflowId]);

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

  const handleSaveWorkflow = useCallback(() => {
    if (!flowInstance) return;
    
    if (!user) {
      toast.error("You need to be logged in to save workflows");
      return;
    }
    
    setSaveDialogOpen(true);
  }, [flowInstance, user]);

  const handleSaveConfirm = useCallback(async (name: string, description: string, category: string) => {
    if (!flowInstance) return;
    
    setIsSaving(true);
    setWorkflowName(name);
    setWorkflowDescription(description);
    setWorkflowCategory(category);
    
    try {
      const flowData = flowInstance.toObject();
      
      flowInstance.saveWorkflow && await flowInstance.saveWorkflow(name);
      
      setSaveDialogOpen(false);
      toast.success("Workflow saved successfully");
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow");
    } finally {
      setIsSaving(false);
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

  const handleNavigateToAutomations = () => {
    navigate('/automations');
  };

  return (
    <AppLayout>
      <div className="p-4 h-full">
        <WorkflowNavigation />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {currentWorkflowId ? workflowName : workflowName}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={handleNavigateToAutomations}
            >
              <Workflow className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Automations</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setLoadDialogOpen(true)}
            >
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Load</span>
            </Button>
            
            <AutomationSelector 
              onSelectAutomation={handleAddAutomation} 
              targetType={targetData?.targetType}
              targetId={targetData?.targetId}
            />
            
            <Dialog open={gcpVisionKeyDialogOpen} onOpenChange={setGcpVisionKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Key className="h-4 w-4" /> 
                  <span className="hidden sm:inline">GCP Key</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-slate-200">
                <DialogHeader>
                  <DialogTitle>Google Cloud Vision API Configuration</DialogTitle>
                  <DialogDescription>
                    Enter your Google Cloud Vision API key to enable document text extraction and image analysis.
                    <p className="mt-2 text-xs text-muted-foreground">
                      This key will be securely stored in your Supabase database.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <GCPVisionForm gcpVisionKey={gcpVisionKey} setGcpVisionKey={setGcpVisionKey} />
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setGcpVisionKeyDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              disabled={integrationStatus !== 'ready'}
              onClick={handleSendToFinancials}
            >
              <ArrowRightLeft className="h-4 w-4" /> 
              <span className="hidden sm:inline">Vision to Financials</span>
            </Button>
            
            <Button 
              onClick={handleSaveWorkflow}
              size="sm" 
              className="flex items-center gap-2"
              disabled={!user}
            >
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-200px)] border border-gray-200 rounded-lg overflow-hidden">
          <NodeSidebar targetData={targetData} />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} workflowId={currentWorkflowId} initialData={initialFlowData} />
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
          onSave={handleSaveConfirm}
          isLoading={isSaving}
          initialName={workflowName}
          initialDescription={workflowDescription}
          initialCategory={workflowCategory}
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
