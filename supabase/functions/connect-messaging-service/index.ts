
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ServiceType = 'twilio' | 'sms' | 'email' | 'voicemail' | 'whatsapp' | 'messenger' | 'custom';

interface ConnectRequest {
  serviceType: ServiceType;
  connectionDetails: {
    // Twilio specific
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
    
    // Generic
    apiKey?: string;
    accountId?: string;
    url?: string;
  };
  userId?: string; // Add userId field to associate with a specific user
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
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const data = await req.json() as ConnectRequest;
    const { serviceType, connectionDetails, userId } = data;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    console.log(`Connecting to ${serviceType} service for user ${userId}`);
    
    // Validate connection parameters
    if (serviceType === 'twilio') {
      if (!connectionDetails.accountSid || !connectionDetails.authToken || !connectionDetails.phoneNumber) {
        throw new Error('Missing required Twilio connection parameters');
      }
      
      // In a real implementation, you would verify the Twilio credentials here
      // For example:
      // const twilioResponse = await fetch(
      //   `https://api.twilio.com/2010-04-01/Accounts/${connectionDetails.accountSid}.json`,
      //   {
      //     headers: {
      //       Authorization: `Basic ${btoa(`${connectionDetails.accountSid}:${connectionDetails.authToken}`)}`
      //     }
      //   }
      // );
      
      // if (!twilioResponse.ok) {
      //   throw new Error('Invalid Twilio credentials');
      // }
    } else if (serviceType !== 'email' && (!connectionDetails.apiKey || !connectionDetails.accountId)) {
      throw new Error('Missing required connection parameters');
    }
    
    // Store the messaging account in the database
    const { data: accountData, error: accountError } = await supabase
      .from('messaging_accounts')
      .insert({
        user_id: userId,
        service_type: serviceType,
        account_id: connectionDetails.accountId || null,
        api_key: connectionDetails.apiKey || null,
        phone_number: connectionDetails.phoneNumber || null,
        account_sid: connectionDetails.accountSid || null,
        auth_token: connectionDetails.authToken || null
      })
      .select('id')
      .single();
    
    if (accountError) {
      console.error('Error storing messaging account:', accountError);
      throw new Error('Failed to store messaging account details');
    }
    
    // Enable messaging for the user if it's not already enabled
    const { error: configError } = await supabase
      .from('users_configuration')
      .update({ messaging_enabled: true })
      .eq('id', userId);
    
    if (configError) {
      console.error('Error updating user configuration:', configError);
      // We don't want to fail the whole operation if just this update fails
      console.log('Continuing despite user configuration update error');
    }
    
    // Return success response with the account ID
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully connected to ${serviceType} service`,
        serviceId: accountData.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error connecting to messaging service:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Failed to connect to messaging service'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
