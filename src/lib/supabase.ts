// Re-export the supabase client from the integrations directory
import { supabase, supabaseAdmin, generateDemoData } from '@/integrations/supabase/client';

// Export the supabase client so it can be imported from @/lib/supabase
export { supabase, supabaseAdmin, generateDemoData }; 