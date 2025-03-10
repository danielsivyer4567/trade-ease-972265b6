
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TwilioOrderNumberDialog } from './TwilioOrderNumberDialog';
import { Phone, DollarSign } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define a type for the phone number record
interface PhoneNumberForSale {
  id: string;
  phone_number: string;
  price: number;
  status: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export const TwilioConnectButton = () => {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [twilioCredentials, setTwilioCredentials] = useState({
    accountSid: '',
    authToken: ''
  });
  const [activeTab, setActiveTab] = useState<"connect" | "buy">("connect");
  const [availableForSale, setAvailableForSale] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Function to load phone numbers available for sale
  const loadAvailableForSale = async () => {
    setIsLoading(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to view available numbers');
        return;
      }

      // Use proper type assertion for the PhoneNumberForSale table
      const { data, error } = await supabase
        .from('phone_numbers_for_sale')
        .select('*')
        .eq('status', 'available') as { 
          data: PhoneNumberForSale[] | null; 
          error: any 
        };

      if (error) throw error;
      if (!data || data.length === 0) {
        // Use mock data if no numbers are available
        setAvailableForSale(['+1234567890', '+1987654321', '+1555123456']);
      } else {
        // Map the data to extract just the phone numbers
        setAvailableForSale(data.map(item => item.phone_number));
      }
    } catch (error) {
      console.error('Error loading numbers for sale:', error);
      toast.error('Failed to load available numbers');

      // Fallback to mock data
      setAvailableForSale(['+1234567890', '+1987654321', '+1555123456']);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle purchase of a phone number
  const handlePurchaseNumber = async (phoneNumber: string) => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to purchase a number');
        return;
      }

      // This would connect to your payment processing system
      toast.loading('Processing purchase...');

      // Mock successful purchase
      setTimeout(() => {
        // This would update your database to assign the number to the user
        toast.dismiss();
        toast.success(`Successfully purchased ${phoneNumber}`);

        // Remove from available list
        setAvailableForSale(prev => prev.filter(num => num !== phoneNumber));
      }, 2000);
    } catch (error) {
      console.error('Error purchasing number:', error);
      toast.error('Failed to complete purchase');
    }
  };
  return <div className="flex flex-col items-center p-4 border rounded-lg bg-slate-100">
      <Tabs value={activeTab} onValueChange={value => {
      setActiveTab(value as "connect" | "buy");
      if (value === "buy") {
        loadAvailableForSale();
      }
    }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="connect" className="text-gray-950 bg-slate-400 hover:bg-slate-300 mx-[14px]">Connect </TabsTrigger>
          <TabsTrigger value="buy" className="bg-slate-400 hover:bg-slate-300">Buy Phone Numbers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="w-full">
          <p className="mb-4 text-gray-950 text-lg text-center">Connect with phone integration</p>
          <style type="text/css">
            {`.twilio-connect-button { display: flex; justify-content: center; align-items: center; background: #F22F46; width: 180px; height: 36px; padding-right: 5px; color: white; border: none; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 600; line-height: 20px; }
            .icon { margin-top: 4px; width: 40px; }`}
          </style>
          
          
          <div className="flex flex-col items-center mt-3">
            <p className="mb-2 text-gray-950 text-base font-medium">Securely authorize your account without sharing credentials</p>
            
            <Button variant="outline" size="sm" onClick={handleOrderNumber} className="mt-2 text-sm bg-slate-400 hover:bg-slate-300">Browse &amp; Order Phone Numbers</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="buy" className="w-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Phone Numbers For Sale</h3>
              <Button variant="outline" size="sm" onClick={loadAvailableForSale} disabled={isLoading} className="text-sm bg-slate-400 hover:bg-slate-300">
                Refresh
              </Button>
            </div>
            
            {isLoading ? <div className="text-center py-4">Loading available numbers...</div> : availableForSale.length > 0 ? <ul className="space-y-2">
                {availableForSale.map((number, index) => <li key={index} className="flex justify-between items-center p-3 bg-white rounded-md border">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{number}</span>
                    </div>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => handlePurchaseNumber(number)}>
                      <DollarSign className="h-3.5 w-3.5 mr-1" />
                      Purchase
                    </Button>
                  </li>)}
              </ul> : <div className="text-center py-4 text-gray-500">
                No phone numbers available for sale at the moment.
              </div>}
            
            <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm">
              <p className="font-medium">How it works:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
                <li>Select a phone number from the list above</li>
                <li>Complete the purchase process</li>
                <li>The number will be assigned to your account</li>
                <li>You can start using it immediately for messaging</li>
              </ol>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <TwilioOrderNumberDialog isOpen={orderDialogOpen} onOpenChange={setOrderDialogOpen} accountSid={twilioCredentials.accountSid} authToken={twilioCredentials.authToken} />
    </div>;
};
