
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from 'react-router-dom';

export const useAuthRedirect = (navigate: NavigateFunction) => {
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);
};
