// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Declare Deno global for TypeScript
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('🔍 Querying organization members with service role...');

    // Query organization_members with service role to bypass RLS policies
    const { data: members, error: membersError } = await supabase
      .from('organization_members')
      .select(`
        id,
        user_id,
        organization_id,
        role,
        created_at,
        organizations (
          id,
          name
        )
      `)
      .limit(20);

    if (membersError) {
      console.error('❌ Error querying organization_members:', membersError.message);
      throw new Error(`Organization members query failed: ${membersError.message}`);
    }

    console.log('✅ Successfully retrieved organization members:', members.length);

    // Also try to get user_roles to check for recursion issues
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(10);

    if (rolesError) {
      console.error('❌ Error querying user_roles:', rolesError.message);
    } else {
      console.log('✅ Successfully retrieved user roles:', roles.length);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          organization_members: members,
          user_roles: roles || [],
          total_members: members.length,
          total_roles: roles?.length || 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Function error:', errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}); 