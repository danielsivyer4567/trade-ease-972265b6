
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ManageNumberRequest {
  action: 'add' | 'update' | 'delete' | 'list';
  phoneNumber?: string;
  price?: number;
  status?: 'available' | 'sold' | 'reserved';
  userId?: string;
  adminKey?: string; // A secret key for admin access
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const adminSecretKey = Deno.env.get('ADMIN_SECRET_KEY') || '';
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const requestData: ManageNumberRequest = await req.json();
    const { action, phoneNumber, price, status, userId, adminKey } = requestData;
    
    // Validate admin access
    if (adminKey !== adminSecretKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Unauthorized access" 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Execute requested action
    if (action === 'list') {
      // List all phone numbers
      const { data, error } = await supabase
        .from('phone_numbers_for_sale')
        .select('*');
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({
          success: true,
          numbers: data
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } 
    else if (action === 'add' && phoneNumber && price) {
      // Add new phone number
      const { data, error } = await supabase
        .from('phone_numbers_for_sale')
        .insert({
          phone_number: phoneNumber,
          price,
          status: status || 'available',
          user_id: null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Phone number added successfully",
          number: data
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } 
    else if (action === 'update' && phoneNumber) {
      // Update phone number
      const updateData: Record<string, any> = {};
      if (price !== undefined) updateData.price = price;
      if (status !== undefined) updateData.status = status;
      if (userId !== undefined) updateData.user_id = userId || null;
      
      const { data, error } = await supabase
        .from('phone_numbers_for_sale')
        .update(updateData)
        .eq('phone_number', phoneNumber)
        .select()
        .single();
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Phone number updated successfully",
          number: data
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } 
    else if (action === 'delete' && phoneNumber) {
      // Delete phone number
      const { error } = await supabase
        .from('phone_numbers_for_sale')
        .delete()
        .eq('phone_number', phoneNumber);
      
      if (error) throw error;
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "Phone number deleted successfully"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } 
    else {
      throw new Error("Invalid action or missing required parameters");
    }
  } catch (error) {
    console.error("Error in admin-manage-numbers function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "An unexpected error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
