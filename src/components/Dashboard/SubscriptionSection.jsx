/**
 * src/components/Dashboard/SubscriptionSection.jsx
 * Sección "Suscripción" del panel del entrenador.
 * Muestra el estado del pago (vigente / enviado / pendiente-vencido),
 * permite informar la transferencia subiendo el comprobante y lista
 * el historial de pagos. La activación la confirma el admin.
 */
import { useEffect, useRef, useState } from 'react';
import {
  IconCreditCard, IconUpload, IconCircleCheck, IconClockPause, IconAlertTriangle,
  IconCopy, IconFileText, IconReceipt, IconTestPipe, IconLock,
} from '@tabler/icons-react';
import useSubscription from '../../hooks/useSubscription.js';
import { PLANS, SELECTED_PLAN_KEY, submitPayment } from '../../lib/subscriptions.js';
import { getTransferInfo, DEFAULT_TRANSFER_INFO } from '../../lib/settings.js';
import { Button, Input, Select, Modal, ModalFooter, Badge } from '../ui';
import { toast } from '../../utils/toast.js';

const STATE_UI = {
  vigente: { variant: 'success', icon: IconCircleCheck },
  habilitado: { variant: 'success', icon: IconCircleCheck },
  testing: { variant: 'accent', icon: IconTestPipe },
  enviado: { variant: 'warning', icon: IconClockPause },
  pendiente: { variant: 'error', icon: IconAlertTriangle },
  bloqueado: { variant: 'error', icon: IconLock },
};

const PAYMENT_STATUS = {
  submitted: { label: 'Enviado · en revisión', variant: 'warning' },
  approved: { label: 'Aprobado', variant: 'success' },
  rejected: { label: 'Rechazado', variant: 'error' },
};

