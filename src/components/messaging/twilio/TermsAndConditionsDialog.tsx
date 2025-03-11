
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsAndConditionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  onAgreeAndPurchase: () => void;
}

export const TermsAndConditionsDialog = ({
  open,
  onOpenChange,
  termsAccepted,
  setTermsAccepted,
  onAgreeAndPurchase
}: TermsAndConditionsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onAgreeAndPurchase} 
            disabled={!termsAccepted}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
          >
            Agree & Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
