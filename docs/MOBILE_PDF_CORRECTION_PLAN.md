# Plan de Corrección PDF Mobile - Estilo Mynter Exacto

## 📸 ANÁLISIS DE DISCREPANCIAS

### Comparación: Estado Actual vs Imagen Mynter

| Elemento | Estado Actual | Imagen Mynter | Acción Requerida |
|----------|---------------|---------------|------------------|
| **Portada** | ✅ Correcto | ✅ Igual | ✅ Mantener |
| **Header de día** | ⚠️ Parcial | Con contexto semana | 🔧 Agregar "Semana X" |
| **Título del día** | ✅ Verde neón 17pt | ✅ Verde neón grande | ✅ Mantener |
| **Subtítulo** | "Entrenamiento Principal" | "Entrenamiento Principal" | ✅ Mantener |
| **Tarjeta ejercicio - Fondo** | ✅ #3A3A3C | ✅ #3A3A3C | ✅ Mantener |
| **Tarjeta ejercicio - Borde** | ✅ Naranja 1pt | ✅ Naranja | ✅ Mantener |
| **Nombre ejercicio** | ✅ 12pt blanco bold | ✅ Blanco bold | ✅ Mantener |
| **Layout detalles** | ✅ Horizontal | ✅ Horizontal | ✅ Mantener |
| **Label tamaño** | 7pt gris | ⚠️ Parece 8pt | 🔧 Aumentar a 8pt |
| **Valor tamaño** | 10pt blanco | ✅ Similar | ✅ Mantener |
| **Spacing tarjetas** | 4px | ⚠️ Parece 5-6px | 🔧 Aumentar a 5px |
| **Padding tarjeta** | 6px | ⚠️ Parece 8px | 🔧 Aumentar a 8px |
| **Alto base card** | 32px | ⚠️ Parece 35px | 🔧 Aumentar a 35px |

---

## 🎯 CAMBIOS NECESARIOS (8 ajustes menores)

### 1. **Header de Día - Agregar Contexto de Semana**
**Problema:** Falta indicador visual de "Semana X" en el header  
**Solución:** Agregar badge pequeño de semana antes del nombre de la rutina

**ANTES:**
```
Rutina de Fuerza
Fuerza y potencia • 6 días/semana
───────────────────────────────
Día 1 - Sentadilla
```

**DESPUÉS:**
```
📋 Semana 1                    ← NUEVO
Rutina de Fuerza
Fuerza y potencia • 6 días/semana
───────────────────────────────
Día 1 - Sentadilla
```

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** ~185 (antes del nombre de la rutina)  
**Código:**
```javascript
// NUEVO: Badge de semana
doc.setFontSize(9);
doc.setTextColor(...textGray);
doc.setFont('helvetica', 'normal');
doc.text(`📋 Semana ${week.weekNumber || weekIndex + 1}`, margin, yPos);
yPos += 7;
```

---

### 2. **Padding Interno de Tarjetas**
**Problema:** Padding de 6px es muy ajustado  
**Solución:** Aumentar a 8px para más respiro visual

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** 251, 263  
**Cambio:**
```javascript
// ANTES
let cardYPos = yPos + 8;
let detailsX = margin + 6;

// DESPUÉS
let cardYPos = yPos + 9;  // +1px más espacio
let detailsX = margin + 8; // +2px más padding
```

---

### 3. **Tamaño de Labels**
**Problema:** 7pt es muy pequeño, difícil de leer  
**Solución:** Aumentar a 8pt

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** 275  
**Cambio:**
```javascript
// ANTES
doc.setFontSize(7);

// DESPUÉS
doc.setFontSize(8);
```

---

### 4. **Altura Base de Tarjeta**
**Problema:** 32px es muy compacto  
**Solución:** Aumentar a 35px

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** 234  
**Cambio:**
```javascript
// ANTES
const baseCardHeight = 32;

// DESPUÉS
const baseCardHeight = 35;
```

---

### 5. **Spacing Entre Tarjetas**
**Problema:** 4px es muy poco espacio  
**Solución:** Aumentar a 5px

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** ~308  
**Cambio:**
```javascript
// ANTES
yPos += cardHeight + 4;

// DESPUÉS
yPos += cardHeight + 5;
```

---

### 6. **Spacing de Detalles**
**Problema:** 33px entre columnas puede causar overlap  
**Solución:** Aumentar a 35px

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** 264  
**Cambio:**
```javascript
// ANTES
const detailSpacing = 33;

// DESPUÉS
const detailSpacing = 35;
```

---

### 7. **Nombre del Ejercicio - Wrap Text**
**Problema:** Nombres largos se cortan  
**Solución:** Usar splitTextToSize para wrap automático

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** 257  
**Cambio:**
```javascript
// ANTES
doc.text(exercise.name, margin + 6, cardYPos);

// DESPUÉS
const nameLines = doc.splitTextToSize(exercise.name, pageWidth - 2 * margin - 16);
doc.text(nameLines, margin + 8, cardYPos);
if (nameLines.length > 1) cardYPos += (nameLines.length - 1) * 5;
```

---

### 8. **Ajuste de Altura con Notas**
**Problema:** Cuando hay notas, +10px puede ser insuficiente  
**Solución:** Calcular altura dinámica basada en líneas de nota

