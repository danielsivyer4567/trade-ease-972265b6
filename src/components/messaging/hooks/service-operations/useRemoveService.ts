
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../../types";

export const useRemoveService = (
  services: ServiceInfo[],
  setServices: React.Dispatch<React.SetStateAction<ServiceInfo[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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
    } catch (error: any) {
      console.error('Error removing service:', error);
      toast.error('Failed to remove service');
    } finally {
      setIsLoading(false);
    }
  };

  return handleRemoveService;
};
