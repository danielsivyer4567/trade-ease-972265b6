import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from '@/config/supabase'

// Debug environment variables in development mode only
if (import.meta.env.DEV) {
  console.log('Supabase environment:', {
    hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    url: import.meta.env.VITE_SUPABASE_URL,
  });
}

// Get environment variables with fallbacks
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

// Check if we're using placeholder/demo credentials
const isPlaceholderUrl = !supabaseUrl || 
  supabaseUrl.includes('your-project.supabase.co') || 
  supabaseUrl === 'https://your-project.supabase.co';

const isPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey === 'your-anon-key' ||
  supabaseAnonKey.length < 10;

const useOfflineMode = isPlaceholderUrl || isPlaceholderKey;

if (useOfflineMode) {
  console.log('🔧 DEVELOPMENT MODE: Using offline/mock Supabase client');
  console.log('To use real Supabase, update your .env file with real credentials');
}

// Create Supabase client or mock client
export const supabase = useOfflineMode 
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
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
  if (useOfflineMode) {
    console.log('📊 Demo data generation simulated in offline mode');
    return { 
      data: { message: 'Demo data generated (simulated)' }, 
      error: null 
    };
  }
  
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

// Create a mock Supabase client for offline development
function createMockSupabaseClient() {
  let mockUsers: any[] = [];
  let mockSession: any = null;
  let authListeners: Array<(event: string, session: any) => void> = [];

  // Mock data storage
  const mockData: Record<string, any[]> = {
    customers: [],
    jobs: [],
    tasks: [],
    quotes: [],
    messages: [],
    workflows: [],
    workflow_executions: [],
    automations: [],
    user_profiles: [],
    two_factor_auth: []
  };

  const mockAuth = {
    getSession: async () => {
      console.log('🔧 Mock: getSession called');
      return { data: { session: mockSession }, error: null };
    },
    
    signUp: async ({ email, password }: any) => {
      console.log('🔧 Mock: signUp called', { email });
      const user = {
        id: crypto.randomUUID(),
        email,
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString()
      };
      mockUsers.push(user);
      return { 
        data: { user }, 
        error: null 
      };
    },
    
    signInWithPassword: async ({ email, password }: any) => {
      console.log('🔧 Mock: signInWithPassword called', { email });
      const user = mockUsers.find(u => u.email === email) || {
        id: crypto.randomUUID(),
        email,
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString()
      };
      
      if (!mockUsers.find(u => u.email === email)) {
        mockUsers.push(user);
      }
      
      mockSession = {
        user,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000
      };
      
      // Notify listeners
      setTimeout(() => {
        authListeners.forEach(listener => listener('SIGNED_IN', mockSession));
      }, 100);
      
      return { 
        data: { user, session: mockSession }, 
        error: null 
      };
    },
    
    signOut: async () => {
      console.log('🔧 Mock: signOut called');
      mockSession = null;
      
      // Notify listeners
      setTimeout(() => {
        authListeners.forEach(listener => listener('SIGNED_OUT', null));
      }, 100);
      
      return { error: null };
    },
    
    resetPasswordForEmail: async (email: string) => {
      console.log('🔧 Mock: resetPasswordForEmail called', { email });
      return { error: null };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log('🔧 Mock: onAuthStateChange called');
      authListeners.push(callback);
      
      // Immediately call with current session
      setTimeout(() => callback(mockSession ? 'SIGNED_IN' : 'SIGNED_OUT', mockSession), 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const index = authListeners.indexOf(callback);
              if (index > -1) authListeners.splice(index, 1);
            }
          }
        }
      };
    }
  };

  const createMockTable = (tableName: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => {
          const table = mockData[tableName] || [];
          const item = table.find((row: any) => row[column] === value);
          return Promise.resolve({ 
            data: item || null, 
            error: item ? null : { message: 'No data found' } 
          });
        },
        order: (column: string, options?: any) => {
          const table = mockData[tableName] || [];
          const filtered = table.filter((row: any) => row[column] === value);
          return Promise.resolve({ data: filtered, error: null });
        }
      }),
      order: (column: string, options?: any) => {
        const table = mockData[tableName] || [];
        return Promise.resolve({ data: table, error: null });
      },
      limit: (count: number) => ({
        single: () => {
          const table = mockData[tableName] || [];
          return Promise.resolve({ 
            data: table[0] || null, 
            error: table.length ? null : { message: 'No data found' } 
          });
        }
      }),
      gt: (column: string, value: any) => ({
        single: () => {
          const table = mockData[tableName] || [];
          const item = table.find((row: any) => row[column] > value);
          return Promise.resolve({ 
            data: item || null, 
            error: item ? null : { message: 'No data found' } 
          });
        }
      })
    }),
    
    insert: (data: any) => ({
      select: () => ({
        single: () => {
          const newItem = { 
            id: crypto.randomUUID(), 
            ...data, 
            created_at: new Date().toISOString() 
          };
          if (!mockData[tableName]) mockData[tableName] = [];
          mockData[tableName].push(newItem);
          console.log(`🔧 Mock: Inserted into ${tableName}:`, newItem);
          return Promise.resolve({ data: newItem, error: null });
        }
      })
    }),
    
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => {
            if (!mockData[tableName]) mockData[tableName] = [];
            const index = mockData[tableName].findIndex((row: any) => row[column] === value);
            if (index > -1) {
              mockData[tableName][index] = { ...mockData[tableName][index], ...data };
              console.log(`🔧 Mock: Updated ${tableName}:`, mockData[tableName][index]);
              return Promise.resolve({ data: mockData[tableName][index], error: null });
            }
            return Promise.resolve({ data: null, error: { message: 'No data found' } });
          }
        })
      })
    }),
    
    delete: () => ({
      eq: (column: string, value: any) => {
        if (!mockData[tableName]) mockData[tableName] = [];
        const index = mockData[tableName].findIndex((row: any) => row[column] === value);
        if (index > -1) {
          mockData[tableName].splice(index, 1);
          console.log(`🔧 Mock: Deleted from ${tableName} where ${column} = ${value}`);
        }
        return Promise.resolve({ error: null });
      }
    })
  });

  return {
    auth: mockAuth,
    from: (tableName: string) => createMockTable(tableName),
    functions: {
      invoke: async (functionName: string, options?: any) => {
        console.log(`🔧 Mock: Function ${functionName} called with:`, options);
        return { 
          data: { message: `Function ${functionName} executed (simulated)` }, 
          error: null 
        };
      }
    }
  };
}
