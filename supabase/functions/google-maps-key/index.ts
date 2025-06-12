import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user ID from the request authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Invalid authorization header format');
      return new Response(
        JSON.stringify({ error: 'Invalid authorization header format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token', details: authError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    if (!user) {
      console.error('No user found for token');
      return new Response(
        JSON.stringify({ error: 'No user found for token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    console.log('Authenticated user:', user.id);
    const userId = user.id;
    
    // Handle different request methods
    if (req.method === 'POST') {
      // Store the API key
      const { apiKey } = await req.json();
      
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'Missing API key' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Check if an entry already exists for this user
      const { data: existingData, error: getError } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', userId)
        .eq('service', 'google_maps');
      
      if (getError) {
        console.error('Error retrieving existing key:', getError);
        return new Response(
          JSON.stringify({ error: 'Failed to check existing key' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      let result;
      if (existingData && existingData.length > 0) {
        // Update existing entry
        const { data, error } = await supabase
          .from('user_api_keys')
          .update({ api_key: apiKey, updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('service', 'google_maps')
          .select();
          
        if (error) {
          console.error('Error updating API key:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to update API key' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        result = data;
      } else {
        // Insert new entry
        const { data, error } = await supabase
          .from('user_api_keys')
          .insert([{ 
            user_id: userId, 
            service: 'google_maps', 
            api_key: apiKey,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
          
        if (error) {
          console.error('Error storing API key:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to store API key' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
        result = data;
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'API key saved successfully',
          data: result
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (req.method === 'GET') {
      // Retrieve the API key
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('api_key')
        .eq('user_id', userId)
        .eq('service', 'google_maps')
        .single();
        
      if (error) {
        console.error('Error retrieving API key:', error);
        if (error.code === 'PGRST116') {
          // No API key found for this user
          return new Response(
            JSON.stringify({ apiKey: null }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Failed to retrieve API key' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ apiKey: data?.api_key || null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (req.method === 'DELETE') {
      // Delete the API key
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', userId)
        .eq('service', 'google_maps');
        
      if (error) {
        console.error('Error deleting API key:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to delete API key' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'API key deleted successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    );
  } catch (error) {
    console.error('Error in google-maps-key function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 