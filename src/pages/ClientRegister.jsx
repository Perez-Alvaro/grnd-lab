import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useClientAuth } from '@/context/ClientAuthContext';

function ClientRegister() {
  const navigate = useNavigate();
  const { signUp, user } = useClientAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/client/dashboard', { replace: true });
    }
  }, [user, navigate]);

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
              disabled={loading}
              className="w-full rounded-lg bg-[#B5FF00] py-3 font-semibold text-black transition-all hover:bg-[#a0e600] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

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
