
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ManualEntryTabProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

export const ManualEntryTab = ({
  phoneNumber,
  setPhoneNumber
}: ManualEntryTabProps) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="phone-number">Phone Number</Label>
        <Input 
          id="phone-number" 
          placeholder="+1XXXXXXXXXX (include country code)" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
        />
        <p className="text-xs text-gray-500">
          This must be an available phone number from Twilio
        </p>
      </div>
    </div>
  );
};
