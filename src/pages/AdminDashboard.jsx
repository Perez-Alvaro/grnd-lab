/**
 * src/pages/AdminDashboard.jsx
 * Dashboard del admin del SaaS con menú lateral (drawer en mobile):
 *   - Pagos: impactos de transferencias por chequear.
 *   - Clientes: suscripciones + control de acceso manual
 *     (bloquear / desbloquear / modo testing hasta una fecha).
 *   - Uso: qué editor se usa más.
 *   - Buzón: reclamos y bugs de los entrenadores.
 *   - Datos de transferencia: la cuenta que ve el coach al pagar.
 * A los editores se llega con el botón "Panel de entrenador" del header
 * (el admin nunca está bloqueado por suscripción).
 * Todo pasa por RLS (is_admin()) — un coach no puede ver esta data.
 */
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconUsers, IconCircleCheck, IconClock, IconCurrencyDollar, IconLogout, IconBolt,
  IconReceipt, IconExternalLink, IconBarbell, IconSalad, IconMessageReport, IconBuildingBank,
  IconChartBar, IconMenu2, IconX, IconTestPipe,
} from '@tabler/icons-react';
import { useAuth } from '../store/authStore.jsx';
import {
  listCoaches, getMetrics, activateSubscription, setSubscriptionStatus,
  setAccessOverride, setTrialUntil,
  listPayments, getReceiptUrl, approvePayment, rejectPayment,
  getUsageStats, listAllFeedback, setFeedbackStatus,
} from '../lib/admin.js';
import { PLANS } from '../lib/subscriptions.js';
import { FEEDBACK_STATUS_LABEL } from '../lib/feedback.js';
import { Button, Badge } from '../components/ui';
import TransferSettings from '../components/Admin/TransferSettings.jsx';
import { toast } from '../utils/toast.js';

const STATUS_VARIANT = {
  active: 'success',
  pending: 'warning',
  past_due: 'error',
  canceled: 'default',
  trialing: 'accent',
};

const PLAN_LABEL = {
  mensual: 'Mensual · $10',
  trimestral: 'Trimestral · $27',
  anual: 'Anual · $48',
  starter: 'Starter · $5',
  pro: 'Pro · $10',
  studio: 'Studio · $15',
};

const PAYMENT_STATUS = {
  submitted: { label: 'Por chequear', variant: 'warning' },
  approved: { label: 'Impactó', variant: 'success' },
  rejected: { label: 'Rechazado', variant: 'error' },
};

const FEEDBACK_VARIANT = { open: 'warning', in_progress: 'accent', resolved: 'success' };
const FEEDBACK_TYPE_LABEL = { bug: 'Bug', reclamo: 'Reclamo', sugerencia: 'Sugerencia' };

