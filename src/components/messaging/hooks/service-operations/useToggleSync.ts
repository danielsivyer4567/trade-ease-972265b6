
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../../types";

export const useToggleSync = (
  services: ServiceInfo[],
  setServices: React.Dispatch<React.SetStateAction<ServiceInfo[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleToggleSync = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('messaging_accounts')
        .update({ enabled: !service.syncEnabled } as any)
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
    } catch (error: any) {
      console.error('Error toggling sync status:', error);
      toast.error('Failed to update sync settings');
    } finally {
      setIsLoading(false);
    }
  };

  return handleToggleSync;
};
