/**
 * src/components/Auth/ProtectedRoute.jsx
 * Route guard that requires authentication (and optionally a specific role).
 *
 * - Validates token signature + expiry on every render
 * - If authenticated → renders children (the protected content)
 * - If unauthenticated → shows screen to login
 * - If role mismatch → renders inline 403 screen
 * - Prevents users from getting stuck on restricted access screen
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldOff, Loader2 } from 'lucide-react';
import { validateToken, isAuthenticated, logout } from '../../lib/auth.js';
import { useAuth } from '../../store/authStore.jsx';
import { toast } from '../../utils/toast.js';

const STATUS = {
  CHECKING: 'checking',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  FORBIDDEN: 'forbidden',
};

export default function ProtectedRoute({ children, requiredRole }) {
  const [status, setStatus] = useState(STATUS.CHECKING);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const token = sessionStorage.getItem('auth_token');

      if (!token) {
        if (!cancelled) {
          setStatus(STATUS.UNAUTHENTICATED);
        }
        return;
      }

      const result = await validateToken(token);

      if (cancelled) return;

      if (!result.valid) {
        logout();
        setStatus(STATUS.UNAUTHENTICATED);
        if (result.expired) {
          toast.warning('Tu sesión expiró. Por favor, iniciá sesión nuevamente.');
        }
        return;
      }

      // Role check (optional)
      if (requiredRole && result.payload.role !== requiredRole) {
        setStatus(STATUS.FORBIDDEN);
        return;
      }

      setStatus(STATUS.AUTHENTICATED);
    }

    check();
    return () => {
      cancelled = true;
    };
  // Re-validate whenever the user object changes (e.g. logout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, requiredRole]);

  // ── Render states ─────────────────────────────────────────────

  if (status === STATUS.CHECKING) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary-bg">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  if (status === STATUS.UNAUTHENTICATED) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-primary-bg gap-6 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <Lock className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display mb-2">Acceso restringido</h2>
          <p className="text-sm text-text-secondary max-w-sm">
            Necesitás iniciar sesión para acceder al editor de rutinas.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-secondary-bg hover:bg-secondary-bg/80 text-text-primary transition-colors text-sm font-medium"
          >
            Volver a inicio
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('auth:required'))}
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white transition-colors text-sm font-medium"
          >
            Iniciar sesión
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-4">
          Después de iniciar sesión, irás directamente al editor.
        </p>
      </div>
    );
  }

  if (status === STATUS.FORBIDDEN) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-primary-bg gap-6 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <ShieldOff className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-display mb-2">Acceso denegado</h2>
          <p className="text-sm text-text-secondary max-w-sm">
            Tu cuenta no tiene permisos suficientes para acceder a esta sección.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-secondary-bg hover:bg-secondary-bg/80 text-text-primary transition-colors text-sm font-medium"
          >
            Volver a inicio
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('auth:required'))}
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white transition-colors text-sm font-medium"
          >
            Iniciar sesión con otra cuenta
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
