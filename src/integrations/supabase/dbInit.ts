
import { supabase } from './client';

/**
 * Initialize all required tables in the database
 */
export async function initializeTables() {
  console.log('Initializing database tables...');
  
  try {
    // Define the tables that need to be created
    const requiredTables = [
      'demo_requests',
      'trade_accounts',
      'trade_watchlists',
      'trade_transactions'
    ];
    
    // Call the create-tables edge function
    const { data, error } = await supabase.functions.invoke('create-tables', {
      body: { tables: requiredTables }
    });
    
    if (error) {
      console.error('Error initializing tables:', error);
      return { success: false, error };
    }
    
    console.log('Tables initialization result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception during table initialization:', error);
    return { success: false, error };
  }
}

/**
 * Initialize backend components needed for the application
 * Currently just a wrapper for initializeTables, but can be extended
 */
export async function initializeBackend() {
  return await initializeTables();
}
