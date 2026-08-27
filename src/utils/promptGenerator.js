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
    mesocicloObjetivo = '',
    level = 'Intermedio',
    tags = '',
    notes = '',
    author = 'Coach'
  } = metadata;

  const semanas = parseInt(durationWeeks, 10) || 4;
  const esMesociclo = semanas > 1;
  // Calcula dónde va cada deload según el tipo de mesociclo:
  // Fuerza: deload cada 3 semanas. Hipertofia: cada 4. Grasa: cada 3.
  const frecDeload = mesocicloObjetivo === 'Fuerza' ? 3
    : mesocicloObjetivo === 'Pérdida de grasa' ? 3
    : 4; // Hipertrofia o sin especificar
  const semanasDeload = Array.from({ length: semanas }, (_, i) => i + 1)
    .filter(s => s % frecDeload === 0);
  const deloadTexto = semanasDeload.length
    ? semanasDeload.map(s => `Semana ${s}`).join(', ')
    : `Semana ${semanas}`;

  const prompt = `ERES UN ENTRENADOR PERSONAL DE ÉLITE CON EXPERIENCIA EN PERIODIZACIÓN Y PSICOLOGÍA DEL RENDIMIENTO.

Tu misión es crear una rutina de entrenamiento PROFESIONAL, MOTIVADORA y DETALLADA en formato JSON puro.
Las notas de cada ejercicio deben reflejar excelencia técnica COMBINADA con un poco de motivación directa e inspiradora.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CLIENTE Y CONTEXTO DE ENTRENAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Género: ${gender}
🎯 Objetivo principal: ${objective}
📊 Nivel: ${level}
📅 Frecuencia: ${frequency} días/semana
⏱️ Duración: ${durationWeeks} semanas
❌ Ejercicios a EVITAR: ${tags || 'Ninguno (sin restricciones)'}
📝 Excepciones y consideraciones del coach: ${notes || 'Ninguna especial'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 ESTRUCTURA REQUERIDA - JSON PURO (SIN BLOQUES DE CÓDIGO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
    "mesocicloObjetivo": "${mesocicloObjetivo || 'No especificado'}",
    "tags": "${tags}"
  },
  "weeks": [
    {
      "name": "Semana 1",
      "days": [
        {
          "name": "Día 1 - Push (Pecho, Hombros, Tríceps)",
          "type": "training",
          "exercises": [
            {
              "name": "[ENTRADA EN CALOR] Movilidad torácica y cadera",
              "sets": "1",
              "reps": "2 min",
              "rir": "3",
              "tempo": "0000",
              "rest": "0s",
              "notes": "Movilidad articular: extensiones torácicas + apertura de cadera en cuadrupedia. Respira profundo, prioriza rango sin dolor. Calienta articulaciones clave antes de cargar.",
              "video": ""
            },
            {
              "name": "[ENTRADA EN CALOR] Rotaciones de hombro + círculos de brazos",
              "sets": "1",
              "reps": "2 min (10 reps c/dirección)",
              "rir": "3",
              "tempo": "0000",
              "rest": "0s",
              "notes": "Movilidad articular específica: rotación escapular controlada, 10 reps adelante y atrás. Postura alta, sin dolor. Hombros listos, cero lesiones mañana.",
              "video": ""
            },
            {
              "name": "[ENTRADA EN CALOR] Flexiones de pecho activación",
              "sets": "2",
              "reps": "10",
              "rir": "3",
              "tempo": "2010",
              "rest": "30s",
              "notes": "TÉCNICA: Flexiones controladas sin carga. Activar pectorales y escápula. Cada rep cuenta. Disciplina en detalles es hábito diario.",
              "video": ""
            },
            {
              "name": "Press de Banca con Barra",
              "sets": "4",
              "reps": "8-10",
              "rir": "2",
              "tempo": "3010",
              "rest": "90s",
              "notes": "TÉCNICA: Pies firmes. Omóplatos retraídos. Baja 3 seg, pausa mínima, sube explosivo 1 seg. Tu movimiento base. No negocies forma por peso. Sufre hoy, celebra después.",
              "video": ""
            },
            {
              "name": "Press Inclinado con Mancuernas",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "TÉCNICA: Banco 45°. Mancuernas a hombros. Baja hasta estiramiento sin sacrificar forma. 2 seg bajada, 1 seg subida. Pecho superior. Cuando duela, estás creciendo.",
              "video": ""
            },
            {
              "name": "Fondos en Paralelas o Tríceps Cuerda",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "TÉCNICA: Fondos cuerpo vertical, codos al torso, baja 2 seg hasta 90°. Cuerda inclinado, codos fijos, extiende explosivo. Elige tu variante. Incomodidad = progreso.",
              "video": ""
            },
            {
              "name": "Elevaciones Laterales con Mancuernas",
              "sets": "3",
              "reps": "12-15",
              "rir": "2",
              "tempo": "2020",
              "rest": "45s",
              "notes": "TÉCNICA: De pie, torso neutral. Sube hasta altura hombros (NO más). Codos flectados. Pausa 1 seg arriba, baja 2 seg. Hombros anchos se construyen. Cada rep es ladrillo.",
              "video": ""
            }
          ]
        }
      ]
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏋️ FORMAS DE ENTRENAMIENTO DISPONIBLES - ELIGE LA MEJOR SEGÚN CONTEXTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCCIÓN: Elige la MEJOR forma de entrenamiento basada en:
- OBJETIVO del atleta
- NIVEL (Principiante/Intermedio/Avanzado)
- GÉNERO (considera diferencias biomecánicas y objetivos típicos)
- FRECUENCIA de entrenamientos

📌 FORMAS DE ENTRENAMIENTO PRINCIPALES:

1️⃣ PPL - PUSH/PULL/LEGS SPLIT (RECOMENDADO PARA HIPERTROFIA)
   ✓ Mejor para: Volumen muscular, nivel intermedio-avanzado
   ✓ Estructura: 3 días (P/P/L) o 6 días (P/P/L x2)
   ✓ Volumen: Alto (15-20 sets por grupo muscular)
   ✓ Recuperación: Excelente para músculos específicos
   ✓ Nota: Perfecto para hombres y mujeres con objetivo de hipertrofia

2️⃣ UPPER/LOWER SPLIT (RECOMENDADO PARA EQUILIBRIO)
   ✓ Mejor para: Fuerza + hipertrofia, nivel intermedio
   ✓ Estructura: 4 días (U/L/U/L) o 5+ días
   ✓ Volumen: Moderado-alto (12-16 sets por sesión)
   ✓ Recuperación: Buena, permite entrenar tren superior 2x/semana
   ✓ Nota: Excelente para mujeres que buscan equilibrio inferior/superior

3️⃣ FULL BODY (RECOMENDADO PARA PRINCIPIANTES Y FUERZA)
   ✓ Mejor para: Principiantes, fuerza pura, frecuencia baja (3-4 días)
   ✓ Estructura: 3 días (A/B/C rotación) o 4 días estándar
   ✓ Volumen: Moderado (10-15 sets por sesión)
   ✓ Recuperación: Muy buena, entrenar cada grupo 3x/semana
   ✓ Nota: Ideal para que aprendan técnica y construyan base. Mujeres + coordinación

4️⃣ BODY PART SPLIT / BROSPLIT (RECOMENDADO PARA VOLUMEN EXTREMO)
   ✓ Mejor para: Hipertrofia extrema, avanzados, 5-6 días
   ✓ Estructura: Pecho | Espalda | Pierna | Hombros | Brazos | Accesorios
   ✓ Volumen: MUY alto (20-25 sets por grupo muscular)
   ✓ Recuperación: Necesita 7-10 días de recuperación por grupo
   ✓ Nota: Solo para atletas avanzados con experiencia

5️⃣ CONJUGATE METHOD - PERIODIZACIÓN CONJUGADA (RECOMENDADO PARA FUERZA)
   ✓ Mejor para: Fuerza máxima, composición corporal, aletlas avanzados
   ✓ Estructura: 4 días (Max Effort / Dynamic Effort / Repetition / Accesories)
   ✓ Volumen: Bajo-moderado (6-12 sets de movimientos principales)
   ✓ Recuperación: Excelente, cambia estímulos constantemente
   ✓ Nota: Alto rendimiento, muy eficiente

6️⃣ PERIODIZACIÓN LINEAL (RECOMENDADO PARA FUERZA PROGRESIVA)
   ✓ Mejor para: Ganancia consistente de fuerza, principiantes avanzados
   ✓ Estructura: Semana 1-2 volumen alto, Semana 3-4 intensidad alta
   ✓ Volumen: Progresa de + reps a + peso
   ✓ Recuperación: Buena, cambio semanal previene meseta
   ✓ Nota: Perfecto para deportistas, menores variaciones

7️⃣ PERIODIZACIÓN ONDULANTE (RECOMENDADO PARA VERSATILIDAD)
   ✓ Mejor para: Objetivos mixtos (fuerza + hipertrofia), intermedio-avanzado
   ✓ Estructura: Cambia dentro de MISMA SEMANA (día A=fuerza, día B=hipertrofia)
   ✓ Volumen: Varía cada sesión (3-5 reps día 1, 8-12 reps día 2)
   ✓ Recuperación: Óptima, evita adaptación
   ✓ Nota: Excelente para atletas que buscan una solución completa

8️⃣ CIRCUIT TRAINING / CONDITIONING (RECOMENDADO PARA PÉRDIDA DE GRASA)
   ✓ Mejor para: Pérdida de grasa, conditioning, resilencia cardiovascular
   ✓ Estructura: 4-6 ejercicios sin descanso o mínimo descanso
   ✓ Volumen: Moderado-alto, densidad muy alta
   ✓ Recuperación: Demanda metabólica alta = quema calórica
   ✓ Nota: Perfecto para personas con tiempo limitado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CRITERIOS DE SELECCIÓN DE FORMA DE ENTRENAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECCIONA según OBJETIVO:

${objective === 'Volumen muscular' ? `
📈 VOLUMEN MUSCULAR → Usa: PPL (mejor) o Body Part Split o Upper/Lower
   Razón: Alto volumen es crítico. Los grupos musculares necesitan 12-20 sets/semana
   Rango de sets: 15-20 por grupo muscular
   Frecuencia: 2x/semana por grupo
