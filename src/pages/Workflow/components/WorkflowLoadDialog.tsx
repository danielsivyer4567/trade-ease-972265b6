
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { Folder, Trash2, Clock } from "lucide-react";
import { toast } from 'sonner';

interface WorkflowLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (workflowId: string) => void;
}

export function WorkflowLoadDialog({
  open,
  onOpenChange,
  onLoad
}: WorkflowLoadDialogProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      loadWorkflows();
    }
  }, [open]);

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
  };

  const handleSelect = (workflowId: string) => {
    onLoad(workflowId);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Load Workflow</DialogTitle>
          <DialogDescription>
            Select a workflow to load
          </DialogDescription>
        </DialogHeader>
        
        <div className="h-64 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p>Loading workflows...</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Folder className="h-12 w-12 mb-2" />
              <p>No saved workflows</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <div 
                  key={workflow.id} 
                  className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelect(workflow.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{workflow.name}</h4>
                      {workflow.description && (
                        <p className="text-sm text-gray-500">{workflow.description}</p>
                      )}
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(workflow.data?.created_at)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleDelete(workflow.id, e)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
