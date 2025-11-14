import React, { useState, useEffect } from 'react'
import { Shield, ShieldCheck, ShieldOff, Settings, X, Smartphone, Copy, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import QRCode from 'qrcode'

export default function SecuritySection() {
  const [showModal, setShowModal] = useState(false)
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { getMFAFactors } = useAuth()

  useEffect(() => {
    checkMFAStatus()
  }, [])

  const checkMFAStatus = async () => {
    setLoading(true)
    const { data } = await getMFAFactors()
    setMfaEnabled(data?.totp && data.totp.length > 0)
    setLoading(false)
  }

  const handleStatusChange = async () => {
    await checkMFAStatus()
  }

  return (
    <>
      <section id="security-section" className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors ${
                mfaEnabled
                  ? 'bg-[#B5FF00]/10 text-[#B5FF00]'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {loading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : mfaEnabled ? (
                <ShieldCheck className="h-7 w-7" />
              ) : (
                <ShieldOff className="h-7 w-7" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Autenticación de Dos Factores (2FA)
              </h3>
              <p className="mt-1 text-sm text-neutral-400">
                {loading
                  ? 'Verificando estado...'
                  : mfaEnabled
                  ? '✓ Tu cuenta está protegida con 2FA'
                  : 'Protege tu cuenta con una capa adicional de seguridad'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-neutral-800 px-5 py-2.5 font-semibold text-white transition-all hover:bg-neutral-700 disabled:opacity-50"
          >
            <Settings className="h-4 w-4" />
            <span>Configurar</span>
          </button>
        </div>
      </section>

      {showModal && (
        <MFAModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mfaEnabled={mfaEnabled}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  )
}

export function MFAModal({ isOpen, onClose, mfaEnabled, onStatusChange }) {
  const [step, setStep] = useState(mfaEnabled ? 'manage' : 'setup')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [factorId, setFactorId] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showConfirmDisable, setShowConfirmDisable] = useState(false)

  const { enrollMFA, verifyMFAEnrollment, unenrollMFA, getMFAFactors } = useAuth()

  useEffect(() => {
    if (step === 'setup' && !mfaEnabled) {
      generateQRCode()
    }
  }, [step, mfaEnabled])

  const generateQRCode = async () => {
    setLoading(true)
    setError('')

    const { data, error: enrollError } = await enrollMFA()

    if (enrollError) {
      setError('Error al generar código QR')
      setLoading(false)
      return
    }

    if (data) {
      setFactorId(data.id)
      setSecret(data.totp.secret)

      try {
        const url = await QRCode.toDataURL(data.totp.uri)
        setQrCodeUrl(url)
      } catch (err) {
        setError('Error al generar código QR')
      }
    }

    setLoading(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Ingresa un código de 6 dígitos')
      setLoading(false)
      return
    }

    const { data, error: verifyError } = await verifyMFAEnrollment(factorId, verificationCode)

    if (verifyError) {
      setError('Código incorrecto. Verifica e intenta nuevamente.')
      setLoading(false)
      return
    }

    if (data) {
      setStep('success')
      onStatusChange()
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    setLoading(true)
    setError('')

    const { data: factors } = await getMFAFactors()
    if (!factors?.totp || factors.totp.length === 0) {
      setError('No hay 2FA configurado')
      setLoading(false)
      return
    }

    const { error: unenrollError } = await unenrollMFA(factors.totp[0].id)

    if (unenrollError) {
      setError('Error al desactivar 2FA')
      setLoading(false)
      return
    }

    onStatusChange()
    onClose()
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#B5FF00]/10">
            <Shield className="h-6 w-6 text-[#B5FF00]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Autenticación de Dos Factores
            </h2>
            <p className="text-sm text-neutral-400">
              {mfaEnabled ? 'Gestiona tu seguridad' : 'Protege tu cuenta'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Manage (when already enabled) */}
          {step === 'manage' && mfaEnabled && (
            <div className="space-y-6">
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-400">2FA Activado</p>
                    <p className="mt-1 text-sm text-green-400/80">
                      Tu cuenta está protegida con autenticación de dos factores
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-white">Información</h3>
                <div className="space-y-3 text-sm text-neutral-300">
                  <p>• Los códigos se generan en tu aplicación de autenticación</p>
                  <p>• Cada código expira en 30 segundos</p>
                  <p>• Necesitarás un código cada vez que inicies sesión</p>
                </div>
              </div>

              {!showConfirmDisable ? (
                <button
                  onClick={() => setShowConfirmDisable(true)}
                  className="w-full rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                >
                  Desactivar 2FA
                </button>
              ) : (
                <div className="space-y-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-400">
                      ¿Estás seguro? Esto reducirá la seguridad de tu cuenta.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmDisable(false)}
                      disabled={loading}
                      className="flex-1 rounded-lg border border-neutral-700 px-4 py-2 font-medium text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDisable}
                      disabled={loading}
                      className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50"
                    >
                      {loading ? 'Desactivando...' : 'Confirmar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Setup (QR Code) */}
          {step === 'setup' && !mfaEnabled && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-bold text-white">
                  Escanea el código QR
                </h3>
                <p className="text-sm text-neutral-400">
                  Usa Google Authenticator, Authy o similar
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#B5FF00] border-t-transparent" />
                </div>
              ) : qrCodeUrl ? (
                <div className="space-y-4">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="rounded-2xl border border-neutral-700 bg-white p-4">
                      <img src={qrCodeUrl} alt="QR Code" className="h-56 w-56" />
                    </div>
                  </div>

                  {/* Manual Entry */}
                  <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                      <Smartphone className="h-4 w-4" />
                      <span>Código manual:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-neutral-900 px-3 py-2 font-mono text-sm text-[#B5FF00]">
                        {secret}
                      </code>
                      <button
                        onClick={copySecret}
                        className="rounded-lg bg-neutral-700 p-2 transition-colors hover:bg-neutral-600"
                      >
                        {copied ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-neutral-300" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('verify')}
                    className="w-full rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600]"
                  >
                    Continuar
                  </button>
                </div>
              ) : null}

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verify */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-bold text-white">
                  Verifica el código
                </h3>
                <p className="text-sm text-neutral-400">
                  Ingresa el código de 6 dígitos de tu app
                </p>
              </div>

              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-center text-2xl font-bold tracking-widest text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('setup')}
                  className="flex-1 rounded-lg border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </form>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <ShieldCheck className="h-10 w-10 text-green-500" />
              </div>

              <div>
                <h3 className="mb-2 text-2xl font-bold text-white">
                  ¡2FA Activado!
                </h3>
                <p className="text-neutral-400">
                  Tu cuenta ahora está protegida con autenticación de dos factores
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600]"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
