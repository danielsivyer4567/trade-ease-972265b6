import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TwilioOrderNumberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountSid: string;
  authToken: string;
  onConnect: () => Promise<void>;
  isLoading: boolean;
  updateCredentials: (phoneNumber: string) => void;
}

export const TwilioOrderNumberDialog = ({
  isOpen,
  onOpenChange,
  accountSid,
  authToken,
  onConnect,
  isLoading,
  updateCredentials
}: TwilioOrderNumberDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleConnect = async () => {
    // Update the credentials with the phone number
    updateCredentials(phoneNumber);
    // Connect to Twilio
    await onConnect();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Connect Twilio Account</DialogTitle>
          <DialogDescription>
            Enter your Twilio credentials to enable SMS messaging.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="account-sid">Account SID</Label>
            <Input 
              id="account-sid" 
              value={accountSid} 
              readOnly
              className="bg-slate-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auth-token">Auth Token</Label>
            <Input 
              id="auth-token" 
              type="password" 
              value={authToken} 
              readOnly
              className="bg-slate-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input 
              id="phone-number" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1XXXXXXXXXX (include country code)"
            />
            <p className="text-xs text-gray-500">
              Enter your Twilio phone number or purchase a new one
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isLoading || !phoneNumber}
            className="bg-slate-400 hover:bg-slate-300"
          >
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
