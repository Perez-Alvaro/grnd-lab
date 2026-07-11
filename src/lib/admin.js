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
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, name, role, created_at')
    .order('created_at', { ascending: false });
  if (pErr) throw pErr;

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
  const active = coaches.filter((c) => c.subscription?.status === 'active').length;
  const pending = coaches.filter((c) => c.subscription?.status === 'pending').length;
  const PRICES = { starter: 5, pro: 10, studio: 15 };
  const mrr = coaches.reduce((sum, c) => {
    if (c.subscription?.status === 'active') return sum + (PRICES[c.subscription.plan] || 0);
    return sum;
  }, 0);
  return { totalCoaches, active, pending, mrr };
}
