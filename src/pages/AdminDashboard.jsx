/**
 * src/pages/AdminDashboard.jsx
 * Dashboard del administrador del SaaS con metricas ejecutivas, funnel PLG,
 * auditoria de pagos, gestion de clientes y analitica de uso de editores.
 * Todo pasa por RLS (is_admin()). Sin emojis; diseno sobrio con tokens tematicos.
 */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  IconUsers,
  IconLogout,
  IconBolt,
  IconReceipt,
  IconExternalLink,
  IconBarbell,
  IconMessageReport,
  IconBuildingBank,
  IconChartBar,
  IconMenu2,
  IconX,
  IconTestPipe,
  IconTrendingUp,
  IconFlame,
  IconAlertTriangle,
  IconSearch,
  IconFilter,
} from '@tabler/icons-react';
import { useAuth } from '../store/authStore.jsx';
import {
  listCoaches,
  getMetrics,
  getActivationFunnel,
  activateSubscription,
  setSubscriptionStatus,
  setAccessOverride,
  setTrialUntil,
  listPayments,
  getReceiptUrl,
  approvePayment,
  rejectPayment,
  getUsageStats,
  listAllFeedback,
  setFeedbackStatus,
} from '../lib/admin.js';
import { PLANS } from '../lib/subscriptions.js';
import { FEEDBACK_STATUS_LABEL } from '../lib/feedback.js';
import { Button, Badge } from '../components/ui';
import TransferSettings from '../components/Admin/TransferSettings.jsx';
import AdminMetricsOverview from '../components/Admin/AdminMetricsOverview.jsx';
import AdminFunnelView from '../components/Admin/AdminFunnelView.jsx';
import AdminUsageTrends from '../components/Admin/AdminUsageTrends.jsx';
import { toast } from '../utils/toast.js';

const PLAN_LABEL = {
  freemium: 'Plan Inicial (Freemium)',
  pro_monthly: 'Pro Mensual · $15.000 ARS',
  pro_annual: 'Pro Anual · $120.000 ARS',
  pro: 'Pro · $15.000 ARS',
  lifetime: 'Acceso de por vida',
  mensual: 'Mensual (Legacy) · $10 USD',
  trimestral: 'Trimestral (Legacy) · $27 USD',
  anual: 'Anual (Legacy) · $48 USD',
  starter: 'Starter (Legacy)',
  studio: 'Studio (Legacy)',
};

const PAYMENT_STATUS = {
  submitted: { label: 'Por chequear', variant: 'warning' },
  approved: { label: 'Impacto', variant: 'success' },
  rejected: { label: 'Rechazado', variant: 'error' },
};

const FEEDBACK_VARIANT = { open: 'warning', in_progress: 'accent', resolved: 'success' };
const FEEDBACK_TYPE_LABEL = { bug: 'Bug', reclamo: 'Reclamo', sugerencia: 'Sugerencia' };

