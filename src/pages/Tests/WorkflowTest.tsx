
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormWorkflowButton } from '@/components/automation/FormWorkflowButton';
import { AutomationWorkflowButton } from '@/components/automation/AutomationWorkflowButton';

// This component is for testing workflow functionality
export const WorkflowTest = () => {
  const [testEntityId] = useState('test-123');
  const [testEntityType] = useState('customer');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Workflow Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Form Workflow Button Test</CardTitle>
            <CardDescription>Testing FormWorkflowButton component with various props</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Basic</h3>
              <FormWorkflowButton 
                formId={123} 
                targetType={testEntityType}
                targetId={testEntityId}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">With Label</h3>
              <FormWorkflowButton 
                formId={123} 
                targetType={testEntityType}
                targetId={testEntityId}
                label="Custom Label"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Alternative Props</h3>
              <FormWorkflowButton 
                formId={123} 
                entityType={testEntityType}
                entityId={testEntityId}
                label="Using entityType/entityId"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Automation Workflow Button Test</CardTitle>
            <CardDescription>Testing AutomationWorkflowButton component with various props</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Basic</h3>
              <AutomationWorkflowButton 
                automationId={456} 
                targetType={testEntityType}
                targetId={testEntityId}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">With Label</h3>
              <AutomationWorkflowButton 
                automationId={456} 
                targetType={testEntityType}
                targetId={testEntityId}
                label="Custom Label"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">With Variant</h3>
              <AutomationWorkflowButton 
                automationId={456} 
                targetType={testEntityType}
                targetId={testEntityId}
                variant="outline"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Alternative Props</h3>
              <AutomationWorkflowButton 
                automationId={456} 
                entityType={testEntityType}
                entityId={testEntityId}
                label="Using entityType/entityId"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          {/* Using type assertion to allow 'success' variant even though it's not defined in the types */}
          <Button variant={"outline" as any}>Success</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Workflow Component Integration Tests</CardTitle>
          <CardDescription>Testing various workflow components together</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="font-medium mb-2">Form Workflow Integration</h3>
              <FormWorkflowButton 
                formId={123} 
                targetType={testEntityType}
                targetId={testEntityId}
                label="Manage Form Automations"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Automation Workflow Integration</h3>
              <AutomationWorkflowButton 
                automationId={456} 
                targetType={testEntityType}
                targetId={testEntityId}
                label="Add to Workflow"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowTest;
