
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAuthForm = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  
  // Demo request state
  const [demoRequestName, setDemoRequestName] = useState('');
  const [demoRequestEmail, setDemoRequestEmail] = useState('');
  const [demoRequestCompany, setDemoRequestCompany] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation will be handled by useEffect in the main component
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to sign in');
      toast.error(error.message || 'Failed to sign in');
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
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

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Store demo request in Supabase
      const { error } = await supabase
        .from('demo_requests')
        .insert({
          name: demoRequestName,
          email: demoRequestEmail,
          company: demoRequestCompany,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast.success('Demo request submitted successfully!');
      setDemoRequestName('');
      setDemoRequestEmail('');
      setDemoRequestCompany('');
    } catch (error: any) {
      console.error('Demo request error:', error);
      toast.error('Failed to submit demo request. Please try again.');
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
    
    // Demo request state
    demoRequestName,
    setDemoRequestName,
    demoRequestEmail,
    setDemoRequestEmail,
    demoRequestCompany,
    setDemoRequestCompany,
    
    // Actions
    handleSignIn,
    handleSignUp,
    handleDemoRequest
  };
};
