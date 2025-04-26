
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Twilio } from "https://esm.sh/twilio@4.19.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AvailableNumbersRequest {
  accountSid: string;
  authToken: string;
  areaCode?: string;
  limit?: number;
  country?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: AvailableNumbersRequest = await req.json();
    const { accountSid, authToken, areaCode, country = "US", limit = 10 } = requestData;
    
    if (!accountSid || !authToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Missing required Twilio credentials" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching available Twilio phone numbers for country ${country}`);
    
    // Initialize Twilio client
    const client = new Twilio(accountSid, authToken);
    
    try {
      // Create search parameters
      const searchParams: Record<string, any> = { limit };
      if (areaCode) {
        searchParams.areaCode = areaCode;
      }
      
      // Fetch available local phone numbers
      const availableNumbers = await client.availablePhoneNumbers(country)
                                         .local.list(searchParams);
      
      console.log(`Successfully fetched ${availableNumbers.length} available phone numbers`);
      
      // Map to simpler format for frontend
      const formattedNumbers = availableNumbers.map(number => ({
        phoneNumber: number.phoneNumber,
        friendlyName: number.friendlyName,
        locality: number.locality,
        region: number.region,
        isoCountry: number.isoCountry,
        capabilities: number.capabilities
      }));
      
      return new Response(
        JSON.stringify({
          success: true,
          numbers: formattedNumbers
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
          message: twilioError.message || "Error fetching available numbers from Twilio" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error in twilio-available-numbers function:", error);
    
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
