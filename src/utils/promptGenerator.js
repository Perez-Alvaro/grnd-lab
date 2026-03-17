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
              "video": "https://www.youtube.com/watch?v=QOVaHwm-Q6U"
            },
            {
              "name": "[ENTRADA EN CALOR] Rotaciones de hombro + círculos de brazos",
              "sets": "1",
              "reps": "2 min (10 reps c/dirección)",
              "rir": "3",
              "tempo": "0000",
              "rest": "0s",
              "notes": "Movilidad articular específica: rotación escapular controlada, 10 reps adelante y atrás. Postura alta, sin dolor. Hombros listos, cero lesiones mañana.",
              "video": "https://www.youtube.com/watch?v=Uvn65Eqk0SM"
            },
            {
              "name": "[ENTRADA EN CALOR] Flexiones de pecho activación",
              "sets": "2",
              "reps": "10",
              "rir": "3",
              "tempo": "2010",
              "rest": "30s",
              "notes": "TÉCNICA: Flexiones controladas sin carga. Activar pectorales y escápula. Cada rep cuenta. Disciplina en detalles es hábito diario.",
              "video": "https://www.youtube.com/watch?v=IODxDxX7oi4"
            },
            {
              "name": "Press de Banca con Barra",
              "sets": "4",
              "reps": "8-10",
              "rir": "2",
              "tempo": "3010",
              "rest": "90s",
              "notes": "TÉCNICA: Pies firmes. Omóplatos retraídos. Baja 3 seg, pausa mínima, sube explosivo 1 seg. Tu movimiento base. No negocies forma por peso. Sufre hoy, celebra después.",
              "video": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
            },
            {
              "name": "Press Inclinado con Mancuernas",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "TÉCNICA: Banco 45°. Mancuernas a hombros. Baja hasta estiramiento sin sacrificar forma. 2 seg bajada, 1 seg subida. Pecho superior. Cuando duela, estás creciendo.",
              "video": "https://www.youtube.com/watch?v=8iPEnn-ltC8"
            },
            {
              "name": "Fondos en Paralelas o Tríceps Cuerda",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "TÉCNICA: Fondos cuerpo vertical, codos al torso, baja 2 seg hasta 90°. Cuerda inclinado, codos fijos, extiende explosivo. Elige tu variante. Incomodidad = progreso.",
              "video": "https://www.youtube.com/watch?v=pDMXNSucLco"
            },
            {
              "name": "Elevaciones Laterales con Mancuernas",
              "sets": "3",
              "reps": "12-15",
              "rir": "2",
              "tempo": "2020",
              "rest": "45s",
              "notes": "TÉCNICA: De pie, torso neutral. Sube hasta altura hombros (NO más). Codos flectados. Pausa 1 seg arriba, baja 2 seg. Hombros anchos se construyen. Cada rep es ladrillo.",
              "video": "https://www.youtube.com/watch?v=q-g_Yy-T90w"
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

1️⃣ ESTRUCTURA DE DÍAS:
   • Genera ${durationWeeks} semanas completas
   • Cada semana: ${frequency} días de entrenamiento
   • ELIGE LA FORMA DE ENTRENAMIENTO que mejor se adapte (ver sección anterior)
   • BASÁNDOTE en: Objetivo, Nivel, Género y Frecuencia
   • CADA DÍA debe iniciar con 3-4 ejercicios de ENTRADA EN CALOR
   • El calentamiento SIEMPRE incluye movilidad articular específica con breve explicación
   • SOLO agrega cardio en el calentamiento cuando el objetivo sea "Pérdida de grasa"
   • TODOS los ejercicios van en un array "exercises" (no hay campo "warmup" separado)
   • Ejercicios de entrada en calor tienen prefijo "[ENTRADA EN CALOR]" en el nombre (solo en name, NO en notes)

2️⃣ ENTRADA EN CALOR (primeros ejercicios del día):
   OBLIGATORIO para CADA día de entrenamiento:

   Sets: "1" o "2" (nunca múltiples series pesadas)
   Reps: Duración o rango ligero (ej: "5 min", "2 min", "10 reps", "10-15 reps")
   RIR: "3" (siempre sencillo, nunca a fatiga)
   Tempo: "0000" o movimiento natural (no cuenta)
   Rest: "0s" o tiempo natural entre movimientos

   Condiciones:
   - Cardio SÓLO si el objetivo es "Pérdida de grasa" (5 min a 60-65% FC máx). Si no, reemplaza cardio por activación articular o patrones ligeros sin impacto.
   - SIEMPRE incluye movilidad articular específica con explicación del propósito (ej: escapular, cadera, tobillo, torácica).

   Los tipos según el día (aplica la regla de cardio según objetivo):
   - Push/Pecho: movilidad hombros/escápula + flexiones de activación (cardio solo si Pérdida de grasa)
   - Pull/Espalda: movilidad escapular + dominadas asistidas o remo técnico (cardio solo si Pérdida de grasa)
   - Pierna: movilidad cadera/tobillo + sentadilla corporal o leg press ligero (cardio solo si Pérdida de grasa)
   - Full Body: movilidad articular completa + movimiento compuesto ligero (cardio solo si Pérdida de grasa)

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

   name: Exacto y claro. Prefijo "[ENTRADA EN CALOR]" para calentamiento. Ej: "[ENTRADA EN CALOR] Trote en cinta"
   sets: Número (string). "1", "2", "3", "4", etc
   reps: Rango o duración (string). "8-10", "10-12", "3 min", "2 min (10 reps)", etc
   rir: Rango en reserva (0-3, donde 0=fallo, 3=fácil). String. Para warmup: "3"
   tempo: Cadencia 4 dígitos o "0000" para natural. "3010", "2020", "0000"
   rest: Descanso entre series. "30s", "60s", "90s", "120s", "0s"
   notes: MÁXIMO 2-3 RENGLONES (~250 caracteres). TÉCNICA + MOTIVACIÓN BREVE. NUNCA excedas para que PDF imprima bien.
   video: URL YouTube REAL y VERIFICADA.

5️⃣ VIDEOS DE YOUTUBE - CRÍTICO PARA PROFESIONALISMO:

   FORMATO: "https://www.youtube.com/watch?v=[ID_VIDEO]"

   CANALES VERIFICADOS Y CONFIABLES:
   ✓ AthleanX (Jeff Cavaliere) - Biomecánica perfecta
   ✓ Jeff Nippard - Ciencia basada en evidencia
   ✓ Powerexplosive - Técnica hispana de élite
   ✓ ScottHermanFitness - Demos claras técnica
   ✓ Omar Isuf (OMarcusFlexington) - Análisis profundo
   ✓ Stronger by Science - Investigación aplicada

   REFERENCIAS VERIFICADAS (Base de datos de calidad):
   - Press de Banca: https://www.youtube.com/watch?v=rT7DgCr-3pg (AthleanX)
   - Sentadilla: https://www.youtube.com/watch?v=ultWZbUMPL8 (Jeff Nippard)
   - Peso Muerto: https://www.youtube.com/watch?v=hd7xwxjwe8U (Jeff Nippard)
   - Dominadas: https://www.youtube.com/watch?v=eGo4IYlbE5g (ScottHermanFitness)
   - Remo Barra: https://www.youtube.com/watch?v=G8V_GCN3hOE (Powerexplosive)
   - Flexiones: https://www.youtube.com/watch?v=IODxDxX7oi4 (ScottHermanFitness)
   - Cardio/Trote: https://www.youtube.com/watch?v=loZXw7aFTQ4 (Generic pero claro)

   ⚠️ REGLA DE ORO CRÍTICA:
   - SI NO ESTÁS 100% SEGURO que un video existe y está HABILITADO, NO LO INCLUYAS
   - VIDEOS ROTOS = PÉRDIDA TOTAL DE PROFESIONALISMO
   - Mejor: Usa referencias verificadas que conoces que funcionan
   - Búsqueda de alternativas: Mismo canal, mismo ejercicio, si cambia el ID

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

   Diferencia SEMANAS para prevenir meseta de adaptación:

   PARADIGMA A - VOLUMEN PROGRESIVO (para hipertrofia):
   - Semana 1-2: Sets base, reps superiores (~8-12)
   - Semana 3-4: AUMENTA sets (+1 set por ejercicio), mantén o baja reps
   - Progresión: Volumen total = sets x reps x peso

   PARADIGMA B - INTENSIDAD PROGRESIVA (para fuerza):
   - Semana 1-2: Reps base, peso controlado (aprendizaje)
   - Semana 3-4: MANTÉN sets, REDUCE reps, AUMENTA peso
   - Progresión: Peso lineal semana a semana (~2.5-5%)

   PARADIGMA C - VARIACIÓN TÉCNICA (para versatilidad):
   - Semana 1: Ejercicio A con técnica X
   - Semana 2: Ejercicio A con técnica Y (ej: pausa, tiempo)
   - Semana 3: Ejercicio A con técnica Z (ej: tempo, ROM)
   - Propósito: Estimula músculos constantemente, previene aburrimiento

   REGLA GENERAL:
   - Varía EJERCICIOS pero MANTÉN PATRONES DE MOVIMIENTO
   - Si Semana 1: Press de Banca → Semana 3: Press Inclinado (igual patrón, distinto ángulo)
   - Mantén consistencia: Mismo split, mismo volumen, diferente estímulo

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
✅ video (URL YouTube VERIFICADA - SIN VIDEOS ROTOS)

NO FALTES en notas. Las notas separan profesionales de amateurs. Cada ejercicio tiene una historia técnica que contar + un mensaje de mentalidad que recortar.

Video roto = rutina incompleta. Referencias verificadas SIEMPRE.

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

VALIDACIÓN FINAL ANTES DE RESPONDER:
Antes de responder, verifica:
1. ¿Comienza con { exactamente?
2. ¿Termina con } exactamente?
3. ¿No hay texto adicional antes ni después?
4. ¿No hay bloques de código?
5. ¿Es JSON válido?

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
