import { supabase } from '@/integrations/supabase/client';
import { WorkflowService } from './WorkflowService';
import { NodeType, WorkflowExecutionData } from '@/types/workflow';
import { AutomationIntegrationService } from './AutomationIntegrationService';
import { CustomerService } from './CustomerService';
import { JobService } from './JobService';
import { TaskService } from './TaskService';
import { QuoteService } from './QuoteService';
import { MessagingService } from './MessagingService';
import { VisionService } from './VisionService';
import { SocialService } from './SocialService';
import { logger } from '@/utils/logger';

export const WorkflowExecutorService = {
  /**
   * Execute a workflow node based on its type
   */
  executeNode: async (nodeType: NodeType, nodeData: any, input: any = {}): Promise<{ success: boolean; output?: any; error?: any }> => {
    try {
      logger.info(`Executing node of type: ${nodeType}`, { nodeData, input });

      switch (nodeType) {
        case 'customerNode':
          return await executeCustomerNode(nodeData, input);
        case 'jobNode':
          return await executeJobNode(nodeData, input);
        case 'taskNode':
          return await executeTaskNode(nodeData, input);
        case 'quoteNode':
          return await executeQuoteNode(nodeData, input);
        case 'automationNode':
          return await executeAutomationNode(nodeData, input);
        case 'messagingNode':
        case 'emailNode':
        case 'whatsappNode':
          return await executeMessagingNode(nodeType, nodeData, input);
        case 'visionNode':
          return await executeVisionNode(nodeData, input);
        case 'socialNode':
          return await executeSocialNode(nodeData, input);
        case 'customNode':
          return await executeCustomNode(nodeData, input);
        default:
          throw new Error(`Unsupported node type: ${nodeType}`);
      }
    } catch (error) {
      logger.error(`Failed to execute ${nodeType} node:`, error);
      return { success: false, error };
    }
  },

  /**
   * Execute a complete workflow
   */
  executeWorkflow: async (workflowId: string, input: any = {}): Promise<{ success: boolean; executionId?: string; error?: any }> => {
    try {
      logger.info(`Starting workflow execution: ${workflowId}`, { input });

      // Get workflow data
      const { success: getSuccess, workflow, error: getError } = await WorkflowService.getWorkflow(workflowId);
      if (!getSuccess || !workflow) {
        throw getError || new Error('Failed to get workflow');
      }

      // Start workflow execution
      const { success: execSuccess, executionId, error: execError } = await WorkflowService.executeWorkflow({
        workflowId,
        input
      });

      if (!execSuccess || !executionId) {
        throw execError || new Error('Failed to start workflow execution');
      }

      // Execute workflow nodes
      const executionData: WorkflowExecutionData = {
        status: 'running',
        steps: [],
        input
      };

      const nodes = workflow.data.nodes;
      const edges = workflow.data.edges;

      // Create a map of node dependencies
      const nodeDependencies = new Map<string, string[]>();
      edges.forEach(edge => {
        if (!nodeDependencies.has(edge.target)) {
          nodeDependencies.set(edge.target, []);
        }
        nodeDependencies.get(edge.target)?.push(edge.source);
      });

      // Execute nodes in dependency order
      const executedNodes = new Set<string>();
      const nodeOutputs = new Map<string, any>();

      while (executedNodes.size < nodes.length) {
        for (const node of nodes) {
          // Skip if node already executed
          if (executedNodes.has(node.id)) continue;

          // Check if all dependencies are executed
          const dependencies = nodeDependencies.get(node.id) || [];
          if (dependencies.every(dep => executedNodes.has(dep))) {
            // Get input from parent nodes
            const nodeInput = dependencies.reduce((acc, dep) => {
              return { ...acc, ...nodeOutputs.get(dep) };
            }, input);

            // Execute node
            const { success, output, error } = await WorkflowExecutorService.executeNode(
              node.type,
              node.data,
              nodeInput
            );

            // Record execution step
            executionData.steps.push({
              nodeId: node.id,
              status: success ? 'completed' : 'failed',
              startedAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
              error: error?.message,
              output
            });

            if (success && output) {
              nodeOutputs.set(node.id, output);
            }

            executedNodes.add(node.id);
          }
        }
      }

      // Update execution status
      const hasErrors = executionData.steps.some(step => step.status === 'failed');
      executionData.status = hasErrors ? 'failed' : 'completed';
      executionData.output = nodeOutputs;

      // Update execution record
      const { error: updateError } = await supabase
        .from('workflow_executions')
        .update({
          status: executionData.status,
          completed_at: new Date().toISOString(),
          execution_data: executionData
        })
        .eq('id', executionId);

      if (updateError) throw updateError;

      logger.info(`Workflow execution completed: ${workflowId}`, { executionId, status: executionData.status });
      return { success: true, executionId };
    } catch (error) {
      logger.error(`Failed to execute workflow: ${workflowId}`, error);
      return { success: false, error };
    }
  }
};

