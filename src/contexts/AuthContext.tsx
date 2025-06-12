import React, { createContext, useState, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { twoFactorAuthService } from '@/services/TwoFactorAuthService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  awaitingTwoFactor: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initiateTwoFactor: (phoneNumber: string) => Promise<boolean>;
  completeTwoFactor: (verificationId: string, code: string) => Promise<boolean>;
  enableTwoFactor: (phoneNumber: string) => Promise<boolean>;
  disableTwoFactor: () => Promise<boolean>;
  checkTwoFactorEnabled: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [awaitingTwoFactor, setAwaitingTwoFactor] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initializeAuth = async () => {
      try {
        console.log('Auth: Starting initialization...');
        
        // Get initial session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Auth: Error getting session:', error);
          // Don't throw - just log and continue
        }
        
        console.log('Auth: Got initial session:', currentSession ? 'Session exists' : 'No session');
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false); // Always set loading to false here
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (!mounted) return;

            console.log('Auth: State changed:', event);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
          }
        );
        
        authSubscription = subscription;
      } catch (error) {
        console.error('Auth: Error initializing:', error);
        if (mounted) {
          setLoading(false); // Always set loading to false on error
          setSession(null);
          setUser(null);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('Auth: Cleaning up...');
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Show loading state while initializing
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
      
      if (!data || !data.user) {
        console.error('Sign in response missing user data:', data);
        throw new Error('Invalid response from authentication service');
      }
      
      console.log('Sign in successful, user:', data.user.id);
      
      // Skip 2FA check if TwoFactorAuthService fails
      try {
        const isTwoFactorEnabled = await twoFactorAuthService.isEnabled(data.user.id);
        
        if (isTwoFactorEnabled) {
          setTempUserId(data.user.id);
          setAwaitingTwoFactor(true);
          await supabase.auth.signOut();
          return;
        }
      } catch (twoFactorError) {
        console.warn('2FA check failed, continuing without 2FA:', twoFactorError);
      }
      
      // No 2FA, user is fully authenticated
      setAwaitingTwoFactor(false);
      setTempUserId(null);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Error signing in:', error.message || error);
      
      // Handle the case where the error is from our custom JSON parser
      if (error.error === true && error.message === 'Invalid JSON response') {
        toast.error('Authentication service error. Please try again later.');
      } else {
        toast.error(error.message || 'Error signing in');
      }
      
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });
      if (error) throw error;
      toast.success('Sign up successful! Please check your email for verification.');
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset 2FA state
      setAwaitingTwoFactor(false);
      setTempUserId(null);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error(error.message || 'Error signing out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Error resetting password:', error.message);
      toast.error(error.message || 'Error resetting password');
      throw error;
    }
  };
  
  // Initiate 2FA by sending verification SMS
  const initiateTwoFactor = async (phoneNumber: string): Promise<boolean> => {
    try {
      if (!tempUserId) {
        toast.error('No user awaiting verification');
        return false;
      }
      
      const verificationData = await twoFactorAuthService.createVerificationRequest(
        tempUserId,
        phoneNumber
      );
      
      if (!verificationData) {
        toast.error('Failed to create verification request');
        return false;
      }
      
      const smsSent = await twoFactorAuthService.sendVerificationSMS(
        phoneNumber,
        verificationData.verificationLink
      );
      
      if (!smsSent) {
        toast.error('Failed to send verification SMS');
        return false;
      }
      
      toast.success('Verification SMS sent. Please check your phone.');
      return true;
    } catch (error: any) {
      console.error('Error initiating 2FA:', error);
      toast.error(error.message || 'Error initiating two-factor authentication');
      return false;
    }
  };
  
  // Complete 2FA verification
  const completeTwoFactor = async (verificationId: string, code: string): Promise<boolean> => {
    try {
      const isValid = await twoFactorAuthService.verifyCode(verificationId, code);
      
      if (!isValid) {
        toast.error('Invalid or expired verification code');
        return false;
      }
      
      if (tempUserId) {
        toast.success('Two-factor authentication successful. You are now signed in.');
        setAwaitingTwoFactor(false);
        setTempUserId(null);
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error completing 2FA:', error);
      toast.error(error.message || 'Error completing two-factor authentication');
      return false;
    }
  };
  
  // Enable 2FA for a user
  const enableTwoFactor = async (phoneNumber: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be signed in to enable 2FA');
        return false;
      }
      
      const enabled = await twoFactorAuthService.enable(user.id, phoneNumber);
      
      if (!enabled) {
        toast.error('Failed to enable two-factor authentication');
        return false;
      }
      
      toast.success('Two-factor authentication enabled successfully');
      return true;
    } catch (error: any) {
      console.error('Error enabling 2FA:', error);
      toast.error(error.message || 'Error enabling two-factor authentication');
      return false;
    }
  };
  
  // Disable 2FA for a user
  const disableTwoFactor = async (): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be signed in to disable 2FA');
        return false;
      }
      
      const disabled = await twoFactorAuthService.disable(user.id);
      
      if (!disabled) {
        toast.error('Failed to disable two-factor authentication');
        return false;
      }
      
      toast.success('Two-factor authentication disabled successfully');
      return true;
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      toast.error(error.message || 'Error disabling two-factor authentication');
      return false;
    }
  };
  
  // Check if 2FA is enabled for the current user
  const checkTwoFactorEnabled = async (): Promise<boolean> => {
    try {
      if (!user) return false;
      return await twoFactorAuthService.isEnabled(user.id);
    } catch (error: any) {
      console.error('Error checking 2FA status:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      awaitingTwoFactor,
      signIn,
      signUp,
      signOut,
      resetPassword,
      initiateTwoFactor,
      completeTwoFactor,
      enableTwoFactor,
      disableTwoFactor,
      checkTwoFactorEnabled,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
