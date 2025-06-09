import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '@/config/supabase'

// Debug environment variables in development mode only
if (import.meta.env.DEV) {
  console.log('Supabase environment:', {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  });
}

// Get environment variables with fallbacks
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please check your environment variables.');
  throw new Error('Supabase credentials are required');
}

// Create a single instance of the Supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Create an admin client with the service role key for privileged operations
export const supabaseAdmin = null;

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

// Create a mock Supabase client that will gracefully fail
function createMockSupabaseClient() {
  const mockErrorResponse = { data: null, error: { message: 'Supabase not properly initialized' }};
  
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signUp: async () => mockErrorResponse,
      signIn: async () => mockErrorResponse,
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve(mockErrorResponse)
        }),
        single: () => Promise.resolve(mockErrorResponse)
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve(mockErrorResponse)
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve(mockErrorResponse)
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    }),
    functions: {
      invoke: async () => ({ error: 'Supabase not initialized' })
    }
  };
}
