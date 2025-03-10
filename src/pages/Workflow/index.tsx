
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
  const [gcpVisionKeyDialogOpen, setGcpVisionKeyDialogOpen] = useState(false);
  const [gcpVisionKey, setGcpVisionKey] = useState('');

  useEffect(() => {
    // Load GCP Vision API key from localStorage on component mount
    const savedGcpVisionKey = localStorage.getItem('gcp-vision-api-key');
    if (savedGcpVisionKey) {
      setGcpVisionKey(savedGcpVisionKey);
    }
  }, []);

  const handleSaveFlow = useCallback(() => {
    if (!flowInstance) return;
    
    const flow = flowInstance.toObject();
    localStorage.setItem('workflow-data', JSON.stringify(flow));
    toast.success('Workflow saved successfully!');
  }, [flowInstance]);

  const handleSaveGcpVisionKey = useCallback(() => {
    if (!gcpVisionKey.trim()) {
      toast.error('Please enter a valid Google Cloud Vision API key');
      return;
    }
    
    // Save GCP Vision API key to localStorage
    localStorage.setItem('gcp-vision-api-key', gcpVisionKey);
    toast.success('Google Cloud Vision API key saved successfully!');
    setGcpVisionKeyDialogOpen(false);
  }, [gcpVisionKey]);

  const handleClearGcpVisionKey = useCallback(() => {
    setGcpVisionKey('');
    localStorage.removeItem('gcp-vision-api-key');
    toast.info('Google Cloud Vision API key cleared');
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
            <Dialog open={gcpVisionKeyDialogOpen} onOpenChange={setGcpVisionKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Key className="h-4 w-4" /> Configure GCP Vision API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Google Cloud Vision API Configuration</DialogTitle>
                  <DialogDescription>
                    Enter your Google Cloud Vision API key to enable document text extraction and image analysis.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gcp-vision-key" className="text-right">
                      GCP Vision Key
                    </Label>
                    <Input
                      id="gcp-vision-key"
                      type="password"
                      value={gcpVisionKey}
                      onChange={(e) => setGcpVisionKey(e.target.value)}
                      placeholder="Enter your Google Cloud Vision API key"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleClearGcpVisionKey}>Clear</Button>
                  <Button onClick={handleSaveGcpVisionKey}>Save Key</Button>
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

        {gcpVisionKey && (
          <Card className="mt-4">
            <CardHeader className="py-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Key className="h-4 w-4 text-green-500" />
                Google Cloud Vision API Status
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-green-600">
                Google Cloud Vision API key is configured and ready to use
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
