import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAuthForm = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signIn, signUp, awaitingTwoFactor } = useAuth();

  // Check if there are saved credentials in localStorage
  const loadSavedCredentials = () => {
    try {
      const savedEmail = localStorage.getItem('auth_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (err) {
      console.error('Error loading saved credentials:', err);
    }
  };

  const handleSignIn = async (e: React.FormEvent, rememberMe: boolean) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      
      // Save credentials if rememberMe is checked
      if (rememberMe) {
        localStorage.setItem('auth_email', email);
      } else {
        localStorage.removeItem('auth_email');
      }
      
      // If 2FA is required, we'll show the verification screen
      // Otherwise, navigation will be handled by useEffect in the main component
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to sign in');
      toast.error(error.message || 'Failed to sign in');
      console.error('Sign in error:', error);
    } finally {
      if (!awaitingTwoFactor) {
        setLoading(false);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      await signUp(email, password);
      setVerificationSent(true);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to sign up');
      toast.error(error.message || 'Failed to sign up');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Form state
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    setLoading,
    verificationSent,
    setVerificationSent,
    errorMessage,
    loadSavedCredentials,
    
    // Actions
    handleSignIn,
    handleSignUp
  };
};
