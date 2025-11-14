import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useClientAuth } from '@/context/ClientAuthContext';

function ClientForgotPassword() {
  const { resetPassword } = useClientAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);
    setError('');

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message || 'Error al enviar email de recuperación');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white">Email Enviado</h2>
          <p className="mb-6 text-neutral-400">
            Revisa tu bandeja de entrada. Te hemos enviado un link para restablecer tu contraseña.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-[#B5FF00] px-6 py-3 font-semibold text-black transition-all hover:bg-[#a0e600]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="rounded-xl bg-[#B5FF00] p-3 transition-transform group-hover:scale-105">
              <Dumbbell className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Fit<span className="text-[#B5FF00]">ter</span>
            </h1>
          </Link>
          <p className="mt-4 text-neutral-400">Recupera tu contraseña</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-neutral-400">
              Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
            </p>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full rounded-lg border ${
                    error ? 'border-red-500' : 'border-neutral-700'
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
                  placeholder="tu@email.com"
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#B5FF00] py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Email de Recuperación'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientForgotPassword;
