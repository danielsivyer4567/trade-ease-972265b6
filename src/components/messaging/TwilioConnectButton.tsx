import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TwilioOrderNumberDialog } from './TwilioOrderNumberDialog';
import { ConnectSection } from './twilio/ConnectSection';
import { BuyNumberSection } from './twilio/BuyNumberSection';
import { TermsAndConditionsDialog } from './twilio/TermsAndConditionsDialog';
import { PhoneNumberForSale } from './twilio/types';
import { messagingService } from './utils/messagingService';

export const TwilioConnectButton = () => {
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [twilioCredentials, setTwilioCredentials] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  });
  const [activeTab, setActiveTab] = useState<"connect" | "buy">("connect");
  const [availableNumber, setAvailableNumber] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const status = await messagingService.getConnectionStatus();
      setIsConnected(status);
    } catch (error) {
      console.error('Error checking connection status:', error);
      setIsConnected(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await messagingService.initialize(twilioCredentials);
      setIsConnected(true);
      toast.success('Successfully connected to Twilio');
      setOrderDialogOpen(false);
    } catch (error) {
      console.error('Error connecting to Twilio:', error);
      toast.error('Failed to connect to Twilio');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update Twilio credentials
  const updateCredentials = (phoneNumber: string) => {
    setTwilioCredentials(prev => ({
      ...prev,
      phoneNumber
    }));
  };

  // Function to handle opening dialog with correct credentials
  const handleOrderNumber = () => {
    setOrderDialogOpen(true);
  };

  // Function to load phone numbers available for sale
  const loadAvailableForSale = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('phone_numbers_for_sale')
        .select('*')
        .eq('status', 'available');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setAvailableNumber('+1(415)555-0123');
      } else {
        setAvailableNumber(data[0].phone_number);
      }
    } catch (error) {
      console.error('Error loading numbers for sale:', error);
      toast.error('Failed to load available numbers');
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
      toast.loading('Processing purchase...');
      
      // Update the phone number in the credentials
      setTwilioCredentials(prev => ({
        ...prev,
        phoneNumber
      }));

      // Initialize messaging service with new phone number
      await messagingService.initialize({
        ...twilioCredentials,
        phoneNumber
      });

      toast.dismiss();
      toast.success(`Successfully purchased ${phoneNumber}`);
      setAvailableNumber(null);
      setIsConnected(true);
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
            {isConnected ? 'Connected' : 'Connect'}
          </TabsTrigger>
          <TabsTrigger 
            value="buy" 
            className="text-gray-950 bg-slate-500 hover:bg-slate-400 my-0 py-0"
          >
            Purchase A Phone Number
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="w-full">
          <ConnectSection 
            handleOrderNumber={handleOrderNumber}
            isConnected={isConnected}
          />
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
        onConnect={handleConnect}
        isLoading={isLoading}
        updateCredentials={updateCredentials}
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
