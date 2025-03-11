
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface ConnectedPhonesListProps {
  connectedNumbers: string[];
  onRemoveNumber: (index: number) => void;
  onAddTwilioAccount: () => void;
}

export const ConnectedPhonesList: React.FC<ConnectedPhonesListProps> = ({
  connectedNumbers,
  onRemoveNumber,
  onAddTwilioAccount
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-950 font-medium">Connected Phone Numbers</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddTwilioAccount}
          className="text-sm bg-slate-400 hover:bg-slate-300"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Twilio Account
        </Button>
      </div>
      
      {connectedNumbers.length > 0 ? (
        <div className="space-y-2">
          {connectedNumbers.map((number, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-md border">
              <span className="text-gray-950">{number}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveNumber(index)}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border rounded-md bg-gray-50 text-center text-gray-500">
          No phone numbers connected yet
        </div>
      )}
    </div>
  );
};
