/**
 * Generador de Prompt Maestro NUTRICIONAL para IAs externas (ChatGPT/Claude/Gemini).
 *
 * No hay API de IA integrada: esta función devuelve un texto que el coach copia,
 * pega en la IA y trae de vuelta el JSON.
 *
 * ── PRESUPUESTO DE TOKENS (importante) ────────────────────────────────────
 * Las IAs gratuitas cortan la respuesta alrededor de los 4k–8k tokens de
 * salida. El JSON anterior pedía ~14k para 7 días y se truncaba. Lo que se
 * sacó del pedido NO se perdió: se deriva en el cliente al importar
 * (src/lib/transformers/nutritionTransformer.js):
 *   • videoUrl de cada comida y variante → se arma del nombre (recipeSearch.js).
 *   • totalDia → se suma de las comidas (además así la cuenta siempre cierra).
 *   • quickReference (tarjeta de heladera) → es una proyección de los días.
 * Además AMBOS modos piden DÍAS MODELO (2 en simple, 3 en detallado) en vez
 * de los 7 días: pedir la semana entera generaba 5 días de relleno y hacía
 * que las IAs gratuitas cortaran la respuesta.
 */

// Factores de actividad (Eje 1). El value coincide con las opciones del onboarding.
const ACTIVITY_FACTORS = {
  Sedentario: { factor: 1.2, desc: 'Trabajo de escritorio, sin entrenamiento' },
  Ligero: { factor: 1.375, desc: '1–2 días de entrenamiento por semana' },
  Moderado: { factor: 1.55, desc: '3–5 días de entrenamiento por semana' },
  'Muy activo': { factor: 1.725, desc: '6–7 días de entrenamiento + trabajo físico' },
  Extremo: { factor: 1.9, desc: 'Doble turno / atleta de élite' },
};

// Rangos de macros por objetivo (Eje 2).
const OBJECTIVE_MACROS = {
  cutting: {
    label: 'Cutting (déficit calórico)',
    proteina: '2.2–2.5 g/kg',
    carbos: 'Moderado, ciclado según días de entreno',
    grasas: '0.8–1 g/kg (mínimo 0.8)',
    balance: 'Déficit de −300 a −500 kcal sobre el TDEE',
  },
  mantenimiento: {
    label: 'Mantenimiento',
    proteina: '1.6–2 g/kg',
    carbos: 'Según nivel de actividad',
    grasas: '0.8–1 g/kg',
    balance: '±0 kcal sobre el TDEE',
  },
  bulk: {
    label: 'Bulk limpio (superávit)',
    proteina: '1.8–2.2 g/kg',
    carbos: 'Alto, concentrado en la periferia de los entrenos',
    grasas: '0.8–1 g/kg',
    balance: 'Superávit de +200 a +350 kcal sobre el TDEE',
  },
  recomposicion: {
    label: 'Recomposición corporal',
    proteina: '2.2–2.6 g/kg',
    carbos: 'Ciclado (alto en días de entreno, bajo en días de descanso)',
    grasas: '0.8 g/kg',
    balance: '±0 kcal o leve déficit sobre el TDEE',
  },
  rendimiento: {
    label: 'Rendimiento deportivo',
    proteina: '1.8–2.2 g/kg',
    carbos: '5–7 g/kg (prioridad para el rendimiento)',
    grasas: '1–1.2 g/kg',
    balance: 'Superávit moderado sobre el TDEE',
  },
};

const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

const orNone = (v, fallback = 'No especificado') =>
  v != null && String(v).trim() !== '' ? String(v).trim() : fallback;

/** Línea de dato del atleta; se omite entera si no hay valor (ahorra contexto). */
const optional = (label, value, suffix = '') =>
  value != null && String(value).trim() !== '' ? `\n• ${label}: ${String(value).trim()}${suffix}` : '';

/**
 * Genera el Prompt Maestro nutricional a partir de los datos del onboarding.
 * @param {Object} metadata - Respuestas del formulario nutricional.
 * @returns {string} Prompt listo para copiar y pegar en la IA.
 */
