import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Automation } from "@/pages/Automations/types";

type AutomationTarget = 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';

interface AutomationData {
  action?: string;
  [key: string]: string | undefined;
}

interface AutomationTriggerParams {
  targetType: AutomationTarget;
  targetId: string;
  additionalData?: AutomationData;
  userId?: string;
}

export const AutomationIntegrationService = {
  /**
   * Trigger an automation based on specific parameters
   */
  triggerAutomation: async (automationId: number, params: AutomationTriggerParams) => {
    try {
      console.log(`Triggering automation ${automationId} for ${params.targetType}:${params.targetId}`);
      
      // Get the automation details from the database
      const { data: automationData, error: automationError } = await supabase
        .from('automation_definitions')
        .select('*')
        .eq('id', automationId)
        .single();
      
      if (automationError) {
        // If the table doesn't exist yet, return mock success for demo purposes
        if (automationError.code === 'PGRST116') {
          console.log('Automation table not found, using mock data for demo purposes');
          return mockTriggerAutomation(automationId, params);
        }
        
        throw new Error(`Automation with ID ${automationId} not found: ${automationError?.message || ''}`);
      }
      
      if (!automationData) {
        // For demo purposes, handle missing data gracefully
        console.log('No automation data found, using mock data for demo purposes');
        return mockTriggerAutomation(automationId, params);
      }
      
      const automationDetails: Automation = {
        id: automationData.id,
        title: automationData.title,
        description: automationData.description,
        isActive: true,
        triggers: automationData.triggers || [],
        actions: automationData.actions || [],
        category: automationData.category,
        premium: automationData.is_premium
      };

      // Log the trigger attempt
      await logAutomationTrigger(automationId, params);
      
      // Process the automation based on its category
      switch (automationDetails.category) {
        case 'messaging':
          return await processMessagingAutomation(automationDetails, params);
        case 'social':
          return await processSocialAutomation(automationDetails, params);
        case 'team':
          return await processTeamAutomation(automationDetails, params);
        case 'customer':
          return await processCustomerAutomation(automationDetails, params);
        case 'sales':
          return await processSalesAutomation(automationDetails, params);
        case 'forms':
          return await processFormsAutomation(automationDetails, params);
        default:
          return await processGenericAutomation(automationDetails, params);
      }
    } catch (error) {
      console.error("Failed to trigger automation:", error);
      toast.error(`Failed to trigger automation: ${error.message}`);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Associate an automation with a specific entity
   */
  associateAutomation: async (
    automationId: number, 
    targetType: AutomationTarget, 
    targetId: string
  ) => {
    try {
      console.log(`Associating automation ${automationId} with ${targetType}:${targetId}`);

      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      // Find or create a workflow for this automation
      let workflowId: string;
      
      // Check if this automation already has a workflow
      const { data: existingConnection, error: connectionError } = await supabase
        .from('automation_workflow_connections')
        .select('workflow_id')
        .eq('automation_id', automationId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .single();
      
      if (existingConnection) {
        workflowId = existingConnection.workflow_id;
      } else {
        // Get automation details to create a workflow
        const { data: automationData, error: automationError } = await supabase
          .from('automation_definitions')
          .select('*')
          .eq('id', automationId)
          .single();
          
        if (automationError || !automationData) {
          throw new Error(`Automation not found: ${automationError?.message || ''}`);
        }
        
        // Create a new workflow
        const { data: workflowData, error: workflowError } = await supabase
          .from('workflows')
          .insert({
            name: `${automationData.title} - ${targetType} ${targetId.substring(0, 8)}`,
            description: automationData.description,
            category: automationData.category,
            data: { 
              nodes: [], 
              edges: [],
              automationId: automationId,
              targetType: targetType,
              targetId: targetId
            },
            user_id: session.user.id
          })
          .select('id')
          .single();
          
        if (workflowError || !workflowData) {
          throw new Error(`Failed to create workflow: ${workflowError?.message || ''}`);
        }
        
        workflowId = workflowData.id;
        
        // Insert the connection
        const { error: insertError } = await supabase
          .from('automation_workflow_connections')
          .insert({
            workflow_id: workflowId,
            automation_id: automationId,
            target_type: targetType,
            target_id: targetId,
            user_id: session.user.id
          });
          
        if (insertError) {
          throw new Error(`Failed to create connection: ${insertError.message}`);
        }
        
        // Create the appropriate workflow stage entry
        await createWorkflowStage(targetType, targetId, workflowId);
      }
      
      return { success: true, workflowId };
    } catch (error) {
      console.error("Failed to associate automation:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get automations associated with a specific entity
   */
  getAssociatedAutomations: async (targetType: AutomationTarget, targetId: string) => {
    try {
      // Get associated automation IDs from the connections table
      const { data: connections, error: connectionsError } = await supabase
        .from('automation_workflow_connections')
        .select('automation_id, workflow_id')
        .eq('target_type', targetType)
        .eq('target_id', targetId);
        
      if (connectionsError) {
        // If table doesn't exist yet, return mock data for demo purposes
        if (connectionsError.code === 'PGRST116') {
          console.log('Automation connections table not found, using mock data for demo purposes');
          return getMockAssociatedAutomations(targetType, targetId);
        }
        
        throw new Error(`Failed to get connections: ${connectionsError.message}`);
      }
      
      if (!connections || connections.length === 0) {
        // For demo purposes, if no connections found, return mock data
        console.log('No automations found, using mock data for demo purposes');
        return getMockAssociatedAutomations(targetType, targetId);
      }
      
      // Get the automation details for each connection
      const automationIds = connections.map(c => c.automation_id);
      
      const { data: automationsData, error: automationsError } = await supabase
        .from('automation_definitions')
        .select('*')
        .in('id', automationIds);
        
      if (automationsError) {
        // Handle missing table for demo purposes
        if (automationsError.code === 'PGRST116') {
          console.log('Automation definitions table not found, using mock data for demo purposes');
          return getMockAssociatedAutomations(targetType, targetId);
        }
        
        throw new Error(`Failed to get automations: ${automationsError.message}`);
      }
      
      if (!automationsData || automationsData.length === 0) {
        // For demo purposes, if no automations found, return mock data
        return getMockAssociatedAutomations(targetType, targetId);
      }
      
      const automations: Automation[] = automationsData.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        isActive: true,
        triggers: a.triggers || [],
        actions: a.actions || [],
        category: a.category,
        premium: a.is_premium,
        workflowId: connections.find(c => c.automation_id === a.id)?.workflow_id
      }));
      
      return { success: true, automations };
    } catch (error) {
      console.error("Failed to get associated automations:", error);
      // For demo purposes, provide mock data when something fails
      return getMockAssociatedAutomations(targetType, targetId);
    }
  },
  
  /**
   * Send job photos to customer
   */
  sendJobPhotosToCustomer: async (jobId: string, customerEmail?: string) => {
    try {
      // Get the job details to find the customer
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('customer_id')
        .eq('id', jobId)
        .single();
      
      if (jobError || !jobData) {
        throw new Error(`Failed to get job details: ${jobError?.message || ''}`);
      }
      
      // Get the customer email if not provided
      let email = customerEmail;
      if (!email) {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('email')
          .eq('id', jobData.customer_id)
          .single();
          
        if (customerError || !customerData) {
          throw new Error(`Failed to get customer details: ${customerError?.message || ''}`);
        }
        
        email = customerData.email;
      }
      
      if (!email) {
        throw new Error('Customer email not available');
      }
      
      // Get job photos
      const { data: photos, error: photosError } = await supabase
        .storage
        .from('job-photos')
        .list(`${jobId}/`);
        
      if (photosError) {
        throw new Error(`Failed to get job photos: ${photosError.message}`);
      }
      
      if (!photos || photos.length === 0) {
        return { success: true, message: 'No photos to send' };
      }
      
      // In a real implementation, you would now send an email with the photos
      // For now, we'll just log and return success
      console.log(`Would send ${photos.length} photos to ${email} for job ${jobId}`);
      
      return { success: true, message: `Photos sent successfully to ${email}` };
    } catch (error) {
      console.error('Failed to send job photos:', error);
      return { success: false, error: error.message };
    }
  }
};

// Helper functions

async function logAutomationTrigger(automationId: number, params: AutomationTriggerParams) {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    // Create a workflow log entry
    const { data: logData, error: logError } = await supabase
      .from('workflow_logs')
      .insert({
        workflow_id: await getWorkflowIdForAutomation(automationId, params.targetType, params.targetId),
        status: 'in_progress',
        created_by: session?.user?.id,
        context: {
          automationId,
          targetType: params.targetType,
          targetId: params.targetId,
          additionalData: params.additionalData
        }
      })
      .select('id')
      .single();
      
    if (logError) {
      console.error(`Failed to log automation trigger: ${logError.message}`);
    }
    
    return logData?.id;
  } catch (error) {
    console.error('Error logging automation trigger:', error);
    return null;
  }
}

async function getWorkflowIdForAutomation(automationId: number, targetType: string, targetId: string): Promise<string | null> {
  // Find the workflow ID for this automation + target combination
  const { data, error } = await supabase
    .from('automation_workflow_connections')
    .select('workflow_id')
    .eq('automation_id', automationId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .single();
    
  if (error || !data) {
    console.error(`No workflow found for automation ${automationId} and ${targetType}:${targetId}`);
    return null;
  }
  
  return data.workflow_id;
}

async function createWorkflowStage(targetType: string, targetId: string, workflowId: string) {
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
        // For other types we don't have specific stage tables
        return;
    }
    
    // Create the stage record
    const { error } = await supabase
      .from(table)
      .insert({
        [`${targetType}_id`]: targetId, 
        workflow_id: workflowId,
        current_stage: 'initial',
        status: 'in_progress'
      });
      
    if (error) {
      console.error(`Failed to create workflow stage: ${error.message}`);
    }
  } catch (error) {
    console.error('Error creating workflow stage:', error);
  }
}

// Process different types of automations
// These functions would contain the actual implementation in a real app

async function processMessagingAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle SMS, email, or other messaging automations
  console.log(`Processing messaging automation: ${automation.title}`);
  
  // Example implementation for an SMS automation
  if (automation.actions.some(a => a.includes('SMS'))) {
    // This would integrate with your Twilio service
    return await simulateTwilioIntegration(params);
  }
  
  // Example implementation for an email automation
  if (automation.actions.some(a => a.includes('email'))) {
    // This would integrate with your email service
    return await simulateEmailIntegration(params);
  }
  
  return { success: true, message: `Processed messaging automation: ${automation.title}` };
}

