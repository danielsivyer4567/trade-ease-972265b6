import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are available
if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Use the original Supabase URL for data operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// For development, use the local proxy for auth endpoints to avoid CORS issues
const authUrl = import.meta.env.DEV ? window.location.origin : supabaseUrl

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Add CORS settings for localhost development
    storageKey: 'supabase-auth',
    // Enable debug mode to help diagnose issues
    debug: import.meta.env.DEV,
    // Use the local proxy for auth in development
    ...(import.meta.env.DEV && { url: authUrl })
  },
  global: {
    headers: {
      'X-Client-Info': 'trade-ease@1.0.0'
    }
  }
})

// Export admin client (placeholder for now)
export const supabaseAdmin = supabase

// Export demo data generator (placeholder for now)
export const generateDemoData = () => Promise.resolve([])
