
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TwilioPhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality?: string;
  region?: string;
  isoCountry?: string;
  capabilities?: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

interface TwilioOrderNumberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountSid: string;
  authToken: string;
}

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

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/^\+1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
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
          
          <TabsContent value="browse" className="space-y-4 py-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="area-code">Area Code (Optional)</Label>
                <Input 
                  id="area-code"
                  placeholder="e.g. 510" 
                  value={areaCode} 
                  onChange={(e) => setAreaCode(e.target.value)}
                  maxLength={3}
                />
              </div>
              <Button 
                onClick={fetchAvailableNumbers} 
                disabled={isLoadingNumbers}
                className="bg-slate-400 hover:bg-slate-300"
              >
                {isLoadingNumbers ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {isLoadingNumbers ? "Loading..." : "Refresh"}
              </Button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              {isLoadingNumbers ? (
                <div className="p-8 flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading available numbers...</span>
                </div>
              ) : availableNumbers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No available numbers found. Try a different area code or refresh.</p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-300 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Phone Number</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableNumbers.map((number, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-slate-100' : 'bg-white'}>
                          <td className="px-4 py-2">{formatPhoneNumber(number.friendlyName)}</td>
                          <td className="px-4 py-2">
                            {number.locality && number.region 
                              ? `${number.locality}, ${number.region}` 
                              : number.region || 'Unknown location'}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <Button 
                              size="sm" 
                              onClick={() => handleSelectNumber(number)}
                              className={`${phoneNumber === number.phoneNumber 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-slate-400 hover:bg-slate-300'}`}
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              {phoneNumber === number.phoneNumber ? 'Selected' : 'Select'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input 
                id="phone-number" 
                placeholder="+1XXXXXXXXXX (include country code)" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
              />
              <p className="text-xs text-gray-500">
                This must be an available phone number from Twilio
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sms-capability" 
              checked={smsCapability} 
              onCheckedChange={(checked) => setSmsCapability(checked === true)} 
            />
            <Label htmlFor="sms-capability" className="text-sm font-normal">
              Enable SMS capability
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="voice-capability" 
              checked={voiceCapability} 
              onCheckedChange={(checked) => setVoiceCapability(checked === true)} 
            />
            <Label htmlFor="voice-capability" className="text-sm font-normal">
              Enable Voice capability
            </Label>
          </div>
        </div>
        
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
