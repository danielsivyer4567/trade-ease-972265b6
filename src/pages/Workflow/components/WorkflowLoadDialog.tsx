
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Folder, Clock } from "lucide-react";
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export interface WorkflowLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadWorkflow: (id: string) => void;
}

export const WorkflowLoadDialog: React.FC<WorkflowLoadDialogProps> = ({
  open,
  onOpenChange,
  onLoadWorkflow,
}) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('workflows');

  const handleLoadData = async () => {
    setIsLoading(true);
    try {
      const [workflowsRes, templatesRes] = await Promise.all([
        WorkflowService.getUserWorkflows(),
        WorkflowService.getUserTemplates()
      ]);
      
      if (workflowsRes.success && workflowsRes.workflows) {
        setWorkflows(workflowsRes.workflows);
      }
      
      if (templatesRes.success && templatesRes.templates) {
        setTemplates(templatesRes.templates);
      }
    } catch (error) {
      console.error('Error loading workflows', error);
      toast.error('Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      handleLoadData();
    }
  }, [open]);

  const handleLoad = (id: string) => {
    onLoadWorkflow(id);
    onOpenChange(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const filteredWorkflows = workflows.filter(
    w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (w.description && w.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTemplates = templates.filter(
    t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Load Workflow</DialogTitle>
          <DialogDescription>
            Select a workflow or template to load
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search workflows..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="workflows" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="workflows">My Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 max-h-[50vh]">
            <TabsContent value="workflows" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">Loading workflows...</div>
              ) : filteredWorkflows.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No workflows match your search" : "No workflows found"}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {filteredWorkflows.map((workflow) => (
                    <Card key={workflow.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {workflow.description || "No description"}
                        </CardDescription>
                      </CardHeader>
                      <div className="px-6 py-1 text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(workflow.updated_at || workflow.data?.updated_at)}
                      </div>
                      <CardFooter className="bg-muted/20 pt-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleLoad(workflow.id)}
                        >
                          Load Workflow
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-8">Loading templates...</div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No templates match your search" : "No templates found"}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 mr-2 text-blue-500" />
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {template.description || "No description"}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="bg-muted/20 pt-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleLoad(template.id)}
                        >
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
