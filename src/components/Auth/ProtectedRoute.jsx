import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user, profile, loading, getAssuranceLevel, getMFAFactors } = useAuth()
  const [checking, setChecking] = useState(true)
  const [needsMFA, setNeedsMFA] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (loading) {
        setChecking(true)
        return
      }

      if (!user) {
        setChecking(false)
        return
      }

      try {
        // Verificar si tiene MFA habilitado
        const { data: factorsData } = await getMFAFactors()
        const hasMFAEnabled = factorsData?.totp && factorsData.totp.length > 0

        if (hasMFAEnabled) {
          // Si tiene MFA, verificar el nivel de assurance
          const { data: aalData } = await getAssuranceLevel()
          
          console.log('🔐 ProtectedRoute - MFA Check:', {
            hasMFA: hasMFAEnabled,
            currentAAL: aalData?.currentLevel,
            nextAAL: aalData?.nextLevel,
            path: location.pathname
          })

          // Si está en AAL1 y necesita AAL2, necesita completar MFA
          if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
            console.log('⚠️ MFA requerido pero no completado')
            setNeedsMFA(true)
          } else {
            setNeedsMFA(false)
          }
        } else {
          setNeedsMFA(false)
        }
      } catch (error) {
        console.error('❌ Error checking MFA status:', error)
      } finally {
        setChecking(false)
      }
    }

    checkMFAStatus()
  }, [user, loading, getAssuranceLevel, getMFAFactors, location.pathname])

  // Mostrar loading mientras verifica
  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#B5FF00] border-t-transparent"></div>
          <p className="mt-4 text-neutral-400">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario o no es admin, redirigir al login
  if (!user || !profile || profile.role !== 'admin') {
    console.log('🚫 No user or not admin, redirecting to login')
    return <Navigate to="/mz-admin-access" replace state={{ from: location }} />
  }

  // Si necesita MFA, redirigir al login para completar 2FA
  if (needsMFA) {
    console.log('🔐 MFA required, redirecting to login')
    return <Navigate to="/mz-admin-access" replace state={{ from: location, requiresMFA: true }} />
  }

  // Todo OK, mostrar contenido protegido
  return children
}

