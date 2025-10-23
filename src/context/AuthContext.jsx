import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabaseClient } from '../lib/supabase-client'
import { supabase } from '../lib/supabase' // Keep for backward compatibility

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user session on mount
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        // Check if Supabase is properly configured
        if (supabase._isMock) {
          console.log('🔧 Supabase not configured - skipping auth initialization')
          if (mounted) setLoading(false)
          return
        }

        // Get current session with secure client
        const { data: { session }, error } = await supabaseClient.auth.getSession()
        
        if (error) throw error

        if (session?.user && mounted) {
          await loadUserProfile(session.user.id)
        } else if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes with secure client
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (!mounted) return

        if (session?.user) {
          await loadUserProfile(session.user.id)
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
  }, [])

  // Load user profile from database with secure client
  const loadUserProfile = async (userId) => {
    console.log('👤 [START] Loading user profile for:', userId)
    
    try {
      console.log('✅ [STEP 1] Skipping auth verification, loading profile directly...')
      console.log('🔗 [STEP 2] Supabase client ready, creating query...')
      
      // Add timeout to profile query
      console.log('📝 [STEP 3] Building profile query for userId:', userId)
      
      const profilePromise = supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle instead of single to avoid error if not found

      console.log('⏱️ [STEP 4] Setting up 10-second timeout...')
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.error('⏰ TIMEOUT! Profile query took too long')
          reject(new Error('Profile query timeout after 10 seconds'))
        }, 10000)
      )

      console.log('🔍 [STEP 5] Executing query with race condition...')
      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise])
      console.log('✅ [STEP 6] Query completed! Result:', { profile, error })

      if (error) {
        console.error('❌ [ERROR] Profile loading error:', error)
        throw error
      }

      if (!profile) {
        console.error('❌ [ERROR] Profile not found in database for user:', userId)
        throw new Error('Profile not found. Please contact support.')
      }

      console.log('✅ [STEP 7] Profile loaded successfully:', profile)

      // If provider, load provider profile too
      if (profile.role === 'provider') {
        console.log('👨‍💼 Loading provider profile...')
        const { data: providerProfile, error: providerError } = await supabaseClient
          .from('provider_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        if (providerError) {
          console.warn('⚠️ Provider profile error:', providerError.message)
          setUser({ ...profile, providerProfile: null })
        } else if (!providerProfile) {
          console.warn('⚠️ Provider profile not found - user should visit /fix-profile')
          setUser({ ...profile, providerProfile: null })
        } else {
          console.log('✅ Provider profile loaded:', providerProfile)
          setUser({ ...profile, providerProfile })
        }
      } else {
        setUser(profile)
      }
      
      console.log('✅ User state updated successfully')
    } catch (error) {
      console.error('❌ Error loading profile:', error)
      console.error('❌ Error details:', error.message, error.code)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Signup function with enhanced security
  const signup = async (userData) => {
    try {
      // Create auth user with secure client
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: userData.name,
            role: userData.role
          }
        }
      })

      if (authError) throw authError

      const userId = authData.user.id

      // Upload profile photo if provided
      let avatarUrl = null
      if (userData.profilePhoto) {
        try {
          const fileExt = userData.profilePhoto.name.split('.').pop()
          const fileName = `${userId}-${Date.now()}.${fileExt}`
          const filePath = `avatars/${fileName}`

          const { error: uploadError } = await supabaseClient.storage
            .from('profiles')
            .upload(filePath, userData.profilePhoto)

          if (!uploadError) {
            const { data: { publicUrl } } = supabaseClient.storage
              .from('profiles')
              .getPublicUrl(filePath)
            avatarUrl = publicUrl
          }
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError)
        }
      }

      // Create profile with secure client
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.name,
          phone: userData.phone,
          role: userData.role,
          avatar_url: avatarUrl
        })

      if (profileError) throw profileError

      // If provider, create provider profile with secure client
      if (userData.role === 'provider') {
        console.log('Creating provider profile for:', userId)
        
        const { data: providerData, error: providerError } = await supabaseClient
          .from('provider_profiles')
          .insert({
            user_id: userId,
            business_name: userData.businessName || userData.name,
            service_category: userData.serviceCategory || 'Autre',
            location: userData.location || 'Tunis',
            description: userData.description || 'Services professionnels'
          })
          .select()

        if (providerError) {
          console.error('Provider profile creation error:', providerError)
          // Don't throw - continue anyway, user can fix later
          console.warn('Provider profile not created, but continuing...')
        } else {
          console.log('Provider profile created successfully:', providerData)
        }
      }

      // Load the complete profile
      await loadUserProfile(userId)

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  // Login function with secure client
  const login = async (email, password) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      await loadUserProfile(data.user.id)

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  // Logout function with secure client
  const logout = async () => {
    try {
      await supabaseClient.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check if user is a service provider
  const isProvider = () => {
    return user?.role === 'provider'
  }

  // Check if user is a client
  const isClient = () => {
    return user?.role === 'client'
  }

  const value = {
    user,
    login,
    signup,
    logout,
    isProvider,
    isClient,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
