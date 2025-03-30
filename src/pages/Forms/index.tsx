
import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FilePlus, ClipboardList } from 'lucide-react';

const Forms = () => {
  const formTemplates = [
    {
      id: 1,
      title: 'Job Completion Form',
      description: 'Use this form for sign-offs when a job is completed.',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Site Inspection Form',
      description: 'Document on-site inspections and compliance checks.',
      icon: ClipboardList,
    },
    {
      id: 3,
      title: 'Customer Feedback Form',
      description: 'Collect feedback from customers after service completion.',
      icon: FileText,
    },
    {
      id: 4, 
      title: 'Material Request Form',
      description: 'Request materials and supplies for upcoming jobs.',
      icon: ClipboardList,
    },
  ];

  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Forms</h1>
          <Button className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <span>Create New Form</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <template.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="mt-2">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm">Preview</Button>
                <Button size="sm">Use Template</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};

export default Forms;
