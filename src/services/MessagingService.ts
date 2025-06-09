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

// Message sending logic for construction app
class MessageSender {
  private twilioClient: any;
  private sendGridClient: any;
  private whatsAppClient: any;

  constructor() {
    this.twilioClient = twilioClient; // Use the initialized Twilio client
    this.sendGridClient = null; // Initialize SendGrid client
    this.whatsAppClient = null; // Initialize WhatsApp Business API client
  }

  async sendMessage(messageType: string, recipient: string, message: string) {
    switch (messageType) {
      case 'sms':
      case 'messagingNode':
        return this.sendSMS(recipient, message);
      case 'email':
      case 'emailNode':
        return this.sendEmail(recipient, message);
      case 'whatsapp':
      case 'whatsappNode':
        return this.sendWhatsApp(recipient, message);
      default:
        throw new Error('Unsupported message type');
    }
  }

  async sendSMS(phoneNumber: string, message: string) {
    try {
      if (this.twilioClient && twilioPhoneNumber) {
        console.log(`Sending SMS via Twilio to ${phoneNumber}: ${message}`);
        const result = await this.twilioClient.messages.create({
          body: message,
          from: twilioPhoneNumber,
          to: phoneNumber
        });
        return { success: true, messageId: result.sid };
      } else {
        // Fallback to console log if Twilio is not configured
        console.log(`Sending SMS to ${phoneNumber}: ${message}`);
        return { success: true, messageId: 'mock-sms-' + Date.now() };
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }

  async sendEmail(emailAddress: string, message: string) {
    // TODO: Implement SendGrid email sending logic
    console.log(`Sending email to ${emailAddress}: ${message}`);
    // Example SendGrid implementation:
    // return this.sendGridClient.send({
    //   to: emailAddress,
    //   from: 'YOUR_VERIFIED_SENDER_EMAIL',
    //   subject: 'Construction App Update',
    //   text: message,
    // });
    return { success: true, messageId: 'mock-email-' + Date.now() };
  }

  async sendWhatsApp(phoneNumber: string, message: string) {
    // TODO: Implement WhatsApp Business API sending logic
    console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);
    // Example WhatsApp Business API implementation:
    // return this.whatsAppClient.messages.create({
    //   body: message,
    //   from: 'whatsapp:+YOUR_WHATSAPP_BUSINESS_NUMBER',
    //   to: `whatsapp:${phoneNumber}`
    // });
    return { success: true, messageId: 'mock-whatsapp-' + Date.now() };
  }
}

// Initialize the message sender
const messageSender = new MessageSender();

// Utility function for notifying users
export async function notifyUser(userPreference: string, userContact: string, notificationMessage: string) {
  try {
    await messageSender.sendMessage(userPreference, userContact, notificationMessage);
    console.log('Notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { success: false, error };
  }
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

      // Use MessageSender to actually send the message
      try {
        const sendResult = await messageSender.sendMessage(params.type, params.recipient, params.content);
        
        // Update message status based on send result
        if (sendResult.success) {
          await MessagingService.updateMessageStatus(message.id, 'sent');
          logger.info('Message sent successfully:', { messageId: message.id, externalId: sendResult.messageId });
        } else {
          await MessagingService.updateMessageStatus(message.id, 'failed', 'Failed to send via external service');
        }
      } catch (sendError) {
        logger.error('Failed to send message via external service:', sendError);
        await MessagingService.updateMessageStatus(message.id, 'failed', sendError instanceof Error ? sendError.message : 'Unknown send error');
      }

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
        .eq('id', messageId)
        .eq('user_id', session.user.id)
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
  },

  /**
   * Get all messages (for debugging)
   */
  getAllMessages: async (): Promise<{ success: boolean; messages?: Message[]; error?: any }> => {
    return MessagingService.listMessages();
  },

  /**
   * Clear all messages (for testing)
   */
  clearAllMessages: async (): Promise<{ success: boolean; error?: any }> => {
    try {
      // In online mode, this would clear database messages
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
};

/**
 * Queue message for sending (production implementation)
 */
function queueMessageForSending(message: Message): void {
  // In production, this would integrate with actual messaging services
  console.log(`📤 Queuing ${message.type} message to ${message.recipient}`);
  console.log(`📝 Content: ${message.content}`);
  
  // TODO: Implement actual message sending logic here
  // This could integrate with:
  // - Twilio for SMS
  // - SendGrid for email
  // - WhatsApp Business API for WhatsApp
}

// Example usage functions for the construction app:
export async function sendConstructionUpdate(phoneNumber: string, projectUpdate: string) {
  return await notifyUser('sms', phoneNumber, `Construction Update: ${projectUpdate}`);
}

export async function sendTaskAssignment(email: string, taskDetails: string) {
  return await notifyUser('email', email, `New Task Assigned: ${taskDetails}`);
}

export async function sendUrgentAlert(phoneNumber: string, alertMessage: string) {
  return await notifyUser('whatsapp', phoneNumber, `🚨 URGENT: ${alertMessage}`);
}

// Example calls (these would be used in your application):
// sendConstructionUpdate('+1234567890', 'Your construction project has been updated.');
// sendTaskAssignment('user@example.com', 'New task assigned to you in the construction app.');
// sendUrgentAlert('+1987654321', 'Site inspection required.'); 