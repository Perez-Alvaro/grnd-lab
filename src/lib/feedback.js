/**
 * src/lib/feedback.js
 * Buzón de reclamos y bugs. El entrenador reporta desde su dashboard;
 * el admin lo revisa y resuelve desde el suyo. Todo pasa por RLS.
 */
import { supabase } from './supabaseClient.js';

export const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug / error' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'sugerencia', label: 'Sugerencia' },
];

export const FEEDBACK_STATUS_LABEL = {
  open: 'Abierto',
  in_progress: 'En curso',
  resolved: 'Resuelto',
};

/** Crea un reporte del usuario actual. */
export async function submitFeedback({ type, subject, message }) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error('Sesión expirada');

  const { data, error } = await supabase
    .from('feedback')
    .insert({ user_id: userId, type, subject, message, status: 'open' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// listMyFeedback() se eliminó a propósito: el buzón del coach es SOLO para
// enviar y los reclamos los lee únicamente el admin (listAllFeedback en
// lib/admin.js). Además hacía select('*') sin filtrar por user_id, así que
// para un admin devolvía los reportes de TODOS en su propio panel de coach.
// Si alguna vez hace falta volver a listarlos, filtrar explícitamente por
// user_id y no confiar solo en RLS para acotar el alcance.
