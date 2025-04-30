import React, { useState, useEffect } from 'react';
import { WorkflowTemplateSelector } from '@/components/workflow/WorkflowTemplateSelector';
import { WorkflowTemplate } from '@/types/workflow';
import { AppLayout } from "@/components/ui/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowIcon } from "@/components/icons/WorkflowIcon";
import { Construction, Building, ArrowLeft, WorkflowIcon as LucideWorkflowIcon, Search, Clock, PlusCircle, Bookmark, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';

const WORKFLOW_TEMPLATES = [
  // Construction Templates
  {
    id: 'residential-construction',
    name: 'Residential Construction',
    description: 'Complete workflow for residential construction projects',
    category: 'Construction',
    data: {
      nodes: [
        { id: 'client-consultation', type: 'customer', position: { x: 0, y: 0 }, data: { label: 'Initial Client Consultation' } },
        { id: 'site-assessment', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Site Assessment' } },
        { id: 'design-plans', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Design Plans' } },
        { id: 'permits', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Building Permits' } },
        { id: 'foundation', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Foundation Work' } },
        { id: 'framing', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Framing' } },
        { id: 'inspection', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Inspection' } }
      ],
      edges: [
        { id: 'e1-2', source: 'client-consultation', target: 'site-assessment' },
        { id: 'e2-3', source: 'site-assessment', target: 'design-plans' },
        { id: 'e3-4', source: 'design-plans', target: 'permits' },
        { id: 'e4-5', source: 'permits', target: 'foundation' },
        { id: 'e5-6', source: 'foundation', target: 'framing' },
        { id: 'e6-7', source: 'framing', target: 'inspection' }
      ]
    }
  },
  {
    id: 'commercial-construction',
    name: 'Commercial Construction',
    description: 'Workflow template for commercial construction projects',
    category: 'Construction',
    data: {
      nodes: [
        { id: 'feasibility', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Feasibility Study' } },
        { id: 'planning', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Project Planning' } },
        { id: 'design', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Architectural Design' } },
        { id: 'permits', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Permits & Approvals' } },
        { id: 'construction', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Construction Phase' } },
        { id: 'inspection', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Final Inspection' } }
      ],
      edges: [
        { id: 'e1-2', source: 'feasibility', target: 'planning' },
        { id: 'e2-3', source: 'planning', target: 'design' },
        { id: 'e3-4', source: 'design', target: 'permits' },
        { id: 'e4-5', source: 'permits', target: 'construction' },
        { id: 'e5-6', source: 'construction', target: 'inspection' }
      ]
    }
  },
  // Admin Templates
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Administrative workflow for project management',
    category: 'Admin',
    data: {
      nodes: [
        { id: 'initiation', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Project Initiation' } },
        { id: 'planning', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Project Planning' } },
        { id: 'execution', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Project Execution' } },
        { id: 'monitoring', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Monitoring & Control' } },
        { id: 'closure', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Project Closure' } }
      ],
      edges: [
        { id: 'e1-2', source: 'initiation', target: 'planning' },
        { id: 'e2-3', source: 'planning', target: 'execution' },
        { id: 'e3-4', source: 'execution', target: 'monitoring' },
        { id: 'e4-5', source: 'monitoring', target: 'closure' }
      ]
    }
  },
  {
    id: 'document-approval',
    name: 'Document Approval',
    description: 'Administrative workflow for document approval process',
    category: 'Admin',
    data: {
      nodes: [
        { id: 'submission', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Document Submission' } },
        { id: 'review', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Initial Review' } },
        { id: 'revision', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Revision Process' } },
        { id: 'approval', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Final Approval' } },
        { id: 'distribution', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Document Distribution' } }
      ],
      edges: [
        { id: 'e1-2', source: 'submission', target: 'review' },
        { id: 'e2-3', source: 'review', target: 'revision' },
        { id: 'e3-4', source: 'revision', target: 'approval' },
        { id: 'e4-5', source: 'approval', target: 'distribution' }
      ]
    }
  },
  {
    id: 'employee-onboarding',
    name: 'Employee Onboarding',
    description: 'Administrative workflow for new employee onboarding',
    category: 'Admin',
    data: {
      nodes: [
        { id: 'paperwork', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Initial Paperwork' } },
        { id: 'setup', type: 'task', position: { x: 0, y: 100 }, data: { label: 'System Setup' } },
        { id: 'training', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Training Schedule' } },
        { id: 'orientation', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Department Orientation' } },
        { id: 'review', type: 'task', position: { x: 0, y: 400 }, data: { label: '30-Day Review' } }
      ],
      edges: [
        { id: 'e1-2', source: 'paperwork', target: 'setup' },
        { id: 'e2-3', source: 'setup', target: 'training' },
        { id: 'e3-4', source: 'training', target: 'orientation' },
        { id: 'e4-5', source: 'orientation', target: 'review' }
      ]
    }
  }
];

export default function WorkflowTemplates() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [userWorkflows, setUserWorkflows] = useState<Workflow[]>([]);
  const [userTemplates, setUserTemplates] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const handleTemplateSelect = (template: WorkflowTemplate | null) => {
    if (template) {
      // Navigate to workflow editor with template data
      navigate('/workflow', { state: { template } });
    } else {
      // Navigate to empty workflow
      navigate('/workflow');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-[1400px] mx-auto">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <WorkflowIcon className="mr-2 h-6 w-6" />
                Workflow Library
              </h1>
              <p className="text-gray-500 mt-1">
                Choose a template or recent workflow to use as a starting point
              </p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Button
                variant="secondary"
                size="lg"
                className="whitespace-nowrap flex items-center min-w-[200px] justify-center"
                onClick={() => setActiveTab("construction")}
              >
                <Construction className="mr-2 h-5 w-5" />
                Construction Templates
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="whitespace-nowrap flex items-center min-w-[200px] justify-center"
                onClick={() => setActiveTab("admin")}
              >
                <Building className="mr-2 h-5 w-5" />
                Admin Templates
              </Button>
              <Button
                onClick={() => navigate("/workflow/list")}
                variant="outline"
                size="lg"
                className="whitespace-nowrap"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to My Workflows
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="templates">Predefined Templates</TabsTrigger>
              <TabsTrigger value="user-templates">My Templates</TabsTrigger>
              <TabsTrigger value="recent">Recent Workflows</TabsTrigger>
              <TabsTrigger value="construction">Construction</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="templates">
              <WorkflowTemplateSelector onSelect={handleTemplateSelect} />
            </TabsContent>
            <TabsContent value="user-templates">
              {/* User templates content */}
            </TabsContent>
            <TabsContent value="recent">
              {/* Recent workflows content */}
            </TabsContent>
            <TabsContent value="construction">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORKFLOW_TEMPLATES
                  .filter(template => template.category === 'Construction')
                  .map((template) => (
                    <Card key={template.id} className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 ${getCardBorderColor(template)}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge>{template.category}</Badge>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div>Nodes: {template.data.nodes.length}</div>
                          <div>Connections: {template.data.edges.length}</div>
                        </div>
                        <Button 
                          onClick={() => handleTemplateSelect(template)} 
                          className="w-full mt-4"
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="admin">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WORKFLOW_TEMPLATES
                  .filter(template => template.category === 'Admin')
                  .map((template) => (
                    <Card key={template.id} className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 ${getCardBorderColor(template)}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge>{template.category}</Badge>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-gray-500">
                          <div>Nodes: {template.data.nodes.length}</div>
                          <div>Connections: {template.data.edges.length}</div>
                        </div>
                        <Button 
                          onClick={() => handleTemplateSelect(template)} 
                          className="w-full mt-4"
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 