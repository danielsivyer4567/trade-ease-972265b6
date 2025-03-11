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
  return;
};