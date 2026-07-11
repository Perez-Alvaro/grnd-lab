/**
 * src/lib/athletes.js
 * CRUD de atletas del coach. RLS garantiza que solo se ven/editan los propios.
 */
import { supabase } from './supabaseClient.js';

export async function listAthletes() {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAthlete(id) {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createAthlete({ name, email, goal, level, notes }) {
  const { data: userData } = await supabase.auth.getUser();
  const coach_id = userData?.user?.id;
  const { data, error } = await supabase
    .from('athletes')
    .insert({ coach_id, name, email, goal, level, notes })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAthlete(id, fields) {
  const { data, error } = await supabase
    .from('athletes')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAthlete(id) {
  const { error } = await supabase.from('athletes').delete().eq('id', id);
  if (error) throw error;
}
