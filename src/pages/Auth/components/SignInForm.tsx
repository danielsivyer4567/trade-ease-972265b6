
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  verificationSent: boolean;
  setVerificationSent: (sent: boolean) => void; // This prop was missing in usage
  handleResendVerification: () => Promise<void>;
  navigate: (path: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  setLoading,
  verificationSent,
  setVerificationSent, // Added this to the destructuring
  handleResendVerification,
  navigate
}) => {
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

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
  );
};

export default SignInForm;
