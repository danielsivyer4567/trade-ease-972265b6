
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

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  isConnecting,
  onChange,
  onConnect
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone-number" className="text-gray-950">Phone Number</Label>
        <div className="flex items-center gap-2">
          <Input
            id="phone-number"
            type="tel"
            placeholder="+1 (123) 456-7890"
            value={phoneNumber}
            onChange={onChange}
            className="flex-1"
          />
          <Button 
            onClick={onConnect} 
            disabled={isConnecting || !phoneNumber} 
            className="bg-slate-400 hover:bg-slate-300"
          >
            {isConnecting ? (
              "Connecting..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Connect
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Enter your phone number with country code (e.g., +1 for US)
        </p>
      </div>
    </div>
  );
};