` : ''}

${objective === 'Fuerza' ? `
💪 FUERZA MÁXIMA → Usa: Conjugate (mejor) o Periodización Lineal o Full Body
   Razón: Requiere baja rep, alta intensidad, frecuencia 2x/semana por patrón
   Rango de sets: 6-12 sets de movimientos principales
   Frecuencia: 2x/semana por patrón de movimiento
` : ''}

${objective === 'Pérdida de grasa' ? `
🔥 PÉRDIDA DE GRASA → Usa: Circuit Training (mejor) o Upper/Lower o Full Body
   Razón: Volumen moderado, densidad alta, poco descanso = gasto calórico
   Rango de sets: 10-15 sets con 30-45s rest
   Frecuencia: 3-4 días/semana, alta densidad
` : ''}

${objective === 'Resistencia' ? `
🏃 RESISTENCIA/CONDITIONING → Usa: Circuit Training o Periodización Ondulante
   Razón: Estímulo constante, no permite recuperación = adaptación cardiovascular
   Rango de sets: 15-20 sets con 30s rest máximo
   Frecuencia: 3-4 días/semana, trabajo metabólico
` : ''}

SELECCIONA según NIVEL:

${level === 'Principiante' ? `
🌱 PRINCIPIANTE → Usa: Full Body (mejor) o Upper/Lower
   Razón: Necesita aprender patrones de movimiento, recuperación frecuente
   Frecuencia: 3 o 4 días/semana
   Nota: Éxito = consistencia. Los principiantes NO necesitan complejidad
