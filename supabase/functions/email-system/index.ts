import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// Template Management
async function handleTemplates(req: Request) {
  const { method } = req;
  const url = new URL(req.url);
  const templateId = url.pathname.split('/').pop();

  switch (method) {
    case 'GET':
      if (templateId) {
        const { data, error } = await supabaseClient
          .from('email_templates')
          .select('*')
          .eq('id', templateId)
          .single();
        
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      } else {
        const { data, error } = await supabaseClient
          .from('email_templates')
          .select('*');
        
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      }

    case 'POST':
      const templateData = await req.json();
      const { data: newTemplate, error: createError } = await supabaseClient
        .from('email_templates')
        .insert([{ ...templateData, created_by: req.headers.get('x-user-id') }])
        .select()
        .single();
      
      if (createError) throw createError;
      return new Response(JSON.stringify(newTemplate), { headers: corsHeaders });

    case 'PUT':
      if (!templateId) throw new Error('Template ID required');
      const updateData = await req.json();
      const { data: updatedTemplate, error: updateError } = await supabaseClient
        .from('email_templates')
        .update(updateData)
        .eq('id', templateId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return new Response(JSON.stringify(updatedTemplate), { headers: corsHeaders });

    case 'DELETE':
      if (!templateId) throw new Error('Template ID required');
      const { error: deleteError } = await supabaseClient
        .from('email_templates')
        .delete()
        .eq('id', templateId);
      
      if (deleteError) throw deleteError;
      return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }
}

// Campaign Management
async function handleCampaigns(req: Request) {
  const { method } = req;
  const url = new URL(req.url);
  const campaignId = url.pathname.split('/').pop();

  switch (method) {
    case 'GET':
      if (campaignId) {
        const { data, error } = await supabaseClient
          .from('campaigns')
          .select(`
            *,
            email_templates (*),
            email_analytics (*)
          `)
          .eq('id', campaignId)
          .single();
        
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      } else {
        const { data, error } = await supabaseClient
          .from('campaigns')
          .select('*');
        
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      }

    case 'POST':
      const campaignData = await req.json();
      const { data: newCampaign, error: createError } = await supabaseClient
        .from('campaigns')
        .insert([{ ...campaignData, created_by: req.headers.get('x-user-id') }])
        .select()
        .single();
      
      if (createError) throw createError;
      return new Response(JSON.stringify(newCampaign), { headers: corsHeaders });

    case 'PUT':
      if (!campaignId) throw new Error('Campaign ID required');
      const updateData = await req.json();
      const { data: updatedCampaign, error: updateError } = await supabaseClient
        .from('campaigns')
        .update(updateData)
        .eq('id', campaignId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return new Response(JSON.stringify(updatedCampaign), { headers: corsHeaders });
  }
}

// Contact List Management
async function handleContactLists(req: Request) {
  const { method } = req;
  const url = new URL(req.url);
  const listId = url.pathname.split('/').pop();

  switch (method) {
    case 'GET':
      if (listId) {
        const { data, error } = await supabaseClient
          .from('contact_lists')
          .select(`
            *,
            contact_list_members (
              contacts (*)
            )
          `)
          .eq('id', listId)
          .single();
        
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      } else {
        const { data, error } = await supabaseClient
          .from('contact_lists')
          .select('*');
        
        if (error) throw error;
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      }

    case 'POST':
      const listData = await req.json();
      const { data: newList, error: createError } = await supabaseClient
        .from('contact_lists')
        .insert([{ ...listData, created_by: req.headers.get('x-user-id') }])
        .select()
        .single();
      
      if (createError) throw createError;
      return new Response(JSON.stringify(newList), { headers: corsHeaders });

    case 'PUT':
      if (!listId) throw new Error('List ID required');
      const updateData = await req.json();
      const { data: updatedList, error: updateError } = await supabaseClient
        .from('contact_lists')
        .update(updateData)
        .eq('id', listId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      return new Response(JSON.stringify(updatedList), { headers: corsHeaders });
  }
}

// Analytics and Reporting
async function handleAnalytics(req: Request) {
  const { method } = req;
  const url = new URL(req.url);
  const campaignId = url.searchParams.get('campaign_id');
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date');

  if (method === 'GET') {
    let query = supabaseClient
      .from('email_analytics')
      .select('*');

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return new Response(JSON.stringify(data), { headers: corsHeaders });
  }
}

// Main request handler
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith('/templates')) {
      return await handleTemplates(req);
    } else if (path.startsWith('/campaigns')) {
      return await handleCampaigns(req);
    } else if (path.startsWith('/lists')) {
      return await handleContactLists(req);
    } else if (path.startsWith('/analytics')) {
      return await handleAnalytics(req);
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}); 