/**
 * src/store/authStore.jsx
 * Auth state via React Context, backed by Supabase Auth.
 * Mantiene la misma superficie de API que la versión mock anterior
 * (user, isModalOpen, isLoading, error, sessionReady, openLoginModal,
 *  closeLoginModal, login, logout, checkSession) y agrega signup/reset.
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from '../context/ToastContext.jsx';

const AuthContext = createContext(null);

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

// Traduce errores de Supabase a mensajes en español.
function translateError(message = '') {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email o contraseña incorrectos';
  if (m.includes('email not confirmed')) return 'Confirmá tu email antes de ingresar';
  if (m.includes('user already registered')) return 'Ese email ya está registrado';
  if (m.includes('password should be at least')) return 'La contraseña es demasiado corta';
  if (m.includes('rate limit') || m.includes('too many')) return 'Demasiados intentos, probá en un momento';
  return message || 'Ocurrió un error inesperado';
}

// Carga name/role desde profiles; degrada con elegancia si la tabla aún no existe.
async function loadProfile(sessionUser) {
  const fallback = {
    id: sessionUser.id,
    email: sessionUser.email,
    name: sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'Coach',
    role: 'coach',
  };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', sessionUser.id)
      .single();
    if (error || !data) return fallback;
    return { ...fallback, name: data.name || fallback.name, role: data.role || 'coach' };
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────── */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Detecta si la URL inicial corresponde a un callback de verificación de email.
  const pendingVerificationRef = useRef(false);

  // ── Bootstrap + suscripción a cambios de sesión ─────────────
  useEffect(() => {
    let active = true;

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const authType = hashParams.get('type') || searchParams.get('type');
    const urlErrorDesc = hashParams.get('error_description') || searchParams.get('error_description');
    const hasAuthTokens = Boolean(hashParams.get('access_token') || searchParams.get('code'));

    if (urlErrorDesc) {
      const lower = urlErrorDesc.toLowerCase();
      toast.error(
        lower.includes('expired')
          ? 'El enlace de verificación expiró. Iniciá sesión o pedí uno nuevo.'
          : 'No pudimos verificar tu email. Probá iniciar sesión o pedir otro enlace.'
      );
      window.history.replaceState(null, '', window.location.pathname);
      setAuthModalMode('login');
      setIsModalOpen(true);
    } else if (hasAuthTokens && authType !== 'recovery') {
      pendingVerificationRef.current = true;
    }

    function completeVerificationRedirect(profile) {
      if (!pendingVerificationRef.current) return;
      pendingVerificationRef.current = false;
      window.history.replaceState(null, '', window.location.pathname);
      toast.success('¡Email verificado! Tu cuenta ya está activa.');
      navigate(profile?.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }

    async function bootstrap() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session?.user) {
        const profile = await loadProfile(data.session.user);
        if (!active) return;
        setUser(profile);
        completeVerificationRedirect(profile);
      }
      setSessionReady(true);
    }
    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      if (session?.user) {
        const profile = await loadProfile(session.user);
        if (!active) return;
        setUser(profile);
        if (event === 'SIGNED_IN') {
          completeVerificationRedirect(profile);
        }
      } else {
        setUser(null);
      }
    });

    // ProtectedRoute u otros disparan este evento para pedir login.
    const handleAuthRequired = () => {
      setError(null);
      setAuthModalMode('login');
      setIsModalOpen(true);
    };
    window.addEventListener('auth:required', handleAuthRequired);

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
      window.removeEventListener('auth:required', handleAuthRequired);
    };
  }, [navigate, toast]);

  // ── Modal ─────────────────────────────────────────────────────
  const openLoginModal = useCallback((mode = 'login') => {
    setError(null);
    setAuthModalMode(mode);
    setIsModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  // ── Login ─────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        const msg = translateError(err.message);
        setError(msg);
        return { success: false, error: msg };
      }
      const profile = await loadProfile(data.user);
      setUser(profile);
      setIsModalOpen(false);
      return { success: true, user: profile };
    } catch {
      const msg = 'Ocurrió un error inesperado';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Signup ────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (err) {
        const msg = translateError(err.message);
        setError(msg);
        return { success: false, error: msg };
      }
      // Supabase devuelve identities vacío si el email ya existe (protección anti-enumeración).
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        const msg = 'Ese email ya está registrado. Probá iniciar sesión.';
        setError(msg);
        return { success: false, error: msg };
      }
      // Si hay sesión inmediata (email confirmation deshabilitado) → dentro.
      if (data.session?.user) {
        setUser(await loadProfile(data.session.user));
        setIsModalOpen(false);
        return { success: true, needsConfirmation: false };
      }
      // Si no, hay que confirmar por email.
      return { success: true, needsConfirmation: true };
    } catch {
      const msg = 'Ocurrió un error inesperado';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Reenviar confirmación ─────────────────────────────────────
  const resendConfirmation = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (err) {
        const msg = translateError(err.message);
        setError(msg);
        return { success: false, error: msg };
      }
      return { success: true };
    } catch {
      const msg = 'Ocurrió un error inesperado';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Reset password ────────────────────────────────────────────
  const resetPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (err) {
        const msg = translateError(err.message);
        setError(msg);
        return { success: false, error: msg };
      }
      return { success: true };
    } catch {
      const msg = 'Ocurrió un error inesperado';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsModalOpen(false);
    setError(null);
  }, []);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const restored = data.session?.user ? await loadProfile(data.session.user) : null;
    setUser(restored);
    return restored;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isModalOpen,
        authModalMode,
        setAuthModalMode,
        isLoading,
        error,
        sessionReady,
        openLoginModal,
        closeLoginModal,
        login,
        signup,
        resendConfirmation,
        resetPassword,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
