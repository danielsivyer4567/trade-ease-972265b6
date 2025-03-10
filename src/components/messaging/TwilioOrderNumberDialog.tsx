
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  const handleOrderNumber = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number to order");
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Order a Twilio Phone Number</DialogTitle>
          <DialogDescription>
            Enter the phone number you want to order through Twilio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
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
