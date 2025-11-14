import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // Verificar sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        checkAdminRole(session.user)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        checkAdminRole(session.user)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminRole = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error

      // Only set user if it's an admin
      if (data?.role === 'admin') {
        setUser(authUser)
        setProfile(data)
      } else {
        // Not an admin, clear the session for this context
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error('❌ Error checking admin role:', error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/mz-admin-access/reset`,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // ========== MFA (2FA) Functions ==========

  const enrollMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Fitter Admin 2FA',
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const verifyMFAEnrollment = async (factorId, code) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId })
      if (error) throw error

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code,
      })

      if (verifyError) throw verifyError
      return { data: verifyData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const verifyMFAChallenge = async (factorId, code) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId })
      if (error) throw error

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code,
      })

      if (verifyError) throw verifyError
      return { data: verifyData, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const unenrollMFA = async (factorId) => {
    try {
      const { data, error } = await supabase.auth.mfa.unenroll({ factorId })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const getAssuranceLevel = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    resetPassword,
    isAuthenticated: !!user,
    // MFA functions
    enrollMFA,
    verifyMFAEnrollment,
    verifyMFAChallenge,
    unenrollMFA,
    getMFAFactors,
    getAssuranceLevel,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
