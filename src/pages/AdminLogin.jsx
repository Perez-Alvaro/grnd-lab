import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { TOTPVerification } from '@/components/Auth/TOTPVerification'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsMFA, setNeedsMFA] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, user, getMFAFactors, verifyMFAChallenge, getAssuranceLevel, loading: authLoading } = useAuth()

  // Verificar si ya hay una sesión activa y su estado de MFA
  useEffect(() => {
    const checkExistingSession = async () => {
      console.log('🔍 AdminLogin - Checking existing session:', { 
        user: !!user, 
        authLoading,
        needsMFA,
        requiresMFAFromState: location.state?.requiresMFA
      })

      if (authLoading) {
        return // Esperar a que AuthContext termine de cargar
      }

      if (!user) {
        // No hay sesión, mostrar formulario de login
        setCheckingSession(false)
        setNeedsMFA(false)
        return
      }

      try {
        // Hay usuario, verificar si necesita MFA
        const { data: factorsData } = await getMFAFactors()
        const hasMFAEnabled = factorsData?.totp && factorsData.totp.length > 0

        if (!hasMFAEnabled) {
          // Sin MFA, redirigir directamente al admin
          console.log('✅ Usuario sin MFA, redirigiendo...')
          navigate('/admin', { replace: true })
          return
        }

        // Tiene MFA, verificar nivel de assurance
        const { data: aalData } = await getAssuranceLevel()

        console.log('🔐 Session AAL Status:', {
          currentAAL: aalData?.currentLevel,
          nextAAL: aalData?.nextLevel,
          hasMFA: hasMFAEnabled
        })

        if (aalData?.currentLevel === 'aal2') {
          // Ya completó 2FA, redirigir al admin
          console.log('✅ AAL2 activo, redirigiendo al dashboard...')
          navigate('/admin', { replace: true })
        } else if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
          // Necesita completar 2FA
          console.log('⚠️ Requiere 2FA, mostrando pantalla de verificación')
          setMfaFactorId(factorsData.totp[0].id)
          setNeedsMFA(true)
        }
      } catch (error) {
        console.error('❌ Error checking session:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkExistingSession()
  }, [user, authLoading, navigate, getAssuranceLevel, getMFAFactors, location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    const { data, error: signInError } = await signIn(email, password)

    console.log('📧 Login result:', { data, error: signInError })

    if (signInError) {
      setError(signInError.message || 'Credenciales incorrectas')
      setLoading(false)
      return
    }

    // Verificar el nivel de assurance (AAL)
    const { data: assuranceData, error: aalError } = await getAssuranceLevel()

    console.log('🔐 Assurance Level:', { assuranceData, aalError })

    // Verificar factores de MFA
    const { data: factorsData, error: factorsError } = await getMFAFactors()
    console.log('🔑 MFA Factors:', { factorsData, factorsError })

    // Verificar si el usuario tiene factores TOTP (2FA) activos
    const hasActiveMFA = factorsData?.totp && factorsData.totp.length > 0
    const needsAAL2 = assuranceData?.currentLevel === 'aal1' && assuranceData?.nextLevel === 'aal2'

    console.log('🎯 Decision:', {
      hasActiveMFA,
      needsAAL2,
      currentAAL: assuranceData?.currentLevel,
      nextAAL: assuranceData?.nextLevel
    })

    // Si el usuario tiene 2FA habilitado Y el nivel de assurance requiere AAL2
    if (hasActiveMFA && needsAAL2) {
      console.log('✅ 2FA detectado, mostrando pantalla de verificación')
      setMfaFactorId(factorsData.totp[0].id)
      setNeedsMFA(true)
      setLoading(false)
    } else if (data?.user) {
      // No tiene 2FA, redirigir directamente
      console.log('ℹ️ Sin 2FA, redirigiendo a /admin')
      navigate('/admin', { replace: true })
    } else {
      setLoading(false)
    }
  }

  const handleMFAVerify = async (code) => {
    setError('')
    setLoading(true)

    if (!code || code.length !== 6) {
      setError('Ingresa un código de 6 dígitos')
      setLoading(false)
      return
    }

    const { data, error: verifyError } = await verifyMFAChallenge(mfaFactorId, code)

    if (verifyError) {
      console.error('❌ Error al verificar 2FA:', verifyError)
      setError('Código incorrecto. Intenta nuevamente.')
      setLoading(false)
      return
    }

    console.log('✅ 2FA verificado correctamente:', data)

    // Verificar que el nivel de assurance subió a AAL2
    const { data: assuranceData } = await getAssuranceLevel()
    console.log('🔐 Nuevo Assurance Level:', assuranceData)

    if (assuranceData?.currentLevel === 'aal2') {
      console.log('🎯 AAL2 alcanzado, redirigiendo...')
      setNeedsMFA(false)
      navigate('/admin', { replace: true })
    } else {
      setError('Error al completar autenticación. Intenta nuevamente.')
      setLoading(false)
    }
  }

  const handleMFACancel = () => {
    setNeedsMFA(false)
    setMfaFactorId(null)
    setPassword('')
  }

  // Mostrar loading mientras verifica sesión existente
  if (checkingSession || authLoading) {
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
