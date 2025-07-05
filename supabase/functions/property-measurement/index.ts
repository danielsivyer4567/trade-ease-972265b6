import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { street_number, street_name, street_type, suburb, postcode } = await req.json()

    // Validate required fields
    if (!street_number || !street_name || !street_type || !suburb || !postcode) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'All property fields are required' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const requestBody = {
      street_number: street_number.toString(),
      street_name: street_name.toString(),
      street_type: street_type.toString(),
      suburb: suburb.toString(),
      postcode: postcode.toString()
    }

    console.log('Making request to property measurement API:', requestBody)

    const response = await fetch('https://property-measurement-47233712259.australia-southeast1.run.app/visualize', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 5a218f5e-58cf-4dd9-ad40-ed1d90ce4fc7',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('External API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('External API error:', errorText)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `External API error: ${response.status} - ${errorText}` 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.text()
    console.log('External API success response received')

    // Try to parse as JSON, if it fails return as text
    try {
      const jsonData = JSON.parse(data)
      return new Response(
        JSON.stringify({ success: true, data: jsonData }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } catch {
      return new Response(
        JSON.stringify({ success: true, data: data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Property measurement function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 