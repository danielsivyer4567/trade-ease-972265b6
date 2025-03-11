
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, DollarSign } from 'lucide-react';

interface PhoneNumberForSaleProps {
  phoneNumber: string;
  onPurchase: (phoneNumber: string) => void;
}

export const PhoneNumberForSale = ({ phoneNumber, onPurchase }: PhoneNumberForSaleProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-white rounded-md border">
      <div className="flex items-center">
        <Phone className="h-4 w-4 mr-2" />
        <span>{phoneNumber}</span>
      </div>
      <Button 
        size="sm" 
        onClick={() => onPurchase(phoneNumber)} 
        className="bg-green-500 hover:bg-green-600 mx-[16px] px-[9px]"
      >
        <DollarSign className="h-3.5 w-3.5 mr-1" />
        Purchase
      </Button>
    </div>
  );
};
