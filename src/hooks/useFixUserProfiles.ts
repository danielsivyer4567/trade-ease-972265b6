import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFixUserProfiles = () => {
  const { user } = useAuth();
  const [isFixed, setIsFixed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsChecking(false);
      return;
    }

    const checkAndFixUserProfile = async () => {
      try {
        // First, try to select from user_profiles with all columns
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking user profile:', error);
          
          // If the error is about missing columns, create a minimal profile
          if (error.message.includes('column') || error.code === '42703') {
            // Try to create/update with only basic columns
            const { error: upsertError } = await supabase
              .from('user_profiles')
              .upsert({
                user_id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });

            if (upsertError) {
              console.error('Error creating basic profile:', upsertError);
            } else {
              console.log('Created basic user profile');
              setIsFixed(true);
            }
          }
        } else {
          // Profile exists and can be read
          setIsFixed(true);
        }
      } catch (err) {
        console.error('Unexpected error in checkAndFixUserProfile:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAndFixUserProfile();
  }, [user]);

  return { isFixed, isChecking };
}; 