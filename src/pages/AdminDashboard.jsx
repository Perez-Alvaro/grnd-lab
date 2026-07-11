/**
 * src/pages/AdminDashboard.jsx
 * Dashboard del admin del SaaS: coaches, suscripciones y métricas.
 * Todo pasa por RLS (is_admin()) — un coach no puede ver esta data.
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, Clock, DollarSign, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../store/authStore.jsx';
import { listCoaches, getMetrics, activateSubscription, setSubscriptionStatus } from '../lib/admin.js';
import { Button, Badge } from '../components/ui';
import { toast } from '../utils/toast.js';

const STATUS_VARIANT = {
  active: 'success',
  pending: 'warning',
  past_due: 'error',
  canceled: 'default',
  trialing: 'accent',
};

const PLAN_LABEL = { starter: 'Starter · $5', pro: 'Pro · $10', studio: 'Studio · $15' };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [coaches, setCoaches] = useState([]);
  const [metrics, setMetrics] = useState({ totalCoaches: 0, active: 0, pending: 0, mrr: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, m] = await Promise.all([listCoaches(), getMetrics()]);
      setCoaches(c);
      setMetrics(m);
    } catch (e) {
      toast.error('No se pudo cargar. ¿Sos admin y aplicaste las migraciones?');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleActivate = async (sub) => {
    try {
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30);
      await activateSubscription(sub.id, periodEnd.toISOString());
      toast.success('Suscripción activada (30 días)');
      load();
    } catch (e) { toast.error('No se pudo activar'); console.error(e); }
  };

  const handleSuspend = async (sub) => {
    try {
      await setSubscriptionStatus(sub.id, 'canceled');
      toast.success('Suscripción suspendida');
      load();
    } catch (e) { toast.error('No se pudo suspender'); console.error(e); }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <header className="border-b border-border bg-primary-surface">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary-bg">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-display leading-tight">Admin · GRIND LAB</h1>
              <p className="text-xs text-text-muted">{user?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Coaches" value={metrics.totalCoaches} />
          <StatCard icon={CheckCircle2} label="Activos" value={metrics.active} />
          <StatCard icon={Clock} label="Pendientes" value={metrics.pending} />
          <StatCard icon={DollarSign} label="MRR (USD)" value={`$${metrics.mrr}`} />
        </div>

        <div className="rounded-xl border border-border bg-primary-surface overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Coaches y suscripciones</h2>
          </div>

          {loading ? (
            <p className="text-sm text-text-muted p-6">Cargando…</p>
          ) : coaches.length === 0 ? (
            <p className="text-sm text-text-muted p-6">No hay usuarios todavía.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="px-6 py-3 font-medium">Nombre</th>
                    <th className="px-6 py-3 font-medium">Rol</th>
                    <th className="px-6 py-3 font-medium">Plan</th>
                    <th className="px-6 py-3 font-medium">Estado</th>
                    <th className="px-6 py-3 font-medium">Alta</th>
                    <th className="px-6 py-3 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0">
                      <td className="px-6 py-3 text-white">{c.name}</td>
                      <td className="px-6 py-3">
                        <Badge variant={c.role === 'admin' ? 'accent' : 'default'}>{c.role}</Badge>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">
                        {c.subscription ? (PLAN_LABEL[c.subscription.plan] || c.subscription.plan) : '—'}
                      </td>
                      <td className="px-6 py-3">
                        {c.subscription
                          ? <Badge variant={STATUS_VARIANT[c.subscription.status] || 'default'}>{c.subscription.status}</Badge>
                          : <span className="text-text-muted">sin suscripción</span>}
                      </td>
                      <td className="px-6 py-3 text-text-muted">{new Date(c.created_at).toLocaleDateString('es-AR')}</td>
                      <td className="px-6 py-3 text-right">
                        {c.subscription?.status === 'pending' && (
                          <Button size="sm" variant="accent" onClick={() => handleActivate(c.subscription)}>Activar</Button>
                        )}
                        {c.subscription?.status === 'active' && (
                          <Button size="sm" variant="ghost" onClick={() => handleSuspend(c.subscription)}>Suspender</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-text-muted px-6 py-3 border-t border-border">
            Nota: hasta implementar MercadoPago, las suscripciones se crean/activan manualmente
            tras la transferencia. Podés crear filas de suscripción desde el Table Editor de Supabase.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-primary-surface p-4">
      <div className="flex items-center gap-2 text-text-muted mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white font-display">{value}</p>
    </div>
  );
}
