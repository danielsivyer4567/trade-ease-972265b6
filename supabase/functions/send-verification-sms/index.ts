// @ts-expect-error
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-expect-error
import { Twilio } from "https://esm.sh/twilio@4.19.0";

// Add Deno namespace declaration
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface RequestData {
  phoneNumber: string;
  message: string;
}

serve(async (req: Request) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get request body
    const requestData = await req.json() as RequestData;
    const { phoneNumber, message } = requestData;

    if (!phoneNumber || !message) {
      return new Response(
        JSON.stringify({ error: 'Phone number and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Format phone number (ensure it includes country code)
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+1${phoneNumber}`; // Default to US country code if not provided
    
    // Initialize Twilio client with environment variables
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    if (!accountSid || !authToken || !twilioNumber) {
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const client = new Twilio(accountSid, authToken);
    
    // Send the SMS
    const result = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: formattedPhoneNumber
    });
    
    return new Response(
      JSON.stringify({ success: true, messageId: result.sid }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error sending SMS:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send SMS';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 