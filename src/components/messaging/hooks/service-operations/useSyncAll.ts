
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../../types";

export const useSyncAll = (
  services: ServiceInfo[],
  setServices: React.Dispatch<React.SetStateAction<ServiceInfo[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  return handleSyncAll;
};
