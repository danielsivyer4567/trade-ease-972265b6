
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AutomationTriggerService = {
  sendSMS: async (phoneNumber: string, message: string) => {
    try {
      console.log(`Sending SMS to ${phoneNumber}: ${message}`);
      
      // In a real implementation, this would call your Twilio edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to send messages");
      }
      
      // Call the notify-team-leader function
      const { data, error } = await supabase.functions.invoke('notify-team-leader', {
        body: {
          phoneNumber,
          name: "Customer",
          message
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send SMS');
      }
      
      return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return { success: false, error: error.message };
    }
  },
  
  sendEmail: async (to: string, subject: string, html: string) => {
    try {
      console.log(`Sending email to ${to}: ${subject}`);
      
      // In a real implementation, this would call your email edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to send emails");
      }
      
      // Call the mailgun-email-sender function
      const { data, error } = await supabase.functions.invoke('mailgun-email-sender', {
        body: {
          to,
          subject,
          html
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to send email');
      }
      
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }
  },
  
  postToSocial: async (platforms: string[], content: string, imageUrls?: string[]) => {
    try {
      console.log(`Posting to social media platforms: ${platforms.join(', ')}`);
      console.log('Content:', content);
      
      // In a real implementation, this would call your social media APIs
      // For now, simulate a successful post
      
      return { success: true, message: `Posted to ${platforms.length} platform(s)` };
    } catch (error) {
      console.error('Failed to post to social media:', error);
      return { success: false, error: error.message };
    }
  },
  
  orderTwilioNumber: async (phoneNumber: string, accountSid: string, authToken: string) => {
    try {
      console.log(`Ordering Twilio number: ${phoneNumber}`);
      
      // Call the twilio-order-number function
      const { data, error } = await supabase.functions.invoke('twilio-order-number', {
        body: {
          phoneNumber,
          accountSid,
          authToken,
          userId: 'current-user' // In a real implementation, this would be the actual user ID
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to order phone number');
      }
      
      return { success: true, message: 'Phone number ordered successfully', data };
    } catch (error) {
      console.error('Failed to order Twilio number:', error);
      return { success: false, error: error.message };
    }
  },
  
  fetchTwilioNumbers: async (accountSid: string, authToken: string, areaCode?: string) => {
    try {
      console.log(`Fetching Twilio numbers${areaCode ? ` for area code ${areaCode}` : ''}`);
      
      // Call the twilio-available-numbers function
      const { data, error } = await supabase.functions.invoke('twilio-available-numbers', {
        body: {
          accountSid,
          authToken,
          areaCode,
          country: 'AU',
          limit: 10
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch available numbers');
      }
      
      return { success: true, numbers: data.numbers };
    } catch (error) {
      console.error('Failed to fetch Twilio numbers:', error);
      return { success: false, error: error.message };
    }
  }
};