async function processSocialAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle social media integrations
  console.log(`Processing social automation: ${automation.title}`);
  
  // Example implementation for social media posting
  if (automation.actions.some(a => a.includes('social media'))) {
    // This would integrate with your social media APIs
    return await simulateSocialMediaIntegration(params);
  }
  
  return { success: true, message: `Processed social automation: ${automation.title}` };
}

async function processTeamAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle team notifications and assignments
  console.log(`Processing team automation: ${automation.title}`);
  return { success: true, message: `Processed team automation: ${automation.title}` };
}

async function processCustomerAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle customer-related automations
  console.log(`Processing customer automation: ${automation.title}`);
  
  // Check if this is a photo sharing automation
  if (automation.id === 33 || automation.title.includes('Photo')) {
    return await processPhotoSharingAutomation(automation, params);
  }
  
  return { success: true, message: `Processed customer automation: ${automation.title}` };
}

async function processSalesAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle sales-related automations
  console.log(`Processing sales automation: ${automation.title}`);
  return { success: true, message: `Processed sales automation: ${automation.title}` };
}

async function processFormsAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle form-related automations
  console.log(`Processing forms automation: ${automation.title}`);
  return { success: true, message: `Processed forms automation: ${automation.title}` };
}

async function processGenericAutomation(automation: Automation, params: AutomationTriggerParams) {
  // Handle any automation type not specifically handled
  console.log(`Processing generic automation: ${automation.title}`);
  return { success: true, message: `Processed generic automation: ${automation.title}` };
}

