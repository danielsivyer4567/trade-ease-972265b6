// Workflow List page with modern card layout and builder integration
import React, { useEffect, useState } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Workflow as WorkflowIcon, Edit2, Calendar, Zap, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkflowService } from '@/services/WorkflowService';
import { Workflow } from '@/types/workflow';
import { toast } from 'sonner';
import { WorkflowNavigation } from './components/WorkflowNavigation';

export default function WorkflowList() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const result = await WorkflowService.listWorkflows();
      if (result.success && result.workflows) {
        setWorkflows(result.workflows);
      } else {
        toast.error('Failed to load workflows');
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/workflow/edit/${id}`);
  };

  const handleAddToBuilder = (workflow: Workflow) => {
    navigate('/workflow', { 
      state: { 
        addWorkflow: true,
        workflowId: workflow.id,
        workflowName: workflow.name,
        workflowDescription: workflow.description
      } 
    });
  };

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <WorkflowNavigation />
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <WorkflowIcon className="h-6 w-6 text-blue-600" />
                My Workflows
              </h1>
              <p className="text-muted-foreground mt-1">
                Create, manage, and implement workflow processes for your business
              </p>
            </div>
            <Button onClick={() => navigate('/workflow/new')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Workflows Grid */}
        {loading ? (
          <div className="text-center py-16 text-lg">Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="text-center p-10 border border-dashed rounded-md">
            <p className="text-muted-foreground">No workflows found.</p>
            <Button onClick={() => navigate('/workflow/new')} className="mt-4">Create your first workflow</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      {workflow.category && (
                        <Badge variant="outline">{workflow.category}</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="mt-1">{workflow.description || 'No description provided'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium flex items-center text-amber-600">
                        <FileText className="h-4 w-4 mr-1" /> Details:
                      </p>
                      <div className="mt-1 text-sm space-y-1">
                        <div className="flex items-center">
                          <span className="h-1 w-1 bg-slate-400 rounded-full mr-2"></span>
                          Nodes: {workflow.data?.nodes?.length || 0}
                        </div>
                        <div className="flex items-center">
                          <span className="h-1 w-1 bg-slate-400 rounded-full mr-2"></span>
                          Connections: {typeof workflow.data === 'object' && workflow.data !== null ? (workflow.data as any).edges?.length || 0 : 0}
                        </div>
                        <div className="flex items-center">
                          <span className="h-1 w-1 bg-slate-400 rounded-full mr-2"></span>
                          <Calendar className="h-3 w-3 mr-1" />
                          {workflow.data?.created_at ? new Date(workflow.data.created_at).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleAddToBuilder(workflow)}
                  >
                    <Zap className="h-3 w-3" />
                    <span>Add to Builder</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600"
                    onClick={() => handleEdit(workflow.id)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
} 