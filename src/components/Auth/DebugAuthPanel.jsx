import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Bug, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react'

/**
 * Panel de depuración para autenticación
 * Solo visible en desarrollo
 * 
 * Para usar: Agregar <DebugAuthPanel /> en App.jsx (solo en dev)
 */
export function DebugAuthPanel() {
  const { user, profile, session, getAssuranceLevel, getMFAFactors } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [aalData, setAalData] = useState(null)
  const [factorsData, setFactorsData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) return null

  const refreshData = async () => {
    setRefreshing(true)
    try {
      const [aal, factors] = await Promise.all([
        getAssuranceLevel(),
        getMFAFactors()
      ])
      setAalData(aal.data)
      setFactorsData(factors.data)
    } catch (error) {
      console.error('Error refreshing debug data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (expanded && user) {
      refreshData()
    }
  }, [expanded, user])

  const clearSession = () => {
    if (confirm('¿Limpiar sesión completa y recargar?')) {
      localStorage.clear()
      sessionStorage.clear()
      document.cookie.split(";").forEach((c) => { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUCString() + ";path=/")
      })
      window.location.reload()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white shadow-lg hover:bg-purple-700 transition-colors"
          title="Debug Auth"
        >
          <Bug className="h-5 w-5" />
          <span className="text-sm font-medium">Debug Auth</span>
        </button>
      ) : (
        <div className="w-96 rounded-xl border border-purple-500/20 bg-neutral-900 p-4 shadow-2xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">Auth Debug Panel</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="rounded p-1 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 text-purple-400 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="rounded p-1 hover:bg-neutral-800 transition-colors"
                title="Minimize"
              >
                <XCircle className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 text-sm">
            {/* User Status */}
            <div className="rounded-lg bg-neutral-800/50 p-3">
              <div className="mb-2 flex items-center gap-2">
                {user ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <span className="font-medium text-white">
                  {user ? 'Autenticado' : 'No autenticado'}
                </span>
              </div>
              {user && (
                <div className="space-y-1 text-xs text-neutral-400">
                  <div>Email: {user.email}</div>
                  <div>ID: {user.id.slice(0, 8)}...</div>
                  <div>Role: {profile?.role || 'N/A'}</div>
                </div>
              )}
            </div>

            {/* AAL Status */}
            {user && aalData && (
              <div className="rounded-lg bg-neutral-800/50 p-3">
                <div className="mb-2 font-medium text-white">Assurance Level</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Current:</span>
                    <span className={`font-mono ${aalData.currentLevel === 'aal2' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {aalData.currentLevel?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Next:</span>
                    <span className="font-mono text-neutral-300">
                      {aalData.nextLevel?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Auth Time:</span>
                    <span className="font-mono text-neutral-300">
                      {aalData.currentAuthenticationMethods?.[0]?.timestamp 
                        ? new Date(aalData.currentAuthenticationMethods[0].timestamp * 1000).toLocaleTimeString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* MFA Factors */}
            {user && factorsData && (
              <div className="rounded-lg bg-neutral-800/50 p-3">
                <div className="mb-2 font-medium text-white">MFA Factors</div>
                {factorsData.totp && factorsData.totp.length > 0 ? (
                  <div className="space-y-2">
                    {factorsData.totp.map((factor, idx) => (
                      <div key={factor.id} className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">TOTP Activo</span>
                        </div>
                        <div className="text-neutral-400">
                          {factor.friendly_name || 'Sin nombre'}
                        </div>
                        <div className="font-mono text-neutral-500">
                          {factor.id.slice(0, 16)}...
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <XCircle className="h-3 w-3" />
                    <span>Sin MFA configurado</span>
                  </div>
                )}
              </div>
            )}

            {/* Session */}
            {session && (
              <div className="rounded-lg bg-neutral-800/50 p-3">
                <div className="mb-2 font-medium text-white">Session</div>
                <div className="space-y-1 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="font-mono">
                      {new Date(session.expires_at * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Token:</span>
                    <span className="font-mono">
                      {session.access_token.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={clearSession}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Limpiar Sesión</span>
            </button>

            {/* Info */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 text-xs text-blue-400">
              💡 Panel solo visible en desarrollo
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
