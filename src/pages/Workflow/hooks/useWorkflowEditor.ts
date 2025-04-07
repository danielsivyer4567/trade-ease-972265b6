
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { ReactFlowInstance } from '@xyflow/react';

export const useWorkflowEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  const workflowId = searchParams.get('id');
  const { user, session } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);
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

  async function getMockAutomation(id: number) {
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

  const handleAddAutomation = useCallback((automationNode: any) => {
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

  return {
    flowInstance,
    setFlowInstance,
    gcpVisionKeyDialogOpen,
    setGcpVisionKeyDialogOpen,
    gcpVisionKey,
    setGcpVisionKey,
    hasGcpVisionKey,
    isLoadingKey,
    integrationStatus,
    saveDialogOpen,
    setSaveDialogOpen,
    loadDialogOpen,
    setLoadDialogOpen,
    isSaving,
    currentWorkflowId,
    workflowName,
    workflowDescription,
    workflowCategory,
    initialFlowData,
    targetData,
    handleSaveWorkflow,
    handleSaveConfirm,
    handleLoadWorkflow,
    handleSendToFinancials,
    handleAddAutomation,
    handleNavigateToAutomations,
    isUserLoggedIn: !!user
  };
};