/** Resuelve el estado de acceso real del cliente (override > libre > pago > testing). */
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

  const [section, setSection] = useState('metricas');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [coaches, setCoaches] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [funnel, setFunnel] = useState([]);
  const [payments, setPayments] = useState([]);
  const [usage, setUsage] = useState(null);
  const [usageTimeframe, setUsageTimeframe] = useState('all');
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(false);

  // Filtros de busqueda para la tabla de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('all'); // 'all' | 'saturated' | 'churn_risk' | 'active' | 'freemium'

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, mRes, fnnRes, pRes, uRes, fRes] = await Promise.allSettled([
        listCoaches(),
        getMetrics(),
        getActivationFunnel(),
        listPayments(),
        getUsageStats('all'),
        listAllFeedback(),
      ]);

      if (cRes.status === 'fulfilled') {
        setCoaches(cRes.value || []);
      } else {
        console.error('Error in listCoaches:', cRes.reason);
      }

      if (mRes.status === 'fulfilled') {
        setMetrics(mRes.value);
      } else {
        console.error('Error in getMetrics:', mRes.reason);
      }

      if (fnnRes.status === 'fulfilled') {
        setFunnel(fnnRes.value || []);
      } else {
        console.error('Error in getActivationFunnel:', fnnRes.reason);
      }

      if (pRes.status === 'fulfilled') {
        setPayments(pRes.value || []);
      } else {
        console.error('Error in listPayments:', pRes.reason);
      }

      if (uRes.status === 'fulfilled') {
        setUsage(uRes.value);
      } else {
        console.error('Error in getUsageStats:', uRes.reason);
      }

      if (fRes.status === 'fulfilled') {
        setFeedback(fRes.value || []);
      } else {
        console.error('Error in listAllFeedback:', fRes.reason);
      }
    } catch (e) {
      toast.error('Error al cargar datos del panel.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleTimeframeChange = async (tf) => {
    setUsageTimeframe(tf);
    setUsageLoading(true);
    try {
      const u = await getUsageStats(tf);
      setUsage(u);
    } catch (e) {
      toast.error('Error al actualizar metricas de uso.');
      console.error(e);
    } finally {
      setUsageLoading(false);
    }
  };

  const pendingPayments = payments.filter((p) => p.status === 'submitted');
  const openFeedback = feedback.filter((f) => f.status !== 'resolved');

  const SECTIONS = [
    { id: 'metricas', label: 'Metricas y Negocio', icon: IconTrendingUp },
    { id: 'pagos', label: 'Pagos y Facturacion', icon: IconReceipt, badge: pendingPayments.length },
    { id: 'clientes', label: 'Clientes y Accesos', icon: IconUsers },
    { id: 'uso', label: 'Uso de Editores', icon: IconChartBar },
    { id: 'buzon', label: 'Buzon de Reclamos', icon: IconMessageReport, badge: openFeedback.length },
    { id: 'transferencia', label: 'Datos de Transferencia', icon: IconBuildingBank },
  ];

  const goSection = (id) => { setSection(id); setSidebarOpen(false); };

  /* ── Acciones de pagos ─────────────────────────────────── */

  const handleApprove = async (payment) => {
    const days = PLANS[payment.plan]?.days || 30;
    if (!window.confirm(`¿Confirmar que impacto la transferencia de ${payment.coach_name} y habilitar ${days} dias?`)) return;
    try {
      await approvePayment(payment.id);
      toast.success(`Pago aprobado: ${days} dias habilitados`);
      load();
    } catch (e) { toast.error('No se pudo aprobar'); console.error(e); }
  };

  const handleReject = async (payment) => {
    const notes = window.prompt('Motivo del rechazo (visible para el coach):', 'La transferencia no impacto');
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
      `Dias de testing para ${coach.name} (0 para quitar la prueba):`,
      '7',
    );
    if (input === null) return;
    const days = Number(input);
    if (!Number.isFinite(days) || days < 0) { toast.error('Ingresa un numero de dias valido'); return; }
    try {
      const until = days === 0 ? null : new Date(Date.now() + days * 86400000).toISOString();
      await setTrialUntil(coach.id, until);
      toast.success(days === 0
        ? `Testing quitado a ${coach.name}`
        : `${coach.name} en testing hasta el ${new Date(until).toLocaleDateString('es-AR')}`);
      load();
    } catch (e) { toast.error('No se pudo asignar el testing'); console.error(e); }
  };

  /* ── Acciones de suscripciones ─────────────────────────── */

  const handleActivate = async (sub) => {
    try {
      const days = PLANS[sub.plan]?.days || 30;
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + days);
      await activateSubscription(sub.id, periodEnd.toISOString());
      toast.success(`Suscripcion activada (${days} dias)`);
      load();
    } catch (e) { toast.error('No se pudo activar'); console.error(e); }
  };

  const handleSuspend = async (sub) => {
    try {
      await setSubscriptionStatus(sub.id, 'canceled');
      toast.success('Suscripcion suspendida');
      load();
    } catch (e) { toast.error('No se pudo suspender'); console.error(e); }
  };

  /* ── Acciones del buzon ─────────────────────────────────── */

  const handleFeedbackStatus = async (item, st) => {
    try {
      let reply;
      if (st === 'resolved') {
        reply = window.prompt('Respuesta para el coach (opcional):', item.admin_reply || '');
        if (reply === null) return;
      }
      await setFeedbackStatus(item.id, st, reply === '' ? null : reply);
      toast.success('Reporte actualizado');
      load();
    } catch (e) { toast.error('No se pudo actualizar'); console.error(e); }
  };

  /* ── Filtrado de Clientes ───────────────────────────────── */

  const filteredCoaches = useMemo(() => {
    return coaches.filter((c) => {
      // Filtro por texto
      if (clientSearch.trim()) {
        const q = clientSearch.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesPlan = c.subscription?.plan?.toLowerCase().includes(q);
        if (!matchesName && !matchesPlan) return false;
      }

      // Filtro por estado
      if (clientFilter === 'saturated') return c.is_freemium_saturated;
      if (clientFilter === 'churn_risk') return c.is_churn_risk;
      if (clientFilter === 'active') {
        return c.subscription?.status === 'active' && new Date(c.subscription.current_period_end).getTime() > Date.now();
      }
      if (clientFilter === 'freemium') {
        const isPaid = c.subscription?.status === 'active' && new Date(c.subscription.current_period_end).getTime() > Date.now();
        return !isPaid;
      }
      return true;
    });
  }, [coaches, clientSearch, clientFilter]);

  /* ── Sidebar (desktop y mobile drawer) ──────────────────── */

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-3">
      <p className="px-3 pt-2 pb-1 text-2xs font-semibold text-text-muted uppercase tracking-wider">Administracion</p>
      {SECTIONS.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => goSection(id)}
          className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            section === id
              ? 'bg-accent text-primary-bg font-semibold'
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
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-primary-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-primary hover:bg-primary-bg transition-colors"
              aria-label="Abrir menu"
            >
              <IconMenu2 stroke={1.75} className="h-5 w-5" />
            </button>
            <Link to="/" className="flex-shrink-0" title="Ir al inicio de Mock">
              <img
                src="/mz-logo-mark.PNG"
                alt="Mock"
                className="h-8 w-auto object-contain mix-blend-multiply"
              />
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-text-primary font-display leading-tight truncate">Admin · Mock</h1>
              <p className="text-xs text-text-muted truncate">{user?.name} · Rol Administrador</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <IconBarbell stroke={1.75} className="h-4 w-4" />
              <span className="hidden sm:inline">Panel de Entrenador</span>
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
              <span className="text-sm font-bold text-text-primary font-display">Menu de Navegacion</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-primary-bg transition-colors"
                aria-label="Cerrar menu"
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

        {/* Contenido Principal */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8">
          {loading ? (
            <div className="rounded-xl border border-border bg-primary-surface p-12 text-center">
              <p className="text-sm text-text-muted">Cargando metricas y datos del sistema...</p>
            </div>
          ) : (
            <>
              {/* ══ METRICAS Y NEGOCIO ══ */}
              {section === 'metricas' && (
                <div className="space-y-8">
                  <AdminMetricsOverview metrics={metrics} onSelectSection={goSection} />
                  <AdminFunnelView funnel={funnel} />
                </div>
              )}

              {/* ══ PAGOS: IMPACTOS Y FACTURACION ══ */}
              {section === 'pagos' && (
                <Panel
                  title="Auditoria de Pagos y Facturacion"
                  subtitle="Verifica transferencias manuales informadas e inspecciona pagos procesados por Mercado Pago."
                >
                  {payments.length === 0 ? (
                    <p className="text-sm text-text-muted p-6">No hay registros de pagos informados todavia.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {payments.map((p) => {
                        const st = PAYMENT_STATUS[p.status] || { label: p.status, variant: 'default' };
                        const isMP = p.payment_method === 'mercadopago' || Boolean(p.mp_payment_id);
                        return (
                          <div key={p.id} className="px-4 sm:px-6 py-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                            <div className="min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-text-primary">{p.coach_name}</p>
                                  {isMP ? (
                                    <Badge variant="accent" size="sm">Mercado Pago</Badge>
                                  ) : (
                                    <Badge variant="secondary" size="sm">Transferencia</Badge>
                                  )}
                                </div>
                                <p className="font-mono text-sm font-bold text-text-primary sm:hidden">
                                  {p.amount_ars ? `$${Number(p.amount_ars).toLocaleString('es-AR')} ARS` : `$${p.amount_usd} USD`}
                                </p>
                              </div>
                              <p className="mt-1 text-xs text-text-muted">
                                {PLAN_LABEL[p.plan] || p.plan}
                                <span className="hidden sm:inline">
                                  {' · '}
                                  {p.amount_ars ? `$${Number(p.amount_ars).toLocaleString('es-AR')} ARS` : `$${p.amount_usd} USD`}
                                </span>
                                {' · '}
                                {new Date(p.created_at).toLocaleDateString('es-AR')}
                                {p.reference && ` · Ref: ${p.reference}`}
                                {p.mp_payment_id && ` · MP ID: ${p.mp_payment_id}`}
                                {p.status === 'approved' && p.period_end &&
                                  ` · Periodo vigente hasta ${new Date(p.period_end).toLocaleDateString('es-AR')}`}
                              </p>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0">
                              <Badge variant={st.variant}>{st.label}</Badge>
                              {p.receipt_path && (
                                <Button size="sm" variant="ghost" onClick={() => handleViewReceipt(p)}>
                                  <IconExternalLink stroke={1.75} className="h-4 w-4" /> Comprobante
                                </Button>
                              )}
                              {p.status === 'submitted' && (
                                <>
                                  <Button size="sm" variant="accent" onClick={() => handleApprove(p)}>Confirmar Impacto</Button>
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
                  title="Clientes, Accesos y Salud de Cartera"
                  subtitle="Control de acceso granular, seguimiento del limite Freemium (3 rutinas) y prevencion de abandono."
                >
                  {/* Barra de Filtros y Busqueda */}
                  <div className="p-4 border-b border-border bg-primary-bg/50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <IconSearch stroke={1.75} className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o plan..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-primary-surface text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <IconFilter stroke={1.75} className="h-4 w-4 text-text-muted" />
                      <select
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        className="h-8 rounded-lg border border-border bg-primary-surface px-2.5 text-xs text-text-primary focus:outline-none focus:border-accent"
                      >
                        <option value="all">Todos ({coaches.length})</option>
                        <option value="saturated">Listos para Pro / Saturados ({coaches.filter((c) => c.is_freemium_saturated).length})</option>
                        <option value="churn_risk">Riesgo de Churn ({coaches.filter((c) => c.is_churn_risk).length})</option>
                        <option value="active">Con Pago Vigente</option>
                        <option value="freemium">En Plan Inicial</option>
                      </select>
                    </div>
                  </div>

                  {filteredCoaches.length === 0 ? (
                    <p className="text-sm text-text-muted p-6">No hay usuarios coincidentes con el criterio de busqueda.</p>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredCoaches.map((c) => {
                        const acc = accessInfo(c);
                        return (
                          <div key={c.id} className="px-4 sm:px-6 py-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-medium text-text-primary truncate">{c.name}</p>
                                  {c.role === 'admin' && <Badge variant="accent" size="sm">Admin</Badge>}
                                  <Badge variant={acc.variant} size="sm">{acc.label}</Badge>

                                  {/* Badges de Salud y Oportunidad */}
                                  {c.is_freemium_saturated && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-accent/15 text-accent border border-accent/20">
                                      <IconFlame stroke={1.75} className="h-3 w-3" />
                                      {c.routine_count}/3 rutinas (Listo para Pro)
                                    </span>
                                  )}

                                  {c.is_churn_risk && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-warning/15 text-warning border border-warning/20">
                                      <IconAlertTriangle stroke={1.75} className="h-3 w-3" />
                                      Inactivo {Math.round((Date.now() - new Date(c.last_active_at).getTime()) / 86400000)}d
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-text-muted mt-1.5">
                                  Alta {new Date(c.created_at).toLocaleDateString('es-AR')}
                                  {' · '}
                                  <span className="font-mono font-medium text-text-secondary">{c.routine_count} {c.routine_count === 1 ? 'rutina' : 'rutinas'} en cuenta</span>
                                  {c.subscription
                                    ? ` · ${PLAN_LABEL[c.subscription.plan] || c.subscription.plan}`
                                    : ' · Sin suscripcion de pago'}
                                  {c.subscription?.current_period_end &&
                                    ` · Vence ${new Date(c.subscription.current_period_end).toLocaleDateString('es-AR')}`}
                                </p>
                              </div>

                              {c.role !== 'admin' && (
                                <div className="flex flex-wrap items-center gap-2">
                                  <select
                                    value={c.access_override || ''}
                                    onChange={(e) => handleOverride(c, e.target.value)}
                                    aria-label={`Acceso de ${c.name}`}
                                    className="h-8 rounded-lg border border-border bg-primary-bg px-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                                  >
                                    <option value="">Normal (segun pago)</option>
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
                  <p className="text-xs text-text-muted px-6 py-3 border-t border-border bg-primary-bg/30">
                    El flujo normal es la acreditacion automatica por Mercado Pago o aprobacion de transferencias. Los controles de acceso manual tienen prioridad sobre las politicas RLS de suscripcion.
                  </p>
                </Panel>
              )}

              {/* ══ USO DE LOS EDITORES Y TENDENCIAS ══ */}
              {section === 'uso' && (
                <AdminUsageTrends
                  usage={usage}
                  timeframe={usageTimeframe}
                  onTimeframeChange={handleTimeframeChange}
                  loading={usageLoading}
                />
              )}

              {/* ══ BUZON DE RECLAMOS / BUGS ══ */}
              {section === 'buzon' && (
                <Panel title="Buzon de Reclamos y Reportes" subtitle="Mensajes y solicitudes de soporte enviadas por los entrenadores.">
                  {feedback.length === 0 ? (
                    <p className="text-sm text-text-muted p-6">No hay reportes ni reclamos en el buzon.</p>
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
                              {f.admin_reply && ` · Respuesta del admin: ${f.admin_reply}`}
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

              {/* ══ DATOS DE TRANSFERENCIA ══ */}
              {section === 'transferencia' && <TransferSettings />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ── Componente de Contenedor de Panel ──────────────────────── */

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-border bg-primary-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{title}</h2>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
