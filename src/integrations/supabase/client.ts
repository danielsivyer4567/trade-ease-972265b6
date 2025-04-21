import { createClient } from '@supabase/supabase-js'

// Use fallback values if environment variables are not defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxwbxupdisbofesaygqj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDI0OTgsImV4cCI6MjA1NTU3ODQ5OH0.xhjkVsi9XZMwobUMsdYE0e1FXQeT_uNLaTHquGvRxjI';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Create an admin client with the service role key for privileged operations
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null

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
