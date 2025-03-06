
import { supabase } from "@/integrations/supabase/client";

interface BillingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  locality: string;
  administrativeArea: string;
  postalCode: string;
  country: string;
  email: string;
  phoneNumber: string;
}

interface PaymentDetails {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  totalAmount: string;
  currency: string;
  capturePayment: boolean;
  billTo: BillingInfo;
}

export async function processCyberSourcePayment(paymentDetails: PaymentDetails) {
  try {
    const { data, error } = await supabase.functions.invoke('cybersource-payment', {
      body: paymentDetails
    });

    if (error) {
      console.error('Error processing payment:', error);
      throw new Error(error.message || 'Failed to process payment');
    }

    return data;
  } catch (error) {
    console.error('Error calling CyberSource API:', error);
    throw error;
  }
}

// Example usage:
// const paymentResult = await processCyberSourcePayment({
//   cardNumber: '4111111111111111',
//   expirationMonth: '12',
//   expirationYear: '2031',
//   totalAmount: '102.21',
//   currency: 'USD',
//   capturePayment: false,
//   billTo: {
//     firstName: 'John',
//     lastName: 'Doe',
//     address1: '1 Market St',
//     locality: 'san francisco',
//     administrativeArea: 'CA',
//     postalCode: '94105',
//     country: 'US',
//     email: 'test@cybs.com',
//     phoneNumber: '4158880000'
//   }
// });
