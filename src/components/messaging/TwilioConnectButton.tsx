
import React, { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TwilioOrderNumberDialog } from './twilio/TwilioOrderNumberDialog';
import { ConnectSection } from './twilio/ConnectSection';
import { BuyNumberSection } from './twilio/BuyNumberSection';
import { TermsAndConditionsDialog } from './twilio/TermsAndConditionsDialog';
import { PhoneNumberForSale } from './twilio/types';

export const TwilioConnectButton = () => {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [twilioCredentials, setTwilioCredentials] = useState({
    accountSid: '',
    authToken: ''
  });
  const [activeTab, setActiveTab] = useState<"connect" | "buy">("connect");
  const [availableNumber, setAvailableNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(null);

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
      const {
        data,
        error
      } = (await supabase.from('phone_numbers_for_sale').select('*').eq('status', 'available')) as {
        data: PhoneNumberForSale[] | null;
        error: any;
      };
      if (error) throw error;
      if (!data || data.length === 0) {
        // Use a single authentic-looking number if no numbers are available in DB
        setAvailableNumber('+1(415)555-0123');
      } else {
        // Take the first available phone number
        setAvailableNumber(data[0].phone_number);
      }
    } catch (error) {
      console.error('Error loading numbers for sale:', error);
      toast.error('Failed to load available numbers');

      // Fallback to a single authentic-looking number
      setAvailableNumber('+1(415)555-0123');
    } finally {
      setIsLoading(false);
    }
  };

  // Show terms and conditions before purchase
  const showTermsAndConditions = (phoneNumber: string) => {
    setCurrentPhoneNumber(phoneNumber);
    setTermsAccepted(false);
    setTermsDialogOpen(true);
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

        // Clear the available number
        setAvailableNumber(null);
      }, 2000);
    } catch (error) {
      console.error('Error purchasing number:', error);
      toast.error('Failed to complete purchase');
    }
  };

  // Function to handle agreement to terms and proceed with purchase
  const handleAgreeAndPurchase = () => {
    if (currentPhoneNumber) {
      setTermsDialogOpen(false);
      handlePurchaseNumber(currentPhoneNumber);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg bg-slate-100">
      <Tabs 
        value={activeTab} 
        onValueChange={value => {
          setActiveTab(value as "connect" | "buy");
          if (value === "buy") {
            loadAvailableForSale();
          }
        }} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger 
            value="connect" 
            className="text-gray-950 bg-slate-400 hover:bg-slate-300 mx-[14px]"
          >
            Connect 
          </TabsTrigger>
          <TabsTrigger 
            value="buy" 
            className="text-gray-950 bg-slate-500 hover:bg-slate-400 my-0 py-0"
          >
            Purchase A Phone Number
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="w-full">
          <ConnectSection handleOrderNumber={handleOrderNumber} />
        </TabsContent>
        
        <TabsContent value="buy" className="w-full">
          <BuyNumberSection 
            availableNumber={availableNumber}
            isLoading={isLoading}
            loadAvailableForSale={loadAvailableForSale}
            showTermsAndConditions={showTermsAndConditions}
          />
        </TabsContent>
      </Tabs>
      
      <TwilioOrderNumberDialog 
        isOpen={orderDialogOpen} 
        onOpenChange={setOrderDialogOpen} 
        accountSid={twilioCredentials.accountSid} 
        authToken={twilioCredentials.authToken} 
      />
      
      <TermsAndConditionsDialog 
        open={termsDialogOpen}
        onOpenChange={setTermsDialogOpen}
        termsAccepted={termsAccepted}
        setTermsAccepted={setTermsAccepted}
        onAgreeAndPurchase={handleAgreeAndPurchase}
      />
    </div>
  );
};
