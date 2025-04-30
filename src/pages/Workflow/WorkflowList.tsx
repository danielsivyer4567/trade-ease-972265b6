import React, { useEffect, useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { CreateWorkflowParams } from '@/types/workflow';
import { toast } from 'sonner';
import { LayoutTemplate, Clock, Workflow as WorkflowIcon, Plus, Eye, Trash2, Copy, Filter } from "lucide-react";
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';

export default function WorkflowListPage() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const { success, workflows } = await WorkflowService.getUserWorkflows();
      if (success && workflows) {
        setWorkflows(workflows);
      } else {
        toast.error("Failed to load workflows");
      }
    } catch (error) {
      console.error("Error loading workflows:", error);
      toast.error("Failed to load workflows");
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
          toast.success("Workflow deleted");
          loadWorkflows();
        } else {
          toast.error("Failed to delete workflow");
        }
      } catch (error) {
        console.error("Error deleting workflow:", error);
        toast.error("Failed to delete workflow");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDuplicate = async (workflow: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newWorkflow: CreateWorkflowParams = {
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
        data: workflow.data,
        category: workflow.category,
        isTemplate: workflow.is_template
      };
      
      const { success, workflow: createdWorkflow } = await WorkflowService.createWorkflow(newWorkflow);
      if (success && createdWorkflow) {
        toast.success("Workflow duplicated");
        loadWorkflows();
      } else {
        toast.error("Failed to duplicate workflow");
      }
    } catch (error) {
      console.error("Error duplicating workflow:", error);
      toast.error("Failed to duplicate workflow");
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

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold">My Workflows</h1>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => navigate("/workflow")}
              size="sm"
              variant="outline"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <LayoutTemplate className="h-4 w-4" /> Templates
            </Button>
            <Button 
              onClick={() => navigate("/workflow/new")}
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> Create New Workflow
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <input
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
              <Filter className="h-4 w-4" />
              {categoryFilter || "All Categories"}
            </Button>
          </div>
        </div>

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
                  onClick={() => navigate("/workflow")}
                  className="mt-2"
                  variant="outline"
                >
                  <LayoutTemplate className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
                <Button 
                  onClick={() => navigate("/workflow/new")}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
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
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => handleDelete(workflow.id, e)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
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
                    <Eye className="h-4 w-4 mr-2" />
                    View Workflow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
