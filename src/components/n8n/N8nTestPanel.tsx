import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Play, Zap, TestTube, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface N8nTestPanelProps {
  className?: string;
}

export function N8nTestPanel({ className }: N8nTestPanelProps) {
  const [n8nUrl] = useState(import.meta.env.VITE_N8N_URL || 'http://localhost:5678');
  const [isConnected, setIsConnected] = useState(false);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [testData, setTestData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);

  useEffect(() => {
    checkConnection();
    loadWorkflows();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`/api/n8n/active`);
      setIsConnected(response.ok);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      const response = await fetch(`/api/n8n/workflows`, {
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.data || data);
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const testWorkflow = async () => {
    if (!selectedWorkflow) {
      toast.error('Please select a workflow to test');
      return;
    }
    setIsLoading(true);
    try {
      let payload = {};
      if (testData.trim()) {
        try {
          payload = JSON.parse(testData);
        } catch (error) {
          toast.error('Invalid JSON in test data');
          setIsLoading(false);
          return;
        }
      }
      const response = await fetch(`/api/n8n/workflows/${selectedWorkflow}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setLastTestResult(result);
      if (response.ok) {
        toast.success('Workflow executed successfully');
      } else {
        toast.error('Workflow execution failed');
      }
    } catch (error) {
      console.error('Test failed:', error);
      toast.error('Failed to test workflow');
      setLastTestResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!selectedWorkflow) {
      toast.error('Please select a workflow to test');
      return;
    }

    const workflow = workflows.find(w => w.id === selectedWorkflow);
    if (!workflow) return;

    // Find webhook node
    const webhookNode = workflow.nodes.find((node: any) => 
      node.type === 'n8n-nodes-base.webhook'
    );

    if (!webhookNode) {
      toast.error('Selected workflow has no webhook trigger');
      return;
    }

    const webhookPath = webhookNode.parameters?.path;
    if (!webhookPath) {
      toast.error('Webhook path not found');
      return;
    }

    setIsLoading(true);
    try {
      let payload = {};
      if (testData.trim()) {
        try {
          payload = JSON.parse(testData);
        } catch (error) {
          toast.error('Invalid JSON in test data');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`${n8nUrl}/webhook/${webhookPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      setLastTestResult({ status: response.status, data: result });
      
      if (response.ok) {
        toast.success('Webhook triggered successfully');
      } else {
        toast.error('Webhook trigger failed');
      }
    } catch (error) {
      console.error('Webhook test failed:', error);
      toast.error('Failed to trigger webhook');
      setLastTestResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleData = (type: string) => {
    const samples = {
      customer: {
        customer: {
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890"
        }
      },
      job: {
        job: {
          id: "456",
          title: "Kitchen Renovation",
          status: "in_progress",
          customer_id: "123"
        }
      },
      task: {
        task: {
          id: "789",
          title: "Site Inspection",
          description: "Conduct initial site inspection",
          status: "pending"
        }
      }
    };
    
    setTestData(JSON.stringify(samples[type as keyof typeof samples], null, 2));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            n8n Integration Test Panel
          </CardTitle>
          <CardDescription>
            Test your n8n workflows and webhooks directly from your app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Label>Connection Status:</Label>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>

          {/* Workflow Selection */}
          <div className="space-y-2">
            <Label htmlFor="workflow-select">Select Workflow</Label>
            <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a workflow to test" />
              </SelectTrigger>
              <SelectContent>
                {workflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    <div className="flex items-center gap-2">
                      <span>{workflow.name}</span>
                      <Badge variant={workflow.active ? "default" : "secondary"}>
                        {workflow.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Test Data */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="test-data">Test Data (JSON)</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getSampleData('customer')}
                >
                  Customer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getSampleData('job')}
                >
                  Job
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getSampleData('task')}
                >
                  Task
                </Button>
              </div>
            </div>
            <Textarea
              id="test-data"
              placeholder="Enter JSON test data..."
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              rows={6}
            />
          </div>

          {/* Test Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={testWorkflow}
              disabled={!selectedWorkflow || isLoading || !isConnected}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Test Workflow
            </Button>
            <Button
              onClick={testWebhook}
              disabled={!selectedWorkflow || isLoading || !isConnected}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Test Webhook
            </Button>
          </div>

          {/* Test Results */}
          {lastTestResult && (
            <div className="space-y-2">
              <Label>Last Test Result:</Label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(lastTestResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 