import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Components
import { AuthContainer } from './components/AuthContainer';
import { AuthTabs } from './components/AuthTabs';
import VerificationStatus from './components/VerificationStatus';
import TwoFactorVerification from './components/TwoFactorVerification';
import { CreateDemoUser } from './components/CreateDemoUser';

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
  const { user, loading: authLoading, awaitingTwoFactor } = useAuth();
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
    loadSavedCredentials,
    handleSignIn,
    handleSignUp,
  } = useAuthForm();
  
  // Handle email verification process - moved before conditional returns
  const { 
    verificationStatus, 
    verificationMessage, 
    verificationSent: hookVerificationSent, 
    handleResendVerification 
  } = useEmailVerification(navigate);
  
  // Load saved credentials and handle redirect
  useEffect(() => {
    // Load saved credentials
    loadSavedCredentials();
    
    // Check if user is authenticated and redirect
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, loadSavedCredentials]);

  // Handle initial loading state from AuthProvider
  if (authLoading) {
    return <LoadingIndicator />;
  }

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
  
  // If awaiting two-factor auth, show the verification screen
  if (awaitingTwoFactor) {
    return (
      <AuthContainer>
        <TwoFactorVerification />
      </AuthContainer>
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
        setLoading={setLoading}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        inviteCode={inviteCode}
      />

      {/* Add the CreateDemoUser component */}
      <div className="mt-8">
        <CreateDemoUser />
      </div>
    </AuthContainer>
  );
}
