
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

// Fixed component prop types
type TestResult = {
  success: boolean;
  message?: string;
  error?: any;
};

export const WorkflowTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('workflow-creation');

  const runTest = async (testName: string, testFunction: () => Promise<TestResult>) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: { success: false, message: 'Running...' } }));
      
      const result = await testFunction();
      
      setTestResults(prev => ({ ...prev, [testName]: result }));
      
      if (result.success) {
        toast.success(`Test "${testName}" passed: ${result.message}`);
      } else {
        toast.error(`Test "${testName}" failed: ${result.message || (result.error && result.error.toString())}`);
      }
    } catch (error) {
      console.error(`Error running test "${testName}":`, error);
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
          error
        } 
      }));
      toast.error(`Test "${testName}" failed with an unexpected error`);
    }
  };

  const createWorkflow = async () => {
    // Simulate workflow creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    const id = `wf-${Date.now()}`;
    setWorkflowId(id);
    return { success: true, message: `Created workflow with ID: ${id}` };
  };

  const saveWorkflow = async () => {
    if (!workflowId) {
      return { success: false, message: 'No workflow created yet' };
    }
    // Simulate saving workflow
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: `Saved workflow with ID: ${workflowId}` };
  };

  const createTemplate = async () => {
    if (!workflowId) {
      return { success: false, message: 'No workflow created yet' };
    }
    // Simulate creating template
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success: true, message: `Created template from workflow: ${workflowId}` };
  };

  const triggerAutomation = async () => {
    if (!workflowId) {
      return { success: false, message: 'No workflow created yet' };
    }
    // Simulate triggering automation
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: `Triggered automation for workflow: ${workflowId}` };
  };

  const triggerSMS = async () => {
    // Simulate SMS trigger
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'SMS trigger simulation successful' };
  };

  const triggerEmail = async () => {
    // Simulate email trigger
    await new Promise(resolve => setTimeout(resolve, 700));
    return { success: true, message: 'Email trigger simulation successful' };
  };

  const triggerSocial = async () => {
    // Simulate social trigger
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Randomly succeed or fail to demonstrate error handling
    const randomSuccess = Math.random() > 0.3;
    if (randomSuccess) {
      return { success: true, message: 'Social media trigger simulation successful' };
    } else {
      return { 
        success: false, 
        message: 'Social media API returned an error',
        error: new Error('API rate limit exceeded') 
      };
    }
  };

  const associateWithJob = async () => {
    if (!workflowId) {
      return { success: false, message: 'No workflow created yet' };
    }
    // Simulate associating with job
    await new Promise(resolve => setTimeout(resolve, 900));
    return { success: true, message: `Associated workflow ${workflowId} with job ID: job-${Date.now()}` };
  };

  // Create a mock Flow component for testing
  const MockFlow = ({ workflowId }: { workflowId: string }) => (
    <div className="bg-gray-100 h-full flex items-center justify-center">
      <p className="text-gray-500">Mock Flow Component (ID: {workflowId})</p>
    </div>
  );

  const renderTestResult = (testName: string) => {
    const result = testResults[testName];
    if (!result) return null;
    
    return (
      <Badge variant={result.success ? "success" : "destructive"}>
        {result.success ? '✓ Passed' : '✗ Failed'}
      </Badge>
    );
  };

  const getTestResultMessage = (testName: string) => {
    const result = testResults[testName];
    if (!result) return null;
    
    // Handling both message and error properties
    const errorMessage = result.error ? 
      (typeof result.error === 'object' && result.error.message ? 
        result.error.message : 
        String(result.error)) 
      : '';
      
    return result.message || errorMessage || 'No details available';
  };

  // Mock buttons for AutomationButton, AutomationWorkflowButton, FormWorkflowButton
  const MockAutomationButton = ({ targetType, targetId, label }: { targetType: string, targetId: string, label: string }) => (
    <Button variant="outline" size="sm">
      {label}
    </Button>
  );

  const MockAutomationWorkflowButton = ({ targetType, targetId, label }: { targetType: string, targetId: string, label: string }) => (
    <Button variant="secondary" size="sm">
      {label}
    </Button>
  );

  const MockFormWorkflowButton = ({ targetType, targetId, label }: { targetType: string, targetId: string, label: string }) => (
    <Button variant="outline" size="sm">
      {label}
    </Button>
  );

  return (
    <div className="p-4 container mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">Workflow & Automation Test Suite</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="workflow-creation">Workflow Creation</TabsTrigger>
          <TabsTrigger value="trigger-tests">Trigger Tests</TabsTrigger>
          <TabsTrigger value="integration-tests">Integration Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflow-creation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                Workflow Testing
                {workflowId && (
                  <Badge variant="outline" className="ml-2">
                    Workflow ID: {workflowId}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('create-workflow', createWorkflow)}
                  disabled={!!workflowId}
                >
                  Create Test Workflow
                </Button>
                {renderTestResult('create-workflow')}
              </div>
              {testResults['create-workflow'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('create-workflow')}</p>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('save-workflow', saveWorkflow)}
                  disabled={!workflowId}
                >
                  Save Workflow
                </Button>
                {renderTestResult('save-workflow')}
              </div>
              {testResults['save-workflow'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('save-workflow')}</p>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('create-template', createTemplate)}
                  disabled={!workflowId}
                >
                  Create Template from Workflow
                </Button>
                {renderTestResult('create-template')}
              </div>
              {testResults['create-template'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('create-template')}</p>
              )}
            </CardContent>
          </Card>

          {workflowId && (
            <Card>
              <CardHeader>
                <CardTitle>Workflow Preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <MockFlow workflowId={workflowId} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="trigger-tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Automation Triggers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('trigger-automation', triggerAutomation)}
                  disabled={!workflowId}
                >
                  Trigger Automation
                </Button>
                {renderTestResult('trigger-automation')}
              </div>
              {testResults['trigger-automation'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('trigger-automation')}</p>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('trigger-sms', triggerSMS)}
                >
                  Test SMS Trigger
                </Button>
                {renderTestResult('trigger-sms')}
              </div>
              {testResults['trigger-sms'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('trigger-sms')}</p>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('trigger-email', triggerEmail)}
                >
                  Test Email Trigger
                </Button>
                {renderTestResult('trigger-email')}
              </div>
              {testResults['trigger-email'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('trigger-email')}</p>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('trigger-social', triggerSocial)}
                >
                  Test Social Media Trigger
                </Button>
                {renderTestResult('trigger-social')}
              </div>
              {testResults['trigger-social'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('trigger-social')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration-tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Entity Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  onClick={() => runTest('associate-job', associateWithJob)}
                  disabled={!workflowId}
                >
                  Associate With Job
                </Button>
                {renderTestResult('associate-job')}
              </div>
              {testResults['associate-job'] && (
                <p className="text-sm text-muted-foreground">{getTestResultMessage('associate-job')}</p>
              )}

              <Separator />

              <p className="text-sm text-muted-foreground mb-2">Test automation buttons:</p>

              <div className="flex flex-wrap gap-2">
                <MockAutomationButton 
                  targetType="job"
                  targetId="test-entity-1"
                  label="Job Automation"
                />
                
                <MockAutomationWorkflowButton 
                  targetType="customer"
                  targetId="test-entity-2"
                  label="Customer Workflow"
                />
                
                <MockFormWorkflowButton 
                  targetType="invoice"
                  targetId="test-entity-3"
                  label="Invoice Form"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
