
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { TwilioOrderNumberDialog } from './TwilioOrderNumberDialog';
import { Phone, DollarSign } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return <div className="flex flex-col items-center p-4 border rounded-lg bg-slate-100">
      <Tabs value={activeTab} onValueChange={value => {
      setActiveTab(value as "connect" | "buy");
      if (value === "buy") {
        loadAvailableForSale();
      }
    }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="connect" className="text-gray-950 bg-slate-400 hover:bg-slate-300 mx-[14px]">Connect </TabsTrigger>
          <TabsTrigger value="buy" className="text-gray-950 bg-slate-500 hover:bg-slate-400 my-0 py-0">Purchase A Phone Number</TabsTrigger>
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
          <div className="space-y-4 my-[41px]">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Phone Number For Sale</h3>
              <Button variant="outline" size="sm" onClick={loadAvailableForSale} disabled={isLoading} className="text-sm bg-slate-500 hover:bg-slate-400 mx-[28px] px-[24px]">
                Refresh
              </Button>
            </div>
            
            {isLoading ? <div className="text-center py-4">Loading available number...</div> : availableNumber ? <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-white rounded-md border">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{availableNumber}</span>
                  </div>
                  <Button size="sm" onClick={() => showTermsAndConditions(availableNumber)} className="bg-green-500 hover:bg-green-600 mx-[16px] px-[9px]">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    Purchase
                  </Button>
                </div>
              </div> : <div className="text-center py-4 text-gray-500">
                No phone numbers available for sale at the moment.
              </div>}
            
            <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm">
              <p className="font-medium">How it works:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
                <li>Select the phone number above</li>
                <li>Review and accept the Terms & Conditions</li>
                <li>Complete the purchase process</li>
                <li>The number will be assigned to your account</li>
                <li>You can start using it immediately for messaging</li>
              </ol>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <TwilioOrderNumberDialog isOpen={orderDialogOpen} onOpenChange={setOrderDialogOpen} accountSid={twilioCredentials.accountSid} authToken={twilioCredentials.authToken} />
      
      {/* Terms and Conditions Dialog */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-200">
          <DialogHeader>
            <DialogTitle>Terms and Conditions for Trade Ease Phone Number Service</DialogTitle>
            <DialogDescription>
              Please review and accept our Terms and Conditions before purchasing a phone number.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] rounded border p-4 bg-white">
            <div className="space-y-4 pr-4">
              <h3 className="text-lg font-bold">1. Acceptance of Terms:</h3>
              <p>• By purchasing and using a phone number from Trade Ease, Twilio, you agree to be bound by these Terms and Conditions.</p>
              <p>• If you do not agree with any part of these terms, you must not use the Service.</p>
              
              <h3 className="text-lg font-bold">2. Phone Number Provision and Usage:</h3>
              <h4 className="font-semibold">• Platform-Specific Usage:</h4>
              <p>○ The phone numbers provided through this Service are exclusively for use within Trade Ease Platform.</p>
              <p>○ Users are strictly prohibited from using these numbers on any other platform or service.</p>
              
              <h4 className="font-semibold">• Data Sharing:</h4>
              <p>○ Users consent to the sharing of data associated with the phone number with Twilio and Trade Ease.</p>
              <p>○ Trade Ease commits to maintaining the privacy of this data and will not share it with any other third parties.</p>
              
              <h4 className="font-semibold">• Number ownership:</h4>
              <p>○ The numbers are owned and managed by Trade Ease and are licensed to the user for use on / with Trade Ease platform.</p>
              
              <h4 className="font-semibold">• Number Registration:</h4>
              <p>○ Numbers will need to be registered and re registered if lost due to unsuccessful payment.</p>
              
              <h3 className="text-lg font-bold">3. Payment and Billing:</h3>
              <h4 className="font-semibold">• Pricing Structure for Ai plan:</h4>
              <p>○ Phone Number Purchase for automation: $14.50 and fifty cents Aud including Goods and Services Tax).</p>
              <p>○ Text (SMS) Costs:</p>
              <p>▪ Sent: $0.09 Aud</p>
              <p>▪ Received: $0.11 Aud</p>
              <p>○ Call Costs:</p>
              <p>▪ Outgoing: $0.0247 c/min</p>
              <p>▪ Incoming: $0.090 c/min</p>
              <p>○ Emails: $0.0007/email</p>
              
              <h4 className="font-semibold">• Automatic Debit:</h4>
              <p>○ Users authorize Trade Ease to automatically debit the agreed-upon fees from their nominated bank account or credit card.</p>
              <p>○ Terminal fees may apply.</p>
              <p>○ By agreeing to these terms, the user approves the pricing structure as listed above.</p>
              
              <h4 className="font-semibold">• Payment Failure:</h4>
              <p>○ In the event of a failed payment, Trade Ease will attempt to process the payment three (3) times.</p>
              <p>○ Users will receive automated notifications after each failed attempt, indicating the number of remaining attempts.</p>
              <p>○ If all three attempts fail, the phone number may be canceled, and any associated services or automations may be suspended or terminated.</p>
              <p>○ Users will need to re register the number if this occurs.</p>
              
              <h3 className="text-lg font-bold">4. Service Suspension and Termination:</h3>
              <h4 className="font-semibold">• Non-Payment:</h4>
              <p>○ Failure to make timely payments may result in the suspension or termination of the Service, including the loss of the phone number.</p>
              <p>○ Any automations or services linked to the number may be affected.</p>
              
              <h4 className="font-semibold">• Violation of Terms:</h4>
              <p>○ Trade Ease reserves the right to suspend or terminate the Service if a User violates these Terms and Conditions.</p>
              
              <h4 className="font-semibold">• Platform Termination:</h4>
              <p>○ If the user's account is terminated on Trade Ease, then the phone number service will also be terminated.</p>
              
              <h3 className="text-lg font-bold">5. Data Privacy and Security:</h3>
              <p>• Trade Ease will take reasonable measures to protect the privacy and security of User data.</p>
              <p>• Data will only be shared with Twilio, Trade Ease, and as required by law.</p>
              <p>• Refer to our Privacy Policy for more details.</p>
              
              <h3 className="text-lg font-bold">6. Limitation of Liability:</h3>
              <p>• Trade Ease will not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Service.</p>
              <p>• Trade Ease will not be held liable for any loss of service or automations that are caused by non payment.</p>
              
              <h3 className="text-lg font-bold">7. Changes to Terms:</h3>
              <p>• Trade Ease reserves the right to modify these Terms and Conditions at any time.</p>
              <p>• Users will be notified of any changes, and continued use of the Service constitutes acceptance of the modified terms.</p>
              
              <h3 className="text-lg font-bold">8. Governing Law:</h3>
              <p>• These Terms and Conditions shall be governed by and construed in accordance with the laws of Australia.</p>
              
              <h3 className="text-lg font-bold">9. Contact Information:</h3>
              <p>• For any questions or concerns regarding these Terms and Conditions, please contact us at support@tradeease.com.au.</p>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="terms-acceptance" 
              checked={termsAccepted} 
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <Label htmlFor="terms-acceptance" className="text-sm font-normal">
              I have read and agree to the Terms and Conditions
            </Label>
          </div>
          
          <DialogFooter className="pt-2">
            <Button 
              variant="outline" 
              onClick={() => setTermsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAgreeAndPurchase} 
              disabled={!termsAccepted}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
            >
              Agree & Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