/** Cómo está el acceso real del cliente (override > libre > pago > testing). */
function accessInfo(c) {
  const now = Date.now();
  if (c.access_override === 'blocked') return { label: 'Bloqueado', variant: 'error' };
  if (c.access_override === 'unlocked') return { label: 'Acceso libre', variant: 'success' };
  const vigente = c.subscription?.status === 'active'
    && c.subscription.current_period_end
    && new Date(c.subscription.current_period_end).getTime() > now;
  if (vigente) return { label: 'Pago vigente', variant: 'success' };
  if (c.trial_until && new Date(c.trial_until).getTime() > now) {
    return { label: `Testing hasta ${new Date(c.trial_until).toLocaleDateString('es-AR')}`, variant: 'accent' };
  }
  return { label: 'Sin acceso', variant: 'default' };
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState('pagos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [coaches, setCoaches] = useState([]);
  const [metrics, setMetrics] = useState({ totalCoaches: 0, active: 0, pending: 0, mrr: 0 });
  const [payments, setPayments] = useState([]);
  const [usage, setUsage] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, m, p, u, f] = await Promise.all([
        listCoaches(),
        getMetrics(),
        listPayments().catch(() => []),
        getUsageStats().catch(() => null),
        listAllFeedback().catch(() => []),
      ]);
      setCoaches(c);
      setMetrics(m);
      setPayments(p);
      setUsage(u);
      setFeedback(f);
    } catch (e) {
      toast.error('No se pudo cargar. ¿Sos admin y aplicaste las migraciones?');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const pendingPayments = payments.filter((p) => p.status === 'submitted');
  const openFeedback = feedback.filter((f) => f.status !== 'resolved');

  const SECTIONS = [
    { id: 'pagos', label: 'Pagos', icon: IconReceipt, badge: pendingPayments.length },
    { id: 'clientes', label: 'Clientes y accesos', icon: IconUsers },
    { id: 'uso', label: 'Uso de editores', icon: IconChartBar },
    { id: 'buzon', label: 'Buzón', icon: IconMessageReport, badge: openFeedback.length },
    { id: 'transferencia', label: 'Datos de transferencia', icon: IconBuildingBank },
  ];

  const goSection = (id) => { setSection(id); setSidebarOpen(false); };

  /* ── Acciones de pagos ─────────────────────────────────── */

  const handleApprove = async (payment) => {
    const days = PLANS[payment.plan]?.days || 30;
    if (!window.confirm(`¿Confirmar que impactó la transferencia de ${payment.coach_name} y habilitar ${days} días?`)) return;
    try {
      await approvePayment(payment.id);
      toast.success(`Pago aprobado: ${days} días habilitados`);
      load();
    } catch (e) { toast.error('No se pudo aprobar'); console.error(e); }
  };

  const handleReject = async (payment) => {
    const notes = window.prompt('Motivo del rechazo (lo ve el coach):', 'La transferencia no impactó');
    if (notes === null) return;
    try {
      await rejectPayment(payment.id, notes || null);
      toast.success('Pago rechazado');
      load();
    } catch (e) { toast.error('No se pudo rechazar'); console.error(e); }
  };

  const handleViewReceipt = async (payment) => {
    try {
      const url = await getReceiptUrl(payment.receipt_path);
      window.open(url, '_blank', 'noopener');
    } catch (e) { toast.error('No se pudo abrir el comprobante'); console.error(e); }
  };

  /* ── Acciones de acceso (override + testing) ────────────── */

  const handleOverride = async (coach, value) => {
    try {
      await setAccessOverride(coach.id, value || null);
      toast.success(
        value === 'blocked' ? `${coach.name} bloqueado`
          : value === 'unlocked' ? `${coach.name} con acceso libre`
            : `${coach.name} vuelve al flujo normal por pago`,
      );
      load();
    } catch (e) { toast.error('No se pudo cambiar el acceso'); console.error(e); }
  };

  const handleTrial = async (coach) => {
    const input = window.prompt(
      `Días de testing para ${coach.name} (0 para quitar la prueba):`,
      '7',
    );
    if (input === null) return;
    const days = Number(input);
    if (!Number.isFinite(days) || days < 0) { toast.error('Ingresá un número de días válido'); return; }
    try {
      const until = days === 0 ? null : new Date(Date.now() + days * 86400000).toISOString();
      await setTrialUntil(coach.id, until);
      toast.success(days === 0
        ? `Testing quitado a ${coach.name}`
        : `${coach.name} en testing hasta el ${new Date(until).toLocaleDateString('es-AR')}`);
      load();
    } catch (e) { toast.error('No se pudo asignar el testing'); console.error(e); }
  };

  /* ── Acciones de suscripciones (override manual legacy) ─── */

  const handleActivate = async (sub) => {
    try {
      const days = PLANS[sub.plan]?.days || 30;
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + days);
      await activateSubscription(sub.id, periodEnd.toISOString());
      toast.success(`Suscripción activada (${days} días)`);
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

  /* ── Acciones del buzón ─────────────────────────────────── */

  const handleFeedbackStatus = async (item, status) => {
    try {
      let reply;
      if (status === 'resolved') {
        reply = window.prompt('Respuesta para el coach (opcional):', item.admin_reply || '');
        if (reply === null) return;
      }
      await setFeedbackStatus(item.id, status, reply === '' ? null : reply);
      toast.success('Reporte actualizado');
      load();
    } catch (e) { toast.error('No se pudo actualizar'); console.error(e); }
  };

  /* ── Sidebar (compartida entre desktop y drawer mobile) ─── */

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-3">
      <p className="px-3 pt-2 pb-1 text-2xs font-semibold text-text-muted uppercase tracking-wider">Panel</p>
      {SECTIONS.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => goSection(id)}
          className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            section === id
              ? 'bg-accent text-primary-bg'
              : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
          }`}
        >
          <Icon stroke={1.75} className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">{label}</span>
          {badge > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold font-mono ${
              section === id ? 'bg-primary-bg/20 text-primary-bg' : 'bg-accent/15 text-accent'
            }`}>
              {badge}
            </span>
          )}
        </button>
      ))}

    </nav>
  );

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-primary-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-primary hover:bg-primary-bg transition-colors"
              aria-label="Abrir menú"
            >
              <IconMenu2 stroke={1.75} className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary-bg flex-shrink-0">
              <IconBolt stroke={1.75} className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-text-primary font-display leading-tight truncate">Admin · Mock</h1>
              <p className="text-xs text-text-muted truncate">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* El admin también es coach: atajo a su propio panel de entrenador */}
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <IconBarbell stroke={1.75} className="h-4 w-4" />
              <span className="hidden sm:inline">Panel de entrenador</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
              <IconLogout stroke={1.75} className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-primary-surface border-r border-border shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-bold text-text-primary font-display">Menú</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-primary-bg transition-colors"
                aria-label="Cerrar menú"
              >
                <IconX stroke={1.75} className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="mx-auto max-w-7xl lg:flex">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border min-h-[calc(100vh-61px)]">
          <div className="sticky top-[61px]">{sidebarContent}</div>
        </aside>

        {/* Contenido */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard icon={IconUsers} label="Coaches" value={metrics.totalCoaches} />
            <StatCard icon={IconCircleCheck} label="Pagos vigentes" value={metrics.active} />
            <StatCard icon={IconClock} label="Por chequear" value={pendingPayments.length} />
            <StatCard icon={IconCurrencyDollar} label="MRR (USD)" value={`$${metrics.mrr}`} />
          </div>

          {loading ? (
            <p className="text-sm text-text-muted">Cargando…</p>
          ) : (
            <>
              {/* ══ PAGOS: impactos de transferencias ══ */}
              {section === 'pagos' && (
                <Panel title="Transferencias informadas" subtitle="Verificá que el pago impactó antes de aprobar. Aprobar habilita los días del plan automáticamente.">
                  {payments.length === 0 ? (
                    <p className="text-sm text-text-muted p-6">Nadie informó pagos todavía.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {payments.map((p) => {
                        const st = PAYMENT_STATUS[p.status] || { label: p.status, variant: 'default' };
                        return (
                          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4">
                            <div className="flex items-start gap-3 min-w-0">
                              <IconReceipt stroke={1.75} className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                  {p.coach_name} · {PLANS[p.plan]?.label || p.plan} · ${p.amount_usd} USD
                                </p>
                                <p className="text-xs text-text-muted">
                                  {new Date(p.created_at).toLocaleString('es-AR')}
                                  {p.reference && ` · Ref: ${p.reference}`}
                                  {p.status === 'approved' && p.period_end &&
                                    ` · habilitado hasta ${new Date(p.period_end).toLocaleDateString('es-AR')}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={st.variant}>{st.label}</Badge>
                              <Button size="sm" variant="ghost" onClick={() => handleViewReceipt(p)}>
                                <IconExternalLink stroke={1.75} className="h-4 w-4" /> Comprobante
                              </Button>
                              {p.status === 'submitted' && (
                                <>
                                  <Button size="sm" variant="accent" onClick={() => handleApprove(p)}>Impactó</Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleReject(p)}>Rechazar</Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Panel>
              )}

              {/* ══ CLIENTES Y ACCESOS ══ */}
              {section === 'clientes' && (
                <Panel
                  title="Clientes y accesos"
                  subtitle="Acceso: Normal sigue el flujo de pago · Libre habilita sin pagar · Bloqueado corta todo. Testing da acceso completo hasta la fecha que elijas."
                >
                  {coaches.length === 0 ? (
                    <p className="text-sm text-text-muted p-6">No hay usuarios todavía.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {coaches.map((c) => {
                        const acc = accessInfo(c);
                        return (
                          <div key={c.id} className="px-4 sm:px-6 py-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium text-text-primary truncate">{c.name}</p>
                                  {c.role === 'admin' && <Badge variant="accent" size="sm">admin</Badge>}
                                  <Badge variant={acc.variant} size="sm">{acc.label}</Badge>
                                </div>
                                <p className="text-xs text-text-muted mt-1">
                                  Alta {new Date(c.created_at).toLocaleDateString('es-AR')}
                                  {c.subscription
                                    ? ` · ${PLAN_LABEL[c.subscription.plan] || c.subscription.plan}`
                                    : ' · sin suscripción'}
                                  {c.subscription?.current_period_end &&
                                    ` · vence ${new Date(c.subscription.current_period_end).toLocaleDateString('es-AR')}`}
                                </p>
                                {c.subscription && (
                                  <div className="mt-1.5">
                                    <Badge variant={STATUS_VARIANT[c.subscription.status] || 'default'} size="sm">
                                      {c.subscription.status}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              {c.role !== 'admin' && (
                                <div className="flex flex-wrap items-center gap-2">
                                  <select
                                    value={c.access_override || ''}
                                    onChange={(e) => handleOverride(c, e.target.value)}
                                    aria-label={`Acceso de ${c.name}`}
                                    className="h-8 rounded-sm border border-border bg-primary-bg px-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                                  >
                                    <option value="">Normal (según pago)</option>
                                    <option value="unlocked">Desbloqueado (libre)</option>
                                    <option value="blocked">Bloqueado</option>
                                  </select>
                                  <Button size="sm" variant="ghost" onClick={() => handleTrial(c)}>
                                    <IconTestPipe stroke={1.75} className="h-4 w-4" /> Testing
                                  </Button>
                                  {c.subscription?.status === 'pending' && (
                                    <Button size="sm" variant="accent" onClick={() => handleActivate(c.subscription)}>Activar</Button>
                                  )}
                                  {c.subscription?.status === 'active' && (
                                    <Button size="sm" variant="ghost" onClick={() => handleSuspend(c.subscription)}>Suspender</Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-text-muted px-6 py-3 border-t border-border">
                    El flujo normal es aprobar pagos desde Pagos. Todo lo de acá es override manual
                    y le gana al plan que tengan.
                  </p>
                </Panel>
              )}

              {/* ══ USO DE LOS EDITORES ══ */}
              {section === 'uso' && (
                usage ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <UsageCard
                      icon={IconBarbell}
                      title="Editor de rutinas"
                      data={usage.workout}
                      otherTotal={usage.nutrition.opens}
                    />
                    <UsageCard
                      icon={IconSalad}
                      title="Editor de nutrición"
                      data={usage.nutrition}
                      otherTotal={usage.workout.opens}
                    />
                  </div>
                ) : (
                  <Panel title="Uso de los editores">
                    <p className="text-sm text-text-muted p-6">
                      Sin datos de uso todavía. Verificá que aplicaste la migración 0004.
                    </p>
                  </Panel>
                )
              )}

              {/* ══ BUZÓN DE RECLAMOS / BUGS ══ */}
              {section === 'buzon' && (
                <Panel title="Buzón de reclamos y bugs" subtitle="Reportes enviados por los entrenadores desde su panel.">
                  {feedback.length === 0 ? (
                    <p className="text-sm text-text-muted p-6">No hay reportes todavía.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {feedback.map((f) => (
                        <div key={f.id} className="px-4 sm:px-6 py-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge variant="secondary" size="sm">{FEEDBACK_TYPE_LABEL[f.type] || f.type}</Badge>
                              <p className="text-sm font-medium text-text-primary truncate">{f.subject}</p>
                            </div>
                            <Badge variant={FEEDBACK_VARIANT[f.status] || 'default'} size="sm">
                              {FEEDBACK_STATUS_LABEL[f.status] || f.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-secondary whitespace-pre-wrap">{f.message}</p>
                          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                            <p className="text-xs text-text-muted">
                              {f.coach_name} · {new Date(f.created_at).toLocaleString('es-AR')}
                              {f.admin_reply && ` · Respuesta: ${f.admin_reply}`}
                            </p>
                            <div className="flex gap-2">
                              {f.status === 'open' && (
                                <Button size="sm" variant="ghost" onClick={() => handleFeedbackStatus(f, 'in_progress')}>En curso</Button>
                              )}
                              {f.status !== 'resolved' && (
                                <Button size="sm" variant="accent" onClick={() => handleFeedbackStatus(f, 'resolved')}>Resolver</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              )}

              {section === 'transferencia' && <TransferSettings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Subcomponentes ─────────────────────────────────────────── */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md border border-border bg-primary-surface p-4">
      <div className="flex items-center gap-2 text-text-muted mb-1">
        <Icon stroke={1.75} className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text-primary font-mono">{value}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-border bg-primary-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">{title}</h2>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function UsageCard({ icon: Icon, title, data, otherTotal }) {
  const total = data.opens + otherTotal;
  const pct = total > 0 ? Math.round((data.opens / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-border bg-primary-surface p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Icon stroke={1.75} className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-text-primary font-display">{title}</h3>
          <p className="text-xs text-text-muted">{pct}% de las aperturas de editor</p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-primary-bg overflow-hidden mb-5">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <UsageStat label="Planes creados" value={data.created} />
        <UsageStat label="Aperturas" value={data.opens} />
        <UsageStat label="Guardados" value={data.saves} />
        <UsageStat label="PDFs exportados" value={data.pdf} />
      </div>
    </div>
  );
}

function UsageStat({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-primary-bg px-3 py-2.5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-lg font-bold text-text-primary font-mono">{value}</p>
    </div>
  );
}
