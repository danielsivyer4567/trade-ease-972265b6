
import { createClient } from '@supabase/supabase-js';

// Set default environment variables if they're not defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxwbxupdisbofesaygqj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDI0OTgsImV4cCI6MjA1NTU3ODQ5OH0.xhjkVsi9XZMwobUMsdYE0e1FXQeT_uNLaTHquGvRxjI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Needed for demo data generation
export const generateDemoData = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-demo-data');
    return { data, error };
  } catch (error) {
    console.error('Error generating demo data:', error);
    return { data: null, error: error };
  }
};
