
import { useState } from 'react';
import { toast } from "sonner";

export interface ServiceConnectionDetails {
  apiKey?: string;
  accountId?: string;
  url?: string;
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
  gcpVisionKey?: string;
}

export const useConnectServiceForm = (
  onConnect: (serviceType: string, connectionDetails: ServiceConnectionDetails) => void,
  onClose: () => void
) => {
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
      let connectionDetails: ServiceConnectionDetails = {};
      
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

  return {
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
  };
};
