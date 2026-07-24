/**
 * src/components/Auth/SubscriptionGate.jsx
 * Deshabilitación automática de los editores por falta de pago.
 * Sin pago vigente (30/90/365 días desde la aprobación de la
 * transferencia) el coach ve una pantalla de bloqueo con el CTA
 * para informar el pago. El admin nunca queda bloqueado.
 * (El enforcement real está en RLS; esto es la cara visible.)
 */
import { useNavigate } from 'react-router-dom';
import { IconLock, IconClockPause, IconLoader2, IconCreditCard } from '@tabler/icons-react';
import { useAuth } from '../../store/authStore.jsx';
import useSubscription from '../../hooks/useSubscription.js';

export default function SubscriptionGate({ children }) {
  const { user } = useAuth();
  const { loading, state } = useSubscription();
  const navigate = useNavigate();

  if (user?.role === 'admin') return <>{children}</>;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary-bg">
        <IconLoader2 stroke={1.75} className="h-8 w-8 text-accent animate-spin" />
      </div>
    );
  }

  if (state.hasAccess) return <>{children}</>;

  const isEnviado = state.code === 'enviado';
  const isBloqueado = state.code === 'bloqueado';
  const Icon = isEnviado ? IconClockPause : IconLock;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-primary-bg gap-6 px-6 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isEnviado ? 'bg-warning/10' : 'bg-accent/10'}`}>
        <Icon stroke={1.75} className={`h-8 w-8 ${isEnviado ? 'text-warning' : 'text-accent'}`} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-text-primary font-display mb-2">
          {isBloqueado
            ? 'Tu acceso está bloqueado'
            : isEnviado
              ? 'Tu pago está en revisión'
              : 'Necesitás una suscripción activa'}
        </h2>
        <p className="text-sm text-text-secondary max-w-sm">
          {isBloqueado
            ? 'El administrador deshabilitó tu acceso a los editores. Si creés que es un error, escribinos desde el buzón de tu panel.'
            : isEnviado
              ? 'Recibimos tu comprobante. Apenas el administrador confirme el impacto de la transferencia, los editores se habilitan solos.'
              : state.trialUntil
                ? 'Tu período de prueba terminó. Elegí un plan e informá tu transferencia desde el panel para seguir usando los editores.'
                : state.expired
                  ? 'Tu período venció y los editores quedaron deshabilitados. Informá el pago desde tu panel para reactivarlos.'
                  : 'Para usar los editores de rutinas y nutrición, elegí un plan e informá tu transferencia desde el panel.'}
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-light text-primary-bg transition-colors text-sm font-medium inline-flex items-center gap-2"
        >
          <IconCreditCard stroke={1.75} className="h-4 w-4" />
          {isEnviado ? 'Ir a mi panel' : 'Informar pago'}
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-secondary-bg hover:bg-secondary-bg/80 text-text-primary transition-colors text-sm font-medium"
        >
          Ver planes
        </button>
      </div>
    </div>
  );
}
