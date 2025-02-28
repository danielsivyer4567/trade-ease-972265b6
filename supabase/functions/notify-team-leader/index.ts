
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

    // In a production environment, you would integrate with a text messaging service like Twilio here
    // For this example, we'll log the message and simulate a successful text message send

    console.log(`Sending text message to ${name} (${phoneNumber}): ${message}`)

    // Simulate sending a text message
    // In production, you would include code like:
    // 
    // const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    // const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    // const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    // 
    // const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`
    //   },
    //   body: new URLSearchParams({
    //     'To': phoneNumber,
    //     'From': twilioPhoneNumber,
    //     'Body': message
    //   })
    // });
    // 
    // const result = await response.json();

    // For now, simulate a successful send
    const success = true

    return new Response(
      JSON.stringify({
        success,
        message: success ? 'Text message sent successfully' : 'Failed to send text message'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
