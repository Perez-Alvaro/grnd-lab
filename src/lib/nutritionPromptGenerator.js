/**
 * Generador de Prompt Maestro NUTRICIONAL para IAs externas (ChatGPT/Claude/Gemini).
 *
 * No hay API de IA integrada: esta función devuelve un texto que el coach copia,
 * pega en la IA y trae de vuelta el JSON extendido (planMeta + weeks/days/meals +
 * mealPrepGuide + shoppingList + quickReference + notas_semana).
 *
 * Diseño completo en NUTRITION_PLAN_README.md (6 ejes + schema de output).
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
    timeframe = '',
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

  const prompt = `SOS UN LICENCIADO EN NUTRICIÓN DEPORTIVA ARGENTINO, CON EXPERIENCIA EN COMPOSICIÓN CORPORAL Y ADHERENCIA A LARGO PLAZO.

Tu misión es diseñar un plan nutricional PROFESIONAL, PERSONALIZADO y 100% ADAPTADO AL CONTEXTO ARGENTINO, en formato JSON puro.
Calculás primero las necesidades energéticas del atleta y recién después distribuís las comidas. Usás vocabulario rioplatense y priorizás alimentos que se consiguen en cualquier supermercado o verdulería del país.

${line}
👤 DATOS DEL ATLETA
${line}

• Nombre del plan: ${name}
• Coach que firma: ${author}
• Sexo biológico: ${sexo}
• Edad: ${orNone(edad)} años
• Peso: ${orNone(peso)} kg
• Altura: ${orNone(altura)} cm
• Nivel de actividad: ${nivelActividad} (${activity.desc}) → factor ×${activity.factor}
• Tipo de trabajo: ${orNone(tipoTrabajo)} (afecta el NEAT)
• Horas de sueño promedio: ${orNone(horasSueno)} (afecta recuperación y NEAT)
• Objetivo: ${macros.label}
• Plazo objetivo: ${orNone(timeframe, 'Sin plazo definido')}
• Comidas por día preferidas: ${orNone(comidasPorDia, '4')}
• Horario de entrenamiento: ${orNone(horarioEntreno, 'No entrena / no especificado')}
• Horario de trabajo / disponibilidad para comer: ${orNone(horarioTrabajo)}
• ¿Cena en familia?: ${orNone(comeEnFamilia, 'No especificado')}
• ¿Puede preparar vianda?: ${orNone(puedeVianda, 'No especificado')}
• ¿Tiene cocina/heladera en el trabajo?: ${orNone(cocinaTrabajo, 'No especificado')}
• Tiempo disponible para cocinar: ${orNone(tiempoCocina, 'No especificado')} min/día
• ¿Tiene heladera y freezer?: ${orNone(heladera, 'No especificado')}
• Patrón dietario: ${patronDietario}
• Suplementación actual: ${orNone(suplementacion, 'Ninguna')}
• Presupuesto semanal aproximado: ${orNone(presupuesto, 'No especificado')}

🍽️ Alimento ancla (lo come todos los días, usalo para maximizar adherencia): ${orNone(ancla, 'No especificado')}

${line}
⛔ RESTRICCIONES (Eje 5 — RESPETAR SIN EXCEPCIÓN)
${line}

RESTRICCIONES HARD (NUNCA incluir estos alimentos bajo ningún concepto):
• Alergias / intolerancias: ${orNone(alergias, 'Ninguna declarada')}
• Alimentos excluidos por decisión firme: ${orNone(excluidos, 'Ninguno')}
• Patrón dietario a respetar: ${patronDietario}

PREFERENCIAS SOFT (evitar salvo que sea imprescindible):
• Alimentos que prefiere no comer: ${orNone(noPrefiere, 'Ninguno')}

⚠️ SEÑALES DE DERIVACIÓN:
• Patologías / condiciones declaradas: ${orNone(patologias, 'Ninguna')}
Si detectás hipotiroidismo, SOP, resistencia a la insulina, diabetes, enfermedad cardiovascular o un posible TCA (trastorno de la conducta alimentaria), poné "requiereDerivacion": true en planMeta con una nota clara recomendando consulta con profesional matriculado. NO diseñes un plan terapéutico: el plan sigue siendo de alimentación general saludable.

${line}
📐 EJE 1 — CÁLCULO ENERGÉTICO (hacelo internamente ANTES de distribuir)
${line}

1) Calculá la TMB con la fórmula de MIFFLIN-ST JEOR (NO uses Harris-Benedict):
   • Hombres: TMB = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) + 5
   • Mujeres:  TMB = (10 × peso_kg) + (6.25 × altura_cm) − (5 × edad) − 161

2) Calculá el TDEE = TMB × factor de actividad.
   Factor de este atleta: ×${activity.factor} (${nivelActividad}).

   Tabla de referencia:
   • Sedentario (escritorio, sin entreno) ........ ×1.2
   • Ligeramente activo (1–2 días/sem) ........... ×1.375
   • Moderadamente activo (3–5 días/sem) ......... ×1.55
   • Muy activo (6–7 días/sem + trabajo físico) .. ×1.725
   • Extremadamente activo (doble turno/élite) ... ×1.9

3) Aplicá el balance calórico del objetivo para obtener el targetKcal.

4) Reflejá TMB, TDEE, targetKcal y el déficit/superávit en el objeto planMeta.

${line}
📊 EJE 2 — DISTRIBUCIÓN DE MACROS (objetivo: ${macros.label})
${line}

• Proteína: ${macros.proteina}
• Carbohidratos: ${macros.carbos}
• Grasas: ${macros.grasas}
• Balance calórico: ${macros.balance}

Justificá la distribución elegida en el campo "rationale" de planMeta (2–3 oraciones).
La suma de macros × sus calorías (P=4, C=4, G=9 kcal/g) debe cuadrar con el targetKcal.
El "totalDia" de cada día debe cuadrar con el targetKcal (±3%).

${line}
🇦🇷 EJE 3 — CONTEXTO ARGENTINA (el diferenciador real)
${line}

REGLA MAESTRA: si proponés "chicken breast, brócoli y quinoa" sin alternativa local, fallaste.
Construí el plan con ingredientes que se consiguen en Coto, Carrefour, Jumbo o verdulería de barrio.
Para cada alimento importado o caro, incluí una sustitución local entre paréntesis.

PROTEÍNAS ACCESIBLES:
• Cortes económicos con buen perfil: paleta, marucha, roast beef, nalga, bola de lomo, osobuco.
• Huevo (proteína completa y barata — el MVP argentino).
• Pollo pata-muslo (más económico que la pechuga).
• Lácteos: ricota (La Serenísima), port salut descremado, yogur griego (Ser, Danone), cottage.
• Pescado/lata: atún al natural (La Campagnola, Cuisine & Co), sardina, caballa.
• Vegetales: lentejas, garbanzos, porotos negros, tofu (dietéticas/super grandes).

CARBOHIDRATOS:
• Avena (La Paulina, Quaker) — base del desayuno.
• Batata (bajo IG, estacional), papa (subestimada), arroz integral, fideos integrales.
• Pan integral (Bimbo o casero según contexto).
• Frutas baratas de temporada: banana, manzana, mandarina.

GRASAS:
• Maní y manteca de maní (Maní King o genérica de dietética).
• Aceite de girasol alto oleico (alternativa viable al oliva).
• Palta (estacional — dar sustitución), nueces/almendras (caras — alternativa con maní).

NO ELIMINAR LA CULTURA ALIMENTARIA (dar estrategia, no prohibición):
• Mate: contemplar si lleva azúcar (calorías ocultas). No prohibir el ritual — sugerir stevia si lo toma dulce.
• Asado del domingo: elegir mejor corte + guarnición inteligente, no prohibir.
• Medialunas / facturas: sustituir con criterio, no eliminar de un plumazo.

${line}
⏰ EJE 4 — TIMING Y ESTRUCTURA (patrón argentino, NO anglosajón)
${line}

Respetá los horarios de comida argentinos:
• Desayuno (07:00–09:00): liviano, 15–20% de las kcal.
• Almuerzo (12:00–14:00): LA COMIDA PRINCIPAL, 30–35% de las kcal.
• Merienda (16:00–18:30): liviana o post-entreno, 10–15% de las kcal.
• Cena (21:00–23:00): moderada, 25–30% de las kcal.
• Colación (opcional, variable): 5–10% de las kcal.

Ubicá los carbos de mayor índice glucémico en la ventana peri-entreno del atleta
(horario de entreno declarado: ${orNone(horarioEntreno, 'no especificado')}).
Si la cena es familiar, dá estrategias de adaptación (qué elegir de lo que hay) en lugar
de proponer una comida completamente distinta al resto de la familia.

${line}
🎥 EJE — VIDEOS DE RECETAS (campo videoUrl)
${line}

Para CADA comida y CADA variante, generá un "videoUrl" que sea una URL de BÚSQUEDA de YouTube
(NUNCA una URL directa a un video: puede dar 404). Formato exacto:

   https://www.youtube.com/results?search_query=TERMINOS+DE+BUSQUEDA

Usá nombres de recetas en castellano rioplatense y términos específicos del plato argentino.
Ejemplos:
   https://www.youtube.com/results?search_query=milanesa+de+paleta+al+horno+sin+aceite
   https://www.youtube.com/results?search_query=bowl+avena+overnight+oats+receta+facil
   https://www.youtube.com/results?search_query=lentejas+guisadas+argentina+receta+saludable

${line}
🗣️ REGLAS DE LENGUAJE
${line}

Escribí en segunda persona singular informal ("vos"). Usá vocabulario argentino:
• "kcal" (no "calorías") · "vianda" (no "tupper") · "almuerzo" (no "comida del mediodía")
• "colación" (no "snack") · "heladera" (no "refrigerador") · "manteca" (no "mantequilla")

${line}
🧾 EJE 6 — ESTRUCTURA JSON DE SALIDA (COPIAR ESTA FORMA EXACTA)
${line}

Devolvé un ÚNICO objeto JSON con esta estructura. Los valores son de EJEMPLO: reemplazalos
por los del plan real. Generá los 7 días de la semana (Lunes a Domingo) dentro de weeks[0].days.

{
  "planMeta": {
    "tmb": 1750,
    "tdee": 2450,
    "targetKcal": 1950,
    "deficit": -500,
    "proteina_g": 175,
    "carbos_g": 195,
    "grasas_g": 65,
    "rationale": "Déficit moderado del 20% para preservar masa magra en cutting...",
    "requiereDerivacion": false,
    "notaDerivacion": null
  },
  "weeks": [
    {
      "weekLabel": "Semana estándar",
      "days": [
        {
          "dayLabel": "Lunes",
          "esDiaEntreno": true,
          "meals": [
            {
              "name": "Desayuno",
              "hora": "07:30",
              "kcal": 380,
              "proteina_g": 30,
              "carbos_g": 40,
              "grasas_g": 8,
              "ingredientes": "80g avena, 200ml leche descremada, 1 banana, 10g manteca de maní",
              "preparacion": "Mezclar avena con leche fría, agregar banana pisada y manteca de maní. Reposar 5 min.",
              "sustituciones": "Sin avena: 2 tostadas integrales con ricota. Sin banana: 1 manzana.",
              "videoUrl": "https://www.youtube.com/results?search_query=bowl+avena+overnight+oats+receta+facil",
              "nota_timing": "Tomalo 30 min antes del entreno si entrenás a la mañana.",
              "variantes": [
                {
                  "label": "Versión rápida (5 min)",
                  "ingredientes": "3 huevos revueltos, 2 tostadas integrales, 30g port salut",
                  "kcal": 375, "proteina_g": 28, "carbos_g": 36, "grasas_g": 12,
                  "videoUrl": "https://www.youtube.com/results?search_query=huevos+revueltos+desayuno+proteico"
                }
              ]
            }
          ],
          "totalDia": { "kcal": 1950, "proteina_g": 175, "carbos_g": 195, "grasas_g": 65 }
        }
      ]
    }
  ],
  "mealPrepGuide": [
    { "preparacion": "Hervir 500g de lentejas y guardar en vianda", "rinde": "Almuerzo lunes, miércoles y viernes", "conservacion": "Heladera hasta 4 días" }
  ],
  "shoppingList": {
    "carnes_y_huevos": [ { "item": "Huevos", "cantidad": "12 unidades" } ],
    "lacteos": [ { "item": "Yogur griego Ser", "cantidad": "4 unidades (120g c/u)" } ],
    "verduleria": [ { "item": "Batata", "cantidad": "1 kg" } ],
    "almacen": [ { "item": "Avena La Paulina", "cantidad": "500g (1 paquete)" } ],
    "aceites_y_condimentos": [ { "item": "Aceite de oliva", "cantidad": "500ml" } ]
  },
  "quickReference": [
    {
      "dia": "Lunes",
      "esDiaEntreno": true,
      "comidas": [
        { "nombre": "Desayuno", "hora": "07:30", "kcal": 380, "emoji": "🍳" }
      ],
      "totalKcal": 1950
    }
  ],
  "notas_semana": [
    "Los días de entreno tienen 10% más de carbos en el almuerzo.",
    "Tomá el mate sin azúcar; si lo necesitás dulce, usá stevia."
  ]
}

REGLAS DEL OUTPUT (obligatorias):
• "shoppingList" en UNIDADES DE SUPERMERCADO reales (ej: "1 bife mediano", "12 unidades"), NO gramos de receta.
• "variantes": 2–3 opciones calóricamente equivalentes por comida (±25 kcal), cada una con su videoUrl.
• "quickReference" con los 7 días completos (tarjeta de heladera).
• "mealPrepGuide" con al menos 2–3 preparaciones batch de la semana.
• "notas_semana" con al menos 2 observaciones contextuales.
• "preparacion" concisa (2–3 oraciones). NO incluyas micronutrientes (se alucinan) ni precios exactos.

${notas ? `${line}\n📝 NOTAS ADICIONALES DEL COACH\n${line}\n\n${notas}\n` : ''}
${line}
🚨 FORMATO DE RESPUESTA — CRÍTICO
${line}

⚠️ RESPONDÉ ÚNICAMENTE CON EL JSON PURO. NADA MÁS.

❌ NO uses bloques de código markdown (\`\`\`json ni \`\`\`).
❌ NO agregues texto, títulos, resúmenes ni explicaciones antes o después.
❌ NO cierres con frases como "¡Éxito!" o "Espero que te sirva".

✅ COMENZÁ exactamente con: {
✅ TERMINÁ exactamente con: }
✅ Solo JSON válido, texto plano.

VALIDACIÓN ANTES DE RESPONDER:
1. ¿Empieza con { y termina con }?
2. ¿No hay texto ni markdown alrededor?
3. ¿Es JSON válido?
4. ¿El totalDia cuadra con el targetKcal?
5. ¿Cada comida y variante tiene videoUrl de búsqueda?
6. ¿Respetaste todas las restricciones hard?

Generá el plan nutricional AHORA. Profesional. Argentino. Con videos de receta. Adaptado al atleta.`;

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
