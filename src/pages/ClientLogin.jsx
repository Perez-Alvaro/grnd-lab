import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, AlertCircle } from 'lucide-react';
import { useClientAuth } from '@/context/ClientAuthContext';

function ClientLogin() {
  const navigate = useNavigate();
  const { signIn, user } = useClientAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/client/dashboard', { replace: true });
    }
  }, [user, navigate]);

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
          <p className="mt-4 text-neutral-400">Inicia sesión en tu cuenta</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur">
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
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
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
                  className="text-sm text-[#B5FF00] transition-colors hover:text-[#a0e600]"
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
                  } bg-neutral-800 py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-[#B5FF00] focus:ring-2 focus:ring-[#B5FF00]/20`}
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
              disabled={loading}
              className="w-full rounded-lg bg-[#B5FF00] py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#B5FF00] transition-colors hover:text-[#a0e600]"
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
