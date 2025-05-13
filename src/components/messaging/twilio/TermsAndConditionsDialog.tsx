import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
      <DialogContent className="sm:max-w-[600px] bg-slate-200">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please review the terms and conditions for purchasing a phone number.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto space-y-4 py-4 text-sm">
          <h3 className="font-medium">Phone Number Purchase Agreement</h3>
          
          <p>By purchasing a phone number through our service, you agree to the following terms:</p>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Ownership and Usage:</strong> The phone number you purchase is licensed for use within our platform, and must be used in compliance with all applicable laws and regulations.
            </li>
            <li>
              <strong>Recurring Charges:</strong> Phone numbers are subject to monthly recurring charges. These charges will continue until you cancel the number through our platform.
            </li>
            <li>
              <strong>Responsible Usage:</strong> You agree to use the phone number for legitimate business purposes and not for spam, fraud, harassment, or any illegal activities.
            </li>
            <li>
              <strong>Compliance:</strong> You are responsible for complying with all telecommunications regulations, including but not limited to obtaining proper consent before sending messages.
            </li>
            <li>
              <strong>Service Limitation:</strong> We reserve the right to suspend or terminate service if we detect abuse, misuse, or violation of our terms.
            </li>
            <li>
              <strong>Number Portability:</strong> If you wish to port your number to another service, additional fees and processing time may apply.
            </li>
            <li>
              <strong>No Guarantee of Availability:</strong> While we strive to maintain continuous service, we cannot guarantee 100% uptime or availability.
            </li>
            <li>
              <strong>Refund Policy:</strong> Phone number purchases are generally non-refundable once service has been activated.
            </li>
          </ol>
        </div>
        
        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted} 
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <Label htmlFor="terms" className="text-sm font-normal">
            I have read and agree to the terms and conditions
          </Label>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onAgreeAndPurchase} 
            disabled={!termsAccepted}
            className="bg-slate-400 hover:bg-slate-300"
          >
            Agree and Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
