
import { supabase } from './client';
import { toast } from 'sonner';

export const ensureDatabaseStructure = async () => {
  try {
    // Check if tables exist and create them if not
    const { error: tablesError } = await supabase.functions.invoke('create-tables', {
      body: {
        tables: ['demo_requests', 'trade_accounts', 'trade_watchlists', 'trade_transactions']
      }
    });
    
    if (tablesError) {
      console.error('Error creating tables:', tablesError);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize database structure:', error);
    return false;
  }
};

// This function can be called on app initialization to ensure all tables exist
export const initializeBackend = async () => {
  try {
    console.log('Initializing backend database structure...');
    await ensureDatabaseStructure();
    console.log('Backend initialization complete');
    return true;
  } catch (error) {
    console.error('Backend initialization failed:', error);
    toast.error('Failed to initialize backend services. Some features may not work correctly.');
    return false;
  }
};
