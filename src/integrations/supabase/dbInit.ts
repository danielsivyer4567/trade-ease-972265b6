
import { supabase } from './client';
import { toast } from 'sonner';

export const ensureDatabaseStructure = async () => {
  try {
    // Check if demo_requests table exists and create it if not
    const { error: demoReqError } = await supabase.functions.invoke('create-tables', {
      body: {
        tables: ['demo_requests']
      }
    });
    
    if (demoReqError) {
      console.error('Error creating demo_requests table:', demoReqError);
    }
    
    // Initialize other necessary tables as required
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
