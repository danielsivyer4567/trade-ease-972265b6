import { createClient } from '@supabase/supabase-js'

// Use fallback values if environment variables are not defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  });
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage,
    flowType: 'pkce',
    debug: import.meta.env.DEV
  },
  global: {
    headers: {
      'x-client-info': 'trade-ease'
    }
  },
  db: {
    schema: 'public'
  }
});

// Test the connection and retry if needed
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const testConnection = async (retryCount = 0): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    console.log('Supabase connection test successful:', data);
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => testConnection(retryCount + 1), RETRY_DELAY);
    }
  }
};

// Initialize connection test
testConnection();

// Create an admin client with the service role key for privileged operations
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'supabase.auth.admin.token',
        storage: window.localStorage,
        flowType: 'pkce',
        debug: import.meta.env.DEV
      }
    })
  : null;

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
