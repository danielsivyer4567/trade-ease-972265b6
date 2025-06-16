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
async function customFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof url === 'string' && url.startsWith(supabaseUrl)) {
    // Replace the Supabase URL with our local proxy
    const path = url.replace(supabaseUrl, '')
    const newUrl = `${baseUrl}${path}`
    console.log(`Proxying Supabase request: ${url} -> ${newUrl}`)
    
    // Add retry logic
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        // Make the request through our proxy
        const response = await fetch(newUrl, init);
        
        // If the response is ok, return it
        if (response.ok) {
          return response;
        }
        
        // If we get a 502 or 504 error, retry
        if (response.status === 502 || response.status === 504) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`Retrying request (${retryCount}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            continue;
          }
        }
        
        // For other errors, try to parse the error response
        try {
          const errorText = await response.text();
          console.error('Supabase proxy error response:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
        } catch (e) {
          console.error('Failed to read error response:', e);
        }
        
        // Return the error response
        return response;
      } catch (error) {
        console.error('Supabase proxy fetch error:', error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`Retrying request (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
          continue;
        }
        
        throw error;
      }
    }
    
    // If we've exhausted all retries, throw an error
    throw new Error(`Failed to fetch after ${maxRetries} retries`);
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

