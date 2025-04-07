
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { ReactFlowInstance } from '@xyflow/react';
import { useWorkflowSync } from './useWorkflowSync';

export const useWorkflowEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance & { saveWorkflow?: (name: string) => Promise<string> } | null>(null);
  const [gcpVisionKeyDialogOpen, setGcpVisionKeyDialogOpen] = useState(false);
  const [gcpVisionKey, setGcpVisionKey] = useState('');
  const [hasGcpVisionKey, setHasGcpVisionKey] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState('inactive');
  const [addedAutomationFromURL, setAddedAutomationFromURL] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>(searchParams.get('id') || undefined);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowCategory, setWorkflowCategory] = useState("");
  const [initialFlowData, setInitialFlowData] = useState<any>(null);
  
  const [targetData, setTargetData] = useState<{
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null>(null);

  const workflowSync = useWorkflowSync(currentWorkflowId);
  
  // Extract the properties from workflowSync
  const { 
    lastSavedAt, 
    isSyncing, 
    hasUnsavedChanges,
    saveWorkflow: syncSaveWorkflow 
  } = workflowSync;

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

  const checkGcpVisionApiKey = async () => {
    setIsLoadingKey(true);
    try {
      // Mock API key check
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const hasKey = Math.random() > 0.5;
      
      if (hasKey) {
        setGcpVisionKey("mock-api-key-xxxxx");
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

  const handleSaveWorkflow = useCallback(async () => {
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
      const workflowData = {
        id: currentWorkflowId,
        name,
        description,
        category,
        data: {
          nodes: flowInstance.getNodes(),
          edges: flowInstance.getEdges()
        },
        is_template: false
      };
      
      const id = await syncSaveWorkflow(workflowData);
      
      if (id) {
        setCurrentWorkflowId(id);
        setSaveDialogOpen(false);
        toast.success("Workflow saved successfully");
      } else {
        throw new Error("Failed to save workflow");
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow");
    } finally {
      setIsSaving(false);
    }
  }, [flowInstance, currentWorkflowId, syncSaveWorkflow]);

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
      console.log(`Associating automation ${automationNode.data.automationId} with ${targetData.targetType} ${targetData.targetId}`);
      
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
    isUserLoggedIn: !!user,
    lastSavedAt,
    isSyncing,
    hasUnsavedChanges
  };
};
