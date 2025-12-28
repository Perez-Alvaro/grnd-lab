# ✅ Problema de Impresión PDF Resuelto

## 🐛 Problema

Al importar rutinas desde JSON y luego generar el PDF, **no se imprimían todos los campos** que se veían en el formulario del editor.

### Campos que faltaban:
- ❌ **Duración** de ejercicios
- ❌ **RPE** (Rate of Perceived Exertion)
- ❌ **Cues** técnicos
- ❌ **Progresión** de ejercicios
- ❌ Información completa de **metadata**
- ❌ **Equipamiento**
- ❌ **Foco** de la rutina

---

## ✅ Solución Implementada

Se actualizaron **3 archivos clave** para mapear correctamente todos los campos del formato del editor al PDF:

### 1. **`pdf/utils/pdfLayout.js`** - Normalización de Datos

#### Cambios en `normalizeExercise()`:
```javascript
// ANTES: Solo mapeaba campos básicos
const normalizeExercise = (exercise, blockTitle) => {
  return {
    name: exercise?.name,
    series: exercise.series,
    reps: exercise.reps,
    descanso: exercise.descanso,
    rir: exercise.rir,
    tempo: exercise.tempo,
    videoUrl: exercise.video,
  };
};

// AHORA: Mapea TODOS los campos incluyendo los nuevos
const normalizeExercise = (exercise, blockTitle) => {
  // Soportar tanto RIR como RPE
  const rir = variant.rir ?? exercise.rir ?? variant.rpe ?? exercise.rpe ?? "";
  
  // Nuevos campos agregados
  const duracion = exercise.duracion ?? "";
  const cues = exercise.cues ?? "";
  const progresion = exercise.progresion ?? "";
  
  // Agregar cues y progresión a las notas
  const baseNotes = [
    blockTitle && blockTitle !== "Entrenamiento" ? `Bloque: ${blockTitle}` : null,
  ]
    .concat(toArray(exercise?.notes || exercise?.notas))
    .concat(cues ? [`Cues: ${cues}`] : [])
    .concat(progresion ? [`Progresión: ${progresion}`] : [])
    .filter(Boolean);

  return {
    name: exercise?.ejercicio || exercise?.name || exercise?.nombre || "Ejercicio",
    series: series ? String(series) : "",
    reps: reps ? String(reps) : "",
    descanso: descanso ? String(descanso) : "",
    duracion: duracion ? String(duracion) : "", // ✅ NUEVO
    rir: (rir === 0 || rir) ? String(rir) : "",
    tempo: (tempo === 0 || tempo) ? String(tempo) : "",
    videoUrl: exercise?.videoUrl || exercise?.video || "",
    notes: baseNotes, // ✅ Incluye cues y progresión
  };
};
```

#### Cambios en `normalizeDay()`:
```javascript
// AHORA: Soporta correctamente el formato del editor con bloques
else if (Array.isArray(day?.bloques)) {
  // Formato del editor: bloques con ejercicios
  exercises = day.bloques.flatMap((block) =>
    (block?.ejercicios || block?.items || []).map((exercise) =>
      normalizeExercise(exercise, block?.titulo || block?.tipo),
    ),
  );
}
```

#### Cambios en `normalizePlanData()`:
```javascript
// ANTES: Solo buscaba en formato plano
const metadata = planData || {};
const weeksSource = metadata?.weeks || metadata?.semanas;

// AHORA: Soporta formato con 'meta'
const metadata = planData?.meta || planData || {};
const weeksSource = planData?.weeks || planData?.semanas || 
                    metadata?.weeks || metadata?.semanas;

return {
  title: metadata?.nombre || planData?.nombre || "Plan de entrenamiento",
  objective: metadata?.objetivo || metadata?.foco || "", // ✅ Incluye foco
  author: metadata?.autor || metadata?.coach || "", // ✅ Incluye autor
  equipment: metadata?.equipamiento || "", // ✅ NUEVO
  durationWeeks: metadata?.duracion || metadata?.semanas || "",
  // ... más campos mapeados
};
```

