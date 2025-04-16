
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials are not configured')
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { searchQuery, userId, limit = 20, offset = 0 } = await req.json()
    
    console.log(`Search request received: query="${searchQuery}", userId=${userId}`)

    // Build base query
    let query = supabase
      .from('property_boundaries')
      .select('*')
      
    // Apply search filters if provided
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }
    
    // Filter by user ID if provided (for authenticated requests)
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    // Apply pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .limit(limit)
    
    if (error) {
      console.error('Error searching property boundaries:', error)
      throw error
    }
    
    // Get the total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('property_boundaries')
      .select('*', { count: 'exact', head: true })
      .or(`name.ilike.%${searchQuery || ''}%,address.ilike.%${searchQuery || ''}%,description.ilike.%${searchQuery || ''}%`)
      .eq(userId ? 'user_id' : 'id', userId || '')
    
    if (countError) {
      console.error('Error counting property boundaries:', countError)
    }

    return new Response(
      JSON.stringify({
        data,
        pagination: {
          total: totalCount || 0,
          limit,
          offset,
          hasMore: (offset + limit) < (totalCount || 0)
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in search-property-boundaries function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
