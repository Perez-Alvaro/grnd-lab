/**
 * src/lib/admin.js
 * Consultas del dashboard de admin. Todo pasa por RLS: solo funciona si el
 * usuario actual tiene role='admin' (is_admin()).
 */
import { supabase } from './supabaseClient.js';

/**
 * Lista todos los coaches con su suscripción (si tiene).
 * Devuelve [{ id, name, role, created_at, subscription }]
 */
export async function listCoaches() {
  // Intenta traer las columnas de acceso (migración 0006). Si todavía no
  // están aplicadas, degrada al select base para no romper el dashboard.
  let profiles;
  {
    const full = await supabase
      .from('profiles')
      .select('id, name, role, created_at, access_override, trial_until')
      .order('created_at', { ascending: false });
    if (full.error) {
      const base = await supabase
        .from('profiles')
        .select('id, name, role, created_at')
        .order('created_at', { ascending: false });
      if (base.error) throw base.error;
      profiles = base.data;
    } else {
      profiles = full.data;
    }
  }

  const { data: subs, error: sErr } = await supabase
    .from('subscriptions')
    .select('*');
  if (sErr) throw sErr;

  const subByUser = new Map();
  for (const s of subs) {
    // el más reciente por usuario
    const prev = subByUser.get(s.user_id);
    if (!prev || new Date(s.created_at) > new Date(prev.created_at)) {
      subByUser.set(s.user_id, s);
    }
  }

  return profiles.map((p) => ({ ...p, subscription: subByUser.get(p.id) || null }));
}

/** Activa una suscripción (tras confirmar transferencia). */
export async function activateSubscription(subscriptionId, periodEnd) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'active', current_period_end: periodEnd })
    .eq('id', subscriptionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Cambia el estado de una suscripción a un valor arbitrario permitido. */
export async function setSubscriptionStatus(subscriptionId, status) {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status })
    .eq('id', subscriptionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Métricas simples para las tarjetas del dashboard. */
export async function getMetrics() {
  const coaches = await listCoaches();
  const totalCoaches = coaches.filter((c) => c.role === 'coach').length;
  const now = Date.now();
  const isVigente = (s) =>
    s?.status === 'active' && s.current_period_end && new Date(s.current_period_end).getTime() > now;
  const active = coaches.filter((c) => isVigente(c.subscription)).length;
  const pending = coaches.filter((c) => c.subscription && !isVigente(c.subscription)).length;
  // Equivalente mensual de cada plan (mensual $10, trimestral $27/3, anual $48/12)
  const MONTHLY = { mensual: 10, trimestral: 9, anual: 4, starter: 5, pro: 10, studio: 15 };
  const mrr = coaches.reduce((sum, c) => {
    if (isVigente(c.subscription)) return sum + (MONTHLY[c.subscription.plan] || 0);
    return sum;
  }, 0);
  return { totalCoaches, active, pending, mrr };
}

/* ─────────────────────────────────────────────
   CONTROL DE ACCESO MANUAL (override + testing)
───────────────────────────────────────────── */

/**
 * Fuerza el acceso de un cliente sin importar el plan:
 * 'blocked' (bloqueado siempre), 'unlocked' (libre siempre), null (según pago).
 */
export async function setAccessOverride(userId, override) {
  const { error } = await supabase
    .from('profiles')
    .update({ access_override: override })
    .eq('id', userId);
  if (error) throw error;
}

/**
 * Pone a un cliente en modo testing hasta la fecha dada (ISO) o
 * se lo quita con null. Mientras esté vigente tiene acceso completo.
 */
export async function setTrialUntil(userId, trialUntilIso) {
  const { error } = await supabase
    .from('profiles')
    .update({ trial_until: trialUntilIso })
    .eq('id', userId);
  if (error) throw error;
}

/* ─────────────────────────────────────────────
   PAGOS POR TRANSFERENCIA (impactos)
───────────────────────────────────────────── */

/** Todos los pagos con el nombre del coach. Los 'submitted' van primero. */
export async function listPayments() {
  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, name');
  if (pErr) throw pErr;
  const nameById = new Map(profiles.map((p) => [p.id, p.name]));

  const withNames = payments.map((p) => ({ ...p, coach_name: nameById.get(p.user_id) || '—' }));
  return withNames.sort((a, b) => {
    if (a.status === 'submitted' && b.status !== 'submitted') return -1;
    if (b.status === 'submitted' && a.status !== 'submitted') return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

/** URL firmada (10 min) para ver un comprobante del bucket privado. */
export async function getReceiptUrl(receiptPath) {
  const { data, error } = await supabase.storage
    .from('receipts')
    .createSignedUrl(receiptPath, 600);
  if (error) throw error;
  return data.signedUrl;
}

/** Confirma el impacto: activa/extiende la suscripción según el plan pagado. */
export async function approvePayment(paymentId) {
  const { error } = await supabase.rpc('approve_payment', { p_payment_id: paymentId });
  if (error) throw error;
}

/** Rechaza un pago (no impactó / comprobante inválido). */
export async function rejectPayment(paymentId, notes = null) {
  const { error } = await supabase.rpc('reject_payment', {
    p_payment_id: paymentId,
    p_notes: notes,
  });
  if (error) throw error;
}

/* ─────────────────────────────────────────────
   USO DE LOS EDITORES
───────────────────────────────────────────── */

/** Conteos de creación y de eventos por editor (workout vs nutrition). */
export async function getUsageStats() {
  const count = async (table, filters = {}) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true });
    for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
    const { count: c, error } = await q;
    if (error) throw error;
    return c || 0;
  };

  const [
    routinesTotal, nutritionTotal,
    workoutOpens, nutritionOpens,
    workoutSaves, nutritionSaves,
    workoutPdf, nutritionPdf,
  ] = await Promise.all([
    count('routines'),
    count('nutrition_plans'),
    count('usage_events', { event: 'editor_open', plan_type: 'workout' }),
    count('usage_events', { event: 'editor_open', plan_type: 'nutrition' }),
    count('usage_events', { event: 'plan_saved', plan_type: 'workout' }),
    count('usage_events', { event: 'plan_saved', plan_type: 'nutrition' }),
    count('usage_events', { event: 'pdf_export', plan_type: 'workout' }),
    count('usage_events', { event: 'pdf_export', plan_type: 'nutrition' }),
  ]);

  return {
    workout: { created: routinesTotal, opens: workoutOpens, saves: workoutSaves, pdf: workoutPdf },
    nutrition: { created: nutritionTotal, opens: nutritionOpens, saves: nutritionSaves, pdf: nutritionPdf },
  };
}

/* ─────────────────────────────────────────────
   BUZÓN DE RECLAMOS / BUGS
───────────────────────────────────────────── */

/** Todos los reportes con el nombre del coach. Abiertos primero. */
export async function listAllFeedback() {
  const { data: items, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, name');
  if (pErr) throw pErr;
  const nameById = new Map(profiles.map((p) => [p.id, p.name]));

  const ORDER = { open: 0, in_progress: 1, resolved: 2 };
  return items
    .map((f) => ({ ...f, coach_name: nameById.get(f.user_id) || '—' }))
    .sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9));
}

/** Cambia el estado de un reporte (open / in_progress / resolved). */
export async function setFeedbackStatus(id, status, adminReply = undefined) {
  const patch = { status };
  if (adminReply !== undefined) patch.admin_reply = adminReply;
  const { error } = await supabase.from('feedback').update(patch).eq('id', id);
  if (error) throw error;
}
