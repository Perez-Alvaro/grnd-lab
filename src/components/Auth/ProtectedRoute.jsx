/**
 * src/components/Auth/ProtectedRoute.jsx
 * Route guard basado en la sesión real de Supabase (via authStore).
 *
 * - Espera a que la sesión esté lista (sessionReady) para evitar flashes.
 * - Sin usuario → pantalla de acceso restringido.
 * - Con requiredRole y rol distinto → pantalla 403.
 * (La verificación de suscripción activa se agrega en la Fase 3.)
 */

import { useNavigate } from 'react-router-dom';
import { Lock, ShieldOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../store/authStore.jsx';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, sessionReady } = useAuth();
  const navigate = useNavigate();

  // ── Cargando sesión ───────────────────────────────────────────
  if (!sessionReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary-bg">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  // ── No autenticado ────────────────────────────────────────────
  if (!user) {
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
            className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-primary-bg transition-colors text-sm font-medium"
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

  // ── Rol insuficiente ──────────────────────────────────────────
  if (requiredRole && user.role !== requiredRole) {
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
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
