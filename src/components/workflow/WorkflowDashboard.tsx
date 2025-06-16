import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Camera,
  Mail,
  Phone,
  Globe,
  MessageCircle
} from 'lucide-react';
import type { WorkflowState, WorkflowStage, LeadSource } from '@/types/workflow';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LeadCaptureForm from './LeadCaptureForm';

const WorkflowDashboard: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowState[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowState | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Stage configuration with display names and colors
  const stageConfig: Record<WorkflowStage, { label: string; color: string; icon: React.ReactNode }> = {
    incoming_lead: { label: 'Incoming Lead', color: 'bg-blue-500', icon: <Users className="w-4 h-4" /> },
    lead_response: { label: 'Lead Response', color: 'bg-blue-500', icon: <MessageSquare className="w-4 h-4" /> },
    lead_qualification: { label: 'Lead Qualification', color: 'bg-yellow-500', icon: <AlertCircle className="w-4 h-4" /> },
    details_extraction: { label: 'Details Extraction', color: 'bg-yellow-500', icon: <FileText className="w-4 h-4" /> },
    calendar_booking: { label: 'Calendar Booking', color: 'bg-purple-500', icon: <Calendar className="w-4 h-4" /> },
    progress_portal_sent: { label: 'Progress Portal Sent', color: 'bg-purple-500', icon: <Mail className="w-4 h-4" /> },
    site_audit_scheduled: { label: 'Site Audit Scheduled', color: 'bg-indigo-500', icon: <Camera className="w-4 h-4" /> },
    site_audit_completed: { label: 'Site Audit Completed', color: 'bg-indigo-500', icon: <CheckCircle className="w-4 h-4" /> },
    quote_created: { label: 'Quote Created', color: 'bg-green-500', icon: <FileText className="w-4 h-4" /> },
    quote_sent: { label: 'Quote Sent', color: 'bg-green-500', icon: <Mail className="w-4 h-4" /> },
    quote_signed: { label: 'Quote Signed', color: 'bg-green-500', icon: <CheckCircle className="w-4 h-4" /> },
    quote_accepted: { label: 'Quote Accepted', color: 'bg-green-600', icon: <CheckCircle className="w-4 h-4" /> },
    quote_denied: { label: 'Quote Denied', color: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" /> },
    job_created: { label: 'Job Created', color: 'bg-teal-500', icon: <FileText className="w-4 h-4" /> },
    job_scheduled: { label: 'Job Scheduled', color: 'bg-teal-500', icon: <Calendar className="w-4 h-4" /> },
    staff_allocated: { label: 'Staff Allocated', color: 'bg-teal-500', icon: <Users className="w-4 h-4" /> },
    job_started: { label: 'Job Started', color: 'bg-orange-500', icon: <CheckCircle className="w-4 h-4" /> },
    job_in_progress: { label: 'Job In Progress', color: 'bg-orange-500', icon: <AlertCircle className="w-4 h-4" /> },
    job_completed: { label: 'Job Completed', color: 'bg-green-600', icon: <CheckCircle className="w-4 h-4" /> },
    invoice_sent: { label: 'Invoice Sent', color: 'bg-blue-600', icon: <DollarSign className="w-4 h-4" /> },
    payment_received: { label: 'Payment Received', color: 'bg-green-700', icon: <DollarSign className="w-4 h-4" /> },
    quality_control: { label: 'Quality Control', color: 'bg-purple-600', icon: <CheckCircle className="w-4 h-4" /> },
    customer_satisfaction: { label: 'Customer Satisfaction', color: 'bg-purple-600', icon: <Users className="w-4 h-4" /> },
    review_requested: { label: 'Review Requested', color: 'bg-yellow-600', icon: <MessageSquare className="w-4 h-4" /> },
    complaint_received: { label: 'Complaint Received', color: 'bg-red-600', icon: <AlertCircle className="w-4 h-4" /> },
    complaint_resolved: { label: 'Complaint Resolved', color: 'bg-green-600', icon: <CheckCircle className="w-4 h-4" /> },
    workflow_completed: { label: 'Workflow Completed', color: 'bg-gray-600', icon: <CheckCircle className="w-4 h-4" /> },
  };

  const leadSourceIcons: Record<LeadSource, React.ReactNode> = {
    social_media: <MessageCircle className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    phone_call: <Phone className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />,
    other: <AlertCircle className="w-4 h-4" />,
  };

  // Calculate workflow progress
  const calculateProgress = (workflow: WorkflowState): number => {
    const totalStages = Object.keys(stageConfig).length;
    const completedStages = workflow.stages.filter(s => s.completedAt).length;
    return Math.round((completedStages / totalStages) * 100);
  };

  // Group workflows by stage
  const groupWorkflowsByStage = () => {
    const grouped: Record<WorkflowStage, WorkflowState[]> = {} as any;
    Object.keys(stageConfig).forEach(stage => {
      grouped[stage as WorkflowStage] = workflows.filter(w => w.currentStage === stage);
    });
    return grouped;
  };

  // Handle new lead submission
  const handleNewLead = (leadData: {
    source: LeadSource;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    description: string;
  }) => {
    // Create new workflow with lead
    const newWorkflow: WorkflowState = {
      id: `workflow-${Date.now()}`,
      leadId: `lead-${Date.now()}`,
      currentStage: 'incoming_lead',
      stages: [
        { stage: 'incoming_lead', completedAt: new Date().toISOString() }
      ],
      lead: {
        id: `lead-${Date.now()}`,
        ...leadData,
        qualified: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkflows([...workflows, newWorkflow]);
    setShowLeadForm(false);
    toast.success('New lead added to workflow!');
  };

  // Mock data for demonstration
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    const mockWorkflows: WorkflowState[] = [
      {
        id: '1',
        leadId: 'lead-1',
        currentStage: 'quote_sent',
        stages: [
          { stage: 'incoming_lead', completedAt: '2024-01-15T10:00:00Z' },
          { stage: 'lead_response', completedAt: '2024-01-15T10:30:00Z' },
          { stage: 'lead_qualification', completedAt: '2024-01-15T11:00:00Z' },
          { stage: 'details_extraction', completedAt: '2024-01-15T11:30:00Z' },
          { stage: 'calendar_booking', completedAt: '2024-01-15T14:00:00Z' },
          { stage: 'site_audit_completed', completedAt: '2024-01-16T10:00:00Z' },
          { stage: 'quote_created', completedAt: '2024-01-16T14:00:00Z' },
          { stage: 'quote_sent', completedAt: '2024-01-16T15:00:00Z' },
        ],
        lead: {
          id: 'lead-1',
          source: 'website',
          customerName: 'John Smith',
          customerEmail: 'john@example.com',
          customerPhone: '0412345678',
          description: 'Fence installation inquiry',
          qualified: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z',
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-16T15:00:00Z',
      },
      {
        id: '2',
        leadId: 'lead-2',
        currentStage: 'job_in_progress',
        stages: [
          { stage: 'incoming_lead', completedAt: '2024-01-14T09:00:00Z' },
          { stage: 'lead_response', completedAt: '2024-01-14T09:30:00Z' },
          { stage: 'lead_qualification', completedAt: '2024-01-14T10:00:00Z' },
          { stage: 'quote_accepted', completedAt: '2024-01-15T16:00:00Z' },
          { stage: 'job_created', completedAt: '2024-01-15T16:30:00Z' },
          { stage: 'job_started', completedAt: '2024-01-17T08:00:00Z' },
        ],
        lead: {
          id: 'lead-2',
          source: 'social_media',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          description: 'Deck construction project',
          qualified: true,
          createdAt: '2024-01-14T09:00:00Z',
          updatedAt: '2024-01-14T10:00:00Z',
        },
        createdAt: '2024-01-14T09:00:00Z',
        updatedAt: '2024-01-17T08:00:00Z',
      },
    ];

    setWorkflows(mockWorkflows);
    setLoading(false);
  }, []);

  const groupedWorkflows = groupWorkflowsByStage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Journey Workflow</h1>
        <Button onClick={() => setShowLeadForm(true)}>
          <Users className="w-4 h-4 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold">{workflows.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Quotes Pending</p>
              <p className="text-2xl font-bold">
                {workflows.filter(w => w.currentStage === 'quote_sent').length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Jobs In Progress</p>
              <p className="text-2xl font-bold">
                {workflows.filter(w => w.currentStage === 'job_in_progress').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Awaiting Payment</p>
              <p className="text-2xl font-bold">
                {workflows.filter(w => w.currentStage === 'invoice_sent').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Workflow Pipeline View */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Workflow Pipeline</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {Object.entries(stageConfig).slice(0, 10).map(([stage, config]) => (
              <div key={stage} className="flex-1 min-w-[200px]">
                <div className={`${config.color} text-white p-3 rounded-t-lg flex items-center justify-between`}>
                  {config.icon}
                  <span className="text-sm font-medium">{config.label}</span>
                  <Badge variant="secondary" className="bg-white text-gray-800">
                    {groupedWorkflows[stage as WorkflowStage]?.length || 0}
                  </Badge>
                </div>
                <div className="bg-gray-50 p-3 rounded-b-lg min-h-[100px] max-h-[300px] overflow-y-auto">
                  {groupedWorkflows[stage as WorkflowStage]?.map(workflow => (
                    <div
                      key={workflow.id}
                      className="bg-white p-2 mb-2 rounded shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{workflow.lead?.customerName}</span>
                        {workflow.lead?.source && leadSourceIcons[workflow.lead.source]}
                      </div>
                      <Progress value={calculateProgress(workflow)} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Selected Workflow Details */}
      {selectedWorkflow && (
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedWorkflow.lead?.customerName}</h3>
              <p className="text-sm text-gray-600">{selectedWorkflow.lead?.description}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(null)}>
              Close
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Workflow Progress</h4>
              <Progress value={calculateProgress(selectedWorkflow)} className="h-3" />
              <p className="text-sm text-gray-600 mt-1">
                {calculateProgress(selectedWorkflow)}% Complete
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Stage History</h4>
              <div className="space-y-2">
                {selectedWorkflow.stages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stage.completedAt ? 'bg-green-500' : 'bg-gray-300'
                    } text-white`}>
                      {stageConfig[stage.stage].icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stageConfig[stage.stage].label}</p>
                      {stage.completedAt && (
                        <p className="text-xs text-gray-500">
                          {new Date(stage.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lead Capture Form Dialog */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="max-w-2xl">
          <LeadCaptureForm
            onSubmit={handleNewLead}
            onCancel={() => setShowLeadForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowDashboard; 