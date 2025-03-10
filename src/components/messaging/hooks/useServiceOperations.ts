
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../types";

export const useServiceOperations = (
  services: ServiceInfo[],
  setServices: React.Dispatch<React.SetStateAction<ServiceInfo[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchMessagingAccounts: () => Promise<void>
) => {
  const handleToggleSync = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('messaging_accounts')
        .update({ enabled: !service.syncEnabled })
        .eq('id', serviceId as string);
        
      if (error) {
        throw error;
      }
      
      setServices(services.map(service => 
        service.id === serviceId 
          ? { ...service, syncEnabled: !service.syncEnabled } 
          : service
      ));
      
      toast.success(`${service.syncEnabled ? "Disabled" : "Enabled"} sync for ${service.name}`);
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
        .eq('id', serviceId as string);
        
      if (error) {
        throw error;
      }
      
      setServices(services.filter(s => s.id !== serviceId));
      toast.success(`${service.name} connection removed`);
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Error syncing services:', error);
      toast.error('Failed to sync services');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleToggleSync,
    handleConnectService,
    handleAddNewService,
    handleRemoveService,
    handleSyncAll
  };
};
