
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Use fallback values if environment variables are not defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxwbxupdisbofesaygqj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDI0OTgsImV4cCI6MjA1NTU3ODQ5OH0.xhjkVsi9XZMwobUMsdYE0e1FXQeT_uNLaTHquGvRxjI';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Create a single instance of the Supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Create an admin client with the service role key for privileged operations
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  : null 
