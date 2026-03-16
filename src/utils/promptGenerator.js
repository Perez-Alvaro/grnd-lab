/**
 * Generador de Prompt Maestro para IAs
 * Genera un prompt perfecto basado en los metadatos de la rutina
 * Para usar con ChatGPT, Claude, o cualquier IA
 */

/**
 * Genera un prompt maestro basado en los metadatos de la rutina
 * @param {Object} metadata - Los metadatos del formulario
 * @returns {string} El prompt listo para copiar y pegar
 */
export function generateAIPrompt(metadata) {
  const {
    name = 'Rutina Personalizada',
    description = 'Rutina de entrenamiento',
    gender = 'No especificado',
    frequency = '4',
    objective = 'Fitness general',
    durationWeeks = '4',
    level = 'Intermedio',
    tags = '',
    notes = '',
    author = 'Coach'
  } = metadata;

  const prompt = `ACTÚA COMO UN ENTRENADOR PERSONAL EXPERTO CON AÑOS DE EXPERIENCIA.

Tu misión es crear una rutina de entrenamiento PROFESIONAL y DETALLADA en formato JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INFORMACIÓN DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Género: ${gender}
🎯 Objetivo: ${objective}
📊 Nivel: ${level}
📅 Frecuencia: ${frequency} días por semana
⏱️ Duración: ${durationWeeks} semanas
🏷️ Técnicas/Tags: ${tags || 'Entrenamiento estándar'}
📝 Notas especiales: ${notes || 'Ninguna'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 ESTRUCTURA REQUERIDA (COPIA EXACTA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes responder ÚNICAMENTE con un objeto JSON válido. NO agregues texto antes ni después.

ESQUEMA EXACTO:

{
  "name": "${name}",
  "description": "${description}",
  "metadata": {
    "author": "${author}",
    "gender": "${gender}",
    "objective": "${objective}",
    "level": "${level}",
    "frequency": "${frequency}",
    "durationWeeks": "${durationWeeks}",
    "tags": "${tags}"
  },
  "weeks": [
    {
      "name": "Semana 1",
      "days": [
        {
          "name": "Día 1 - Push (Pecho, Hombros, Tríceps)",
          "type": "training",
          "warmup": [
            {
              "name": "Trote en cinta o bicicleta",
              "duration": "5 min",
              "notes": "Ritmo moderado (60-65% FC máx) para elevar temperatura corporal"
            },
            {
              "name": "Rotaciones de hombro + círculos de brazos",
              "duration": "2 min",
              "notes": "Movilidad activa de la articulación del hombro. 10 repeticiones cada dirección"
            },
            {
              "name": "Flexiones de activación",
              "duration": "2 series x 10",
              "notes": "Sin carga, enfocado en activar pectorales y estabilizadores de escápula"
            }
          ],
          "exercises": [
            {
              "name": "Press de Banca con Barra",
              "sets": "4",
              "reps": "8-10",
              "rir": "2",
              "tempo": "3010",
              "rest": "90s",
              "notes": "Controla la fase excéntrica (3s bajada). Mantén escápulas retraídas y pies firmes en el suelo. Barra debe tocar pecho medio-bajo",
              "video": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
            },
            {
              "name": "Press Inclinado con Mancuernas",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "Banco a 45 grados. Baja hasta sentir estiramiento en pecho superior. Evita arquear excesivamente la espalda",
              "video": "https://www.youtube.com/watch?v=8iPEnn-ltC8"
            }
          ]
        }
      ]
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ REGLAS DE GENERACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ESTRUCTURA:
   - Genera ${durationWeeks} semanas completas
   - Cada semana debe tener ${frequency} días de entrenamiento
   - Cada día DEBE tener: una sección "warmup" + una sección "exercises" (5-8 ejercicios)

2. ENTRADA EN CALOR (campo "warmup" por día):
   ⚠️ OBLIGATORIO: cada día debe incluir 3-4 ejercicios de entrada en calor ESPECÍFICOS para el grupo muscular del día.

   CAMPOS por ejercicio de warmup:
   - name: Nombre del ejercicio de calentamiento
   - duration: Tiempo o series (ej: "5 min", "2 series x 10")
   - notes: Objetivo del ejercicio y puntos clave de ejecución

   📋 TABLA DE IMPRESIÓN: el bloque warmup se imprimirá como tabla con título
   "Entrada en calor del Día X" — el X corresponde al número de día dentro de la semana.

   Tipos de warmup según el día:
   - Push: cardio leve 3-5 min + movilidad de hombros + activación de pecho
   - Pull: cardio leve 3-5 min + movilidad escapular + activación de dorsales
   - Pierna: cardio leve 5 min + movilidad de cadera + activación de glúteos
   - Full Body: cardio leve 5 min + movilidad articular general + activación core

3. CAMPOS OBLIGATORIOS por ejercicio principal:
   ⚠️ TODOS los campos deben estar completos. NO dejes ningún campo vacío.

   - name: Nombre claro y específico del ejercicio
   - sets: Número de series (ej: "3", "4", "3-4")
   - reps: Rango de repeticiones (ej: "8-12", "10-15") o duración si es isométrico
   - rir: Repeticiones en Reserva (0-3, donde 0=fallo, 3=fácil)
   - tempo: Cadencia 4 dígitos (ej: "3010" = 3s bajar, 0s pausa, 1s subir, 0s arriba)
   - rest: Descanso entre series (ej: "60s", "90s", "120s")
   - notes: Puntos clave de técnica, precauciones y errores comunes a evitar
   - video: URL de YouTube REAL y VÁLIDA con demostración del ejercicio

   📹 VIDEOS DE YOUTUBE (CRÍTICO):
   - FORMATO EXACTO: "https://www.youtube.com/watch?v=[ID_VIDEO]"
   - USA canales reconocidos: AthleanX, Jeff Nippard, Powerexplosive, ScottHermanFitness
   - IDs de referencia REALES:
     PRESS DE BANCA: "https://www.youtube.com/watch?v=rT7DgCr-3pg"
     SENTADILLA:     "https://www.youtube.com/watch?v=ultWZbUMPL8"
     PESO MUERTO:    "https://www.youtube.com/watch?v=hd7xwxjwe8U"
     DOMINADAS:      "https://www.youtube.com/watch?v=eGo4IYlbE5g"

4. ADAPTACIÓN AL OBJETIVO:

   ${objective === 'Volumen muscular' ? `
   📈 VOLUMEN MUSCULAR:
   - Sets: 3-5 por ejercicio
   - Reps: 8-12
   - RIR: 1-2 (cerca del fallo)
   - Tempo: 3010 o 3110 (enfatiza excéntrica)
   - Rest: 60-90s
   - Incluye técnicas avanzadas: drop sets, superseries si hay tags
   ` : ''}

   ${objective === 'Fuerza' ? `
   💪 FUERZA:
   - Sets: 4-6 por ejercicio
   - Reps: 3-6
   - RIR: 2-3 (más conservador)
   - Tempo: X010 (explosivo en concéntrica)
   - Rest: 120-180s
   - Prioriza ejercicios compuestos: Squat, Bench, Deadlift
   ` : ''}

   ${objective === 'Pérdida de grasa' ? `
   🔥 PÉRDIDA DE GRASA:
   - Sets: 3-4 por ejercicio
   - Reps: 12-15
   - RIR: 2-3
   - Tempo: 2010 (ritmo constante)
   - Rest: 30-45s (circuitos si es posible)
   - Incluye ejercicios compuestos y multiarticulares
   ` : ''}

5. NIVEL DE DIFICULTAD:

   ${level === 'Principiante' ? `
   🌱 PRINCIPIANTE:
   - Ejercicios básicos y seguros
   - Énfasis en técnica
   - Volumen moderado
   - Evita técnicas avanzadas
   ` : ''}

   ${level === 'Intermedio' ? `
   🏃 INTERMEDIO:
   - Mezcla de ejercicios básicos y aislados
   - Introduce variaciones
   - Volumen medio-alto
   - Puedes usar superseries básicas
   ` : ''}

   ${level === 'Avanzado' ? `
   ⚡ AVANZADO:
   - Ejercicios complejos y variaciones avanzadas
   - Técnicas intensas: drop sets, rest-pause, etc.
   - Alto volumen
   - Periodización dentro de las semanas
   ` : ''}

6. TÉCNICAS ESPECÍFICAS (Tags):
   ${tags ? `
   Aplica estas técnicas: ${tags}
   
   ${tags.toLowerCase().includes('fst-7') ? '- Incluye series de FST-7 (7 sets de 8-12 reps con 30-45s rest) en ejercicios clave' : ''}
   ${tags.toLowerCase().includes('drop set') || tags.toLowerCase().includes('dropset') ? '- Usa drop sets en los últimos sets de ejercicios principales' : ''}
   ${tags.toLowerCase().includes('superserie') || tags.toLowerCase().includes('superset') ? '- Combina ejercicios en superseries (sin descanso entre ellos)' : ''}
   ${tags.toLowerCase().includes('rest-pause') ? '- Aplica rest-pause en ejercicios compuestos (set + 15s rest + continuar)' : ''}
   ${tags.toLowerCase().includes('giant set') ? '- Crea giant sets con 4 ejercicios consecutivos' : ''}
   ` : '- Usa progresión estándar'}

7. VARIACIÓN ENTRE SEMANAS:
   - Semana 1-2: Volumen base
   - Semana 3-4: Incrementa intensidad (más peso, menos reps) o volumen (más sets)
   - Varía los ejercicios pero mantén los patrones de movimiento
   - Incorpora periodización ondulante si es nivel avanzado

8. GRUPOS MUSCULARES (para ${frequency} días/semana):
   ${frequency === '3' ? `
   - Día 1: Full Body A
   - Día 2: Full Body B
   - Día 3: Full Body C
   ` : ''}
   ${frequency === '4' ? `
   - Día 1: Push (Pecho, Hombros, Tríceps)
   - Día 2: Pull (Espalda, Bíceps)
   - Día 3: Pierna (Cuádriceps, Femorales, Glúteos)
   - Día 4: Upper (Torso completo)
   ` : ''}
   ${frequency === '5' ? `
   - Día 1: Pecho + Tríceps
   - Día 2: Espalda + Bíceps
   - Día 3: Pierna (Cuádriceps énfasis)
   - Día 4: Hombros + Core
   - Día 5: Pierna (Femorales/Glúteos énfasis)
   ` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 IMPORTANTE - FORMATO DE RESPUESTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ RESPONDE ÚNICAMENTE CON EL JSON. SIN TEXTO ADICIONAL.
⚠️ NO uses bloques de código markdown (\`\`\`json)
⚠️ NO agregues explicaciones antes ni después
⚠️ EMPIEZA directamente con { y TERMINA con }
⚠️ Asegúrate de que sea JSON VÁLIDO (sin comas finales, comillas correctas)

🔴 RECORDATORIO CRÍTICO:

Cada día DEBE contener:
✓ "warmup" → array con 3-4 ejercicios de entrada en calor (name, duration, notes)
   → Se imprime como tabla "Entrada en calor del Día X"
✓ "exercises" → array con 5-8 ejercicios principales

Cada ejercicio principal DEBE incluir TODOS estos campos sin excepción:
✓ name · sets · reps · rest · rir · tempo · notes · video

NO omitas ningún campo. El PDF necesita todos los datos completos.

${notes ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 NOTAS ADICIONALES DEL ENTRENADOR\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${notes}\n` : ''}

Genera la rutina AHORA:`;

  return prompt;
}

/**
 * Copia el prompt al portapapeles
 * @param {Object} metadata - Los metadatos del formulario
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export async function copyPromptToClipboard(metadata) {
  try {
    const prompt = generateAIPrompt(metadata);
    await navigator.clipboard.writeText(prompt);
    return true;
  } catch (error) {
    console.error('Error copiando al portapapeles:', error);
    // Fallback para navegadores que no soportan clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = generateAIPrompt(metadata);
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return false;
    }
  }
}
