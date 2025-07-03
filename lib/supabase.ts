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

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Safe Supabase client getter - create client lazily to avoid build-time errors
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please check your environment variables.')
  }
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

// Legacy export for backwards compatibility - create lazily to avoid build errors
let _supabase: ReturnType<typeof createClient> | null = null
export function getSupabase() {
  if (_supabase === null && isSupabaseConfigured()) {
    try {
      _supabase = getSupabaseClient()
    } catch {
      _supabase = null
    }
  }
  return _supabase
}

// For backwards compatibility
export const supabase = null // Will be created lazily by getSupabase()

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
    if (pingError && pingError.code !== '42883') { // 42883 = undefined_function, ignore if ping not created
      // If we got an error that is NOT function does not exist, treat as failure
      return { success: false, message: `Supabase connection error: ${pingError.message}` }
    }
    if (pingData === 'pong') {
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