` : ''}

${level === 'Intermedio' ? `
🏃 INTERMEDIO → Usa: PPL (mejor) o Upper/Lower o Periodización Ondulante
   Razón: Ya domina técnica. Ahora puede aumentar volumen y variación
   Frecuencia: 4-5 días/semana
   Nota: Este es el nivel más versátil. Casi cualquier forma funciona
` : ''}

${level === 'Avanzado' ? `
⚡ AVANZADO → Usa: Conjugate (mejor) o Body Part Split o Periodización Lineal
   Razón: Músculo adapta rápido. Necesita variación inteligente y periodización
   Frecuencia: 5-6 días/semana
   Nota: La sofisticación compensa el tiempo. Aprovecha knowlewdge avanzado
` : ''}

SELECCIONA según GÉNERO (CONSIDERACIONES):

${gender?.toLowerCase().includes('femenino') || gender?.toLowerCase().includes('mujer') ? `
👩 ATLETA MUJER → Considera:
   ✓ Frecuencia higher en tren inferior (glúteos/pierna): 2x/semana
   ✓ Volumen moderado upper body inicialmente
   ✓ Formas recomendadas: PPL (enfoque pierna), Upper/Lower, Full Body
   ✓ Nota: Mujeres tipicamente tienen recuperación más rápida en lower body
