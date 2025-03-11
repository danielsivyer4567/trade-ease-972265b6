
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Phone } from "lucide-react";

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
      <h3 className="text-xl font-medium text-slate-800">Connect a Phone Number</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-grow">
          <Label htmlFor="phone-number" className="sr-only">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              id="phone-number"
              type="tel"
              placeholder="Enter phone number (+1 234 567 8900)"
              value={phoneNumber}
              onChange={onChange}
              className="pl-10 py-6 rounded-lg border-gray-300"
            />
          </div>
        </div>
        
        <Button 
          onClick={onConnect} 
          disabled={!phoneNumber || isConnecting} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-6 rounded-lg"
        >
          {isConnecting ? (
            "Connecting..."
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Connect
            </>
          )}
        </Button>
      </div>
      
      <p className="text-sm text-gray-500">
        Connect your phone number to send and receive messages directly from this dashboard.
      </p>
    </div>
  );
};
