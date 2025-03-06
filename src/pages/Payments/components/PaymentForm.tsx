
import { ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign } from "lucide-react";
import { PaymentFormData } from "../types";

interface PaymentFormProps {
  formData: PaymentFormData;
  isProcessing: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

export function PaymentForm({ formData, isProcessing, handleInputChange, handleSubmit }: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Enter credit card information to process payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="Card Number"
              maxLength={19}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardHolderName">Cardholder Name</Label>
            <Input
              id="cardHolderName"
              name="cardHolderName"
              type="text"
              value={formData.cardHolderName}
              onChange={handleInputChange}
              placeholder="Cardholder Name"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expirationMonth">Month</Label>
              <Input
                id="expirationMonth"
                name="expirationMonth"
                type="text"
                value={formData.expirationMonth}
                onChange={handleInputChange}
                placeholder="MM"
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationYear">Year</Label>
              <Input
                id="expirationYear"
                name="expirationYear"
                type="text"
                value={formData.expirationYear}
                onChange={handleInputChange}
                placeholder="YYYY"
                maxLength={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="text"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="CVV"
                maxLength={4}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="totalAmount"
                name="totalAmount"
                type="text"
                value={formData.totalAmount}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capturePayment" className="flex items-center gap-2">
              <input
                id="capturePayment"
                name="capturePayment"
                type="checkbox"
                checked={formData.capturePayment}
                onChange={handleInputChange}
                className="rounded"
              />
              Capture Payment (authorize and capture)
            </Label>
          </div>
          
          <Button 
            type="submit" 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Process Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
