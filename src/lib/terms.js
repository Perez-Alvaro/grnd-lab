/**
 * src/lib/terms.js
 * Aceptación de los Términos y Condiciones (columnas de profiles, migración 0008).
 *
 * Degrada con elegancia si la migración todavía no se aplicó: en ese caso se
 * asume aceptado para no dejar a nadie afuera de la app. Mismo criterio que
 * admin.js con la 0006.
 */
import { supabase } from './supabaseClient.js';
import { TERMS_VERSION } from './legalTerms.js';

/**
 * ¿El usuario actual ya aceptó la versión vigente de los T&C?
 * @returns {Promise<{ pendiente: boolean, aceptadoEn: string|null, version: string|null }>}
 */
export async function getMyTermsStatus() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return { pendiente: false, aceptadoEn: null, version: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('terms_accepted_at, terms_version')
    .eq('id', userId)
    .single();

  // Sin columnas (migración 0008 pendiente) → no bloquear el uso de la app.
  if (error) return { pendiente: false, aceptadoEn: null, version: null };

  const aceptadoEn = data?.terms_accepted_at || null;
  const version = data?.terms_version || null;
  return {
    // Se vuelve a pedir si nunca aceptó o si el texto cambió de versión.
    pendiente: !aceptadoEn || version !== TERMS_VERSION,
    aceptadoEn,
    version,
  };
}

/**
 * Registra la aceptación de la versión vigente para el usuario actual.
 * @returns {Promise<boolean>} true si quedó registrada.
 */
export async function acceptTerms() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error('No hay una sesión activa.');

  const { error } = await supabase
    .from('profiles')
    .update({
      terms_accepted_at: new Date().toISOString(),
      terms_version: TERMS_VERSION,
    })
    .eq('id', userId);

  if (error) {
    // 42703 = columna inexistente → la migración 0008 no se aplicó todavía.
    if (error.code === '42703') return false;
    throw new Error(error.message || 'No se pudo registrar la aceptación.');
  }
  return true;
}
