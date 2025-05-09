import { supabase } from '@/integrations/supabase/client';

// DocuSeal API configuration
const DOCUSEAL_API_URL = process.env.DOCUSEAL_API_URL || 'https://api.docuseal.co';
const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY || 'your-docuseal-api-key';
const WEBHOOK_SECRET = process.env.DOCUSEAL_WEBHOOK_SECRET || 'your-webhook-secret';

/**
 * DocuSeal Integration Class
 * Handles communication with the DocuSeal API
 */
export class DocuSealIntegration {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string = DOCUSEAL_API_KEY, apiUrl: string = DOCUSEAL_API_URL) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  /**
   * Create a new DocuSeal submission for a template
   * @param templateId The template ID to create a submission for
   * @param submissionData The data for the submission (recipients, etc.)
   */
  async createSubmission(templateId: string, submissionData: any) {
    try {
      // In a real implementation, this would call the DocuSeal API
      // The actual API call would look something like this:
      // const response = await fetch(`${this.apiUrl}/api/v1/submissions`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${this.apiKey}`
      //   },
      //   body: JSON.stringify({
      //     template_id: templateId,
      //     ...submissionData
      //   })
      // });
      // const data = await response.json();
      
      // For demo purposes, create a mock response
      const mockSubmissionId = `sub_${Math.random().toString(36).substring(2, 10)}`;
      const mockSigningUrl = `https://docuseal.example/sign/${mockSubmissionId}`;
      
      // Save the submission ID to the database
      if (submissionData.quoteId) {
        await this.saveSubmissionToDatabase(
          submissionData.quoteId,
          mockSubmissionId,
          submissionData.recipients[0].email
        );
      }
      
      return {
        id: mockSubmissionId,
        signing_url: mockSigningUrl
      };
    } catch (error) {
      console.error('Error creating DocuSeal submission:', error);
      throw new Error('Failed to create signature request');
    }
  }

  /**
   * Get the status of a submission
   * @param submissionId The ID of the submission to check
   */
  async getSubmissionStatus(submissionId: string) {
    try {
      // In a real implementation, this would call the DocuSeal API
      // const response = await fetch(`${this.apiUrl}/api/v1/submissions/${submissionId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`
      //   }
      // });
      // return await response.json();
      
      // For demo purposes, return a mock status
      return {
        id: submissionId,
        status: 'pending',
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting submission status:', error);
      throw new Error('Failed to get submission status');
    }
  }

  /**
   * Save the DocuSeal submission ID to the database
   */
  private async saveSubmissionToDatabase(
    quoteId: string,
    submissionId: string,
    signerEmail: string
  ) {
    try {
      const { error } = await supabase
        .from('docuseal_submissions')
        .insert({
          quote_id: quoteId,
          submission_id: submissionId,
          signer_email: signerEmail,
          status: 'pending',
          created_at: new Date().toISOString()
        });
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error saving submission to database:', error);
      throw new Error('Failed to save submission');
    }
  }
}

// Create a singleton instance for the app to use
export const docuSealClient = new DocuSealIntegration();

/**
 * Create a new DocuSeal submission for a quote
 * @param quoteId The ID of the quote to create a submission for
 * @param customerEmail The email of the customer who will sign the document
 * @param documentData The quote data to include in the document
 */
export const createSignatureRequest = async (
  quoteId: string,
  customerEmail: string,
  documentData: any
) => {
  try {
    // Use the DocuSealIntegration class
    const templateId = 'template_default'; // In a real app, you'd have this stored somewhere
    
    const submission = await docuSealClient.createSubmission(templateId, {
      quoteId: quoteId,
      recipients: [
        {
          email: customerEmail,
          name: documentData.customerName || 'Customer',
          role: 'Customer'
        }
      ],
      data: documentData
    });
    
    return {
      submissionId: submission.id,
      signingUrl: submission.signing_url
    };
  } catch (error) {
    console.error('Error creating DocuSeal submission:', error);
    throw new Error('Failed to create signature request');
  }
};

/**
 * Process DocuSeal webhook events
 * @param event The webhook event from DocuSeal
 * @param signature The signature from the request headers
 */
export const processWebhookEvent = async (event: any, signature: string) => {
  try {
    // Verify webhook signature
    if (signature !== WEBHOOK_SECRET) {
      throw new Error('Invalid webhook signature');
    }
    
    // Handle different event types
    switch (event.type) {
      case 'submission.completed':
        await handleSubmissionCompleted(event.data);
        break;
        
      case 'submission.opened':
        await handleSubmissionOpened(event.data);
        break;
        
      case 'submission.signed':
        await handleSubmissionSigned(event.data);
        break;
        
      default:
        console.log('Unhandled webhook event type:', event.type);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw new Error('Failed to process webhook');
  }
};

/**
 * Handle a completed submission (all parties have signed)
 */
const handleSubmissionCompleted = async (data: any) => {
  try {
    // Update the submission status in the database
    const { error } = await supabase
      .from('docuseal_submissions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        document_url: data.document_url
      })
      .eq('submission_id', data.id);
      
    if (error) {
      throw error;
    }
    
    // Get the quote details to send notifications
    const { data: submission, error: fetchError } = await supabase
      .from('docuseal_submissions')
      .select('quote_id, signer_email')
      .eq('submission_id', data.id)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    // Send email notifications
    await sendSignedDocumentNotifications(
      submission.quote_id,
      submission.signer_email,
      data.document_url
    );
    
  } catch (error) {
    console.error('Error handling completed submission:', error);
    throw new Error('Failed to process completed submission');
  }
};

/**
 * Handle when a submission is opened by a signer
 */
const handleSubmissionOpened = async (data: any) => {
  try {
    // Update the submission status in the database
    const { error } = await supabase
      .from('docuseal_submissions')
      .update({
        last_viewed_at: new Date().toISOString()
      })
      .eq('submission_id', data.id);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error handling opened submission:', error);
    throw new Error('Failed to process opened submission');
  }
};

/**
 * Handle when a signer signs the document (might not be all required signers)
 */
const handleSubmissionSigned = async (data: any) => {
  try {
    // You could update a specific signer's status here if tracking multiple signers
    const { error } = await supabase
      .from('docuseal_submissions')
      .update({
        status: 'partially_signed',
        last_signed_at: new Date().toISOString()
      })
      .eq('submission_id', data.id);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error handling signed submission:', error);
    throw new Error('Failed to process signed submission');
  }
};

/**
 * Send email notifications about the signed document
 */
const sendSignedDocumentNotifications = async (
  quoteId: string,
  customerEmail: string,
  documentUrl: string
) => {
  try {
    // In a real implementation, this would send emails to both the customer and your team
    console.log(`Sending signed document notification for quote ${quoteId}`);
    console.log(`Document URL: ${documentUrl}`);
    console.log(`Customer email: ${customerEmail}`);
    
    // You would typically use an email service like SendGrid, Mailgun, etc.
    // For demo purposes, we're just logging the information
  } catch (error) {
    console.error('Error sending signed document notifications:', error);
    throw new Error('Failed to send notifications');
  }
};

/**
 * Get the signature status for a quote
 */
export const getSignatureStatus = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from('docuseal_submissions')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Error getting signature status:', error);
    throw new Error('Failed to get signature status');
  }
}; 