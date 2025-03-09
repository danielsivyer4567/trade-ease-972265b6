
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

interface TwilioConfigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  twilioConfig: TwilioConfig;
  setTwilioConfig: (config: TwilioConfig) => void;
  onConnect: () => void;
  isConnecting: boolean;
}

export const TwilioConfigDialog = ({
  isOpen,
  onOpenChange,
  twilioConfig,
  setTwilioConfig,
  onConnect,
  isConnecting
}: TwilioConfigDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Connect Twilio Account</DialogTitle>
          <DialogDescription>
            Enter your Twilio credentials to integrate with our messaging system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="account-sid">Account SID</Label>
            <Input 
              id="account-sid" 
              value={twilioConfig.accountSid} 
              onChange={e => setTwilioConfig({
                ...twilioConfig,
                accountSid: e.target.value
              })} 
              placeholder="Enter your Twilio Account SID" 
            />
            <p className="text-xs text-gray-500">
              You can find this in your Twilio Console Dashboard
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auth-token">Auth Token</Label>
            <Input 
              id="auth-token" 
              type="password" 
              value={twilioConfig.authToken} 
              onChange={e => setTwilioConfig({
                ...twilioConfig,
                authToken: e.target.value
              })} 
              placeholder="Enter your Twilio Auth Token" 
            />
            <p className="text-xs text-gray-500">
              This is found in your Twilio Console Dashboard next to your Account SID
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twilio-phone">Twilio Phone Number</Label>
            <Input 
              id="twilio-phone" 
              value={twilioConfig.phoneNumber} 
              onChange={e => setTwilioConfig({
                ...twilioConfig,
                phoneNumber: e.target.value
              })} 
              placeholder="+1XXXXXXXXXX (include country code)" 
            />
            <p className="text-xs text-gray-500">
              This must be a phone number purchased through your Twilio account
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={onConnect} 
            disabled={isConnecting || !twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.phoneNumber} 
            className="bg-slate-400 hover:bg-slate-300"
          >
            {isConnecting ? "Connecting..." : "Connect Twilio Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
