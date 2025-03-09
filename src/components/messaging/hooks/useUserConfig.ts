
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UserConfig {
  messaging_enabled: boolean;
}

export const useUserConfig = () => {
  const [userConfig, setUserConfig] = useState<UserConfig>({
    messaging_enabled: false
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
        .select('messaging_enabled')
        .eq('id', userId)
        .single();
        
      if (configError) {
        console.error('Error fetching user configuration:', configError);
      } else if (configData) {
        setUserConfig(configData);
      }
    } catch (error) {
      console.error('Error loading user configuration:', error);
    }
  };

  return { userConfig, setUserConfig };
};
