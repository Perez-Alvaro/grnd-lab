/**
 * src/lib/admin.js
 * Consultas analiticas y operativas del dashboard de admin.
 * Todo pasa por RLS: solo funciona si el usuario actual tiene role='admin' (is_admin()).
 */
import { supabase } from './supabaseClient.js';

/**
 * Ejecuta una consulta de Supabase de manera segura.
 * Como PostgrestBuilder implementa .then pero no .catch,
 * await resuelve la consulta y previene excepciones de ejecucion.
 */
async function safeQuery(queryPromise, fallback = []) {
  try {
    const res = await queryPromise;
    if (res?.error) {
      console.warn('Supabase query warning:', res.error);
      return fallback;
    }
    return res?.data ?? fallback;
  } catch (err) {
    console.warn('Supabase query error:', err);
    return fallback;
  }
}

/**
 * Lista todos los coaches con su suscripcion, conteo de rutinas y estado de actividad.
 * Devuelve [{ id, name, role, created_at, subscription, access_override, trial_until, routine_count, last_active_at, is_churn_risk, is_freemium_saturated }]
 */
export async function listCoaches() {
  let profiles = [];
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
      profiles = base.data || [];
    } else {
      profiles = full.data || [];
    }
  }

  // Traer suscripciones, rutinas y ultimos eventos de forma segura
  const [subs, routines, events] = await Promise.all([
    safeQuery(supabase.from('subscriptions').select('*'), []),
    safeQuery(supabase.from('routines').select('id, user_id, updated_at, created_at'), []),
    safeQuery(supabase.from('usage_events').select('user_id, created_at').order('created_at', { ascending: false }).limit(500), []),
  ]);

  // Indexar suscripcion mas reciente por usuario
  const subByUser = new Map();
  for (const s of subs) {
    const prev = subByUser.get(s.user_id);
    if (!prev || new Date(s.created_at) > new Date(prev.created_at)) {
      subByUser.set(s.user_id, s);
    }
  }

  // Conteo de rutinas y fecha de ultima rutina por usuario
  const routinesByUser = new Map();
  const lastRoutineDateByUser = new Map();
  for (const r of routines) {
    routinesByUser.set(r.user_id, (routinesByUser.get(r.user_id) || 0) + 1);
    const date = r.updated_at || r.created_at;
    const prevDate = lastRoutineDateByUser.get(r.user_id);
    if (!prevDate || new Date(date) > new Date(prevDate)) {
      lastRoutineDateByUser.set(r.user_id, date);
    }
  }

  // Ultimo evento de uso por usuario
  const lastEventByUser = new Map();
  for (const ev of events) {
    if (!lastEventByUser.has(ev.user_id)) {
      lastEventByUser.set(ev.user_id, ev.created_at);
    }
  }

  const now = Date.now();
  const fourteenDaysMs = 14 * 86400000;

  return profiles.map((p) => {
    const sub = subByUser.get(p.id) || null;
    const routineCount = routinesByUser.get(p.id) || 0;
    const lastRoutine = lastRoutineDateByUser.get(p.id);
    const lastEvent = lastEventByUser.get(p.id);

    // Determinar la fecha de actividad mas reciente
    let lastActiveAt = p.created_at;
    if (lastRoutine && new Date(lastRoutine).getTime() > new Date(lastActiveAt).getTime()) {
      lastActiveAt = lastRoutine;
    }
    if (lastEvent && new Date(lastEvent).getTime() > new Date(lastActiveAt).getTime()) {
      lastActiveAt = lastEvent;
    }

    const isActiveSub = sub?.status === 'active' && sub.current_period_end && new Date(sub.current_period_end).getTime() > now;
    const isPaid = isActiveSub || p.access_override === 'unlocked';
    const isFreemium = !isPaid;

    // Saturacion Freemium: coach gratuito que ya tiene 2 o 3 rutinas (limite: 3)
    const isFreemiumSaturated = isFreemium && routineCount >= 2;

    // Riesgo de Churn: coach con suscripcion paga que no realiza acciones hace mas de 14 dias
    const isChurnRisk = isActiveSub && p.access_override !== 'blocked' && (now - new Date(lastActiveAt).getTime() > fourteenDaysMs);

    return {
      ...p,
      subscription: sub,
      routine_count: routineCount,
      last_active_at: lastActiveAt,
      is_freemium_saturated: isFreemiumSaturated,
      is_churn_risk: isChurnRisk,
    };
  });
}

