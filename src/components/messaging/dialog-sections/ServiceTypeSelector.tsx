
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceTypeSelectorProps {
  serviceType: string;
  setServiceType: (value: string) => void;
}

export const ServiceTypeSelector = ({
  serviceType,
  setServiceType
}: ServiceTypeSelectorProps) => {
  return (
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
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="tiktok">TikTok</SelectItem>
          <SelectItem value="google_business">Google My Business</SelectItem>
          <SelectItem value="twilio">Twilio SMS</SelectItem>
          <SelectItem value="gcpvision">Google Cloud Vision API</SelectItem>
          <SelectItem value="custom">Custom API</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
