import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/context/UnifiedAuthContext'
import { TOTPVerification } from '@/components/Auth/TOTPVerification'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsMFA, setNeedsMFA] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState(null)
  const [mfaChallengeId, setMfaChallengeId] = useState(null) // Para almacenar el challenge ID
  const [currentUserData, setCurrentUserData] = useState(null) // Para almacenar datos de login temporal
  const [isLoginInProgress, setIsLoginInProgress] = useState(false) // Flag para prevenir redireccionamiento automático durante 2FA
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAdminAuth()

  // Redirigir si ya está autenticado (pero NO si estamos en el flujo de login con 2FA)
  useEffect(() => {
    if (!authLoading && !isLoginInProgress && user && profile?.role === 'admin') {
      console.log('🔐 AdminLogin - useEffect: User is authenticated, redirecting to /admin')
      navigate('/admin', { replace: true })
    }
  }, [user, profile, authLoading, navigate, isLoginInProgress])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setIsLoginInProgress(true) // Prevenir que useEffect redirija a /admin

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      setIsLoginInProgress(false)
      return
    }

    // ⚠️ IMPORTANTE: Limpiar sesión anterior antes de intentar login
    // Esto previene race conditions con sesiones guardadas en localStorage
    console.log('🔐 AdminLogin - Clearing previous session...')
    await supabase.auth.signOut()

    // Pequeño delay para asegurar que la sesión se limpió completamente
    await new Promise(resolve => setTimeout(resolve, 500))

    // Usar supabase directamente para tener control total sobre el flujo
    console.log('🔐 AdminLogin - Attempting signInWithPassword...')
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('🔐 AdminLogin - signIn result:', { hasData: !!data, hasError: !!signInError, error: signInError?.message })

    if (signInError) {
      setError(signInError.message || 'Credenciales incorrectas')
      setLoading(false)
      setIsLoginInProgress(false)
      return
    }

    if (!data?.user) {
      setError('Error al iniciar sesión. Intenta nuevamente.')
      setLoading(false)
      setIsLoginInProgress(false)
      return
    }

    // Guardar los datos del usuario temporalmente (no permitir que AuthContext lo maneje aún)
    setCurrentUserData(data.user)
    console.log('🔐 AdminLogin - User data stored temporarily:', data.user.email)

    // Verificar si el usuario es admin desde la base de datos
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profileData) {
      setError('Acceso denegado: No se encontró perfil de usuario.')
      setLoading(false)
      setIsLoginInProgress(false)
      await supabase.auth.signOut()
      return
    }

    if (profileData.role !== 'admin') {
      setError('Acceso denegado: No tienes permisos de administrador.')
      setLoading(false)
      setIsLoginInProgress(false)
      await supabase.auth.signOut()
      return
    }

    // Verificar si el usuario tiene 2FA habilitado
    // data.user.factors ya viene en la respuesta de signInWithPassword
    console.log('🔐 AdminLogin - User factors:', data.user?.factors)

    const totpFactor = data.user?.factors?.find(
      (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
    )

    console.log('🔐 AdminLogin - TOTP Factor found:', !!totpFactor)

    if (totpFactor) {
      // Usuario tiene 2FA habilitado
      // ⚠️ NO hacer signOut. Mantener la sesión semi-autenticada (aal1)
      // Simplemente mostrar pantalla de 2FA
      console.log('🔐 AdminLogin - 2FA required, creating challenge...')

      // Crear el desafío MFA
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      })

      if (challengeError) {
        console.error('🔐 AdminLogin - Challenge creation error:', challengeError)
        setError('Error al configurar 2FA. Intenta nuevamente.')
        setLoading(false)
        setIsLoginInProgress(false)
        return
      }

      console.log('🔐 AdminLogin - Challenge created:', challengeData.id)
      setMfaFactorId(totpFactor.id)
      setMfaChallengeId(challengeData.id) // Guardar challenge ID para verificación
      setNeedsMFA(true)
      setLoading(false)
    } else {
      // Usuario NO tiene 2FA, redirigir directamente
      console.log('🔐 AdminLogin - No 2FA detected, allowing useEffect to redirect to admin')
      setIsLoginInProgress(false) // Permitir que useEffect redirija a /admin
      setLoading(false)
    }
  }

  const handleMFAVerify = async (code) => {
    setError('')
    setLoading(true)

    console.log('🔐 AdminLogin - Verifying MFA code for factor:', mfaFactorId)

    if (!code || code.length !== 6) {
      setError('Ingresa un código de 6 dígitos')
      setLoading(false)
      return
    }

    // ✅ Verificar directamente con Supabase (sin crear nuevo challenge)
    // Ya tenemos una sesión semi-autenticada (aal1) y un challenge activo
    console.log('🔐 AdminLogin - Verifying TOTP code directly...')

    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: mfaChallengeId, // Usar el challenge ID que creamos antes
      code,
    })

    if (verifyError) {
      console.error('🔐 AdminLogin - MFA verification error:', verifyError)
      setError('Código incorrecto. Intenta nuevamente.')
      setLoading(false)
      return
    }

    console.log('🔐 AdminLogin - MFA verification successful! verifyData:', verifyData)

    // ✅ Si no hay error, el token ya está actualizado a aal2
    // El onAuthStateChange se dispara con MFA_CHALLENGE_VERIFIED
    // AuthContext se actualiza automáticamente

    console.log('🔐 AdminLogin - MFA verified, waiting for session update...')
    setNeedsMFA(false)
    setIsLoginInProgress(false) // Permitir que useEffect redirija a /admin
    setLoading(false)

    // Pequeño delay para asegurar que onAuthStateChange se disparó
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('🔐 AdminLogin - Now navigating to admin')
    navigate('/admin', { replace: true })
  }

  const handleMFACancel = async () => {
    console.log('🔐 AdminLogin - MFA cancelled by user')
    setNeedsMFA(false)
    setMfaFactorId(null)
    setMfaChallengeId(null)
    setPassword('')
    setIsLoginInProgress(false)
    await supabase.auth.signOut()
  }

  // Mostrar loading mientras verifica sesión existente
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#B5FF00] border-t-transparent"></div>
          <p className="mt-4 text-neutral-400">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        {!needsMFA ? (
          <>
            {/* Logo */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B5FF00]">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Fitter <span className="text-[#B5FF00]">Admin</span>
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Acceso restringido para administradores
              </p>
            </div>

            {/* Formulario */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20"
                    placeholder="admin@fitter.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 pr-12 text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-200"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                      Verificando...
                    </span>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              {/* Volver */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-neutral-400 transition-colors hover:text-[#B5FF00]"
                >
                  ← Volver al inicio
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center text-xs text-neutral-600">
              Todas las sesiones están cifradas y protegidas
            </div>
          </>
        ) : (
          /* Verificación 2FA */
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur">
            <TOTPVerification
              onVerify={handleMFAVerify}
              onCancel={handleMFACancel}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </div>
    </div>
  )
}
