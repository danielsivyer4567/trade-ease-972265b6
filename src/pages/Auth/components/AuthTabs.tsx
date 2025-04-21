import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import VerificationStatus from './VerificationStatus';
import OrganizationSetup from './OrganizationSetup';
import VideoDemo from './VideoDemo';

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
  setLoading: (loading: boolean) => void;
  onSignIn: (e: React.FormEvent, rememberMe: boolean) => Promise<void>;
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
          <TabsTrigger value="demo">Video Demo</TabsTrigger>
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
              <CardTitle>Video Demo</CardTitle>
              <CardDescription>Upload a video demonstration of Trade Ease features</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoDemo />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};
