# 🎯 PROMPT MAESTRO — Ejemplo Completo

Este es un ejemplo real del **Prompt Maestro** que genera GRIND LAB cuando configuras una rutina.

---

## 📋 Metadatos del Ejemplo

- **Nombre**: Rutina Push/Pull/Legs
- **Objetivo**: Volumen muscular
- **Nivel**: Intermedio
- **Frecuencia**: 4 días/semana
- **Duración**: 4 semanas
- **Técnicas**: Drop Sets, Superseries
- **Género**: Masculino

---

## 🤖 PROMPT COMPLETO GENERADO

```
ACTÚA COMO UN ENTRENADOR PERSONAL EXPERTO CON AÑOS DE EXPERIENCIA.

Tu misión es crear una rutina de entrenamiento PROFESIONAL y DETALLADA en formato JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INFORMACIÓN DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Género: Masculino
🎯 Objetivo: Volumen muscular
📊 Nivel: Intermedio
📅 Frecuencia: 4 días por semana
⏱️ Duración: 4 semanas
🏷️ Técnicas/Tags: Drop Sets, Superseries
📝 Notas especiales: Ninguna

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 ESTRUCTURA REQUERIDA (COPIA EXACTA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Debes responder ÚNICAMENTE con un objeto JSON válido. NO agregues texto antes ni después.

ESQUEMA EXACTO:

{
  "name": "Rutina Push/Pull/Legs",
  "description": "Rutina de hipertrofia muscular",
  "metadata": {
    "author": "Coach",
    "gender": "Masculino",
    "objective": "Volumen muscular",
    "level": "Intermedio",
    "frequency": "4",
    "durationWeeks": "4",
    "tags": "Drop Sets, Superseries"
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
              "name": "Press de Banca con Barra",
              "sets": "4",
              "reps": "8-10",
              "rir": "2",
              "tempo": "3010",
              "rest": "90s",
              "notes": "Controla la fase excéntrica (3s bajada). Mantén escápulas retraídas y pies firmes en el suelo",
              "video": "https://www.youtube.com/watch?v=EJEMPLO1"
            },
            {
              "name": "Press Inclinado con Mancuernas",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "Banco a 45 grados. Baja hasta sentir estiramiento en pecho superior. Evita arquear excesivamente la espalda",
              "video": "https://www.youtube.com/watch?v=EJEMPLO2"
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
   - Genera 4 semanas completas
   - Cada semana debe tener 4 días de entrenamiento
   - Cada día debe tener entre 5-8 ejercicios

2. CAMPOS OBLIGATORIOS por ejercicio:
   ⚠️ TODOS los campos deben estar completos. NO dejes ningún campo vacío.
   
   - name: Nombre claro y específico del ejercicio
   - sets: Número de series (ej: "3", "4", "3-4")
   - reps: Rango de repeticiones (ej: "8-12", "10-15") o duración si es isométrico
   - rir: Repeticiones en Reserva (0-3, donde 0=fallo, 3=fácil)
   - tempo: Cadencia 4 dígitos (ej: "3010" = 3s bajar, 0s pausa, 1s subir, 0s arriba)
   - rest: Descanso entre series (ej: "60s", "90s", "120s")
   - notes: Consejos técnicos, instrucciones de forma, precauciones y tips explicativos
   - video: URL de YouTube con demostración del ejercicio
   
   📹 VIDEOS DE YOUTUBE:
   - OBLIGATORIO: Cada ejercicio DEBE incluir un link de YouTube válido
   - Usa videos de canales reconocidos de fitness (AthleanX, Jeff Nippard, Buff Academy, etc.)
   - Verifica que los videos estén disponibles públicamente hasta DICIEMBRE 2025
   - El formato debe ser: "https://www.youtube.com/watch?v=CODIGO_VIDEO"
   - Busca videos que demuestren la técnica correcta con ángulos claros
   - Si un ejercicio tiene variaciones, elige el video que mejor muestre la versión específica
   
   📝 NOTAS EXPLICATIVAS:
   - Las notas deben ser DETALLADAS y ÚTILES, no genéricas
   - Incluye puntos clave de técnica (ej: "Mantén los codos a 45°, escápulas retraídas")
   - Agrega precauciones si el ejercicio es técnicamente complejo
   - Menciona errores comunes a evitar cuando sea relevante
   - Si aplica una técnica especial (drop set, superserie), especifícalo claramente

3. ADAPTACIÓN AL OBJETIVO:

   📈 VOLUMEN MUSCULAR:
   - Sets: 3-5 por ejercicio
   - Reps: 8-12
   - RIR: 1-2 (cerca del fallo)
   - Tempo: 3010 o 3110 (enfatiza excéntrica)
   - Rest: 60-90s
   - Incluye técnicas avanzadas: drop sets, superseries si hay tags

4. NIVEL DE DIFICULTAD:

   🏃 INTERMEDIO:
   - Mezcla de ejercicios básicos y aislados
   - Introduce variaciones
   - Volumen medio-alto
   - Puedes usar superseries básicas

5. TÉCNICAS ESPECÍFICAS (Tags):

   Aplica estas técnicas: Drop Sets, Superseries
   
   - Usa drop sets en los últimos sets de ejercicios principales
   - Combina ejercicios en superseries (sin descanso entre ellos)

6. VARIACIÓN ENTRE SEMANAS:
   - Semana 1-2: Volumen base
   - Semana 3-4: Incrementa intensidad (más peso, menos reps) o volumen (más sets)
   - Varía los ejercicios pero mantén los patrones de movimiento
   - Incorpora periodización ondulante si es nivel avanzado

7. GROUPS MUSCULARES (para 4 días/semana):

   - Día 1: Push (Pecho, Hombros, Tríceps)
   - Día 2: Pull (Espalda, Bíceps)
   - Día 3: Pierna (Cuádriceps, Femorales, Glúteos)
   - Día 4: Upper (Torso completo)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 IMPORTANTE - FORMATO DE RESPUESTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ RESPONDE ÚNICAMENTE CON EL JSON. SIN TEXTO ADICIONAL.
⚠️ NO uses bloques de código markdown (```json)
⚠️ NO agregues explicaciones antes ni después
⚠️ EMPIEZA directamente con { y TERMINA con }
⚠️ Asegúrate de que sea JSON VÁLIDO (sin comas finales, comillas correctas)

