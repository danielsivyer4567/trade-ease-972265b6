
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GlassCard } from '@/components/ui/GlassCard';
import { Workflow as WorkflowIcon, FileSpreadsheet, Users, MessageSquare, CreditCard, Calendar, Clipboard, Copy } from "lucide-react";
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';

// Sample template data
const workflowTemplates = [
  {
    id: 'job-workflow',
    name: 'Job Management',
    description: 'Manage the lifecycle of jobs from quote to completion',
    icon: <FileSpreadsheet className="h-8 w-8 text-blue-500" />,
    color: 'bg-blue-100',
    data: {
      nodes: [
        {
          id: 'quote-1',
          type: 'quoteNode',
          position: { x: 100, y: 100 },
          data: { label: 'New Quote' }
        },
        {
          id: 'job-1',
          type: 'jobNode',
          position: { x: 350, y: 100 },
          data: { label: 'Job Creation' }
        },
        {
          id: 'task-1',
          type: 'taskNode',
          position: { x: 600, y: 100 },
          data: { label: 'Task Assignment' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'quote-1',
          target: 'job-1',
          animated: true,
          label: 'Quote Accepted'
        },
        {
          id: 'e2-3',
          source: 'job-1',
          target: 'task-1',
          animated: true,
          label: 'Create Tasks'
        }
      ]
    }
  },
  {
    id: 'customer-workflow',
    name: 'Customer Communication',
    description: 'Automate customer communications throughout the project',
    icon: <Users className="h-8 w-8 text-green-500" />,
    color: 'bg-green-100',
    data: {
      nodes: [
        {
          id: 'customer-1',
          type: 'customerNode',
          position: { x: 100, y: 100 },
          data: { label: 'New Customer' }
        },
        {
          id: 'message-1',
          type: 'messagingNode',
          position: { x: 350, y: 100 },
          data: { label: 'Welcome Message' }
        },
        {
          id: 'job-1',
          type: 'jobNode',
          position: { x: 600, y: 100 },
          data: { label: 'Job Updates' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'customer-1',
          target: 'message-1',
          animated: true,
          label: 'New Customer'
        },
        {
          id: 'e2-3',
          source: 'message-1',
          target: 'job-1',
          animated: true,
          label: 'Follow Up'
        }
      ]
    }
  },
  {
    id: 'messaging-workflow',
    name: 'Messaging Automations',
    description: 'Set up automated messages for different events',
    icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
    color: 'bg-purple-100',
    data: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'customNode',
          position: { x: 100, y: 100 },
          data: { label: 'Event Trigger', icon: '⚡', color: '#9333ea' }
        },
        {
          id: 'sms-1',
          type: 'messagingNode',
          position: { x: 350, y: 50 },
          data: { label: 'SMS Notification' }
        },
        {
          id: 'email-1',
          type: 'emailNode',
          position: { x: 350, y: 150 },
          data: { label: 'Email Notification' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'trigger-1',
          target: 'sms-1',
          animated: true,
          label: 'SMS'
        },
        {
          id: 'e1-3',
          source: 'trigger-1',
          target: 'email-1',
          animated: true,
          label: 'Email'
        }
      ]
    }
  },
  {
    id: 'payment-workflow',
    name: 'Payment Processing',
    description: 'Automate payment reminders and processing',
    icon: <CreditCard className="h-8 w-8 text-red-500" />,
    color: 'bg-red-100',
    data: {
      nodes: [
        {
          id: 'invoice-1',
          type: 'customNode',
          position: { x: 100, y: 100 },
          data: { label: 'Invoice Created', icon: '📃', color: '#f87171' }
        },
        {
          id: 'reminder-1',
          type: 'messagingNode',
          position: { x: 350, y: 100 },
          data: { label: 'Payment Reminder' }
        },
        {
          id: 'payment-1',
          type: 'customNode',
          position: { x: 600, y: 100 },
          data: { label: 'Payment Received', icon: '💰', color: '#4ade80' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'invoice-1',
          target: 'reminder-1',
          animated: true,
          label: 'After 3 days'
        },
        {
          id: 'e2-3',
          source: 'reminder-1',
          target: 'payment-1',
          animated: true,
          label: 'Payment Made'
        }
      ]
    }
  },
  {
    id: 'scheduling-workflow',
    name: 'Calendar Scheduling',
    description: 'Automate appointment scheduling and reminders',
    icon: <Calendar className="h-8 w-8 text-amber-500" />,
    color: 'bg-amber-100',
    data: {
      nodes: [
        {
          id: 'appointment-1',
          type: 'customNode',
          position: { x: 100, y: 100 },
          data: { label: 'Appointment Set', icon: '📅', color: '#f59e0b' }
        },
        {
          id: 'reminder-1',
          type: 'messagingNode',
          position: { x: 350, y: 100 },
          data: { label: '24h Reminder' }
        },
        {
          id: 'feedback-1',
          type: 'customNode',
          position: { x: 600, y: 100 },
          data: { label: 'Post-Appointment', icon: '📝', color: '#3b82f6' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'appointment-1',
          target: 'reminder-1',
          animated: true,
          label: '24h Before'
        },
        {
          id: 'e2-3',
          source: 'reminder-1',
          target: 'feedback-1',
          animated: true,
          label: 'After Appointment'
        }
      ]
    }
  },
  {
    id: 'document-workflow',
    name: 'Document Processing',
    description: 'Automate document generation and approvals',
    icon: <Clipboard className="h-8 w-8 text-indigo-500" />,
    color: 'bg-indigo-100',
    data: {
      nodes: [
        {
          id: 'doc-request',
          type: 'customNode',
          position: { x: 100, y: 100 },
          data: { label: 'Document Request', icon: '📋', color: '#6366f1' }
        },
        {
          id: 'doc-generation',
          type: 'customNode',
          position: { x: 350, y: 100 },
          data: { label: 'Generate Document', icon: '⚙️', color: '#6366f1' }
        },
        {
          id: 'doc-approval',
          type: 'customNode',
          position: { x: 600, y: 100 },
          data: { label: 'Approval Process', icon: '✓', color: '#6366f1' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'doc-request',
          target: 'doc-generation',
          animated: true,
          label: 'Auto-generate'
        },
        {
          id: 'e2-3',
          source: 'doc-generation',
          target: 'doc-approval',
          animated: true,
          label: 'Review'
        }
      ]
    }
  }
];

export default function WorkflowTemplatesPage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const handleUseTemplate = async (template) => {
    setIsCreating(template.id);
    try {
      // Create a new workflow based on the template
      const newWorkflow = {
        name: `${template.name} Template`,
        description: template.description,
        data: template.data
      };
      
      const { success, id } = await WorkflowService.saveWorkflow(newWorkflow);
      if (success && id) {
        toast.success("Workflow created from template");
        navigate(`/workflow?id=${id}`);
      } else {
        toast.error("Failed to create workflow from template");
      }
    } catch (error) {
      console.error("Error creating workflow from template:", error);
      toast.error("Failed to create workflow from template");
    } finally {
      setIsCreating(null);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold">Workflow Templates</h1>
          <Button 
            onClick={() => navigate("/workflow")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <WorkflowIcon className="h-4 w-4" /> 
            Create Custom Workflow
          </Button>
        </div>

        <GlassCard className="p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Choose a template to get started quickly</h2>
          <p className="text-gray-500 mb-6">
            These templates provide pre-configured workflows for common business processes. 
            Select a template to customize it for your specific needs.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTemplates.map((template) => (
              <Card key={template.id} className="border overflow-hidden">
                <CardHeader className={`${template.color} pb-2`}>
                  <div className="flex items-center gap-3">
                    {template.icon}
                    <CardTitle>{template.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-700">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Button 
                    onClick={() => handleUseTemplate(template)}
                    variant="default" 
                    className="w-full"
                    disabled={isCreating === template.id}
                  >
                    {isCreating === template.id ? (
                      "Creating..."
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Use This Template
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
