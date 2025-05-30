import { supabase } from '@/integrations/supabase/client';

/**
 * Startup service to ensure the database has the required tables and structures
 * This is run when the application starts
 */
class StartupService {
  private initialized = false;

  /**
   * Initialize the application - check for required tables and create if missing
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    
    console.log('Initializing application...');
    
    try {
      // Check if the user_profiles table exists
      await this.ensureUserProfilesTable();
      
      // Set initialized flag
      this.initialized = true;
      console.log('Application initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing application:', error);
      return false;
    }
  }

  /**
   * Ensure the user_profiles table exists and has the right structure
   */
  private async ensureUserProfilesTable(): Promise<void> {
    try {
      // Check if user_profiles table exists
      const { data: tableExists, error: tableCheckError } = await supabase
        .rpc('check_table_exists', { table_name: 'user_profiles' });
      
      if (tableCheckError) {
        console.error('Error checking for user_profiles table:', tableCheckError);
        
        // Try to create the function if it doesn't exist
        await supabase.rpc('create_check_table_exists_function');
        
        // Try again
        const { data: retryTableExists } = await supabase
          .rpc('check_table_exists', { table_name: 'user_profiles' });
          
        if (!retryTableExists) {
          // Table doesn't exist, try to create it using supabase functions
          await this.createUserProfilesTable();
        }
      } else if (!tableExists) {
        // Table doesn't exist, create it
        await this.createUserProfilesTable();
      }
      
      // Make sure all existing users have a profile
      await this.ensureUserProfiles();
    } catch (error) {
      console.error('Error ensuring user_profiles table:', error);
      throw error;
    }
  }

  /**
   * Create the user_profiles table
   */
  private async createUserProfilesTable(): Promise<void> {
    // Try to create table via RPC function - this will only work if our
    // database has the required permissions
    try {
      await supabase.rpc('create_user_profiles_table');
      console.log('Created user_profiles table via RPC');
    } catch (error) {
      console.error('Error creating user_profiles table via RPC:', error);
      
      // If that fails, we'll try a different approach or notify the user
      console.log('Please run the database migrations manually using: npm run db:setup');
    }
  }

  /**
   * Ensure all users have a profile
   */
  private async ensureUserProfiles(): Promise<void> {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting current user:', userError);
        return;
      }
      
      if (!user) {
        // No user logged in, nothing to do
        return;
      }
      
      // Check if the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error checking for user profile:', profileError);
        return;
      }
      
      // If no profile, create one
      if (!profile) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
            two_factor_enabled: false,
            created_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          console.log('Created user profile for:', user.email);
        }
      }
    } catch (error) {
      console.error('Error ensuring user profiles:', error);
    }
  }
}

export const startupService = new StartupService(); 