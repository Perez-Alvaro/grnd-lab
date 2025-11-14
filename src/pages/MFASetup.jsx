import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Shield, Check, AlertCircle, Smartphone, Copy, CheckCircle2 } from 'lucide-react'
import QRCode from 'qrcode'

export default function MFASetup() {
  const [step, setStep] = useState(1)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [factorId, setFactorId] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const { enrollMFA, verifyMFAEnrollment, user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/mz-admin-access')
    }
  }, [user, navigate])

  useEffect(() => {
    if (step === 1) {
      generateQRCode()
    }
  }, [step])

  const generateQRCode = async () => {
    setLoading(true)
    setError('')

    const { data, error: enrollError } = await enrollMFA()

    if (enrollError) {
      setError('Error al generar código QR: ' + enrollError.message)
      setLoading(false)
      return
    }

    if (data) {
      setFactorId(data.id)
      setSecret(data.totp.secret)

      // Generar QR code
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

    const { data, error: verifyError } = await verifyMFAEnrollment(
      factorId,
      verificationCode
    )

    if (verifyError) {
      setError('Código incorrecto. Verifica e intenta nuevamente.')
      setLoading(false)
      return
    }

    if (data) {
      setStep(3)
      setLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B5FF00]">
            <Shield className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Configurar Autenticación de Dos Factores
          </h1>
          <p className="mt-2 text-neutral-400">
            Agrega una capa extra de seguridad a tu cuenta
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-4">
            <StepIndicator number={1} active={step === 1} completed={step > 1} label="Escanear QR" />
            <div className="h-px w-16 bg-neutral-700" />
            <StepIndicator number={2} active={step === 2} completed={step > 2} label="Verificar" />
            <div className="h-px w-16 bg-neutral-700" />
            <StepIndicator number={3} active={step === 3} completed={step > 3} label="Listo" />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur">
          {/* Step 1: QR Code */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-bold text-white">
                  1. Escanea este código QR
                </h2>
                <p className="text-sm text-neutral-400">
                  Usa Google Authenticator, Authy o cualquier app compatible
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#B5FF00] border-t-transparent"></div>
                </div>
              ) : qrCodeUrl ? (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="rounded-2xl border border-neutral-700 bg-white p-4">
                      <img src={qrCodeUrl} alt="QR Code" className="h-64 w-64" />
                    </div>
                  </div>

                  {/* Manual Entry */}
                  <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-neutral-400">
                      <Smartphone className="h-4 w-4" />
                      <span>¿No puedes escanear? Ingresa manualmente:</span>
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

                  {error && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setStep(2)}
                    className="w-full rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600]"
                  >
                    Continuar
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-bold text-white">
                  2. Verifica el código
                </h2>
                <p className="text-sm text-neutral-400">
                  Ingresa el código de 6 dígitos de tu aplicación
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Código de verificación
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value.replace(/\D/g, ''))
                    }
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-center text-2xl font-bold tracking-widest text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-neutral-700 bg-transparent px-6 py-3 font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
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
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-10 w-10 text-green-500" />
              </div>

              <div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  ¡2FA Activado!
                </h2>
                <p className="text-neutral-400">
                  Tu cuenta ahora está protegida con autenticación de dos factores
                </p>
              </div>

              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                <p className="text-sm text-green-400">
                  A partir de ahora, necesitarás ingresar un código de tu aplicación de autenticación cada vez que inicies sesión.
                </p>
              </div>

              <button
                onClick={() => navigate('/admin')}
                className="w-full rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600]"
              >
                Ir al Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepIndicator({ number, active, completed, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-colors ${
          completed
            ? 'border-[#B5FF00] bg-[#B5FF00] text-black'
            : active
            ? 'border-[#B5FF00] text-[#B5FF00]'
            : 'border-neutral-700 text-neutral-600'
        }`}
      >
        {completed ? <Check className="h-5 w-5" /> : number}
      </div>
      <span
        className={`text-xs ${
          active || completed ? 'text-white' : 'text-neutral-600'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