/** Activa una suscripcion (tras confirmar transferencia o accion admin). */
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

/** Cambia el estado de una suscripcion a un valor arbitrario permitido. */
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

/**
 * Metricas ejecutivas y financieras completas para la toma de decisiones de negocio.
 * Incluye MRR normalizado (ARS y USD), ARR proyectado, distribucion de planes y alertas.
 */
export async function getMetrics() {
  const [coaches, payments] = await Promise.all([
    listCoaches().catch(() => []),
    listPayments().catch(() => []),
  ]);

  const totalCoaches = coaches.filter((c) => c.role === 'coach').length;
  const now = Date.now();
  const thirtyDaysMs = 30 * 86400000;
  const sevenDaysMs = 7 * 86400000;

  const isVigente = (s) =>
    s?.status === 'active' && s.current_period_end && new Date(s.current_period_end).getTime() > now;

  let active = 0;
  let pending = 0;
  let freemiumCount = 0;
  let freemiumSaturatedCount = 0;
  let churnRiskCount = 0;
  let expiring7d = 0;
  let expiring30d = 0;

  let mrrARS = 0;
  let mrrUSD = 0;

  const planDist = {
    freemium: 0,
    pro_monthly: 0,
    pro_annual: 0,
    legacy: 0,
  };

  for (const c of coaches) {
    if (c.role !== 'coach') continue;
    const sub = c.subscription;
    const vigente = isVigente(sub);

    if (c.is_freemium_saturated) {
      freemiumSaturatedCount++;
    }
    if (c.is_churn_risk) {
      churnRiskCount++;
    }

    if (vigente) {
      active++;
      const end = new Date(sub.current_period_end).getTime();
      if (end - now <= sevenDaysMs) expiring7d++;
      if (end - now <= thirtyDaysMs) expiring30d++;

      if (sub.plan === 'pro_monthly') {
        mrrARS += 15000;
        planDist.pro_monthly++;
      } else if (sub.plan === 'pro_annual') {
        mrrARS += 10000;
        planDist.pro_annual++;
      } else if (sub.plan === 'mensual' || sub.plan === 'pro') {
        mrrUSD += 10;
        planDist.legacy++;
      } else if (sub.plan === 'trimestral') {
        mrrUSD += 9;
        planDist.legacy++;
      } else if (sub.plan === 'anual') {
        mrrUSD += 4;
        planDist.legacy++;
      } else {
        planDist.legacy++;
      }
    } else {
      freemiumCount++;
      planDist.freemium++;
      if (sub && sub.status === 'pending') {
        pending++;
      }
    }
  }

  let cobrado30dARS = 0;
  let cobrado30dUSD = 0;
  let mpPaymentsCount = 0;
  let transferPaymentsCount = 0;

  for (const p of payments) {
    if (p.status === 'approved') {
      const isLast30d = now - new Date(p.created_at).getTime() < thirtyDaysMs;
      if (isLast30d) {
        if (p.amount_ars) {
          cobrado30dARS += Number(p.amount_ars);
        } else if (p.amount_usd) {
          cobrado30dUSD += Number(p.amount_usd);
        }
      }
      if (p.payment_method === 'mercadopago' || p.mp_payment_id) {
        mpPaymentsCount++;
      } else {
        transferPaymentsCount++;
      }
    }
  }

  const conversionRate = totalCoaches > 0 ? Math.round((active / totalCoaches) * 100) : 0;
  const arrARS = mrrARS * 12;
  const arrUSD = mrrUSD * 12;

  return {
    totalCoaches,
    active,
    pending,
    freemiumCount,
    freemiumSaturatedCount,
    churnRiskCount,
    expiring7d,
    expiring30d,
    mrrARS,
    mrrUSD,
    arrARS,
    arrUSD,
    cobrado30dARS,
    cobrado30dUSD,
    conversionRate,
    planDist,
    paymentMethodDist: {
      mercadopago: mpPaymentsCount,
      transfer: transferPaymentsCount,
    },
  };
}

