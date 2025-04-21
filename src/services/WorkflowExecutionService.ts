import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AutomationIntegrationService } from './AutomationIntegrationService';

/**
 * Service for executing workflows and handling workflow stages
 */
export const WorkflowExecutionService = {
  /**
   * Execute a workflow by ID
   */
  executeWorkflow: async (workflowId: string, context?: Record<string, any>) => {
    try {
      // Load the workflow
      const { data: workflow, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();
        
      if (workflowError || !workflow) {
        throw new Error(`Workflow not found: ${workflowError?.message || ''}`);
      }
      
      // Create workflow execution log
      const { data: logData, error: logError } = await supabase
        .from('workflow_logs')
        .insert({
          workflow_id: workflowId,
          status: 'in_progress',
          context: context || {}
        })
        .select('id')
        .single();
        
      if (logError || !logData) {
        throw new Error(`Failed to create workflow log: ${logError?.message || ''}`);
      }
      
      const logId = logData.id;
      
      // Process workflow nodes
      if (workflow.data?.nodes) {
        // Sort nodes by position or dependencies to determine execution order
        const nodes = workflow.data.nodes;
        const edges = workflow.data.edges || [];
        
        // Get automation node if present
        const automationNode = nodes.find(node => node.type === 'automationNode');
        if (automationNode) {
          await executeAutomationNode(automationNode, workflow, logId);
        }
        
        // Execute other nodes based on type
        for (const node of nodes) {
          if (node.type !== 'automationNode') {
            await executeWorkflowNode(node, workflow, logId);
          }
        }
      }
      
      // Mark workflow log as complete
      await supabase
        .from('workflow_logs')
        .update({
          status: 'success',
          completed_at: new Date().toISOString()
        })
        .eq('id', logId);
      
      return { success: true, logId };
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Advance a target through workflow stages
   */
  advanceWorkflowStage: async (targetType: string, targetId: string, nextStage: string) => {
    try {
      // Choose the appropriate table based on target type
      let table: string;
      
      switch (targetType) {
        case 'customer':
          table = 'customer_workflow_stages';
          break;
        case 'job':
          table = 'job_workflow_stages';
          break;
        case 'quote':
          table = 'quote_workflow_stages';
          break;
        default:
          throw new Error(`Unsupported target type: ${targetType}`);
      }
      
      // Update the stage record
      const { data, error } = await supabase
        .from(table)
        .update({
          current_stage: nextStage,
          updated_at: new Date().toISOString()
        })
        .eq(`${targetType}_id`, targetId)
        .select('workflow_id')
        .single();
        
      if (error) {
        throw new Error(`Failed to update workflow stage: ${error.message}`);
      }
      
      // Execute the workflow if needed based on new stage
      if (data?.workflow_id) {
        await WorkflowExecutionService.executeWorkflow(data.workflow_id, {
          targetType,
          targetId,
          stage: nextStage
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to advance workflow stage:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Complete a workflow for a target
   */
  completeWorkflow: async (targetType: string, targetId: string) => {
    try {
      // Choose the appropriate table based on target type
      let table: string;
      
      switch (targetType) {
        case 'customer':
          table = 'customer_workflow_stages';
          break;
        case 'job':
          table = 'job_workflow_stages';
          break;
        case 'quote':
          table = 'quote_workflow_stages';
          break;
        default:
          throw new Error(`Unsupported target type: ${targetType}`);
      }
      
      // Update the stage record
      const { error } = await supabase
        .from(table)
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq(`${targetType}_id`, targetId);
        
      if (error) {
        throw new Error(`Failed to complete workflow: ${error.message}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to complete workflow:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get the current workflow stage for a target
   */
  getWorkflowStage: async (targetType: string, targetId: string) => {
    try {
      // Choose the appropriate table based on target type
      let table: string;
      
      switch (targetType) {
        case 'customer':
          table = 'customer_workflow_stages';
          break;
        case 'job':
          table = 'job_workflow_stages';
          break;
        case 'quote':
          table = 'quote_workflow_stages';
          break;
        default:
          throw new Error(`Unsupported target type: ${targetType}`);
      }
      
      // Get the stage record
      const { data, error } = await supabase
        .from(table)
        .select('current_stage, status, workflow_id')
        .eq(`${targetType}_id`, targetId)
        .single();
        
      if (error) {
        throw new Error(`Failed to get workflow stage: ${error.message}`);
      }
      
      return { 
        success: true, 
        stage: data.current_stage,
        status: data.status,
        workflowId: data.workflow_id
      };
    } catch (error) {
      console.error('Failed to get workflow stage:', error);
      return { success: false, error: error.message };
    }
  }
};

// Helper functions for executing workflow nodes

async function executeAutomationNode(node: any, workflow: any, logId: string) {
  try {
    // Log the action
    const { data: actionLog, error: actionLogError } = await supabase
      .from('workflow_action_logs')
      .insert({
        workflow_log_id: logId,
        node_id: node.id,
        node_type: node.type,
        action: 'execute_automation',
        status: 'in_progress'
      })
      .select('id')
      .single();
      
    if (actionLogError) {
      console.error(`Failed to log automation action: ${actionLogError.message}`);
      return;
    }
    
    const actionLogId = actionLog.id;
    
    // Extract automation ID and target info
    const automationId = node.data?.automationId;
    const targetType = node.data?.targetType || workflow.data?.targetType;
    const targetId = node.data?.targetId || workflow.data?.targetId;
    
    if (!automationId || !targetType || !targetId) {
      await updateActionLog(actionLogId, 'error', 'Missing automation details');
      return;
    }
    
    // Execute the automation
    const result = await AutomationIntegrationService.triggerAutomation(automationId, {
      targetType,
      targetId,
      additionalData: { workflowId: workflow.id }
    });
    
    if (result.success) {
      await updateActionLog(actionLogId, 'success');
    } else {
      await updateActionLog(actionLogId, 'error', result.error);
    }
  } catch (error) {
    console.error('Failed to execute automation node:', error);
  }
}

async function executeWorkflowNode(node: any, workflow: any, logId: string) {
  try {
    // Different node types need different handling
    switch (node.type) {
      case 'customerNode':
        return await executeCustomerNode(node, workflow, logId);
      case 'jobNode':
        return await executeJobNode(node, workflow, logId);
      case 'quoteNode':
        return await executeQuoteNode(node, workflow, logId);
      case 'taskNode':
        return await executeTaskNode(node, workflow, logId);
      case 'messagingNode':
      case 'emailNode':
      case 'whatsappNode':
        return await executeMessagingNode(node, workflow, logId);
      case 'visionNode':
        return await executeVisionNode(node, workflow, logId);
      case 'customNode':
      case 'socialNode':
        return await executeCustomNode(node, workflow, logId);
      default:
        console.log(`No execution handler for node type: ${node.type}`);
        return;
    }
  } catch (error) {
    console.error(`Failed to execute workflow node ${node.type}:`, error);
  }
}

async function executeCustomerNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'process_customer',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log customer node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the customer node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function executeJobNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'process_job',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log job node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the job node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function executeQuoteNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'process_quote',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log quote node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the quote node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function executeTaskNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'process_task',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log task node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the task node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function executeMessagingNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'send_message',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log messaging node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the messaging node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function executeVisionNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'analyze_vision',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log vision node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the vision node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function executeCustomNode(node: any, workflow: any, logId: string) {
  // Log the action
  const { data: actionLog, error: actionLogError } = await supabase
    .from('workflow_action_logs')
    .insert({
      workflow_log_id: logId,
      node_id: node.id,
      node_type: node.type,
      action: 'execute_custom',
      status: 'in_progress',
      data: node.data
    })
    .select('id')
    .single();
    
  if (actionLogError) {
    console.error(`Failed to log custom node action: ${actionLogError.message}`);
    return;
  }
  
  // Here you would implement the custom node logic
  // For now, we'll just log and complete the action
  await updateActionLog(actionLog.id, 'success');
}

async function updateActionLog(actionLogId: string, status: 'success' | 'error' | 'skipped', errorMessage?: string) {
  try {
    const update: any = {
      status,
      completed_at: new Date().toISOString()
    };
    
    if (errorMessage) {
      update.error_message = errorMessage;
    }
    
    await supabase
      .from('workflow_action_logs')
      .update(update)
      .eq('id', actionLogId);
  } catch (error) {
    console.error('Failed to update action log:', error);
  }
} 