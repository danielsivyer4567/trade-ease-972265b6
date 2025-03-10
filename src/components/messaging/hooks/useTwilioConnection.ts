
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export const useTwilioConnection = (
  updateConnectedNumbers: (newNumber: string) => void
) => {
  const [twilioDialogOpen, setTwilioDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>({
    accountSid: "",
    authToken: "",
    phoneNumber: ""
  });

  const handleTwilioConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to connect Twilio');
        setIsConnecting(false);
        return;
      }
      
      const userId = session.user.id;
      
      console.log('Connecting Twilio account', twilioConfig);
      
      const { data, error } = await supabase.functions.invoke('connect-messaging-service', {
        body: {
          serviceType: 'twilio',
          connectionDetails: {
            accountSid: twilioConfig.accountSid,
            authToken: twilioConfig.authToken,
            phoneNumber: twilioConfig.phoneNumber
          },
          userId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to connect Twilio account');
      }
      
      updateConnectedNumbers(twilioConfig.phoneNumber);
      
      setTwilioConfig({
        accountSid: "",
        authToken: "",
        phoneNumber: ""
      });
      setTwilioDialogOpen(false);
      toast.success("Twilio account connected successfully");
      
      // Enable messaging if not already enabled
      await updateMessagingEnabled(userId);
    } catch (error: any) {
      console.error('Error connecting Twilio account:', error);
      toast.error(error.message || "Failed to connect Twilio account");
    } finally {
      setIsConnecting(false);
    }
  };

  const updateMessagingEnabled = async (userId: string) => {
    try {
      const { data: configData, error: configError } = await supabase
        .from('users_configuration')
        .select('messaging_enabled')
        .eq('id', userId as string)
        .single();
        
      if (configError) {
        console.error('Error fetching user configuration:', configError);
        return;
      }
      
      if (configData && !configData.messaging_enabled) {
        const { error: updateError } = await supabase
          .from('users_configuration')
          .update({ messaging_enabled: true } as any) // Type cast to work around type error
          .eq('id', userId as string);
          
        if (updateError) {
          console.error('Error updating messaging configuration:', updateError);
        }
      }
    } catch (error) {
      console.error('Error updating messaging enabled status:', error);
    }
  };

  return {
    twilioDialogOpen,
    setTwilioDialogOpen,
    twilioConfig,
    setTwilioConfig,
    isConnecting,
    handleTwilioConnect
  };
};