### 2. **`pdf/sections/WeekSection.jsx`** - Visualización

#### Columna de Duración Agregada:
```jsx
// ANTES: 7 columnas
<View style={[styles.tableRow, styles.tableHeaderRow]}>
  <Text style={[styles.tableCell, styles.exerciseCol]}>Ejercicio</Text>
  <Text style={[styles.tableCell, styles.seriesCol]}>Series</Text>
  <Text style={[styles.tableCell, styles.repsCol]}>Reps</Text>
  <Text style={[styles.tableCell, styles.restCol]}>Desc</Text>
  <Text style={[styles.tableCell, styles.rirCol]}>RIR</Text>
  <Text style={[styles.tableCell, styles.tempoCol]}>Cadencia</Text>
  <Text style={[styles.tableCell, styles.videoCol]}>Video</Text>
</View>

// AHORA: 8 columnas con Duración
<View style={[styles.tableRow, styles.tableHeaderRow]}>
  <Text style={[styles.tableCell, styles.exerciseCol]}>Ejercicio</Text>
  <Text style={[styles.tableCell, styles.seriesCol]}>Series</Text>
  <Text style={[styles.tableCell, styles.repsCol]}>Reps</Text>
  <Text style={[styles.tableCell, styles.restCol]}>Desc</Text>
  <Text style={[styles.tableCell, styles.durationCol]}>Durac</Text> {/* ✅ NUEVO */}
  <Text style={[styles.tableCell, styles.rirCol]}>RPE</Text> {/* ✅ Cambiado de RIR a RPE */}
  <Text style={[styles.tableCell, styles.tempoCol]}>Tempo</Text>
  <Text style={[styles.tableCell, styles.videoCol]}>Video</Text>
</View>
```

#### Renderizado de Duración:
```jsx
const durationValue = exercise.duracion ?? exercise.duration;
const duration = durationValue === 0 || durationValue ? durationValue : "–";

// En la fila de la tabla:
<Text style={[styles.tableCell, styles.durationCol]}>{duration}</Text>
```

### 3. **`pdf/utils/pdfStyles.js`** - Estilos

#### Nuevo estilo para columna de duración:
```javascript
durationCol: {
  flexBasis: "10%",
  minWidth: 40,
  textAlign: "center",
},
```

#### Ajustes de ancho de otras columnas:
```javascript
// Redistribución para hacer espacio a la nueva columna
restCol: { flexBasis: "10%", minWidth: 40 },     // Antes: 12%
tempoCol: { flexBasis: "11%", minWidth: 48 },    // Antes: 12%
videoCol: { flexBasis: "11%", minWidth: 44 },    // Antes: 12%
```

---

## 📊 Campos Ahora Incluidos en el PDF

### Tabla de Ejercicios:
| Campo | Antes | Ahora |
|-------|-------|-------|
| Ejercicio | ✅ | ✅ |
| Series | ✅ | ✅ |
| Reps | ✅ | ✅ |
| Descanso | ✅ | ✅ |
| **Duración** | ❌ | ✅ |
| **RPE** | ⚠️ (solo RIR) | ✅ |
| Tempo | ✅ | ✅ |
| Video | ✅ | ✅ |

### Notas del Ejercicio:
| Campo | Antes | Ahora |
|-------|-------|-------|
| Notas básicas | ✅ | ✅ |
| **Cues técnicos** | ❌ | ✅ |
| **Progresión** | ❌ | ✅ |
| Bloque | ✅ | ✅ |

### Metadata de la Rutina:
| Campo | Antes | Ahora |
|-------|-------|-------|
| Nombre | ✅ | ✅ |
| **Foco/Objetivo** | ⚠️ | ✅ |
| Autor | ✅ | ✅ |
| Nivel | ✅ | ✅ |
| Duración | ✅ | ✅ |
| Frecuencia | ✅ | ✅ |
| **Equipamiento** | ❌ | ✅ |
| Tags | ✅ | ✅ |
| Descripción | ✅ | ✅ |

