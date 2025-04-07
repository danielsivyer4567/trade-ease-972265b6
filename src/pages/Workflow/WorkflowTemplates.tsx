import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GlassCard } from '@/components/ui/GlassCard';
import { Workflow as WorkflowIcon, FileSpreadsheet, Users, MessageSquare, CreditCard, Calendar, Clipboard, Copy, Building, TrendingUp, HardHat, Truck, Wrench, FileCheck } from "lucide-react";
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
  },
  {
    id: 'large-project-management',
    name: 'Large Project Management',
    description: 'Comprehensive workflow for managing large-scale construction projects',
    icon: <Building className="h-8 w-8 text-slate-600" />,
    color: 'bg-slate-100',
    data: {
      nodes: [
        {
          id: 'project-start',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Project Initiation', icon: '🏗️', color: '#475569' }
        },
        {
          id: 'planning-phase',
          type: 'customNode',
          position: { x: 300, y: 50 },
          data: { label: 'Planning & Design', icon: '📐', color: '#475569' }
        },
        {
          id: 'resource-allocation',
          type: 'customNode',
          position: { x: 300, y: 250 },
          data: { label: 'Resource Allocation', icon: '🧰', color: '#475569' }
        },
        {
          id: 'permitting',
          type: 'customNode',
          position: { x: 500, y: 50 },
          data: { label: 'Permitting Process', icon: '📋', color: '#475569' }
        },
        {
          id: 'execution',
          type: 'customNode',
          position: { x: 500, y: 250 },
          data: { label: 'Execution Phase', icon: '🚜', color: '#475569' }
        },
        {
          id: 'inspections',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Inspections', icon: '🔍', color: '#475569' }
        },
        {
          id: 'project-close',
          type: 'customNode',
          position: { x: 900, y: 150 },
          data: { label: 'Project Closeout', icon: '✅', color: '#475569' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'project-start',
          target: 'planning-phase',
          animated: true,
          label: 'Start Planning'
        },
        {
          id: 'e1-3',
          source: 'project-start',
          target: 'resource-allocation',
          animated: true,
          label: 'Allocate Resources'
        },
        {
          id: 'e2-4',
          source: 'planning-phase',
          target: 'permitting',
          animated: true,
          label: 'Submit Plans'
        },
        {
          id: 'e3-5',
          source: 'resource-allocation',
          target: 'execution',
          animated: true,
          label: 'Begin Work'
        },
        {
          id: 'e4-6',
          source: 'permitting',
          target: 'inspections',
          animated: true,
          label: 'Schedule Inspections'
        },
        {
          id: 'e5-6',
          source: 'execution',
          target: 'inspections',
          animated: true,
          label: 'Request Inspections'
        },
        {
          id: 'e6-7',
          source: 'inspections',
          target: 'project-close',
          animated: true,
          label: 'Complete Project'
        }
      ]
    }
  },
  {
    id: 'safety-compliance',
    name: 'Safety & Compliance',
    description: 'Manage safety protocols, inspections, and regulatory compliance',
    icon: <HardHat className="h-8 w-8 text-yellow-500" />,
    color: 'bg-yellow-100',
    data: {
      nodes: [
        {
          id: 'safety-plan',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Safety Planning', icon: '📑', color: '#eab308' }
        },
        {
          id: 'training',
          type: 'customNode',
          position: { x: 300, y: 50 },
          data: { label: 'Safety Training', icon: '👷', color: '#eab308' }
        },
        {
          id: 'daily-checks',
          type: 'customNode',
          position: { x: 300, y: 250 },
          data: { label: 'Daily Safety Checks', icon: '✓', color: '#eab308' }
        },
        {
          id: 'incident-management',
          type: 'customNode',
          position: { x: 500, y: 150 },
          data: { label: 'Incident Management', icon: '⚠️', color: '#eab308' }
        },
        {
          id: 'compliance-audit',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Compliance Audit', icon: '🔍', color: '#eab308' }
        },
        {
          id: 'reporting',
          type: 'customNode',
          position: { x: 900, y: 150 },
          data: { label: 'Regulatory Reporting', icon: '📊', color: '#eab308' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'safety-plan',
          target: 'training',
          animated: true,
          label: 'Train Teams'
        },
        {
          id: 'e1-3',
          source: 'safety-plan',
          target: 'daily-checks',
          animated: true,
          label: 'Implement Checks'
        },
        {
          id: 'e3-4',
          source: 'daily-checks',
          target: 'incident-management',
          animated: true,
          label: 'Report Issues'
        },
        {
          id: 'e2-4',
          source: 'training',
          target: 'incident-management',
          animated: true,
          label: 'Response Actions'
        },
        {
          id: 'e4-5',
          source: 'incident-management',
          target: 'compliance-audit',
          animated: true,
          label: 'Audit Handling'
        },
        {
          id: 'e5-6',
          source: 'compliance-audit',
          target: 'reporting',
          animated: true,
          label: 'Generate Reports'
        }
      ]
    }
  },
  {
    id: 'subcontractor-management',
    name: 'Subcontractor Management',
    description: 'Track subcontractor onboarding, scheduling, and performance',
    icon: <Wrench className="h-8 w-8 text-blue-600" />,
    color: 'bg-blue-50',
    data: {
      nodes: [
        {
          id: 'sub-selection',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Subcontractor Selection', icon: '👥', color: '#2563eb' }
        },
        {
          id: 'onboarding',
          type: 'customNode',
          position: { x: 300, y: 150 },
          data: { label: 'Onboarding & Orientation', icon: '📋', color: '#2563eb' }
        },
        {
          id: 'work-orders',
          type: 'customNode',
          position: { x: 500, y: 150 },
          data: { label: 'Work Orders', icon: '📝', color: '#2563eb' }
        },
        {
          id: 'performance',
          type: 'customNode',
          position: { x: 700, y: 50 },
          data: { label: 'Performance Tracking', icon: '📊', color: '#2563eb' }
        },
        {
          id: 'payment',
          type: 'customNode',
          position: { x: 700, y: 250 },
          data: { label: 'Payment Processing', icon: '💰', color: '#2563eb' }
        },
        {
          id: 'evaluation',
          type: 'customNode',
          position: { x: 900, y: 150 },
          data: { label: 'Post-Job Evaluation', icon: '⭐', color: '#2563eb' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'sub-selection',
          target: 'onboarding',
          animated: true,
          label: 'Hire'
        },
        {
          id: 'e2-3',
          source: 'onboarding',
          target: 'work-orders',
          animated: true,
          label: 'Assign Work'
        },
        {
          id: 'e3-4',
          source: 'work-orders',
          target: 'performance',
          animated: true,
          label: 'Monitor'
        },
        {
          id: 'e3-5',
          source: 'work-orders',
          target: 'payment',
          animated: true,
          label: 'Invoice'
        },
        {
          id: 'e4-6',
          source: 'performance',
          target: 'evaluation',
          animated: true,
          label: 'Evaluate'
        },
        {
          id: 'e5-6',
          source: 'payment',
          target: 'evaluation',
          animated: true,
          label: 'Final Review'
        }
      ]
    }
  },
  {
    id: 'equipment-logistics',
    name: 'Equipment & Logistics',
    description: 'Manage heavy equipment scheduling, maintenance, and material deliveries',
    icon: <Truck className="h-8 w-8 text-orange-500" />,
    color: 'bg-orange-100',
    data: {
      nodes: [
        {
          id: 'resource-planning',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Resource Planning', icon: '📋', color: '#f97316' }
        },
        {
          id: 'equipment-scheduling',
          type: 'customNode',
          position: { x: 300, y: 50 },
          data: { label: 'Equipment Scheduling', icon: '🚜', color: '#f97316' }
        },
        {
          id: 'material-orders',
          type: 'customNode',
          position: { x: 300, y: 250 },
          data: { label: 'Material Orders', icon: '📦', color: '#f97316' }
        },
        {
          id: 'deliveries',
          type: 'customNode',
          position: { x: 500, y: 250 },
          data: { label: 'Delivery Coordination', icon: '🚚', color: '#f97316' }
        },
        {
          id: 'equipment-maintenance',
          type: 'customNode',
8 position: { x: 500, y: 50 },
          data: { label: 'Preventive Maintenance', icon: '🔧', color: '#f97316' }
        },
        {
          id: 'inventory-tracking',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Inventory Tracking', icon: '🧮', color: '#f97316' }
        },
        {
          id: 'resource-optimization',
          type: 'customNode',
          position: { x: 900, y: 150 },
          data: { label: 'Resource Optimization', icon: '📈', color: '#f97316' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'resource-planning',
          target: 'equipment-scheduling',
          animated: true,
          label: 'Schedule'
        },
        {
          id: 'e1-3',
          source: 'resource-planning',
          target: 'material-orders',
          animated: true,
          label: 'Order'
        },
        {
          id: 'e2-5',
          source: 'equipment-scheduling',
          target: 'equipment-maintenance',
          animated: true,
          label: 'Maintain'
        },
        {
          id: 'e3-4',
          source: 'material-orders',
          target: 'deliveries',
          animated: true,
          label: 'Deliver'
        },
        {
          id: 'e4-6',
          source: 'deliveries',
          target: 'inventory-tracking',
          animated: true,
          label: 'Track'
        },
        {
          id: 'e5-6',
          source: 'equipment-maintenance',
          target: 'inventory-tracking',
          animated: true,
          label: 'Update Inventory'
        },
        {
          id: 'e6-7',
          source: 'inventory-tracking',
          target: 'resource-optimization',
          animated: true,
          label: 'Optimize'
        }
      ]
    }
  },
  {
    id: 'quality-assurance',
    name: 'Quality Assurance',
    description: 'Implement quality control processes and inspections throughout the project',
    icon: <FileCheck className="h-8 w-8 text-emerald-500" />,
    color: 'bg-emerald-100',
    data: {
      nodes: [
        {
          id: 'standards-setup',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Quality Standards', icon: '📚', color: '#10b981' }
        },
        {
          id: 'training',
          type: 'customNode',
          position: { x: 300, y: 150 },
          data: { label: 'QA Training', icon: '🎓', color: '#10b981' }
        },
        {
          id: 'inspections',
          type: 'customNode',
          position: { x: 500, y: 50 },
          data: { label: 'Regular Inspections', icon: '🔍', color: '#10b981' }
        },
        {
          id: 'testing',
          type: 'customNode',
          position: { x: 500, y: 250 },
          data: { label: 'Materials Testing', icon: '🧪', color: '#10b981' }
        },
        {
          id: 'non-conformance',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Non-Conformance Reports', icon: '⚠️', color: '#10b981' }
        },
        {
          id: 'corrective-actions',
          type: 'customNode',
          position: { x: 900, y: 150 },
          data: { label: 'Corrective Actions', icon: '🔧', color: '#10b981' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'standards-setup',
          target: 'training',
          animated: true,
          label: 'Train Teams'
        },
        {
          id: 'e2-3',
          source: 'training',
          target: 'inspections',
          animated: true,
          label: 'Implement'
        },
        {
          id: 'e2-4',
          source: 'training',
          target: 'testing',
          animated: true,
          label: 'Test Materials'
        },
        {
          id: 'e3-5',
          source: 'inspections',
          target: 'non-conformance',
          animated: true,
          label: 'Report Issues'
        },
        {
          id: 'e4-5',
          source: 'testing',
          target: 'non-conformance',
          animated: true,
          label: 'Flag Problems'
        },
        {
          id: 'e5-6',
          source: 'non-conformance',
          target: 'corrective-actions',
          animated: true,
          label: 'Fix Issues'
        }
      ]
    }
  },
  {
    id: 'budget-cost-tracking',
    name: 'Budget & Cost Tracking',
    description: 'Monitor project expenses, budget variances, and financial forecasting',
    icon: <TrendingUp className="h-8 w-8 text-violet-500" />,
    color: 'bg-violet-100',
    data: {
      nodes: [
        {
          id: 'budget-setup',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Budget Setup', icon: '💼', color: '#8b5cf6' }
        },
        {
          id: 'cost-codes',
          type: 'customNode',
          position: { x: 300, y: 150 },
          data: { label: 'Cost Code Assignment', icon: '🏷️', color: '#8b5cf6' }
        },
        {
          id: 'purchase-orders',
          type: 'customNode',
          position: { x: 500, y: 50 },
          data: { label: 'Purchase Orders', icon: '📝', color: '#8b5cf6' }
        },
        {
          id: 'time-tracking',
          type: 'customNode',
          position: { x: 500, y: 250 },
          data: { label: 'Labor Tracking', icon: '⏱️', color: '#8b5cf6' }
        },
        {
          id: 'expense-approval',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Expense Approval', icon: '✅', color: '#8b5cf6' }
        },
        {
          id: 'variance-analysis',
          type: 'customNode',
          position: { x: 900, y: 50 },
          data: { label: 'Variance Analysis', icon: '📊', color: '#8b5cf6' }
        },
        {
          id: 'financial-reporting',
          type: 'customNode',
          position: { x: 900, y: 250 },
          data: { label: 'Financial Reporting', icon: '📈', color: '#8b5cf6' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'budget-setup',
          target: 'cost-codes',
          animated: true,
          label: 'Assign Codes'
        },
        {
          id: 'e2-3',
          source: 'cost-codes',
          target: 'purchase-orders',
          animated: true,
          label: 'Track Materials'
        },
        {
          id: 'e2-4',
          source: 'cost-codes',
          target: 'time-tracking',
          animated: true,
          label: 'Track Labor'
        },
        {
          id: 'e3-5',
          source: 'purchase-orders',
          target: 'expense-approval',
          animated: true,
          label: 'Approve Expenses'
        },
        {
          id: 'e4-5',
          source: 'time-tracking',
          target: 'expense-approval',
          animated: true,
          label: 'Approve Timesheets'
        },
        {
          id: 'e5-6',
          source: 'expense-approval',
          target: 'variance-analysis',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e5-7',
          source: 'expense-approval',
          target: 'financial-reporting',
          animated: true,
          label: 'Report'
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
