
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';

// Components
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import DemoRequestForm from './components/DemoRequestForm';
import VerificationStatus from './components/VerificationStatus';
import DemoDataGenerator from './components/DemoDataGenerator';

// Hooks
import { useEmailVerification } from './hooks/useEmailVerification';
import { useAuthRedirect } from './hooks/useAuthRedirect';

export default function Auth() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Demo request state
  const [demoRequestName, setDemoRequestName] = useState('');
  const [demoRequestEmail, setDemoRequestEmail] = useState('');
  const [demoRequestCompany, setDemoRequestCompany] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in and redirect to home
  useAuthRedirect(navigate);

  // Handle email verification process
  const { 
    verificationStatus, 
    verificationMessage, 
    verificationSent, 
    setVerificationSent,
    handleResendVerification 
  } = useEmailVerification(navigate);

  // Create a wrapper for the resend verification handler
  const handleResendVerificationClick = async () => {
    setLoading(true);
    await handleResendVerification(email);
    setLoading(false);
  };

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
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trade Ease</h1>
          <p className="text-gray-600">Simplifying your business operations</p>
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="demo">Request Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials below to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <SignInForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  loading={loading}
                  setLoading={setLoading}
                  verificationSent={verificationSent}
                  setVerificationSent={setVerificationSent}
                  handleResendVerification={handleResendVerificationClick}
                  navigate={navigate}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create a new account to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  loading={loading}
                  setLoading={setLoading}
                  verificationSent={verificationSent}
                  setVerificationSent={setVerificationSent}
                  handleResendVerification={handleResendVerificationClick}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Request a Demo</CardTitle>
                <CardDescription>Let us show you how Trade Ease can help your business</CardDescription>
              </CardHeader>
              <CardContent>
                <DemoRequestForm 
                  demoRequestName={demoRequestName}
                  setDemoRequestName={setDemoRequestName}
                  demoRequestEmail={demoRequestEmail}
                  setDemoRequestEmail={setDemoRequestEmail}
                  demoRequestCompany={demoRequestCompany}
                  setDemoRequestCompany={setDemoRequestCompany}
                  loading={loading}
                  setLoading={setLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <DemoDataGenerator />
        </div>
      </div>
    </div>
  );
}
