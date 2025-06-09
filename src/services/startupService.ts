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
      // Check if user profiles exist
      await this.ensureUserProfiles();
      
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
   * Ensure all users have a profile
   */
  private async ensureUserProfiles(): Promise<void> {
    try {
      // Get the current user
      const { data: authData, error: userError } = await supabase.auth.getSession();
      
      if (userError) {
        console.error('Error getting current user session:', userError);
        return;
      }
      
      const user = authData.session?.user;
      if (!user) {
        // No user logged in, nothing to do
        return;
      }

      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && (profileError as any).code !== 'PGRST116') { // PGRST116: No rows found
        console.error('Error checking for user profile:', profileError);
        return;
      }
        
      if (!profile) {
        // Create user profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
            two_factor_enabled: false,
            created_at: new Date().toISOString()
          });
            
        if (insertError) {
          if ((insertError as any).code === '42P01') {
            console.warn('User profiles table does not exist. This is expected in new environments.');
          } else {
            console.error('Error creating user profile:', insertError);
          }
        } else {
          console.log('Created user profile for:', user.email);
        }
      }
    } catch (error) {
      console.error('Error ensuring user profiles:', error);
      // Don't throw error, allow application to continue
      console.warn('Continuing despite user profile initialization error');
    }
  }
}

export const startupService = new StartupService(); 