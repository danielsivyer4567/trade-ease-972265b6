
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from 'react-router-dom';
import { sendWelcomeEmail } from '@/utils/emailService';

export type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error';

export const useEmailVerification = (navigate: NavigateFunction) => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  // Check for verification parameters in URL
  useEffect(() => {
    const checkForVerification = async () => {
      // Get URL parameters
      const url = new URL(window.location.href);
      const verificationParam = url.searchParams.get('verification');
      const emailParam = url.searchParams.get('email');
      
      // If this is a verification page load
      if (verificationParam === 'true') {
        setVerificationStatus('verifying');
        setVerificationMessage('Verifying your email address...');
        
        try {
          // For this demo, we're simulating success without actually verifying
          setTimeout(async () => {
            setVerificationStatus('success');
            setVerificationMessage('Your email has been verified successfully! You will be redirected to sign in.');
            
            // Send welcome email
            if (emailParam) {
              try {
                await sendWelcomeEmail(emailParam);
              } catch (error) {
                console.error('Error sending welcome email:', error);
              }
            }
            
            // Redirect to login after a short delay
            setTimeout(() => {
              navigate('/auth');
            }, 3000);
          }, 2000);
        } catch (error) {
          console.error('Verification error:', error);
          setVerificationStatus('error');
          setVerificationMessage('There was an error verifying your email. Please try again or contact support.');
        }
      }
    };
    
    checkForVerification();
  }, [navigate]);

  const handleResendVerification = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) throw error;
      
      // Also send our custom email
      const verificationLink = `${window.location.origin}/auth?verification=true&email=${encodeURIComponent(email)}`;
      const { success, error: emailError } = await sendVerificationEmail(email, verificationLink);
      
      if (!success && emailError) {
        console.error('Error sending custom verification email:', emailError);
      }
      
      setVerificationSent(true);
      setVerificationMessage('Verification email resent successfully!');
      return true;
    } catch (error) {
      console.error('Error resending verification:', error);
      setVerificationMessage('Failed to resend verification email.');
      return false;
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
