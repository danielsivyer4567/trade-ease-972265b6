
import { serve } from 'https://deno.fresh.dev/std@9.9.9/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();

    // Validate phone number format
    const phoneRegex = /^\+?1?\d{10,12}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      throw new Error('Invalid phone number format');
    }

    // Here you would make the actual GHL API call
    // This is a placeholder for the actual API integration
    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GHL_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: phoneNumber })
    });

    if (!response.ok) {
      throw new Error('Failed to connect with Go High Level');
    }

    const data = await response.json();
    console.log('GHL Response:', data);

    return new Response(
      JSON.stringify({ success: true, message: 'Phone number connected successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
