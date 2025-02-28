
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phoneNumber, name, message } = await req.json()

    // Get Twilio credentials from environment variables
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    // Validate required environment variables
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.error('Missing required Twilio environment variables');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Twilio configuration is incomplete'
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log(`Attempting to send text message to ${name} (${phoneNumber}): ${message}`);

    // Format the phone number to ensure it's in E.164 format (required by Twilio)
    // This is a simple example - you might need more sophisticated formatting
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+61${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;

    // Send the SMS using Twilio API
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
      },
      body: new URLSearchParams({
        'To': formattedPhoneNumber,
        'From': twilioPhoneNumber,
        'Body': message
      })
    });

    const result = await response.json();
    console.log('Twilio API response:', result);

    const success = result.sid ? true : false;

    return new Response(
      JSON.stringify({
        success,
        message: success ? 'Text message sent successfully' : 'Failed to send text message',
        details: result
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: success ? 200 : 400
      }
    );
  } catch (error) {
    console.error('Error sending SMS:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
