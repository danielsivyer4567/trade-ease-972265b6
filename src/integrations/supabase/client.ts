import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '@/config/supabase'

// Debug environment variables
console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Validate environment variables
if (!supabaseUrl) {
  console.error('Supabase URL is not defined. Please check your environment variables.');
  throw new Error('VITE_SUPABASE_URL is not defined in environment variables');
}

if (!supabaseAnonKey) {
  console.error('Supabase Anon Key is not defined. Please check your environment variables.');
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined in environment variables');
}

// Create a single instance of the Supabase client for the entire app
// IMPORTANT: Always import this instance rather than creating new ones to avoid
// the "Multiple GoTrueClient instances detected" warning
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)

// Create an admin client with the service role key for privileged operations
export const supabaseAdmin = null

// Add the demo data generation function
export const generateDemoData = async () => {
  try {
    const response = await supabase.functions.invoke('generate-demo-data', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('Error generating demo data:', error);
    return { error };
  }
};
