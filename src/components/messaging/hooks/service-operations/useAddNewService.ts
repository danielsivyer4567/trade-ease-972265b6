
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAddNewService = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fetchMessagingAccounts: () => Promise<void>
) => {
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

  return handleAddNewService;
};
