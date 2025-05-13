import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ConnectSectionProps {
  handleOrderNumber: () => void;
  isConnected: boolean;
}

export const ConnectSection = ({ handleOrderNumber, isConnected }: ConnectSectionProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {isConnected ? (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span>Connected to Twilio</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 text-center">
            Connect your Twilio account to enable SMS messaging capabilities.
          </p>
          <Button 
            onClick={handleOrderNumber}
            className="bg-slate-400 hover:bg-slate-300"
          >
            Connect Twilio Account
          </Button>
        </>
      )}
    </div>
  );
};