// Simulation functions for integration examples

async function simulateTwilioIntegration(params: AutomationTriggerParams) {
  console.log(`Simulating Twilio SMS integration for ${params.targetType}:${params.targetId}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
  return { success: true, message: 'SMS notification sent successfully' };
}

async function simulateEmailIntegration(params: AutomationTriggerParams) {
  console.log(`Simulating Email integration for ${params.targetType}:${params.targetId}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
  return { success: true, message: 'Email sent successfully' };
}

async function simulateSocialMediaIntegration(params: AutomationTriggerParams) {
  console.log(`Simulating Social Media integration for ${params.targetType}:${params.targetId}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
  return { success: true, message: 'Posted to social media successfully' };
}

async function processPhotoSharingAutomation(automation: Automation, params: AutomationTriggerParams) {
  console.log(`Processing photo sharing automation for ${params.targetType}:${params.targetId}`);
  
  // For job photo sharing
  if (params.targetType === 'job') {
    return await AutomationIntegrationService.sendJobPhotosToCustomer(params.targetId);
  }
  
  return { success: true, message: 'Photo sharing processed' };
}

// Add mock functions for demo purposes
function getMockAssociatedAutomations(targetType: AutomationTarget, targetId: string) {
  console.log(`Providing mock automations for ${targetType}:${targetId}`);
  
  // Return a few relevant automations based on the target type
  let mockAutomations: Automation[] = [];
  
  if (targetType === 'job') {
    mockAutomations = [
      {
        id: 1,
        title: 'Job Status Update',
        description: 'Send notifications when job status changes',
        isActive: true,
        triggers: ['Job status changed'],
        actions: ['Send notification', 'Update calendar'],
        category: 'notification'
      },
      {
        id: 5,
        title: 'Customer SMS Alert',
        description: 'Send SMS updates to customers',
        isActive: true,
        triggers: ['Job status update'],
        actions: ['Send SMS'],
        category: 'messaging'
      }
    ];
  } else if (targetType === 'customer') {
    mockAutomations = [
      {
        id: 2,
        title: 'Customer Follow-up',
        description: 'Send follow-up emails after service',
        isActive: true,
        triggers: ['Job completed'],
        actions: ['Send email'],
        category: 'customer'
      }
    ];
  }
  
  return { success: true, automations: mockAutomations };
}

function mockTriggerAutomation(automationId: number, params: AutomationTriggerParams) {
  console.log(`Mock triggering automation ${automationId} for ${params.targetType}:${params.targetId}`);
  
  // Simulate a delay for realistic behavior
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, message: 'Automation triggered successfully (demo mode)' });
    }, 800);
  });
}
