
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { name } = await req.json();
    
    // Log the received data for debugging
    console.log(`Received request with name: ${name}`);
    
    // Prepare the response
    const data = {
      message: `Hello ${name || 'World'}!`,
      timestamp: new Date().toISOString(),
      service: "Supabase Edge Function"
    };

    // Return the response
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error processing request:", error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
