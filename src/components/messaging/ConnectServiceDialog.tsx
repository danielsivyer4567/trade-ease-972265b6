
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useConnectServiceForm } from './hooks/useConnectServiceForm';
import { ServiceTypeSelector } from './dialog-sections/ServiceTypeSelector';
import { TwilioForm } from './dialog-sections/TwilioForm';
import { GCPVisionForm } from './dialog-sections/GCPVisionForm';
import { StandardServiceForm } from './dialog-sections/StandardServiceForm';

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
  const {
    serviceType,
    setServiceType,
    apiKey,
    setApiKey,
    accountId,
    setAccountId,
    serviceUrl,
    setServiceUrl,
    isSubmitting,
    accountSid,
    setAccountSid,
    authToken,
    setAuthToken,
    twilioPhoneNumber,
    setTwilioPhoneNumber,
    gcpVisionKey,
    setGcpVisionKey,
    handleSubmit
  } = useConnectServiceForm(onConnect, onClose);

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
          <ServiceTypeSelector 
            serviceType={serviceType}
            setServiceType={setServiceType}
          />
          
          {serviceType === 'twilio' ? (
            <TwilioForm 
              accountSid={accountSid}
              setAccountSid={setAccountSid}
              authToken={authToken}
              setAuthToken={setAuthToken}
              twilioPhoneNumber={twilioPhoneNumber}
              setTwilioPhoneNumber={setTwilioPhoneNumber}
            />
          ) : serviceType === 'gcpvision' ? (
            <GCPVisionForm 
              gcpVisionKey={gcpVisionKey}
              setGcpVisionKey={setGcpVisionKey}
            />
          ) : (
            <StandardServiceForm 
              serviceType={serviceType}
              apiKey={apiKey}
              setApiKey={setApiKey}
              accountId={accountId}
              setAccountId={setAccountId}
              serviceUrl={serviceUrl}
              setServiceUrl={setServiceUrl}
            />
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
