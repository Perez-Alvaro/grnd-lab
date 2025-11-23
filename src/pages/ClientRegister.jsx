import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useClientAuth } from '@/context/UnifiedAuthContext';

function ClientRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signInWithOAuth, user } = useClientAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      // Si hay una compra pendiente, volver a la página principal
      const hasPendingPurchase = location.state?.pendingPurchase;
      const pendingPurchaseData = localStorage.getItem('pending_purchase');

      if (hasPendingPurchase && pendingPurchaseData) {
        navigate('/', { replace: true });
      } else {
        navigate('/client/dashboard', { replace: true });
      }
    }
  }, [user, navigate, location]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const { data, error } = await signUp(
      formData.email,
      formData.password,
      formData.fullName
    );

    if (error) {
      setErrors({ submit: error.message || 'Error al crear cuenta' });
      setLoading(false);
      return;
    }

    if (data) {
      setSuccess(true);
      setLoading(false);
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setOauthLoading(provider);
    setErrors({});

    const { error } = await signInWithOAuth(provider);

    if (error) {
      setErrors({
        submit: `Error al registrarse con ${provider}: ${error.message}`,
      });
      setOauthLoading(null);
    }
    // OAuth redirect will happen automatically
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white">¡Cuenta Creada!</h2>
          <p className="mb-4 text-neutral-400">
            Revisa tu email para confirmar tu cuenta
          </p>
          <p className="text-sm text-neutral-500">Redirigiendo al login...</p>
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
          <p className="mt-4 text-neutral-400">Crea tu cuenta</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-neutral-300">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.fullName ? 'border-red-500' : 'border-neutral-700'
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
                  placeholder="Juan Pérez"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-neutral-700'
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-300">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-neutral-700'
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-neutral-300">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-neutral-700'
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || oauthLoading}
              className="w-full rounded-lg bg-[#B5FF00] py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-800"></div>
            <span className="text-sm text-neutral-500">O</span>
            <div className="h-px flex-1 bg-neutral-800"></div>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading || oauthLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 py-3 font-medium text-white transition-all hover:bg-neutral-800 hover:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Continuar con Google</span>
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#B5FF00] transition-colors hover:text-[#a0e600]"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-400"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClientRegister;
