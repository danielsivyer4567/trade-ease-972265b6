
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import DemoRequestForm from './DemoRequestForm';
import VerificationStatus from './VerificationStatus';
import OrganizationSetup from './OrganizationSetup';
import DemoDataGenerator from './DemoDataGenerator';

interface AuthTabsProps {
  defaultTab: string;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  verificationSent: boolean;
  demoRequestName: string;
  setDemoRequestName: (name: string) => void;
  demoRequestEmail: string;
  setDemoRequestEmail: (email: string) => void;
  demoRequestCompany: string;
  setDemoRequestCompany: (company: string) => void;
  setLoading: (loading: boolean) => void;
  onSignIn: (e: React.FormEvent) => Promise<void>;
  onSignUp: (e: React.FormEvent) => Promise<void>;
  inviteCode: string | null;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
  defaultTab,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  verificationSent,
  demoRequestName,
  setDemoRequestName,
  demoRequestEmail,
  setDemoRequestEmail,
  demoRequestCompany,
  setDemoRequestCompany,
  setLoading,
  onSignIn,
  onSignUp,
  inviteCode
}) => {
  return (
    <>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
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
                onSubmit={onSignIn}
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
                onSubmit={onSignUp}
              />
              {verificationSent && (
                <VerificationStatus 
                  email={email}
                  verificationSent={verificationSent}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Setup</CardTitle>
              <CardDescription>Create or join an organization</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationSetup initialInviteCode={inviteCode} />
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
    </>
  );
};
