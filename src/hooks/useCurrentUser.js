/**
 * useCurrentUser Hook
 * Secure hook to identify the current authenticated user
 * Validates user on every call to ensure security
 */

import { useState, useEffect, useCallback } from 'react'
import { supabaseClient } from '../lib/supabase-client'

export const useCurrentUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Securely fetch and validate current user
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get user from Supabase auth (validates JWT token)
      const { data: { user: authUser }, error: authError } = 
        await supabaseClient.auth.getUser()

      if (authError) throw authError

      if (!authUser) {
        setUser(null)
        return null
      }

      // Fetch user profile from database
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) {
        // If profile doesn't exist, return auth user only
        console.warn('Profile not found for user:', authUser.id)
        setUser(authUser)
        return authUser
      }

      // Merge auth user with profile
      const fullUser = {
        ...authUser,
        ...profile
      }

      setUser(fullUser)
      return fullUser
    } catch (err) {
      console.error('Error fetching current user:', err)
      setError(err.message)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Initialize and listen for auth changes
   */
  useEffect(() => {
    let mounted = true

    // Initial fetch
    fetchCurrentUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event)

        if (session?.user) {
          await fetchCurrentUser()
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchCurrentUser])

  /**
   * Manually refresh user data
   */
  const refresh = useCallback(async () => {
    return await fetchCurrentUser()
  }, [fetchCurrentUser])

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((role) => {
    return user?.role === role
  }, [user])

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role)
  }, [user])

  /**
   * Get user's access token
   */
  const getToken = useCallback(async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      return session?.access_token || null
    } catch (err) {
      console.error('Error getting token:', err)
      return null
    }
  }, [])

  return {
    user,
    loading,
    error,
    refresh,
    hasRole,
    hasAnyRole,
    getToken,
    isAuthenticated: !!user,
    userId: user?.id || null,
    userEmail: user?.email || null,
    userRole: user?.role || null
  }
}

export default useCurrentUser
