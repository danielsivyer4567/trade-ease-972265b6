
import React from 'react';
import { Button } from "@/components/ui/button";

interface ConnectSectionProps {
  handleOrderNumber: () => void;
}

export const ConnectSection = ({ handleOrderNumber }: ConnectSectionProps) => {
  return (
    <div className="w-full">
      <p className="mb-4 text-gray-950 text-lg text-center">Connect with phone integration</p>
      <style type="text/css">
        {`.twilio-connect-button { display: flex; justify-content: center; align-items: center; background: #F22F46; width: 180px; height: 36px; padding-right: 5px; color: white; border: none; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600; line-height: 20px; }
        .icon { margin-top: 4px; width: 40px; }`}
      </style>
      
      <div className="flex flex-col items-center mt-3">
        <p className="mb-2 text-gray-950 text-base font-medium">Securely authorize your account without sharing credentials</p>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOrderNumber} 
          className="mt-2 text-sm bg-slate-400 hover:bg-slate-300"
        >
          Browse &amp; Order Phone Numbers
        </Button>
      </div>
    </div>
  );
};
