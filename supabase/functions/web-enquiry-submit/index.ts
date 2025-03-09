
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.1'

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
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse the request body
    const { formData, targetEmail } = await req.json()
    
    // Log the form submission data
    console.log('Received web enquiry form submission:', formData)
    console.log('Target email for notification:', targetEmail)

    // Store the enquiry in the database
    const { data: enquiry, error: insertError } = await supabase
      .from('web_enquiries')
      .insert([
        { 
          form_data: formData,
          status: 'new'
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Error storing enquiry:', insertError)
      throw new Error('Failed to store enquiry')
    }

    // Create a notification for the new enquiry
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert([
        {
          title: "New Web Enquiry",
          description: `New enquiry from ${formData.name || 'a customer'}`,
          type: "web_enquiry",
          metadata: { enquiry_id: enquiry.id }
        }
      ])

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      // We continue even if notification creation fails
    }

    // Send email notification if target email is provided
    if (targetEmail) {
      // In a production environment, you would integrate with an email
      // service like SendGrid, Resend, or Mailgun here
      console.log(`Would send email notification to ${targetEmail}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Enquiry submitted successfully',
        id: enquiry.id
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error processing web enquiry:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
