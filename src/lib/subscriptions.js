/**
 * src/lib/subscriptions.js
 * Suscripciones por transferencia bancaria (lado coach).
 * El coach informa el pago subiendo el comprobante → queda 'submitted'
 * ("pago enviado") hasta que el admin confirma el impacto y el sistema
 * habilita los días del plan. Todo pasa por RLS.
 */
import { supabase } from './supabaseClient.js';

/** Planes vendidos en el landing (deben coincidir con PRICING_TIERS). */
export const PLANS = {
  mensual:    { label: 'Mensual',    days: 30,  months: 1,  priceUSD: 10 },
  trimestral: { label: 'Trimestral', days: 90,  months: 3,  priceUSD: 27 },
  anual:      { label: 'Anual',      days: 365, months: 12, priceUSD: 48 },
};

// Los datos de transferencia se editan desde el panel de admin y viven en la
// tabla app_settings (migración 0007). Ver getTransferInfo() en lib/settings.js.

/** Clave usada por el landing para recordar el plan elegido antes del signup. */
export const SELECTED_PLAN_KEY = 'mock:selectedPlan';

/** Flags de acceso del profile propio (override del admin + prueba). */
export async function getMyAccessFlags() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('access_override, trial_until')
    .eq('id', userId)
    .single();
  if (error) return null; // columnas aún sin migrar → flujo normal por pago
  return data;
}

/** Última suscripción del usuario actual (o null). */
export async function getMySubscription() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] || null;
}

/** Pagos informados por el usuario actual, más recientes primero. */
export async function listMyPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Informa una transferencia: sube el comprobante al bucket privado
 * y crea el pago en estado 'submitted' (por chequear por el admin).
 * @param {{plan:string, reference?:string, file:File}} input
 */
export async function submitPayment({ plan, reference, file }) {
  const planInfo = PLANS[plan];
  if (!planInfo) throw new Error('Plan inválido');
  if (!file) throw new Error('Falta el comprobante');

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error('Sesión expirada');

  // Comprobante → receipts/{uid}/{timestamp}-{nombre}
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error: upErr } = await supabase.storage
    .from('receipts')
    .upload(path, file, { contentType: file.type || 'application/octet-stream' });
  if (upErr) throw upErr;

  // Asegura que exista una fila de suscripción (pending hasta la aprobación)
  const existing = await getMySubscription();
  let subscriptionId = existing?.id || null;
  if (!existing) {
    const { data: created, error: subErr } = await supabase
      .from('subscriptions')
      .insert({ user_id: userId, plan, status: 'pending' })
      .select()
      .single();
    if (subErr) throw subErr;
    subscriptionId = created.id;
  }

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      subscription_id: subscriptionId,
      plan,
      amount_usd: planInfo.priceUSD,
      reference: reference || null,
      receipt_path: path,
      status: 'submitted',
    })
    .select()
    .single();
  if (error) throw error;
  return payment;
}

/**
 * Estado de acceso para la UI. `hasAccess` decide si los editores
 * están habilitados. Códigos posibles:
 *  - 'bloqueado' → el admin bloqueó el acceso (gana sobre todo).
 *  - 'vigente'   → pago vigente: suscripción activa y período sin vencer.
 *  - 'habilitado'→ acceso libre otorgado por el admin (sin importar pago).
 *  - 'testing'   → período de prueba activo (24 hs del alta o el que asignó el admin).
 *  - 'enviado'   → pago enviado: comprobante esperando revisión del admin.
 *  - 'pendiente' → pago pendiente/vencido: sin pago o período vencido.
 */
export function getSubscriptionState(subscription, payments = [], accessFlags = null) {
  const now = Date.now();
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;
  const trialUntil = accessFlags?.trial_until ? new Date(accessFlags.trial_until) : null;

  if (accessFlags?.access_override === 'blocked') {
    return {
      code: 'bloqueado', label: 'Acceso bloqueado', hasAccess: false,
      daysLeft: 0, periodEnd, trialUntil, expired: false,
    };
  }

  if (subscription?.status === 'active' && periodEnd && periodEnd.getTime() > now) {
    const daysLeft = Math.max(0, Math.ceil((periodEnd.getTime() - now) / 86400000));
    return { code: 'vigente', label: 'Pago vigente', hasAccess: true, daysLeft, periodEnd, trialUntil, expired: false };
  }

  if (accessFlags?.access_override === 'unlocked') {
    return {
      code: 'habilitado', label: 'Acceso habilitado por el admin', hasAccess: true,
      daysLeft: 0, periodEnd, trialUntil, expired: false,
    };
  }

  if (trialUntil && trialUntil.getTime() > now) {
    const hoursLeft = Math.max(1, Math.ceil((trialUntil.getTime() - now) / 3600000));
    return {
      code: 'testing', label: 'Período de prueba', hasAccess: true,
      daysLeft: Math.ceil(hoursLeft / 24), hoursLeft, periodEnd, trialUntil, expired: false,
    };
  }

  if (payments.some((p) => p.status === 'submitted')) {
    return { code: 'enviado', label: 'Pago enviado · en revisión', hasAccess: false, daysLeft: 0, periodEnd, trialUntil, expired: false };
  }

  const expired = Boolean(periodEnd && periodEnd.getTime() <= now);
  return {
    code: 'pendiente',
    label: expired ? 'Pago vencido' : 'Pago pendiente',
    hasAccess: false,
    daysLeft: 0,
    periodEnd,
    trialUntil,
    expired,
  };
}
