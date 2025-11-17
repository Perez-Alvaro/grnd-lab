import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const UnifiedAuthContext = createContext({})

export function UnifiedAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    console.log('🚀 UnifiedAuthContext - Initializing')
    isMountedRef.current = true
    let loadingTimeout = null
    let isInitializing = false

    // Safety timeout: Si después de 10s sigue loading, forzar a false
    loadingTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        console.warn('⏱️ UnifiedAuthContext - Loading timeout reached, forcing loading=false')
        setLoading(false)
      }
    }, 10000)

    // CRITICAL FIX: Llamar getSession() explícitamente al inicializar
    // Esto dispara el evento onAuthStateChange que establecerá la sesión correctamente
    const initializeSession = async () => {
      if (isInitializing) {
        console.log('⚠️ UnifiedAuthContext - Already initializing, skipping...')
        return
      }

      isInitializing = true

      try {
        console.log('🔍 UnifiedAuthContext - Calling getSession() explicitly')
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()

        if (!isMountedRef.current) {
          console.log('⚠️ UnifiedAuthContext - Component unmounted during getSession, aborting')
          return
        }

        if (sessionError) {
          console.error('❌ UnifiedAuthContext - Error getting session:', sessionError)
          setError(sessionError)
          setLoading(false)
          return
        }

        console.log('📦 UnifiedAuthContext - Initial session:', currentSession ? 'Found' : 'None')

        // NO cargar el perfil aquí - dejar que onAuthStateChange lo haga
        // porque ese evento establece la sesión en el cliente de Supabase
        if (!currentSession?.user) {
          setLoading(false)
        }
        // Si hay sesión, onAuthStateChange se disparará y cargará el perfil
      } catch (err) {
        console.error('❌ UnifiedAuthContext - Error initializing:', err)
        if (isMountedRef.current) {
          setError(err)
          setLoading(false)
        }
      } finally {
        isInitializing = false
      }
    }

    // Inicializar sesión
    initializeSession()

    // UN SOLO listener para evitar race conditions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMountedRef.current) {
        console.log('⚠️ UnifiedAuthContext - onAuthStateChange fired but component unmounted')
        return
      }

      console.log('🔄 UnifiedAuthContext - Auth state change:', event)

      // Limpiar timeout si el evento se dispara
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
        loadingTimeout = null
      }

      setSession(currentSession)

      if (currentSession?.user) {
        await loadUserProfile(currentSession.user)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      console.log('🛑 UnifiedAuthContext - Cleanup')
      isMountedRef.current = false
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (authUser) => {
    console.log('🔍 UnifiedAuthContext - Loading profile for:', authUser?.email)
    console.log('🔍 UnifiedAuthContext - User ID:', authUser?.id)

    try {
      console.log('🔍 UnifiedAuthContext - Querying profiles table...')

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log('🔍 UnifiedAuthContext - Query completed:', { hasData: !!profileData, hasError: !!profileError })

      // Verificar si el componente sigue montado antes de continuar
      if (!isMountedRef.current) {
        console.log('⚠️ UnifiedAuthContext - Component unmounted during profile load, aborting setState')
        return
      }

      if (profileError) {
        // Si el perfil no existe (404), crear perfil de customer automáticamente
        if (profileError.code === 'PGRST116') {
          console.log('📝 UnifiedAuthContext - Profile not found, creating customer profile')
          await createCustomerProfile(authUser)
          return
        }
        throw profileError
      }

      console.log('✅ UnifiedAuthContext - Profile loaded, role:', profileData?.role)

      // Establecer user y profile sin importar el rol
      // Los hooks especializados filtrarán según el rol
      setUser(authUser)
      setProfile(profileData)
      setError(null)
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error loading profile:', err)

      // Verificar si el componente sigue montado antes de hacer setState
      if (isMountedRef.current) {
        setError(err)
        setUser(null)
        setProfile(null)
      }
    } finally {
      // Verificar si el componente sigue montado antes de hacer setState
      if (isMountedRef.current) {
        console.log('🏁 UnifiedAuthContext - Setting loading=false')
        setLoading(false)
      } else {
        console.log('⚠️ UnifiedAuthContext - Component unmounted, skipping setLoading(false)')
      }
    }
  }

  const createCustomerProfile = async (authUser) => {
    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'Usuario'

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: authUser.id,
            role: 'customer',
            full_name: fullName,
            avatar_url: authUser.user_metadata?.avatar_url || null,
          },
        ])
        .select()
        .single()

      if (error) throw error

      console.log('✅ UnifiedAuthContext - Customer profile created')
      setUser(authUser)
      setProfile(data)

      // Log signup activity
      await supabase.from('activity_logs').insert([
        {
          user_id: authUser.id,
          user_email: authUser.email,
          action: 'user_register',
          entity_type: 'user',
          entity_id: authUser.id,
          details: {
            full_name: fullName,
            provider: authUser.app_metadata?.provider || 'email',
          },
        },
      ])
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error creating profile:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ==================== AUTH METHODS ====================

  const signIn = async (email, password) => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Log login activity
      if (data.user) {
        await supabase.from('activity_logs').insert([
          {
            user_id: data.user.id,
            user_email: email,
            action: 'user_login',
            entity_type: 'user',
            entity_id: data.user.id,
            details: { method: 'email_password' },
          },
        ])
      }

      return { data, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error signing in:', err)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      // Log logout activity
      if (user) {
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            user_email: user.email,
            action: 'user_logout',
            entity_type: 'user',
            entity_id: user.id,
          },
        ])
      }

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      setUser(null)
      setProfile(null)
      setSession(null)

      return { error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error signing out:', err)
      return { error: err }
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (signUpError) throw signUpError
      return { data, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error signing up:', err)
      return { data: null, error: err }
    }
  }

  const resetPassword = async (email, redirectPath = '/client/reset-password') => {
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${redirectPath}`,
      })

      if (resetError) throw resetError

      // Log password reset request
      await supabase.from('activity_logs').insert([
        {
          user_email: email,
          action: 'password_reset',
          entity_type: 'user',
          details: { request_type: 'email_reset' },
        },
      ])

      return { error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error resetting password:', err)
      return { error: err }
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      // Log password update
      if (user) {
        await supabase.from('activity_logs').insert([
          {
            user_id: user.id,
            user_email: user.email,
            action: 'password_reset',
            entity_type: 'user',
            entity_id: user.id,
            details: { update_type: 'manual_update' },
          },
        ])
      }

      return { error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error updating password:', err)
      return { error: err }
    }
  }

  // ==================== OAUTH METHODS ====================

  const signInWithOAuth = async (provider) => {
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/client/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (oauthError) throw oauthError
      return { data, error: null }
    } catch (err) {
      console.error(`❌ UnifiedAuthContext - Error signing in with ${provider}:`, err)
      return { data: null, error: err }
    }
  }

  // ==================== MFA/2FA METHODS ====================

  const enrollMFA = async () => {
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Fitter Admin 2FA',
      })

      if (enrollError) throw enrollError
      return { data, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error enrolling MFA:', err)
      return { data: null, error: err }
    }
  }

  const verifyMFAEnrollment = async (factorId, code) => {
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      })

      if (challengeError) throw challengeError

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      })

      if (verifyError) throw verifyError
      return { data: verifyData, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error verifying MFA enrollment:', err)
      return { data: null, error: err }
    }
  }

  const verifyMFAChallenge = async (factorId, code) => {
    try {
      const { data, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
      if (challengeError) throw challengeError

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code,
      })

      if (verifyError) throw verifyError
      return { data: verifyData, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error verifying MFA challenge:', err)
      return { data: null, error: err }
    }
  }

  const unenrollMFA = async (factorId) => {
    try {
      const { data, error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId })
      if (unenrollError) throw unenrollError
      return { data, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error unenrolling MFA:', err)
      return { data: null, error: err }
    }
  }

  const getMFAFactors = async () => {
    try {
      const { data, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError
      return { data, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error getting MFA factors:', err)
      return { data: null, error: err }
    }
  }

  const getAssuranceLevel = async () => {
    try {
      const { data, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (assuranceError) throw assuranceError
      return { data, error: null }
    } catch (err) {
      console.error('❌ UnifiedAuthContext - Error getting assurance level:', err)
      return { data: null, error: err }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    signInWithOAuth,
    isAuthenticated: !!user,
    // MFA functions
    enrollMFA,
    verifyMFAEnrollment,
    verifyMFAChallenge,
    unenrollMFA,
    getMFAFactors,
    getAssuranceLevel,
  }

  return <UnifiedAuthContext.Provider value={value}>{children}</UnifiedAuthContext.Provider>
}

// ==================== SPECIALIZED HOOKS ====================

// Hook para administradores - Retorna null si no es admin
export function useAdminAuth() {
  const context = useContext(UnifiedAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within UnifiedAuthProvider')
  }

  // Filtrar: solo retornar datos si es admin
  const isAdmin = context.profile?.role === 'admin'

  return {
    ...context,
    user: isAdmin ? context.user : null,
    profile: isAdmin ? context.profile : null,
    isAuthenticated: isAdmin && !!context.user,
  }
}

// Hook para clientes - Retorna null si no es customer
export function useClientAuth() {
  const context = useContext(UnifiedAuthContext)
  if (!context) {
    throw new Error('useClientAuth must be used within UnifiedAuthProvider')
  }

  // Filtrar: solo retornar datos si es customer
  const isCustomer = context.profile?.role === 'customer'

  return {
    ...context,
    user: isCustomer ? context.user : null,
    profile: isCustomer ? context.profile : null,
    isAuthenticated: isCustomer && !!context.user,
  }
}

// Hook genérico (para uso interno o casos especiales)
export function useAuth() {
  const context = useContext(UnifiedAuthContext)
  if (!context) {
    throw new Error('useAuth must be used within UnifiedAuthProvider')
  }
  return context
}

export default UnifiedAuthProvider
