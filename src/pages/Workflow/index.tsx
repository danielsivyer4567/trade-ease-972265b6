
import React, { useState, useCallback, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Key, Check, FileText, ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GCPVisionForm } from "@/components/messaging/dialog-sections/GCPVisionForm";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const [flowInstance, setFlowInstance] = useState(null);
  const [gcpVisionKeyDialogOpen, setGcpVisionKeyDialogOpen] = useState(false);
  const [gcpVisionKey, setGcpVisionKey] = useState('');
  const [hasGcpVisionKey, setHasGcpVisionKey] = useState(false);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState('inactive');

  useEffect(() => {
    // Check if GCP Vision API key is configured in Supabase
    checkGcpVisionApiKey();
  }, []);

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
          <NodeSidebar />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} />
          </div>
        </div>

        {!isLoadingKey && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          </div>
        )}
      </div>
    </AppLayout>
  );
}
