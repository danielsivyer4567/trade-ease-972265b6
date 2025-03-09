
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (serviceType: string, connectionDetails: any) => void;
}

export const ConnectServiceDialog = ({
  isOpen,
  onClose,
  onConnect
}: ConnectDialogProps) => {
  const [serviceType, setServiceType] = useState('sms');
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [serviceUrl, setServiceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('');
  const [gcpVisionKey, setGcpVisionKey] = useState('');

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    if (serviceType === 'twilio') {
      if (!accountSid || !authToken || !twilioPhoneNumber) {
        toast.error("Please fill in all required Twilio fields");
        setIsSubmitting(false);
        return;
      }
    } else if (serviceType === 'gcpvision') {
      if (!gcpVisionKey) {
        toast.error("Please enter your Google Cloud Vision API key");
        setIsSubmitting(false);
        return;
      }
    } else if (!apiKey || (serviceType !== 'email' && !accountId)) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      let connectionDetails;
      
      if (serviceType === 'twilio') {
        connectionDetails = {
          accountSid,
          authToken,
          phoneNumber: twilioPhoneNumber
        };
      } else if (serviceType === 'gcpvision') {
        connectionDetails = {
          gcpVisionKey
        };
      } else {
        connectionDetails = {
          apiKey,
          accountId,
          url: serviceUrl || undefined
        };
      }
      
      onConnect(serviceType, connectionDetails);
      
      // Reset form
      setApiKey('');
      setAccountId('');
      setServiceUrl('');
      setAccountSid('');
      setAuthToken('');
      setTwilioPhoneNumber('');
      setGcpVisionKey('');
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Connect Service</DialogTitle>
          <DialogDescription>
            Add your API keys and account details to connect an external service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS Provider</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
                <SelectItem value="email">Email Service</SelectItem>
                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                <SelectItem value="messenger">Facebook Messenger</SelectItem>
                <SelectItem value="twilio">Twilio SMS</SelectItem>
                <SelectItem value="gcpvision">Google Cloud Vision API</SelectItem>
                <SelectItem value="custom">Custom API</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {serviceType === 'twilio' ? (
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
          ) : serviceType === 'gcpvision' ? (
            <div className="space-y-2">
              <Label htmlFor="gcp-vision-key">Google Cloud Vision API Key</Label>
              <Input 
                id="gcp-vision-key" 
                type="password" 
                value={gcpVisionKey} 
                onChange={e => setGcpVisionKey(e.target.value)} 
                placeholder="Enter your Google Cloud Vision API key" 
              />
              <p className="text-xs text-gray-500">
                Your API key can be found in the Google Cloud Console under APIs &amp; Services {'->'} Credentials
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key / Token</Label>
                <Input 
                  id="api-key" 
                  type="password" 
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)} 
                  placeholder="Enter your API key" 
                />
              </div>
              
              {serviceType !== 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="account-id">Account ID / Phone Number</Label>
                  <Input 
                    id="account-id" 
                    value={accountId} 
                    onChange={e => setAccountId(e.target.value)} 
                    placeholder="Enter account identifier" 
                  />
                </div>
              )}
              
              {serviceType === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="service-url">Service URL (Optional)</Label>
                  <Input 
                    id="service-url" 
                    value={serviceUrl} 
                    onChange={e => setServiceUrl(e.target.value)} 
                    placeholder="https://api.yourservice.com" 
                  />
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Connecting...
              </>
            ) : 'Connect Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