---

## 🎯 Formato del Editor vs PDF

El sistema ahora mapea correctamente entre formatos:

```
FORMATO DEL EDITOR           →    FORMATO PDF
───────────────────────────────────────────────────
meta.nombre                  →    title
meta.foco                    →    objective
meta.autor                   →    author
meta.equipamiento            →    equipment
semanas                      →    weeks
semanas[].dias               →    weeks[].days
dias[].bloques[].ejercicios  →    days[].exercises
ejercicios[].nombre          →    exercises[].name
ejercicios[].duracion        →    exercises[].duracion
ejercicios[].rpe             →    exercises[].rir
ejercicios[].cues            →    exercises[].notes (incluido)
ejercicios[].progresion      →    exercises[].notes (incluido)
```

---

## 🧪 Cómo Verificar

1. **Importa una rutina desde JSON** con todos los campos:
   ```json
   {
     "meta": {
       "nombre": "Rutina Completa",
       "foco": "Hipertrofia",
       "autor": "Coach Pro",
       "equipamiento": "gimnasio"
     },
     "semanas": [{
       "nombre": "Semana 1",
       "dias": [{
         "nombre": "Día 1",
         "tipo": "ENTRENAMIENTO",
         "bloques": [{
           "tipo": "ENTRENAMIENTO",
           "ejercicios": [{
             "nombre": "Press Banca",
             "series": 4,
             "reps": "8-10",
             "descanso": "90s",
             "duracion": "3min",
             "rpe": "8",
             "tempo": "3-0-1-0",
             "cues": "Codos a 45 grados",
             "progresion": "+2kg cada semana"
           }]
         }]
       }]
     }]
   }
   ```

2. **Genera el PDF** desde el editor

3. **Verifica en el PDF**:
   - ✅ Portada muestra: Nombre, Foco, Autor, Equipamiento
   - ✅ Tabla tiene columna "Durac" con los valores
   - ✅ Columna "RPE" muestra los valores correctos
   - ✅ Notas debajo de la tabla incluyen Cues y Progresión

---

## 📝 Notas Importantes

### Compatibilidad Retroactiva
- ✅ El sistema sigue soportando formatos antiguos
- ✅ Si un campo nuevo no existe, se muestra "–" en el PDF
- ✅ Tanto `RIR` como `RPE` funcionan (son sinónimos)

### Campos en las Notas
Los **Cues** y **Progresión** aparecen como notas debajo de la tabla:
```
• Bloque: ENTRENAMIENTO
• Cues: Codos a 45 grados
• Progresión: +2kg cada semana
```

### Mapeo Flexible
El código busca múltiples variaciones de nombres de campo:
- `nombre` / `name` / `title` / `ejercicio`
- `rpe` / `rir`
- `descanso` / `rest`
- `duracion` / `duration`
- `equipamiento` / `equipment`

---

## ✅ Resumen

**Archivos Modificados:**
1. `src/pdf/utils/pdfLayout.js` - Normalización de datos
2. `src/pdf/sections/WeekSection.jsx` - Visualización de tabla
3. `src/pdf/utils/pdfStyles.js` - Estilos de columnas

**Cambios Principales:**
- ✅ Agregada columna "Duración" en tabla
- ✅ RPE mapeado correctamente (antes solo RIR)
- ✅ Cues y Progresión incluidos en notas
- ✅ Equipamiento y Foco en metadata
- ✅ Soporte completo para formato del editor con `meta` + `semanas`
- ✅ Mapeo flexible de nombres de campos

**Resultado:**
**¡Ahora todos los campos del formulario se imprimen correctamente en el PDF!** 🎉

---

## 🔍 Testing

Para probar que todo funciona:

```bash
# 1. Asegúrate que el sistema esté corriendo
npm run dev:all

# 2. Importa un JSON con todos los campos
# 3. Exporta a PDF
# 4. Verifica que todos los campos aparezcan
```

¡El problema está resuelto! 🚀
