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
  return <div className="flex flex-col space-y-4">
      
    </div>;
};