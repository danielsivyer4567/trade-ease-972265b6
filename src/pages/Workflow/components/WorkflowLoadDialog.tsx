
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkflowService } from '@/services/WorkflowService';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

export interface WorkflowLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadWorkflow: (workflowId: string) => void;
  trigger?: React.ReactNode;
}

export const WorkflowLoadDialog = ({ open, onOpenChange, onLoadWorkflow, trigger }: WorkflowLoadDialogProps) => {
  const [search, setSearch] = useState('');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadWorkflows();
    }
  }, [open]);

  const loadWorkflows = async () => {
    setIsLoading(true);
    
    try {
      // Load user workflows
      const workflowsResponse = await WorkflowService.getUserWorkflows();
      if (workflowsResponse.success && workflowsResponse.workflows) {
        setWorkflows(workflowsResponse.workflows);
      } else {
        setWorkflows([]);
      }
      
      // Load templates
      const templatesResponse = await WorkflowService.getUserTemplates();
      if (templatesResponse.success && templatesResponse.templates) {
        setTemplates(templatesResponse.templates);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast.error('Failed to load workflows');
      setWorkflows([]);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectWorkflow = (id: string) => {
    onLoadWorkflow(id);
    onOpenChange(false);
  };

  // Filter workflows and templates based on search
  const filteredWorkflows = workflows.filter(wf => 
    wf.name.toLowerCase().includes(search.toLowerCase()) ||
    (wf.description && wf.description.toLowerCase().includes(search.toLowerCase()))
  );
  
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Load Workflow</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Load Workflow</DialogTitle>
          <DialogDescription>
            Select an existing workflow or template to load
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative my-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search workflows..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <ScrollArea className="max-h-[50vh]">
          {isLoading ? (
            <div className="text-center py-4">Loading workflows...</div>
          ) : (
            <div className="space-y-4">
              {filteredWorkflows.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Your Workflows</h3>
                  <div className="space-y-2">
                    {filteredWorkflows.map(workflow => (
                      <div
                        key={workflow.id}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectWorkflow(workflow.id)}
                      >
                        <div className="font-medium">{workflow.name}</div>
                        {workflow.description && (
                          <div className="text-sm text-gray-500">{workflow.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {filteredTemplates.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Templates</h3>
                  <div className="space-y-2">
                    {filteredTemplates.map(template => (
                      <div
                        key={template.id}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectWorkflow(template.id)}
                      >
                        <div className="font-medium">{template.name}</div>
                        {template.description && (
                          <div className="text-sm text-gray-500">{template.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {filteredWorkflows.length === 0 && filteredTemplates.length === 0 && (
                <div className="text-center py-4">
                  {search ? `No workflows matching "${search}"` : 'No workflows available'}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
