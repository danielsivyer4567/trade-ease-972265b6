import { useState, useEffect } from 'react';
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../types";

const createIconProps = (color: string) => ({
  icon: MessageSquare,
  props: { className: `h-5 w-5 text-${color}-500` }
});

export const useMessagingServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<ServiceInfo[]>([
    {
      id: "sms",
      name: "SMS Messages",
      icon: createIconProps("blue"),
      isConnected: false,
      syncEnabled: false,
      serviceType: "sms"
    },
    {
      id: "voicemail",
      name: "Voicemail",
      icon: createIconProps("green"),
      isConnected: false,
      syncEnabled: false,
      serviceType: "voicemail"
    },
    {
      id: "email",
      name: "Email Inquiries",
      icon: createIconProps("purple"),
      isConnected: false,
      syncEnabled: false,
      serviceType: "email"
    }
  ]);

  const updateServicesWithAccount = (updatedServices, account) => {
    let iconProps;
    switch (account.service_type) {
      case 'twilio':
        iconProps = createIconProps("red");
        break;
      case 'whatsapp':
        iconProps = createIconProps("green");
        break;
      case 'messenger':
        iconProps = createIconProps("blue");
        break;
      default:
        iconProps = createIconProps("amber");
        break;
    }
    
    return {
      id: account.id,
      name: account.service_type === 'twilio' 
        ? "Twilio SMS" 
        : account.service_type === 'whatsapp' 
          ? "WhatsApp Business" 
          : account.service_type === 'messenger' 
            ? "Facebook Messenger" 
            : "Custom API Integration",
      icon: iconProps,
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
    };
  };

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
        
        // Update existing services
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
        
        // Add new services not in the default list
        accounts.forEach(account => {
          const existingService = updatedServices.find(
            s => s.serviceType === account.service_type || s.id === account.id
          );
          
          if (!existingService) {
            updatedServices.push(updateServicesWithAccount(updatedServices, account));
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
        accountId: service.serviceType
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

  useEffect(() => {
    fetchMessagingAccounts();
  }, []);

  return {
    services,
    isLoading,
    handleToggleSync,
    handleConnectService,
    handleAddNewService,
    handleRemoveService,
    handleSyncAll,
    fetchMessagingAccounts
  };
};
