/// <reference lib="deno.unstable" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface XeroTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, redirect_uri } = await req.json()

    if (!code) {
      throw new Error('No authorization code provided')
    }

    if (!redirect_uri) {
      throw new Error('No redirect URI provided')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials')
    }

    // Create a Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

    // Get the integration config to retrieve client_id and client_secret
    const { data: integrationConfig, error: configError } = await supabaseClient
      .from('integration_configs')
      .select('client_id, client_secret')
      .eq('integration_name', 'Xero')
      .single()

    if (configError || !integrationConfig) {
      throw new Error('Failed to retrieve Xero credentials')
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://identity.xero.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${integrationConfig.client_id}:${integrationConfig.client_secret}`)}`
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      throw new Error(`Failed to exchange token: ${errorData}`)
    }

    const tokens: XeroTokenResponse = await tokenResponse.json()

    // Store the tokens in the database
    const { error: updateError } = await supabaseClient
      .from('integration_configs')
      .update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        status: 'connected'
      })
      .eq('integration_name', 'Xero')

    if (updateError) {
      throw new Error('Failed to store tokens')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
}) 