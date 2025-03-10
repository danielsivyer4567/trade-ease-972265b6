
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface PhoneNumberInputProps {
  phoneNumber: string;
  isConnecting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConnect: () => void;
}

export const PhoneNumberInput = ({ 
  phoneNumber, 
  isConnecting, 
  onChange, 
  onConnect 
}: PhoneNumberInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="phone">Phone Number</Label>
        <a 
          href="https://preview.twilio.com/AvailableNumbers" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Find available Twilio numbers
        </a>
      </div>
      <div className="flex gap-4">
        <Input 
          id="phone" 
          type="tel" 
          placeholder="Enter your phone number (XXX-XXX-XXXX)" 
          value={phoneNumber} 
          onChange={onChange} 
          className="flex-1" 
          maxLength={12} 
        />
        <Button 
          onClick={onConnect} 
          disabled={!phoneNumber || isConnecting || phoneNumber.replace(/\D/g, '').length !== 10} 
          className="flex items-center gap-2 px-[17px] bg-slate-400 hover:bg-slate-300"
        >
          {isConnecting ? 
            <>Loading...</> : 
            <>
              <Plus className="h-4 w-4" />
              Connect
            </>
          }
        </Button>
      </div>
    </div>
  );
};
