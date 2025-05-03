import React, { useState, useEffect } from 'react';
import { WorkflowTemplateSelector } from '@/components/workflow/WorkflowTemplateSelector';
import { WorkflowTemplate } from '@/types/workflow';
import { AppLayout } from "@/components/ui/AppLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction, Building, ArrowLeft, Search, Clock, PlusCircle, Bookmark, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { WorkflowIcon } from '@/components/icons/WorkflowIcon';

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
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
    loadTemplates();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const { success, workflows } = await WorkflowService.getUserWorkflows();
      if (success && workflows) {
        setWorkflows(workflows);
      } else {
        // toast.error("Failed to load workflows");
      }
    } catch (error) {
      // toast.error("Failed to load workflows");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const { success, workflows } = await WorkflowService.getUserWorkflows();
      if (success && workflows) {
        setTemplates(workflows.filter(w => w.is_template));
      }
    } catch (error) {
      // toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this workflow?")) {
      setIsDeleting(true);
      try {
        const { success } = await WorkflowService.deleteWorkflow(id);
        if (success) {
          // toast.success("Workflow deleted");
          loadWorkflows();
        } else {
          // toast.error("Failed to delete workflow");
        }
      } catch (error) {
        // toast.error("Failed to delete workflow");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDuplicate = async (workflow: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newWorkflow = {
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
        data: workflow.data,
        category: workflow.category,
        isTemplate: workflow.is_template
      };
      const { success, workflow: createdWorkflow } = await WorkflowService.createWorkflow(newWorkflow);
      if (success && createdWorkflow) {
        // toast.success("Workflow duplicated");
        loadWorkflows();
      } else {
        // toast.error("Failed to duplicate workflow");
      }
    } catch (error) {
      // toast.error("Failed to duplicate workflow");
    }
  };

  const handleView = (id: string) => {
    navigate(`/workflow?id=${id}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const categories = [...new Set(workflows.map(w => w.category || 'Uncategorized'))];

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = !searchTerm || 
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (workflow.description && workflow.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || 
      (workflow.category ? workflow.category === categoryFilter : categoryFilter === 'Uncategorized');
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string | undefined) => {
    const categories: Record<string, string> = {
      'Construction': 'bg-slate-100 text-slate-800',
      'Residential': 'bg-cyan-100 text-cyan-800',
      'Commercial': 'bg-gray-100 text-gray-800',
      'Industrial': 'bg-blue-100 text-blue-800',
      'Safety': 'bg-yellow-100 text-yellow-800',
      'Quality': 'bg-emerald-100 text-emerald-800',
      'Financial': 'bg-violet-100 text-violet-800',
      'Subcontractor': 'bg-blue-50 text-blue-800',
      'Equipment': 'bg-orange-100 text-orange-800',
      'Renovation': 'bg-amber-100 text-amber-800',
      'Contract': 'bg-pink-100 text-pink-800',
      'Architectural': 'bg-fuchsia-100 text-fuchsia-800',
      'Sustainable': 'bg-green-100 text-green-800',
      'Analytics': 'bg-teal-100 text-teal-800'
    };
    return categories[category || 'Uncategorized'] || 'bg-gray-100 text-gray-800';
  };

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
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Saved Templates</h2>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <WorkflowIcon className="h-16 w-16 text-gray-400" />
                <h2 className="text-xl font-semibold">No Templates Found</h2>
                <p className="text-gray-500 max-w-md">You haven't saved any templates yet.</p>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="relative overflow-hidden border-0 shadow-lg transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl bg-white group"
                  style={{ boxShadow: '0 4px 24px 0 rgba(80, 80, 120, 0.08)' }}
                >
                  {/* Accent border */}
                  <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary to-blue-400 rounded-r-lg" />
                  <CardHeader className="pb-2 pl-6">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-primary">
                          {template.name}
                        </CardTitle>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mt-1 shadow-sm">
                          {template.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                    <CardDescription className="mt-3 text-gray-500 text-base leading-relaxed">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-6 pb-6 pr-6 pt-2">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        <Bookmark className="h-4 w-4 mr-1 text-blue-400" />
                        {template.data?.nodes?.length || 0} nodes
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {template.data?.edges?.length || 0} connections
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <Clock className="h-3 w-3" />
                      Created: {formatDate(template.data?.created_at)}
                    </div>
                    <Button
                      onClick={() => handleTemplateSelect(template as WorkflowTemplate)}
                      className="w-full font-bold py-2 bg-gradient-to-r from-primary to-blue-500 text-white shadow-md hover:from-blue-600 hover:to-primary hover:shadow-lg transition-all"
                    >
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* This area is now reserved for saved templates. Remove hardcoded templates grid. */}
        {/* Optionally, add a placeholder or saved templates list here in the future. */}
        {/* Divider for clarity */}
        <div className="border-t my-8" />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">My Workflows</h2>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold">My Workflows</h1>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => navigate("/workflow/new")}
                size="sm"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <PlusCircle className="h-4 w-4" /> Create New Workflow
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search workflows..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="whitespace-nowrap">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setCategoryFilter(null)}
              >
                <Search className="h-4 w-4" />
                {categoryFilter || "All Categories"}
              </Button>
            </div>
          </div>

          {/* Categories (badges) */}
          {!categoryFilter && categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {categories.map(category => (
                <Badge 
                  key={category} 
                  className={`cursor-pointer ${getCategoryColor(category)}`} 
                  variant="outline"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Workflows grid or empty state */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading workflows...</p>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <WorkflowIcon className="h-16 w-16 text-gray-400" />
                <h2 className="text-xl font-semibold">
                  {searchTerm || categoryFilter 
                    ? "No matching workflows found" 
                    : "No Workflows Found"}
                </h2>
                <p className="text-gray-500 max-w-md">
                  {searchTerm || categoryFilter 
                    ? "Try adjusting your search or filter criteria." 
                    : "You haven't created any workflows yet. Create your first workflow to automate tasks and processes."}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter(null);
                    }}
                    variant="outline"
                    className={searchTerm || categoryFilter ? "mt-2" : "hidden"}
                  >
                    Clear Filters
                  </Button>
                  <Button 
                    onClick={() => navigate("/workflow/new")}
                    className="mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkflows.map((workflow) => (
                <Card 
                  key={workflow.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleView(workflow.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        {workflow.category && (
                          <Badge className={`mt-1 ${getCategoryColor(workflow.category)}`} variant="outline">
                            {workflow.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={(e) => handleDuplicate(workflow, e)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => handleDelete(workflow.id, e)}>
                          <Star className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {workflow.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3" />
                      Created: {formatDate(workflow.data?.created_at)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {workflow.data?.nodes?.length || 0} nodes • {workflow.data?.edges?.length || 0} connections
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(workflow.id);
                      }}
                    >
                      View Workflow
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 