` : ''}

${gender?.toLowerCase().includes('masculino') || gender?.toLowerCase().includes('hombre') ? `
👨 ATLETA HOMBRE → Considera:
   ✓ Énfasis torso superior es más efectivo típicamente
   ✓ Volumen alto en pecho, espalda, hombros produce mejores resultados
   ✓ Formas recomendadas: PPL, Body Part Split, Conjugate
   ✓ Nota: Aprox 70% de hombres responden mejor a volumen alto directo
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ INSTRUCCIONES CRÍTICAS DE GENERACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0️⃣ CALIDAD ANTES QUE CANTIDAD (leer primero):
   Esto es una PLANIFICACIÓN, no un relleno de JSON. Un plan de pocas semanas
   bien progresado vale más que muchas semanas copiadas.

   ❌ PROHIBIDO: repetir la misma semana cambiándole solo el número.
   ✅ CADA semana tiene que diferenciarse de la anterior en algo CONCRETO y
      visible en los números: series, repeticiones, RIR, descanso, cadencia o
      selección de ejercicios.

   Progresión mínima esperada a lo largo de las ${durationWeeks} semanas:
   • RIR baja (ej: semana 1 → RIR 3, última semana → RIR 1): se acumula fatiga.
   • Volumen o intensidad sube de forma gradual, no de golpe.
   • Si el plan tiene 4 semanas o más, la ÚLTIMA es de descarga (deload):
     ~40% menos volumen y RIR 3-4, para asimilar lo entrenado.
   • En "notes" de cada semana explicá EN UNA LÍNEA qué cambia respecto de la
     anterior y por qué (es lo que el coach le muestra al cliente).

   Los ejercicios base pueden mantenerse entre semanas (eso es correcto para
   medir progreso), pero los números NO pueden ser idénticos.

1️⃣ ESTRUCTURA DE DÍAS:
   • Genera ${durationWeeks} semanas completas
   • Cada semana: ${frequency} días de entrenamiento
   • ELIGE LA FORMA DE ENTRENAMIENTO que mejor se adapte (ver sección anterior)
   • BASÁNDOTE en: Objetivo, Nivel, Género y Frecuencia
   • CADA DÍA debe iniciar con 3-4 ejercicios de ENTRADA EN CALOR
   • El calentamiento SIEMPRE es de ZONA MEDIA/CORE + movilidad articular específica del día. NUNCA cardio genérico.
   • ⚠️ CARDIO EN CALENTAMIENTO: PROHIBIDO a menos que el objetivo sea "Pérdida de grasa". En ese caso, máx 5 min cardio moderado.
   • TODOS los ejercicios van en un array "exercises" (no hay campo "warmup" separado)
   • Ejercicios de entrada en calor tienen prefijo "[ENTRADA EN CALOR]" en el nombre (solo en name, NO en notes)

2️⃣ ENTRADA EN CALOR (primeros ejercicios del día):
   OBLIGATORIO para CADA día de entrenamiento:

   Sets: "1" o "2" (nunca múltiples series pesadas)
   Reps: Duración o rango ligero (ej: "2 min", "10 reps", "12 reps", "30 seg")
   RIR: "3" (siempre sencillo, nunca a fatiga)
   Tempo: "0000" o movimiento natural (no cuenta)
   Rest: "0s" o "30s" entre movimientos

   🔴 REGLA ABSOLUTA DE CALENTAMIENTO:
   - ❌ CARDIO PROHIBIDO (trote, elíptica, bici, saltar soga, etc.) a menos que el objetivo sea EXACTAMENTE "Pérdida de grasa".
   - ✅ En objetivos de Hipertrofia, Fuerza, Resistencia, Fitness: el calentamiento SOLO incluye ZONA MEDIA/CORE + movilidad articular.
   - Si el objetivo es "Pérdida de grasa": PERMITIDO incluir 1 ejercicio de cardio moderado (5 min, 60-65% FC máx) como parte del calentamiento.

   COMPOSICIÓN OBLIGATORIA DEL CALENTAMIENTO (para objetivos NO pérdida de grasa):
   1. Ejercicio de ZONA MEDIA/CORE (planchas, bird-dog, dead bug, hollow hold, McGill curl-up, etc.)
   2. Movilidad articular ESPECÍFICA del día (ver tipos por día abajo)
   3. Opcionalmente: 1 ejercicio de activación ligera del patrón principal del día (sin carga o muy ligero)

   TIPOS DE CALENTAMIENTO SEGÚN DÍA (sin cardio salvo Pérdida de grasa):
   - Push/Pecho/Hombros/Tríceps:
     • Core: Planchas frontales o dead bug
     • Movilidad: Rotaciones de hombro, movilidad torácica, apertura escapular
     • Activación: Flexiones de activación controladas (sin carga)

   - Pull/Espalda/Bíceps:
     • Core: Bird-dog o McGill curl-up
     • Movilidad: Movilidad escapular, retracción de omóplatos, movilidad torácica
     • Activación: Remo con banda elástica o dominadas asistidas muy ligeras

   - Pierna/Glúteos/Femorales:
     • Core: Hollow hold o plancha lateral
     • Movilidad: Movilidad de cadera (rotaciones, apertura), movilidad de tobillo, movilidad lumbar
     • Activación: Sentadilla corporal lenta y controlada o puente de glúteo

   - Full Body:
     • Core: Dead bug o bird-dog
     • Movilidad: Secuencia articular completa (tobillo → cadera → torácica → hombros)
     • Activación: Movimiento compuesto muy ligero (sentadilla goblet con peso mínimo)

   - Hombros / Brazos:
     • Core: Planchas o hollow hold
     • Movilidad: Círculos de hombro, rotaciones de codo, movilidad de muñeca
     • Activación: Rotaciones externas con banda o flexiones de activación