Genera la rutina AHORA:
```

---

## 🎯 Análisis del Prompt

### ¿Por qué este prompt es superior?

#### 1. **Contexto Completo**
No es solo "crea una rutina". El prompt incluye:
- Perfil del cliente (género, nivel, objetivo)
- Parámetros exactos (frecuencia, duración)
- Técnicas especiales (Drop Sets, Superseries)

#### 2. **Estructura Rigurosa**
Muestra el esquema JSON exacto esperado, incluyendo:
- Nombres de campos
- Formato de valores
- Jerarquía de objetos

#### 3. **Reglas Adaptativas**
Dependiendo del objetivo (volumen, fuerza, pérdida de grasa), el prompt incluye:
- Rangos de sets/reps específicos
- Valores de RIR (proximidad al fallo)
- Tiempos de descanso óptimos
- Tempo recomendado

#### 4. **Técnicas Avanzadas**
Si el usuario especifica técnicas (FST-7, Drop Sets, etc.), el prompt:
- Explica cómo aplicarlas
- Indica en qué ejercicios usarlas
- Define frecuencia de aplicación

#### 5. **Validaciones Claras**
Las instrucciones finales son explícitas:
- ❌ NO uses markdown
- ❌ NO agregues texto extra
- ✅ SÍ empieza con `{` directamente
- ✅ SÍ valida que el JSON sea correcto

---

## 📊 Comparación con Prompt Genérico

### ❌ Prompt Genérico
```
"Crea una rutina de 4 días para ganar músculo"
```

**Problemas**:
- Sin estructura
- Sin formato específico
- IA devuelve texto, no JSON
- Resultados inconsistentes
- No controlable

### ✅ GRIND LAB Prompt Maestro
```
"ACTÚA COMO ENTRENADOR EXPERTO.
Genera JSON válido con estructura exacta:
{ name, metadata, weeks: [...] }

Para Volumen Muscular:
- Sets: 3-5
- Reps: 8-12
- RIR: 1-2
- Tempo: 3010
- Rest: 60-90s
[...250 líneas de instrucciones]"
```

**Ventajas**:
- ✅ Estructura clara y predecible
- ✅ Formato JSON válido garantizado
- ✅ Parámetros profesionales
- ✅ Técnicas avanzadas aplicadas correctamente
- ✅ Resultados consistentes y editables

---

## 🧠 Ingeniería de Prompts de Élite

### Principios Aplicados

1. **Role-Playing**
   - "ACTÚA COMO UN ENTRENADOR PERSONAL EXPERTO"
   - Establece autoridad y contexto

2. **Few-Shot Learning**
   - Muestra ejemplo exacto del JSON esperado
   - IA aprende el patrón

3. **Constraint Definition**
   - Reglas explícitas (sets, reps, RIR, tempo)
   - Elimina ambigüedad

4. **Output Format Specification**
   - "RESPONDE ÚNICAMENTE CON JSON"
   - "NO uses markdown"
   - Previene errores de parseo

5. **Conditional Logic**
   - IF objetivo = volumen → instrucciones específicas
   - IF tags = drop sets → aplicar técnica
   - Adaptación inteligente

---

## 🚀 Resultados Esperados

Al pegar este prompt en ChatGPT/Claude, obtendrás:

```json
{
  "name": "Rutina Push/Pull/Legs",
  "description": "Rutina de hipertrofia muscular",
  "metadata": {
    "author": "Coach",
    "gender": "Masculino",
    "objective": "Volumen muscular",
    "level": "Intermedio",
    "frequency": "4",
    "durationWeeks": "4",
    "tags": "Drop Sets, Superseries"
  },
  "weeks": [
    {
      "name": "Semana 1",
      "days": [
        {
          "name": "Día 1 - Push",
          "type": "training",
          "exercises": [
            {
              "name": "Press Banca",
              "sets": "4",
              "reps": "8-10",
              "rir": "2",
              "tempo": "3010",
              "rest": "90s",
              "notes": "Drop set en última serie: reduce 20% del peso y continúa hasta el fallo. Mantén escápulas retraídas durante todo el movimiento",
              "video": "https://www.youtube.com/watch?v=ejemplo_press_banca"
            },
            {
              "name": "Press Inclinado + Aperturas",
              "sets": "3",
              "reps": "10-12",
              "rir": "2",
              "tempo": "2010",
              "rest": "60s",
              "notes": "Superserie: Press Inclinado seguido inmediatamente de Aperturas. Banco a 30-45°. Enfoca en squeeze al contraer",
              "video": "https://www.youtube.com/watch?v=ejemplo_press_inclinado"
            }
            // ... +5 ejercicios más
          ]
        },
        {
          "name": "Día 2 - Pull",
          "type": "training",
          "exercises": [...]
        },
        {
          "name": "Día 3 - Legs",
          "type": "training",
          "exercises": [...]
        },
        {
          "name": "Día 4 - Upper",
          "type": "training",
          "exercises": [...]
        }
      ]
    },
    {
      "name": "Semana 2",
      "days": [...]
    },
    {
      "name": "Semana 3",
      "days": [...]
    },
    {
      "name": "Semana 4",
      "days": [...]
    }
  ]
}
```

Este JSON es:
- ✅ **Válido**: Se puede parsear directamente
- ✅ **Estructurado**: Sigue el esquema exacto
- ✅ **Profesional**: Parámetros técnicos correctos
- ✅ **Editable**: En el editor de GRIND LAB
- ✅ **Exportable**: A PDF con un clic

---

## 💡 Conclusión

El **Prompt Maestro** de GRIND LAB no es un simple texto.  
Es una **especificación técnica** de ~250 líneas que:

1. **Comunica el contexto completo** a la IA
2. **Define la estructura exacta** del output
3. **Aplica reglas según el objetivo** (volumen/fuerza/pérdida)
4. **Incorpora técnicas avanzadas** (Drop Sets, FST-7, etc.)
5. **Valida el formato** para evitar errores

**Resultado**: Rutinas profesionales, no outputs genéricos.

---

**Diseñado por**: GRIND LAB Engineering Team  
**Versión**: 1.0  
**Fecha**: Diciembre 2025
