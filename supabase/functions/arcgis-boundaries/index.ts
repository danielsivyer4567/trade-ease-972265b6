
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    const apiKey = Deno.env.get('ARCGIS_API_KEY')

    if (!apiKey) {
      throw new Error('ArcGIS API key not configured')
    }

    if (!location || !location.x || !location.y) {
      throw new Error('Valid location coordinates are required')
    }

    // Call ArcGIS service to get property boundaries
    const response = await fetch(
      `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Parcels/FeatureServer/0/query?f=json&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&units=esriSRUnit_Meter&outFields=*&geometry=${encodeURIComponent(JSON.stringify({
        x: location.x,
        y: location.y,
        spatialReference: { wkid: 4326 }
      }))}&token=${apiKey}`
    )

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
