
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

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
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { integration, apiKey, clientId } = await req.json();
    console.log(`Processing integration request for: ${integration}`);

    // Validate the API key based on the integration
    if (!apiKey) {
      console.error(`Invalid API key for ${integration}`);
      return new Response(
        JSON.stringify({ error: `Invalid ${integration} API key` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a map of integration names to their table entries
    const integrationMap: Record<string, any> = {
      "Xero": {
        integration_name: 'Xero',
        api_key: apiKey,
        client_id: clientId,
        status: 'connected'
      },
      "Go High Level": {
        integration_name: 'Go High Level',
        api_key: apiKey,
        status: 'connected'
      },
      "WhatsApp Business": {
        integration_name: 'WhatsApp Business',
        api_key: apiKey,
        status: 'connected'
      },
      "Facebook": {
        integration_name: 'Facebook',
        api_key: apiKey,
        status: 'connected'
      },
      "Stripe": {
        integration_name: 'Stripe',
        api_key: apiKey,
        status: 'connected'
      },
      "SendGrid": {
        integration_name: 'SendGrid',
        api_key: apiKey,
        status: 'connected'
      },
      "Google Calendar": {
        integration_name: 'Google Calendar',
        api_key: apiKey,
        status: 'connected'
      }
    };

    if (!integrationMap[integration]) {
      console.error(`Invalid integration: ${integration}`);
      return new Response(
        JSON.stringify({ error: 'Invalid integration' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Store the API key securely in Supabase
    const { error } = await supabaseClient
      .from('integration_configs')
      .upsert(integrationMap[integration]);

    if (error) {
      console.error(`Database error: ${error.message}`);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`${integration} integration configured successfully`);
    return new Response(
      JSON.stringify({ message: `${integration} integration configured successfully` }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
