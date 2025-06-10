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
import { WorkflowService } from '@/services/WorkflowService';
import { WorkflowTemplate } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';

interface WorkflowTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (template: WorkflowTemplate) => void;
}

export function WorkflowTemplateDialog({
  open,
  onOpenChange,
  onLoad,
}: WorkflowTemplateDialogProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);

  useEffect(() => {
    if (open) {
      const fetchTemplates = async () => {
        try {
          const { success, templates } = await WorkflowService.listWorkflowTemplates();
          if (success && templates) {
            setTemplates(templates);
          } else {
            console.warn('No templates returned from service');
            setTemplates([]); // Set empty array instead of showing error
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
          setTemplates([]); // Set empty array on error
          toast.error("Failed to load workflow templates.");
        }
      };
      
      // Use a timeout to prevent immediate async issues
      const timeoutId = setTimeout(fetchTemplates, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const handleLoad = (template: WorkflowTemplate) => {
    try {
      onLoad(template);
      toast.success(`Loaded template: ${template.name}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Load Workflow from Template</DialogTitle>
          <DialogDescription>
            Select a template to start building your workflow.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No templates found
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {template.name}
                    </TableCell>
                    <TableCell>
                      {template.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isUserTemplate ? "secondary" : "outline"}>
                        {template.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(template)}
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
