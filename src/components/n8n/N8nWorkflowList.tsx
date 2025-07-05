import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play, 
  Copy, 
  Download, 
  Upload,
  Workflow,
  Clock,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nodes: any[];
  connections: any;
  settings: any;
  staticData: any;
}

interface N8nWorkflowListProps {
  onSelectWorkflow?: (workflow: N8nWorkflow) => void;
}

export function N8nWorkflowList({ onSelectWorkflow }: N8nWorkflowListProps) {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<N8nWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<N8nWorkflow | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [n8nUrl] = useState(import.meta.env.VITE_N8N_URL || 'http://localhost:5678');
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkflows();
  }, []);

  useEffect(() => {
    const filtered = workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredWorkflows(filtered);
  }, [workflows, searchTerm]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/n8n/workflows`, {
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
        }
      });
      if (response.ok) {
        const workflowsData = await response.json();
        setWorkflows(workflowsData.data || workflowsData);
      } else {
        throw new Error('Failed to load workflows');
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast.error('Failed to load workflows. Please ensure n8n is running.');
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const createNewWorkflow = async () => {
    try {
      const response = await fetch(`/api/n8n/workflows`, {
        method: 'POST',
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `New Workflow ${Date.now()}`,
          nodes: [],
          connections: {},
          active: false,
          settings: {},
          staticData: {}
        }),
      });

      if (response.ok) {
        const newWorkflow = await response.json();
        navigate(`/workflow/edit/${newWorkflow.id}`);
        toast.success('New workflow created');
      } else {
        throw new Error('Failed to create workflow');
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast.error('Failed to create new workflow');
    }
  };

  const duplicateWorkflow = async (workflow: N8nWorkflow) => {
    try {
      const response = await fetch(`/api/n8n/workflows`, {
        method: 'POST',
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workflow,
          id: undefined,
          name: `${workflow.name} (Copy)`,
          active: false,
        }),
      });

      if (response.ok) {
        await loadWorkflows();
        toast.success('Workflow duplicated');
      } else {
        throw new Error('Failed to duplicate workflow');
      }
    } catch (error) {
      console.error('Error duplicating workflow:', error);
      toast.error('Failed to duplicate workflow');
    }
  };

  const toggleWorkflowActive = async (workflow: N8nWorkflow) => {
    try {
      const response = await fetch(`/api/n8n/workflows/${workflow.id}`, {
        method: 'PATCH',
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !workflow.active,
        }),
      });

      if (response.ok) {
        await loadWorkflows();
        toast.success(`Workflow ${workflow.active ? 'deactivated' : 'activated'}`);
      } else {
        throw new Error('Failed to toggle workflow');
      }
    } catch (error) {
      console.error('Error toggling workflow:', error);
      toast.error('Failed to toggle workflow status');
    }
  };

  const executeWorkflow = async (workflow: N8nWorkflow) => {
    try {
      const response = await fetch(`/api/n8n/workflows/${workflow.id}/execute`, {
        method: 'POST',
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        toast.success('Workflow execution started');
      } else {
        throw new Error('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast.error('Failed to execute workflow');
    }
  };

  const deleteWorkflow = async () => {
    if (!selectedWorkflow) return;

    try {
      const response = await fetch(`/api/n8n/workflows/${selectedWorkflow.id}`, {
        method: 'DELETE',
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
        }
      });

      if (response.ok) {
        await loadWorkflows();
        toast.success('Workflow deleted');
        setIsDeleteDialogOpen(false);
        setSelectedWorkflow(null);
      } else {
        throw new Error('Failed to delete workflow');
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
      toast.error('Failed to delete workflow');
    }
  };

  const exportWorkflow = async (workflow: N8nWorkflow) => {
    try {
      const response = await fetch(`/api/n8n/workflows/${workflow.id}`, {
        headers: {
          'X-N8N-API-KEY': 'n8n_api_6fe7f406f20166677dc347f597cbebda22a582e9533c4b5540d585720bcd074c8111599077d42b66',
        }
      });
      if (response.ok) {
        const workflowData = await response.json();
        const dataStr = JSON.stringify(workflowData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.success('Workflow exported');
      }
    } catch (error) {
      console.error('Error exporting workflow:', error);
      toast.error('Failed to export workflow');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading workflows...</span>
      </div>
    );
  }

  return (
    
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">n8n Workflows</h1>
          <p className="text-muted-foreground">
            Manage your automation workflows powered by n8n
          </p>
        </div>
        <Button onClick={createNewWorkflow} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Workflow</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={loadWorkflows}>
          Refresh
        </Button>
      </div>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="h-5 w-5" />
            <span>Workflows ({filteredWorkflows.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nodes</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {workflow.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={workflow.active ? "default" : "secondary"}
                      className="flex items-center space-x-1"
                    >
                      {workflow.active ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Pause className="h-3 w-3" />
                      )}
                      <span>{workflow.active ? 'Active' : 'Inactive'}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{workflow.nodes?.length || 0} nodes</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(workflow.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/workflow/edit/${workflow.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => executeWorkflow(workflow)}>
                          <Play className="mr-2 h-4 w-4" />
                          Execute
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleWorkflowActive(workflow)}>
                          {workflow.active ? (
                            <Pause className="mr-2 h-4 w-4" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          {workflow.active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateWorkflow(workflow)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportWorkflow(workflow)}>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredWorkflows.length === 0 && (
            <div className="text-center py-8">
              <Workflow className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new workflow.
              </p>
              <div className="mt-6">
                <Button onClick={createNewWorkflow}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Workflow
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedWorkflow?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteWorkflow}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 