import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance of the Supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Create an admin client with the service role key for privileged operations
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  : null 