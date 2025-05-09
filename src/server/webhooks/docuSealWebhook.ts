import { processWebhookEvent } from '@/services/docuSealService';

/**
 * Handler for DocuSeal webhook requests.
 * This can be used with a framework-specific router implementation.
 * 
 * @param req - The incoming request object
 * @param res - The response object
 */
export async function handleDocuSealWebhook(req: any, res: any) {
  try {
    // Verify webhook signature from DocuSeal
    const signature = req.headers?.['x-docuseal-signature'];
    
    if (!signature || typeof signature !== 'string') {
      return {
        status: 401,
        body: 'Invalid signature'
      };
    }
    
    const event = req.body;
    
    // Process the webhook event
    await processWebhookEvent(event, signature);
    
    // Return successful response
    return {
      status: 200,
      body: 'Webhook received'
    };
  } catch (error) {
    console.error('Error processing DocuSeal webhook:', error);
    return {
      status: 500,
      body: 'Error processing webhook'
    };
  }
}

// For use with React Router or similar - export a handler that can be used as middleware
export default handleDocuSealWebhook; 