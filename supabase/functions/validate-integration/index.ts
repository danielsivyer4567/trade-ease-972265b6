
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IntegrationRequest {
  integration: string;
  apiKey: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { integration, apiKey } = await req.json() as IntegrationRequest

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate the API key format and integration type
    if (!apiKey || apiKey.length < 10) {
      throw new Error('Invalid API key format')
    }

    // Here you would typically make a test call to the integration's API
    // to validate the key. For this example, we'll simulate validation:
    const isValid = true // Replace with actual validation logic

    if (!isValid) {
      throw new Error('Invalid API key')
    }

    // Store the encrypted API key in the database
    const { data, error } = await supabaseClient
      .from('integration_configs')
      .upsert({
        integration_name: integration,
        api_key: apiKey, // In production, encrypt this before storing
        status: 'connected',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'integration_name'
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${integration} configured successfully` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
