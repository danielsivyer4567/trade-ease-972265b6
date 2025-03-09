import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, Loader2, Check, Inbox, RefreshCw, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface ServiceInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  syncEnabled: boolean;
  lastSynced?: string;
  serviceType: string;
  connectionDetails?: {
    apiKey?: string;
    accountId?: string;
    url?: string;
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
  };
}

interface ConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (serviceType: string, connectionDetails: any) => void;
}

const ConnectServiceDialog = ({ isOpen, onClose, onConnect }: ConnectDialogProps) => {
  const [serviceType, setServiceType] = useState('sms');
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('');

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    if (serviceType === 'twilio') {
      if (!accountSid || !authToken || !twilioPhoneNumber) {
        toast.error("Please fill in all required Twilio fields");
        setIsSubmitting(false);
        return;
      }
    } else if (!apiKey || (serviceType !== 'email' && !accountId)) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      const connectionDetails = serviceType === 'twilio' 
        ? { accountSid, authToken, phoneNumber: twilioPhoneNumber }
        : { apiKey, accountId, url: serviceUrl || undefined };
      
      onConnect(serviceType, connectionDetails);
      
      setApiKey('');
      setAccountId('');
      setServiceUrl('');
      setAccountSid('');
      setAuthToken('');
      setTwilioPhoneNumber('');
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Messaging Service</DialogTitle>
          <DialogDescription>
            Add your API keys and account details to connect an external messaging platform.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS Provider</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
                <SelectItem value="email">Email Service</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                <SelectItem value="messenger">Facebook Messenger</SelectItem>
                <SelectItem value="twilio">Twilio SMS</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {serviceType === 'twilio' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="account-sid">Account SID</Label>
                <Input 
                  id="account-sid" 
                  value={accountSid} 
                  onChange={(e) => setAccountSid(e.target.value)}
                  placeholder="Enter your Twilio Account SID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auth-token">Auth Token</Label>
                <Input 
                  id="auth-token" 
                  type="password" 
                  value={authToken} 
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Enter your Twilio Auth Token"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone-number">Twilio Phone Number</Label>
                <Input 
                  id="phone-number" 
                  value={twilioPhoneNumber} 
                  onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key / Token</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
              
              {serviceType !== 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="account-id">Account ID / Phone Number</Label>
                  <Input 
                    id="account-id" 
                    value={accountId} 
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="Enter account identifier"
                  />
                </div>
              )}
              
              {serviceType === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="service-url">Service URL (Optional)</Label>
                  <Input 
                    id="service-url" 
                    value={serviceUrl} 
                    onChange={(e) => setServiceUrl(e.target.value)}
                    placeholder="https://api.yourservice.com"
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Connecting...
              </>
            ) : (
              'Connect Service'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ServiceSyncCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [services, setServices] = useState<ServiceInfo[]>([
    {
      id: "sms",
      name: "SMS Messages",
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      isConnected: false,
      syncEnabled: false,
      serviceType: "sms"
    },
    {
      id: "voicemail",
      name: "Voicemail",
      icon: <Phone className="h-5 w-5 text-green-500" />,
      isConnected: false,
      syncEnabled: false,
      serviceType: "voicemail"
    },
    {
      id: "email",
      name: "Email Inquiries",
      icon: <Inbox className="h-5 w-5 text-purple-500" />,
      isConnected: false,
      syncEnabled: false,
      serviceType: "email"
    }
  ]);
  
  useEffect(() => {
    fetchMessagingAccounts();
  }, []);
  
  const fetchMessagingAccounts = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No user session found');
        setIsLoading(false);
        return;
      }
      
      const userId = session.user.id;
      
      const { data: accounts, error } = await supabase
        .from('messaging_accounts')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching messaging accounts:', error);
        toast.error('Failed to load messaging accounts');
        setIsLoading(false);
        return;
      }
      
      if (accounts && accounts.length > 0) {
        const updatedServices = [...services];
        
        updatedServices.forEach(service => {
          const matchingAccount = accounts.find(a => a.service_type === service.serviceType);
          if (matchingAccount) {
            service.id = matchingAccount.id;
            service.isConnected = true;
            service.syncEnabled = matchingAccount.enabled;
            service.lastSynced = 'Recently';
            service.connectionDetails = {
              apiKey: matchingAccount.api_key,
              accountId: matchingAccount.account_id,
              phoneNumber: matchingAccount.phone_number,
              accountSid: matchingAccount.account_sid,
              authToken: matchingAccount.auth_token
            };
          }
        });
        
        accounts.forEach(account => {
          const existingService = updatedServices.find(
            s => s.serviceType === account.service_type || s.id === account.id
          );
          
          if (!existingService) {
            let icon;
            switch (account.service_type) {
              case 'twilio':
                icon = <MessageSquare className="h-5 w-5 text-red-500" />;
                break;
              case 'whatsapp':
                icon = <MessageSquare className="h-5 w-5 text-green-500" />;
                break;
              case 'messenger':
                icon = <MessageSquare className="h-5 w-5 text-blue-500" />;
                break;
              default:
                icon = <MessageSquare className="h-5 w-5 text-amber-500" />;
                break;
            }
            
            updatedServices.push({
              id: account.id,
              name: account.service_type === 'twilio' 
                ? "Twilio SMS" 
                : account.service_type === 'whatsapp'
                  ? "WhatsApp Business"
                  : account.service_type === 'messenger'
                    ? "Facebook Messenger"
                    : "Custom API Integration",
              icon,
              isConnected: true,
              syncEnabled: account.enabled,
              lastSynced: 'Recently',
              serviceType: account.service_type,
              connectionDetails: {
                apiKey: account.api_key,
                accountId: account.account_id,
                phoneNumber: account.phone_number,
                accountSid: account.account_sid,
                authToken: account.auth_token
              }
            });
          }
        });
        
        setServices(updatedServices);
      }
    } catch (error) {
      console.error('Error in fetchMessagingAccounts:', error);
      toast.error('Failed to load messaging accounts');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSync = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('messaging_accounts')
        .update({ enabled: !service.syncEnabled })
        .eq('id', serviceId);
      
      if (error) {
        throw error;
      }
      
      setServices(services.map(service => 
        service.id === serviceId 
          ? { ...service, syncEnabled: !service.syncEnabled }
          : service
      ));
      
      toast.success(`${service.syncEnabled ? "Disabled" : "Enabled"} sync for ${service.name}`);
    } catch (error) {
      console.error('Error toggling sync status:', error);
      toast.error('Failed to update sync settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConnectService = async (serviceId: string) => {
    setIsLoading(true);
    
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to connect services');
        setIsLoading(false);
        return;
      }
      
      const userId = session.user.id;
      
      const connectionDetails = {
        apiKey: '',
        accountId: service.serviceType,
      };
      
      const { data, error } = await supabase.functions.invoke('connect-messaging-service', {
        body: {
          serviceType: service.serviceType,
          connectionDetails,
          userId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to connect service');
      }
      
      setServices(services.map(s => 
        s.id === serviceId 
          ? { 
              ...s, 
              id: data.serviceId || s.id,
              isConnected: true, 
              syncEnabled: true,
              lastSynced: "Just now" 
            }
          : s
      ));
      
      toast.success(`${service.name} connected successfully`);
      
      fetchMessagingAccounts();
    } catch (error) {
      console.error('Error connecting service:', error);
      toast.error('Failed to connect service');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddNewService = async (serviceType: string, connectionDetails: any) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to add services');
        setIsLoading(false);
        return;
      }
      
      const userId = session.user.id;
      
      const { data, error } = await supabase.functions.invoke('connect-messaging-service', {
        body: {
          serviceType,
          connectionDetails,
          userId
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to connect service');
      }
      
      toast.success(`New ${serviceType} connection added`);
      
      fetchMessagingAccounts();
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add new service');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveService = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    if (["sms", "voicemail", "email"].includes(serviceId)) {
      toast.error("Default services cannot be removed, only disconnected");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('messaging_accounts')
        .delete()
        .eq('id', serviceId);
      
      if (error) {
        throw error;
      }
      
      setServices(services.filter(s => s.id !== serviceId));
      toast.success(`${service.name} connection removed`);
    } catch (error) {
      console.error('Error removing service:', error);
      toast.error('Failed to remove service');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSyncAll = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to sync services');
        setIsLoading(false);
        return;
      }
      
      setServices(services.map(service => 
        service.isConnected && service.syncEnabled
          ? { ...service, lastSynced: "Just now" }
          : service
      ));
      
      toast.success("All services synchronized successfully");
    } catch (error) {
      console.error('Error syncing services:', error);
      toast.error('Failed to sync services');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Card className="p-3">
        <CardHeader className="bg-slate-200 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Service Synchronization
          </CardTitle>
          <CardDescription>
            Keep your messages in sync across multiple platforms
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2 bg-slate-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Enable automatic sync for connected services</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsConnectDialogOpen(true)}
                className="h-8 text-xs bg-slate-300 hover:bg-slate-400"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Service
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncAll}
                disabled={isLoading || !services.some(s => s.isConnected && s.syncEnabled)}
                className="h-8 text-xs bg-slate-300 hover:bg-slate-400"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Sync All Now
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-3 mt-2">
            {services.map(service => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-300">
                <div className="flex items-center gap-3">
                  {service.icon}
                  <div>
                    <p className="font-medium">{service.name}</p>
                    {service.isConnected && (
                      <p className="text-xs text-gray-500">
                        {service.lastSynced ? `Last synced: ${service.lastSynced}` : 'Not synced yet'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {service.isConnected ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.syncEnabled}
                          onCheckedChange={() => handleToggleSync(service.id)}
                          disabled={isLoading}
                        />
                        <Label className="text-xs">Auto Sync</Label>
                      </div>
                      {!["sms", "voicemail", "email"].includes(service.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(service.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleConnectService(service.id)}
                      disabled={isLoading}
                      className="bg-slate-400 hover:bg-slate-500"
                    >
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Connect"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <ConnectServiceDialog 
        isOpen={isConnectDialogOpen} 
        onClose={() => setIsConnectDialogOpen(false)} 
        onConnect={handleAddNewService}
      />
    </>
  );
};
