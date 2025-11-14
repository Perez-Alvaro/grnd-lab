import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Shield, ShieldCheck, ShieldOff, AlertCircle, Check, X } from 'lucide-react'

export default function MFAManagement() {
  const [mfaFactors, setMfaFactors] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmDisable, setShowConfirmDisable] = useState(false)
  const navigate = useNavigate()
  const { user, getMFAFactors, unenrollMFA } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/mz-admin-access')
      return
    }
    loadMFAStatus()
  }, [user, navigate])

  const loadMFAStatus = async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await getMFAFactors()

    if (fetchError) {
      setError('Error al cargar estado de 2FA')
      setLoading(false)
      return
    }

    if (data && data.totp) {
      setMfaFactors(data.totp)
    }

    setLoading(false)
  }

  const handleDisableMFA = async () => {
    if (mfaFactors.length === 0) return

    setActionLoading(true)
    setError('')

    const { error: unenrollError } = await unenrollMFA(mfaFactors[0].id)

    if (unenrollError) {
      setError('Error al desactivar 2FA: ' + unenrollError.message)
      setActionLoading(false)
      return
    }

    setShowConfirmDisable(false)
    setActionLoading(false)
    await loadMFAStatus()
  }

  const mfaEnabled = mfaFactors.length > 0

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#B5FF00] border-t-transparent"></div>
          <p className="mt-4 text-neutral-400">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="mb-4 text-sm text-neutral-400 transition-colors hover:text-[#B5FF00]"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">
            Autenticación de Dos Factores
          </h1>
          <p className="mt-2 text-neutral-400">
            Gestiona la seguridad de tu cuenta
          </p>
        </div>

        {/* Estado Actual */}
        <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  mfaEnabled
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {mfaEnabled ? (
                  <ShieldCheck className="h-6 w-6" />
                ) : (
                  <ShieldOff className="h-6 w-6" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mfaEnabled ? '2FA Activado' : '2FA Desactivado'}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  {mfaEnabled
                    ? 'Tu cuenta está protegida con autenticación de dos factores'
                    : 'Activa 2FA para una seguridad adicional'}
                </p>
                {mfaEnabled && mfaFactors[0] && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Configurado: {new Date(mfaFactors[0].created_at).toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>
            </div>

            {!mfaEnabled && (
              <button
                onClick={() => navigate('/admin/mfa-setup')}
                className="rounded-lg bg-[#B5FF00] px-4 py-2 font-semibold text-black transition-all hover:bg-[#a0e600]"
              >
                Activar 2FA
              </button>
            )}
          </div>
        </div>

        {/* Información */}
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">¿Qué es 2FA?</h3>
          <div className="space-y-3">
            <InfoCard
              icon={<Shield className="h-5 w-5 text-[#B5FF00]" />}
              title="Seguridad Adicional"
              description="La autenticación de dos factores agrega una capa extra de protección a tu cuenta, además de tu contraseña."
            />
            <InfoCard
              icon={<ShieldCheck className="h-5 w-5 text-[#B5FF00]" />}
              title="Códigos TOTP"
              description="Usa aplicaciones como Google Authenticator o Authy para generar códigos temporales de 6 dígitos."
            />
            <InfoCard
              icon={<Check className="h-5 w-5 text-[#B5FF00]" />}
              title="Recomendado"
              description="Activar 2FA es altamente recomendado para cuentas administrativas y proteger información sensible."
            />
          </div>
        </div>

        {/* Desactivar 2FA */}
        {mfaEnabled && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Zona de Peligro
            </h3>
            <p className="mb-4 text-sm text-neutral-400">
              Desactivar 2FA reducirá la seguridad de tu cuenta. Solo hazlo si ya no tienes acceso a tu aplicación de autenticación.
            </p>

            {!showConfirmDisable ? (
              <button
                onClick={() => setShowConfirmDisable(true)}
                className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-500/20"
              >
                Desactivar 2FA
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-400">
                    ¿Estás seguro de que quieres desactivar 2FA? Esta acción no se puede deshacer fácilmente.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDisable(false)}
                    disabled={actionLoading}
                    className="flex-1 rounded-lg border border-neutral-700 bg-transparent px-4 py-2 font-medium text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDisableMFA}
                    disabled={actionLoading}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50"
                  >
                    {actionLoading ? 'Desactivando...' : 'Confirmar Desactivación'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="flex gap-4 rounded-lg border border-neutral-800 bg-neutral-900/30 p-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm text-neutral-400">{description}</p>
      </div>
    </div>
  )
}
