
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StandardServiceFormProps {
  serviceType: string;
  apiKey: string;
  setApiKey: (value: string) => void;
  accountId: string;
  setAccountId: (value: string) => void;
  serviceUrl: string;
  setServiceUrl: (value: string) => void;
}

export const StandardServiceForm = ({
  serviceType,
  apiKey,
  setApiKey,
  accountId,
  setAccountId,
  serviceUrl,
  setServiceUrl
}: StandardServiceFormProps) => {
  return (
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
  );
};
