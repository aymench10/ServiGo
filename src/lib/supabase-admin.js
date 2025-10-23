/**
 * Supabase Admin Configuration
 * This client uses the service role key and BYPASSES Row Level Security
 * 
 * ⚠️ SECURITY WARNING ⚠️
 * - NEVER use this client in client-side code
 * - NEVER expose the service role key in your frontend
 * - Only use this in secure server-side operations
 * - This key has full database access and bypasses all RLS policies
 * 
 * This file is prepared for when you add a backend server.
 * For now, it will not work in the browser as the service role key
 * should never be exposed to the client.
 */

import { createClient } from '@supabase/supabase-js'

// Note: In a real app, this would come from server-side environment variables
// For Vite, this won't work as intended since it's client-side
// You'll need to move this to your backend when you create one
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Create admin client (server-side only!)
 * This should only be called from secure server environments
 */
export const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    console.error('⚠️ SECURITY ERROR: Admin client should never be used in browser!')
    throw new Error('Admin client cannot be used in browser environment')
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': 'servigo-admin'
      }
    }
  })
}

/**
 * Admin operations - these bypass RLS and should be used with extreme caution
 */

/**
 * Create a user (admin operation)
 * @param {object} userData - User data including email, password, metadata
 */
export const adminCreateUser = async (userData) => {
  const adminClient = createAdminClient()
  
  try {
    const { data, error } = await adminClient.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: userData.metadata || {}
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Admin create user error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a user (admin operation)
 * @param {string} userId - User ID to delete
 */
export const adminDeleteUser = async (userId) => {
  const adminClient = createAdminClient()
  
  try {
    const { error } = await adminClient.auth.admin.deleteUser(userId)
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Admin delete user error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update user metadata (admin operation)
 * @param {string} userId - User ID
 * @param {object} metadata - Metadata to update
 */
export const adminUpdateUserMetadata = async (userId, metadata) => {
  const adminClient = createAdminClient()
  
  try {
    const { data, error } = await adminClient.auth.admin.updateUserById(
      userId,
      { user_metadata: metadata }
    )

    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    console.error('Admin update user metadata error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * List all users (admin operation)
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 */
export const adminListUsers = async (page = 1, perPage = 50) => {
  const adminClient = createAdminClient()
  
  try {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage
    })

    if (error) throw error
    return { success: true, users: data.users }
  } catch (error) {
    console.error('Admin list users error:', error)
    return { success: false, error: error.message }
  }
}

// Note: This file should be moved to your backend server code
// and the service role key should only be stored in server environment variables
export default createAdminClient
