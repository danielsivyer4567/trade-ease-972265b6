import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Workflow, WorkflowNode, WorkflowEdge, WorkflowTemplate } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Play, Plus, User, Briefcase, ClipboardList, FileText, Zap, MessageSquare, Eye, Share2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { WorkflowService } from '@/services/WorkflowService';
import { WorkflowExecutionStatus } from './WorkflowExecutionStatus';
import { WorkflowTemplateSelector } from './WorkflowTemplateSelector';

// Constants for dark mode
const DARK_GOLD = '#bfa14a';
const DARK_BG = '#18140c';
const DARK_TEXT = '#ffe082';

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
  workflowDarkMode?: boolean;
}

export function WorkflowEditor({ workflow, onSave, workflowDarkMode = false }: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.data.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.data.edges || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!workflow);
  
  // Store dark mode internally to ensure it's not lost when switching views
  const [localDarkMode, setLocalDarkMode] = useState(workflowDarkMode);
  
  // Store the original dark mode value to restore it when needed
  const [originalDarkMode] = useState(workflowDarkMode);
  
  // Keep local dark mode in sync with prop
  useEffect(() => {
    console.log("workflowDarkMode prop changed to:", workflowDarkMode);
    setLocalDarkMode(workflowDarkMode);
  }, [workflowDarkMode]);
  
  // Log when template selector visibility changes
  useEffect(() => {
    console.log("Template selector visibility changed:", { 
      showTemplateSelector, 
      workflowDarkMode,
      localDarkMode 
    });
  }, [showTemplateSelector, workflowDarkMode, localDarkMode]);

  // Force dark mode to true if it was originally true
  useEffect(() => {
    if (originalDarkMode) {
      console.log("FORCING DARK MODE TO TRUE because originalDarkMode =", originalDarkMode);
      setLocalDarkMode(true);
      
      // Immediately apply dark mode to all nodes
      setTimeout(() => {
        forceApplyDarkMode();
      }, 10);
    }
  }, [showTemplateSelector]);
  
  // Force localDarkMode to match originalDarkMode when switching views
  const handleShowTemplateSelector = () => {
    console.log("Switching to template view, preserving dark mode:", originalDarkMode);
    setLocalDarkMode(originalDarkMode);
    setShowTemplateSelector(true);
  };
  
  // When returning from template selection, ensure dark mode is preserved
  const handleReturnFromTemplates = () => {
    console.log("Returning from template view, preserving dark mode:", originalDarkMode);
    setLocalDarkMode(originalDarkMode);
    setShowTemplateSelector(false);
    
    // Force reapply dark mode after returning
    setTimeout(() => {
      if (originalDarkMode) {
        forceApplyDarkMode();
      }
    }, 10);
  };

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
      data: { 
        label: type,
        workflowDarkMode // Pass the dark mode flag to the node data
      }
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
      console.log("Selecting template with workflowDarkMode =", localDarkMode);
      const { success, workflow: newWorkflow, error } = await WorkflowService.createWorkflowFromTemplate(template.id, localDarkMode);
      if (!success) throw error;

      // Ensure dark mode is applied to all nodes including those from templates
      const nodesWithDarkMode = newWorkflow.data.nodes.map(node => {
        console.log(`Processing node ${node.id} (${node.type}), current darkMode =`, node.data.workflowDarkMode);
        return {
          ...node,
          data: {
            ...node.data,
            workflowDarkMode  // Make sure this matches the current editor state
          }
        };
      });

      console.log(`Setting ${nodesWithDarkMode.length} nodes with workflowDarkMode = ${localDarkMode}`);
      setNodes(nodesWithDarkMode);
      setEdges(newWorkflow.data.edges);
      setShowTemplateSelector(false);
      onSave({
        ...newWorkflow,
        data: {
          ...newWorkflow.data,
          workflowDarkMode // Add at the root level too
        }
      });
      toast.success('Workflow template loaded successfully');
      
      // Force re-apply dark mode after a short delay to ensure it takes effect
      setTimeout(() => {
        if (localDarkMode) {
          forceApplyDarkMode();
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load template:', error);
      setError(error instanceof Error ? error : new Error('Failed to load template'));
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  // Force dark mode to all nodes - this can be called when templates still aren't showing dark mode
  const forceApplyDarkMode = () => {
    console.log("Force applying dark mode to all nodes");
    setNodes((nds) => 
      nds.map(node => {
        console.log("Node before force apply:", node.id, node.data.workflowDarkMode);
        const updatedNode = {
          ...node,
          data: { 
            ...node.data,
            workflowDarkMode: localDarkMode 
          }
        };
        console.log("Node after force apply:", node.id, updatedNode.data.workflowDarkMode);
        return updatedNode;
      })
    );
  };

  // This will ensure all existing nodes get dark mode applied on each render
  useEffect(() => {
    if (localDarkMode) {
      forceApplyDarkMode();
    }
  }, [nodes.length, localDarkMode]);

  if (showTemplateSelector) {
    return (
      <div style={localDarkMode ? { 
        background: DARK_BG, 
        color: DARK_TEXT,
        height: '100%',
        width: '100%',
        border: `3px solid ${DARK_GOLD}`
      } : {}}>
        <WorkflowTemplateSelector 
          onSelect={handleTemplateSelect} 
          workflowDarkMode={localDarkMode} 
          templates={[
            { 
              id: 'blank', 
              name: 'Blank Canvas', 
              description: 'Start with an empty canvas',
              category: 'General',
              data: { nodes: [], edges: [] }
            },
            {
              id: 'customer-journey',
              name: 'Customer Journey',
              description: 'Template for customer onboarding',
              category: 'Sales',
              data: { nodes: [], edges: [] }
            },
            {
              id: 'job-workflow',
              name: 'Job Workflow',
              description: 'Standard job process flow',
              category: 'Operations',
              data: { nodes: [], edges: [] }
            }
          ]} 
        />
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnFromTemplates}
            style={localDarkMode ? {
              backgroundColor: DARK_BG,
              color: DARK_TEXT,
              borderColor: DARK_GOLD,
            } : {}}
          >
            Back to Editor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full border border-black">
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowTemplateSelector}
          style={localDarkMode ? {
            backgroundColor: DARK_BG,
            color: DARK_TEXT,
            borderColor: DARK_GOLD,
          } : {}}
        >
          Change Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isLoading}
          style={localDarkMode ? {
            backgroundColor: DARK_BG,
            color: DARK_TEXT,
            borderColor: DARK_GOLD,
          } : {}}
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
          style={localDarkMode ? {
            backgroundColor: DARK_GOLD,
            color: '#000000',
          } : {}}
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
        <Card className="p-2" style={localDarkMode ? {
          backgroundColor: DARK_BG,
          color: DARK_TEXT,
          borderColor: DARK_GOLD,
        } : {}}>
          <div className="flex flex-col space-y-2">
            {Object.keys(nodeTypes).map((type) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleAddNode(type)}
                style={localDarkMode ? {
                  backgroundColor: DARK_BG,
                  color: DARK_TEXT,
                  borderColor: DARK_GOLD,
                } : {}}
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
        onConnect={(params) => {
          const newEdge = {
            ...params,
            type: 'animated',
            animated: true,
            style: { stroke: localDarkMode ? DARK_GOLD : '#3b82f6' },
          };
          setEdges((eds) => addEdge(newEdge, eds));
        }}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        onNodeDoubleClick={(event, node) => {
          console.log('Node double-clicked:', node);
          console.log('Node dark mode flag:', node.data.workflowDarkMode);
        }}
        onPaneClick={() => console.log('Current nodes:', nodes)}
        style={localDarkMode ? { 
          background: DARK_BG, 
          color: DARK_TEXT, 
          border: `3px solid ${DARK_GOLD}` 
        } : {}}
      >
        <Background 
          color={localDarkMode ? DARK_GOLD : undefined} 
          gap={16}
          size={1}
        />
        <Controls 
          className="!bottom-20 !left-4" 
          style={localDarkMode ? { 
            color: DARK_GOLD,
            background: DARK_BG, 
            borderColor: DARK_GOLD,
            borderWidth: '2px',
            borderStyle: 'solid'
          } : {}} 
        />
        {executionId && <WorkflowExecutionStatus executionId={executionId} />}
      </ReactFlow>
    </div>
  );
}

// Node Components
function CustomerNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#93c5fd',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#3b82f6' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#dbeafe' }}>
          <User className="h-5 w-5" style={{ color: isDarkMode ? gold : '#2563eb' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Customer'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#3b82f6' }} />
    </div>
  );
}

function JobNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#86efac',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#16a34a' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#dcfce7' }}>
          <Briefcase className="h-5 w-5" style={{ color: isDarkMode ? gold : '#16a34a' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Job'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#16a34a' }} />
    </div>
  );
}

function TaskNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#fcd34d',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#d97706' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fef3c7' }}>
          <ClipboardList className="h-5 w-5" style={{ color: isDarkMode ? gold : '#d97706' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Task'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#d97706' }} />
    </div>
  );
}

function QuoteNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#f9a8d4',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#db2777' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fce7f3' }}>
          <FileText className="h-5 w-5" style={{ color: isDarkMode ? gold : '#db2777' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Quote'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#db2777' }} />
    </div>
  );
}

function AutomationNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#fcd34d',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#dc2626' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fee2e2' }}>
          <Zap className="h-5 w-5" style={{ color: isDarkMode ? gold : '#dc2626' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Automation'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#dc2626' }} />
    </div>
  );
}

function MessagingNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#93c5fd',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#d97706' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fef3c7' }}>
          <MessageSquare className="h-5 w-5" style={{ color: isDarkMode ? gold : '#d97706' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Message'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#d97706' }} />
    </div>
  );
}

function VisionNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#a78bfa',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#7c3aed' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#ede9fe' }}>
          <Eye className="h-5 w-5" style={{ color: isDarkMode ? gold : '#7c3aed' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Vision'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#7c3aed' }} />
    </div>
  );
}

function SocialNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#f9a8d4',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#db2777' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fce7f3' }}>
          <Share2 className="h-5 w-5" style={{ color: isDarkMode ? gold : '#db2777' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Social'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#db2777' }} />
    </div>
  );
}

function CustomNode({ data }: { data: any }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#cbd5e1',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#64748b' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#f1f5f9' }}>
          <Settings className="h-5 w-5" style={{ color: isDarkMode ? gold : '#64748b' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Custom'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#64748b' }} />
    </div>
  );
} 