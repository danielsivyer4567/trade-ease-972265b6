
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Workflow as WorkflowIcon, 
  FileSpreadsheet, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Calendar, 
  Clipboard, 
  Copy, 
  Building, 
  TrendingUp, 
  HardHat, 
  Truck, 
  Wrench, 
  FileCheck,
  Receipt,
  Construction,
  Home,
  Building2,
  Hammer,
  Landmark,
  PenTool,
  Lightbulb,
  BarChart3
} from "lucide-react";
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
          position: { x: 500, y: 50 },
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
  },
  // New detailed workflow templates
  {
    id: 'contract-lifecycle',
    name: 'Contract Lifecycle Management',
    description: 'End-to-end contract workflow from initiation to renewal or termination',
    icon: <Receipt className="h-8 w-8 text-pink-500" />,
    color: 'bg-pink-100',
    data: {
      nodes: [
        {
          id: 'contract-request',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Contract Request', icon: '📝', color: '#ec4899' }
        },
        {
          id: 'template-selection',
          type: 'customNode',
          position: { x: 250, y: 50 },
          data: { label: 'Template Selection', icon: '📋', color: '#ec4899' }
        },
        {
          id: 'draft-creation',
          type: 'customNode',
          position: { x: 250, y: 250 },
          data: { label: 'Draft Creation', icon: '✏️', color: '#ec4899' }
        },
        {
          id: 'legal-review',
          type: 'customNode',
          position: { x: 400, y: 150 },
          data: { label: 'Legal Review', icon: '⚖️', color: '#ec4899' }
        },
        {
          id: 'stakeholder-review',
          type: 'customNode',
          position: { x: 550, y: 150 },
          data: { label: 'Stakeholder Review', icon: '👥', color: '#ec4899' }
        },
        {
          id: 'negotiation',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Negotiation', icon: '🤝', color: '#ec4899' }
        },
        {
          id: 'approvals',
          type: 'customNode',
          position: { x: 850, y: 150 },
          data: { label: 'Final Approvals', icon: '✅', color: '#ec4899' }
        },
        {
          id: 'signature',
          type: 'customNode',
          position: { x: 1000, y: 150 },
          data: { label: 'Signature Process', icon: '✍️', color: '#ec4899' }
        },
        {
          id: 'obligation-tracking',
          type: 'customNode',
          position: { x: 1150, y: 50 },
          data: { label: 'Obligation Tracking', icon: '📊', color: '#ec4899' }
        },
        {
          id: 'performance-monitoring',
          type: 'customNode',
          position: { x: 1150, y: 250 },
          data: { label: 'Performance Monitoring', icon: '📈', color: '#ec4899' }
        },
        {
          id: 'renewal-termination',
          type: 'customNode',
          position: { x: 1300, y: 150 },
          data: { label: 'Renewal/Termination', icon: '🔄', color: '#ec4899' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'contract-request',
          target: 'template-selection',
          animated: true,
          label: 'Select Type'
        },
        {
          id: 'e1-3',
          source: 'contract-request',
          target: 'draft-creation',
          animated: true,
          label: 'Custom Draft'
        },
        {
          id: 'e2-4',
          source: 'template-selection',
          target: 'legal-review',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e3-4',
          source: 'draft-creation',
          target: 'legal-review',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e4-5',
          source: 'legal-review',
          target: 'stakeholder-review',
          animated: true,
          label: 'Internal Review'
        },
        {
          id: 'e5-6',
          source: 'stakeholder-review',
          target: 'negotiation',
          animated: true,
          label: 'Negotiate Terms'
        },
        {
          id: 'e6-7',
          source: 'negotiation',
          target: 'approvals',
          animated: true,
          label: 'Seek Approval'
        },
        {
          id: 'e7-8',
          source: 'approvals',
          target: 'signature',
          animated: true,
          label: 'Sign'
        },
        {
          id: 'e8-9',
          source: 'signature',
          target: 'obligation-tracking',
          animated: true,
          label: 'Track'
        },
        {
          id: 'e8-10',
          source: 'signature',
          target: 'performance-monitoring',
          animated: true,
          label: 'Monitor'
        },
        {
          id: 'e9-11',
          source: 'obligation-tracking',
          target: 'renewal-termination',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e10-11',
          source: 'performance-monitoring',
          target: 'renewal-termination',
          animated: true,
          label: 'Evaluate'
        }
      ]
    }
  },
  {
    id: 'construction-mgmt-comprehensive',
    name: 'Comprehensive Construction Management',
    description: 'Full lifecycle workflow for large-scale construction projects with detailed phases',
    icon: <Construction className="h-8 w-8 text-stone-700" />,
    color: 'bg-stone-100',
    data: {
      nodes: [
        {
          id: 'project-conception',
          type: 'customNode',
          position: { x: 100, y: 300 },
          data: { label: 'Project Conception', icon: '💡', color: '#57534e' }
        },
        {
          id: 'feasibility-study',
          type: 'customNode',
          position: { x: 250, y: 150 },
          data: { label: 'Feasibility Study', icon: '🔍', color: '#57534e' }
        },
        {
          id: 'land-acquisition',
          type: 'customNode',
          position: { x: 250, y: 450 },
          data: { label: 'Land Acquisition', icon: '🏞️', color: '#57534e' }
        },
        {
          id: 'funding-finance',
          type: 'customNode',
          position: { x: 400, y: 300 },
          data: { label: 'Funding & Finance', icon: '💰', color: '#57534e' }
        },
        {
          id: 'design-concept',
          type: 'customNode',
          position: { x: 550, y: 150 },
          data: { label: 'Design Concept', icon: '✏️', color: '#57534e' }
        },
        {
          id: 'detailed-design',
          type: 'customNode',
          position: { x: 550, y: 300 },
          data: { label: 'Detailed Design', icon: '📐', color: '#57534e' }
        },
        {
          id: 'engineering',
          type: 'customNode',
          position: { x: 550, y: 450 },
          data: { label: 'Engineering Analysis', icon: '🔧', color: '#57534e' }
        },
        {
          id: 'permits-approvals',
          type: 'customNode',
          position: { x: 700, y: 300 },
          data: { label: 'Permits & Approvals', icon: '📋', color: '#57534e' }
        },
        {
          id: 'contractor-selection',
          type: 'customNode',
          position: { x: 850, y: 150 },
          data: { label: 'Contractor Selection', icon: '👷', color: '#57534e' }
        },
        {
          id: 'procurement',
          type: 'customNode',
          position: { x: 850, y: 450 },
          data: { label: 'Materials Procurement', icon: '📦', color: '#57534e' }
        },
        {
          id: 'site-preparation',
          type: 'customNode',
          position: { x: 1000, y: 300 },
          data: { label: 'Site Preparation', icon: '🚜', color: '#57534e' }
        },
        {
          id: 'foundation',
          type: 'customNode',
          position: { x: 1150, y: 150 },
          data: { label: 'Foundation Work', icon: '🏗️', color: '#57534e' }
        },
        {
          id: 'structure',
          type: 'customNode',
          position: { x: 1150, y: 300 },
          data: { label: 'Structural Work', icon: '🏢', color: '#57534e' }
        },
        {
          id: 'mep-systems',
          type: 'customNode',
          position: { x: 1150, y: 450 },
          data: { label: 'MEP Systems', icon: '⚡', color: '#57534e' }
        },
        {
          id: 'interior-finishes',
          type: 'customNode',
          position: { x: 1300, y: 300 },
          data: { label: 'Interior Finishes', icon: '🎨', color: '#57534e' }
        },
        {
          id: 'quality-inspections',
          type: 'customNode',
          position: { x: 1450, y: 150 },
          data: { label: 'Quality Inspections', icon: '✅', color: '#57534e' }
        },
        {
          id: 'testing-commissioning',
          type: 'customNode',
          position: { x: 1450, y: 450 },
          data: { label: 'Testing & Commissioning', icon: '🧪', color: '#57534e' }
        },
        {
          id: 'handover',
          type: 'customNode',
          position: { x: 1600, y: 300 },
          data: { label: 'Project Handover', icon: '🔑', color: '#57534e' }
        },
        {
          id: 'warranty-period',
          type: 'customNode',
          position: { x: 1750, y: 300 },
          data: { label: 'Warranty Period', icon: '⏳', color: '#57534e' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'project-conception',
          target: 'feasibility-study',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e1-3',
          source: 'project-conception',
          target: 'land-acquisition',
          animated: true,
          label: 'Acquire'
        },
        {
          id: 'e2-4',
          source: 'feasibility-study',
          target: 'funding-finance',
          animated: true,
          label: 'Secure Funds'
        },
        {
          id: 'e3-4',
          source: 'land-acquisition',
          target: 'funding-finance',
          animated: true,
          label: 'Budget'
        },
        {
          id: 'e4-5',
          source: 'funding-finance',
          target: 'design-concept',
          animated: true,
          label: 'Begin Design'
        },
        {
          id: 'e5-6',
          source: 'design-concept',
          target: 'detailed-design',
          animated: true,
          label: 'Detail'
        },
        {
          id: 'e6-7',
          source: 'detailed-design',
          target: 'engineering',
          animated: true,
          label: 'Engineer'
        },
        {
          id: 'e7-8',
          source: 'engineering',
          target: 'permits-approvals',
          animated: true,
          label: 'Submit'
        },
        {
          id: 'e8-9',
          source: 'permits-approvals',
          target: 'contractor-selection',
          animated: true,
          label: 'Select'
        },
        {
          id: 'e8-10',
          source: 'permits-approvals',
          target: 'procurement',
          animated: true,
          label: 'Order'
        },
        {
          id: 'e9-11',
          source: 'contractor-selection',
          target: 'site-preparation',
          animated: true,
          label: 'Begin Work'
        },
        {
          id: 'e10-11',
          source: 'procurement',
          target: 'site-preparation',
          animated: true,
          label: 'Deliver'
        },
        {
          id: 'e11-12',
          source: 'site-preparation',
          target: 'foundation',
          animated: true,
          label: 'Construct'
        },
        {
          id: 'e12-13',
          source: 'foundation',
          target: 'structure',
          animated: true,
          label: 'Build'
        },
        {
          id: 'e13-14',
          source: 'structure',
          target: 'mep-systems',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e14-15',
          source: 'mep-systems',
          target: 'interior-finishes',
          animated: true,
          label: 'Finish'
        },
        {
          id: 'e15-16',
          source: 'interior-finishes',
          target: 'quality-inspections',
          animated: true,
          label: 'Inspect'
        },
        {
          id: 'e15-17',
          source: 'interior-finishes',
          target: 'testing-commissioning',
          animated: true,
          label: 'Test'
        },
        {
          id: 'e16-18',
          source: 'quality-inspections',
          target: 'handover',
          animated: true,
          label: 'Complete'
        },
        {
          id: 'e17-18',
          source: 'testing-commissioning',
          target: 'handover',
          animated: true,
          label: 'Approve'
        },
        {
          id: 'e18-19',
          source: 'handover',
          target: 'warranty-period',
          animated: true,
          label: 'Support'
        }
      ]
    }
  },
  {
    id: 'residential-construction',
    name: 'Residential Construction',
    description: 'Streamlined workflow for residential building projects from concept to completion',
    icon: <Home className="h-8 w-8 text-cyan-600" />,
    color: 'bg-cyan-100',
    data: {
      nodes: [
        {
          id: 'client-consultation',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Client Consultation', icon: '🤝', color: '#0891b2' }
        },
        {
          id: 'site-assessment',
          type: 'customNode',
          position: { x: 250, y: 50 },
          data: { label: 'Site Assessment', icon: '🏞️', color: '#0891b2' }
        },
        {
          id: 'design-development',
          type: 'customNode',
          position: { x: 250, y: 250 },
          data: { label: 'Design Development', icon: '📐', color: '#0891b2' }
        },
        {
          id: 'cost-estimation',
          type: 'customNode',
          position: { x: 400, y: 150 },
          data: { label: 'Cost Estimation', icon: '💲', color: '#0891b2' }
        },
        {
          id: 'contract-signing',
          type: 'customNode',
          position: { x: 550, y: 150 },
          data: { label: 'Contract Signing', icon: '📝', color: '#0891b2' }
        },
        {
          id: 'permits-approvals',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Permits & Approvals', icon: '📋', color: '#0891b2' }
        },
        {
          id: 'demo-site-prep',
          type: 'customNode',
          position: { x: 850, y: 50 },
          data: { label: 'Demolition & Site Prep', icon: '🏗️', color: '#0891b2' }
        },
        {
          id: 'foundation',
          type: 'customNode',
          position: { x: 850, y: 250 },
          data: { label: 'Foundation', icon: '🧱', color: '#0891b2' }
        },
        {
          id: 'framing',
          type: 'customNode',
          position: { x: 1000, y: 50 },
          data: { label: 'Framing', icon: '🔨', color: '#0891b2' }
        },
        {
          id: 'roofing',
          type: 'customNode',
          position: { x: 1000, y: 250 },
          data: { label: 'Roofing', icon: '🏠', color: '#0891b2' }
        },
        {
          id: 'plumbing-hvac',
          type: 'customNode',
          position: { x: 1150, y: 50 },
          data: { label: 'Plumbing & HVAC', icon: '🚿', color: '#0891b2' }
        },
        {
          id: 'electrical',
          type: 'customNode',
          position: { x: 1150, y: 250 },
          data: { label: 'Electrical', icon: '⚡', color: '#0891b2' }
        },
        {
          id: 'insulation-drywall',
          type: 'customNode',
          position: { x: 1300, y: 150 },
          data: { label: 'Insulation & Drywall', icon: '🧱', color: '#0891b2' }
        },
        {
          id: 'interior-finishes',
          type: 'customNode',
          position: { x: 1450, y: 150 },
          data: { label: 'Interior Finishes', icon: '🎨', color: '#0891b2' }
        },
        {
          id: 'flooring-trim',
          type: 'customNode',
          position: { x: 1600, y: 50 },
          data: { label: 'Flooring & Trim', icon: '🪵', color: '#0891b2' }
        },
        {
          id: 'fixtures-appliances',
          type: 'customNode',
          position: { x: 1600, y: 250 },
          data: { label: 'Fixtures & Appliances', icon: '🚽', color: '#0891b2' }
        },
        {
          id: 'final-inspection',
          type: 'customNode',
          position: { x: 1750, y: 150 },
          data: { label: 'Final Inspection', icon: '✅', color: '#0891b2' }
        },
        {
          id: 'client-walkthrough',
          type: 'customNode',
          position: { x: 1900, y: 150 },
          data: { label: 'Client Walkthrough', icon: '👥', color: '#0891b2' }
        },
        {
          id: 'final-handover',
          type: 'customNode',
          position: { x: 2050, y: 150 },
          data: { label: 'Final Handover', icon: '🔑', color: '#0891b2' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'client-consultation',
          target: 'site-assessment',
          animated: true,
          label: 'Assess'
        },
        {
          id: 'e1-3',
          source: 'client-consultation',
          target: 'design-development',
          animated: true,
          label: 'Design'
        },
        {
          id: 'e2-4',
          source: 'site-assessment',
          target: 'cost-estimation',
          animated: true,
          label: 'Price'
        },
        {
          id: 'e3-4',
          source: 'design-development',
          target: 'cost-estimation',
          animated: true,
          label: 'Estimate'
        },
        {
          id: 'e4-5',
          source: 'cost-estimation',
          target: 'contract-signing',
          animated: true,
          label: 'Agree'
        },
        {
          id: 'e5-6',
          source: 'contract-signing',
          target: 'permits-approvals',
          animated: true,
          label: 'Apply'
        },
        {
          id: 'e6-7',
          source: 'permits-approvals',
          target: 'demo-site-prep',
          animated: true,
          label: 'Prepare'
        },
        {
          id: 'e6-8',
          source: 'permits-approvals',
          target: 'foundation',
          animated: true,
          label: 'Start'
        },
        {
          id: 'e8-9',
          source: 'foundation',
          target: 'framing',
          animated: true,
          label: 'Build'
        },
        {
          id: 'e8-10',
          source: 'foundation',
          target: 'roofing',
          animated: true,
          label: 'Cover'
        },
        {
          id: 'e9-11',
          source: 'framing',
          target: 'plumbing-hvac',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e9-12',
          source: 'framing',
          target: 'electrical',
          animated: true,
          label: 'Wire'
        },
        {
          id: 'e11-13',
          source: 'plumbing-hvac',
          target: 'insulation-drywall',
          animated: true,
          label: 'Close'
        },
        {
          id: 'e12-13',
          source: 'electrical',
          target: 'insulation-drywall',
          animated: true,
          label: 'Close'
        },
        {
          id: 'e13-14',
          source: 'insulation-drywall',
          target: 'interior-finishes',
          animated: true,
          label: 'Finish'
        },
        {
          id: 'e14-15',
          source: 'interior-finishes',
          target: 'flooring-trim',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e14-16',
          source: 'interior-finishes',
          target: 'fixtures-appliances',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e15-17',
          source: 'flooring-trim',
          target: 'final-inspection',
          animated: true,
          label: 'Inspect'
        },
        {
          id: 'e16-17',
          source: 'fixtures-appliances',
          target: 'final-inspection',
          animated: true,
          label: 'Inspect'
        },
        {
          id: 'e17-18',
          source: 'final-inspection',
          target: 'client-walkthrough',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e18-19',
          source: 'client-walkthrough',
          target: 'final-handover',
          animated: true,
          label: 'Complete'
        }
      ]
    }
  },
  {
    id: 'commercial-construction',
    name: 'Commercial Construction',
    description: 'Comprehensive workflow designed for large commercial construction projects',
    icon: <Building2 className="h-8 w-8 text-gray-700" />,
    color: 'bg-gray-100',
    data: {
      nodes: [
        {
          id: 'project-initiation',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Project Initiation', icon: '🏢', color: '#374151' }
        },
        {
          id: 'feasibility-study',
          type: 'customNode',
          position: { x: 250, y: 50 },
          data: { label: 'Feasibility Study', icon: '📊', color: '#374151' }
        },
        {
          id: 'site-selection',
          type: 'customNode',
          position: { x: 250, y: 250 },
          data: { label: 'Site Selection', icon: '🗺️', color: '#374151' }
        },
        {
          id: 'stakeholder-engagement',
          type: 'customNode',
          position: { x: 400, y: 150 },
          data: { label: 'Stakeholder Engagement', icon: '👥', color: '#374151' }
        },
        {
          id: 'conceptual-design',
          type: 'customNode',
          position: { x: 550, y: 50 },
          data: { label: 'Conceptual Design', icon: '💡', color: '#374151' }
        },
        {
          id: 'budget-development',
          type: 'customNode',
          position: { x: 550, y: 250 },
          data: { label: 'Budget Development', icon: '💰', color: '#374151' }
        },
        {
          id: 'schematic-design',
          type: 'customNode',
          position: { x: 700, y: 50 },
          data: { label: 'Schematic Design', icon: '📝', color: '#374151' }
        },
        {
          id: 'design-development',
          type: 'customNode',
          position: { x: 700, y: 250 },
          data: { label: 'Design Development', icon: '📐', color: '#374151' }
        },
        {
          id: 'construction-documents',
          type: 'customNode',
          position: { x: 850, y: 150 },
          data: { label: 'Construction Documents', icon: '📄', color: '#374151' }
        },
        {
          id: 'regulatory-approvals',
          type: 'customNode',
          position: { x: 1000, y: 50 },
          data: { label: 'Regulatory Approvals', icon: '⚖️', color: '#374151' }
        },
        {
          id: 'bidding-procurement',
          type: 'customNode',
          position: { x: 1000, y: 250 },
          data: { label: 'Bidding & Procurement', icon: '📊', color: '#374151' }
        },
        {
          id: 'contracts-legals',
          type: 'customNode',
          position: { x: 1150, y: 150 },
          data: { label: 'Contracts & Legal', icon: '📜', color: '#374151' }
        },
        {
          id: 'pre-construction',
          type: 'customNode',
          position: { x: 1300, y: 150 },
          data: { label: 'Pre-Construction', icon: '⚙️', color: '#374151' }
        },
        {
          id: 'site-preparation',
          type: 'customNode',
          position: { x: 1450, y: 50 },
          data: { label: 'Site Preparation', icon: '🚜', color: '#374151' }
        },
        {
          id: 'foundation-structural',
          type: 'customNode',
          position: { x: 1450, y: 250 },
          data: { label: 'Foundation & Structural', icon: '🏗️', color: '#374151' }
        },
        {
          id: 'building-envelope',
          type: 'customNode',
          position: { x: 1600, y: 50 },
          data: { label: 'Building Envelope', icon: '🧱', color: '#374151' }
        },
        {
          id: 'mep-systems',
          type: 'customNode',
          position: { x: 1600, y: 250 },
          data: { label: 'MEP Systems', icon: '⚡', color: '#374151' }
        },
        {
          id: 'interior-fitout',
          type: 'customNode',
          position: { x: 1750, y: 150 },
          data: { label: 'Interior Fitout', icon: '🎨', color: '#374151' }
        },
        {
          id: 'testing-commissioning',
          type: 'customNode',
          position: { x: 1900, y: 150 },
          data: { label: 'Testing & Commissioning', icon: '🧪', color: '#374151' }
        },
        {
          id: 'substantial-completion',
          type: 'customNode',
          position: { x: 2050, y: 50 },
          data: { label: 'Substantial Completion', icon: '✔️', color: '#374151' }
        },
        {
          id: 'final-inspections',
          type: 'customNode',
          position: { x: 2050, y: 250 },
          data: { label: 'Final Inspections', icon: '🔍', color: '#374151' }
        },
        {
          id: 'project-closeout',
          type: 'customNode',
          position: { x: 2200, y: 150 },
          data: { label: 'Project Closeout', icon: '🏁', color: '#374151' }
        },
        {
          id: 'warranty-maintenance',
          type: 'customNode',
          position: { x: 2350, y: 150 },
          data: { label: 'Warranty & Maintenance', icon: '🔧', color: '#374151' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'project-initiation',
          target: 'feasibility-study',
          animated: true,
          label: 'Evaluate'
        },
        {
          id: 'e1-3',
          source: 'project-initiation',
          target: 'site-selection',
          animated: true,
          label: 'Select'
        },
        {
          id: 'e2-4',
          source: 'feasibility-study',
          target: 'stakeholder-engagement',
          animated: true,
          label: 'Engage'
        },
        {
          id: 'e3-4',
          source: 'site-selection',
          target: 'stakeholder-engagement',
          animated: true,
          label: 'Consult'
        },
        {
          id: 'e4-5',
          source: 'stakeholder-engagement',
          target: 'conceptual-design',
          animated: true,
          label: 'Conceive'
        },
        {
          id: 'e4-6',
          source: 'stakeholder-engagement',
          target: 'budget-development',
          animated: true,
          label: 'Budget'
        },
        {
          id: 'e5-7',
          source: 'conceptual-design',
          target: 'schematic-design',
          animated: true,
          label: 'Develop'
        },
        {
          id: 'e6-8',
          source: 'budget-development',
          target: 'design-development',
          animated: true,
          label: 'Design'
        },
        {
          id: 'e7-9',
          source: 'schematic-design',
          target: 'construction-documents',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e8-9',
          source: 'design-development',
          target: 'construction-documents',
          animated: true,
          label: 'Detail'
        },
        {
          id: 'e9-10',
          source: 'construction-documents',
          target: 'regulatory-approvals',
          animated: true,
          label: 'Approve'
        },
        {
          id: 'e9-11',
          source: 'construction-documents',
          target: 'bidding-procurement',
          animated: true,
          label: 'Bid'
        },
        {
          id: 'e10-12',
          source: 'regulatory-approvals',
          target: 'contracts-legals',
          animated: true,
          label: 'Legalize'
        },
        {
          id: 'e11-12',
          source: 'bidding-procurement',
          target: 'contracts-legals',
          animated: true,
          label: 'Contract'
        },
        {
          id: 'e12-13',
          source: 'contracts-legals',
          target: 'pre-construction',
          animated: true,
          label: 'Plan'
        },
        {
          id: 'e13-14',
          source: 'pre-construction',
          target: 'site-preparation',
          animated: true,
          label: 'Prep Site'
        },
        {
          id: 'e13-15',
          source: 'pre-construction',
          target: 'foundation-structural',
          animated: true,
          label: 'Begin Structure'
        },
        {
          id: 'e15-16',
          source: 'foundation-structural',
          target: 'building-envelope',
          animated: true,
          label: 'Enclose'
        },
        {
          id: 'e15-17',
          source: 'foundation-structural',
          target: 'mep-systems',
          animated: true,
          label: 'Install Systems'
        },
        {
          id: 'e16-18',
          source: 'building-envelope',
          target: 'interior-fitout',
          animated: true,
          label: 'Finish'
        },
        {
          id: 'e17-18',
          source: 'mep-systems',
          target: 'interior-fitout',
          animated: true,
          label: 'Finish'
        },
        {
          id: 'e18-19',
          source: 'interior-fitout',
          target: 'testing-commissioning',
          animated: true,
          label: 'Test'
        },
        {
          id: 'e19-20',
          source: 'testing-commissioning',
          target: 'substantial-completion',
          animated: true,
          label: 'Complete'
        },
        {
          id: 'e19-21',
          source: 'testing-commissioning',
          target: 'final-inspections',
          animated: true,
          label: 'Inspect'
        },
        {
          id: 'e20-22',
          source: 'substantial-completion',
          target: 'project-closeout',
          animated: true,
          label: 'Close'
        },
        {
          id: 'e21-22',
          source: 'final-inspections',
          target: 'project-closeout',
          animated: true,
          label: 'Approve'
        },
        {
          id: 'e22-23',
          source: 'project-closeout',
          target: 'warranty-maintenance',
          animated: true,
          label: 'Maintain'
        }
      ]
    }
  },
  {
    id: 'renovation-workflow',
    name: 'Renovation & Remodeling',
    description: 'Specialized workflow for renovation projects with phased approach',
    icon: <Hammer className="h-8 w-8 text-amber-700" />,
    color: 'bg-amber-100',
    data: {
      nodes: [
        {
          id: 'initial-consultation',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Initial Consultation', icon: '💬', color: '#b45309' }
        },
        {
          id: 'property-assessment',
          type: 'customNode',
          position: { x: 250, y: 150 },
          data: { label: 'Property Assessment', icon: '🏠', color: '#b45309' }
        },
        {
          id: 'concept-development',
          type: 'customNode',
          position: { x: 400, y: 50 },
          data: { label: 'Concept Development', icon: '💡', color: '#b45309' }
        },
        {
          id: 'budget-planning',
          type: 'customNode',
          position: { x: 400, y: 250 },
          data: { label: 'Budget Planning', icon: '💰', color: '#b45309' }
        },
        {
          id: 'design-renderings',
          type: 'customNode',
          position: { x: 550, y: 50 },
          data: { label: 'Design Renderings', icon: '🎨', color: '#b45309' }
        },
        {
          id: 'material-selection',
          type: 'customNode',
          position: { x: 550, y: 250 },
          data: { label: 'Material Selection', icon: '🧱', color: '#b45309' }
        },
        {
          id: 'contract-approval',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Contract Approval', icon: '📝', color: '#b45309' }
        },
        {
          id: 'permits-planning',
          type: 'customNode',
          position: { x: 850, y: 150 },
          data: { label: 'Permits & Planning', icon: '📋', color: '#b45309' }
        },
        {
          id: 'pre-construction-survey',
          type: 'customNode',
          position: { x: 1000, y: 150 },
          data: { label: 'Pre-Construction Survey', icon: '📏', color: '#b45309' }
        },
        {
          id: 'temporary-facilities',
          type: 'customNode',
          position: { x: 1150, y: 50 },
          data: { label: 'Temporary Facilities', icon: '🚪', color: '#b45309' }
        },
        {
          id: 'demolition',
          type: 'customNode',
          position: { x: 1150, y: 250 },
          data: { label: 'Demolition Phase', icon: '🔨', color: '#b45309' }
        },
        {
          id: 'structural-changes',
          type: 'customNode',
          position: { x: 1300, y: 50 },
          data: { label: 'Structural Changes', icon: '🏗️', color: '#b45309' }
        },
        {
          id: 'plumbing-electrical',
          type: 'customNode',
          position: { x: 1300, y: 250 },
          data: { label: 'Plumbing & Electrical', icon: '⚡', color: '#b45309' }
        },
        {
          id: 'insulation-drywall',
          type: 'customNode',
          position: { x: 1450, y: 150 },
          data: { label: 'Insulation & Drywall', icon: '🧱', color: '#b45309' }
        },
        {
          id: 'flooring-installation',
          type: 'customNode',
          position: { x: 1600, y: 50 },
          data: { label: 'Flooring Installation', icon: '🪵', color: '#b45309' }
        },
        {
          id: 'cabinetry-fixtures',
          type: 'customNode',
          position: { x: 1600, y: 250 },
          data: { label: 'Cabinetry & Fixtures', icon: '🚿', color: '#b45309' }
        },
        {
          id: 'painting-finishes',
          type: 'customNode',
          position: { x: 1750, y: 150 },
          data: { label: 'Painting & Finishes', icon: '🖌️', color: '#b45309' }
        },
        {
          id: 'finish-carpentry',
          type: 'customNode',
          position: { x: 1900, y: 50 },
          data: { label: 'Finish Carpentry', icon: '🪚', color: '#b45309' }
        },
        {
          id: 'appliance-installation',
          type: 'customNode',
          position: { x: 1900, y: 250 },
          data: { label: 'Appliance Installation', icon: '🍳', color: '#b45309' }
        },
        {
          id: 'cleanup-debris',
          type: 'customNode',
          position: { x: 2050, y: 150 },
          data: { label: 'Cleanup & Debris', icon: '🧹', color: '#b45309' }
        },
        {
          id: 'final-inspection',
          type: 'customNode',
          position: { x: 2200, y: 150 },
          data: { label: 'Final Inspection', icon: '✅', color: '#b45309' }
        },
        {
          id: 'client-walkthrough',
          type: 'customNode',
          position: { x: 2350, y: 150 },
          data: { label: 'Client Walkthrough', icon: '👥', color: '#b45309' }
        },
        {
          id: 'punch-list',
          type: 'customNode',
          position: { x: 2500, y: 150 },
          data: { label: 'Punch List Completion', icon: '📋', color: '#b45309' }
        },
        {
          id: 'final-payment',
          type: 'customNode',
          position: { x: 2650, y: 150 },
          data: { label: 'Final Payment', icon: '💳', color: '#b45309' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'initial-consultation',
          target: 'property-assessment',
          animated: true,
          label: 'Assess'
        },
        {
          id: 'e2-3',
          source: 'property-assessment',
          target: 'concept-development',
          animated: true,
          label: 'Conceive'
        },
        {
          id: 'e2-4',
          source: 'property-assessment',
          target: 'budget-planning',
          animated: true,
          label: 'Budget'
        },
        {
          id: 'e3-5',
          source: 'concept-development',
          target: 'design-renderings',
          animated: true,
          label: 'Design'
        },
        {
          id: 'e4-6',
          source: 'budget-planning',
          target: 'material-selection',
          animated: true,
          label: 'Select'
        },
        {
          id: 'e5-7',
          source: 'design-renderings',
          target: 'contract-approval',
          animated: true,
          label: 'Approve'
        },
        {
          id: 'e6-7',
          source: 'material-selection',
          target: 'contract-approval',
          animated: true,
          label: 'Finalize'
        },
        {
          id: 'e7-8',
          source: 'contract-approval',
          target: 'permits-planning',
          animated: true,
          label: 'Permit'
        },
        {
          id: 'e8-9',
          source: 'permits-planning',
          target: 'pre-construction-survey',
          animated: true,
          label: 'Survey'
        },
        {
          id: 'e9-10',
          source: 'pre-construction-survey',
          target: 'temporary-facilities',
          animated: true,
          label: 'Setup'
        },
        {
          id: 'e9-11',
          source: 'pre-construction-survey',
          target: 'demolition',
          animated: true,
          label: 'Demo'
        },
        {
          id: 'e11-12',
          source: 'demolition',
          target: 'structural-changes',
          animated: true,
          label: 'Rebuild'
        },
        {
          id: 'e11-13',
          source: 'demolition',
          target: 'plumbing-electrical',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e12-14',
          source: 'structural-changes',
          target: 'insulation-drywall',
          animated: true,
          label: 'Insulate'
        },
        {
          id: 'e13-14',
          source: 'plumbing-electrical',
          target: 'insulation-drywall',
          animated: true,
          label: 'Cover'
        },
        {
          id: 'e14-15',
          source: 'insulation-drywall',
          target: 'flooring-installation',
          animated: true,
          label: 'Floor'
        },
        {
          id: 'e14-16',
          source: 'insulation-drywall',
          target: 'cabinetry-fixtures',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e15-17',
          source: 'flooring-installation',
          target: 'painting-finishes',
          animated: true,
          label: 'Paint'
        },
        {
          id: 'e16-17',
          source: 'cabinetry-fixtures',
          target: 'painting-finishes',
          animated: true,
          label: 'Finish'
        },
        {
          id: 'e17-18',
          source: 'painting-finishes',
          target: 'finish-carpentry',
          animated: true,
          label: 'Trim'
        },
        {
          id: 'e17-19',
          source: 'painting-finishes',
          target: 'appliance-installation',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e18-20',
          source: 'finish-carpentry',
          target: 'cleanup-debris',
          animated: true,
          label: 'Clean'
        },
        {
          id: 'e19-20',
          source: 'appliance-installation',
          target: 'cleanup-debris',
          animated: true,
          label: 'Clean'
        },
        {
          id: 'e20-21',
          source: 'cleanup-debris',
          target: 'final-inspection',
          animated: true,
          label: 'Inspect'
        },
        {
          id: 'e21-22',
          source: 'final-inspection',
          target: 'client-walkthrough',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e22-23',
          source: 'client-walkthrough',
          target: 'punch-list',
          animated: true,
          label: 'Complete'
        },
        {
          id: 'e23-24',
          source: 'punch-list',
          target: 'final-payment',
          animated: true,
          label: 'Pay'
        }
      ]
    }
  },
  {
    id: 'industrial-construction',
    name: 'Industrial Construction',
    description: 'Specialized workflow for industrial facilities, factories, and infrastructure projects',
    icon: <Landmark className="h-8 w-8 text-blue-800" />,
    color: 'bg-blue-100',
    data: {
      nodes: [
        {
          id: 'project-inception',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Project Inception', icon: '🏭', color: '#1e40af' }
        },
        {
          id: 'site-analysis',
          type: 'customNode',
          position: { x: 250, y: 50 },
          data: { label: 'Site Analysis', icon: '🗺️', color: '#1e40af' }
        },
        {
          id: 'environmental-impact',
          type: 'customNode',
          position: { x: 250, y: 250 },
          data: { label: 'Environmental Impact', icon: '🌳', color: '#1e40af' }
        },
        {
          id: 'stakeholder-consultations',
          type: 'customNode',
          position: { x: 400, y: 150 },
          data: { label: 'Stakeholder Consultations', icon: '👥', color: '#1e40af' }
        },
        {
          id: 'process-engineering',
          type: 'customNode',
          position: { x: 550, y: 50 },
          data: { label: 'Process Engineering', icon: '⚙️', color: '#1e40af' }
        },
        {
          id: 'facility-requirements',
          type: 'customNode',
          position: { x: 550, y: 250 },
          data: { label: 'Facility Requirements', icon: '📋', color: '#1e40af' }
        },
        {
          id: 'safety-hazard-analysis',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'Safety & Hazard Analysis', icon: '⚠️', color: '#1e40af' }
        },
        {
          id: 'conceptual-engineering',
          type: 'customNode',
          position: { x: 850, y: 50 },
          data: { label: 'Conceptual Engineering', icon: '📐', color: '#1e40af' }
        },
        {
          id: 'scope-definition',
          type: 'customNode',
          position: { x: 850, y: 250 },
          data: { label: 'Scope Definition', icon: '🔍', color: '#1e40af' }
        },
        {
          id: 'front-end-engineering',
          type: 'customNode',
          position: { x: 1000, y: 150 },
          data: { label: 'Front-End Engineering', icon: '📝', color: '#1e40af' }
        },
        {
          id: 'detailed-design',
          type: 'customNode',
          position: { x: 1150, y: 150 },
          data: { label: 'Detailed Design', icon: '📊', color: '#1e40af' }
        },
        {
          id: 'regulatory-compliance',
          type: 'customNode',
          position: { x: 1300, y: 50 },
          data: { label: 'Regulatory Compliance', icon: '⚖️', color: '#1e40af' }
        },
        {
          id: 'procurement-strategy',
          type: 'customNode',
          position: { x: 1300, y: 250 },
          data: { label: 'Procurement Strategy', icon: '🛒', color: '#1e40af' }
        },
        {
          id: 'long-lead-items',
          type: 'customNode',
          position: { x: 1450, y: 50 },
          data: { label: 'Long-Lead Items', icon: '⏳', color: '#1e40af' }
        },
        {
          id: 'vendor-evaluation',
          type: 'customNode',
          position: { x: 1450, y: 250 },
          data: { label: 'Vendor Evaluation', icon: '🔎', color: '#1e40af' }
        },
        {
          id: 'site-mobilization',
          type: 'customNode',
          position: { x: 1600, y: 150 },
          data: { label: 'Site Mobilization', icon: '🚛', color: '#1e40af' }
        },
        {
          id: 'earthworks-foundations',
          type: 'customNode',
          position: { x: 1750, y: 50 },
          data: { label: 'Earthworks & Foundations', icon: '🏗️', color: '#1e40af' }
        },
        {
          id: 'underground-utilities',
          type: 'customNode',
          position: { x: 1750, y: 250 },
          data: { label: 'Underground Utilities', icon: '🔌', color: '#1e40af' }
        },
        {
          id: 'steel-erection',
          type: 'customNode',
          position: { x: 1900, y: 50 },
          data: { label: 'Steel Erection', icon: '🔨', color: '#1e40af' }
        },
        {
          id: 'building-envelope',
          type: 'customNode',
          position: { x: 1900, y: 250 },
          data: { label: 'Building Envelope', icon: '🏢', color: '#1e40af' }
        },
        {
          id: 'process-equipment',
          type: 'customNode',
          position: { x: 2050, y: 50 },
          data: { label: 'Process Equipment', icon: '⚙️', color: '#1e40af' }
        },
        {
          id: 'mechanical-systems',
          type: 'customNode',
          position: { x: 2050, y: 250 },
          data: { label: 'Mechanical Systems', icon: '🔧', color: '#1e40af' }
        },
        {
          id: 'electrical-instrumentation',
          type: 'customNode',
          position: { x: 2200, y: 150 },
          data: { label: 'Electrical & Instrumentation', icon: '⚡', color: '#1e40af' }
        },
        {
          id: 'testing-commissioning',
          type: 'customNode',
          position: { x: 2350, y: 150 },
          data: { label: 'Testing & Commissioning', icon: '🧪', color: '#1e40af' }
        },
        {
          id: 'pre-startup-review',
          type: 'customNode',
          position: { x: 2500, y: 50 },
          data: { label: 'Pre-Startup Review', icon: '✅', color: '#1e40af' }
        },
        {
          id: 'operational-readiness',
          type: 'customNode',
          position: { x: 2500, y: 250 },
          data: { label: 'Operational Readiness', icon: '🏁', color: '#1e40af' }
        },
        {
          id: 'startup-handover',
          type: 'customNode',
          position: { x: 2650, y: 150 },
          data: { label: 'Startup & Handover', icon: '🔑', color: '#1e40af' }
        },
        {
          id: 'documentation-training',
          type: 'customNode',
          position: { x: 2800, y: 150 },
          data: { label: 'Documentation & Training', icon: '📚', color: '#1e40af' }
        },
        {
          id: 'performance-verification',
          type: 'customNode',
          position: { x: 2950, y: 150 },
          data: { label: 'Performance Verification', icon: '📊', color: '#1e40af' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'project-inception',
          target: 'site-analysis',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e1-3',
          source: 'project-inception',
          target: 'environmental-impact',
          animated: true,
          label: 'Assess'
        },
        {
          id: 'e2-4',
          source: 'site-analysis',
          target: 'stakeholder-consultations',
          animated: true,
          label: 'Consult'
        },
        {
          id: 'e3-4',
          source: 'environmental-impact',
          target: 'stakeholder-consultations',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e4-5',
          source: 'stakeholder-consultations',
          target: 'process-engineering',
          animated: true,
          label: 'Engineer'
        },
        {
          id: 'e4-6',
          source: 'stakeholder-consultations',
          target: 'facility-requirements',
          animated: true,
          label: 'Define'
        },
        {
          id: 'e5-7',
          source: 'process-engineering',
          target: 'safety-hazard-analysis',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e6-7',
          source: 'facility-requirements',
          target: 'safety-hazard-analysis',
          animated: true,
          label: 'Evaluate'
        },
        {
          id: 'e7-8',
          source: 'safety-hazard-analysis',
          target: 'conceptual-engineering',
          animated: true,
          label: 'Design'
        },
        {
          id: 'e7-9',
          source: 'safety-hazard-analysis',
          target: 'scope-definition',
          animated: true,
          label: 'Define'
        },
        {
          id: 'e8-10',
          source: 'conceptual-engineering',
          target: 'front-end-engineering',
          animated: true,
          label: 'Develop'
        },
        {
          id: 'e9-10',
          source: 'scope-definition',
          target: 'front-end-engineering',
          animated: true,
          label: 'Elaborate'
        },
        {
          id: 'e10-11',
          source: 'front-end-engineering',
          target: 'detailed-design',
          animated: true,
          label: 'Detail'
        },
        {
          id: 'e11-12',
          source: 'detailed-design',
          target: 'regulatory-compliance',
          animated: true,
          label: 'Comply'
        },
        {
          id: 'e11-13',
          source: 'detailed-design',
          target: 'procurement-strategy',
          animated: true,
          label: 'Procure'
        },
        {
          id: 'e13-14',
          source: 'procurement-strategy',
          target: 'long-lead-items',
          animated: true,
          label: 'Order'
        },
        {
          id: 'e13-15',
          source: 'procurement-strategy',
          target: 'vendor-evaluation',
          animated: true,
          label: 'Evaluate'
        },
        {
          id: 'e14-16',
          source: 'long-lead-items',
          target: 'site-mobilization',
          animated: true,
          label: 'Mobilize'
        },
        {
          id: 'e15-16',
          source: 'vendor-evaluation',
          target: 'site-mobilization',
          animated: true,
          label: 'Mobilize'
        },
        {
          id: 'e16-17',
          source: 'site-mobilization',
          target: 'earthworks-foundations',
          animated: true,
          label: 'Build'
        },
        {
          id: 'e16-18',
          source: 'site-mobilization',
          target: 'underground-utilities',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e17-19',
          source: 'earthworks-foundations',
          target: 'steel-erection',
          animated: true,
          label: 'Erect'
        },
        {
          id: 'e18-20',
          source: 'underground-utilities',
          target: 'building-envelope',
          animated: true,
          label: 'Enclose'
        },
        {
          id: 'e19-21',
          source: 'steel-erection',
          target: 'process-equipment',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e20-22',
          source: 'building-envelope',
          target: 'mechanical-systems',
          animated: true,
          label: 'Install'
        },
        {
          id: 'e21-23',
          source: 'process-equipment',
          target: 'electrical-instrumentation',
          animated: true,
          label: 'Connect'
        },
        {
          id: 'e22-23',
          source: 'mechanical-systems',
          target: 'electrical-instrumentation',
          animated: true,
          label: 'Wire'
        },
        {
          id: 'e23-24',
          source: 'electrical-instrumentation',
          target: 'testing-commissioning',
          animated: true,
          label: 'Test'
        },
        {
          id: 'e24-25',
          source: 'testing-commissioning',
          target: 'pre-startup-review',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e24-26',
          source: 'testing-commissioning',
          target: 'operational-readiness',
          animated: true,
          label: 'Prepare'
        },
        {
          id: 'e25-27',
          source: 'pre-startup-review',
          target: 'startup-handover',
          animated: true,
          label: 'Start'
        },
        {
          id: 'e26-27',
          source: 'operational-readiness',
          target: 'startup-handover',
          animated: true,
          label: 'Operate'
        },
        {
          id: 'e27-28',
          source: 'startup-handover',
          target: 'documentation-training',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e28-29',
          source: 'documentation-training',
          target: 'performance-verification',
          animated: true,
          label: 'Verify'
        }
      ]
    }
  },
  {
    id: 'architectural-design',
    name: 'Architectural Design Process',
    description: 'Comprehensive workflow for architectural design from concept to construction documents',
    icon: <PenTool className="h-8 w-8 text-fuchsia-600" />,
    color: 'bg-fuchsia-100',
    data: {
      nodes: [
        {
          id: 'client-engagement',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Client Engagement', icon: '🤝', color: '#c026d3' }
        },
        {
          id: 'programming',
          type: 'customNode',
          position: { x: 250, y: 150 },
          data: { label: 'Programming & Analysis', icon: '📋', color: '#c026d3' }
        },
        {
          id: 'site-analysis',
          type: 'customNode',
          position: { x: 400, y: 50 },
          data: { label: 'Site Analysis', icon: '🗺️', color: '#c026d3' }
        },
        {
          id: 'zoning-research',
          type: 'customNode',
          position: { x: 400, y: 250 },
          data: { label: 'Zoning & Code Research', icon: '📚', color: '#c026d3' }
        },
        {
          id: 'concept-design',
          type: 'customNode',
          position: { x: 550, y: 150 },
          data: { label: 'Concept Design', icon: '💡', color: '#c026d3' }
        },
        {
          id: 'schematic-options',
          type: 'customNode',
          position: { x: 700, y: 50 },
          data: { label: 'Schematic Options', icon: '🖼️', color: '#c026d3' }
        },
        {
          id: 'client-feedback',
          type: 'customNode',
          position: { x: 700, y: 250 },
          data: { label: 'Client Feedback Loop', icon: '🔄', color: '#c026d3' }
        },
        {
          id: 'design-development',
          type: 'customNode',
          position: { x: 850, y: 150 },
          data: { label: 'Design Development', icon: '✏️', color: '#c026d3' }
        },
        {
          id: 'material-selection',
          type: 'customNode',
          position: { x: 1000, y: 50 },
          data: { label: 'Material Selection', icon: '🧱', color: '#c026d3' }
        },
        {
          id: 'system-coordination',
          type: 'customNode',
          position: { x: 1000, y: 250 },
          data: { label: 'System Coordination', icon: '⚙️', color: '#c026d3' }
        },
        {
          id: 'structural-engineering',
          type: 'customNode',
          position: { x: 1150, y: 50 },
          data: { label: 'Structural Engineering', icon: '🏗️', color: '#c026d3' }
        },
        {
          id: 'mep-engineering',
          type: 'customNode',
          position: { x: 1150, y: 250 },
          data: { label: 'MEP Engineering', icon: '⚡', color: '#c026d3' }
        },
        {
          id: 'construction-documents',
          type: 'customNode',
          position: { x: 1300, y: 150 },
          data: { label: 'Construction Documents', icon: '📄', color: '#c026d3' }
        },
        {
          id: 'specifications',
          type: 'customNode',
          position: { x: 1450, y: 50 },
          data: { label: 'Specifications', icon: '📝', color: '#c026d3' }
        },
        {
          id: 'detailing',
          type: 'customNode',
          position: { x: 1450, y: 250 },
          data: { label: 'Detailing', icon: '🔍', color: '#c026d3' }
        },
        {
          id: 'coordination-review',
          type: 'customNode',
          position: { x: 1600, y: 150 },
          data: { label: 'Coordination Review', icon: '🔄', color: '#c026d3' }
        },
        {
          id: 'permit-submission',
          type: 'customNode',
          position: { x: 1750, y: 150 },
          data: { label: 'Permit Submission', icon: '📋', color: '#c026d3' }
        },
        {
          id: 'bid-documents',
          type: 'customNode',
          position: { x: 1900, y: 50 },
          data: { label: 'Bid Documents', icon: '💼', color: '#c026d3' }
        },
        {
          id: 'contractor-selection',
          type: 'customNode',
          position: { x: 1900, y: 250 },
          data: { label: 'Contractor Selection', icon: '👷', color: '#c026d3' }
        },
        {
          id: 'construction-admin',
          type: 'customNode',
          position: { x: 2050, y: 150 },
          data: { label: 'Construction Administration', icon: '🏢', color: '#c026d3' }
        },
        {
          id: 'site-observation',
          type: 'customNode',
          position: { x: 2200, y: 50 },
          data: { label: 'Site Observation', icon: '👁️', color: '#c026d3' }
        },
        {
          id: 'submittals-review',
          type: 'customNode',
          position: { x: 2200, y: 250 },
          data: { label: 'Submittals Review', icon: '✓', color: '#c026d3' }
        },
        {
          id: 'project-closeout',
          type: 'customNode',
          position: { x: 2350, y: 150 },
          data: { label: 'Project Closeout', icon: '🏁', color: '#c026d3' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'client-engagement',
          target: 'programming',
          animated: true,
          label: 'Define Needs'
        },
        {
          id: 'e2-3',
          source: 'programming',
          target: 'site-analysis',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e2-4',
          source: 'programming',
          target: 'zoning-research',
          animated: true,
          label: 'Research'
        },
        {
          id: 'e3-5',
          source: 'site-analysis',
          target: 'concept-design',
          animated: true,
          label: 'Ideate'
        },
        {
          id: 'e4-5',
          source: 'zoning-research',
          target: 'concept-design',
          animated: true,
          label: 'Inform'
        },
        {
          id: 'e5-6',
          source: 'concept-design',
          target: 'schematic-options',
          animated: true,
          label: 'Develop'
        },
        {
          id: 'e5-7',
          source: 'concept-design',
          target: 'client-feedback',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e6-8',
          source: 'schematic-options',
          target: 'design-development',
          animated: true,
          label: 'Refine'
        },
        {
          id: 'e7-8',
          source: 'client-feedback',
          target: 'design-development',
          animated: true,
          label: 'Incorporate'
        },
        {
          id: 'e8-9',
          source: 'design-development',
          target: 'material-selection',
          animated: true,
          label: 'Select'
        },
        {
          id: 'e8-10',
          source: 'design-development',
          target: 'system-coordination',
          animated: true,
          label: 'Coordinate'
        },
        {
          id: 'e9-11',
          source: 'material-selection',
          target: 'structural-engineering',
          animated: true,
          label: 'Engineer'
        },
        {
          id: 'e10-12',
          source: 'system-coordination',
          target: 'mep-engineering',
          animated: true,
          label: 'Design'
        },
        {
          id: 'e11-13',
          source: 'structural-engineering',
          target: 'construction-documents',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e12-13',
          source: 'mep-engineering',
          target: 'construction-documents',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e13-14',
          source: 'construction-documents',
          target: 'specifications',
          animated: true,
          label: 'Specify'
        },
        {
          id: 'e13-15',
          source: 'construction-documents',
          target: 'detailing',
          animated: true,
          label: 'Detail'
        },
        {
          id: 'e14-16',
          source: 'specifications',
          target: 'coordination-review',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e15-16',
          source: 'detailing',
          target: 'coordination-review',
          animated: true,
          label: 'Coordinate'
        },
        {
          id: 'e16-17',
          source: 'coordination-review',
          target: 'permit-submission',
          animated: true,
          label: 'Submit'
        },
        {
          id: 'e17-18',
          source: 'permit-submission',
          target: 'bid-documents',
          animated: true,
          label: 'Prepare'
        },
        {
          id: 'e17-19',
          source: 'permit-submission',
          target: 'contractor-selection',
          animated: true,
          label: 'Select'
        },
        {
          id: 'e18-20',
          source: 'bid-documents',
          target: 'construction-admin',
          animated: true,
          label: 'Administer'
        },
        {
          id: 'e19-20',
          source: 'contractor-selection',
          target: 'construction-admin',
          animated: true,
          label: 'Oversee'
        },
        {
          id: 'e20-21',
          source: 'construction-admin',
          target: 'site-observation',
          animated: true,
          label: 'Observe'
        },
        {
          id: 'e20-22',
          source: 'construction-admin',
          target: 'submittals-review',
          animated: true,
          label: 'Review'
        },
        {
          id: 'e21-23',
          source: 'site-observation',
          target: 'project-closeout',
          animated: true,
          label: 'Complete'
        },
        {
          id: 'e22-23',
          source: 'submittals-review',
          target: 'project-closeout',
          animated: true,
          label: 'Finalize'
        }
      ]
    }
  },
  {
    id: 'sustainable-design',
    name: 'Sustainable Construction',
    description: 'Green building workflow with focus on environmental certification and sustainable practices',
    icon: <Lightbulb className="h-8 w-8 text-green-600" />,
    color: 'bg-green-100',
    data: {
      nodes: [
        {
          id: 'sustainability-goals',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Sustainability Goals', icon: '🌱', color: '#16a34a' }
        },
        {
          id: 'eco-charrette',
          type: 'customNode',
          position: { x: 250, y: 150 },
          data: { label: 'Eco-Charrette', icon: '♻️', color: '#16a34a' }
        },
        {
          id: 'certification-selection',
          type: 'customNode',
          position: { x: 400, y: 50 },
          data: { label: 'Certification Selection', icon: '🏅', color: '#16a34a' }
        },
        {
          id: 'site-evaluation',
          type: 'customNode',
          position: { x: 400, y: 250 },
          data: { label: 'Site Evaluation', icon: '🏞️', color: '#16a34a' }
        },
        {
          id: 'integrated-design',
          type: 'customNode',
          position: { x: 550, y: 150 },
          data: { label: 'Integrated Design', icon: '🧩', color: '#16a34a' }
        },
        {
          id: 'energy-modeling',
          type: 'customNode',
          position: { x: 700, y: 50 },
          data: { label: 'Energy Modeling', icon: '⚡', color: '#16a34a' }
        },
        {
          id: 'water-efficiency',
          type: 'customNode',
          position: { x: 700, y: 250 },
          data: { label: 'Water Efficiency', icon: '💧', color: '#16a34a' }
        },
        {
          id: 'material-selection',
          type: 'customNode',
          position: { x: 850, y: 150 },
          data: { label: 'Sustainable Materials', icon: '🧱', color: '#16a34a' }
        },
        {
          id: 'renewables-assessment',
          type: 'customNode',
          position: { x: 1000, y: 50 },
          data: { label: 'Renewable Energy', icon: '☀️', color: '#16a34a' }
        },
        {
          id: 'indoor-quality',
          type: 'customNode',
          position: { x: 1000, y: 250 },
          data: { label: 'Indoor Air Quality', icon: '🌬️', color: '#16a34a' }
        },
        {
          id: 'construction-planning',
          type: 'customNode',
          position: { x: 1150, y: 150 },
          data: { label: 'Construction Planning', icon: '📝', color: '#16a34a' }
        },
        {
          id: 'waste-management',
          type: 'customNode',
          position: { x: 1300, y: 50 },
          data: { label: 'Waste Management Plan', icon: '🗑️', color: '#16a34a' }
        },
        {
          id: 'eco-procurement',
          type: 'customNode',
          position: { x: 1300, y: 250 },
          data: { label: 'Eco-Procurement', icon: '🛒', color: '#16a34a' }
        },
        {
          id: 'green-construction',
          type: 'customNode',
          position: { x: 1450, y: 150 },
          data: { label: 'Green Construction', icon: '🏗️', color: '#16a34a' }
        },
        {
          id: 'erosion-control',
          type: 'customNode',
          position: { x: 1600, y: 50 },
          data: { label: 'Erosion Control', icon: '🌊', color: '#16a34a' }
        },
        {
          id: 'air-pollution',
          type: 'customNode',
          position: { x: 1600, y: 250 },
          data: { label: 'Air Pollution Control', icon: '😷', color: '#16a34a' }
        },
        {
          id: 'certification-tracking',
          type: 'customNode',
          position: { x: 1750, y: 150 },
          data: { label: 'Certification Tracking', icon: '📊', color: '#16a34a' }
        },
        {
          id: 'inspections',
          type: 'customNode',
          position: { x: 1900, y: 150 },
          data: { label: 'Sustainability Inspections', icon: '🔍', color: '#16a34a' }
        },
        {
          id: 'commissioning',
          type: 'customNode',
          position: { x: 2050, y: 50 },
          data: { label: 'Enhanced Commissioning', icon: '✅', color: '#16a34a' }
        },
        {
          id: 'performance-testing',
          type: 'customNode',
          position: { x: 2050, y: 250 },
          data: { label: 'Performance Testing', icon: '🧪', color: '#16a34a' }
        },
        {
          id: 'certification-submission',
          type: 'customNode',
          position: { x: 2200, y: 150 },
          data: { label: 'Certification Submission', icon: '📤', color: '#16a34a' }
        },
        {
          id: 'occupant-training',
          type: 'customNode',
          position: { x: 2350, y: 150 },
          data: { label: 'Occupant Training', icon: '👨‍🏫', color: '#16a34a' }
        },
        {
          id: 'ongoing-monitoring',
          type: 'customNode',
          position: { x: 2500, y: 150 },
          data: { label: 'Ongoing Monitoring', icon: '📈', color: '#16a34a' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'sustainability-goals',
          target: 'eco-charrette',
          animated: true,
          label: 'Workshop'
        },
        {
          id: 'e2-3',
          source: 'eco-charrette',
          target: 'certification-selection',
          animated: true,
          label: 'Choose'
        },
        {
          id: 'e2-4',
          source: 'eco-charrette',
          target: 'site-evaluation',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e3-5',
          source: 'certification-selection',
          target: 'integrated-design',
          animated: true,
          label: 'Design'
        },
        {
          id: 'e4-5',
          source: 'site-evaluation',
          target: 'integrated-design',
          animated: true,
          label: 'Inform'
        },
        {
          id: 'e5-6',
          source: 'integrated-design',
          target: 'energy-modeling',
          animated: true,
          label: 'Model'
        },
        {
          id: 'e5-7',
          source: 'integrated-design',
          target: 'water-efficiency',
          animated: true,
          label: 'Conserve'
        },
        {
          id: 'e6-8',
          source: 'energy-modeling',
          target: 'material-selection',
          animated: true,
          label: 'Select'
        },
        {
          id: 'e7-8',
          source: 'water-efficiency',
          target: 'material-selection',
          animated: true,
          label: 'Choose'
        },
        {
          id: 'e8-9',
          source: 'material-selection',
          target: 'renewables-assessment',
          animated: true,
          label: 'Integrate'
        },
        {
          id: 'e8-10',
          source: 'material-selection',
          target: 'indoor-quality',
          animated: true,
          label: 'Ensure'
        },
        {
          id: 'e9-11',
          source: 'renewables-assessment',
          target: 'construction-planning',
          animated: true,
          label: 'Plan'
        },
        {
          id: 'e10-11',
          source: 'indoor-quality',
          target: 'construction-planning',
          animated: true,
          label: 'Specify'
        },
        {
          id: 'e11-12',
          source: 'construction-planning',
          target: 'waste-management',
          animated: true,
          label: 'Reduce'
        },
        {
          id: 'e11-13',
          source: 'construction-planning',
          target: 'eco-procurement',
          animated: true,
          label: 'Source'
        },
        {
          id: 'e12-14',
          source: 'waste-management',
          target: 'green-construction',
          animated: true,
          label: 'Implement'
        },
        {
          id: 'e13-14',
          source: 'eco-procurement',
          target: 'green-construction',
          animated: true,
          label: 'Build'
        },
        {
          id: 'e14-15',
          source: 'green-construction',
          target: 'erosion-control',
          animated: true,
          label: 'Protect'
        },
        {
          id: 'e14-16',
          source: 'green-construction',
          target: 'air-pollution',
          animated: true,
          label: 'Control'
        },
        {
          id: 'e15-17',
          source: 'erosion-control',
          target: 'certification-tracking',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e16-17',
          source: 'air-pollution',
          target: 'certification-tracking',
          animated: true,
          label: 'Track'
        },
        {
          id: 'e17-18',
          source: 'certification-tracking',
          target: 'inspections',
          animated: true,
          label: 'Verify'
        },
        {
          id: 'e18-19',
          source: 'inspections',
          target: 'commissioning',
          animated: true,
          label: 'Commission'
        },
        {
          id: 'e18-20',
          source: 'inspections',
          target: 'performance-testing',
          animated: true,
          label: 'Test'
        },
        {
          id: 'e19-21',
          source: 'commissioning',
          target: 'certification-submission',
          animated: true,
          label: 'Submit'
        },
        {
          id: 'e20-21',
          source: 'performance-testing',
          target: 'certification-submission',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e21-22',
          source: 'certification-submission',
          target: 'occupant-training',
          animated: true,
          label: 'Train'
        },
        {
          id: 'e22-23',
          source: 'occupant-training',
          target: 'ongoing-monitoring',
          animated: true,
          label: 'Monitor'
        }
      ]
    }
  },
  {
    id: 'construction-analytics',
    name: 'Construction Analytics',
    description: 'Data-driven construction workflow with performance metrics, benchmarking, and continuous improvement',
    icon: <BarChart3 className="h-8 w-8 text-teal-600" />,
    color: 'bg-teal-100',
    data: {
      nodes: [
        {
          id: 'data-strategy',
          type: 'customNode',
          position: { x: 100, y: 150 },
          data: { label: 'Data Strategy', icon: '📊', color: '#0d9488' }
        },
        {
          id: 'kpi-definition',
          type: 'customNode',
          position: { x: 250, y: 50 },
          data: { label: 'KPI Definition', icon: '🎯', color: '#0d9488' }
        },
        {
          id: 'baseline-assessment',
          type: 'customNode',
          position: { x: 250, y: 250 },
          data: { label: 'Baseline Assessment', icon: '📏', color: '#0d9488' }
        },
        {
          id: 'data-collection',
          type: 'customNode',
          position: { x: 400, y: 150 },
          data: { label: 'Data Collection Setup', icon: '📡', color: '#0d9488' }
        },
        {
          id: 'iot-sensors',
          type: 'customNode',
          position: { x: 550, y: 50 },
          data: { label: 'IoT Sensors Deployment', icon: '🔌', color: '#0d9488' }
        },
        {
          id: 'mobile-capture',
          type: 'customNode',
          position: { x: 550, y: 250 },
          data: { label: 'Mobile Data Capture', icon: '📱', color: '#0d9488' }
        },
        {
          id: 'bim-integration',
          type: 'customNode',
          position: { x: 700, y: 150 },
          data: { label: 'BIM Integration', icon: '🏛️', color: '#0d9488' }
        },
        {
          id: 'real-time-monitoring',
          type: 'customNode',
          position: { x: 850, y: 50 },
          data: { label: 'Real-time Monitoring', icon: '📶', color: '#0d9488' }
        },
        {
          id: 'historical-analysis',
          type: 'customNode',
          position: { x: 850, y: 250 },
          data: { label: 'Historical Analysis', icon: '📜', color: '#0d9488' }
        },
        {
          id: 'predictive-analytics',
          type: 'customNode',
          position: { x: 1000, y: 150 },
          data: { label: 'Predictive Analytics', icon: '🔮', color: '#0d9488' }
        },
        {
          id: 'productivity-tracking',
          type: 'customNode',
          position: { x: 1150, y: 50 },
          data: { label: 'Productivity Tracking', icon: '⏱️', color: '#0d9488' }
        },
        {
          id: 'quality-metrics',
          type: 'customNode',
          position: { x: 1150, y: 250 },
          data: { label: 'Quality Metrics', icon: '✓', color: '#0d9488' }
        },
        {
          id: 'safety-analytics',
          type: 'customNode',
          position: { x: 1300, y: 50 },
          data: { label: 'Safety Analytics', icon: '🛡️', color: '#0d9488' }
        },
        {
          id: 'financial-tracking',
          type: 'customNode',
          position: { x: 1300, y: 250 },
          data: { label: 'Financial Tracking', icon: '💰', color: '#0d9488' }
        },
        {
          id: 'performance-dashboard',
          type: 'customNode',
          position: { x: 1450, y: 150 },
          data: { label: 'Performance Dashboard', icon: '🖥️', color: '#0d9488' }
        },
        {
          id: 'stakeholder-reports',
          type: 'customNode',
          position: { x: 1600, y: 150 },
          data: { label: 'Stakeholder Reports', icon: '📰', color: '#0d9488' }
        },
        {
          id: 'improvement-identification',
          type: 'customNode',
          position: { x: 1750, y: 50 },
          data: { label: 'Improvement Areas', icon: '📈', color: '#0d9488' }
        },
        {
          id: 'root-cause-analysis',
          type: 'customNode',
          position: { x: 1750, y: 250 },
          data: { label: 'Root Cause Analysis', icon: '🔍', color: '#0d9488' }
        },
        {
          id: 'process-optimization',
          type: 'customNode',
          position: { x: 1900, y: 150 },
          data: { label: 'Process Optimization', icon: '⚙️', color: '#0d9488' }
        },
        {
          id: 'continuous-monitoring',
          type: 'customNode',
          position: { x: 2050, y: 150 },
          data: { label: 'Continuous Monitoring', icon: '🔄', color: '#0d9488' }
        },
        {
          id: 'knowledge-database',
          type: 'customNode',
          position: { x: 2200, y: 150 },
          data: { label: 'Knowledge Database', icon: '🧠', color: '#0d9488' }
        },
        {
          id: 'benchmarking',
          type: 'customNode',
          position: { x: 2350, y: 150 },
          data: { label: 'Industry Benchmarking', icon: '📋', color: '#0d9488' }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'data-strategy',
          target: 'kpi-definition',
          animated: true,
          label: 'Define'
        },
        {
          id: 'e1-3',
          source: 'data-strategy',
          target: 'baseline-assessment',
          animated: true,
          label: 'Assess'
        },
        {
          id: 'e2-4',
          source: 'kpi-definition',
          target: 'data-collection',
          animated: true,
          label: 'Collect'
        },
        {
          id: 'e3-4',
          source: 'baseline-assessment',
          target: 'data-collection',
          animated: true,
          label: 'Establish'
        },
        {
          id: 'e4-5',
          source: 'data-collection',
          target: 'iot-sensors',
          animated: true,
          label: 'Deploy'
        },
        {
          id: 'e4-6',
          source: 'data-collection',
          target: 'mobile-capture',
          animated: true,
          label: 'Capture'
        },
        {
          id: 'e5-7',
          source: 'iot-sensors',
          target: 'bim-integration',
          animated: true,
          label: 'Integrate'
        },
        {
          id: 'e6-7',
          source: 'mobile-capture',
          target: 'bim-integration',
          animated: true,
          label: 'Connect'
        },
        {
          id: 'e7-8',
          source: 'bim-integration',
          target: 'real-time-monitoring',
          animated: true,
          label: 'Monitor'
        },
        {
          id: 'e7-9',
          source: 'bim-integration',
          target: 'historical-analysis',
          animated: true,
          label: 'Analyze'
        },
        {
          id: 'e8-10',
          source: 'real-time-monitoring',
          target: 'predictive-analytics',
          animated: true,
          label: 'Predict'
        },
        {
          id: 'e9-10',
          source: 'historical-analysis',
          target: 'predictive-analytics',
          animated: true,
          label: 'Forecast'
        },
        {
          id: 'e10-11',
          source: 'predictive-analytics',
          target: 'productivity-tracking',
          animated: true,
          label: 'Track'
        },
        {
          id: 'e10-12',
          source: 'predictive-analytics',
          target: 'quality-metrics',
          animated: true,
          label: 'Measure'
        },
        {
          id: 'e11-13',
          source: 'productivity-tracking',
          target: 'safety-analytics',
          animated: true,
          label: 'Monitor'
        },
        {
          id: 'e12-14',
          source: 'quality-metrics',
          target: 'financial-tracking',
          animated: true,
          label: 'Correlate'
        },
        {
          id: 'e13-15',
          source: 'safety-analytics',
          target: 'performance-dashboard',
          animated: true,
          label: 'Display'
        },
        {
          id: 'e14-15',
          source: 'financial-tracking',
          target: 'performance-dashboard',
          animated: true,
          label: 'Visualize'
        },
        {
          id: 'e15-16',
          source: 'performance-dashboard',
          target: 'stakeholder-reports',
          animated: true,
          label: 'Report'
        },
        {
          id: 'e16-17',
          source: 'stakeholder-reports',
          target: 'improvement-identification',
          animated: true,
          label: 'Identify'
        },
        {
          id: 'e16-18',
          source: 'stakeholder-reports',
          target: 'root-cause-analysis',
          animated: true,
          label: 'Diagnose'
        },
        {
          id: 'e17-19',
          source: 'improvement-identification',
          target: 'process-optimization',
          animated: true,
          label: 'Optimize'
        },
        {
          id: 'e18-19',
          source: 'root-cause-analysis',
          target: 'process-optimization',
          animated: true,
          label: 'Solve'
        },
        {
          id: 'e19-20',
          source: 'process-optimization',
          target: 'continuous-monitoring',
          animated: true,
          label: 'Monitor'
        },
        {
          id: 'e20-21',
          source: 'continuous-monitoring',
          target: 'knowledge-database',
          animated: true,
          label: 'Document'
        },
        {
          id: 'e21-22',
          source: 'knowledge-database',
          target: 'benchmarking',
          animated: true,
          label: 'Compare'
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

