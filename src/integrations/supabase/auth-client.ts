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
      
      // Use direct fetch to have more control over the response handling
      const response = await fetch(`${window.location.origin}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'X-Client-Info': 'trade-ease@1.0.0'
        },
        body: JSON.stringify({ email, password })
      });
      
      // Log the raw response for debugging
      console.log('Auth response status:', response.status);
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Auth error response:', errorText);
        
        return {
          data: null,
          error: {
            message: `Authentication failed: ${response.status} ${response.statusText}`,
            status: response.status
          }
        };
      }
      
      try {
        // Try to parse the response as JSON
        const data = await response.json();
        console.log('Auth success response:', data);
        
        // If we got here, we have valid JSON, use the standard Supabase client to set the session
        if (data && data.access_token) {
          await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token
          });
          
          // Get the user
          const { data: userData } = await supabase.auth.getUser();
          
          return {
            data: {
              user: userData?.user || null,
              session: {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                expires_in: data.expires_in,
                expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
                token_type: data.token_type || 'bearer',
                user: userData?.user || null
              }
            },
            error: null
          };
        }
        
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid response format', status: 400 }
        };
      } catch (jsonError) {
        console.error('Error parsing auth response:', jsonError);
        
        return {
          data: null,
          error: { 
            message: 'Failed to parse authentication response',
            status: 500
          }
        };
      }
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
    return supabase.auth.signOut();
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
  async resetPasswordForEmail(email: string, options?: any) {
    return supabase.auth.resetPasswordForEmail(email, options);
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