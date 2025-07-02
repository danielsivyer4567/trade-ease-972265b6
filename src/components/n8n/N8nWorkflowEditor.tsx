import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Save, Settings, Share2, Eye, FileDown, FileUp, Plus, Workflow, Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface N8nWorkflowEditorProps {
  workflowId?: string;
  onSave?: (workflowData: any) => void;
  onExecute?: (workflowId: string, inputData?: any) => void;
  readOnly?: boolean;
  height?: string;
}

export function N8nWorkflowEditor({ 
  workflowId, 
  onSave, 
  onExecute, 
  readOnly = false,
  height = '100vh'
}: N8nWorkflowEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [n8nUrl] = useState(import.meta.env.VITE_N8N_URL || 'http://localhost:5678');
  const navigate = useNavigate();

  // Initialize n8n editor
  useEffect(() => {
    const initializeN8n = async () => {
      try {
        setIsLoading(true);
        
        // Check if n8n is available
        const response = await fetch(`/api/n8n/active`);
        if (!response.ok) {
          throw new Error('n8n server is not available');
        }

        // Load workflow if workflowId is provided
        if (workflowId) {
          await loadWorkflow(workflowId);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize n8n:', error);
        toast.error('Failed to connect to n8n. Please ensure n8n is running.');
        setIsLoading(false);
      }
    };

    initializeN8n();
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    try {
      const response = await fetch(`/api/n8n/workflows/${id}`);
      if (response.ok) {
        const workflow = await response.json();
        setWorkflowData(workflow);
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
      toast.error('Failed to load workflow');
    }
  };

  const saveWorkflow = async () => {
    try {
      if (!workflowData) return;

      const response = await fetch(`/api/n8n/workflows${workflowId ? `/${workflowId}` : ''}`, {
        method: workflowId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': import.meta.env.VITE_N8N_API_KEY,
        },
        body: JSON.stringify(workflowData),
      });

      if (response.ok) {
        const savedWorkflow = await response.json();
        setWorkflowData(savedWorkflow);
        onSave?.(savedWorkflow);
        toast.success('Workflow saved successfully');
      } else {
        throw new Error('Failed to save workflow');
      }
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow');
    }
  };

  const executeWorkflow = async () => {
    if (!workflowId) {
      toast.error('Please save the workflow first');
      return;
    }

    try {
      setExecutionStatus('running');
      const response = await fetch(`/api/n8n/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': import.meta.env.VITE_N8N_API_KEY,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const execution = await response.json();
        setExecutionStatus('completed');
        onExecute?.(workflowId, execution);
        toast.success('Workflow executed successfully');
      } else {
        throw new Error('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      setExecutionStatus('error');
      toast.error('Failed to execute workflow');
    } finally {
      setTimeout(() => setExecutionStatus('idle'), 3000);
    }
  };

  const getN8nEmbedUrl = () => {
    const baseUrl = `${n8nUrl}/workflow`;
    if (workflowId) {
      return `${baseUrl}/${workflowId}`;
    }
    return `${baseUrl}/new`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading n8n Workflow Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Workflow className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              n8n Workflow Editor
            </h1>
          </div>
          
          {workflowData && (
            <Badge variant="outline" className="ml-2">
              {workflowData.name || 'Untitled Workflow'}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={executeWorkflow}
            disabled={executionStatus === 'running' || !workflowId}
            className="flex items-center space-x-2"
          >
            {executionStatus === 'running' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Execute</span>
              </>
            )}
          </Button>

          {!readOnly && (
            <Button
              variant="default"
              size="sm"
              onClick={saveWorkflow}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(n8nUrl, '_blank')}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Open in n8n</span>
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={getN8nEmbedUrl()}
          className="w-full h-full border-0"
          style={{ height }}
          title="n8n Workflow Editor"
          allow="clipboard-read; clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
        
        {/* Overlay for execution status */}
        {executionStatus !== 'idle' && (
          <div className="absolute top-4 right-4 z-10">
            <Card className="w-64">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  {executionStatus === 'running' && (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-600">Executing workflow...</span>
                    </>
                  )}
                  {executionStatus === 'completed' && (
                    <>
                      <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Execution completed</span>
                    </>
                  )}
                  {executionStatus === 'error' && (
                    <>
                      <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600">Execution failed</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Connected to n8n at {n8nUrl}</span>
          {workflowId && (
            <Badge variant="secondary" className="text-xs">
              ID: {workflowId}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
} 