
import React, { useState, useEffect, useCallback } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Workflow, RefreshCw, Activity, Check, X, ArrowRight } from 'lucide-react';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { AutomationTriggerService } from '@/services/AutomationTriggerService';
import { WorkflowService } from '@/services/WorkflowService';
import { toast } from 'sonner';
import { AutomationButton } from '@/components/automation/AutomationButton';
import { AutomationWorkflowButton } from '@/components/automation/AutomationWorkflowButton';
import { useNavigate } from 'react-router-dom';

const WorkflowTest = () => {
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [refreshCounter, setRefreshCounter] = useState(0);
  const navigate = useNavigate();

  // Function to run a single test and store its result
  const runTest = useCallback(async (testId: string, testFn: () => Promise<{ success: boolean; message: string }>) => {
    setIsLoading(prev => ({ ...prev, [testId]: true }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testId]: result }));
      
      if (result.success) {
        toast.success(`Test "${testId}" passed: ${result.message}`);
      } else {
        toast.error(`Test "${testId}" failed: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error in test "${testId}":`, error);
      setTestResults(prev => ({ 
        ...prev, 
        [testId]: { 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
      toast.error(`Test "${testId}" failed with an exception`);
    } finally {
      setIsLoading(prev => ({ ...prev, [testId]: false }));
    }
  }, []);

  // Define test cases
  const testCases = {
    // Workflow Service Tests
    'workflow-save': async () => {
      const workflowData = {
        id: crypto.randomUUID(),
        name: `Test Workflow ${new Date().toISOString()}`,
        description: 'This workflow was created by automated testing',
        category: 'Testing',
        data: {
          nodes: [
            {
              id: 'test-node-1',
              type: 'default',
              position: { x: 100, y: 100 },
              data: { label: 'Test Node 1' }
            },
            {
              id: 'test-node-2',
              type: 'default',
              position: { x: 300, y: 100 },
              data: { label: 'Test Node 2' }
            }
          ],
          edges: [
            {
              id: 'test-edge-1',
              source: 'test-node-1',
              target: 'test-node-2'
            }
          ]
        }
      };
      
      const result = await WorkflowService.saveWorkflow(workflowData);
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to save workflow' };
      }
      
      return { success: true, message: `Workflow saved with ID: ${result.id}` };
    },
    
    'workflow-template': async () => {
      const workflowData = {
        id: crypto.randomUUID(),
        name: `Test Template ${new Date().toISOString()}`,
        description: 'This template was created by automated testing',
        category: 'Testing',
        data: {
          nodes: [
            {
              id: 'template-node-1',
              type: 'default',
              position: { x: 100, y: 100 },
              data: { label: 'Template Node 1' }
            }
          ],
          edges: []
        }
      };
      
      const result = await WorkflowService.saveAsTemplate(workflowData);
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to save template' };
      }
      
      return { success: true, message: `Template saved with ID: ${result.id}` };
    },
    
    // Automation Tests
    'trigger-automation': async () => {
      const automationId = 1; // Using a mock automation ID
      
      const result = await AutomationIntegrationService.triggerAutomation(automationId, {
        targetType: 'job',
        targetId: 'test-job-001',
        additionalData: {
          source: 'test',
          timestamp: new Date().toISOString()
        }
      });
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to trigger automation' };
      }
      
      return { success: true, message: result.message || 'Automation triggered successfully' };
    },
    
    'associate-automation': async () => {
      const automationId = 2; // Using a mock automation ID
      
      const result = await AutomationIntegrationService.associateAutomation(
        automationId,
        'customer',
        'test-customer-001'
      );
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to associate automation' };
      }
      
      return { success: true, message: 'Automation associated successfully' };
    },
    
    // Testing SMS trigger
    'sms-trigger': async () => {
      const result = await AutomationTriggerService.sendSMS(
        '+15555555555', // Test phone number
        'This is a test SMS from the workflow testing page'
      );
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to send SMS' };
      }
      
      return { success: true, message: result.message || 'SMS sent successfully' };
    },
    
    // Testing email trigger
    'email-trigger': async () => {
      const result = await AutomationTriggerService.sendEmail(
        'test@example.com',
        'Workflow Test Email',
        '<h1>Test Email</h1><p>This is a test email from the workflow testing page</p>'
      );
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to send email' };
      }
      
      return { success: true, message: result.message || 'Email sent successfully' };
    },
    
    // Testing social media trigger
    'social-trigger': async () => {
      const result = await AutomationTriggerService.postToSocial(
        ['facebook', 'instagram'],
        'This is a test post from the workflow testing system.',
        []
      );
      
      if (!result.success) {
        return { success: false, message: result.error || 'Failed to post to social media' };
      }
      
      return { success: true, message: result.message || 'Posted to social media successfully' };
    }
  };

  // Run all tests function
  const runAllTests = async () => {
    // Clear previous results
    setTestResults({});
    
    // Run each test in sequence
    for (const [testId, testFn] of Object.entries(testCases)) {
      await runTest(testId, testFn);
      // Small delay between tests to prevent race conditions
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setRefreshCounter(prev => prev + 1);
  };
  
  // Navigate to workflow editor with a test context
  const navigateToWorkflowEditor = () => {
    navigate('/workflow', { 
      state: { 
        targetType: 'test', 
        targetId: `test-${Date.now()}`,
        createAutomationNode: true
      }
    });
  };

  // Helper function to render a test result badge
  const renderTestResult = (testId: string) => {
    const result = testResults[testId];
    
    if (!result) {
      return <Badge variant="outline">Not Run</Badge>;
    }
    
    return result.success 
      ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" /> Pass</Badge>
      : <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" /> Fail</Badge>;
  };

  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Workflow & Automation Tests</h1>
            <p className="text-gray-500">Run tests to verify the workflow and automation features</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAllTests} className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Run All Tests</span>
            </Button>
            <Button onClick={navigateToWorkflowEditor} variant="outline">
              <Workflow className="h-4 w-4 mr-2" />
              Open Test Workflow
            </Button>
          </div>
        </div>

        <Tabs defaultValue="workflow">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="workflow">Workflow Tests</TabsTrigger>
            <TabsTrigger value="automation">Automation Tests</TabsTrigger>
            <TabsTrigger value="triggers">Trigger Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflow" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Service Tests</CardTitle>
                <CardDescription>Tests for saving and loading workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">Save Workflow</h3>
                      <p className="text-sm text-gray-500">Tests workflow creation and saving</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('workflow-save')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('workflow-save', testCases['workflow-save'])}
                        disabled={isLoading['workflow-save']}
                      >
                        {isLoading['workflow-save'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">Save Template</h3>
                      <p className="text-sm text-gray-500">Tests template creation</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('workflow-template')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('workflow-template', testCases['workflow-template'])}
                        disabled={isLoading['workflow-template']}
                      >
                        {isLoading['workflow-template'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <ArrowRight className="h-4 w-4" /> 
                    You can directly open the workflow editor to test the UI
                  </p>
                  <div className="flex gap-2 mt-2">
                    <AutomationButton 
                      targetType="job" 
                      targetId="test-job-123" 
                      variant="outline"
                      buttonText="Test Job Automations"
                    />
                    <AutomationWorkflowButton 
                      automationId={1} 
                      variant="outline"
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="automation" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Automation Service Tests</CardTitle>
                <CardDescription>Tests for automation integration service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">Trigger Automation</h3>
                      <p className="text-sm text-gray-500">Tests triggering an automation</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('trigger-automation')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('trigger-automation', testCases['trigger-automation'])}
                        disabled={isLoading['trigger-automation']}
                      >
                        {isLoading['trigger-automation'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">Associate Automation</h3>
                      <p className="text-sm text-gray-500">Tests associating an automation with an entity</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('associate-automation')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('associate-automation', testCases['associate-automation'])}
                        disabled={isLoading['associate-automation']}
                      >
                        {isLoading['associate-automation'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="triggers" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Trigger Service Tests</CardTitle>
                <CardDescription>Tests for various trigger services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">SMS Trigger</h3>
                      <p className="text-sm text-gray-500">Tests sending an SMS</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('sms-trigger')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('sms-trigger', testCases['sms-trigger'])}
                        disabled={isLoading['sms-trigger']}
                      >
                        {isLoading['sms-trigger'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">Email Trigger</h3>
                      <p className="text-sm text-gray-500">Tests sending an email</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('email-trigger')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('email-trigger', testCases['email-trigger'])}
                        disabled={isLoading['email-trigger']}
                      >
                        {isLoading['email-trigger'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">Social Media Trigger</h3>
                      <p className="text-sm text-gray-500">Tests posting to social media</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderTestResult('social-trigger')}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => runTest('social-trigger', testCases['social-trigger'])}
                        disabled={isLoading['social-trigger']}
                      >
                        {isLoading['social-trigger'] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Run Test'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Results Overview</CardTitle>
            <CardDescription>Summary of all test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.keys(testResults).length > 0 ? (
                Object.entries(testResults).map(([testId, result]) => (
                  <div key={testId} className="flex items-start gap-2 border-b pb-2">
                    <div className="mt-0.5">
                      {result.success ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{testId}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tests have been run yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default WorkflowTest;
