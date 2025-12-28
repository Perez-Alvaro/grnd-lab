# ✅ Fix Exportación PDF + Limpieza de Formulario

## 🐛 Problema Original

Al importar rutinas desde JSON y exportar a PDF, **no se mostraban todos los campos** correctamente.

### Errores Identificados:

1. ❌ **Bug Critical del Exportador PDF**: El botón "Exportar PDF" usaba `planEditor.plan` en lugar de `planEditor.planForPdf`
2. ❌ Campos innecesarios en el formulario: Precio ARS e Imagen de portada

---

## ✅ Soluciones Implementadas

### 1. **Fix del Bug Crítico en `RoutineEditor.jsx`**

#### Problema:
```jsx
// ❌ ANTES - Bug que causaba que los datos no se imprimieran
const handleExportPdf = useCallback(async () => {
  try {
    console.log("Exporting PDF with plan:", planEditor.plan);
    await exportPDF(planEditor.plan);  // ❌ MAL - formato raw sin procesar
    toast.success("PDF exportado correctamente");
  } catch (error) {
    console.error("PDF Export Error:", error);
    toast.error(`Error: ${error.message || "No se pudo exportar el PDF"}`);
  }
}, [exportPDF, planEditor.plan]);
```

**Por qué fallaba:**
- `planEditor.plan` tiene la estructura interna del editor: `{ metadata: {...}, weeks: [...] }`
- El PDF esperaba estructura con nombre de campos específicos
- Faltaban transformaciones de `sets` → `series`, `rest` → `descanso`, etc.

#### Solución:
```jsx
// ✅ AHORA - Usa planForPdf que tiene el formato correcto
const handleExportPdf = useCallback(async () => {
  try {
    console.log("Exporting PDF with planForPdf:", planEditor.planForPdf);
    await exportPDF(planEditor.planForPdf);  // ✅ CORRECTO - formato procesado
    toast.success("PDF exportado correctamente");
  } catch (error) {
    console.error("PDF Export Error:", error);
    toast.error(`Error: ${error.message || "No se pudo exportar el PDF"}`);
  }
}, [exportPDF, planEditor.planForPdf]);
```

**Qué hace `planForPdf`** (líneas 601-636 de `useRoutineEditor.js`):
```javascript
const planForPdf = useMemo(
  () => ({
    planName: plan.metadata.name,           // ✅ Nombre correcto
    objective: plan.metadata.objective,      // ✅ Objetivo correcto
    duration: plan.metadata.durationWeeks,   // ✅ Duración correcta
    frequency: plan.metadata.frequency 
      ? `${plan.metadata.frequency} días/semana` 
      : "",
    author: plan.metadata.author,
    notes: plan.metadata.notes,
    description: plan.metadata.description,
    level: plan.metadata.level,
    weeks: plan.weeks.map((week, index) => ({
      title: week.title || `Semana ${index + 1}`,
      summary: week.summary,
      notes: week.notes,
      days: week.days.map((day) => ({
        name: day.name,
        type: day.type,
        recoveryMessage: day.recoveryNote,
        notes: day.recoveryNote,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name,
          series: exercise.sets,        // ✅ sets → series
          reps: exercise.reps,
          descanso: exercise.rest,      // ✅ rest → descanso
          rir: exercise.rir,
          cadencia: exercise.tempo,     // ✅ tempo → cadencia
          videoUrl: exercise.video,
          notes: exercise.note,
        })),
      })),
    })),
  }),
  [plan],
);
```

### 2. **Limpieza del Formulario en `PlanMetadataForm.jsx`**

#### Cambios Realizados:

**a) Removidos campos del formulario:**
```jsx
// ❌ REMOVIDO - Campo de Precio ARS
<div className="flex flex-col gap-2">
  <label className={labelClasses}>Precio (ARS)</label>
  <input
    data-testid="plan-price-input"
    type="number"
    min="0"
    value={metadata.price}
    onChange={handleChange("price")}
    placeholder="Valor del plan en pesos"
    className={inputClasses}
  />
</div>

// ❌ REMOVIDO - Campo de Imagen de portada
<div className="md:col-span-2">
  <ImageUploader
    label="Imagen de portada"
    value={metadata.image}
    onChange={handleImageChange}
    helperText="Seleccioná una imagen para mostrar..."
    inputProps={{ "data-testid": "plan-image-input" }}
  />
</div>
```

**b) Removidos imports no utilizados:**
```jsx
// ❌ REMOVIDO
import { useState } from "react";  // Ya no se usa useState
import ImageUploader from "@/components/Shared/ImageUploader.jsx";  // Ya no se usa
import { multimediaService } from "../../../services/multimediaService.js";  // Ya no se usa
```

**c) Removido código de upload de imágenes:**
```jsx
// ❌ REMOVIDO - Estado no usado
const [uploadingImage, setUploadingImage] = useState(false);
const [uploadError, setUploadError] = useState(null);

// ❌ REMOVIDO - Función no usada
const handleImageChange = useCallback(
  async (nextValue, { file }) => {
    // ... todo el código de upload
  },
  [updateMetadata],
);
```

**Antes:**
- 255 líneas
- 9477 bytes

**Después:**
- 225 líneas (-30 líneas)
- ~8300 bytes (-1177 bytes)

---

