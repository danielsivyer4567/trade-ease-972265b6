
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ServiceSyncCard } from "@/components/messaging/ServiceSyncCard";
import { PhoneNumberInput } from "@/components/messaging/PhoneNumberInput";
import { ConnectedPhonesList } from "@/components/messaging/ConnectedPhonesList";
import { TwilioConnectButton } from "@/components/messaging/TwilioConnectButton";
import { TwilioConfigDialog } from "@/components/messaging/TwilioConfigDialog";

export default function Messaging() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNumbers, setConnectedNumbers] = useState<string[]>([]);
  const [userConfig, setUserConfig] = useState<{
    messaging_enabled: boolean;
  }>({
    messaging_enabled: false
  });
  const navigate = useNavigate();
  const [twilioDialogOpen, setTwilioDialogOpen] = useState(false);
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: ""
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No user session found');
          return;
        }
        
        const userId = session.user.id;
        
        // Load user configuration
        const { data: configData, error: configError } = await supabase
          .from('users_configuration')
          .select('messaging_enabled')
          .eq('id', userId)
          .single();
          
        if (configError) {
          console.error('Error fetching user configuration:', configError);
        } else if (configData) {
          setUserConfig(configData);
        }
        
        // Load connected phone numbers
        const { data: phoneAccounts, error: phoneError } = await supabase
          .from('messaging_accounts')
          .select('phone_number')
          .eq('user_id', userId)
          .not('phone_number', 'is', null);
          
        if (phoneError) {
          console.error('Error fetching phone numbers:', phoneError);
        } else if (phoneAccounts && phoneAccounts.length > 0) {
          const numbers = phoneAccounts
            .map(account => account.phone_number)
            .filter(Boolean) as string[];
          setConnectedNumbers(numbers);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length > 0) {
      formattedValue = value.match(/.{1,3}/g)?.join('-') || value;
    }
    setPhoneNumber(formattedValue);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to connect a phone number');
        setIsConnecting(false);
        return;
      }
      
      const userId = session.user.id;
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      console.log('Connecting phone number:', cleanNumber);
      
      // Validate the phone number
      const validationResponse = await supabase.functions.invoke('validate-ghl-number', {
        body: { phoneNumber: cleanNumber }
      });
      
      if (validationResponse.error || !validationResponse.data.success) {
        throw new Error(
          validationResponse.error?.message || 
          validationResponse.data?.error || 
          'Failed to validate phone number'
        );
      }
      
      // Insert the phone number into messaging_accounts
      const { data: accountData, error: accountError } = await supabase
        .from('messaging_accounts')
        .insert({
          user_id: userId,
          service_type: 'sms',
          phone_number: phoneNumber,
          enabled: true
        })
        .select('id')
        .single();
        
      if (accountError) {
        throw accountError;
      }
      
      // Enable messaging if not already enabled
      if (!userConfig.messaging_enabled) {
        const { error: configError } = await supabase
          .from('users_configuration')
          .update({ messaging_enabled: true })
          .eq('id', userId);
          
        if (configError) {
          console.error('Error updating messaging configuration:', configError);
        } else {
          setUserConfig({ messaging_enabled: true });
        }
      }
      
      setConnectedNumbers([...connectedNumbers, phoneNumber]);
      setPhoneNumber('');
      toast.success("Phone number connected successfully");
    } catch (error) {
      console.error('Error connecting phone number:', error);
      toast.error(error.message || "Failed to connect to messaging system");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRemoveNumber = async (index: number) => {
    const numberToRemove = connectedNumbers[index];
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to remove a phone number');
        return;
      }
      
      const userId = session.user.id;
      
      const { error } = await supabase
        .from('messaging_accounts')
        .delete()
        .eq('user_id', userId)
        .eq('phone_number', numberToRemove);
        
      if (error) {
        throw error;
      }
      
      const updatedNumbers = [...connectedNumbers];
      updatedNumbers.splice(index, 1);
      setConnectedNumbers(updatedNumbers);
      toast.success("Phone number removed");
    } catch (error) {
      console.error('Error removing phone number:', error);
      toast.error('Failed to remove phone number');
    }
  };

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
      
      setConnectedNumbers([...connectedNumbers, twilioConfig.phoneNumber]);
      setTwilioConfig({
        accountSid: "",
        authToken: "",
        phoneNumber: ""
      });
      setTwilioDialogOpen(false);
      toast.success("Twilio account connected successfully");
      
      if (!userConfig.messaging_enabled) {
        const { error: configError } = await supabase
          .from('users_configuration')
          .update({ messaging_enabled: true })
          .eq('id', userId);
          
        if (configError) {
          console.error('Error updating messaging configuration:', configError);
        } else {
          setUserConfig({ messaging_enabled: true });
        }
      }
    } catch (error) {
      console.error('Error connecting Twilio account:', error);
      toast.error(error.message || "Failed to connect Twilio account");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-200">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(-1)} 
                    className="rounded-md border border-gray-300 px-3 py-1 text-[#1E40AF] hover:text-[#1E3A8A] bg-slate-400 hover:bg-slate-300"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <MessageSquare className="h-6 w-6" />
                  Message Synchronization
                </div>
              </CardTitle>
              <CardDescription>
                Connect your phone number to sync messages from Go High Level
              </CardDescription>
            </CardHeader>
            
            <CardContent className="bg-slate-200">
              <div className="space-y-6">
                <PhoneNumberInput 
                  phoneNumber={phoneNumber}
                  isConnecting={isConnecting}
                  onChange={handlePhoneNumberChange}
                  onConnect={handleConnect}
                />

                <ConnectedPhonesList 
                  connectedNumbers={connectedNumbers}
                  onRemoveNumber={handleRemoveNumber}
                  onAddTwilioAccount={() => setTwilioDialogOpen(true)}
                />

                <TwilioConnectButton />
              </div>
            </CardContent>
          </Card>
          
          <ServiceSyncCard />
        </div>
      </div>

      <TwilioConfigDialog 
        isOpen={twilioDialogOpen}
        onOpenChange={setTwilioDialogOpen}
        twilioConfig={twilioConfig}
        setTwilioConfig={setTwilioConfig}
        onConnect={handleTwilioConnect}
        isConnecting={isConnecting}
      />
    </AppLayout>
  );
}
