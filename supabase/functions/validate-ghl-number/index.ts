
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

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
    console.log('Received phone number:', phoneNumber);

    // Validate phone number format
    const phoneRegex = /^\+?1?\d{10,12}$/;
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    if (!phoneRegex.test(cleanedNumber)) {
      console.log('Invalid phone number format:', phoneNumber);
      throw new Error('Invalid phone number format');
    }

    // Mock GHL API call for testing
    // In a real scenario, you would call the actual GHL API
    console.log('Making API call to GHL with number:', cleanedNumber);
    
    // Simulating successful GHL API response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Phone number connected successfully',
        number: phoneNumber
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
