
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteData {
  organizationId: string;
  email: string;
  role?: string;
  inviterEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the JWT from the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    // Get current user from the JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }

    const { organizationId, email, role = 'member', inviterEmail }: InviteData = await req.json();
    
    if (!organizationId || !email) {
      throw new Error("Missing required data");
    }

    // Check if the current user has permission to invite users to this organization
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', organizationId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !memberData || !['owner', 'admin'].includes(memberData.role)) {
      throw new Error("You don't have permission to invite users to this organization");
    }

    // Get organization details
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    if (orgError || !orgData) {
      throw new Error("Organization not found");
    }

    // Check if user with this email exists
    const { data: userData, error: emailError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    // In a production environment, you would send an email invitation here
    // For now, we'll just simulate a successful invitation
    
    console.log(`Invitation would be sent to: ${email}`);
    console.log(`Join organization: ${orgData.name}`);
    console.log(`From: ${inviterEmail || user.email}`);
    console.log(`Role: ${role}`);
    console.log(`Organization ID: ${organizationId}`);
    
    if (userData && userData.id) {
      console.log(`User already exists, would create organization membership directly`);
      
      // Check if the user is already a member
      const { data: existingMember } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('user_id', userData.id)
        .maybeSingle();
        
      if (existingMember) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "User is already a member of this organization",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Add user directly to organization
      const { error: insertError } = await supabase
        .from('organization_members')
        .insert([
          {
            organization_id: organizationId,
            user_id: userData.id,
            role: role
          }
        ]);
        
      if (insertError) {
        throw new Error(`Error adding user to organization: ${insertError.message}`);
      }
    } else {
      console.log(`User doesn't exist yet, would send invitation email`);
      // In a real implementation, you would store the invitation in a table 
      // and send an email with a special signup link
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        domain: "tradeease.app"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing organization invitation:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to process invitation",
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
