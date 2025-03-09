
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
      <Label htmlFor="phone">Phone Number</Label>
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
