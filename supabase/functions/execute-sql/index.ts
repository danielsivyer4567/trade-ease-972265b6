// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase_oauth

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request): Response | null => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request
    const { sql_query } = await req.json()
    
    if (!sql_query) {
      return new Response(
        JSON.stringify({ error: 'No SQL query provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    // Get user information to verify authentication
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Execute the SQL query - ONLY for authenticated users
    // SECURITY WARNING: This is still dangerous! In production, you should:
    // 1. Use proper parameter binding
    // 2. Check that users have proper permissions to run DDL/DML
    // 3. Consider SQL injection protection
    const { data, error } = await supabaseClient.rpc('execute_sql_admin', { 
      sql_query,
      user_id: user.id,
    })
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return the result
    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 