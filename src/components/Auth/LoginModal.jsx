/**
 * src/components/Auth/LoginModal.jsx
 * Modal de autenticación con 3 modos: login / signup / reset.
 * Backdrop con blur, estados de error/carga, focus trap y soporte de teclado.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconX, IconLock, IconMail, IconUser, IconEye, IconEyeOff, IconLoader2, IconBolt, IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';
import { useAuth } from '../../store/authStore.jsx';
import { acceptTerms } from '../../lib/terms.js';
import TermsModal from '../Legal/TermsModal.jsx';
import PrivacyModal from '../Legal/PrivacyModal.jsx';

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

const COPY = {
  login: { title: 'Iniciar sesión', subtitle: 'Accedé a tu cuenta de Mock', cta: 'Ingresar' },
  signup: { title: 'Crear cuenta', subtitle: 'Empezá a crear rutinas en minutos', cta: 'Crear cuenta' },
  reset: { title: 'Recuperar contraseña', subtitle: 'Te enviamos un enlace por email', cta: 'Enviar enlace' },
};

export default function LoginModal() {
  const {
    isModalOpen, authModalMode, setAuthModalMode, isLoading, error,
    login, signup, resetPassword, closeLoginModal, user,
  } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState(null); // mensaje de éxito (confirmá email / revisá tu correo)
  const [acceptedTerms, setAcceptedTerms] = useState(false); // sin marcar por defecto: el consentimiento tiene que ser un acto del usuario
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);

  // Sincroniza el modo inicial que pidió quien abrió el modal.
  useEffect(() => {
    if (isModalOpen) {
      setMode(authModalMode || 'login');
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setFieldErrors({});
      setNotice(null);
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
  }, [isModalOpen, authModalMode]);

  // Escape cierra + focus trap
  useEffect(() => {
    if (!isModalOpen) return;
    function handleKeyDown(e) {
      if (termsOpen || privacyOpen) return;
      if (e.key === 'Escape' && !isLoading) return closeLoginModal();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = [...modalRef.current.querySelectorAll(FOCUSABLE)];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isLoading, closeLoginModal, termsOpen, privacyOpen]);

  useEffect(() => {
    if (user && isModalOpen) closeLoginModal();
  }, [user, isModalOpen, closeLoginModal]);

  const switchMode = (next) => {
    setMode(next);
    setAuthModalMode(next);
    setFieldErrors({});
    setNotice(null);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      const errors = {};
      if (mode === 'signup' && !name.trim()) errors.name = 'El nombre es requerido';
      if (!email.trim()) errors.email = 'El email es requerido';
      if (mode !== 'reset' && !password) errors.password = 'La contraseña es requerida';
      if (mode === 'signup' && password && password.length < 6)
        errors.password = 'Mínimo 6 caracteres';
      // Consentimiento explícito: sin esto no hay alta.
      if (mode === 'signup' && !acceptedTerms)
        errors.terms = 'Tenés que aceptar los términos y condiciones para crear la cuenta.';
      if (Object.keys(errors).length) return setFieldErrors(errors);
      setFieldErrors({});

      const cleanEmail = email.trim().toLowerCase();

      if (mode === 'login') {
        const result = await login(cleanEmail, password);
        if (result.success) {
          navigate(result.user?.role === 'admin' ? '/admin' : '/dashboard');
        }
      } else if (mode === 'signup') {
        const result = await signup(name.trim(), cleanEmail, password);
        // Queda registrado qué versión aceptó y cuándo. Si falla (p. ej. la
        // sesión todavía no está lista por confirmación por email), la
        // compuerta TermsGate se lo vuelve a pedir al entrar.
        if (result.success) {
          try { await acceptTerms(); } catch { /* lo resuelve TermsGate */ }
        }
        if (result.success && result.needsConfirmation) {
          setNotice('Te enviamos un email para confirmar tu cuenta. Revisá tu bandeja.');
        } else if (result.success) {
          navigate('/dashboard');
        }
      } else if (mode === 'reset') {
        const result = await resetPassword(cleanEmail);
        if (result.success) {
          setNotice('Si el email existe, te enviamos un enlace para restablecer la contraseña.');
        }
      }
    },
    [mode, name, email, password, acceptedTerms, login, signup, resetPassword, navigate]
  );

  if (!isModalOpen) return null;

  const copy = COPY[mode];

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={!isLoading ? closeLoginModal : undefined}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-md rounded-2xl border border-border bg-primary-surface shadow-2xl shadow-black/60"
          style={{ animation: 'modalEntrance 0.2s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isLoading && (
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 p-2 rounded-lg text-text-quaternary hover:text-text-primary hover:bg-text-primary/5 transition-colors"
              aria-label="Cerrar"
            >
              <IconX stroke={1.75} className="h-4 w-4" />
            </button>
          )}

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img
                  src="/mz-logo-mark.PNG"
                  alt="Mock"
                  className="h-11 w-auto object-contain mix-blend-multiply"
                />
              </div>
              <h2 id="login-modal-title" className="text-2xl font-bold text-text-primary font-display mb-1">
                {copy.title}
              </h2>
              <p className="text-sm text-text-secondary">{copy.subtitle}</p>
            </div>

            {/* Éxito (confirmación / reset) */}
            {notice && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
                <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-secondary">{notice}</p>
              </div>
            )}

            {/* Error global */}
            {error && !notice && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <IconAlertCircle stroke={1.75} className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {!notice && (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Nombre (solo signup) */}
                {mode === 'signup' && (
                  <Field
                    id="signup-name" label="Nombre" icon={IconUser} type="text"
                    value={name} onChange={setName} placeholder="Tu nombre"
                    autoComplete="name" disabled={isLoading} error={fieldErrors.name}
                    inputRef={firstFocusRef}
                  />
                )}

                {/* Email */}
                <Field
                  id="auth-email" label="Email" icon={IconMail} type="email"
                  value={email} onChange={setEmail} placeholder="tu@email.com"
                  autoComplete="email" disabled={isLoading} error={fieldErrors.email}
                  inputRef={mode === 'signup' ? undefined : firstFocusRef}
                />

                {/* Password (login/signup) */}
                {mode !== 'reset' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="auth-password" className="block text-sm font-medium text-text-secondary">
                        Contraseña
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => switchMode('reset')}
                          className="text-xs text-accent hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <IconLock stroke={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-quaternary" />
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setFieldErrors((p) => ({ ...p, password: undefined }));
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="••••••••"
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        disabled={isLoading}
                        className={`w-full rounded-xl border bg-primary-bg pl-10 pr-12 py-3 text-base sm:text-sm text-text-primary placeholder:text-text-quaternary transition-colors focus:outline-none disabled:opacity-50 ${
                          fieldErrors.password ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-accent'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-quaternary hover:text-text-secondary transition-colors"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <IconEyeOff stroke={1.75} className="h-4 w-4" /> : <IconEye stroke={1.75} className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
                  </div>
                )}

                {/* Consentimiento de T&C: solo en el alta, sin premarcar y
                    con el texto completo a un clic. */}
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          if (e.target.checked) {
                            setFieldErrors((prev) => ({ ...prev, terms: null }));
                          }
                        }}
                        disabled={isLoading}
                        className="mt-0.5 h-5 w-5 flex-shrink-0 accent-accent"
                        aria-describedby="terms-help"
                      />
                      <span id="terms-help" className="text-xs leading-relaxed text-text-secondary">
                        Leí y acepto los{' '}
                        <button
                          type="button"
                          onClick={() => setTermsOpen(true)}
                          className="font-semibold text-accent underline"
                        >
                          términos y condiciones
                        </button>
                        {' '}y la{' '}
                        <button
                          type="button"
                          onClick={() => setPrivacyOpen(true)}
                          className="font-semibold text-accent underline"
                        >
                          política de privacidad
                        </button>
                        . Entiendo que Mock es una herramienta de asistencia y que soy el
                        único responsable profesional de los planes que genere y entregue.
                      </span>
                    </label>
                    {fieldErrors.terms && <p className="text-xs text-red-400">{fieldErrors.terms}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-hero-primary w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-accent text-primary-bg font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 stroke={1.75} className="h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    copy.cta
                  )}
                </button>
              </form>
            )}

            {/* Cambio de modo */}
            <div className="mt-6 text-center text-sm text-text-secondary">
              {mode === 'login' && (
                <>
                  ¿No tenés cuenta?{' '}
                  <button onClick={() => switchMode('signup')} className="text-accent font-medium hover:underline">
                    Crear cuenta
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  ¿Ya tenés cuenta?{' '}
                  <button onClick={() => switchMode('login')} className="text-accent font-medium hover:underline">
                    Iniciar sesión
                  </button>
                </>
              )}
              {mode === 'reset' && (
                <button onClick={() => switchMode('login')} className="text-accent font-medium hover:underline">
                  Volver a iniciar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} zIndex="z-[200]" />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} zIndex="z-[200]" />

      <style>{`
        @keyframes modalEntrance {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

/* Campo de texto reutilizable con icono */
function Field({ id, label, icon: Icon, type, value, onChange, placeholder, autoComplete, disabled, error, inputRef }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary">{label}</label>
      <div className="relative">
        <Icon stroke={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-quaternary" />
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full rounded-xl border bg-primary-bg pl-10 pr-4 py-3 text-base sm:text-sm text-text-primary placeholder:text-text-quaternary transition-colors focus:outline-none disabled:opacity-50 ${
            error ? 'border-red-500/50 focus:border-red-500' : 'border-border focus:border-accent'
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