3️⃣ NOTAS DE EJERCICIOS (CRÍTICO - Breve y profesional para PDF):

   ESTRUCTURA DE NOTAS (MÁXIMO 2-3 RENGLONES):
   - Línea 1: TIPO + Descripción técnica concisa
   - Línea 2: Detalles forma + cuidado crítico
   - Línea 3 (opcional): Frase motivacional breve tipo Goggins

   ⚠️ REGLA DE ORO: Cada nota DEBE ser BREVE. Máximo 250 caracteres, ~2.5 renglones en PDF.

   PARA ENTRADA EN CALOR:
   "[PROPÓSITO breve + movilidad o activación específica]. [TÉCNICA en 1 línea]. [Goggins de 1 línea]. NO repitas el tag [ENTRADA EN CALOR] en las notas."

   PARA EJERCICIOS PRINCIPALES:
   "TÉCNICA: [DESCRIPCIÓN breve]. [CUIDADO crítico]. [Goggins breve]."

   MOTIVACIÓN GOGGINS (brevísimos, punzantes):
   ✓ "No negocies forma por ego."
   ✓ "El peso sigue la técnica."
   ✓ "Cada rep es un ladrillo."
   ✓ "Sufre hoy, celebra después."
   ✓ "Incomodidad = progreso."
   ✓ "Vuelve mañana y hazlo de nuevo."
   ✓ "Haz tu trabajo, sin excusas."


4️⃣ CAMPOS OBLIGATORIOS CADA EJERCICIO:

   name: Exacto y claro. Prefijo "[ENTRADA EN CALOR]" para calentamiento. Ej: "[ENTRADA EN CALOR] Plancha frontal" o "[ENTRADA EN CALOR] Movilidad de cadera en cuadrupedia"
   sets: Número (string). "1", "2", "3", "4", etc
   reps: Rango o duración (string). "8-10", "10-12", "3 min", "2 min (10 reps)", etc
   rir: Rango en reserva (0-3, donde 0=fallo, 3=fácil). String. Para warmup: "3"
   tempo: Cadencia 4 dígitos o "0000" para natural. "3010", "2020", "0000"
   rest: Descanso entre series. "30s", "60s", "90s", "120s", "0s"
   notes: MÁXIMO 2-3 RENGLONES (~250 caracteres). TÉCNICA + MOTIVACIÓN BREVE. NUNCA excedas para que PDF imprima bien.
   video: Opcional (string vacío "" o URL específica). La plataforma arma automáticamente el link de búsqueda en YouTube con el nombre del ejercicio.

5️⃣ VIDEOS DE YOUTUBE:
   La plataforma genera de forma automática el enlace de búsqueda de YouTube para cada ejercicio utilizando su nombre.
   - Puedes dejar "video": "" para ahorrar tokens.
   - Si deseas especificar una URL exacta (ej: de un canal propio o tutorial específico), puedes colocarla.
   - De lo contrario, dejar "video": "" y el sistema se encarga de dirigir al usuario a los resultados en YouTube según el título del ejercicio.

