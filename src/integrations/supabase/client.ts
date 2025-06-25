import { createClient } from '@supabase/supabase-js'

<<<<<<< HEAD
// @ts-ignore
import nodeFetch, { Headers as NodeFetchHeaders } from '@supabase/node-fetch'

type Fetch = typeof fetch

const resolveFetch = (customFetch?: Fetch): Fetch => {
  let _fetch: Fetch
  if (customFetch) {
    _fetch = customFetch
  } else if (typeof fetch === 'undefined') {
    _fetch = nodeFetch as unknown as Fetch
  } else {
    _fetch = fetch
  }
  return (...args: Parameters<Fetch>) => _fetch(...args)
}

const resolveHeadersConstructor = () => {
  if (typeof Headers === 'undefined') {
    return NodeFetchHeaders
  }
  return Headers
}

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

// Create a custom fetch function that ensures proper headers
const customFetch: Fetch = async (input, init) => {
  const fetch = resolveFetch()
  const HeadersConstructor = resolveHeadersConstructor()
  
  let headers = new HeadersConstructor(init?.headers)

  // Always ensure apikey header is set
  if (!headers.has('apikey')) {
    headers.set('apikey', supabaseAnonKey)
  }

  // Add Authorization header if not present
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${supabaseAnonKey}`)
  }

  return fetch(input, { ...init, headers })
}

// Create the Supabase client with custom fetch
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'supabase-auth',
    debug: import.meta.env.DEV
  },
  global: {
    headers: {
      'X-Client-Info': 'trade-ease@1.0.0'
    },
    fetch: customFetch
  }
=======
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

// Create the Supabase client with appropriate configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'supabase-auth',
    debug: import.meta.env.DEV
  },
  global: {
    headers: {
      'X-Client-Info': 'trade-ease@1.0.0'
    }
  }
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
})

// Export admin client (placeholder for now)
export const supabaseAdmin = supabase

// Export demo data generator (placeholder for now)
export const generateDemoData = () => Promise.resolve([])

