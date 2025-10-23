/**
 * Supabase Client Configuration
 * This is the standard client for use in browser/client-side code
 * Uses the anon key which respects Row Level Security (RLS) policies
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client with auth persistence
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'servigo-auth-token',
    flowType: 'pkce' // Use PKCE flow for enhanced security
  },
  global: {
    headers: {
      'X-Client-Info': 'servigo-web-app'
    }
  }
})

/**
 * Get the current authenticated user
 * @returns {Promise<{user: object | null, session: object | null}>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get the current session
 * @returns {Promise<{session: object | null}>}
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting current session:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
  const session = await getCurrentSession()
  return !!session
}

export default supabaseClient
