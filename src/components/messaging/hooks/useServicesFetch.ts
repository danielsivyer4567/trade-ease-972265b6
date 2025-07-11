import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ServiceInfo } from "../types";
import { getDefaultServices, getServiceIconByType, getServiceNameByType } from "../utils/serviceUtils";

export const useServicesFetch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<ServiceInfo[]>([]);

  const mapAccountToService = (account: any): ServiceInfo => {
    return {
      id: account.id,
      name: getServiceNameByType(account.service_type),
      icon: getServiceIconByType(account.service_type),
      isConnected: true,
      syncEnabled: account.enabled,
      lastSynced: 'Recently',
      serviceType: account.service_type,
      connectionDetails: {
        apiKey: account.api_key,
        accountId: account.account_id,
        phoneNumber: account.phone_number,
        accountSid: account.account_sid,
        authToken: account.auth_token,
        gcpVisionKey: account.gcp_vision_key || null
      }
    };
  };

  const fetchMessagingAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session found');
        setServices(getDefaultServices());
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
        setServices(getDefaultServices());
        setIsLoading(false);
        return;
      }
      
      if (accounts && accounts.length > 0) {
        const updatedServices = [...getDefaultServices()];
        
        // Update existing services
        updatedServices.forEach(service => {
          const matchingAccount = accounts.find(a => a.service_type === service.serviceType);
          if (matchingAccount) {
            service.id = matchingAccount.id;
            service.isConnected = true;
            service.syncEnabled = matchingAccount.enabled || false;
            service.lastSynced = 'Recently';
            service.connectionDetails = {
              apiKey: matchingAccount.api_key,
              accountId: matchingAccount.account_id,
              phoneNumber: matchingAccount.phone_number,
              accountSid: matchingAccount.account_sid,
              authToken: matchingAccount.auth_token,
              gcpVisionKey: matchingAccount.gcp_vision_key || null
            };
          }
        });
        
        // Add new services not in the default list
        accounts.forEach(account => {
          const existingService = updatedServices.find(
            s => s.serviceType === account.service_type || s.id === account.id
          );
          
          if (!existingService) {
            updatedServices.push(mapAccountToService(account));
          }
        });
        
        setServices(updatedServices);
      } else {
        setServices(getDefaultServices());
      }
    } catch (error) {
      console.error('Error in fetchMessagingAccounts:', error);
      toast.error('Failed to load messaging accounts');
      setServices(getDefaultServices());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagingAccounts();
  }, []);

  return {
    services,
    setServices,
    isLoading,
    setIsLoading,
    fetchMessagingAccounts
  };
};
