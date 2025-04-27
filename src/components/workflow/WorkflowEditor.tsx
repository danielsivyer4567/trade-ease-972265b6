import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Workflow, WorkflowNode, WorkflowEdge, WorkflowTemplate } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Play, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';
import { WorkflowExecutionStatus } from './WorkflowExecutionStatus';
import { WorkflowTemplateSelector } from './WorkflowTemplateSelector';

// Node types
const nodeTypes = {
  customerNode: CustomerNode,
  jobNode: JobNode,
  taskNode: TaskNode,
  quoteNode: QuoteNode,
  automationNode: AutomationNode,
  messagingNode: MessagingNode,
  visionNode: VisionNode,
  socialNode: SocialNode,
  customNode: CustomNode
};

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave: (workflow: Workflow) => void;
}

export function WorkflowEditor({ workflow, onSave }: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.data.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.data.edges || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!workflow);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedWorkflow = {
        ...workflow,
        data: {
          nodes,
          edges
        }
      };

      const { success, error } = await WorkflowService.updateWorkflow(updatedWorkflow);
      if (!success) throw error;

      onSave(updatedWorkflow);
      toast.success('Workflow saved successfully');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to save workflow'));
      toast.error('Failed to save workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    setIsLoading(true);
    try {
      const { success, executionId, error } = await WorkflowService.executeWorkflow(workflow.id);
      if (!success) throw error;

      setExecutionId(executionId);
      toast.success('Workflow execution started');
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      setError(error instanceof Error ? error : new Error('Failed to execute workflow'));
      toast.error('Failed to execute workflow');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100, y: 100 },
      data: { label: type }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleTemplateSelect = async (template: WorkflowTemplate) => {
    if (template.id === 'blank') {
      setShowTemplateSelector(false);
      return;
    }

    setIsLoading(true);
    try {
      const { success, workflow: newWorkflow, error } = await WorkflowService.createWorkflowFromTemplate(template.id);
      if (!success) throw error;

      setNodes(newWorkflow.data.nodes);
      setEdges(newWorkflow.data.edges);
      setShowTemplateSelector(false);
      onSave(newWorkflow);
      toast.success('Workflow template loaded successfully');
    } catch (error) {
      console.error('Failed to load template:', error);
      setError(error instanceof Error ? error : new Error('Failed to load template'));
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  if (showTemplateSelector) {
    return <WorkflowTemplateSelector onSelect={handleTemplateSelect} />;
  }

  return (
    <div className="h-full w-full">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTemplateSelector(true)}
        >
          Change Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Execute
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Card className="p-2">
          <div className="flex flex-col space-y-2">
            {Object.keys(nodeTypes).map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleAddNode(type)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {type}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        {executionId && <WorkflowExecutionStatus executionId={executionId} />}
      </ReactFlow>
    </div>
  );
}

// Node Components
function CustomerNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function JobNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function TaskNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function QuoteNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function AutomationNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function MessagingNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function VisionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function SocialNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-pink-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
}

function CustomNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-400">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
        </div>
      </div>
    </div>
  );
} 