import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const TwoFactorVerification: React.FC = () => {
  const { initiateTwoFactor, completeTwoFactor, awaitingTwoFactor } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await initiateTwoFactor(phoneNumber);
      
      if (success) {
        setStep('code');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await completeTwoFactor(verificationId, verificationCode);
      
      if (!success) {
        setError('Invalid or expired verification code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!awaitingTwoFactor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Two-Factor Authentication</h2>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Please verify your identity to continue
      </p>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendVerification} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              We'll send a verification code to this number
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the code sent to your phone or click the link in the SMS
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setStep('phone')}
            disabled={loading}
          >
            Use a different phone number
          </Button>
        </form>
      )}
    </div>
  );
};

export default TwoFactorVerification; 