
import React, { useEffect, useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { toast } from 'sonner';
import { Folder, Clock, Workflow as WorkflowIcon, Plus, Eye, Trash2, Copy } from "lucide-react";
import { GlassCard } from '@/components/ui/GlassCard';

export default function WorkflowListPage() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
      // Create a duplicate without the ID
      const newWorkflow = {
        ...workflow,
        id: undefined,
        name: `${workflow.name} (Copy)`,
      };
      
      const { success, id } = await WorkflowService.saveWorkflow(newWorkflow);
      if (success && id) {
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

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Workflows</h1>
          <Button 
            onClick={() => navigate("/workflow")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create New Workflow
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <p>Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <WorkflowIcon className="h-16 w-16 text-gray-400" />
              <h2 className="text-xl font-semibold">No Workflows Found</h2>
              <p className="text-gray-500 max-w-md">
                You haven't created any workflows yet. Create your first workflow to automate tasks and processes.
              </p>
              <Button 
                onClick={() => navigate("/workflow")}
                className="mt-2"
              >
                Create Your First Workflow
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleView(workflow.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{workflow.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={(e) => handleDuplicate(workflow, e)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => handleDelete(workflow.id, e)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {workflow.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                    <Clock className="h-3 w-3" />
                    Created: {formatDate(workflow.data?.created_at)}
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
