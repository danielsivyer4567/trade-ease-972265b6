
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled by useEffect in the main component
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      setVerificationSent(true);
    } catch (error) {
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
  };
};
