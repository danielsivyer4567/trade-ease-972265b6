
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Twilio } from "https://esm.sh/twilio@4.19.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderNumberRequest {
  phoneNumber: string;
  accountSid: string;
  authToken: string;
  smsCapability?: boolean;
  voiceCapability?: boolean;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: OrderNumberRequest = await req.json();
    const { phoneNumber, accountSid, authToken, smsCapability = true, voiceCapability = true, userId } = requestData;
    
    if (!phoneNumber || !accountSid || !authToken || !userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Missing required parameters" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Ordering Twilio phone number ${phoneNumber} for user ${userId}`);
    
    // Initialize Twilio client
    const client = new Twilio(accountSid, authToken);
    
    try {
      // Create hosted number order
      const hostedNumberOrder = await client.preview.hostedNumbers.hostedNumberOrders.create({
        phoneNumber: phoneNumber,
        smsCapability: smsCapability,
        voiceCapability: voiceCapability
      });
      
      console.log(`Successfully created hosted number order with SID: ${hostedNumberOrder.sid}`);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Successfully ordered phone number",
          orderId: hostedNumberOrder.sid
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (twilioError) {
      console.error("Twilio API error:", twilioError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: twilioError.message || "Error ordering phone number through Twilio" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error in twilio-order-number function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "An unexpected error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