6️⃣ PARÁMETROS POR OBJETIVO (Niveles de intensidad y volumen):

   ${objective === 'Volumen muscular' ? `
   📈 VOLUMEN MUSCULAR:
   - Reps primarias: 8-12 (rango de hipertrofia pura)
   - Series por ejercicio: 3-4
   - RIR promedio: 1-2 (cerca del fallo mecánico)
   - Rest entre series: 60-90s (compuestos), 45-60s (aislados)
   - Tempo énfasis: Excéntrica controlada (3 seg bajada típicamente)
   - Formas recomendadas: PPL, Body Part Split, Upper/Lower
   ` : ''}

   ${objective === 'Fuerza' ? `
   💪 FUERZA MÁXIMA:
   - Reps primarias: 3-6 (fuerza pura)
   - Series por ejercicio: 4-6
   - RIR promedio: 2-3 (técnica perfecta siempre)
   - Rest entre series: 120-180s (recuperación nerviosa completa)
   - Tempo énfasis: Concéntrica explosiva (1 seg subida)
   - Formas recomendadas: Conjugate, Periodización Lineal, Full Body
   ` : ''}

   ${objective === 'Pérdida de grasa' ? `
   🔥 PÉRDIDA DE GRASA / CONDITIONING:
   - Reps primarias: 12-15 (volumen metabolito)
   - Series por ejercicio: 3-4
   - RIR promedio: 1-2
   - Rest entre series: 30-45s (poco descanso = gasto calórico)
   - Tempo énfasis: Moderado constante (2010 tipicamente)
   - Estructura: Compuestos + circuitos, densidad alta
   - Formas recomendadas: Circuit Training, Upper/Lower, Full Body
   ` : ''}

   ${objective === 'Resistencia' ? `
   🏃 RESISTENCIA/CONDITIONING:
   - Reps primarias: 15-20 o trabajo de duración (30-45 seg)
   - Series por ejercicio: 3-4
   - RIR promedio: 2-3
   - Rest entre series: 30-45s máximo (alto volumen, poco descanso)
   - Tempo énfasis: Acelerado naturalmente (densidad de trabajo)
   - Estructura: Circuitos, EMOM, o tabata-like
   - Formas recomendadas: Circuit Training, Periodización Ondulante
   ` : ''}

7️⃣ VARIACIÓN Y PERIODIZACIÓN ENTRE SEMANAS:

${esMesociclo ? `
   ⚡ ESTE PLAN TIENE ${durationWeeks} SEMANAS: SE APLICA ESTRUCTURA DE MESOCICLO PROGRESIVO.

   PRINCIPIO DE ONDA SERRUCHO (OBLIGATORIO):
   El volumen/intensidad NO sube linealmente. Sube, baja (deload), vuelve a subir
   más alto. Esto se llama "onda de carga" y es lo que separa la planificación
   profesional del relleno de JSON.

   SEMANAS DE DELOAD (reducir ~40% el volumen total, RIR 3-4): ${deloadTexto}
   SEMANAS DE CARGA: todas las demás — cada una más exigente que la anterior.

   ${mesocicloObjetivo === 'Fuerza' || objective === 'Fuerza' ? `
   💪 MESOCICLO DE FUERZA (${durationWeeks} semanas):
   • Reps primarias: 3–6 (fuerza pura, 80–95% 1RM)
   • Cada semana de carga: +2.5–5% de peso O −1 rep con mismo peso
   • Progreso visible entre semanas: RIR baja de 3 → 2 → 1 → 0 (deload vuelve a 3)
   • Series por ejercicio principal: 4–6 series
   • Descanso: 120–180s (recuperación nerviosa completa)
   • Semana deload: -40% volumen, mismo patrón, peso 60–70% del máximo anterior
   ESTRUCTURA SEMANA A SEMANA (guiá la IA en los números exactos de cada semana):
   S1: Carga 1 — RIR 3, sets base. Aprendizaje del patrón.
   S2: Carga 2 — RIR 2, +1 set o +2.5% peso. Aumento gradual.
   S3 (deload si Fuerza): DELOAD — RIR 4, −40% volumen, peso 65%. Recuperación activa.
   S4+: Reinicia ciclo más alto. Cada bloque de 3 semanas supera al anterior.
   ` : ''}

   ${mesocicloObjetivo === 'Hipertrofia' || (!mesocicloObjetivo && objective === 'Volumen muscular') || (!mesocicloObjetivo && !objective) ? `
   📈 MESOCICLO DE HIPERTROFIA (${durationWeeks} semanas):
   • Reps primarias: 6–12 (rango de hipertrofia pura)
   • Cada semana de carga: +1 serie por ejercicio O +1–2 reps con mismo peso
   • Progreso visible entre semanas: volumen sube, RIR baja (3 → 2 → 1 → 0)
   • Series por ejercicio: 3 (sem 1) → 4 (sem 2) → 4–5 (sem 3+)
   • Descanso: 60–90s (compuestos), 45–60s (aislados)
   • Semana deload: -40% volumen, RIR 3-4, peso similar
   ESTRUCTURA SEMANA A SEMANA:
   S1: Carga 1 — 3 series, RIR 3. Baseline del bloque.
   S2: Carga 2 — 4 series, RIR 2. Volumen total mayor que S1.
   S3: Carga 3 — 4–5 series, RIR 1. Pico de volumen del bloque.
   S4 (deload si Hipertrofia): DELOAD — 3 series, RIR 3-4. Asimilación y recuperación.
   S5+: Reinicia con base más alta. Cada bloque de 4 semanas supera al anterior.
   ` : ''}

   ${mesocicloObjetivo === 'Pérdida de grasa' || (!mesocicloObjetivo && objective === 'Pérdida de grasa') ? `
   🔥 MESOCICLO DE PÉRDIDA DE GRASA (${durationWeeks} semanas):
   • Reps primarias: 12–15 (volumen metabólico)
   • Cada semana de carga: densidad creciente (menos descanso O más reps con mismo peso)
   • Progreso: descanso baja de 60s → 45s → 30s sin reducir peso ni reps
   • Estructura de circuito o super-series para maximizar gasto calórico
   • Semana deload: vuelve a 60s descanso, −1 serie, RIR 3-4
   ESTRUCTURA SEMANA A SEMANA:
   S1: Carga 1 — 3 series, descanso 60s, RIR 2. Base del bloque.
   S2: Carga 2 — 3–4 series, descanso 45s. Mayor densidad.
   S3 (deload si PG): DELOAD — 3 series, descanso 60s, RIR 3. Recuperación metabólica.
   S4+: Reinicia con densidad más alta. Cada bloque supera al anterior.
   ` : ''}

` : `
   PLAN DE UNA SOLA SEMANA: aplica los parámetros del objetivo sin necesidad
   de periodización entre semanas. Foco en calidad técnica y RIR correcto.
`}

   REGLA ABSOLUTA (aplica siempre):
   ❌ PROHIBIDO: repetir la misma semana cambiándole solo el número.
   ✅ CADA semana tiene que diferenciarse de la anterior en algo CONCRETO y
      visible en los números: series, repeticiones, RIR, descanso, cadencia o
      selección de ejercicios.
   ✅ Los ejercicios base pueden mantenerse (medir progreso), los números NO.
   ✅ En "notes" de cada semana: explicá EN UNA LÍNEA qué cambia y por qué.


