/**
 * STEPS del onboarding NUTRICIONAL — preguntas que el coach responde antes de
 * generar el Prompt Maestro. Mismo shape que consume FitterOnboarding:
 *   { id, field, kind: 'text'|'chips'|'textarea'|'completion', required, q, sub,
 *     placeholder, options:[{v,label}], suffix, showIf(metadata) }
 *
 * `showIf` (opcional) permite pasos condicionales: si devuelve false, el paso se
 * oculta. Las preguntas de logística/adherencia solo aparecen en modo detallado.
 *
 * Los `field` coinciden con las claves que lee generateNutritionPrompt().
 * Los value de objetivo/nivelActividad coinciden con las tablas del generador.
 */
const soloDetallado = (metadata = {}) => metadata.nivelDetalle !== 'simple';

export const NUTRITION_STEPS = [
  // ── Identificación ──────────────────────────────────────────
  { id: 'name', section: 'El plan', field: 'name', kind: 'text', required: true,
    q: '¿Cómo se va a llamar el plan?', sub: 'Un nombre para identificarlo.',
    placeholder: 'Ej: Cutting Lucas · 2 meses' },

  // ── Nivel de detalle (condiciona el resto del flujo) ────────
  { id: 'nivelDetalle', section: 'El plan', field: 'nivelDetalle', kind: 'chips', required: true,
    q: '¿Querés un plan detallado o uno simple?',
    sub: 'Simple: 15 preguntas, lo esencial. Detallado: 28 preguntas, suma logística, adherencia y meal prep.',
    options: [
      { v: 'simple', label: 'Simple · recomendado' },
      { v: 'detallado', label: 'Detallado' },
    ] },

  // ── Eje 1: datos para TMB/TDEE ──────────────────────────────
  { id: 'sexo', section: 'El atleta', field: 'sexo', kind: 'chips', required: true,
    q: '¿Sexo biológico del atleta?', sub: 'Cambia la fórmula de Mifflin-St Jeor.',
    options: [{ v: 'Masculino' }, { v: 'Femenino' }] },
  { id: 'edad', section: 'El atleta', inputMode: 'numeric', field: 'edad', kind: 'text', required: true,
    q: '¿Qué edad tiene?', placeholder: 'Ej: 28' },
  { id: 'peso', section: 'El atleta', inputMode: 'numeric', field: 'peso', kind: 'text', required: true,
    q: '¿Cuánto pesa? (kg)', placeholder: 'Ej: 78' },
  { id: 'altura', section: 'El atleta', inputMode: 'numeric', field: 'altura', kind: 'text', required: true,
    q: '¿Cuánto mide? (cm)', placeholder: 'Ej: 178' },
  { id: 'nivelActividad', section: 'El atleta', field: 'nivelActividad', kind: 'chips', required: true,
    q: '¿Qué nivel de actividad tiene?',
    sub: 'Define el factor que multiplica la TMB para el TDEE.',
    options: [
      { v: 'Sedentario', label: 'Sedentario (escritorio, sin entreno)' },
      { v: 'Ligero', label: 'Ligero (1–2 días/sem)' },
      { v: 'Moderado', label: 'Moderado (3–5 días/sem)' },
      { v: 'Muy activo', label: 'Muy activo (6–7 días + trabajo físico)' },
      { v: 'Extremo', label: 'Extremo (doble turno / élite)' },
    ] },
  { id: 'tipoTrabajo', section: 'El atleta', field: 'tipoTrabajo', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Qué tipo de trabajo tiene?', sub: 'Afecta el gasto diario (NEAT).',
    options: [
      { v: 'Sentado', label: 'Sentado / oficina' },
      { v: 'De pie', label: 'De pie / mostrador' },
      { v: 'Físico', label: 'Físico / carga' },
    ] },
  { id: 'horasSueno', section: 'El atleta', field: 'horasSueno', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Cuántas horas duerme en promedio?', sub: 'Impacta recuperación y NEAT.',
    options: [
      { v: 'Menos de 6', label: '< 6 h' },
      { v: '6 a 7', label: '6–7 h' },
      { v: '7 a 8', label: '7–8 h' },
      { v: 'Más de 8', label: '8+ h' },
    ] },

  // ── Eje 2: objetivo ─────────────────────────────────────────
  { id: 'objetivo', section: 'Objetivo', field: 'objetivo', kind: 'chips', required: true,
    q: '¿Cuál es el objetivo?',
    options: [
      { v: 'cutting', label: 'Cutting (bajar grasa)' },
      { v: 'mantenimiento', label: 'Mantenimiento' },
      { v: 'bulk', label: 'Bulk (subir masa)' },
      { v: 'recomposicion', label: 'Recomposición' },
      { v: 'rendimiento', label: 'Rendimiento deportivo' },
    ] },


  // ── Eje 4: timing y comidas ─────────────────────────────────
  { id: 'comidasPorDia', section: 'Rutina diaria', field: 'comidasPorDia', kind: 'chips', required: true,
    q: '¿Cuántas comidas por día prefiere?',
    options: [{ v: '3' }, { v: '4' }, { v: '5' }, { v: '6' }] },
  { id: 'horarioEntreno', section: 'Rutina diaria', field: 'horarioEntreno', kind: 'chips', required: false,
    q: '¿A qué hora entrena?', sub: 'Para ubicar los carbos peri-entreno.',
    options: [
      { v: 'Mañana' }, { v: 'Mediodía' }, { v: 'Tarde' }, { v: 'Noche' },
      { v: 'No entrena', label: 'No entrena' },
    ] },
  { id: 'horarioTrabajo', section: 'Rutina diaria', field: 'horarioTrabajo', kind: 'text', required: false, showIf: soloDetallado,
    q: '¿Qué horario de trabajo / disponibilidad para comer tiene?',
    sub: 'Opcional.', placeholder: 'Ej: 9 a 18 h en oficina, almuerza afuera' },
  { id: 'comeEnFamilia', section: 'Rutina diaria', field: 'comeEnFamilia', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Cena en familia?', sub: 'Si sí, la cena muchas veces no se puede individualizar.',
    options: [{ v: 'Sí' }, { v: 'No' }] },

  // ── Logística / adherencia (Eje 5) — solo plan detallado ────
  { id: 'puedeVianda', section: 'Cocina y logística', field: 'puedeVianda', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Puede preparar vianda?',
    options: [{ v: 'Sí' }, { v: 'No' }] },
  { id: 'cocinaTrabajo', section: 'Cocina y logística', field: 'cocinaTrabajo', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Tiene cocina o heladera en el trabajo?',
    options: [{ v: 'Sí' }, { v: 'No' }] },
  { id: 'tiempoCocina', section: 'Cocina y logística', field: 'tiempoCocina', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Cuánto tiempo tiene para cocinar por día?',
    options: [
      { v: 'Menos de 15', label: '< 15 min' },
      { v: '15 a 30', label: '15–30 min' },
      { v: '30 a 60', label: '30–60 min' },
      { v: 'Más de 60', label: '60+ min' },
    ] },
  { id: 'heladera', section: 'Cocina y logística', field: 'heladera', kind: 'chips', required: false, showIf: soloDetallado,
    q: '¿Tiene heladera y freezer?', sub: 'Define la viabilidad del meal prep.',
    options: [
      { v: 'Heladera y freezer', label: 'Heladera y freezer' },
      { v: 'Solo heladera', label: 'Solo heladera' },
      { v: 'No', label: 'No / limitado' },
    ] },

  // ── Restricciones (Eje 5) ───────────────────────────────────
  { id: 'patronDietario', section: 'Qué come y qué no', field: 'patronDietario', kind: 'chips', required: true,
    q: '¿Qué patrón dietario sigue?',
    options: [
      { v: 'Omnívoro' }, { v: 'Vegetariano' }, { v: 'Vegano' },
      { v: 'Celíaco', label: 'Celíaco / sin TACC' },
    ] },
  { id: 'alergias', section: 'Qué come y qué no', field: 'alergias', kind: 'textarea', required: false,
    q: '¿Tiene alergias o intolerancias?',
    sub: 'Restricción HARD — la IA nunca incluirá estos alimentos. Opcional.',
    placeholder: 'Ej: intolerante a la lactosa, alergia a frutos secos' },
  { id: 'excluidos', section: 'Qué come y qué no', field: 'excluidos', kind: 'textarea', required: false,
    q: '¿Qué alimentos NO come bajo ningún concepto?',
    sub: 'Restricción HARD por decisión firme. Opcional.',
    placeholder: 'Ej: no como hígado ni vísceras' },
  { id: 'noPrefiere', section: 'Qué come y qué no', field: 'noPrefiere', kind: 'textarea', required: false, showIf: soloDetallado,
    q: '¿Qué alimentos prefiere no comer?',
    sub: 'Preferencia SOFT — puede cederse si hace falta. Opcional.',
    placeholder: 'Ej: prefiero no comer arroz todos los días' },
  { id: 'ancla', section: 'Qué come y qué no', field: 'ancla', kind: 'text', required: false, showIf: soloDetallado,
    q: '¿Qué alimento come todos los días?',
    sub: 'Ancla de adherencia: el plan se construye alrededor de esto. Opcional.',
    placeholder: 'Ej: huevos, mate, banana' },
  { id: 'presupuesto', section: 'Qué come y qué no', field: 'presupuesto', kind: 'text', required: false, showIf: soloDetallado,
    q: '¿Presupuesto semanal aproximado para comida?',
    sub: 'Crítico en Argentina. Opcional.', placeholder: 'Ej: $25.000 por semana' },
  { id: 'suplementacion', section: 'Salud', field: 'suplementacion', kind: 'textarea', required: false, showIf: soloDetallado,
    q: '¿Toma algún suplemento?',
    sub: 'Para no duplicar proteína si ya toma whey. Opcional.',
    placeholder: 'Ej: whey, creatina, multivitamínico' },
  { id: 'patologias', section: 'Salud', field: 'patologias', kind: 'textarea', required: false,
    q: '¿Tiene alguna patología o condición de salud?',
    sub: 'Si hay patología, la IA marcará que requiere derivación a profesional. Opcional.',
    placeholder: 'Ej: hipotiroidismo, resistencia a la insulina' },
  { id: 'notas', section: 'Salud', field: 'notas', kind: 'textarea', required: false, showIf: soloDetallado,
    q: '¿Algo más que quieras agregar?', sub: 'Notas del coach. Opcional.',
    placeholder: 'Ej: viaja mucho, come afuera 3 veces por semana' },
  { id: 'author', section: 'Salud', field: 'author', kind: 'text', required: false,
    q: '¿Quién firma el plan?', sub: 'Opcional.', placeholder: 'Ej: Lic. MZ' },

  // ── Cierre ──────────────────────────────────────────────────
  { id: 'complete', kind: 'completion',
    q: '¡Listo! Generá tu plan con IA', sub: 'Copiá el prompt, pegalo en tu IA preferida y volvé a pegar la respuesta acá.' },
];

export default NUTRITION_STEPS;
