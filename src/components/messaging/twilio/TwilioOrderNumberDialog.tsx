
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrowseNumbersTab } from './dialog/BrowseNumbersTab';
import { ManualEntryTab } from './dialog/ManualEntryTab';
import { CapabilitiesSection } from './dialog/CapabilitiesSection';
import { TwilioPhoneNumber, TwilioOrderNumberDialogProps } from './types';

export const TwilioOrderNumberDialog = ({
  isOpen,
  onOpenChange,
  accountSid,
  authToken
}: TwilioOrderNumberDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCapability, setSmsCapability] = useState(true);
  const [voiceCapability, setVoiceCapability] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<TwilioPhoneNumber[]>([]);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);
  const [areaCode, setAreaCode] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  // Fetch available numbers when dialog opens
  useEffect(() => {
    if (isOpen && accountSid && authToken) {
      fetchAvailableNumbers();
    }
  }, [isOpen, accountSid, authToken]);

  const fetchAvailableNumbers = async () => {
    if (!accountSid || !authToken) {
      toast.error("Twilio credentials are required");
      return;
    }

    setIsLoadingNumbers(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-available-numbers', {
        body: {
          accountSid,
          authToken,
          areaCode: areaCode || undefined,
          limit: 10
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch available numbers");
      }
      
      setAvailableNumbers(data.numbers || []);
    } catch (error: any) {
      console.error("Error fetching available numbers:", error);
      toast.error(error.message || "Failed to fetch available numbers");
    } finally {
      setIsLoadingNumbers(false);
    }
  };

  const handleOrderNumber = async () => {
    if (!phoneNumber) {
      toast.error("Please enter or select a phone number to order");
      return;
    }

    setIsOrdering(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to order a phone number");
        setIsOrdering(false);
        return;
      }
      
      const userId = session.user.id;
      
      const { data, error } = await supabase.functions.invoke('twilio-order-number', {
        body: {
          phoneNumber,
          accountSid,
          authToken,
          smsCapability,
          voiceCapability,
          userId
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.message || "Failed to order phone number");
      }
      
      toast.success("Successfully ordered phone number!");
      setPhoneNumber("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error ordering phone number:", error);
      toast.error(error.message || "Failed to order phone number");
    } finally {
      setIsOrdering(false);
    }
  };

  const handleSelectNumber = (number: TwilioPhoneNumber) => {
    setPhoneNumber(number.phoneNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Order a Twilio Phone Number</DialogTitle>
          <DialogDescription>
            Browse available numbers or enter a specific number you want to order.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="browse" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Available Numbers</TabsTrigger>
            <TabsTrigger value="manual">Enter Manually</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <BrowseNumbersTab 
              areaCode={areaCode}
              setAreaCode={setAreaCode}
              isLoadingNumbers={isLoadingNumbers}
              availableNumbers={availableNumbers}
              phoneNumber={phoneNumber}
              fetchAvailableNumbers={fetchAvailableNumbers}
              handleSelectNumber={handleSelectNumber}
            />
          </TabsContent>
          
          <TabsContent value="manual">
            <ManualEntryTab 
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />
          </TabsContent>
        </Tabs>
        
        <CapabilitiesSection 
          smsCapability={smsCapability}
          setSmsCapability={setSmsCapability}
          voiceCapability={voiceCapability}
          setVoiceCapability={setVoiceCapability}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleOrderNumber} 
            disabled={isOrdering || !phoneNumber} 
            className="bg-slate-400 hover:bg-slate-300"
          >
            {isOrdering ? "Ordering..." : "Order Number"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