export default function SubscriptionSection() {
  const { loading, subscription, payments, state, refresh } = useSubscription();
  const [modalOpen, setModalOpen] = useState(false);
  const [preselectedPlan, setPreselectedPlan] = useState(null);

  // Si vino del landing con un plan elegido, abrimos el modal directamente.
  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_PLAN_KEY);
    if (stored && PLANS[stored]) {
      localStorage.removeItem(SELECTED_PLAN_KEY);
      setPreselectedPlan(stored);
      setModalOpen(true);
    }
  }, []);

  const ui = STATE_UI[state.code] || STATE_UI.pendiente;
  const StateIcon = ui.icon;
  const planInfo = subscription?.plan ? PLANS[subscription.plan] : null;

  return (
    <section className="mb-8 rounded-xl border border-border bg-primary-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <IconCreditCard stroke={1.75} className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-text-primary font-display">Suscripción</h2>
              {!loading && (
                <Badge variant={ui.variant}>
                  <StateIcon stroke={1.75} className="h-3 w-3" /> {state.label}
                </Badge>
              )}
            </div>
            {loading ? (
              <p className="text-sm text-text-muted mt-1">Cargando…</p>
            ) : state.code === 'vigente' ? (
              <p className="text-sm text-text-secondary mt-1">
                Plan {planInfo?.label || subscription?.plan} · te quedan{' '}
                <strong className="text-text-primary font-mono">{state.daysLeft}</strong> días
                (vence el {state.periodEnd?.toLocaleDateString('es-AR')}).
              </p>
            ) : state.code === 'testing' ? (
              <p className="text-sm text-text-secondary mt-1">
                Tenés acceso completo de prueba hasta el{' '}
                <strong className="text-text-primary">
                  {state.trialUntil?.toLocaleDateString('es-AR')} a las {state.trialUntil?.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </strong>
                . Después vas a necesitar un pago vigente para seguir.
              </p>
            ) : state.code === 'habilitado' ? (
              <p className="text-sm text-text-secondary mt-1">
                El administrador te habilitó el acceso completo sin cargo por ahora.
              </p>
            ) : state.code === 'bloqueado' ? (
              <p className="text-sm text-text-secondary mt-1">
                El administrador bloqueó tu acceso a los editores. Si creés que es un error,
                escribinos desde el buzón de abajo.
              </p>
            ) : state.code === 'enviado' ? (
              <p className="text-sm text-text-secondary mt-1">
                Recibimos tu comprobante. Cuando el administrador confirme el impacto,
                se habilitan los editores automáticamente.
              </p>
            ) : (
              <p className="text-sm text-text-secondary mt-1">
                {state.expired
                  ? 'Tu período venció y los editores quedaron deshabilitados. Informá el pago para reactivarlos.'
                  : 'Todavía no tenés un pago vigente. Elegí un plan e informá la transferencia para empezar.'}
              </p>
            )}
          </div>
        </div>

        <Button variant="accent" size="sm" onClick={() => setModalOpen(true)}>
          <IconUpload stroke={1.75} className="h-4 w-4" /> Informar pago
        </Button>
      </div>

      {/* Historial de pagos */}
      {payments.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Historial de pagos
          </h3>
          <div className="space-y-2">
            {payments.slice(0, 5).map((p) => {
              const st = PAYMENT_STATUS[p.status] || { label: p.status, variant: 'default' };
              return (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-primary-bg px-4 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <IconReceipt stroke={1.75} className="h-4 w-4 text-text-muted flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary">
                        {PLANS[p.plan]?.label || p.plan} · ${p.amount_usd} USD
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(p.created_at).toLocaleDateString('es-AR')}
                        {p.status === 'approved' && p.period_end &&
                          ` · habilitado hasta ${new Date(p.period_end).toLocaleDateString('es-AR')}`}
                        {p.status === 'rejected' && p.admin_notes && ` · ${p.admin_notes}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={st.variant}>{st.label}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PaymentModal
        open={modalOpen}
        initialPlan={preselectedPlan || subscription?.plan}
        onClose={() => setModalOpen(false)}
        onSubmitted={() => { setModalOpen(false); refresh(); }}
      />
    </section>
  );
}

/* ── Modal para informar la transferencia ───────────────────── */

function PaymentModal({ open, initialPlan, onClose, onSubmitted }) {
  const [plan, setPlan] = useState('mensual');
  const [reference, setReference] = useState('');
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  // Los datos de transferencia los edita el admin desde su panel (app_settings).
  const [transferInfo, setTransferInfo] = useState(DEFAULT_TRANSFER_INFO);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPlan(PLANS[initialPlan] ? initialPlan : 'mensual');
      setReference('');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      getTransferInfo().then(setTransferInfo);
    }
  }, [open, initialPlan]);

  const planInfo = PLANS[plan];

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado`);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > 8 * 1024 * 1024) {
      toast.error('El comprobante no puede superar 8 MB');
      e.target.value = '';
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error('Adjuntá el comprobante de la transferencia'); return; }
    setSending(true);
    try {
      await submitPayment({ plan, reference: reference.trim() || null, file });
      toast.success('Pago enviado. Te habilitamos apenas el administrador confirme el impacto.');
      onSubmitted();
    } catch (e) {
      console.error(e);
      toast.error('No se pudo enviar el pago. Probá de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={open} onClose={sending ? undefined : onClose} title="Informar pago por transferencia" size="sm">
      <div className="space-y-4">
        <Select label="Plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
          {Object.entries(PLANS).map(([id, p]) => (
            <option key={id} value={id}>
              {p.label} · ${p.priceUSD} USD ({p.days} días)
            </option>
          ))}
        </Select>

        {/* Datos de la cuenta */}
        <div className="rounded-lg border border-accent/25 bg-accent/5 p-4 space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Transferí ${planInfo.priceUSD} USD (o su equivalente en pesos) a:
          </p>
          <TransferRow label="Titular" value={transferInfo.titular} onCopy={copy} />
          <TransferRow label="Alias" value={transferInfo.alias} onCopy={copy} />
          {transferInfo.cbu && <TransferRow label="CBU" value={transferInfo.cbu} onCopy={copy} />}
          <p className="text-xs text-text-muted pt-1">{transferInfo.nota}</p>
        </div>

        <Input
          label="Referencia (opcional)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Nro de operación o alias desde donde transferiste"
        />

        <div className="space-y-1.5">
          <label htmlFor="receipt-file" className="block text-sm font-medium text-text-secondary">
            Comprobante *
          </label>
          <label
            htmlFor="receipt-file"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-primary-bg px-4 py-3 hover:border-accent/50 transition-colors"
          >
            <IconFileText stroke={1.75} className="h-5 w-5 text-accent flex-shrink-0" />
            <span className="text-sm text-text-secondary truncate">
              {file ? file.name : 'Subí una imagen o PDF del comprobante'}
            </span>
          </label>
          <input
            ref={fileRef}
            id="receipt-file"
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={handleFile}
          />
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={sending}>Cancelar</Button>
        <Button variant="accent" onClick={handleSubmit} loading={sending}>
          {!sending && <IconUpload stroke={1.75} className="h-4 w-4" />}
          Enviar comprobante
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function TransferRow({ label, value, onCopy }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-sm text-text-primary">
        <span className="text-text-muted">{label}:</span>{' '}
        <span className="font-mono">{value}</span>
      </p>
      <button
        type="button"
        onClick={() => onCopy(value, label)}
        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-primary-bg transition-colors"
        aria-label={`Copiar ${label}`}
      >
        <IconCopy stroke={1.75} className="h-4 w-4" />
      </button>
    </div>
  );
}
