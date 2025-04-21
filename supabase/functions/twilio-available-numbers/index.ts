// @ts-expect-error
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error
import { Twilio } from "https://esm.sh/twilio@4.19.3";

// Add Deno namespace declaration
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

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

interface TwilioPhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  isoCountry: string;
  capabilities: {
    voice: boolean;
    SMS: boolean;
    MMS: boolean;
  };
  [key: string]: any;
}

serve(async (req: Request) => {
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
      const formattedNumbers = availableNumbers.map((number: TwilioPhoneNumber) => ({
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
    } catch (twilioError: unknown) {
      console.error("Twilio API error:", twilioError);
      
      const errorMessage = twilioError instanceof Error ? twilioError.message : "Error fetching available numbers from Twilio";
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: errorMessage 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error: unknown) {
    console.error("Error in twilio-available-numbers function:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: errorMessage 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
