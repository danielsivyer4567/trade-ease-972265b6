import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, PhoneCall } from "lucide-react";

interface BuyNumberSectionProps {
  availableNumber: string | null;
  isLoading: boolean;
  loadAvailableForSale: () => Promise<void>;
  showTermsAndConditions: (phoneNumber: string) => void;
}

export const BuyNumberSection = ({
  availableNumber,
  isLoading,
  loadAvailableForSale,
  showTermsAndConditions
}: BuyNumberSectionProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">
        Purchase a new phone number to use with the messaging service.
      </p>
      
      {availableNumber ? (
        <div className="border p-4 rounded-md bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Available Number</h3>
              <p className="text-xl font-bold">{availableNumber}</p>
            </div>
            <Button
              onClick={() => showTermsAndConditions(availableNumber)}
              className="bg-slate-400 hover:bg-slate-300"
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Purchase
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={loadAvailableForSale}
            disabled={isLoading}
            className="bg-slate-400 hover:bg-slate-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Find Available Numbers"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
