import React, { useEffect, useState } from 'react';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkflowService } from '@/services/WorkflowService';
import { Workflow } from '@/types/workflow';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  return (
    <div className="container mx-auto p-4">
      <WorkflowNavigation />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Workflows</h1>
        <Button onClick={() => navigate('/workflow/new')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading workflows...</div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No workflows found</p>
          <Button onClick={() => navigate('/workflow/new')}>Create your first workflow</Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>{workflow.name}</TableCell>
                <TableCell>{workflow.description || '-'}</TableCell>
                <TableCell>{new Date(workflow.data.created_at || '').toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/workflow/edit/${workflow.id}`)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 