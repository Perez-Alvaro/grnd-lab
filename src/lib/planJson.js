/**
 * Parseo tolerante del JSON que devuelven las IAs externas.
 *
 * Problema real: las IAs con límite de tokens de salida (Gemini y ChatGPT
 * gratuitos, sobre todo) cortan la respuesta a la mitad. Antes eso perdía el
 * plan entero con un "JSON inválido". Acá se intenta RECUPERAR lo que llegó
 * completo: se corta en el último elemento cerrado y se cierran las llaves
 * abiertas, así el coach se queda con los días que sí entraron.
 */

/** Limpia markdown y texto alrededor del JSON. */
export const stripToJson = (raw) => {
  let text = String(raw || '').trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  const start =
    firstBrace !== -1 && firstBracket !== -1
      ? Math.min(firstBrace, firstBracket)
      : firstBrace !== -1
        ? firstBrace
        : firstBracket;
  if (start > 0) text = text.slice(start);

  return text.trim();
};

/**
 * Encuentra el último punto donde el JSON tenía un elemento de array cerrado
 * (el corte más seguro) junto con las llaves que quedaban abiertas ahí.
 */
const findLastCompleteElement = (text) => {
  const stack = [];
  let inString = false;
  let escaped = false;
  let best = null;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { if (inString) escaped = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;

    if (ch === '{' || ch === '[') {
      stack.push(ch);
    } else if (ch === '}' || ch === ']') {
      stack.pop();
      // Si lo que queda abierto es un array, acabamos de cerrar un elemento
      // completo (una comida, un día, una semana): es un corte seguro.
      if (stack.length && stack[stack.length - 1] === '[') {
        best = { index: i, open: [...stack] };
      }
    }
  }

  return best;
};

/** Cuenta días y comidas de un plan ya parseado (para informar al coach). */
const countPlan = (data) => {
  const weeks = Array.isArray(data?.weeks) ? data.weeks : [];
  let days = 0;
  let meals = 0;
  for (const w of weeks) {
    const ds = Array.isArray(w?.days) ? w.days : [];
    days += ds.length;
    for (const d of ds) {
      meals += Array.isArray(d?.meals) ? d.meals.length : 0;
    }
  }
  return { weeks: weeks.length, days, meals };
};

/**
 * Parsea el JSON de la IA; si viene cortado, intenta recuperar la parte válida.
 * @param {string} raw - Texto pegado por el coach.
 * @returns {{ ok: boolean, data?: Object, truncated?: boolean, recovered?: Object, error?: string }}
 */
export const parsePlanJSON = (raw) => {
  const text = stripToJson(raw);
  if (!text) {
    return { ok: false, error: 'No encontré nada para importar. Copiá la respuesta de la IA e intentá de nuevo.' };
  }

  try {
    return { ok: true, data: JSON.parse(text), truncated: false };
  } catch { /* sigue el intento de reparación */ }

  // Segundo intento: quizás sobra texto al final (frases de la IA).
  const lastBrace = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  if (lastBrace > 0 && lastBrace < text.length - 1) {
    try {
      return { ok: true, data: JSON.parse(text.slice(0, lastBrace + 1)), truncated: false };
    } catch { /* sigue */ }
  }

  // Tercer intento: la respuesta se cortó → cerrar lo que quedó abierto.
  const cut = findLastCompleteElement(text);
  if (cut) {
    const closers = cut.open
      .slice()
      .reverse()
      .map((ch) => (ch === '{' ? '}' : ']'))
      .join('');
    try {
      const data = JSON.parse(text.slice(0, cut.index + 1) + closers);
      return { ok: true, data, truncated: true, recovered: countPlan(data) };
    } catch { /* irrecuperable */ }
  }

  return {
    ok: false,
    error:
      'La IA cortó la respuesta antes de terminar el JSON y no pude recuperar nada. ' +
      'Pedile "continuá desde donde cortaste" y pegá todo junto, o generá el plan en modo compacto.',
  };
};

export default parsePlanJSON;
