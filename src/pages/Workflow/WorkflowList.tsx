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
import { useWorkflowDarkMode, DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

export default function WorkflowList() {
  const navigate = useNavigate();
  const { darkMode: workflowDarkMode } = useWorkflowDarkMode();
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

  const handleEdit = (id: string | number) => {
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

  // Helper function to safely get edge count
  const getEdgeCount = (workflow: Workflow): number => {
    if (!workflow.data) return 0;
    if (typeof workflow.data !== 'object' || workflow.data === null) return 0;
    
    const data = workflow.data as any;
    return Array.isArray(data.edges) ? data.edges.length : 0;
  };

  // Helper function to safely get node count
  const getNodeCount = (workflow: Workflow): number => {
    if (!workflow.data) return 0;
    if (typeof workflow.data !== 'object' || workflow.data === null) return 0;
    
    const data = workflow.data as any;
    return Array.isArray(data.nodes) ? data.nodes.length : 0;
  };

  // Helper function to safely get creation date
  const getCreationDate = (workflow: Workflow): string => {
    if (!workflow.data) return 'Unknown date';
    if (typeof workflow.data !== 'object' || workflow.data === null) return 'Unknown date';
    
    const data = workflow.data as any;
    return data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown date';
  };

  return (
    <BaseLayout>
      <div className={`p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col min-h-full h-full ${workflowDarkMode ? 'bg-[#18140c]' : ''}`}>
        {/* Header */}
        <div className="flex flex-col gap-4">
          <WorkflowNavigation workflowDarkMode={workflowDarkMode} />
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className={`text-2xl font-bold flex items-center gap-2 ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>
                <WorkflowIcon className={`h-6 w-6 ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-blue-600'}`} />
                My Workflows
              </h1>
              <p className={`mt-1 ${workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}`}>
                Create, manage, and implement workflow processes for your business
              </p>
            </div>
            <Button 
              onClick={() => navigate('/workflow/new')} 
              className={`flex items-center gap-2 ${workflowDarkMode ? 'bg-[#bfa14a] text-[#18140c] hover:bg-[#a08838]' : ''}`}
            >
              <Plus className="h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Workflows Grid */}
        {loading ? (
          <div className={`text-center py-16 text-lg flex-grow ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className={`text-center p-10 border border-dashed rounded-md flex-grow flex flex-col justify-center ${workflowDarkMode ? 'border-[#bfa14a] text-[#ffe082]' : ''}`}>
            <p className={`${workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}`}>No workflows found.</p>
            <Button 
              onClick={() => navigate('/workflow/new')} 
              className={`mt-4 mx-auto ${workflowDarkMode ? 'bg-[#bfa14a] text-[#18140c] hover:bg-[#a08838]' : ''}`}
            >
              Create your first workflow
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-grow">
            {workflows.map((workflow) => (
              <Card 
                key={workflow.id} 
                className={`hover:shadow-md transition-shadow duration-200 ${workflowDarkMode ? 'bg-[#211c15] border-[#bfa14a]' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className={`text-lg ${workflowDarkMode ? 'text-[#bfa14a]' : ''}`}>{workflow.name}</CardTitle>
                      {workflow.category && (
                        <Badge 
                          variant="outline" 
                          className={workflowDarkMode ? 'border-[#bfa14a] text-[#ffe082]' : ''}
                        >
                          {workflow.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className={`mt-1 ${workflowDarkMode ? 'text-[#ffe082] opacity-70' : ''}`}>
                    {workflow.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className={`text-sm font-medium flex items-center ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-amber-600'}`}>
                        <FileText className="h-4 w-4 mr-1" /> Details:
                      </p>
                      <div className={`mt-1 text-sm space-y-1 ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>
                        <div className="flex items-center">
                          <span className={`h-1 w-1 rounded-full mr-2 ${workflowDarkMode ? 'bg-[#bfa14a]' : 'bg-slate-400'}`}></span>
                          Nodes: {getNodeCount(workflow)}
                        </div>
                        <div className="flex items-center">
                          <span className={`h-1 w-1 rounded-full mr-2 ${workflowDarkMode ? 'bg-[#bfa14a]' : 'bg-slate-400'}`}></span>
                          Connections: {getEdgeCount(workflow)}
                        </div>
                        <div className="flex items-center">
                          <span className={`h-1 w-1 rounded-full mr-2 ${workflowDarkMode ? 'bg-[#bfa14a]' : 'bg-slate-400'}`}></span>
                          <Calendar className="h-3 w-3 mr-1" />
                          {getCreationDate(workflow)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className={`flex justify-between pt-4 border-t ${workflowDarkMode ? 'border-[#bfa14a]' : ''}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex items-center gap-1 ${workflowDarkMode ? 'border-[#bfa14a] text-[#ffe082] hover:bg-[#211c15]' : ''}`}
                    onClick={() => handleAddToBuilder(workflow)}
                  >
                    <Zap className="h-3 w-3" />
                    <span>Add to Builder</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={workflowDarkMode ? 'text-[#bfa14a] hover:bg-[#211c15]' : 'text-blue-600'}
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