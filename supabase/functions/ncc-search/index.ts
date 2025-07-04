import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NCCSearchRequest {
  query: string;
  limit?: number;
  category?: string;
}

interface NCCCode {
  id: string;
  code: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  section: string | null;
  volume: string | null;
  part: string | null;
  clause: string | null;
  notes: string | null;
  keywords: string[] | null;
  relevance_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid or missing authentication');
    }

    // Check if user has NCC voice search access
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select(`
        subscription_tier,
        is_active,
        subscription_features!inner(
          feature_key,
          enabled
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .eq('subscription_features.feature_key', 'ncc_voice_search')
      .eq('subscription_features.enabled', true)
      .single();

    if (subscriptionError || !subscriptionData) {
      return new Response(
        JSON.stringify({ 
          error: 'Access denied. NCC Code Search via Voice requires Premium Edge or Skeleton Key subscription.' 
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { query, limit = 20, category }: NCCSearchRequest = await req.json();
    
    if (!query || typeof query !== 'string') {
      throw new Error('Query parameter is required and must be a string');
    }

    // Perform the search using the database function
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_ncc_codes', { search_query: query })
      .limit(limit);

    if (searchError) {
      console.error('Database search error:', searchError);
      throw new Error('Error searching NCC codes');
    }

    // Filter by category if specified
    let filteredResults = searchResults || [];
    if (category) {
      filteredResults = filteredResults.filter((result: NCCCode) => 
        result.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Format the response
    const formattedResults = filteredResults.map((result: NCCCode) => ({
      id: result.id,
      code: result.code,
      title: result.title,
      description: result.description,
      category: result.category,
      subcategory: result.subcategory,
      section: result.section,
      volume: result.volume,
      part: result.part,
      clause: result.clause,
      notes: result.notes,
      keywords: result.keywords,
      relevance_score: result.relevance_score
    }));

    return new Response(
      JSON.stringify({
        results: formattedResults,
        total: formattedResults.length,
        query: query,
        category: category || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in NCC search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        results: [],
        total: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 