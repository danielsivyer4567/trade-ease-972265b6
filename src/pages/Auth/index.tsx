import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Components
import { AuthContainer } from './components/AuthContainer';
import { AuthTabs } from './components/AuthTabs';
import VerificationStatus from './components/VerificationStatus';

// Hooks
import { useEmailVerification } from './hooks/useEmailVerification';
import { useAuthRedirect } from './hooks/useAuthRedirect';
import { useInviteCode } from './hooks/useInviteCode';
import { useAuthForm } from './hooks/useAuthForm';

// Add a simple loading component or spinner if you have one
// For now, just using text
const LoadingIndicator = () => <div>Loading authentication state...</div>;

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  // Destructure loading state along with user
  const { user, loading: authLoading } = useAuth();
  const { inviteCode } = useInviteCode();
  const {
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
    demoRequestName,
    setDemoRequestName,
    demoRequestEmail,
    setDemoRequestEmail,
    demoRequestCompany,
    setDemoRequestCompany,
    handleSignIn,
    handleSignUp,
  } = useAuthForm();

  // Handle initial loading state from AuthProvider
  if (authLoading) {
    return <LoadingIndicator />;
  }

  // Redirect if user is already authenticated (runs AFTER loading is false)
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle email verification process
  const { 
    verificationStatus, 
    verificationMessage, 
    verificationSent: hookVerificationSent, 
    handleResendVerification 
  } = useEmailVerification(navigate);

  // If verification is in progress, show the verification status
  if (verificationStatus !== 'idle') {
    return (
      <VerificationStatus 
        status={verificationStatus} 
        message={verificationMessage} 
        navigate={navigate} 
      />
    );
  }

  return (
    <AuthContainer>
      <AuthTabs
        defaultTab={inviteCode ? "organization" : "signin"}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        loading={loading}
        verificationSent={verificationSent}
        demoRequestName={demoRequestName}
        setDemoRequestName={setDemoRequestName}
        demoRequestEmail={demoRequestEmail}
        setDemoRequestEmail={setDemoRequestEmail}
        demoRequestCompany={demoRequestCompany}
        setDemoRequestCompany={setDemoRequestCompany}
        setLoading={setLoading}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        inviteCode={inviteCode}
      />
    </AuthContainer>
  );
}
