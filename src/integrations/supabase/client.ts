
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Configure and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// This is a stub function that will be implemented when needed
// It's referenced in DemoDataGenerator.tsx
export const generateDemoData = async () => {
  console.log("Demo data generation function called");
  return { success: true, message: "Demo data generation is not implemented in this client." };
};
