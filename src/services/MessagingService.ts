import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Environment variables
const twilioSid = import.meta.env.VITE_TWILIO_SID;
const twilioAuthToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

// Initialize Twilio client only if credentials are available
let twilioClient: any = null;
if (twilioSid && twilioAuthToken) {
  import('twilio').then(({ default: twilio }) => {
    twilioClient = twilio(twilioSid, twilioAuthToken);
  }).catch(error => {
    console.warn('Twilio initialization failed:', error);
  });
}

export interface SendMessageParams {
  type: 'messagingNode' | 'emailNode' | 'whatsappNode' | 'sms';
  recipient: string;
  subject?: string;
  content: string;
  customer_id?: string;
  job_id?: string;
  template_id?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  type: string;
  recipient: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  customer_id?: string;
  job_id?: string;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  metadata?: Record<string, any>;
  created_at: string;
  user_id: string;
}

export const MessagingService = {
  /**
   * Send a message (email, SMS, or WhatsApp)
   */
  sendMessage: async (params: SendMessageParams): Promise<{ success: boolean; message?: Message; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      // Create message record
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          type: params.type,
          recipient: params.recipient,
          subject: params.subject,
          content: params.content,
          status: 'pending',
          customer_id: params.customer_id,
          job_id: params.job_id,
          metadata: params.metadata,
          created_at: new Date().toISOString(),
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Queue message for sending (browser-compatible simulation)
      await queueMessageForSending(message);

      logger.info('Message created and queued:', message);
      return { success: true, message };
    } catch (error) {
      logger.error('Failed to send message:', error);
      return { success: false, error };
    }
  },

  /**
   * Get message by ID
   */
  getMessage: async (messageId: string): Promise<{ success: boolean; message?: Message; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const { data: message, error } = await supabase
        .from('messages')
        .select('*')
        .match({ id: messageId, user_id: session.user.id })
        .single();

      if (error) throw error;

      return { success: true, message };
    } catch (error) {
      logger.error('Failed to get message:', error);
      return { success: false, error };
    }
  },

  /**
   * List messages with optional filters
   */
  listMessages: async (filters?: {
    type?: string;
    status?: Message['status'];
    customer_id?: string;
    job_id?: string;
  }): Promise<{ success: boolean; messages?: Message[]; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      let query = supabase
        .from('messages')
        .select('*')
        .eq('user_id', session.user.id);

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      if (filters?.job_id) {
        query = query.eq('job_id', filters.job_id);
      }

      const { data: messages, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, messages };
    } catch (error) {
      logger.error('Failed to list messages:', error);
      return { success: false, error };
    }
  },

  /**
   * Update message status
   */
  updateMessageStatus: async (
    messageId: string, 
    status: Message['status'], 
    errorMessage?: string
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Authentication required' };
      }

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'sent') {
        updateData.sent_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      } else if (status === 'failed' && errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabase
        .from('messages')
        .update(updateData)
        .eq('id', messageId)
        .eq('user_id', session.user.id);

      if (error) throw error;

      logger.info('Message status updated:', { messageId, status });
      return { success: true };
    } catch (error) {
      logger.error('Failed to update message status:', error);
      return { success: false, error };
    }
  },

  /**
   * Send test message
   */
  sendTestMessage: async (type: SendMessageParams['type'], recipient: string): Promise<{ success: boolean; error?: any }> => {
    return MessagingService.sendMessage({
      type,
      recipient,
      subject: 'Test Message',
      content: `This is a test ${type} message sent at ${new Date().toLocaleString()}`,
      metadata: { test: true }
    });
  },

  /**
   * Send message via backend API (for production use)
   */
  sendViaBackend: async (params: SendMessageParams): Promise<{ success: boolean; error?: any }> => {
    try {
      // In production, this would call your backend API that handles Twilio/SendGrid
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, ...result };
    } catch (error) {
      logger.error('Failed to send message via backend:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

/**
 * Queue message for sending (browser-compatible simulation)
 * In production, this would trigger a backend API call or webhook
 */
async function queueMessageForSending(message: Message): Promise<void> {
  // Simulate sending process in development
  logger.info(`Queuing ${message.type} message to ${message.recipient}`);
  
  // Simulate async sending with delays
  setTimeout(async () => {
    try {
      // Simulate successful sending
      await MessagingService.updateMessageStatus(message.id, 'sent');
      logger.info(`Message ${message.id} marked as sent`);
      
      // Simulate delivery after another delay
      setTimeout(async () => {
        await MessagingService.updateMessageStatus(message.id, 'delivered');
        logger.info(`Message ${message.id} marked as delivered`);
      }, 2000);
    } catch (error) {
      await MessagingService.updateMessageStatus(
        message.id, 
        'failed', 
        error instanceof Error ? error.message : 'Unknown error'
      );
      logger.error(`Message ${message.id} failed:`, error);
    }
  }, 1000);
} 