8️⃣ DISTRIBUCIÓN DE GRUPOS MUSCULARES (Depende de forma elegida):

   ⚠️ FLEXIBILIDAD: La distribución de grupos musculares DEPENDE DE LA FORMA ELEGIDA.

   EJEMPLO si elegiste PPL (Push/Pull/Legs):
   - Día 1 (Push): Pecho, Hombros, Tríceps
   - Día 2 (Pull): Espalda, Bíceps
   - Día 3 (Legs): Cuádriceps, Femorales, Glúteos
   - Si 6 días: Repite ciclo

   EJEMPLO si elegiste Upper/Lower:
   - Día 1 (Upper): Pecho, Espalda, Hombros
   - Día 2 (Lower): Cuádriceps, Femorales, Glúteos, Core
   - Alternancia: U/L/U/L/U/L

   EJEMPLO si elegiste Full Body A/B/C:
   - Día A: Push énfasis + Pull asistencia + Pierna ligera
   - Día B: Pull énfasis + Push asistencia + Pierna ligera
   - Día C: Pierna énfasis + Upper full + Core

   NOTA: Distribución es FLEXIBLE según objetivo y forma elegida. Tú decides basado en contexto.

9️⃣ RESTRICCIONES ESPECIALES (Ejercicios a evitar):

   ${tags ? `
   ⚠️ EVITA estos ejercicios: ${tags}

   NO incluyas estos movimientos bajo NINGUNA circunstancia.
   Si un ejercicio es la única opción para un patrón, REEMPLÁZALO con una variante segura.

   Ejemplos de reemplazos:
   - Si evitas "Sentadilla": Usa Leg Press, Hack Squat, o Smith Machine Squat
   - Si evitas "Peso Muerto": Usa Trap Bar Deadlift, Rack Pull, o máquina Leg Press
   - Si evitas "Banco Plano": Usa Mancuernas, Banco Smith, o máquina Pectoral
   ` : '✓ SIN RESTRICCIONES: Todos los ejercicios están disponibles. Elige según biomecánica y objetivos.'}

