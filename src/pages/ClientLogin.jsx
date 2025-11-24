import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useClientAuth } from '@/context/UnifiedAuthContext';

function ClientLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithOAuth, user } = useClientAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);

  useEffect(() => {
    if (user) {
      // Si hay una compra pendiente, volver a la página principal
      const hasPendingPurchase = location.state?.pendingPurchase;
      const pendingPurchaseData = localStorage.getItem('pending_purchase');

      if (hasPendingPurchase || pendingPurchaseData) {
        console.log('Redirecting to home with pending purchase');
        navigate('/', { replace: true });
      } else {
        console.log('Redirecting to dashboard');
        navigate('/client/dashboard', { replace: true });
      }
    }
  }, [user, navigate, location]);

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

    // Validation
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const { data, error } = await signIn(formData.email, formData.password);

    if (error) {
      setErrors({
        submit:
          error.message === 'Invalid login credentials'
            ? 'Email o contraseña incorrectos'
            : error.message || 'Error al iniciar sesión',
      });
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Navigate to dashboard (will be handled by useEffect)
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setOauthLoading(provider);
    setErrors({});

    const { error } = await signInWithOAuth(provider);

    if (error) {
      setErrors({
        submit: `Error al iniciar sesión con ${provider}: ${error.message}`,
      });
      setOauthLoading(null);
    }
    // OAuth redirect will happen automatically
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 text-center">
          <Link to="/" className="inline-flex items-center space-x-2 sm:space-x-3 group">
            <div className="rounded-xl bg-[#0EF2A0] p-2 sm:p-3 transition-transform group-hover:scale-105">
              <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Fit<span className="text-[#0EF2A0]">ter</span>
            </h1>
          </Link>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-neutral-400">Inicia sesión en tu cuenta</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#0EF2A0] focus:ring-2 focus:ring-[#0EF2A0]/20`}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                  Contraseña
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#0EF2A0] transition-colors hover:text-[#00C0A3]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#0EF2A0] focus:ring-2 focus:ring-[#0EF2A0]/20`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
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
              className="w-full rounded-lg bg-[#0EF2A0] py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black transition-all hover:bg-[#00C0A3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
            className="flex w-full items-center justify-center gap-2 sm:gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white transition-all hover:bg-neutral-800 hover:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
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
            <span className="text-white">Continuar con Google</span>
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#0EF2A0] transition-colors hover:text-[#00C0A3]"
              >
                Regístrate
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

export default ClientLogin;