/**
 * Calcula el embudo de valor y activacion (Product-Led Growth).
 * Etapas: Registro -> 1ra Rutina Creada -> 1er PDF Exportado -> Saturacion Freemium -> Pro Pago.
 */
export async function getActivationFunnel() {
  const [coaches, routines, events] = await Promise.all([
    listCoaches().catch(() => []),
    safeQuery(supabase.from('routines').select('user_id'), []),
    safeQuery(supabase.from('usage_events').select('user_id, event'), []),
  ]);

  const totalCoaches = coaches.filter((c) => c.role === 'coach').length;

  const coachesWithRoutines = new Set(routines.map((r) => r.user_id));
  const createdRoutineCount = coaches.filter((c) => c.role === 'coach' && coachesWithRoutines.has(c.id)).length;

  const coachesWithPDF = new Set(
    events.filter((e) => e.event === 'pdf_export').map((e) => e.user_id)
  );
  const exportedPdfCount = coaches.filter((c) => c.role === 'coach' && coachesWithPDF.has(c.id)).length;

  const saturatedCount = coaches.filter((c) => c.role === 'coach' && c.routine_count >= 2).length;

  const now = Date.now();
  const paidCount = coaches.filter((c) => {
    if (c.role !== 'coach') return false;
    const sub = c.subscription;
    return sub?.status === 'active' && sub.current_period_end && new Date(sub.current_period_end).getTime() > now;
  }).length;

  const base = totalCoaches || 1;

  return [
    {
      id: 'signup',
      name: 'Registros',
      count: totalCoaches,
      conversionPct: 100,
      description: 'Entrenadores registrados en la plataforma',
    },
    {
      id: 'routine',
      name: 'Primera Rutina',
      count: createdRoutineCount,
      conversionPct: Math.round((createdRoutineCount / base) * 100),
      description: 'Crearon al menos una rutina de entrenamiento',
    },
    {
      id: 'pdf',
      name: 'Entrega de Valor (PDF)',
      count: exportedPdfCount,
      conversionPct: Math.round((exportedPdfCount / base) * 100),
      description: 'Exportaron su primer PDF con marca de entrenador',
    },
    {
      id: 'saturated',
      name: 'Saturacion Freemium',
      count: saturatedCount,
      conversionPct: Math.round((saturatedCount / base) * 100),
      description: 'Alcanzaron 2 o mas rutinas (candidatos directos a Pro)',
    },
    {
      id: 'paid',
      name: 'Clientes Pro',
      count: paidCount,
      conversionPct: Math.round((paidCount / base) * 100),
      description: 'Suscripcion paga activa (Mercado Pago o transferencia)',
    },
  ];
}

/**
 * Conteos de uso con soporte para rango temporal ('all' | '30d' | '7d').
 * Calcula aperturas, guardados, PDFs y tasa de finalizacion (completion rate).
 */
