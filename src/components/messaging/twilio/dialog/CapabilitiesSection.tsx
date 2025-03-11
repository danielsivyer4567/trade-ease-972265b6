
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CapabilitiesSectionProps {
  smsCapability: boolean;
  setSmsCapability: (checked: boolean) => void;
  voiceCapability: boolean;
  setVoiceCapability: (checked: boolean) => void;
}

export const CapabilitiesSection = ({
  smsCapability,
  setSmsCapability,
  voiceCapability,
  setVoiceCapability
}: CapabilitiesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sms-capability" 
          checked={smsCapability} 
          onCheckedChange={(checked) => setSmsCapability(checked === true)} 
        />
        <Label htmlFor="sms-capability" className="text-sm font-normal">
          Enable SMS capability
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="voice-capability" 
          checked={voiceCapability} 
          onCheckedChange={(checked) => setVoiceCapability(checked === true)} 
        />
        <Label htmlFor="voice-capability" className="text-sm font-normal">
          Enable Voice capability
        </Label>
      </div>
    </div>
  );
};
