
/**
 * Service for handling workflow operations
 */

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  category?: string;
  is_template: boolean;
  data: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export class WorkflowService {
  /**
   * Get workflows for the current user
   */
  static async getUserWorkflows(): Promise<Workflow[]> {
    // In a real app, this would fetch from the backend
    console.log('Getting user workflows');
    
    // Return mock data
    return [
      {
        id: '1',
        name: 'Customer Onboarding',
        description: 'Workflow for new customers',
        category: 'customers',
        is_template: false,
        data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
      },
      {
        id: '2',
        name: 'Job Completion',
        description: 'Workflow for job completion',
        category: 'jobs',
        is_template: false,
        data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
      }
    ];
  }
  
  /**
   * Get workflow templates
   */
  static async getUserTemplates(): Promise<Workflow[]> {
    // In a real app, this would fetch from the backend
    console.log('Getting user templates');
    
    // Return mock data
    return [
      {
        id: 't1',
        name: 'Quote Approval Template',
        description: 'Standard template for quote approvals',
        category: 'quotes',
        is_template: true,
        data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
      },
      {
        id: 't2',
        name: 'Customer Follow-up Template',
        description: 'Standard template for customer follow-ups',
        category: 'customers',
        is_template: true,
        data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
      }
    ];
  }

  /**
   * Save a workflow
   */
  static async saveWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    console.log('Saving workflow:', workflow);
    
    // Mock a response
    return {
      ...workflow,
      id: workflow.id || Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'current-user',
      is_template: workflow.is_template || false,
    } as Workflow;
  }
  
  /**
   * Get a workflow by ID
   */
  static async getWorkflow(id: string): Promise<Workflow | null> {
    console.log('Getting workflow:', id);
    
    // Mock response
    if (id) {
      return {
        id,
        name: 'Sample Workflow',
        description: 'This is a sample workflow',
        category: 'general',
        is_template: false,
        data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
      };
    }
    
    return null;
  }
}
