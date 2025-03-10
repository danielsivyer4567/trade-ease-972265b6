
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generate random organization names
    const organizationNames = [
      "Horizon Construction", 
      "Evergreen Plumbing", 
      "Summit Electrical", 
      "Metro Builders", 
      "Coastal Renovations",
      "Urban Trades", 
      "Excel Contracting",
      "Premier Services",
      "Elite Maintenance",
      "Reliable Home Solutions"
    ];
    
    // Sample member names and emails
    const memberData = [
      { name: "John Smith", email: "john.smith@example.com" },
      { name: "Sarah Johnson", email: "sarah.johnson@example.com" },
      { name: "Michael Brown", email: "michael.brown@example.com" },
      { name: "Emma Wilson", email: "emma.wilson@example.com" },
      { name: "David Lee", email: "david.lee@example.com" },
      { name: "Jessica Taylor", email: "jessica.taylor@example.com" },
      { name: "Robert Martin", email: "robert.martin@example.com" },
      { name: "Lisa Anderson", email: "lisa.anderson@example.com" },
      { name: "Thomas White", email: "thomas.white@example.com" },
      { name: "Jennifer Davis", email: "jennifer.davis@example.com" }
    ];
    
    // Generate 3 random organizations
    const createdOrganizations = [];
    const randomOrganizations = [];
    
    // Randomly select 3 organization names
    while (randomOrganizations.length < 3) {
      const randomIndex = Math.floor(Math.random() * organizationNames.length);
      const name = organizationNames[randomIndex];
      
      // Avoid duplicates
      if (!randomOrganizations.includes(name)) {
        randomOrganizations.push(name);
      }
    }
    
    // Create organizations
    for (const name of randomOrganizations) {
      // Insert organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({ name })
        .select('id, name')
        .single();
        
      if (orgError) {
        console.error(`Error creating organization ${name}:`, orgError);
        continue;
      }
      
      console.log(`Created organization: ${name} with ID: ${orgData.id}`);
      createdOrganizations.push(orgData);
      
      // Create 3 random members for this organization
      const usedMemberIndexes = new Set();
      for (let i = 0; i < 3; i++) {
        // Find an unused member
        let randomMemberIndex;
        do {
          randomMemberIndex = Math.floor(Math.random() * memberData.length);
        } while (usedMemberIndexes.has(randomMemberIndex));
        
        usedMemberIndexes.add(randomMemberIndex);
        const member = memberData[randomMemberIndex];
        
        // Create a user with this email
        const password = `Password123!`; // Simple password for test accounts
        
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email: member.email,
          password: password,
          email_confirm: true, // Auto-confirm the email
          user_metadata: { full_name: member.name }
        });
        
        if (userError) {
          console.error(`Error creating user ${member.email}:`, userError);
          continue;
        }
        
        const userId = userData.user.id;
        
        // Assign a random role (owner for the first user, then admin or member)
        let role = 'member';
        if (i === 0) {
          role = 'owner';
        } else if (i === 1) {
          role = 'admin';
        }
        
        // Add user to the organization
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            organization_id: orgData.id,
            user_id: userId,
            role: role
          });
          
        if (memberError) {
          console.error(`Error adding user ${member.email} to organization:`, memberError);
          continue;
        }
        
        // Update user configuration to set organization
        const { error: configError } = await supabase
          .from('users_configuration')
          .update({ organization_id: orgData.id })
          .eq('id', userId);
          
        if (configError) {
          console.error(`Error updating user configuration for ${member.email}:`, configError);
        }
        
        console.log(`Added user ${member.email} as ${role} to organization ${orgData.name}`);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Demo data generated successfully",
        organizations: createdOrganizations
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating demo data:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
