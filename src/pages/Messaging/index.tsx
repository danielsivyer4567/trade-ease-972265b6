
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

export default function Messaging() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNumbers, setConnectedNumbers] = useState<string[]>([]);
  const [userConfig, setUserConfig] = useState<{ messaging_enabled: boolean }>({ messaging_enabled: false });
  const navigate = useNavigate();

  // Load user configuration and connected phone numbers
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No user session found');
          // In a production app, you might want to redirect to login
          return;
        }
        
        const userId = session.user.id;
        
        // Fetch user configuration
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
        
        // Fetch phone numbers from messaging_accounts
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
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to connect a phone number');
        setIsConnecting(false);
        return;
      }
      
      const userId = session.user.id;
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      console.log('Connecting phone number:', cleanNumber);
      
      // First validate the number with GHL function
      const validationResponse = await supabase.functions.invoke('validate-ghl-number', {
        body: {
          phoneNumber: cleanNumber
        }
      });
      
      if (validationResponse.error || !validationResponse.data.success) {
        throw new Error(
          validationResponse.error?.message || 
          validationResponse.data?.error || 
          'Failed to validate phone number'
        );
      }
      
      // Then store the phone number in the messaging_accounts table
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
      
      // Enable messaging in user configuration
      const { error: configError } = await supabase
        .from('users_configuration')
        .update({ messaging_enabled: true })
        .eq('id', userId);
      
      if (configError) {
        console.error('Error updating messaging configuration:', configError);
        // We don't fail the whole operation if just this update fails
      } else {
        setUserConfig({ messaging_enabled: true });
      }
      
      // Update local state
      setConnectedNumbers([...connectedNumbers, phoneNumber]);
      
      // Reset the input
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
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to remove a phone number');
        return;
      }
      
      const userId = session.user.id;
      
      // Remove the phone number from the database
      const { error } = await supabase
        .from('messaging_accounts')
        .delete()
        .eq('user_id', userId)
        .eq('phone_number', numberToRemove);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedNumbers = [...connectedNumbers];
      updatedNumbers.splice(index, 1);
      setConnectedNumbers(updatedNumbers);
      
      toast.success("Phone number removed");
    } catch (error) {
      console.error('Error removing phone number:', error);
      toast.error('Failed to remove phone number');
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
                  <h3 className="font-medium mb-2">Connected Phone Numbers</h3>
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
          
          {/* Service Sync Card */}
          <ServiceSyncCard />
        </div>
      </div>
    </AppLayout>;
}
