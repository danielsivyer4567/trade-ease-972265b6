import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TimberQueenslandSearchRequest {
  query: string;
  limit?: number;
  category?: string;
}

interface TimberQueenslandData {
  id: string;
  data_code: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  timber_type: string | null;
  grade: string | null;
  dimensions: string | null;
  properties: any;
  specifications: string | null;
  notes: string | null;
  keywords: string[] | null;
  external_url: string | null;
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

    // Check if user has Timber Queensland voice search access
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
      .eq('subscription_features.feature_key', 'timber_queensland_voice_search')
      .eq('subscription_features.enabled', true)
      .single();

    if (subscriptionError || !subscriptionData) {
      return new Response(
        JSON.stringify({ 
          error: 'Access denied. Timber Queensland Voice Search requires Premium Edge or Skeleton Key subscription.' 
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { query, limit = 20, category }: TimberQueenslandSearchRequest = await req.json();
    
    if (!query || typeof query !== 'string') {
      throw new Error('Query parameter is required and must be a string');
    }

    // Perform the search using the database function
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_timber_queensland_data', { search_query: query })
      .limit(limit);

    if (searchError) {
      console.error('Database search error:', searchError);
      throw new Error('Error searching Timber Queensland data');
    }

    // Filter by category if specified
    let filteredResults = searchResults || [];
    if (category) {
      filteredResults = filteredResults.filter((result: TimberQueenslandData) => 
        result.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Format the response
    const formattedResults = filteredResults.map((result: TimberQueenslandData) => ({
      id: result.id,
      data_code: result.data_code,
      title: result.title,
      description: result.description,
      category: result.category,
      subcategory: result.subcategory,
      timber_type: result.timber_type,
      grade: result.grade,
      dimensions: result.dimensions,
      properties: result.properties,
      specifications: result.specifications,
      notes: result.notes,
      keywords: result.keywords,
      external_url: result.external_url,
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
    console.error('Error in Timber Queensland search function:', error);
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