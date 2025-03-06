
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Define a schema for payment data validation
const paymentSchema = z.object({
  cardNumber: z.string().min(16).max(19),
  cardHolderName: z.string().min(1, "Cardholder name is required"),
  expirationMonth: z.string().min(1).max(2),
  expirationYear: z.string().min(2).max(4),
  cvv: z.string().min(3).max(4),
  totalAmount: z.string().min(1, "Amount is required"),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address is required"),
  locality: z.string().min(1, "City is required"),
  administrativeArea: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export default function NewPayment() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "4111111111111111",
    cardHolderName: "John Doe",
    expirationMonth: "12",
    expirationYear: "2031",
    cvv: "123",
    totalAmount: "102.21",
    currency: "USD",
    email: "test@cybs.com",
    firstName: "John",
    lastName: "Doe",
    address1: "1 Market St",
    locality: "san francisco",
    administrativeArea: "CA",
    postalCode: "94105",
    country: "US",
    phoneNumber: "4158880000",
    capturePayment: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate form data
      const validatedData = paymentSchema.parse(formData);
      
      // Prepare data for the edge function
      const paymentData = {
        cardNumber: validatedData.cardNumber,
        expirationMonth: validatedData.expirationMonth,
        expirationYear: validatedData.expirationYear,
        totalAmount: validatedData.totalAmount,
        currency: formData.currency,
        capturePayment: formData.capturePayment,
        billTo: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          address1: validatedData.address1,
          locality: validatedData.locality,
          administrativeArea: validatedData.administrativeArea,
          postalCode: validatedData.postalCode,
          country: validatedData.country,
          email: validatedData.email,
          phoneNumber: validatedData.phoneNumber,
        },
      };
      
      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('cybersource-payment', {
        body: paymentData
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success("Payment processed successfully!");
        
        // Store payment details in local storage (in a real app, you'd save to a database)
        const existingPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        localStorage.setItem('payments', JSON.stringify([
          ...existingPayments,
          {
            id: data.data.id,
            amount: data.data.amount,
            currency: data.data.currency,
            status: data.data.status,
            timestamp: data.data.timestamp,
            cardInfo: data.data.cardInfo,
          }
        ]));
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">New Payment</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
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
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Enter customer billing information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address</Label>
                    <Input
                      id="address1"
                      name="address1"
                      value={formData.address1}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locality">City</Label>
                    <Input
                      id="locality"
                      name="locality"
                      value={formData.locality}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="administrativeArea">State</Label>
                      <Input
                        id="administrativeArea"
                        name="administrativeArea"
                        value={formData.administrativeArea}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-center">
                    <img 
                      src="/lovable-uploads/ae10fa3d-7775-4ca4-88a6-7755f3022211.png" 
                      alt="Payment processing" 
                      className="max-w-full rounded-lg" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
