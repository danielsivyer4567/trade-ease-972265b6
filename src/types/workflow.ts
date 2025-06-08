import { Database } from '@/integrations/supabase/types';

export type DatabaseWorkflow = Database['public']['Tables']['workflows']['Row'];
export type WorkflowNode = any; // Database['public']['Tables']['workflow_nodes']['Row']
export type WorkflowEdge = any; // Database['public']['Tables']['workflow_edges']['Row']
export type WorkflowExecution = any; // Database['public']['Tables']['workflow_executions']['Row']

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
  workflowDarkMode?: boolean;
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

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isUserTemplate?: boolean;
  data: {
    nodes: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
      };
      data: {
        label: string;
        [key: string]: any;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category?: string;
  is_template?: boolean;
  data: {
    nodes: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
      };
      data: {
        label: string;
        [key: string]: any;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
    created_at?: string;
    updated_at?: string;
  };
}

export interface CreateWorkflowParams {
  name: string;
  description?: string;
  category?: string;
  isTemplate?: boolean;
  data: {
    nodes: Array<{
      id: string;
      type: string;
      position: {
        x: number;
        y: number;
      };
      data: {
        label: string;
        [key: string]: any;
      };
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };
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