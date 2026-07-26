/**
 * src/pdf/utils/pageSizing.js
 * Tamaño de página DINÁMICO para el PDF: cada unidad de contenido (un día de
 * entrenamiento o un día de nutrición) ocupa exactamente una <Page> cuya altura
 * se estima a partir de su contenido, en lugar de un A4 fijo. Así una unidad =
 * una página y nada se corta entre páginas (las páginas usan wrap={false}).
 *
 * Las estimaciones SOBREESTIMAN a propósito y suman un margen de seguridad:
 * si la página queda algo más alta que el contenido, sobra papel en blanco
 * (inofensivo); si quedara más baja, react-pdf recortaría el contenido (grave).
 * Las constantes están calibradas a los estilos de pdfStyles.js / nutritionPdfStyles.js.
 */
import { spacing, typography } from "./pdfStyles.js";

// Ancho fijo = ancho A4 en puntos. Lo único que varía es la altura.
export const PAGE_WIDTH = 595;

const PAD = spacing.pagePadding;                 // 36  (padding de página)
const CELL_PAD = spacing.tableCellPadding * 2;   // 16  (padding vertical de celda: arriba + abajo)
const LINE = 15;                                 // alto aprox. de una línea a fontSize base (11pt)
const SAFETY_MARGIN = 48;                        // colchón extra anti-recorte

// Caracteres aprox. por línea según el ancho de la columna / bloque de texto.
const CH_NAME = 22;   // columna "Ejercicio" (~32% del ancho)
const CH_NOTE = 78;   // notas / texto a ancho casi completo
const CH_FIELD = 90;  // campos de comida (ingredientes / preparación)

const linesOf = (text, per) => Math.max(1, Math.ceil(String(text ?? "").length / per));
const notesToText = (notes) =>
  Array.isArray(notes) ? notes.filter(Boolean).join(" ") : String(notes ?? "");

/* ── RUTINAS ─────────────────────────────────────────────────── */

const WORKOUT_WEEK_HEADER_H = 96;        // título de semana + subtítulo + "volver al índice" + gap
const WORKOUT_DAY_HEADER_H = 60;         // borde + padding de la card del día + nombre + badge
const TABLE_HEADER_H = LINE + CELL_PAD;  // fila de encabezados de columna

/**
 * Altura estimada de la página de UN día de entrenamiento.
 * @param {object} day  día normalizado (type, exercises[], warmupExercises[], notes)
 * @param {{showWeekHeader?: boolean}} opts
 */
export function estimateWorkoutPageHeight(day, { showWeekHeader = false } = {}) {
  let h = PAD * 2 + WORKOUT_DAY_HEADER_H;
  if (showWeekHeader) h += WORKOUT_WEEK_HEADER_H;

  if (day?.type === "DESCANSO") {
    h += linesOf(day.recoveryMessage, CH_NOTE) * LINE;
    return Math.ceil(h + SAFETY_MARGIN);
  }

  const warmup = day?.warmupExercises || [];
  if (warmup.length) {
    h += 24 + TABLE_HEADER_H; // título "Entrada en calor" + header de la tabla
    for (const w of warmup) {
      h += Math.max(LINE, linesOf(w.notes, CH_NOTE) * LINE) + CELL_PAD;
    }
  }

  const exercises = day?.exercises || [];
  if (exercises.length) {
    h += TABLE_HEADER_H;
    for (const ex of exercises) {
      h += linesOf(ex.name, CH_NAME) * LINE + CELL_PAD;       // fila del ejercicio
      const note = notesToText(ex.notes ?? ex.note);
      if (note) h += linesOf(note, CH_NOTE) * LINE + CELL_PAD; // fila de notas
    }
  }

  return Math.ceil(h + SAFETY_MARGIN);
}

/** Altura de una página mínima de semana vacía (mantiene vivo el anchor del índice). */
export function estimateEmptyWeekPageHeight() {
  return Math.ceil(PAD * 2 + WORKOUT_WEEK_HEADER_H + LINE * 2 + SAFETY_MARGIN);
}

/* ── NUTRICIÓN ──────────────────────────────────────────────── */

const RUNNING_HEADER_BAND = 26;  // banda del encabezado corrido (fixed) de las páginas de día
const NUTRI_WEEK_HEADER_H = 56;
const NUTRI_DAY_HEADER_H = 34;

/** Altura estimada de una tarjeta de comida. */
function estimateMealHeight(meal) {
  let h = 20 + 4;                 // padding de la card + margen inferior
  h += typography.medium + 6;     // header (nombre + kcal)

  const hasMacros = [meal.proteina_g, meal.carbos_g, meal.grasas_g].some((v) => v === 0 || v);
  if (hasMacros) h += typography.small + 8;

  if (meal.ingredientes) h += 16 + linesOf(meal.ingredientes, CH_FIELD) * (LINE + 1);
  if (meal.preparacion) h += 16 + linesOf(meal.preparacion, CH_FIELD) * (LINE + 1);
  if (meal.sustituciones) h += linesOf(meal.sustituciones, CH_FIELD) * LINE;
  if (meal.nota_timing) h += LINE + 3;
  if (meal.videoUrl) h += 16;

  const variantes = meal.variantes || [];
  if (variantes.length) {
    h += 12; // separador superior
    for (const v of variantes) {
      h += LINE; // label
      if (v.ingredientes) h += linesOf(v.ingredientes, CH_FIELD) * LINE;
      if (v.videoUrl) h += LINE;
    }
  }
  return h;
}

/**
 * Altura estimada de la página de UN día de nutrición.
 * @param {object} day  día normalizado (meals[], totalDia, esDiaEntreno)
 * @param {{isFirstDayOfWeek?: boolean}} opts
 */
export function estimateNutritionPageHeight(day, { isFirstDayOfWeek = false } = {}) {
  let h = PAD * 2 + RUNNING_HEADER_BAND + NUTRI_DAY_HEADER_H;
  if (isFirstDayOfWeek) h += NUTRI_WEEK_HEADER_H;

  const meals = day?.meals || [];
  if (!meals.length) {
    h += LINE * 2;
  } else {
    for (const m of meals) h += estimateMealHeight(m);
  }

  return Math.ceil(h + SAFETY_MARGIN);
}

/** Altura de una página mínima de semana de nutrición sin días. */
export function estimateNutritionEmptyWeekPageHeight() {
  return Math.ceil(PAD * 2 + NUTRI_WEEK_HEADER_H + LINE * 2 + SAFETY_MARGIN);
}
