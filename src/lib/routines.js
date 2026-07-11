/**
 * src/lib/routines.js
 * Persistencia de rutinas en la nube. Cada rutina guarda el JSON completo del
 * editor en `data` y opcionalmente pertenece a un atleta (`athlete_id`).
 */
import { supabase } from './supabaseClient.js';

export async function listRoutines(athleteId = null) {
  let query = supabase
    .from('routines')
    .select('id, title, athlete_id, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (athleteId) query = query.eq('athlete_id', athleteId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getRoutine(id) {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Crea o actualiza una rutina.
 * @param {{id?:string, title:string, data:object, athlete_id?:string|null}} routine
 */
export async function saveRoutine({ id, title, data, athlete_id = null }) {
  if (id) {
    const { data: updated, error } = await supabase
      .from('routines')
      .update({ title, data, athlete_id })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  }
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData?.user?.id;
  const { data: created, error } = await supabase
    .from('routines')
    .insert({ user_id, title, data, athlete_id })
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function deleteRoutine(id) {
  const { error } = await supabase.from('routines').delete().eq('id', id);
  if (error) throw error;
}
