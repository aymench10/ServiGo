import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
    // Check if Supabase is properly configured
    if (supabase._isMock) {
      // Supabase is not configured (mock client)
      console.log('🔧 Supabase not configured - skipping auth initialization')
      setLoading(false)
      return
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(error => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load user profile from database
  const loadUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      // If provider, load provider profile too
      if (profile.role === 'provider') {
        const { data: providerProfile } = await supabase
          .from('provider_profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        setUser({ ...profile, ...providerProfile })
      } else {
        setUser(profile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (userData) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
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

          const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, userData.profilePhoto)

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('profiles')
              .getPublicUrl(filePath)
            avatarUrl = publicUrl
          }
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError)
        }
      }

      // Create profile
      const { error: profileError } = await supabase
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

      // If provider, create provider profile
      if (userData.role === 'provider') {
        console.log('Creating provider profile for:', userId)
        
        const { data: providerData, error: providerError } = await supabase
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

  // Login function
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut()
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