🔟 CONSIDERACIONES ADICIONALES DEL COACH:

   ${notes ? `
   📌 CONSIDERACIONES ESPECIALES:
   ${notes}

   Integra estas consideraciones en la rutina:
   - Adapta los ejercicios seleccionados
   - Ajusta volumen/intensidad si es necesario
   - Considera limitaciones biomecánicas o lesiones previas
   ` : '✓ SIN CONSIDERACIONES ESPECIALES: Crea una rutina estándar sin restricciones adicionales.'}

🔴 RECORDATORIO FINAL - ESTE ES EL ESTÁNDAR:

Cada EJERCICIO (incluido calentamiento) debe tener:
✅ name (con [ENTRADA EN CALOR] si aplica)
✅ sets (número como string)
✅ reps (rango o duración como string)
✅ rir (0-3 como string)
✅ tempo (4 dígitos o "0000")
✅ rest (duración con "s")
✅ notes (MÍNIMO 2-3 renglones: TÉCNICA + MOTIVACIÓN)
✅ video (opcional / "" - la plataforma genera el link de búsqueda en YouTube automáticamente con el nombre)

NO FALTES en notas. Las notas separan profesionales de amateurs. Cada ejercicio tiene una historia técnica que contar + un mensaje de mentalidad que recortar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 FORMATO DE RESPUESTA - CRÍTICO PARA TODAS LAS IAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ RESPONDE ÚNICAMENTE CON JSON PURO TEXTO PLANO. NADA MÁS. NADA MENOS.

❌ PROHIBIDO - No hagas NINGUNO de estos:
❌ NO uses bloques de código markdown (\`\`\`json)
❌ NO uses bloques de código así (\`\`\`)
❌ NO agregues explicaciones antes
❌ NO agregues explicaciones después
❌ NO agregues resúmenes
❌ NO agregues títulos
❌ NO agregues comentarios
❌ NO agregues "Aquí está tu rutina:"
❌ NO agregues "El JSON que solicitaste:"
❌ NO agreguesque nada de texto adicional AL FINAL
❌ NO cierres con frases como "¡Éxito!" o "Espero que funcione"
❌ NO uses formato Markdown para nada

✅ REQUERIDO - Debes hacer EXACTAMENTE esto:
✅ COMIENZA exactamente con: {
✅ TERMINA exactamente con: }
✅ Solo JSON puro, texto plano
✅ Sin espacios antes del primer {
✅ Sin saltos de línea al final
✅ Sin nada después del último }

FORMATO EXACTO:
{
  "name": "...

            }
  ]
}

Una sola línea en blanco después del cierre es OK, pero NADA de texto.

INSTRUCCIÓN ESPECIAL PARA GEMINI (y todos):
Si eres Gemini, Claude, GPT, o cualquier IA:
- Tu ÚNIQUE respuesta será el JSON puro
- Sin explicaciones previas
- Sin frases de cierre
- Sin markdown
- Sin bloques de código
- Solo el objeto JSON completo y válido

PRESUPUESTO DE RESPUESTA — LEER ANTES DE EMPEZAR:
Tenés que TERMINAR el JSON sí o sí. Un JSON cerrado y más corto sirve; uno
cortado a la mitad no sirve para nada. Si ves que te estás quedando sin
espacio, en este orden: acortá las "notes" de los ejercicios, bajá a 5-6
ejercicios principales por día. NUNCA dejes el JSON sin cerrar ni entregues
menos de las ${durationWeeks} semanas pedidas.

VALIDACIÓN FINAL ANTES DE RESPONDER:
Antes de responder, verifica:
1. ¿Comienza con { exactamente?
2. ¿Termina con } exactamente?
3. ¿No hay texto adicional antes ni después?
4. ¿No hay bloques de código?
5. ¿Es JSON válido y está CERRADO por completo?
6. ¿Las ${durationWeeks} semanas tienen números DISTINTOS entre sí (no son copias)?
${esMesociclo ? `7. ¿El patrón de carga/descarga es visible? Las semanas de deload (${deloadTexto}) tienen ~40% menos volumen.
8. ¿Ningún par de semanas consecutivas tiene exactamente los mismos sets/reps/RIR?` : ''}

Si algo falla en la validación, no respondas. Di "Espera" y intenta de nuevo.

${notes ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 CONTEXTO ADICIONAL DEL COACH\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${notes}\n` : ''}

Genera la rutina AHORA. Professional. Motivadora. Videos verificados. Notas épicas.`;

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
