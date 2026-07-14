/**
 * src/lib/nutritionPlans.js
 * Persistencia de planes nutricionales en la nube. Espejo de `routines`:
 * cada plan guarda el JSON completo del editor en `data` y opcionalmente
 * pertenece a un atleta (`athlete_id`). RLS protege por coach.
 */
import { supabase } from './supabaseClient.js';

export async function listNutritionPlans(athleteId = null) {
  let query = supabase
    .from('nutrition_plans')
    .select('id, title, athlete_id, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (athleteId) query = query.eq('athlete_id', athleteId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getNutritionPlan(id) {
  const { data, error } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/**
 * Crea o actualiza un plan nutricional.
 * @param {{id?:string, title:string, data:object, athlete_id?:string|null}} plan
 */
export async function saveNutritionPlan({ id, title, data, athlete_id = null }) {
  if (id) {
    const { data: updated, error } = await supabase
      .from('nutrition_plans')
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
    .from('nutrition_plans')
    .insert({ user_id, title, data, athlete_id })
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function deleteNutritionPlan(id) {
  const { error } = await supabase.from('nutrition_plans').delete().eq('id', id);
  if (error) throw error;
}
