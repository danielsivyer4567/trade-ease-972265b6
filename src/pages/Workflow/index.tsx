import React, { useState, useCallback, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Key, Check, FileText, ArrowRightLeft, Workflow } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GCPVisionForm } from "@/components/messaging/dialog-sections/GCPVisionForm";
import { AutomationSelector } from './components/AutomationSelector';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';

export default function WorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  
  const [flowInstance, setFlowInstance] = useState(null);
  const [gcpVisionKeyDialogOpen, setGcpVisionKeyDialogOpen] = useState(false);
  const [gcpVisionKey, setGcpVisionKey] = useState('');
  const [hasGcpVisionKey, setHasGcpVisionKey] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState('inactive');
  const [addedAutomationFromURL, setAddedAutomationFromURL] = useState(false);
  
  // Handle target data passed from other parts of the app
  const [targetData, setTargetData] = useState<{
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null>(null);

  useEffect(() => {
    // Check if GCP Vision API key is configured in Supabase
    checkGcpVisionApiKey();
    
    // Handle any incoming state from navigation
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

  // Handle automation ID from URL parameter
  useEffect(() => {
    if (automationId && flowInstance && !addedAutomationFromURL) {
      // Fetch automation details and add to workflow
      const addAutomationFromURL = async () => {
        try {
          const automationDetail = await getMockAutomation(parseInt(automationId, 10));
          
          if (automationDetail) {
            // Create custom event to add the automation node
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
            
            // Dispatch the event
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

  // Mock function to get automation details - in a real app this would come from API/database
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

  // Handle adding an automation node when requested via navigation
  useEffect(() => {
    if (flowInstance && targetData?.createAutomationNode) {
      // Load associated automations
      const loadAutomations = async () => {
        try {
          const { success, automations } = await AutomationIntegrationService.getAssociatedAutomations(
            targetData.targetType!, 
            targetData.targetId!
          );
          
          if (success && automations && automations.length > 0) {
            // Add the first automation as a node
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
            // No automations found, open selector instead
            toast.info('No automations associated with this item. Please select one to add.');
          }
        } catch (error) {
          console.error('Error loading automations:', error);
        }
        
        // Clear the target data to prevent re-adding
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

  const handleSaveFlow = useCallback(() => {
    if (!flowInstance) return;
    const flow = flowInstance.toObject();
    localStorage.setItem('workflow-data', JSON.stringify(flow));
    toast.success('Workflow saved successfully!');
  }, [flowInstance]);

  const handleSendToFinancials = useCallback(() => {
    if (integrationStatus !== 'ready') {
      toast.error('Please configure the GCP Vision API key first');
      return;
    }
    
    toast.info('Vision analysis will feed data to financial sections');
    
    // In a real application, this would send the workflow configuration
    // to a backend service that would execute the workflow
    setTimeout(() => {
      toast.success('Workflow configured to send vision data to financials');
    }, 1000);
  }, [integrationStatus]);

  const handleAddAutomation = useCallback((automationNode) => {
    if (!flowInstance) return;
    
    // Generate a unique ID for the node
    automationNode.id = `automation-${Date.now()}`;
    
    // If we have a target entity, associate this automation with it
    if (targetData?.targetType && targetData?.targetId) {
      AutomationIntegrationService.associateAutomation(
        automationNode.data.automationId,
        targetData.targetType,
        targetData.targetId
      );
      
      // Add target data to the node
      automationNode.data.targetType = targetData.targetType;
      automationNode.data.targetId = targetData.targetId;
    }
    
    // Add the node to the flow
    flowInstance.addNodes(automationNode);
    
    toast.success(`Added "${automationNode.data.label}" automation to workflow`);
  }, [flowInstance, targetData]);

  const handleNavigateToAutomations = () => {
    navigate('/automations');
  };

  return (
    <AppLayout>
      <div className="p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleNavigateToAutomations}
            >
              <Workflow className="h-4 w-4" />
              Manage Automations
            </Button>
            
            <AutomationSelector 
              onSelectAutomation={handleAddAutomation} 
              targetType={targetData?.targetType}
              targetId={targetData?.targetId}
            />
            
            <Dialog open={gcpVisionKeyDialogOpen} onOpenChange={setGcpVisionKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Key className="h-4 w-4" /> Configure GCP Vision API Key
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
              className="flex items-center gap-2"
              disabled={integrationStatus !== 'ready'}
              onClick={handleSendToFinancials}
            >
              <ArrowRightLeft className="h-4 w-4" /> 
              Link Vision to Financials
            </Button>
            
            <Button onClick={handleSaveFlow} className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Workflow
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-200px)] border border-gray-200 rounded-lg overflow-hidden">
          <NodeSidebar targetData={targetData} />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} />
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
      </div>
    </AppLayout>
  );
}