export function generateNutritionPrompt(metadata = {}) {
  const {
    name = 'Plan nutricional personalizado',
    author = 'Coach',
    sexo = 'No especificado',
    edad = '',
    peso = '',
    altura = '',
    nivelActividad = 'Moderado',
    tipoTrabajo = '',
    horasSueno = '',
    objetivo = 'mantenimiento',
    nivelDetalle = 'detallado',
    comidasPorDia = '4',
    horarioEntreno = '',
    horarioTrabajo = '',
    comeEnFamilia = '',
    puedeVianda = '',
    cocinaTrabajo = '',
    tiempoCocina = '',
    heladera = '',
    patronDietario = 'Omnívoro',
    alergias = '',
    excluidos = '',
    noPrefiere = '',
    ancla = '',
    presupuesto = '',
    suplementacion = '',
    patologias = '',
    notas = '',
  } = metadata;

  const activity = ACTIVITY_FACTORS[nivelActividad] || ACTIVITY_FACTORS.Moderado;
  const macros = OBJECTIVE_MACROS[objetivo] || OBJECTIVE_MACROS.mantenimiento;
  const esSimple = nivelDetalle === 'simple';

  // ── Estructura de días: siempre la semana completa (Lun–Dom) ─────────
  // El coach necesita un plan real para cada día de la semana, no días-modelo.
  // Cada día tiene su propio conjunto de comidas adaptado a si es día de
  // entrenamiento o descanso. Esto es lo que el atleta recibe en el PDF.
  const estructuraDias = `Generá los 7 días de la semana dentro de weeks[0].days, en este orden:
   1) "Lunes"      (esDiaEntreno: según el horario del atleta)
   2) "Martes"     (esDiaEntreno: según el horario del atleta)
   3) "Miércoles"  (esDiaEntreno: según el horario del atleta)
   4) "Jueves"     (esDiaEntreno: según el horario del atleta)
   5) "Viernes"    (esDiaEntreno: según el horario del atleta)
   6) "Sábado"     (esDiaEntreno: según el horario del atleta)
   7) "Domingo"    (esDiaEntreno: false — día de descanso / social)

   REGLA DE VARIEDAD: Los días de entrenamiento tienen más carbos peri-entreno;
   los días de descanso tienen menos carbos y más grasas. El domingo contempla
   la comida social argentina (asado, pizza, reunión familiar) con estrategia
   real en vez de prohibición.
   Los 7 días deben ser REALMENTE distintos; no copies el mismo menú con gramos cambiados.`;

  const ejemploComida = esSimple
    ? `        {
          "name": "Desayuno",
          "hora": "07:30",
          "kcal": 380, "proteina_g": 30, "carbos_g": 40, "grasas_g": 8,
          "ingredientes": "80g avena, 200ml leche descremada, 1 banana, 10g manteca de maní",
          "preparacion": "Mezclar todo y reposar 5 min.",
          "sustituciones": "Sin avena: 2 tostadas integrales con ricota.",
          "variantes": [
            { "label": "Alternativa rápida", "ingredientes": "3 huevos revueltos, 2 tostadas integrales, 30g port salut", "kcal": 375, "proteina_g": 28, "carbos_g": 36, "grasas_g": 12 }
          ]
        }`
    : `        {
          "name": "Desayuno",
          "hora": "07:30",
          "kcal": 380, "proteina_g": 30, "carbos_g": 40, "grasas_g": 8,
          "ingredientes": "80g avena, 200ml leche descremada, 1 banana, 10g manteca de maní",
          "preparacion": "Mezclar avena con leche fría, agregar banana pisada y manteca de maní. Reposar 5 min.",
          "sustituciones": "Sin avena: 2 tostadas integrales con ricota. Sin banana: 1 manzana.",
          "nota_timing": "Tomalo 30 min antes del entreno si entrenás a la mañana.",
          "variantes": [
            { "label": "Versión rápida (5 min)", "ingredientes": "3 huevos revueltos, 2 tostadas integrales, 30g port salut", "kcal": 375, "proteina_g": 28, "carbos_g": 36, "grasas_g": 12 },
            { "label": "Versión vegana", "ingredientes": "80g avena, 200ml leche de avena, 1 banana, 10g manteca de maní, semillas de chia 10g", "kcal": 370, "proteina_g": 12, "carbos_g": 52, "grasas_g": 11 }
          ]
        }`;

  const bloquesExtra = esSimple
    ? ''
    : `,
  "mealPrepGuide": [
    { "preparacion": "Hervir 500g de lentejas y guardar en vianda", "rinde": "Almuerzo lunes, miércoles y viernes", "conservacion": "Heladera hasta 4 días" }
  ],
  "shoppingList": {
    "carnes_y_huevos": [ { "item": "Huevos", "cantidad": "12 unidades" } ],
    "lacteos": [ { "item": "Yogur griego Ser", "cantidad": "4 unidades" } ],
    "verduleria": [ { "item": "Batata", "cantidad": "1 kg" } ],
    "almacen": [ { "item": "Avena", "cantidad": "500g" } ],
    "aceites_y_condimentos": [ { "item": "Aceite de oliva", "cantidad": "500ml" } ]
  }`;

  const reglasModo = esSimple
    ? `• "variantes": OBLIGATORIA al menos 1 variante por comida (alternativa rápida calóricamente equivalente ±30 kcal).
• "preparacion" en 1 oración. "sustituciones" en 1 línea corta.
• NO incluyas "mealPrepGuide" ni "shoppingList".
• "notas_semana": máximo 2 observaciones.`
    : `• "variantes": OBLIGATORIAS 1–2 opciones calóricamente equivalentes por comida (±25 kcal). NUNCA dejes "variantes": [].
• "shoppingList" en UNIDADES DE SUPERMERCADO reales ("12 unidades", "1 kg"), NO gramos de receta.
• "mealPrepGuide": 2–3 preparaciones batch de la semana.
• "preparacion" concisa (2 oraciones máximo).
• "notas_semana": 2–3 observaciones contextuales.`;

  const prompt = `SOS UN LICENCIADO EN NUTRICIÓN DEPORTIVA ARGENTINO, CON EXPERIENCIA EN COMPOSICIÓN CORPORAL Y ADHERENCIA A LARGO PLAZO.

Tu misión es diseñar un plan nutricional PROFESIONAL, PERSONALIZADO y 100% ADAPTADO AL CONTEXTO ARGENTINO, en formato JSON puro.
Calculás primero las necesidades energéticas del atleta y recién después distribuís las comidas. Usás vocabulario rioplatense y priorizás alimentos que se consiguen en cualquier supermercado o verdulería del país.

${line}
DATOS DEL ATLETA
${line}

• Nombre del plan: ${name}
• Coach que firma: ${author}
• Sexo biológico: ${sexo}
• Edad: ${orNone(edad)} años · Peso: ${orNone(peso)} kg · Altura: ${orNone(altura)} cm
• Nivel de actividad: ${nivelActividad} (${activity.desc}) → factor ×${activity.factor}
• Objetivo: ${macros.label}
• Comidas por día: ${orNone(comidasPorDia, '4')}
• Patrón dietario: ${patronDietario}${optional('Horario de entrenamiento', horarioEntreno)}${optional('Tipo de trabajo (NEAT)', tipoTrabajo)}${optional('Horas de sueño', horasSueno)}${optional('Horario de trabajo / disponibilidad para comer', horarioTrabajo)}${optional('¿Cena en familia?', comeEnFamilia)}${optional('¿Puede preparar vianda?', puedeVianda)}${optional('¿Tiene cocina/heladera en el trabajo?', cocinaTrabajo)}${optional('Tiempo para cocinar', tiempoCocina, ' min/día')}${optional('¿Heladera y freezer?', heladera)}${optional('Suplementación actual', suplementacion)}${optional('Presupuesto semanal', presupuesto)}${optional('Alimento ancla (lo come todos los días — usalo para maximizar adherencia)', ancla)}

${line}
RESTRICCIONES (RESPETAR SIN EXCEPCIÓN)
${line}

RESTRICCIONES HARD (NUNCA incluir estos alimentos):
• Alergias / intolerancias: ${orNone(alergias, 'Ninguna declarada')}
• Alimentos excluidos por decisión firme: ${orNone(excluidos, 'Ninguno')}
• Patrón dietario a respetar: ${patronDietario}

PREFERENCIAS SOFT (evitar salvo que sea imprescindible):
• Alimentos que prefiere no comer: ${orNone(noPrefiere, 'Ninguno')}

SEÑALES DE DERIVACIÓN:
• Patologías / condiciones declaradas: ${orNone(patologias, 'Ninguna')}
Si detectás hipotiroidismo, SOP, resistencia a la insulina, diabetes, enfermedad cardiovascular o un posible TCA, poné "requiereDerivacion": true en planMeta con una nota recomendando consulta con profesional matriculado. NO diseñes un plan terapéutico: el plan sigue siendo de alimentación general saludable.

${line}
EJE 1 — CÁLCULO ENERGÉTICO (hacelo internamente ANTES de distribuir)
${line}

1) TMB con MIFFLIN-ST JEOR (NO Harris-Benedict):
   • Hombres: (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) + 5
   • Mujeres:  (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) − 161
2) TDEE = TMB × ${activity.factor} (factor de este atleta).
3) Aplicá el balance del objetivo para obtener el targetKcal.
4) Reflejá TMB, TDEE, targetKcal y el déficit/superávit en planMeta.

${line}
EJE 2 — MACROS (objetivo: ${macros.label})
${line}

• Proteína: ${macros.proteina}
• Carbohidratos: ${macros.carbos}
• Grasas: ${macros.grasas}
• Balance calórico: ${macros.balance}

Justificá la distribución en "rationale" de planMeta (2 oraciones).
La suma de macros × sus calorías (P=4, C=4, G=9) debe cuadrar con el targetKcal.
Las kcal de las comidas de cada día deben sumar el targetKcal (±3%).

${line}
EJE 3 — CONTEXTO ARGENTINA (el diferenciador real)
${line}

REGLA MAESTRA: si proponés "chicken breast, brócoli y quinoa" sin alternativa local, fallaste.
Construí el plan con ingredientes de Coto, Carrefour, Jumbo o verdulería de barrio.

• PROTEÍNAS: cortes económicos (paleta, marucha, roast beef, nalga, bola de lomo, osobuco), huevo, pollo pata-muslo, ricota, port salut descremado, yogur griego, atún al natural, sardina, lentejas, garbanzos, porotos, tofu.
• CARBOS: avena, batata, papa, arroz integral, fideos integrales, pan integral, frutas de estación (banana, manzana, mandarina).
• GRASAS: maní y manteca de maní, aceite de girasol alto oleico, palta (estacional), nueces/almendras (caras — alternativa con maní).

NO ELIMINAR LA CULTURA ALIMENTARIA (dar estrategia, no prohibición):
• Mate: contemplar el azúcar (calorías ocultas); sugerir stevia si lo toma dulce, no prohibir el ritual.
• Asado del domingo: mejor corte + guarnición inteligente.
• Facturas: sustituir con criterio, no eliminar de un plumazo.

${line}
EJE 4 — TIMING (patrón argentino, NO anglosajón)
${line}

• Desayuno (07:00–09:00): liviano, 15–20% de las kcal.
• Almuerzo (12:00–14:00): LA COMIDA PRINCIPAL, 30–35%.
• Merienda (16:00–18:30): liviana o post-entreno, 10–15%.
• Cena (21:00–23:00): moderada, 25–30%.
• Colación (opcional): 5–10%.

Ubicá los carbos de mayor índice glucémico en la ventana peri-entreno (horario declarado: ${orNone(horarioEntreno, 'no especificado')}).
Si la cena es familiar, dá estrategias de adaptación (qué elegir de lo que hay) en vez de una comida distinta al resto de la familia.

${line}
LENGUAJE
${line}

Segunda persona singular informal ("vos"). Vocabulario argentino:
"kcal" (no "calorías") · "vianda" (no "tupper") · "colación" (no "snack") · "heladera" (no "refrigerador") · "manteca" (no "mantequilla").

${line}
ESTRUCTURA JSON DE SALIDA (COPIAR ESTA FORMA EXACTA)
${line}

${estructuraDias}

Devolvé un ÚNICO objeto JSON con esta estructura. Los valores son de EJEMPLO:
reemplazalos por los del plan real.

{
  "planMeta": {
    "tmb": 1750,
    "tdee": 2450,
    "targetKcal": 1950,
    "deficit": -500,
    "proteina_g": 175,
    "carbos_g": 195,
    "grasas_g": 65,
    "rationale": "Déficit moderado del 20% para preservar masa magra en cutting.",
    "requiereDerivacion": false,
    "notaDerivacion": null
  },
  "weeks": [
    {
      "weekLabel": "Semana estándar",
      "days": [
        {
          "dayLabel": "Día de entrenamiento",
          "esDiaEntreno": true,
          "meals": [
${ejemploComida}
          ]
        }
      ]
    }
  ]${bloquesExtra},
  "notas_semana": [
    "Los días de entreno tienen 10% más de carbos en el almuerzo.",
    "Tomá el mate sin azúcar; si lo necesitás dulce, usá stevia."
  ]
}

CAMPOS QUE **NO** DEBÉS INCLUIR (los calcula el sistema — incluirlos hace que la respuesta se corte):
✗ "videoUrl" en las comidas o variantes (los links se generan solos).
✗ "totalDia" en los días (se suma de las comidas).
✗ "quickReference" (se arma con los días).

REGLAS DEL OUTPUT (obligatorias):
${reglasModo}
• NO uses emojis ni símbolos especiales (↔, ⏱, ☐) en ningún texto: el PDF los imprime rotos.
• NO incluyas micronutrientes (se alucinan) ni precios exactos.

${notas ? `${line}\nNOTAS ADICIONALES DEL COACH\n${line}\n\n${notas}\n` : ''}
${line}
FORMATO DE RESPUESTA — CRÍTICO
${line}

RESPONDÉ ÚNICAMENTE CON EL JSON PURO. NADA MÁS.

✗ NO uses bloques de código markdown (\`\`\`json ni \`\`\`).
✗ NO agregues texto, títulos, resúmenes ni explicaciones antes o después.
✗ NO cierres con frases como "¡Éxito!" o "Espero que te sirva".

✓ COMENZÁ exactamente con: {
✓ TERMINÁ exactamente con: }
✓ Solo JSON válido, texto plano.

PRESUPUESTO DE RESPUESTA — LEER ANTES DE EMPEZAR:
Tenés que TERMINAR el JSON sí o sí. Un JSON cerrado y más corto sirve;
uno cortado a la mitad no sirve para nada. Si ves que te estás quedando sin
espacio, en este orden: acortá "preparacion", luego acortá "sustituciones".
JAMÁS vacíes "variantes" ni omitas días: los 7 días y la variante de cada
comida son INNEGOCIABLES. NUNCA dejes el JSON sin cerrar.

VALIDACIÓN ANTES DE RESPONDER:
1. ¿Empieza con { y termina con }?
2. ¿Es JSON válido y está CERRADO por completo?
3. ¿Las kcal de las comidas suman el targetKcal?
4. ¿Respetaste todas las restricciones hard?
5. ¿Omitiste videoUrl, totalDia y quickReference?
6. ¿Generaste los 7 días de la semana (Lun–Dom)?
7. ¿Cada comida tiene al menos 1 variante en "variantes"?

Generá el plan nutricional AHORA. Profesional. Argentino. Adaptado al atleta.`;

  return prompt;
}

/**
 * Copia el prompt nutricional al portapapeles.
 * @param {Object} metadata
 * @returns {Promise<boolean>}
 */
export async function copyNutritionPromptToClipboard(metadata) {
  const prompt = generateNutritionPrompt(metadata);
  try {
    await navigator.clipboard.writeText(prompt);
    return true;
  } catch {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}
