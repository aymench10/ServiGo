/**
 * useAuth Hook
 * Secure authentication hook with user identification
 * Provides access to current user and auth methods
 */

import { useState, useEffect, useCallback } from 'react'
import { supabaseClient, getCurrentUser, getCurrentSession } from '../lib/supabase-client'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load user profile from database
   */
  const loadUserProfile = useCallback(async (userId) => {
    try {
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // If provider, load provider profile too
      if (profile.role === 'provider') {
        const { data: providerProfile } = await supabaseClient
          .from('provider_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        return { ...profile, providerProfile }
      }

      return profile
    } catch (err) {
      console.error('Error loading user profile:', err)
      throw err
    }
  }, [])

  /**
   * Initialize auth state
   */
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession }, error: sessionError } = 
          await supabaseClient.auth.getSession()

        if (sessionError) throw sessionError

        if (mounted) {
          setSession(currentSession)

          if (currentSession?.user) {
            const profile = await loadUserProfile(currentSession.user.id)
            setUser(profile)
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        if (mounted) {
          setError(err.message)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event)

        if (mounted) {
          setSession(currentSession)

          if (currentSession?.user) {
            try {
              const profile = await loadUserProfile(currentSession.user.id)
              setUser(profile)
            } catch (err) {
              console.error('Error loading profile on auth change:', err)
              setError(err.message)
            }
          } else {
            setUser(null)
          }

          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadUserProfile])

  /**
   * Sign up a new user
   */
  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) throw signUpError

      return { success: true, user: data.user, session: data.session }
    } catch (err) {
      console.error('Sign up error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      return { success: true, user: data.user, session: data.session }
    } catch (err) {
      console.error('Sign in error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Sign out current user
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: signOutError } = await supabaseClient.auth.signOut()

      if (signOutError) throw signOutError

      setUser(null)
      setSession(null)

      return { success: true }
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)

      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (resetError) throw resetError

      return { success: true }
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update password
   */
  const updatePassword = useCallback(async (newPassword) => {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabaseClient.auth.updateUser({
        password: newPassword
      })

      if (updateError) throw updateError

      return { success: true }
    } catch (err) {
      console.error('Update password error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true)
      setError(null)

      if (!user) throw new Error('No user logged in')

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (updateError) throw updateError

      // Reload user profile
      const updatedProfile = await loadUserProfile(user.id)
      setUser(updatedProfile)

      return { success: true }
    } catch (err) {
      console.error('Update profile error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user, loadUserProfile])

  /**
   * Get access token for API calls
   */
  const getAccessToken = useCallback(async () => {
    try {
      const currentSession = await getCurrentSession()
      return currentSession?.access_token || null
    } catch (err) {
      console.error('Error getting access token:', err)
      return null
    }
  }, [])

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getAccessToken,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isClient: user?.role === 'client'
  }
}

export default useAuth
