
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

  useEffect(() => {
    loadUserConfig();
  }, []);

  const loadUserConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session found');
        return;
      }
      
      const userId = session.user.id;
      
      // Load user configuration
      const { data: configData, error: configError } = await supabase
        .from('users_configuration')
        .select('messaging_enabled, organization_id')
        .eq('id', userId)
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
    }
  };

  const updateUserOrganization = async (organizationId: string | null) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session found');
        return;
      }

      const userId = session.user.id;
      
      const { error } = await supabase
        .from('users_configuration')
        .update({ organization_id: organizationId })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user organization:', error);
        return false;
      }
      
      setUserConfig(prev => ({
        ...prev,
        organization_id: organizationId
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating user organization:', error);
      return false;
    }
  };

  return { userConfig, setUserConfig, updateUserOrganization };
};
