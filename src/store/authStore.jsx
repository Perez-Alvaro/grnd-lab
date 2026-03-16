/**
 * src/store/authStore.js
 * Auth state management via React Context.
 * No external state library required — plain useState + useEffect.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { attemptLogin as authLogin, logout as authLogout } from '../lib/auth.js';
import { initializeSession, startSessionWatcher } from '../lib/session.js';
import { toast } from '../utils/toast.js';

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */

const AuthContext = createContext(null);

/* ─────────────────────────────────────────────
   PROVIDER
───────────────────────────────────────────── */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);           // authenticated user payload or null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionReady, setSessionReady] = useState(false); // guards initial flash

  // ── Session initialization on mount ──────────────────────────
  useEffect(() => {
    let watcherId = null;

    async function bootstrap() {
      const restoredUser = await initializeSession();
      if (restoredUser) {
        setUser(restoredUser);
      }
      setSessionReady(true);

      // Start periodic expiry watcher
      watcherId = startSessionWatcher(() => {
        setUser(null);
        toast.warning('Tu sesión expiró. Por favor, iniciá sesión nuevamente.');
        setIsModalOpen(true);
      });
    }

    bootstrap();

    // Listen for auth:required events dispatched by ProtectedRoute
    const handleAuthRequired = () => {
      setError(null);
      setIsModalOpen(true);
    };
    window.addEventListener('auth:required', handleAuthRequired);

    return () => {
      if (watcherId) clearInterval(watcherId);
      window.removeEventListener('auth:required', handleAuthRequired);
    };
  }, []);

  // ── Actions ──────────────────────────────────────────────────

  const openLoginModal = useCallback(() => {
    setError(null);
    setIsModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authLogin(email, password);
      if (result.success) {
        setUser(result.user);
        setIsModalOpen(false);
        return { success: true, user: result.user };
      }
      setError(result.error);
      return { success: false, error: result.error };
    } catch {
      const message = 'Ocurrió un error inesperado';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setIsModalOpen(false);
    setError(null);
  }, []);

  const checkSession = useCallback(async () => {
    const restoredUser = await initializeSession();
    setUser(restoredUser);
    return restoredUser;
  }, []);

  // ── Context value ─────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user,
        isModalOpen,
        isLoading,
        error,
        sessionReady,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   HOOK
───────────────────────────────────────────── */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
