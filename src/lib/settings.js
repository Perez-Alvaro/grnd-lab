/**
 * src/lib/settings.js
 * Configuración editable desde el panel de admin (tabla app_settings).
 *
 * Lectura: cualquier usuario autenticado (el coach necesita los datos de
 * transferencia para pagar). Escritura: solo admin, por RLS.
 *
 * Si la migración 0007 todavía no se aplicó, todo degrada a los valores por
 * defecto en vez de romper el panel — mismo criterio que admin.js con la 0006.
 */
import { supabase } from './supabaseClient.js';

export const TRANSFER_INFO_KEY = 'transfer_info';

/** Valores por defecto: cuenta oficial de cobro para suscripciones por transferencia. */
export const DEFAULT_TRANSFER_INFO = {
  titular: 'Alvaro Raul Perez',
  alias: 'perezalvaro.mp',
  cbu: '0000003100086589169240',
  banco: 'Mercado Pago',
  nota: 'Enviá el comprobante desde tu panel para que activemos tu acceso.',
};

/** Campos del formulario de transferencia (los consume el panel de admin). */
export const TRANSFER_FIELDS = [
  { name: 'titular', label: 'Titular de la cuenta', placeholder: 'Nombre y apellido como figura en el banco', required: true },
  { name: 'alias', label: 'Alias', placeholder: 'perezalvaro.mp', required: true },
  { name: 'cbu', label: 'CBU / CVU', placeholder: '0000003100086589169240', inputMode: 'numeric' },
  { name: 'banco', label: 'Banco o billetera', placeholder: 'Mercado Pago' },
  { name: 'nota', label: 'Nota para el coach', placeholder: 'Instrucción que ve el coach al pagar', textarea: true },
];

/**
 * Lee un ajuste. Nunca lanza: ante cualquier error devuelve el fallback.
 * @param {string} key
 * @param {Object} fallback
 * @returns {Promise<Object>}
 */
export async function getSetting(key, fallback = {}) {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    // Sin tabla (migración pendiente) o sin fila → valores por defecto
    if (error || !data?.value) return fallback;
    return { ...fallback, ...data.value };
  } catch {
    return fallback;
  }
}

/**
 * Guarda un ajuste (upsert). Solo funciona para admin (RLS).
 * @param {string} key
 * @param {Object} value
 * @returns {Promise<Object>} el valor guardado
 */
export async function saveSetting(key, value) {
  const { data, error } = await supabase
    .from('app_settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select('value')
    .single();

  if (error) {
    // Mensajes accionables en vez del error crudo de Postgres
    if (error.code === '42P01') {
      throw new Error('Falta aplicar la migración 0007_app_settings.sql en Supabase.');
    }
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      throw new Error('No tenés permisos de administrador para cambiar esto.');
    }
    throw new Error(error.message || 'No se pudo guardar la configuración.');
  }
  return data.value;
}

/** Datos de transferencia vigentes (DB → fallback a los valores por defecto). */
export const getTransferInfo = () => getSetting(TRANSFER_INFO_KEY, DEFAULT_TRANSFER_INFO);

/** Guarda los datos de transferencia; devuelve lo persistido. */
export const saveTransferInfo = (info) => saveSetting(TRANSFER_INFO_KEY, info);
