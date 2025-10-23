/**
 * Authentication Helper Utilities
 * Secure utilities for auth operations and user validation
 */

import { supabaseClient } from '../lib/supabase-client'

/**
 * Validate if user is authenticated
 * @returns {Promise<boolean>}
 */
export const validateAuth = async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession()
    if (error) throw error
    return !!session
  } catch (error) {
    console.error('Auth validation error:', error)
    return false
  }
}

/**
 * Get current user with validation
 * @returns {Promise<object | null>}
 */
export const getCurrentAuthUser = async () => {
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
 * Get user profile from database
 * @param {string} userId - User ID
 * @returns {Promise<object | null>}
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Get provider profile
 * @param {string} userId - User ID
 * @returns {Promise<object | null>}
 */
export const getProviderProfile = async (userId) => {
  try {
    const { data, error } = await supabaseClient
      .from('provider_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting provider profile:', error)
    return null
  }
}

/**
 * Get complete user data (auth + profile + provider if applicable)
 * @returns {Promise<object | null>}
 */
export const getCompleteUserData = async () => {
  try {
    const authUser = await getCurrentAuthUser()
    if (!authUser) return null

    const profile = await getUserProfile(authUser.id)
    if (!profile) return authUser

    let completeData = { ...authUser, ...profile }

    // If provider, get provider profile
    if (profile.role === 'provider') {
      const providerProfile = await getProviderProfile(authUser.id)
      if (providerProfile) {
        completeData.providerProfile = providerProfile
      }
    }

    return completeData
  } catch (error) {
    console.error('Error getting complete user data:', error)
    return null
  }
}

/**
 * Check if user has specific role
 * @param {string} requiredRole - Required role
 * @returns {Promise<boolean>}
 */
export const hasRole = async (requiredRole) => {
  try {
    const user = await getCompleteUserData()
    return user?.role === requiredRole
  } catch (error) {
    console.error('Error checking role:', error)
    return false
  }
}

/**
 * Check if user is a provider
 * @returns {Promise<boolean>}
 */
export const isProvider = async () => {
  return await hasRole('provider')
}

/**
 * Check if user is a client
 * @returns {Promise<boolean>}
 */
export const isClient = async () => {
  return await hasRole('client')
}

/**
 * Require authentication - throws error if not authenticated
 * @throws {Error} If user is not authenticated
 */
export const requireAuth = async () => {
  const isAuth = await validateAuth()
  if (!isAuth) {
    throw new Error('Authentication required')
  }
}

/**
 * Require specific role - throws error if user doesn't have role
 * @param {string} requiredRole - Required role
 * @throws {Error} If user doesn't have required role
 */
export const requireRole = async (requiredRole) => {
  await requireAuth()
  const hasRequiredRole = await hasRole(requiredRole)
  if (!hasRequiredRole) {
    throw new Error(`Role '${requiredRole}' required`)
  }
}

/**
 * Get access token for API calls
 * @returns {Promise<string | null>}
 */
export const getAccessToken = async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession()
    if (error) throw error
    return session?.access_token || null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Refresh session
 * @returns {Promise<object | null>}
 */
export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.refreshSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error refreshing session:', error)
    return null
  }
}

/**
 * Sign out and clear all auth data
 * @returns {Promise<boolean>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut()
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error signing out:', error)
    return false
  }
}

/**
 * Parse JWT token (client-side only - for display purposes)
 * Note: Never trust client-side JWT parsing for security decisions
 * @param {string} token - JWT token
 * @returns {object | null}
 */
export const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  try {
    const payload = parseJWT(token)
    if (!payload || !payload.exp) return true
    
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= expirationTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

export default {
  validateAuth,
  getCurrentAuthUser,
  getUserProfile,
  getProviderProfile,
  getCompleteUserData,
  hasRole,
  isProvider,
  isClient,
  requireAuth,
  requireRole,
  getAccessToken,
  refreshSession,
  signOut,
  parseJWT,
  isTokenExpired
}
