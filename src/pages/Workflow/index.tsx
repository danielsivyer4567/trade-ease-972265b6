
import React, { useState, useCallback, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Settings, Save, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const [flowInstance, setFlowInstance] = useState(null);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('workflow-ai-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveFlow = useCallback(() => {
    if (!flowInstance) return;
    
    const flow = flowInstance.toObject();
    localStorage.setItem('workflow-data', JSON.stringify(flow));
    toast.success('Workflow saved successfully!');
  }, [flowInstance]);

  const handleSaveApiKey = useCallback(() => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    // Save API key to localStorage
    localStorage.setItem('workflow-ai-api-key', apiKey);
    toast.success('API key saved successfully!');
    setApiKeyDialogOpen(false);
  }, [apiKey]);

  const handleClearApiKey = useCallback(() => {
    setApiKey('');
    localStorage.removeItem('workflow-ai-api-key');
    toast.info('API key cleared');
  }, []);

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
            <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Key className="h-4 w-4" /> Configure API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>AI API Key Configuration</DialogTitle>
                  <DialogDescription>
                    Enter your AI service API key to enable AI features in the workflow.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="api-key" className="text-right">
                      API Key
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleClearApiKey}>Clear</Button>
                  <Button onClick={handleSaveApiKey}>Save Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

        {apiKey && (
          <Card className="mt-4">
            <CardHeader className="py-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Key className="h-4 w-4 text-green-500" />
                AI Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-green-600">
                AI API key is configured and ready to use
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