// Node type-specific execution functions
async function executeCustomerNode(nodeData: any, input: any) {
  try {
    const { success, customer, error } = await CustomerService.createCustomer({
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        customerId: customer.id,
        customerData: customer
      } 
    };
  } catch (error) {
    logger.error('Failed to execute customer node:', error);
    return { success: false, error };
  }
}

async function executeJobNode(nodeData: any, input: any) {
  try {
    const { success, job, error } = await JobService.createJob({
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        jobId: job.id,
        jobData: job
      } 
    };
  } catch (error) {
    logger.error('Failed to execute job node:', error);
    return { success: false, error };
  }
}

async function executeTaskNode(nodeData: any, input: any) {
  try {
    const { success, task, error } = await TaskService.createTask({
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        taskId: task.id,
        taskData: task
      } 
    };
  } catch (error) {
    logger.error('Failed to execute task node:', error);
    return { success: false, error };
  }
}

async function executeQuoteNode(nodeData: any, input: any) {
  try {
    const { success, quote, error } = await QuoteService.createQuote({
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        quoteId: quote.id,
        quoteData: quote
      } 
    };
  } catch (error) {
    logger.error('Failed to execute quote node:', error);
    return { success: false, error };
  }
}

async function executeAutomationNode(nodeData: any, input: any) {
  if (!nodeData.automationId) {
    throw new Error('Automation ID is required');
  }

  try {
    const { success, error } = await AutomationIntegrationService.triggerAutomation(
      nodeData.automationId,
      {
        targetType: nodeData.targetType,
        targetId: nodeData.targetId,
        input
      }
    );

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        automationId: nodeData.automationId,
        triggered: true
      } 
    };
  } catch (error) {
    logger.error('Failed to execute automation node:', error);
    return { success: false, error };
  }
}

async function executeMessagingNode(nodeType: NodeType, nodeData: any, input: any) {
  try {
    const { success, message, error } = await MessagingService.sendMessage({
      type: nodeType,
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        messageId: message.id,
        messageData: message
      } 
    };
  } catch (error) {
    logger.error('Failed to execute messaging node:', error);
    return { success: false, error };
  }
}

async function executeVisionNode(nodeData: any, input: any) {
  try {
    const { success, analysis, error } = await VisionService.analyzeImage({
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        analysisId: analysis.id,
        analysisData: analysis
      } 
    };
  } catch (error) {
    logger.error('Failed to execute vision node:', error);
    return { success: false, error };
  }
}

async function executeSocialNode(nodeData: any, input: any) {
  try {
    const { success, post, error } = await SocialService.createPost({
      ...nodeData,
      ...input
    });

    if (!success) throw error;

    return { 
      success: true, 
      output: { 
        postId: post.id,
        postData: post
      } 
    };
  } catch (error) {
    logger.error('Failed to execute social node:', error);
    return { success: false, error };
  }
}

async function executeCustomNode(nodeData: any, input: any) {
  try {
    // Execute custom node logic based on nodeData.handler
    if (typeof nodeData.handler !== 'function') {
      throw new Error('Custom node handler is required');
    }

    const result = await nodeData.handler(input);

    return { 
      success: true, 
      output: result
    };
  } catch (error) {
    logger.error('Failed to execute custom node:', error);
    return { success: false, error };
  }
} 