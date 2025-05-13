import { supabase } from '@/integrations/supabase/client';

interface TwilioCredentials {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export class MessagingService {
  private static instance: MessagingService;
  private credentials: TwilioCredentials | null = null;

  private constructor() {}

  static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  async initialize(credentials: TwilioCredentials): Promise<void> {
    try {
      // Store credentials securely in Supabase
      const { error } = await supabase
        .from('service_connections')
        .upsert({
          service_type: 'twilio',
          connection_details: credentials,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      this.credentials = credentials;
    } catch (error) {
      console.error('Failed to initialize messaging service:', error);
      throw new Error('Failed to initialize messaging service');
    }
  }

  async sendSMS(to: string, message: string): Promise<void> {
    if (!this.credentials) {
      throw new Error('Messaging service not initialized');
    }

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message,
          credentials: this.credentials
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  }

  async getConnectionStatus(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('service_connections')
        .select('connection_details')
        .eq('service_type', 'twilio')
        .single();

      if (error) throw error;
      this.credentials = data?.connection_details as TwilioCredentials;
      return !!this.credentials;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return false;
    }
  }
}

export const messagingService = MessagingService.getInstance(); 