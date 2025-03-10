import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Mail, Building, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sendVerificationEmail } from '@/utils/emailService';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  verificationSent: boolean;
  setVerificationSent: (sent: boolean) => void;
  handleResendVerification: () => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
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
  handleResendVerification
}) => {
  const [organizationType, setOrganizationType] = useState<'create' | 'join'>('create');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationCode, setOrganizationCode] = useState('');
  const [organizationError, setOrganizationError] = useState('');

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
      
      if (data.user && !data.session) {
        const verificationLink = `${window.location.origin}/auth?verification=true&email=${encodeURIComponent(email)}`;
        
        try {
          const { success, error } = await sendVerificationEmail(email, verificationLink);
          if (success) {
            console.log('Custom verification email sent successfully');
          } else {
            console.error('Error sending custom verification email:', error);
          }
        } catch (emailError) {
          console.error('Exception sending custom verification email:', emailError);
        }
      }
      
      toast.success('Signed up successfully! Please check your email for verification.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
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
  );
};

export default SignUpForm;