export async function getUsageStats(timeframe = 'all') {
  let dateFilter = null;
  const now = Date.now();

  if (timeframe === '7d') {
    dateFilter = new Date(now - 7 * 86400000).toISOString();
  } else if (timeframe === '30d') {
    dateFilter = new Date(now - 30 * 86400000).toISOString();
  }

  const countEvents = async (event, planType) => {
    try {
      let q = supabase
        .from('usage_events')
        .select('*', { count: 'exact', head: true })
        .eq('event', event)
        .eq('plan_type', planType);
      if (dateFilter) {
        q = q.gte('created_at', dateFilter);
      }
      const { count, error } = await q;
      if (error) return 0;
      return count || 0;
    } catch {
      return 0;
    }
  };

  const countPlans = async (table) => {
    try {
      let q = supabase.from(table).select('*', { count: 'exact', head: true });
      if (dateFilter) {
        q = q.gte('created_at', dateFilter);
      }
      const { count, error } = await q;
      if (error) return 0;
      return count || 0;
    } catch {
      return 0;
    }
  };

  const sevenDaysAgo = new Date(now - 7 * 86400000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 86400000).toISOString();

  const [
    routinesTotal, nutritionTotal,
    workoutOpens, nutritionOpens,
    workoutSaves, nutritionSaves,
    workoutPdf, nutritionPdf,
    wauEvents, mauEvents,
  ] = await Promise.all([
    countPlans('routines'),
    countPlans('nutrition_plans'),
    countEvents('editor_open', 'workout'),
    countEvents('editor_open', 'nutrition'),
    countEvents('plan_saved', 'workout'),
    countEvents('plan_saved', 'nutrition'),
    countEvents('pdf_export', 'workout'),
    countEvents('pdf_export', 'nutrition'),
    safeQuery(supabase.from('usage_events').select('user_id').gte('created_at', sevenDaysAgo), []),
    safeQuery(supabase.from('usage_events').select('user_id').gte('created_at', thirtyDaysAgo), []),
  ]);

  const wauSet = new Set(wauEvents.map((e) => e.user_id));
  const mauSet = new Set(mauEvents.map((e) => e.user_id));

  const wau = wauSet.size;
  const mau = mauSet.size;
  const stickiness = mau > 0 ? Math.round((wau / mau) * 100) : 0;

  const workoutCompletion = workoutOpens > 0 ? Math.round((workoutPdf / workoutOpens) * 100) : 0;
  const nutritionCompletion = nutritionOpens > 0 ? Math.round((nutritionPdf / nutritionOpens) * 100) : 0;

  return {
    timeframe,
    wau,
    mau,
    stickiness,
    workout: {
      created: routinesTotal,
      opens: workoutOpens,
      saves: workoutSaves,
      pdf: workoutPdf,
      completionRate: workoutCompletion,
    },
    nutrition: {
      created: nutritionTotal,
      opens: nutritionOpens,
      saves: nutritionSaves,
      pdf: nutritionPdf,
      completionRate: nutritionCompletion,
    },
  };
}

/* ─────────────────────────────────────────────
   CONTROL DE ACCESO MANUAL (override + testing)
───────────────────────────────────────────── */

/**
 * Fuerza el acceso de un cliente sin importar el plan:
 * 'blocked' (bloqueado siempre), 'unlocked' (libre siempre), null (segun pago).
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
 * se lo quita con null. Mientras este vigente tiene acceso completo.
 */
export async function setTrialUntil(userId, trialUntilIso) {
  const { error } = await supabase
    .from('profiles')
    .update({ trial_until: trialUntilIso })
    .eq('id', userId);
  if (error) throw error;
}

/* ─────────────────────────────────────────────
   PAGOS (TRANSFERENCIAS Y MERCADO PAGO)
───────────────────────────────────────────── */

/** Todos los pagos con el nombre del coach. Los 'submitted' van primero. */
export async function listPayments() {
  const payments = await safeQuery(
    supabase.from('payments').select('*').order('created_at', { ascending: false }),
    []
  );

  const profiles = await safeQuery(
    supabase.from('profiles').select('id, name'),
    []
  );
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

/** Confirma el impacto: activa/extiende la suscripcion segun el plan pagado. */
export async function approvePayment(paymentId) {
  const { error } = await supabase.rpc('approve_payment', { p_payment_id: paymentId });
  if (error) throw error;
}

/** Rechaza un pago (no impacto / comprobante invalido). */
export async function rejectPayment(paymentId, notes = null) {
  const { error } = await supabase.rpc('reject_payment', {
    p_payment_id: paymentId,
    p_notes: notes,
  });
  if (error) throw error;
}

/* ─────────────────────────────────────────────
   BUZON DE RECLAMOS / BUGS
───────────────────────────────────────────── */

/** Todos los reportes con el nombre del coach. Abiertos primero. */
export async function listAllFeedback() {
  const items = await safeQuery(
    supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    []
  );

  const profiles = await safeQuery(
    supabase.from('profiles').select('id, name'),
    []
  );
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
