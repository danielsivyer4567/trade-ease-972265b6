import { Database } from '@/integrations/supabase/types';

export type Workflow = Database['public']['Tables']['workflows']['Row'];
export type WorkflowNode = Database['public']['Tables']['workflow_nodes']['Row'];
export type WorkflowEdge = Database['public']['Tables']['workflow_edges']['Row'];
export type WorkflowExecution = Database['public']['Tables']['workflow_executions']['Row'];

export type NodeType = 
  | 'customerNode'
  | 'jobNode'
  | 'taskNode'
  | 'quoteNode'
  | 'customNode'
  | 'visionNode'
  | 'automationNode'
  | 'messagingNode'
  | 'emailNode'
  | 'whatsappNode'
  | 'socialNode';

export interface NodeData {
  label: string;
  description?: string;
  automationId?: number;
  targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
  targetId?: string;
  [key: string]: any;
}

export interface EdgeData {
  label?: string;
  type?: string;
  [key: string]: any;
}

export interface WorkflowData {
  nodes: Array<{
    id: string;
    type: NodeType;
    position: { x: number; y: number };
    data: NodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    data?: EdgeData;
  }>;
}

export interface WorkflowExecutionData {
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: Array<{
    nodeId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: string;
    completedAt?: string;
    error?: string;
    output?: any;
  }>;
  input?: any;
  output?: any;
}

export interface CreateWorkflowParams {
  name: string;
  description?: string;
  data: WorkflowData;
  category?: string;
  isTemplate?: boolean;
}

export interface UpdateWorkflowParams {
  id: string;
  name?: string;
  description?: string;
  data?: WorkflowData;
  category?: string;
  isTemplate?: boolean;
}

export interface ExecuteWorkflowParams {
  workflowId: string;
  input?: any;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  recommended: boolean;
} 