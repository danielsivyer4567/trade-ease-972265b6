import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
const twilio = require('twilio');

const twilioSid = process.env.TWILIO_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(twilioSid, twilioAuthToken);

export const MessagingService = {
  async sendMessage(messageData: any) {
    try {
      // If platform is SMS, send via Twilio first
      if (messageData.platform === 'sms') {
        const smsResult = await twilioClient.messages.create({
          body: messageData.body,
          from: twilioPhoneNumber,
          to: messageData.to
        });
        logger.info('Twilio SMS sent:', smsResult);
      }
      // Save message to Supabase
      const { data: message, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      logger.info('Message sent:', messageData);
      return { success: true, message };
    } catch (error) {
      logger.error('Failed to send message:', error);
      return { success: false, error };
    }
  },

  async sendEmail(emailData: any) {
    try {
      // Implement email sending logic here
      logger.info('Email sent:', emailData);
      return { success: true };
    } catch (error) {
      logger.error('Failed to send email:', error);
      return { success: false, error };
    }
  },

  async sendWhatsApp(whatsappData: any) {
    try {
      // Implement WhatsApp sending logic here
      logger.info('WhatsApp message sent:', whatsappData);
      return { success: true };
    } catch (error) {
      logger.error('Failed to send WhatsApp message:', error);
      return { success: false, error };
    }
  },

  async getMessage(messageId: string) {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (error) throw error;

      return { success: true, message };
    } catch (error) {
      logger.error('Failed to get message:', error);
      return { success: false, error };
    }
  }
}; 