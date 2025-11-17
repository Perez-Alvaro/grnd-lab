import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/context/UnifiedAuthContext'

export function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAdminAuth()
  const location = useLocation()

  console.log('🔐 ProtectedRoute - Estado:', {
    hasUser: !!user,
    hasProfile: !!profile,
    role: profile?.role,
    loading
  })

  // Mostrar loading mientras verifica
  if (loading) {
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

  // Todo OK, mostrar contenido protegido
  console.log('✅ ProtectedRoute - Access granted')
  return children
}

