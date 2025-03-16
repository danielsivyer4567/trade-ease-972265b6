
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SyncRequest {
  userId: string;
  connectionId: string;
  events: Array<{
    id: string;
    title: string;
    description?: string;
    location?: string;
    start: string;
    end: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the user from the auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Verify the user with Supabase
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse the request body
    const { connectionId, events } = await req.json() as SyncRequest;
    
    // Validate the request
    if (!connectionId || !events || !Array.isArray(events)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the user's calendar connection
    const { data: connections, error: connectionError } = await supabase
      .from('user_calendar_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', user.id)
      .eq('sync_enabled', true);
    
    if (connectionError || !connections || connections.length === 0) {
      console.error('Connection error:', connectionError);
      return new Response(JSON.stringify({ error: 'Calendar connection not found' }), { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const connection = connections[0];
    
    // In a real implementation, we would use the connection tokens to access the 
    // provider's API and sync the events. For now, we'll just simulate success.
    
    // Record the events in our database
    const syncPromises = events.map(async (event) => {
      // Check if the event is already synced
      const { data: existingEvents } = await supabase
        .from('calendar_sync_events')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('trade_event_id', event.id);
      
      if (existingEvents && existingEvents.length > 0) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('calendar_sync_events')
          .update({
            event_title: event.title,
            event_start: event.start,
            event_end: event.end,
            sync_status: 'synced',
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEvents[0].id);
        
        if (updateError) {
          console.error('Error updating sync event:', updateError);
          return { eventId: event.id, status: 'failed', error: updateError.message };
        }
      } else {
        // Create new event
        const { error: insertError } = await supabase
          .from('calendar_sync_events')
          .insert({
            user_id: user.id,
            connection_id: connectionId,
            trade_event_id: event.id,
            provider_event_id: `provider_${Date.now()}_${event.id}`, // Simulated provider ID
            event_title: event.title,
            event_start: event.start,
            event_end: event.end,
            sync_status: 'synced',
            last_synced_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error inserting sync event:', insertError);
          return { eventId: event.id, status: 'failed', error: insertError.message };
        }
      }
      
      return { eventId: event.id, status: 'synced' };
    });
    
    const results = await Promise.all(syncPromises);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Events synchronized successfully',
      results
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
