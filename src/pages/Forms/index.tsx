
import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FilePlus, ClipboardList, Workflow, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Forms = () => {
  const navigate = useNavigate();
  
  const formTemplates = [
    {
      id: 1,
      title: 'Job Completion Form',
      description: 'Use this form for sign-offs when a job is completed.',
      icon: FileText,
      hasAutomation: true,
    },
    {
      id: 2,
      title: 'Site Inspection Form',
      description: 'Document on-site inspections and compliance checks.',
      icon: ClipboardList,
      hasAutomation: true,
    },
    {
      id: 3,
      title: 'Customer Feedback Form',
      description: 'Collect feedback from customers after service completion.',
      icon: FileText,
      hasAutomation: true,
    },
    {
      id: 4, 
      title: 'Material Request Form',
      description: 'Request materials and supplies for upcoming jobs.',
      icon: ClipboardList,
      hasAutomation: true,
    },
  ];
  
  // Navigate to automations page with forms filter active
  const navigateToAutomations = () => {
    navigate('/automations?category=forms');
  };

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ClipboardList className="mr-2 h-6 w-6" />
              Forms
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage forms for your trade business
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={navigateToAutomations}>
              <Workflow className="h-4 w-4" />
              <span>Form Automations</span>
            </Button>
            <Button className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              <span>Create New Form</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {formTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <template.icon className="h-6 w-6 text-blue-600" />
                  {template.hasAutomation && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                      <Workflow className="h-3 w-3 text-blue-600" />
                      <span className="text-xs">Automated</span>
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-2">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                {template.hasAutomation && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center">
                    <span>Triggers workflow</span>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span className="text-blue-600">Forms automation</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm">Preview</Button>
                <Button size="sm">Use Template</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Workflow className="h-10 w-10 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-800">Connect Forms to Workflows</h3>
              <p className="text-sm text-blue-700 mt-1 mb-3">
                Forms can trigger automations when submitted or at scheduled times. Automate your form distribution, 
                follow-ups, and data processing.
              </p>
              <Button variant="default" size="sm" onClick={navigateToAutomations}>
                Manage Form Automations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Forms;
