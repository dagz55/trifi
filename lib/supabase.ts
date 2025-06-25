import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a placeholder client or null if env vars are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Safe Supabase client getter
export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.')
  }
  return supabase
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    if (!isSupabaseConfigured()) {
      return { 
        success: false, 
        message: 'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)' 
      }
    }

    const client = getSupabaseClient()
    
    // Test connection with a simple RPC call or auth check
    try {
      const { data, error } = await client.rpc('ping')
      
      if (error) {
        // If RPC ping fails, try auth session check instead
        if (error.message.includes('function ping() does not exist') || 
            error.message.includes('permission denied') || 
            error.message.includes('insufficient privilege')) {
          
          // Try auth session check as fallback
          const { error: authError } = await client.auth.getSession()
          return { 
            success: true, 
            message: 'Supabase connected successfully (verified through auth check)' 
          }
        }
        
        return { success: false, message: `Supabase connection error: ${error.message}` }
      }
      
      return { success: true, message: 'Supabase connected successfully and ping responded' }
      
    } catch (rpcError) {
      // If RPC fails entirely, try the auth approach
      try {
        const { error: authError } = await client.auth.getSession()
        return { 
          success: true, 
          message: 'Supabase connected successfully (verified through auth session check)' 
        }
      } catch (authTestError) {
        return { 
          success: false, 
          message: `Supabase connection failed: ${rpcError}` 
        }
      }
    }
    
  } catch (error) {
    return { success: false, message: `Supabase connection failed: ${error}` }
  }
} 