**Archivo:** `src/services/pdfGeneratorMobile.js`  
**Línea:** 233-235  
**Cambio:**
```javascript
// ANTES
const hasNotes = exercise.notes || exercise.note;
const baseCardHeight = 32;
const cardHeight = hasNotes ? baseCardHeight + 10 : baseCardHeight;

// DESPUÉS
const hasNotes = exercise.notes || exercise.note;
const baseCardHeight = 35;
let extraHeight = 0;
if (hasNotes) {
  const noteText = exercise.notes || exercise.note;
  const noteLines = doc.splitTextToSize(noteText, pageWidth - 2 * margin - 16);
  extraHeight = noteLines.length * 4 + 6; // 4px por línea + 6px padding
}
const cardHeight = baseCardHeight + extraHeight;
```

---

## 📦 RESUMEN DE ARCHIVOS A MODIFICAR

| Archivo | Líneas | Cambios | Impacto |
|---------|--------|---------|---------|
| `src/services/pdfGeneratorMobile.js` | 8 bloques | Ajustes menores de spacing y tamaños | ⚠️ Bajo riesgo |

**Total de cambios:** 8 ajustes de mejora visual  
**Ningún cambio estructural:** ✅  
**Datos preservados:** ✅  
**Desktop no afectado:** ✅

---

## 🎨 RESULTADO VISUAL ESPERADO

### ANTES (actual):
```
┌─────────────────────────────┐  margin 12
│ Rutina                       │  fontSize 11
│ Fuerza y potencia • 6d/s     │  fontSize 8
│                              │  gap 14
│ Día 1 - Sentadilla           │  fontSize 17, verde
│ Entrenamiento Principal      │  fontSize 12
│                              │  gap 12
│ ┌─────────────────────────┐ │  card padding 6
│ │ Sentadilla Trasera      │ │  fontSize 12
│ │ Series Rep. Desc. RIR   │ │  fontSize 7 ← muy pequeño
│ │   5     5   3min   2    │ │  fontSize 10
│ │ Notas aquí              │ │  fontSize 8
│ └─────────────────────────┘ │
│   ↑ gap 4px                  │  ← muy poco
│ ┌─────────────────────────┐ │
│ │ Prensa                  │ │
└─────────────────────────────┘
```

### DESPUÉS (mejorado):
```
┌─────────────────────────────┐  margin 12
│ 📋 Semana 1                  │  fontSize 9 ← NUEVO
│ Rutina                       │  fontSize 11
│ Fuerza y potencia • 6d/s     │  fontSize 8
│                              │  gap 14
│ Día 1 - Sentadilla           │  fontSize 17, verde
│ Entrenamiento Principal      │  fontSize 12
│                              │  gap 12
│ ┌──────────────────────────┐│  card padding 8 ← más air
│ │ Sentadilla Trasera       ││  fontSize 12
│ │                          ││  
│ │ Series Rep. Desc. RIR    ││  fontSize 8 ← mejorado
│ │   5     5   3min   2     ││  fontSize 10
│ │                          ││
│ │ Notas aquí               ││  fontSize 8
│ └──────────────────────────┘│
│    ↑ gap 5px                 │  ← más respiro
│ ┌──────────────────────────┐│
│ │ Prensa                   ││
└─────────────────────────────┘
```

---

## ✅ VALIDACIONES PRE-APLICACIÓN

Antes de aplicar los cambios, confirmar:

- [ ] Los cambios son **solo de presentación visual**
- [ ] **No se modifica** la lógica de datos
- [ ] **No se elimina** información
- [ ] **No se afecta** el PDF Desktop
- [ ] **No se rompe** el sistema actual
- [ ] Los ajustes son **sutiles y reversibles**

---

## 🚀 PLAN DE EJECUCIÓN

### Paso 1: Aplicar cambios de spacing (más seguro)
- Padding: 6px → 8px
- Altura base: 32px → 35px
- Gap entre cards: 4px → 5px
- Spacing columnas: 33px → 35px

### Paso 2: Aplicar cambios de tipografía
- Label size: 7pt → 8pt

### Paso 3: Agregar badge de semana
- Nuevo elemento: "📋 Semana X"

### Paso 4: Implementar wrap de texto
- splitTextToSize para nombres largos

### Paso 5: Altura dinámica de notas
- Calcular altura real basada en líneas

---

## ⚠️ RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Overflow de página | Baja | Medio | Verificar cálculo de espacio disponible |
| Texto cortado | Muy Baja | Bajo | Ya implementado splitTextToSize |
| Cambio de paginación | Media | Bajo | Aumentos son mínimos (3-5px) |
| Break de Desktop | Ninguna | N/A | Archivo separado |

**Nivel de riesgo general:** 🟢 BAJO

---

## 📋 CHECKLIST DE APROBACIÓN

Antes de proceder, confirmar:

- [ ] ¿Los cambios coinciden con la imagen de Mynter?
- [ ] ¿Se mantienen todos los colores actuales?
- [ ] ¿No se elimina información?
- [ ] ¿El plan es claro y detallado?
- [ ] ¿Los ajustes son conservadores?

---

## 🎬 PRÓXIMOS PASOS

1. **Esperar tu confirmación** ✋
2. Aplicar cambios en orden secuencial
3. Generar PDF de prueba
4. Validar visualmente con imagen Mynter
5. Ajustar si es necesario
6. Documentar cambios finales

---

**Estado:** 📌 ESPERANDO APROBACIÓN  
**Archivos afectados:** 1 (`pdfGeneratorMobile.js`)  
**Cambios totales:** 8 ajustes menores  
**Tiempo estimado:** 10-15 minutos  
**Reversibilidad:** ✅ 100% (solo números cambian)
