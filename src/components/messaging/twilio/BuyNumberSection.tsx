
import React from 'react';
import { Button } from "@/components/ui/button";
import { PhoneNumberForSale } from './PhoneNumberForSale';

interface BuyNumberSectionProps {
  availableNumber: string | null;
  isLoading: boolean;
  loadAvailableForSale: () => void;
  showTermsAndConditions: (phoneNumber: string) => void;
}

export const BuyNumberSection = ({
  availableNumber,
  isLoading,
  loadAvailableForSale,
  showTermsAndConditions
}: BuyNumberSectionProps) => {
  return (
    <div className="space-y-4 my-[41px]">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Phone Number For Sale</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadAvailableForSale} 
          disabled={isLoading} 
          className="text-sm bg-slate-500 hover:bg-slate-400 mx-[28px] px-[24px]"
        >
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading available number...</div>
      ) : availableNumber ? (
        <div className="space-y-2">
          <PhoneNumberForSale 
            phoneNumber={availableNumber} 
            onPurchase={showTermsAndConditions} 
          />
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No phone numbers available for sale at the moment.
        </div>
      )}
      
      <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm">
        <p className="font-medium">How it works:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
          <li>Select the phone number above</li>
          <li>Review and accept the Terms & Conditions</li>
          <li>Complete the purchase process</li>
          <li>The number will be assigned to your account</li>
          <li>You can start using it immediately for messaging</li>
        </ol>
      </div>
    </div>
  );
};