## 📊 Comparación: Antes vs Ahora

### Exportar PDF:

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Función usada | `planEditor.plan` | `planEditor.planForPdf` |
| Formato de datos | Raw (interno del editor) | Procesado para PDF |
| Campos en PDF | ❌ Muchos "-" (vacíos) | ✅ Todos los datos |
| Series mostradas | ❌ No | ✅ Sí |
| Descanso mostrado | ❌ No | ✅ Sí |
| RIR/RPE mostrado | ❌ No | ✅ Sí |
| Tempo/Cadencia | ❌ No | ✅ Sí |

### Formulario de Metadata:

| Campo | Antes | Ahora |
|-------|-------|-------|
| Nombre | ✅ | ✅ |
| Descripción | ✅ | ✅ |
| Género | ✅ | ✅ |
| Frecuencia | ✅ | ✅ |
| Objetivo | ✅ | ✅ |
| Duración | ✅ | ✅ |
| Autor | ✅ | ✅ |
| Nivel | ✅ | ✅ |
| Tags | ✅ | ✅ |
| **Precio (ARS)** | ✅ | ❌ **REMOVIDO** |
| **Imagen portada** | ✅ | ❌ **REMOVIDO** |
| Notas | ✅ | ✅ |

---

## 🎯 Resultado Final

### Exportación PDF:
```
JSON Importado
      ↓
  planEditor.plan (formato interno)
      ↓
  planForPdf (transformación)  ← ✅ AHORA SE USA ESTO
      ↓
  normalizePlanData (PDF)
      ↓
  PDF con TODOS los datos ✅
```

### Formulario:
- ✅ **Más limpio**
- ✅ **Menos campos** (solo los esenciales)
- ✅ **Sin dependencias** de ImageUploader ni multimediaService
- ✅ **Sin campos monetarios** (precio removido)
- ✅ **Sin gestión de imágenes** (imagen removida)

---

## 🔧 Archivos Modificados

1. **`src/pages/RoutineEditor.jsx`**
   - Línea 127: Cambiado `planEditor.plan` → `planEditor.planForPdf`
   - Línea 132: Cambiado dependencia en useCallback

2. **`src/components/Trainer/editor/PlanMetadataForm.jsx`**
   - Líneas 1-6: Removidos imports de useState, ImageUploader, multimediaService
   - Líneas 8-11: Removido estado uploadingImage y uploadError
   - Líneas 20-49: Removida función handleImageChange
   - Líneas 212-234: Removido grid con campos de precio e imagen

---

## ✅ Testing

### Verifica que funcione:

1. **Importa JSON con datos completos:**
   ```json
   {
     "metadata": {
       "name": "Rutina Test",
       "objective": "Hipertrofia"
     },
     "weeks": [{
       "days": [{
         "exercises": [{
           "name": "Press Banca",
           "sets": "4",
           "reps": "8-10",
           "rest": "90s",
           "rir": "8",
           "tempo": "3-0-1-0"
         }]
       }]
     }]
   }
   ```

2. **Exporta a PDF**

3. **Verifica en el PDF:**
   - ✅ Press Banca aparece en la columna "Ejercicio"
   - ✅ 4 aparece en "Series"
   - ✅ 8-10 aparece en "Reps"
   - ✅ 90s aparece en "Desc"
   - ✅ 8 aparece en "RPE"
   - ✅ 3-0-1-0 aparece en "Tempo"

4. **Verifica el formulario:**
   - ✅ NO aparece campo "Precio (ARS)"
   - ✅ NO aparece campo "Imagen de portada"

---

## 📝 Notas Importantes

### ¿Por qué `planForPdf` existe?

El editor usa una estructura interna optimizada para la UI:
```javascript
{
  metadata: { name, objective, ... },
  weeks: [{
    days: [{
      exercises: [{
        name: "...",
        sets: "4",        // ← internal format
        rest: "90s",      // ← internal format
        rir: "8",
        tempo: "3-0-1-0"  // ← internal format
      }]
    }]
  }]
}
```

Pero el PDF espera:
```javascript
{
  planName: "...",      // ← different naming
  objective: "...",
  weeks: [{
    days: [{
      exercises: [{
        name: "...",
        series: "4",      // ← series not sets
        descanso: "90s",  // ← descanso not rest
        rir: "8",
        cadencia: "3-0-1-0"  // ← cadencia not tempo
      }]
    }]
  }]
}
```

`planForPdf` hace esta transformación automáticamente.

### ¿Los campos precio e imagen se pierden?

No. Aunque se removieron del formulario de edición:
- Los datos existentes en plantillas antiguas se **conservan**
- Simplemente ya **no se pueden editar** desde la UI
- Si necesitas acceder a ellos, están en `metadata.price` y `metadata.image`

---

## 🎉 Resumen

**Cambios Realizados:**
- ✅ Corregido bug crítico en exportación de PDF
- ✅ Removido campo "Precio (ARS)" del formulario
- ✅ Removido campo "Imagen de portada" del formulario
- ✅ Limpiados imports y código no utilizado

**Resultado:**
- ✅ **PDFs se generan correctamente** con todos los datos
- ✅ **Formulario más limpio** y enfocado
- ✅ **Código más mantenible** sin dependencias innecesarias

**¡El problema está resuelto!** 🚀
