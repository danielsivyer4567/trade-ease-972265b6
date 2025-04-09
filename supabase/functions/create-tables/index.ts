
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

interface RequestData {
  tables: string[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { tables }: RequestData = await req.json();
    
    // Results will hold success/failure for each table creation
    const results: Record<string, any> = {};
    
    for (const table of tables) {
      try {
        const { data: procedureExists, error: procedureCheckError } = await supabaseClient.rpc(
          `create_${table}_table_if_not_exists`
        );
        
        if (procedureCheckError) {
          console.log(`Error with procedure for ${table}:`, procedureCheckError);
          results[table] = { success: false, error: procedureCheckError.message };
          continue;
        }
        
        results[table] = { success: true };
      } catch (error) {
        console.error(`Error creating table ${table}:`, error);
        results[table] = { success: false, error: error.message };
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in create-tables function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
