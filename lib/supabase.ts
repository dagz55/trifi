import { createClient } from '@supabase/supabase-js'

// NEW: Utility to ensure we pass a clean base URL (no trailing slashes or /rest/v1) to Supabase
function sanitizeSupabaseUrl(url?: string) {
  if (!url) return url
  // Trim whitespace
  let clean = url.trim()
  // Remove trailing slashes
  clean = clean.replace(/\/+$/, "")
  // Remove accidental /rest/v1 suffix which would break the generated paths
  clean = clean.replace(/\/rest\/v1$/i, "")
  return clean
}

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = sanitizeSupabaseUrl(rawSupabaseUrl)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Singleton instance for the client
let _clientInstance: any = null

// Safe Supabase client getter - create client lazily to avoid build-time errors
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please check your environment variables.')
  }
  if (!_clientInstance) {
    _clientInstance = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return _clientInstance
}

// Client component client - returns singleton
export function createSupabaseClient() {
  return getSupabaseClient()
}

// Server component client - returns singleton
export function createSupabaseServerClient() {
  return getSupabaseClient()
}

// Singleton instance for admin client
let _adminInstance: any = null

// Admin client with service role key (for server-side operations)
export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase admin client is not configured. Please check SUPABASE_SERVICE_ROLE_KEY environment variable.')
  }
  if (!_adminInstance) {
    _adminInstance = createClient(supabaseUrl, supabaseServiceRoleKey)
  }
  return _adminInstance
}

// Legacy export for backwards compatibility - uses singleton
export function getSupabase() {
  if (isSupabaseConfigured()) {
    try {
      return getSupabaseClient()
    } catch {
      return null
    }
  }
  return null
}

// For backwards compatibility
export const supabase = null // Will be created lazily by getSupabase()

// Auth utilities
export const authHelpers = {
  async signInWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient()
    return await supabase.auth.signInWithPassword({ email, password })
  },

  async signUpWithEmail(email: string, password: string) {
    const supabase = getSupabaseClient()
    return await supabase.auth.signUp({ email, password })
  },

  async signOut() {
    const supabase = getSupabaseClient()
    return await supabase.auth.signOut()
  },

  async getSession() {
    const supabase = getSupabaseClient()
    return await supabase.auth.getSession()
  },

  async getUser() {
    const supabase = getSupabaseClient()
    return await supabase.auth.getUser()
  },

  async resetPassword(email: string) {
    const supabase = getSupabaseClient()
    return await supabase.auth.resetPasswordForEmail(email)
  }
}

// IMPROVED test connection: try the lightweight `ping` RPC first (if present) then fallback to auth check
export async function testSupabaseConnection() {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)',
      }
    }

    const client = getSupabaseClient()

    // Attempt to call a lightweight ping RPC if it exists
    const { data: pingData, error: pingError } = await client.rpc('ping')
    if (pingError) {
      // Check if the error indicates the function doesn't exist
      const functionNotFoundCodes = ['42883', 'PGRST202']
      const isUndefinedFunction = functionNotFoundCodes.includes(pingError.code) || 
                                 pingError.message.includes('function public.ping') ||
                                 pingError.message.includes('schema cache')
      
      if (!isUndefinedFunction) {
        // If we got an error that is NOT function does not exist, treat as failure
        return { success: false, message: `Supabase connection error: ${pingError.message}` }
      }
      // Function doesn't exist, continue to fallback
    } else if (pingData === 'pong') {
      return { success: true, message: 'Supabase connected successfully (ping)' }
    }

    // Fallback – test auth session which is also lightweight and exists by default
    const { error } = await client.auth.getSession()
    if (error) {
      if (error.message.includes('Failed to fetch')) {
        return { success: false, message: 'Supabase connection error: Unable to reach the Supabase server. Check your URL and network connection.' }
      }
      // Other auth errors – connection likely ok
    }

    return { success: true, message: 'Supabase connected successfully (verified through auth check)' }

  } catch (error: any) {
    return { success: false, message: `Supabase connection failed: ${error.message}` }
  }
} 