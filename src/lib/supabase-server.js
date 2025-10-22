/**
 * Supabase Server Configuration
 * This client is for server-side operations that still respect RLS
 * Uses the anon key but can be used in server contexts
 * 
 * Note: For Vite/React apps, true "server-side" code doesn't exist
 * This is prepared for when you add a backend (Express, Node.js, etc.)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables for server client.')
}

/**
 * Create a Supabase client for server-side use
 * This still uses the anon key and respects RLS
 * @param {string} accessToken - Optional user access token for authenticated requests
 */
export const createServerClient = (accessToken = null) => {
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'X-Client-Info': 'servigo-server'
      }
    }
  }

  // If access token provided, add it to headers
  if (accessToken) {
    options.global.headers['Authorization'] = `Bearer ${accessToken}`
  }

  return createClient(supabaseUrl, supabaseAnonKey, options)
}

/**
 * Get user from access token (server-side validation)
 * @param {string} accessToken - JWT access token
 * @returns {Promise<object | null>}
 */
export const getUserFromToken = async (accessToken) => {
  if (!accessToken) return null

  try {
    const client = createServerClient(accessToken)
    const { data: { user }, error } = await client.auth.getUser()
    
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error validating token:', error)
    return null
  }
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<object | null>}
 */
export const verifyToken = async (token) => {
  if (!token) return null

  try {
    const client = createServerClient()
    const { data: { user }, error } = await client.auth.getUser(token)
    
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export default createServerClient
