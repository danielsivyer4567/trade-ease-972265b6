
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

export const useEmailVerification = (navigate: NavigateFunction) => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  // Handle email verification
  useEffect(() => {
    const handleEmailVerification = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      if (type === 'recovery' || type === 'signup') {
        setVerificationStatus('success');
        setVerificationMessage('Your email has been verified! You can now sign in.');
        
        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('Error setting session:', error);
              throw error;
            } else {
              toast.success('Successfully verified and logged in!');
              navigate('/');
            }
          } catch (error) {
            console.error('Error during verification process:', error);
            setVerificationStatus('error');
            setVerificationMessage('There was an error verifying your email. Please try signing in manually.');
          }
        }
      }
    };
    
    handleEmailVerification();
  }, [navigate]);

  const handleResendVerification = async (email: string) => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) throw error;
      
      toast.success('Verification email resent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error(error.message || 'Failed to resend verification email');
    }
  };

  return { 
    verificationStatus, 
    verificationMessage,
    verificationSent,
    setVerificationSent,
    handleResendVerification
  };
};
