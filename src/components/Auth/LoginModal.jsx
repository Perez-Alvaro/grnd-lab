/**
 * src/components/Auth/LoginModal.jsx
 * Dark-themed login modal with blur backdrop, error states, loading state,
 * focus trap, and full keyboard support (Escape / Enter).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, Eye, EyeOff, Loader2, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../store/authStore.jsx';
import { useProtectedLink } from '../../lib/routeObfuscator.js';

/* ─────────────────────────────────────────────
   FOCUSABLE ELEMENTS SELECTOR (focus trap)
───────────────────────────────────────────── */
const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export default function LoginModal() {
  const { isModalOpen, isLoading, error, login, closeLoginModal, user } = useAuth();
  const navigate = useNavigate();
  const editorPath = useProtectedLink();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);

  // ── Reset form when modal opens ───────────────────────────────
  useEffect(() => {
    if (isModalOpen) {
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setFieldErrors({});
      // Focus email field after paint
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isModalOpen]);

  // ── Keyboard: Escape closes, focus trap ──────────────────────
  useEffect(() => {
    if (!isModalOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape' && !isLoading) {
        closeLoginModal();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll(FOCUSABLE)];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isLoading, closeLoginModal]);

  // ── If user logs in from another trigger while modal is open ─
  useEffect(() => {
    if (user && isModalOpen) {
      closeLoginModal();
    }
  }, [user, isModalOpen, closeLoginModal]);

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();

      // Client-side field validation
      const errors = {};
      if (!email.trim()) errors.email = 'El email es requerido';
      if (!password) errors.password = 'La contraseña es requerida';
      if (Object.keys(errors).length) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});

      const result = await login(email.trim().toLowerCase(), password);
      if (result.success) {
        navigate(editorPath);
      }
    },
    [email, password, login, navigate, editorPath]
  );

  if (!isModalOpen) return null;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[100] bg-black/60"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={!isLoading ? closeLoginModal : undefined}
        aria-hidden="true"
      />

      {/* ── Modal panel ──────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-md rounded-2xl border border-border bg-[#0E0E14] shadow-2xl shadow-black/60"
          style={{ animation: 'modalEntrance 0.2s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          {!isLoading && (
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 p-2 rounded-lg text-text-quaternary hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="p-8">
            {/* Logo + title */}
            <div className="text-center mb-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-4">
                <Zap className="h-7 w-7 text-accent" />
              </div>
              <h2
                id="login-modal-title"
                className="text-2xl font-bold text-white font-display mb-1"
              >
                Iniciar sesión
              </h2>
              <p className="text-sm text-text-secondary">
                Accedé a tu cuenta de BaseRutina
              </p>
            </div>

            {/* Global error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-text-secondary"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-quaternary" />
                  <input
                    ref={firstFocusRef}
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className={`w-full rounded-xl border bg-[#0A0A10] pl-10 pr-4 py-3 text-sm text-white placeholder:text-text-quaternary transition-colors focus:outline-none disabled:opacity-50 ${
                      fieldErrors.email
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-border focus:border-accent'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-text-secondary"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-quaternary" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={`w-full rounded-xl border bg-[#0A0A10] pl-10 pr-12 py-3 text-sm text-white placeholder:text-text-quaternary transition-colors focus:outline-none disabled:opacity-50 ${
                      fieldErrors.password
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-border focus:border-accent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-quaternary hover:text-text-secondary transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-hero-primary w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-accent text-white font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        @keyframes modalEntrance {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
