
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TwilioOrderNumberDialog } from './TwilioOrderNumberDialog';

export const TwilioConnectButton = () => {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [twilioCredentials, setTwilioCredentials] = useState({
    accountSid: '',
    authToken: ''
  });
  
  // Function to handle opening dialog with correct credentials
  const handleOrderNumber = () => {
    // In a real app, you might want to get these from a stored location or context
    const accountSid = prompt('Enter your Twilio Account SID:');
    const authToken = prompt('Enter your Twilio Auth Token:');
    
    if (accountSid && authToken) {
      setTwilioCredentials({
        accountSid,
        authToken
      });
      setOrderDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-slate-100">
      <p className="text-sm text-gray-700 mb-4">Connect with Twilio's official integration:</p>
      <style type="text/css">
        {`.twilio-connect-button { display: flex; justify-content: center; align-items: center; background: #F22F46; width: 180px; height: 36px; padding-right: 5px; color: white; border: none; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600; line-height: 20px; }
        .icon { margin-top: 4px; width: 40px; }`}
      </style>
      <a href="https://www.twilio.com/authorize/CN158fff0e33aaa30f2a94f303ce5e7647" className="twilio-connect-button">
        <span className="icon">
          <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPgoJPHRpdGxlPnR3aWxpby1sb2dvbWFyay13aGl0ZUFydGJvYXJkIDE8L3RpdGxlPgoJPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzAsMTVBMTUsMTUsMCwxLDAsNDUsMzAsMTUsMTUsMCwwLDAsMzAsMTVabTAsMjZBMTEsMTEsMCwxLDEsNDEsMzAsMTEsMTEsMCwwLDEsMzAsNDFabTYuOC0xNC43YTMuMSwzLjEsMCwxLDEtMy4xLTMuMUEzLjEyLDMuMTIsMCwwLDEsMjkuNCwzMy43Wm0wLTcuNGEzLjEsMy4xLDAsMSwxLTMuMS0zLjFBMy4xMiwzLjEyLDAsMCwxLDM2LjgsMzMuN1ptLTcuNCwwYTMuMSwzLjEsMCwxLDEtMy4xLTMuMUEzLjEyLDMuMTIsMCwwLDEsMjkuNCwzMy43Wm0wLTcuNGEzLjEsMy4xLDAsMSwxLTMuMS0zLjFBMy4xMiwzLjEyLDAsMCwxLDI5LjQsMjYuM1oiLz4KPC9zdmc+" alt="Twilio logo" />
        </span>
        Twilio Connect App
      </a>
      
      <div className="flex flex-col items-center mt-3">
        <p className="text-xs text-gray-500 mb-2">
          Securely authorize your Twilio account without sharing credentials
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOrderNumber}
          className="mt-2 text-sm bg-slate-400 hover:bg-slate-300"
        >
          Browse & Order Twilio Numbers
        </Button>
      </div>
      
      <TwilioOrderNumberDialog 
        isOpen={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        accountSid={twilioCredentials.accountSid}
        authToken={twilioCredentials.authToken}
      />
    </div>
  );
};
