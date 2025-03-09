
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TwilioFormProps {
  accountSid: string;
  setAccountSid: (value: string) => void;
  authToken: string;
  setAuthToken: (value: string) => void;
  twilioPhoneNumber: string;
  setTwilioPhoneNumber: (value: string) => void;
}

export const TwilioForm = ({
  accountSid,
  setAccountSid,
  authToken,
  setAuthToken,
  twilioPhoneNumber,
  setTwilioPhoneNumber
}: TwilioFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="account-sid">Account SID</Label>
        <Input 
          id="account-sid" 
          value={accountSid} 
          onChange={e => setAccountSid(e.target.value)} 
          placeholder="Enter your Twilio Account SID" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="auth-token">Auth Token</Label>
        <Input 
          id="auth-token" 
          type="password" 
          value={authToken} 
          onChange={e => setAuthToken(e.target.value)} 
          placeholder="Enter your Twilio Auth Token" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone-number">Twilio Phone Number</Label>
        <Input 
          id="phone-number" 
          value={twilioPhoneNumber} 
          onChange={e => setTwilioPhoneNumber(e.target.value)} 
          placeholder="+1234567890" 
        />
      </div>
    </>
  );
};
