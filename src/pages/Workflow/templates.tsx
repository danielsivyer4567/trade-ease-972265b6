import React, { useState, useEffect } from 'react';
import { WorkflowTemplateSelector } from '@/components/workflow/WorkflowTemplateSelector';
import { WorkflowTemplate } from '@/types/workflow';
import { AppLayout } from "@/components/ui/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction, Building, ArrowLeft, Search, Clock, PlusCircle, Bookmark, Star, WorkflowIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkflowService, Workflow } from '@/services/WorkflowService';

const WORKFLOW_TEMPLATES = [
  // Construction Templates
  {
    id: 'site-inspection',
    name: 'Site Inspection',
    description: 'Standard workflow for site inspection and assessment',
    category: 'Construction',
    data: {
      nodes: [
        { id: 'arrival', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Site Arrival' } },
        { id: 'safety', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Safety Check' } },
        { id: 'inspection', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Site Inspection' } },
        { id: 'documentation', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Document Findings' } },
        { id: 'report', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Generate Report' } }
      ],
      edges: [
        { id: 'e1-2', source: 'arrival', target: 'safety' },
        { id: 'e2-3', source: 'safety', target: 'inspection' },
        { id: 'e3-4', source: 'inspection', target: 'documentation' },
        { id: 'e4-5', source: 'documentation', target: 'report' }
      ]
    }
  },
  // ... Add more templates as needed
];

export default function WorkflowTemplates() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTemplateSelect = (template: WorkflowTemplate | null) => {
    if (template) {
      navigate('/workflow/new', { state: { template } });
    } else {
      navigate('/workflow/new');
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
                Workflow Templates
              </h1>
              <p className="text-gray-500 mt-1">
                Choose a template to use as a starting point for your workflow
              </p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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

        <div className="p-6 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOW_TEMPLATES.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-primary">
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
                    onClick={() => handleTemplateSelect(template as WorkflowTemplate)} 
                    className="w-full mt-4"
                  >
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 