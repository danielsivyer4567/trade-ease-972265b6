
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../../types";

export const useConnectService = (
  services: ServiceInfo[],
  setServices: React.Dispatch<React.SetStateAction<ServiceInfo[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchMessagingAccounts: () => Promise<void>
) => {
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

  return handleConnectService;
};
