
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface ConnectedPhonesListProps {
  connectedNumbers: string[];
  onRemoveNumber: (index: number) => void;
  onAddTwilioAccount: () => void;
}

export const ConnectedPhonesList = ({ 
  connectedNumbers, 
  onRemoveNumber, 
  onAddTwilioAccount 
}: ConnectedPhonesListProps) => {
  return (
    <div className="rounded-lg border p-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Connected Phone Numbers</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddTwilioAccount} 
          className="flex items-center gap-2 text-sm bg-slate-400 hover:bg-slate-300"
        >
          <Plus className="h-3 w-3" />
          Add Twilio Account
        </Button>
      </div>
      
      {connectedNumbers.length > 0 ? (
        <ul className="space-y-2">
          {connectedNumbers.map((number, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>{number}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveNumber(index)} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          No phone numbers connected yet. Connect a number to start syncing messages.
        </p>
      )}
    </div>
  );
};
