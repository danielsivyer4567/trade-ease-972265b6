import { createClient } from '@supabase/supabase-js'

// Ensure environment variables are available
if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Get the Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// In development, use localhost to avoid CORS issues
const isDev = import.meta.env.DEV
const baseUrl = isDev ? window.location.origin : supabaseUrl

// Create the Supabase client with appropriate configuration
export const supabase = createClient(
  // In development, we'll use the original URL for compatibility with the SDK,
  // but all requests will be intercepted and proxied through our local server
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'supabase-auth',
      debug: isDev
    },
    global: {
      headers: {
        'X-Client-Info': 'trade-ease@1.0.0'
      },
      // For development, fetch will be intercepted by our proxy
      ...(isDev && { fetch: customFetch })
    }
  }
)

// Custom fetch function that routes requests through our local proxy in development
function customFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof url === 'string' && url.startsWith(supabaseUrl)) {
    // Replace the Supabase URL with our local proxy
    const path = url.replace(supabaseUrl, '')
    const newUrl = `${baseUrl}${path}`
    console.log(`Proxying Supabase request: ${url} -> ${newUrl}`)
    
    // Make the request through our proxy
    return fetch(newUrl, init)
      .then(async (response) => {
        // Clone the response so we can inspect it without consuming it
        const clonedResponse = response.clone();
        
        // Check if response is ok
        if (!response.ok) {
          try {
            // Try to parse the error response
            const errorText = await clonedResponse.text();
            console.error('Supabase proxy error response:', {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            });
          } catch (e) {
            console.error('Failed to read error response:', e);
          }
        }
        
        // Create a new response that handles JSON parsing errors
        return new Response(
          response.body,
          {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          }
        );
      })
      .catch(error => {
        console.error('Supabase proxy fetch error:', error);
        throw error;
      });
  }
  
  // For non-Supabase URLs or non-string URLs, use the default fetch
  return fetch(url, init);
}

// Override the global Response.json method to handle invalid JSON
const originalJsonMethod = Response.prototype.json;
Response.prototype.json = function() {
  return originalJsonMethod.call(this).catch(error => {
    if (error instanceof SyntaxError) {
      console.error('JSON parse error:', error);
      // Return a valid JSON object with error information
      return { error: true, message: 'Invalid JSON response', details: error.message };
    }
    throw error;
  });
};

// Export admin client (placeholder for now)
export const supabaseAdmin = supabase

// Export demo data generator (placeholder for now)
export const generateDemoData = () => Promise.resolve([])

