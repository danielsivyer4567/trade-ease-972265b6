import { supabase } from './client';

/**
 * Custom authentication client that wraps Supabase auth methods
 * and handles potential JSON parsing errors
 */
class CustomAuthClient {
  /**
   * Sign in with email and password
   */
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    try {
      console.log('CustomAuthClient: Attempting to sign in with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Auth error:', error);
        return {
          data: null,
          error: {
            message: error.message,
            status: error.status || 400
          }
        };
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected auth error:', error);
      
      return {
        data: null,
        error: {
          message: error.message || 'Authentication failed',
          status: 500
        }
      };
    }
  }
  
  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { error };
    }
  }
  
  /**
   * Get the current session
   */
  async getSession() {
    return supabase.auth.getSession();
  }
  
  /**
   * Get the current user
   */
  async getUser() {
    return supabase.auth.getUser();
  }
  
  /**
   * Reset password for email
   */
  async resetPasswordForEmail(email: string, options?: { redirectTo?: string }) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, options);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { error };
    }
  }
  
  /**
   * Set up auth state change listener
   */
  onAuthStateChange(callback: any) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Export a singleton instance
export const customAuth = new CustomAuthClient(); 