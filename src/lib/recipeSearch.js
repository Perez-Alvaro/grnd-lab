/**
 * URL de búsqueda de receta en YouTube.
 *
 * Antes se le pedía a la IA que escribiera la URL completa de cada comida y de
 * cada variante: eran ~35 tokens por ítem (el bloque más caro del JSON) y
 * además alucinaba links directos que daban 404. Ahora la arma el cliente a
 * partir del nombre de la receta, que la IA ya escribe igual.
 */

const YT_SEARCH = 'https://www.youtube.com/results?search_query=';

/** Palabras que no aportan nada a una búsqueda de receta. */
const STOP_WORDS = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'con', 'sin', 'y', 'o', 'a', 'al',
  'un', 'una', 'para', 'por', 'en',
]);

/**
 * Si el valor ya es una URL con host, la respeta; si no, arma una búsqueda.
 * @param {string} raw - URL existente o texto libre (nombre de la comida).
 * @returns {string} URL absoluta, o '' si no hay nada usable.
 */
export const buildRecipeSearchUrl = (raw) => {
  if (!raw) return '';
  const text = String(raw).trim();
  if (!text) return '';

  // ¿Ya es una URL?
  if (!/\s/.test(text)) {
    const candidate = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    try {
      const u = new URL(candidate);
      if (u.hostname.includes('.')) return u.href;
    } catch { /* no era URL → búsqueda */ }
  }

  const query = text
    .replace(/^https?:\/\/+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!query) return '';
  return `${YT_SEARCH}${encodeURIComponent(query)}`;
};

/**
 * Arma la búsqueda de receta de una comida priorizando su nombre y, si el
 * nombre es genérico ("Almuerzo", "Cena"), sumando los ingredientes
 * principales para que la búsqueda sea útil.
 * @param {Object} meal - Comida con { name, ingredientes, videoUrl }.
 * @returns {string} URL de búsqueda.
 */
export const buildMealRecipeUrl = (meal = {}) => {
  // Si la IA (o el coach) puso un link explícito, mandan ellos.
  if (meal.videoUrl) return buildRecipeSearchUrl(meal.videoUrl);

  const name = String(meal.name || '').trim();
  const generic = /^(desayuno|almuerzo|merienda|cena|colaci[oó]n|snack|comida)\b/i.test(name);

  if (!generic && name) return buildRecipeSearchUrl(`${name} receta`);

  // Nombre genérico: usar los primeros ingredientes como término de búsqueda.
  const ingredientes = String(meal.ingredientes || '')
    .split(/[,;\n]/)
    .slice(0, 3)
    .map((chunk) =>
      chunk
        .replace(/\d+\s*(g|gr|kg|ml|l|cda|cdita|taza|tazas|unidad|unidades|u)\b/gi, '')
        .replace(/[()]/g, '')
        .trim()
        .split(/\s+/)
        .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
        .join(' '),
    )
    .filter(Boolean)
    .join(' ');

  if (ingredientes) return buildRecipeSearchUrl(`${ingredientes} receta`);
  return name ? buildRecipeSearchUrl(`${name} receta saludable`) : '';
};

/**
 * Arma la búsqueda de video de un ejercicio en YouTube a partir de su nombre o URL provista.
 * Si ya tiene una URL (YouTube, Drive, etc.), la respeta. Si no, busca el nombre del ejercicio en YouTube.
 * @param {Object|string} exercise - Ejercicio con { name, video, videoUrl } o string con nombre/URL.
 * @returns {string} URL de video o de búsqueda en YouTube.
 */
export const buildExerciseVideoUrl = (exercise = {}) => {
  if (!exercise) return '';
  if (typeof exercise === 'string') {
    const trimmed = exercise.trim();
    if (!trimmed) return '';
    // Si ya es URL
    if (/^https?:\/\//i.test(trimmed) || (trimmed.startsWith('www.') && !/\s/.test(trimmed))) {
      return buildRecipeSearchUrl(trimmed);
    }
    const cleanName = trimmed.replace(/^\[ENTRADA EN CALOR\]\s*/i, '').trim();
    return buildRecipeSearchUrl(cleanName || trimmed);
  }

  const rawVideo = String(exercise.video || exercise.videoUrl || '').trim();
  if (rawVideo) {
    return buildRecipeSearchUrl(rawVideo);
  }

  const name = String(exercise.name || exercise.nombre || '').trim();
  if (!name || name === '—' || name === '-') return '';
  const cleanName = name.replace(/^\[ENTRADA EN CALOR\]\s*/i, '').trim();
  return buildRecipeSearchUrl(cleanName || name);
};

export default buildMealRecipeUrl;
