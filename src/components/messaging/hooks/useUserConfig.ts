import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UserConfig {
  messaging_enabled: boolean;
  organization_id?: string | null;
}

export const useUserConfig = () => {
  const [userConfig, setUserConfig] = useState<UserConfig>({
    messaging_enabled: false,
    organization_id: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserConfig();
  }, []);

  const loadUserConfig = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session found');
        setIsLoading(false);
        return;
      }
      
      const userId = session.user.id;
      
      // Load user configuration
      const { data: configData, error: configError } = await supabase
        .from('users_configuration')
        .select('messaging_enabled, organization_id')
        .eq('id', userId as any)
        .single();
        
      if (configError) {
        console.error('Error fetching user configuration:', configError);
      } else if (configData) {
        // Type-safe update of userConfig
        setUserConfig({
          messaging_enabled: Boolean(configData.messaging_enabled),
          organization_id: configData.organization_id
        });
      }
    } catch (error) {
      console.error('Error loading user configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserOrganization = async (organizationId: string | null) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session found');
        setIsLoading(false);
        return false;
      }

      const userId = session.user.id;
      
      const { error } = await supabase
        .from('users_configuration')
        .update({ organization_id: organizationId } as any)
        .eq('id', userId as any);
        
      if (error) {
        console.error('Error updating user organization:', error);
        setIsLoading(false);
        return false;
      }
      
      setUserConfig(prev => ({
        ...prev,
        organization_id: organizationId
      }));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating user organization:', error);
      setIsLoading(false);
      return false;
    }
  };

  return { userConfig, setUserConfig, updateUserOrganization, isLoading };
};
