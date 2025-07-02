import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are available
if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Get the Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// Create the Supabase client with appropriate configuration
export const supabase = createClient(
  'https://wxwbxupdisbofesaygqj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTExMTQsImV4cCI6MjA2NTY4NzExNH0.JFDOBBTmzr8xj3NTICBLnztHliD-HbnC7HAswQbLw4E'
)

// Export admin client (placeholder for now)
export const supabaseAdmin = supabase

// Export demo data generator (placeholder for now)
export const generateDemoData = () => Promise.resolve([])

