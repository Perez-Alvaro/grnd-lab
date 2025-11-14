import React, { useState, useRef, useEffect } from 'react'
import { Shield, AlertCircle } from 'lucide-react'

export function TOTPVerification({ onVerify, onCancel, loading = false, error = '' }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  useEffect(() => {
    // Auto-focus al primer input
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    // Solo permitir números
    if (value && !/^\d+$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(0, 1)
    setCode(newCode)

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit cuando se completa el código
    if (newCode.every((digit) => digit !== '') && index === 5) {
      onVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    // Retroceder al input anterior con Backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Enter para verificar
    if (e.key === 'Enter' && code.every((digit) => digit !== '')) {
      onVerify(code.join(''))
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)

    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('')
      while (newCode.length < 6) newCode.push('')
      setCode(newCode)

      // Auto-verificar si es código completo
      if (pastedData.length === 6) {
        onVerify(pastedData)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B5FF00]/10 border border-[#B5FF00]/20">
          <Shield className="h-8 w-8 text-[#B5FF00]" />
        </div>
        <h2 className="text-2xl font-bold text-white">Verificación 2FA</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Ingresa el código de 6 dígitos de tu aplicación de autenticación
        </p>
      </div>

      {/* Código TOTP */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-14 w-12 rounded-lg border border-neutral-700 bg-neutral-800 text-center text-2xl font-bold text-white outline-none transition-all focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20 disabled:opacity-50"
            disabled={loading}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="space-y-3">
        <button
          onClick={() => onVerify(code.join(''))}
          disabled={loading || code.some((digit) => !digit)}
          className="w-full rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
              Verificando...
            </span>
          ) : (
            'Verificar Código'
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="w-full rounded-lg border border-neutral-700 bg-transparent px-6 py-3 font-medium text-neutral-300 transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>

      {/* Helper text */}
      <div className="text-center">
        <p className="text-xs text-neutral-500">
          Usa Google Authenticator, Authy o cualquier app compatible con TOTP
        </p>
      </div>
    </div>
  )
}
