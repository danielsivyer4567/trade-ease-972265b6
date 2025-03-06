
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This is a TypeScript implementation of the provided Python code
// In a real implementation, you would use the CyberSource SDK for JavaScript/TypeScript
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      capturePayment = false,
      cardNumber = "4111111111111111",
      expirationMonth = "12",
      expirationYear = "2031",
      totalAmount = "102.21",
      currency = "USD",
      billTo = {
        firstName: "John",
        lastName: "Doe",
        address1: "1 Market St",
        locality: "san francisco",
        administrativeArea: "CA",
        postalCode: "94105",
        country: "US",
        email: "test@cybs.com",
        phoneNumber: "4158880000"
      }
    } = await req.json();

    console.log("Processing payment with the following details:");
    console.log(`Amount: ${totalAmount} ${currency}`);
    console.log(`Capture Payment: ${capturePayment}`);
    
    // In a real implementation, this would call the CyberSource API similar to the Python code:
    // 1. Create client reference information (clientReferenceInformation)
    // 2. Set processing information (processingInformation)
    // 3. Set payment information (paymentInformation)
    // 4. Set order information (orderInformation)
    // 5. Create and send payment request
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response data - simulating the response from the Python implementation
    const responseData = {
      id: `payment_${Date.now()}`,
      status: "AUTHORIZED",
      amount: totalAmount,
      currency: currency,
      capturePayment: capturePayment,
      cardInfo: {
        last4: cardNumber.slice(-4),
        expirationMonth,
        expirationYear
      },
      billingInfo: billTo,
      timestamp: new Date().toISOString()
    };

    console.log("Payment processed successfully");
    
    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error processing payment:", error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
