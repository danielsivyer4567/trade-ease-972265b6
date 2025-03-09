
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GCPVisionFormProps {
  gcpVisionKey: string;
  setGcpVisionKey: (value: string) => void;
}

export const GCPVisionForm = ({ 
  gcpVisionKey, 
  setGcpVisionKey 
}: GCPVisionFormProps) => {
  return (
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
  );
};
