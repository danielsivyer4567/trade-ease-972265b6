// Import the existing Supabase client instance
import { supabase } from '@/integrations/supabase/client';

// Re-export the client for backward compatibility
export { supabase };

// The following code is deprecated and will be removed in a future update
// import { createClient } from '@supabase/supabase-js';
// 
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wxwbxupdisbofesaygqj.supabase.co';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDI0OTgsImV4cCI6MjA1NTU3ODQ5OH0.xhjkVsi9XZMwobUMsdYE0e1FXQeT_uNLaTHquGvRxjI';
// 
// export const supabase = createClient(supabaseUrl, supabaseAnonKey); 