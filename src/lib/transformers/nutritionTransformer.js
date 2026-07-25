/**
 * Transformer del módulo NUTRICIÓN.
 * Convierte el JSON extendido del Prompt Maestro (planMeta + weeks/days/meals +
 * mealPrepGuide + shoppingList + quickReference + notas_semana) al formato interno
 * del editor: { metadata, weeks[].days[].meals[] }.
 *
 * Los extras que no son parte del árbol editable (planMeta, mealPrepGuide, etc.)
 * se guardan bajo metadata para que persistan y el preview/PDF los puedan leer,
 * manteniendo el shape top-level exacto { metadata, weeks } que espera el motor.
 */

import { buildMealRecipeUrl, buildRecipeSearchUrl } from '../recipeSearch.js';

const createId = () => Math.random().toString(36).slice(2, 10);

const str = (v) => (v == null ? '' : String(v));

/** Número tolerante: "380", 380, "380 kcal" → 380; cualquier otra cosa → null. */
const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const parsed = Number(String(v).replace(',', '.').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const mapVariante = (v = {}) => ({
  id: v.id || createId(),
  label: v.label || '',
  ingredientes: v.ingredientes || '',
  kcal: str(v.kcal),
  proteina_g: str(v.proteina_g),
  carbos_g: str(v.carbos_g),
  grasas_g: str(v.grasas_g),
  // La IA ya no manda links (gastaban ~35 tokens por ítem y alucinaba 404s):
  // la búsqueda se arma del label/ingredientes.
  videoUrl: buildRecipeSearchUrl(v.videoUrl || v.label || v.ingredientes),
});

const mapMeal = (m = {}) => ({
  id: m.id || createId(),
  name: m.name || m.nombre || '',
  hora: m.hora || '',
  kcal: str(m.kcal),
  proteina_g: str(m.proteina_g),
  carbos_g: str(m.carbos_g),
  grasas_g: str(m.grasas_g),
  ingredientes: m.ingredientes || '',
  preparacion: m.preparacion || '',
  sustituciones: m.sustituciones || '',
  videoUrl: buildMealRecipeUrl(m),
  nota_timing: m.nota_timing || '',
  variantes: Array.isArray(m.variantes) ? m.variantes.map(mapVariante) : [],
});

/**
 * Suma los macros de las comidas del día. Antes se le pedía a la IA
 * ("totalDia") y muchas veces la cuenta no cerraba; acá siempre cierra.
 */
const deriveTotalDia = (meals = []) => {
  const total = { kcal: 0, proteina_g: 0, carbos_g: 0, grasas_g: 0 };
  let hasAny = false;

  for (const meal of meals) {
    for (const key of Object.keys(total)) {
      const value = num(meal[key]);
      if (value !== null) {
        total[key] += value;
        hasAny = true;
      }
    }
  }
  if (!hasAny) return {};

  return Object.fromEntries(
    Object.entries(total)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => [k, Math.round(v)]),
  );
};

const mapDay = (d = {}, index = 0) => {
  const meals = Array.isArray(d.meals)
    ? d.meals.map(mapMeal)
    : Array.isArray(d.comidas)
      ? d.comidas.map(mapMeal)
      : [];

  // Se respeta el totalDia de la IA solo si trae kcal; si no, se calcula.
  const provided = d.totalDia && num(d.totalDia.kcal) !== null ? d.totalDia : null;

  return {
    id: d.id || createId(),
    name: d.dayLabel || d.name || d.nombre || `Día ${index + 1}`,
    type: 'ALIMENTACION',
    esDiaEntreno: !!(d.esDiaEntreno ?? d.esDialEntreno),
    totalDia: provided || deriveTotalDia(meals),
    meals,
  };
};

/**
 * Tarjeta de heladera. Es una proyección de los días: pedírsela a la IA
 * duplicaba información (y tokens). Se arma con la primera semana.
 */
const deriveQuickReference = (weeks = []) => {
  const days = weeks[0]?.days || [];
  return days
    .filter((day) => (day.meals || []).length > 0)
    .map((day) => ({
      dia: day.name,
      esDiaEntreno: day.esDiaEntreno,
      comidas: day.meals.map((meal) => ({
        nombre: meal.name,
        hora: meal.hora,
        kcal: num(meal.kcal) ?? '',
      })),
      totalKcal: day.totalDia?.kcal ?? '',
    }));
};

const mapWeek = (w = {}, index = 0) => ({
  id: w.id || createId(),
  title: w.weekLabel || w.title || w.nombre || `Semana ${index + 1}`,
  summary: w.summary || '',
  notes: w.notes || '',
  days: Array.isArray(w.days)
    ? w.days.map(mapDay)
    : Array.isArray(w.dias)
      ? w.dias.map(mapDay)
      : [],
});

/**
 * Convierte el JSON del Prompt Maestro nutricional al árbol interno del editor.
 * Tolerante: acepta también un plan ya en formato interno (round-trip del editor
 * JSON) sin romperlo.
 * @param {Object} json
 * @returns {{ metadata: Object, weeks: Array }}
 */
export function nutritionAIToEditor(json = {}) {
  const weeksSource = Array.isArray(json.weeks) ? json.weeks : [];

  // Si ya viene en formato interno (metadata + weeks[].days[].meals), lo devolvemos
  // normalizado igual (re-mapea para asegurar ids y strings).
  const metaSource = json.metadata || {};

  const weeks = weeksSource.length
    ? weeksSource.map(mapWeek)
    : [{ id: createId(), title: 'Semana estándar', summary: '', notes: '', days: [] }];

  // quickReference se deriva salvo que venga cargada (planes viejos guardados).
  const providedQuick = json.quickReference || metaSource.quickReference;
  const quickReference =
    Array.isArray(providedQuick) && providedQuick.length
      ? providedQuick
      : deriveQuickReference(weeks);

  return {
    metadata: {
      name: json.name || metaSource.name || '',
      author: metaSource.author || json.author || '',
      // Extras del JSON extendido (persisten para preview / PDF)
      planMeta: json.planMeta || metaSource.planMeta || {},
      mealPrepGuide: json.mealPrepGuide || metaSource.mealPrepGuide || [],
      shoppingList: json.shoppingList || metaSource.shoppingList || {},
      quickReference,
      notas_semana: json.notas_semana || metaSource.notas_semana || [],
    },
    weeks,
  };
}

/**
 * Import universal del módulo nutrición: valida mínimamente y transforma.
 * @param {Object} jsonData
 * @returns {{ success: boolean, data?: Object, errors?: string[] }}
 */
export function universalImportNutrition(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    return { success: false, errors: ['El contenido no es un objeto JSON válido.'] };
  }
  if (!Array.isArray(jsonData.weeks) || jsonData.weeks.length === 0) {
    return {
      success: false,
      errors: [
        'El JSON no contiene semanas (campo "weeks"). Asegurate de copiar el JSON completo que generó la IA con el Prompt Maestro nutricional.',
      ],
    };
  }
  try {
    return { success: true, data: nutritionAIToEditor(jsonData) };
  } catch (error) {
    return { success: false, errors: [`Error al procesar el JSON nutricional: ${error.message}`] };
  }
}

export default { nutritionAIToEditor, universalImportNutrition };
