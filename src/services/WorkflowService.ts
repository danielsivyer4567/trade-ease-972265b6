
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

export interface WorkflowResponse {
  success: boolean;
  workflows?: Workflow[];
  templates?: Workflow[];
  id?: string;
  error?: string;
}

export class WorkflowService {
  /**
   * Get workflows for the current user
   */
  static async getUserWorkflows(): Promise<WorkflowResponse> {
    // In a real app, this would fetch from the backend
    console.log('Getting user workflows');
    
    // Return mock data with success property
    return {
      success: true,
      workflows: [
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
      ]
    };
  }
  
  /**
   * Get workflow templates
   */
  static async getUserTemplates(): Promise<WorkflowResponse> {
    // In a real app, this would fetch from the backend
    console.log('Getting user templates');
    
    // Return mock data with success property
    return {
      success: true,
      templates: [
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
      ]
    };
  }

  /**
   * Save a workflow
   */
  static async saveWorkflow(workflow: Partial<Workflow>): Promise<WorkflowResponse> {
    console.log('Saving workflow:', workflow);
    
    // Mock a response
    const newId = workflow.id || Math.random().toString(36).substring(2, 9);
    
    return {
      success: true,
      id: newId,
      workflows: [{
        ...workflow,
        id: newId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'current-user',
        is_template: workflow.is_template || false,
      } as Workflow]
    };
  }
  
  /**
   * Get a workflow by ID
   */
  static async getWorkflow(id: string): Promise<WorkflowResponse> {
    console.log('Getting workflow:', id);
    
    // Mock response
    if (id) {
      return {
        success: true,
        workflows: [{
          id,
          name: 'Sample Workflow',
          description: 'This is a sample workflow',
          category: 'general',
          is_template: false,
          data: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 'current-user',
        }]
      };
    }
    
    return {
      success: false,
      error: 'Workflow not found'
    };
  }
  
  /**
   * Delete a workflow by ID
   */
  static async deleteWorkflow(id: string): Promise<WorkflowResponse> {
    console.log('Deleting workflow:', id);
    
    // Mock successful deletion
    return {
      success: true
    };
  }
}
