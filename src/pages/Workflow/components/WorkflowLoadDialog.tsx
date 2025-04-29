import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

interface Workflow {
  id: string;
  name: string;
  description: string;
  flow: any;
  createdAt: string;
}

interface WorkflowLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (instance: any) => void;
}

export function WorkflowLoadDialog({
  open,
  onOpenChange,
  onLoad,
}: WorkflowLoadDialogProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    if (open) {
      // Load workflows from localStorage
      const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      setWorkflows(savedWorkflows);
    }
  }, [open]);

  const handleLoad = (workflow: Workflow) => {
    try {
      onLoad(workflow.flow);
      toast.success(`Loaded workflow: ${workflow.name}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error loading workflow:', error);
      toast.error('Failed to load workflow');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Load Workflow</DialogTitle>
          <DialogDescription>
            Select a workflow to load from your saved workflows.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No saved workflows found
                  </TableCell>
                </TableRow>
              ) : (
                workflows.map((workflow) => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">
                      {workflow.name}
                    </TableCell>
                    <TableCell>
                      {workflow.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      {formatDate(workflow.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(workflow)}
                      >
                        Load
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
