import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Mail, AlertCircle, CheckCircle, Building, Users } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoRequestName, setDemoRequestName] = useState('');
  const [demoRequestEmail, setDemoRequestEmail] = useState('');
  const [demoRequestCompany, setDemoRequestCompany] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  
  const [organizationType, setOrganizationType] = useState<'create' | 'join'>('create');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [organizationError, setOrganizationError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    const handleEmailVerification = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      if (type === 'recovery' || type === 'signup') {
        setVerificationStatus('success');
        setVerificationMessage('Your email has been verified! You can now sign in.');
        
        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('Error setting session:', error);
              throw error;
            } else {
              toast.success('Successfully verified and logged in!');
              navigate('/');
            }
          } catch (error) {
            console.error('Error during verification process:', error);
            setVerificationStatus('error');
            setVerificationMessage('There was an error verifying your email. Please try signing in manually.');
          }
        }
      }
    };
    
    handleEmailVerification();
  }, [location, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message === 'Email not confirmed') {
          toast.error('Please verify your email before signing in. Check your inbox for a verification link.');
          setVerificationSent(true);
        } else {
          throw error;
        }
      } else {
        toast.success('Signed in successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (name: string, userId: string) => {
    try {
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({ name })
        .select('id')
        .single();
        
      if (orgError) throw orgError;
      if (!orgData?.id) throw new Error('Failed to create organization');
      
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgData.id,
          user_id: userId,
          role: 'owner'
        });
        
      if (memberError) throw memberError;
      
      const { error: configError } = await supabase
        .from('users_configuration')
        .update({ organization_id: orgData.id })
        .eq('id', userId);
        
      if (configError) throw configError;
      
      return orgData.id;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const joinOrganization = async (inviteCode: string, userId: string) => {
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(inviteCode)) {
        setOrganizationError('Invalid organization code format');
        return null;
      }
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('id', inviteCode)
        .single();
        
      if (orgError || !orgData) {
        setOrganizationError('Organization not found. Please check the code and try again.');
        return null;
      }
      
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgData.id,
          user_id: userId,
          role: 'member'
        });
        
      if (memberError) {
        if (memberError.code === '23505') {
          setOrganizationError('You are already a member of this organization');
        } else {
          throw memberError;
        }
      }
      
      const { error: configError } = await supabase
        .from('users_configuration')
        .update({ organization_id: orgData.id })
        .eq('id', userId);
        
      if (configError) throw configError;
      
      return orgData.id;
    } catch (error) {
      console.error('Error joining organization:', error);
      throw error;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrganizationError('');
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('User creation failed');
      }
      
      const userId = data.user.id;
      
      if (organizationType === 'create' && organizationName) {
        try {
          await createOrganization(organizationName, userId);
          toast.success('Organization created successfully!');
        } catch (orgError: any) {
          console.error('Error creating organization:', orgError);
        }
      } else if (organizationType === 'join' && organizationCode) {
        try {
          await joinOrganization(organizationCode, userId);
          toast.success('Joined organization successfully!');
        } catch (orgError: any) {
          console.error('Error joining organization:', orgError);
        }
      }
      
      setVerificationSent(true);
      toast.success('Signed up successfully! Please check your email for verification.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) throw error;
      
      toast.success('Verification email resent! Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Demo request:', { demoRequestName, demoRequestEmail, demoRequestCompany });
      
      toast.success('Demo request submitted successfully! Our team will contact you shortly.');
      
      setDemoRequestName('');
      setDemoRequestEmail('');
      setDemoRequestCompany('');
    } catch (error) {
      console.error('Error requesting demo:', error);
      toast.error('Failed to submit demo request');
    } finally {
      setLoading(false);
    }
  };

  if (verificationStatus !== 'idle') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-16 h-16" />
            </div>
            <CardTitle className="text-center">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {verificationStatus === 'success' ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold">{verificationMessage}</p>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="mt-6 bg-slate-700 hover:bg-slate-800"
                >
                  Go to Sign In
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-xl font-semibold">{verificationMessage}</p>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="mt-6 bg-slate-700 hover:bg-slate-800"
                >
                  Go to Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
                {verificationSent && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Verification Required</p>
                        <p className="text-blue-700 text-sm mt-1">
                          Please check your email for a verification link. 
                          Once verified, you'll be able to sign in.
                        </p>
                        <Button
                          variant="link"
                          className="text-blue-600 p-0 h-auto mt-1 font-medium"
                          onClick={handleResendVerification}
                          disabled={loading}
                        >
                          Resend verification email
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-slate-700 hover:bg-slate-800"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
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
                {verificationSent && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Verification Email Sent</p>
                        <p className="text-green-700 text-sm mt-1">
                          We've sent a verification link to your email.
                          Please check your inbox and click the link to activate your account.
                        </p>
                        <Button
                          variant="link"
                          className="text-green-600 p-0 h-auto mt-1 font-medium"
                          onClick={handleResendVerification}
                          disabled={loading}
                        >
                          Resend verification email
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input 
                      id="signup-confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label className="mb-2 block">Organization Options</Label>
                    
                    <RadioGroup 
                      value={organizationType} 
                      onValueChange={(value) => setOrganizationType(value as 'create' | 'join')}
                      className="mb-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="create" id="create-org" />
                        <Label htmlFor="create-org" className="flex items-center gap-2 cursor-pointer">
                          <Building className="h-4 w-4" />
                          Create a new organization
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="join" id="join-org" />
                        <Label htmlFor="join-org" className="flex items-center gap-2 cursor-pointer">
                          <Users className="h-4 w-4" />
                          Join an existing organization
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {organizationType === 'create' && (
                      <div className="space-y-2">
                        <Label htmlFor="org-name">Organization Name</Label>
                        <Input 
                          id="org-name" 
                          type="text" 
                          placeholder="Your Company" 
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                        />
                      </div>
                    )}
                    
                    {organizationType === 'join' && (
                      <div className="space-y-2">
                        <Label htmlFor="org-code">Organization Code</Label>
                        <Input 
                          id="org-code" 
                          type="text" 
                          placeholder="Enter invitation code" 
                          value={organizationCode}
                          onChange={(e) => setOrganizationCode(e.target.value)}
                        />
                        {organizationError && (
                          <p className="text-sm text-red-500 mt-1">{organizationError}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-slate-700 hover:bg-slate-800"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </form>
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
                <form onSubmit={handleDemoRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="demo-name">Full Name</Label>
                    <Input 
                      id="demo-name" 
                      type="text" 
                      placeholder="John Doe" 
                      value={demoRequestName}
                      onChange={(e) => setDemoRequestName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demo-email">Email</Label>
                    <Input 
                      id="demo-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={demoRequestEmail}
                      onChange={(e) => setDemoRequestEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demo-company">Company Name</Label>
                    <Input 
                      id="demo-company" 
                      type="text" 
                      placeholder="Your Company" 
                      value={demoRequestCompany}
                      onChange={(e) => setDemoRequestCompany(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-slate-700 hover:bg-slate-800"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Request Demo'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
