import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  role: string;
  organizationId: string;
  businessName?: string;
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

    const { email, role = 'member', organizationId, businessName }: InviteRequest = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }

    let orgId = organizationId;
    
    // If we're creating a new organization with the invite
    if (businessName && !organizationId) {
      // Create the organization
      const { data: newOrg, error: orgCreateError } = await supabase
        .from('organizations')
        .insert({ name: businessName })
        .select()
        .single();
      
      if (orgCreateError) {
        throw new Error(`Failed to create organization: ${orgCreateError.message}`);
      }
      
      orgId = newOrg.id;
      
      // Add the current user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgId,
          user_id: user.id,
          role: 'owner'
        });
        
      if (memberError) {
        throw new Error(`Failed to add you as organization owner: ${memberError.message}`);
      }
      
      // Update the user's organization in their configuration
      const { error: configError } = await supabase
        .from('users_configuration')
        .update({ organization_id: orgId })
        .eq('id', user.id);
        
      if (configError) {
        console.error('Error updating user configuration:', configError);
      }
    } else {
      // Verify user has permission to invite to this organization
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', orgId)
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData || !['owner', 'admin'].includes(memberData.role)) {
        throw new Error("You don't have permission to invite users to this organization");
      }
    }

    // Get organization details
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', orgId)
      .single();

    if (orgError || !orgData) {
      throw new Error("Organization not found");
    }

    // Check if the invited user already exists
    const { data: existingUser, error: userLookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    const userId = existingUser?.id;
    
    // Generate an invitation link
    const inviteLink = `${new URL(req.url).origin}/auth?invite=${orgId}`;
    
    if (userId) {
      // Check if they're already a member
      const { data: existingMember } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', orgId)
        .eq('user_id', userId)
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
      
      // Add user directly to organization if they exist
      const { error: insertError } = await supabase
        .from('organization_members')
        .insert([
          {
            organization_id: orgId,
            user_id: userId,
            role
          }
        ]);
        
      if (insertError) {
        throw new Error(`Error adding user to organization: ${insertError.message}`);
      }
    }

    // In a real implementation, you would send an email with the invite link
    console.log(`Invite would be sent to: ${email}`);
    console.log(`Join organization: ${orgData.name}`);
    console.log(`Organization ID: ${orgId}`);
    console.log(`Invite link: ${inviteLink}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invitation sent successfully",
        inviteLink,
        organizationName: orgData.name,
        organizationId: orgId
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
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
