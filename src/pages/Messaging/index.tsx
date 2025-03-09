import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, MessageSquare, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ServiceSyncCard } from "@/components/messaging/ServiceSyncCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          console.log('No user session found');
          return;
        }
        const userId = session.user.id;
        const {
          data: configData,
          error: configError
        } = await supabase.from('users_configuration').select('messaging_enabled').eq('id', userId).single();
        if (configError) {
          console.error('Error fetching user configuration:', configError);
        } else if (configData) {
          setUserConfig(configData);
        }
        const {
          data: phoneAccounts,
          error: phoneError
        } = await supabase.from('messaging_accounts').select('phone_number').eq('user_id', userId).not('phone_number', 'is', null);
        if (phoneError) {
          console.error('Error fetching phone numbers:', phoneError);
        } else if (phoneAccounts && phoneAccounts.length > 0) {
          const numbers = phoneAccounts.map(account => account.phone_number).filter(Boolean) as string[];
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
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to connect a phone number');
        setIsConnecting(false);
        return;
      }
      const userId = session.user.id;
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      console.log('Connecting phone number:', cleanNumber);
      const validationResponse = await supabase.functions.invoke('validate-ghl-number', {
        body: {
          phoneNumber: cleanNumber
        }
      });
      if (validationResponse.error || !validationResponse.data.success) {
        throw new Error(validationResponse.error?.message || validationResponse.data?.error || 'Failed to validate phone number');
      }
      const {
        data: accountData,
        error: accountError
      } = await supabase.from('messaging_accounts').insert({
        user_id: userId,
        service_type: 'sms',
        phone_number: phoneNumber,
        enabled: true
      }).select('id').single();
      if (accountError) {
        throw accountError;
      }
      if (!userConfig.messaging_enabled) {
        const {
          error: configError
        } = await supabase.from('users_configuration').update({
          messaging_enabled: true
        }).eq('id', userId);
        if (configError) {
          console.error('Error updating messaging configuration:', configError);
        } else {
          setUserConfig({
            messaging_enabled: true
          });
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
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to remove a phone number');
        return;
      }
      const userId = session.user.id;
      const {
        error
      } = await supabase.from('messaging_accounts').delete().eq('user_id', userId).eq('phone_number', numberToRemove);
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
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to connect Twilio');
        setIsConnecting(false);
        return;
      }
      const userId = session.user.id;
      console.log('Connecting Twilio account', twilioConfig);
      const {
        data,
        error
      } = await supabase.functions.invoke('connect-messaging-service', {
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
        const {
          error: configError
        } = await supabase.from('users_configuration').update({
          messaging_enabled: true
        }).eq('id', userId);
        if (configError) {
          console.error('Error updating messaging configuration:', configError);
        } else {
          setUserConfig({
            messaging_enabled: true
          });
        }
      }
    } catch (error) {
      console.error('Error connecting Twilio account:', error);
      toast.error(error.message || "Failed to connect Twilio account");
    } finally {
      setIsConnecting(false);
    }
  };
  return <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-200">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 text-[#1E40AF] hover:text-[#1E3A8A] bg-slate-400 hover:bg-slate-300">
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
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-4">
                    <Input id="phone" type="tel" placeholder="Enter your phone number (XXX-XXX-XXXX)" value={phoneNumber} onChange={handlePhoneNumberChange} className="flex-1" maxLength={12} />
                    <Button onClick={handleConnect} disabled={!phoneNumber || isConnecting || phoneNumber.replace(/\D/g, '').length !== 10} className="flex items-center gap-2 px-[17px] bg-slate-400 hover:bg-slate-300">
                      {isConnecting ? <>Loading...</> : <>
                          <Plus className="h-4 w-4" />
                          Connect
                        </>}
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Connected Phone Numbers</h3>
                    <Button variant="outline" size="sm" onClick={() => setTwilioDialogOpen(true)} className="flex items-center gap-2 text-sm bg-slate-400 hover:bg-slate-300">
                      <Plus className="h-3 w-3" />
                      Add Twilio Account
                    </Button>
                  </div>
                  {connectedNumbers.length > 0 ? <ul className="space-y-2">
                      {connectedNumbers.map((number, index) => <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{number}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveNumber(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>)}
                    </ul> : <p className="text-sm text-gray-500">
                      No phone numbers connected yet. Connect a number to start syncing messages.
                    </p>}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ServiceSyncCard />
        </div>
      </div>

      <Dialog open={twilioDialogOpen} onOpenChange={setTwilioDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-slate-200">
          <DialogHeader>
            <DialogTitle>Connect Twilio Account</DialogTitle>
            <DialogDescription>
              Enter your Twilio credentials to integrate with our messaging system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-sid">Account SID</Label>
              <Input id="account-sid" value={twilioConfig.accountSid} onChange={e => setTwilioConfig({
              ...twilioConfig,
              accountSid: e.target.value
            })} placeholder="Enter your Twilio Account SID" />
              <p className="text-xs text-gray-500">
                You can find this in your Twilio Console Dashboard
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="auth-token">Auth Token</Label>
              <Input id="auth-token" type="password" value={twilioConfig.authToken} onChange={e => setTwilioConfig({
              ...twilioConfig,
              authToken: e.target.value
            })} placeholder="Enter your Twilio Auth Token" />
              <p className="text-xs text-gray-500">
                This is found in your Twilio Console Dashboard next to your Account SID
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twilio-phone">Twilio Phone Number</Label>
              <Input id="twilio-phone" value={twilioConfig.phoneNumber} onChange={e => setTwilioConfig({
              ...twilioConfig,
              phoneNumber: e.target.value
            })} placeholder="+1XXXXXXXXXX (include country code)" />
              <p className="text-xs text-gray-500">
                This must be a phone number purchased through your Twilio account
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwilioDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTwilioConnect} disabled={isConnecting || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber} className="bg-slate-400 hover:bg-slate-300">
              {isConnecting ? "Connecting..." : "Connect Twilio Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>;
}