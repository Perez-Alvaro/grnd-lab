/**
 * src/lib/usage.js
 * Tracking liviano de uso de los editores. Fire-and-forget: nunca
 * bloquea ni rompe la UI si falla (offline, RLS, etc.).
 */
import { supabase } from './supabaseClient.js';

/**
 * Registra un evento de uso del usuario actual.
 * @param {'editor_open'|'plan_saved'|'pdf_export'} event
 * @param {'workout'|'nutrition'|null} planType
 */
export function trackEvent(event, planType = null) {
  (async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;
      await supabase
        .from('usage_events')
        .insert({ user_id: userId, event, plan_type: planType });
    } catch {
      /* tracking best-effort: silencioso */
    }
  })();
}
