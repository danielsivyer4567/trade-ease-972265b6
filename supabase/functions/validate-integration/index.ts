
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

    const { integration, apiKey } = await req.json();

    // Validate Xero API key
    if (integration === 'Xero') {
      // Here you would normally validate the API key with Xero's API
      // For demonstration, we'll just check if it's not empty
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid Xero API key' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Store the API key securely in Supabase
      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'Xero',
          api_key: apiKey,
          status: 'connected'
        });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ message: 'Xero integration configured successfully' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (integration === 'Go High Level') {
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid Go High Level API key' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'Go High Level',
          api_key: apiKey,
          status: 'connected'
        });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ message: 'Go High Level integration configured successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (integration === 'WhatsApp Business') {
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid WhatsApp Business API key' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'WhatsApp Business',
          api_key: apiKey,
          status: 'connected'
        });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ message: 'WhatsApp Business integration configured successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (integration === 'Facebook') {
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid Facebook API key' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'Facebook',
          api_key: apiKey,
          status: 'connected'
        });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return new Response(
        JSON.stringify({ message: 'Facebook integration configured successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  
    if (integration === 'Stripe') {
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid Stripe API key' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
  
      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'Stripe',
          api_key: apiKey,
          status: 'connected'
        });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
  
      return new Response(
        JSON.stringify({ message: 'Stripe integration configured successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  
    if (integration === 'SendGrid') {
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid SendGrid API key' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
  
      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'SendGrid',
          api_key: apiKey,
          status: 'connected'
        });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
  
      return new Response(
        JSON.stringify({ message: 'SendGrid integration configured successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  
    if (integration === 'Google Calendar') {
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Invalid Google Calendar API key' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
  
      const { error } = await supabaseClient
        .from('integration_configs')
        .upsert({
          integration_name: 'Google Calendar',
          api_key: apiKey,
          status: 'connected'
        });
        
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
  
      return new Response(
        JSON.stringify({ message: 'Google Calendar integration configured successfully' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid integration' }),
      { 
        status: 400,
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
