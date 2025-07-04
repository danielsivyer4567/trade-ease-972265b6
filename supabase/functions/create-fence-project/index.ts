import { serve } from 'http/server'
import { createClient } from '@supabase/supabase-js'

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
    // Initialize Supabase client with service role key for elevated permissions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    console.log('🚀 Creating fence project with user...')

    // 1. Create unique user for this fence project
    console.log('👤 Creating unique user account...')
    const timestamp = new Date().getTime()
    const email = `danielsivyer4567+${timestamp}@gmail.com`
    
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: 'TempPassword123!',
      email_confirm: true,
      user_metadata: {
        name: 'Daniel Sivyer',
        role: 'customer'
      }
    })

    if (userError) {
      console.error('❌ User creation failed:', userError.message)
      throw new Error(`User creation failed: ${userError.message}`)
    }

    console.log('✅ User created:', user.user.id)
    const userId = user.user.id

    // 2. Create Customer Record
    console.log('👤 Creating customer record...')
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([
        {
          name: 'Daniel Sivyer',
          email: email,
          phone: 'Not provided',
          address: 'Fence installation location',
          city: 'Not specified',
          state: 'Not specified',
          zipcode: 'Not specified',
          status: 'active',
          user_id: userId  // Use the found user's ID
        }
      ])
      .select()
      .single()

    if (customerError) {
      console.error('❌ Customer creation error:', customerError)
      throw new Error(`Customer creation failed: ${customerError.message}`)
    }
    
    console.log('✅ Customer created:', customer.name)
    
    // 3. Create Job Record
    console.log('🏗️ Creating job record...')
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert([
        {
          job_number: 'FENCE-2025-001',
          title: 'Fence Installation Project',
          description: 'Fence sheet replacement and rail adjustments. Quality control and material coordination required. Issues: Material quantity disputes, quality concerns about sheet appearance.',
          customer: customer.id,
          type: 'Fencing',
          status: 'in_progress',
          date: new Date().toISOString().split('T')[0],
          assigned_team: 'Jas Dresser',
          user_id: userId  // Use the found user's ID
        }
      ])
      .select()
      .single()

    if (jobError) {
      console.error('❌ Job creation error:', jobError)
      throw new Error(`Job creation failed: ${jobError.message}`)
    }
    
    console.log('✅ Job created:', job.title)
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Fence project created successfully',
        data: {
          user: {
            id: userId,
            email: email,
            name: 'Daniel Sivyer'
          },
          customer,
          job,
          project_estimate: {
            fence_area: 30,
            sheets_needed: 14,
            estimated_labor_hours: 16,
            estimated_material_cost: 1940.00,
            estimated_labor_cost: 2080.00,
            subtotal: 4020.00,
            markup_percentage: 25,
            markup_amount: 1005.00,
            subtotal_with_markup: 5025.00,
            gst_percentage: 10,
            gst_amount: 502.50,
            estimated_total: 5527.50,
            currency: 'AUD',
            calculation_notes: 'Based on 10m x 3m fence area. Materials: 14 sheets at $138.57/sheet. Labor: 16 hours at $130/hour (2 workers). 25% markup + 10% GST.'
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error creating fence project:', error)
    
    return new Response(
      JSON.stringify({ 
        data: null,
        error: { 
          message: error.message 
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 