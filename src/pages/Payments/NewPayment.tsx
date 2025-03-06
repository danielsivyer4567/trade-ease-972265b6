
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PaymentHeader } from "./components/PaymentHeader";
import { PaymentInfoCard } from "./components/PaymentInfoCard";
import { PaymentForm } from "./components/PaymentForm";
import { BillingForm } from "./components/BillingForm";
import { PaymentFormData, ValidatedPaymentData } from "./types";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
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
      const paymentData: ValidatedPaymentData = {
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
        <PaymentHeader />
        <PaymentInfoCard />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <PaymentForm 
              formData={formData} 
              isProcessing={isProcessing} 
              handleInputChange={handleInputChange} 
              handleSubmit={handleSubmit}
            />
          </div>
          
          <div>
            <BillingForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
