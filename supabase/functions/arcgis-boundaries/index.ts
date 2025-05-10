import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Base URLs for ArcGIS services
const BRISBANE_PROPERTY_URL = "https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/property_boundaries_holding/FeatureServer/0"
const BRISBANE_ROADS_URL = "https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Road_corridor/FeatureServer/0"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location, address, houseNumber, streetName, suburb, postcode, apiKey } = await req.json()
    
    if (!apiKey) {
      throw new Error('API key is required')
    }
    
    // Add apiKey parameter to URL
    const apiKeyParam = `&token=${apiKey}`

    // Case 1: Direct query by address components
    if (houseNumber && streetName) {
      // Build a query to find the property by address components
      let queryString = ""
      
      if (houseNumber) {
        queryString += `HOUSE_NUMBER = ${houseNumber} `
      }
      
      if (streetName) {
        // Remove suffixes like St, Road etc for better matching
        const streetBase = streetName.includes(' ') ? streetName.split(' ')[0] : streetName
        if (queryString) {
          queryString += "AND "
        }
        queryString += `CORRIDOR_NAME LIKE '%${streetBase}%' `
      }
      
      if (suburb) {
        if (queryString) {
          queryString += "AND "
        }
        queryString += `SUBURB LIKE '%${suburb}%' `
      }
      
      if (postcode) {
        if (queryString) {
          queryString += "AND "
        }
        queryString += `POSTCODE = ${postcode} `
      }

      // Execute query against Brisbane property boundaries
      const response = await fetch(
        `${BRISBANE_PROPERTY_URL}/query?f=json&where=${encodeURIComponent(queryString)}&outFields=*&returnGeometry=true${apiKeyParam}`
      )

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Case 2: Search by full address string
    else if (address) {
      // First geocode the address to get coordinates
      const geocodeResponse = await fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(address)}&outFields=*&maxLocations=1&forStorage=false${apiKeyParam}`
      )
      
      const geocodeData = await geocodeResponse.json()
      
      if (!geocodeData.candidates || geocodeData.candidates.length === 0) {
        throw new Error('Address could not be geocoded')
      }
      
      const candidate = geocodeData.candidates[0]
      const point = candidate.location
      
      // Now use the coordinates to query for property boundaries
      const boundaryResponse = await fetch(
        `${BRISBANE_PROPERTY_URL}/query?f=json&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&where=1=1&outFields=*&returnGeometry=true&geometry=${encodeURIComponent(JSON.stringify(point))}&inSR=4326&outSR=4326${apiKeyParam}`
      )
      
      const boundaryData = await boundaryResponse.json()
      return new Response(JSON.stringify({
        geocode: candidate,
        boundaries: boundaryData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Case 3: Search by location coordinates
    else if (location && (location.x !== undefined && location.y !== undefined)) {
      // Call ArcGIS service to get property boundaries using location point
      const response = await fetch(
        `${BRISBANE_PROPERTY_URL}/query?f=json&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&where=1=1&outFields=*&returnGeometry=true&geometry=${encodeURIComponent(JSON.stringify({
          x: location.x,
          y: location.y,
          spatialReference: { wkid: 4326 }
        }))}&inSR=4326&outSR=4326${apiKeyParam}`
      )
      
      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    else {
      throw new Error('Valid search parameters (address, location coordinates, or address components) are required')
    }
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
