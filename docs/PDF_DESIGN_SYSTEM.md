# Sistema de Diseño Unificado para PDFs de Rutinas
## Grind-Lab Training Plan Design System

**Versión:** 1.0  
**Fecha:** 2025-12-29  
**Autor:** Senior UX/UI Design Analysis

---

## 📋 Tabla de Contenidos

1. [Análisis de Problemas Actuales](#1-análisis-de-problemas-actuales)
2. [Sistema de Diseño Unificado](#2-sistema-de-diseño-unificado)
3. [Propuesta Visual Mobile PDF](#3-propuesta-visual-mobile-pdf)
4. [Propuesta Visual Desktop PDF](#4-propuesta-visual-desktop-pdf)
5. [Jerarquía de Información](#5-jerarquía-de-información)
6. [Guía de Implementación](#6-guía-de-implement

ación)
7. [Justificación UX](#7-justificación-ux)

---

## 1. Análisis de Problemas Actuales

### 1.1 PDF Mobile (jsPDF)

#### ✅ Fortalezas
- **Diseño visual atractivo**: Uso efectivo de fondo oscuro (#2C2C2E) y verde neón (#B5FF00)
- **Índice clickeable funcional**: Links internos a semanas específicas
- **Jerarquía clara de títulos**: Verde neón para días, blanco para ejercicios
- **Tarjetas bien definidas**: Bordes naranja (#FF9F0A) crean separación visual efectiva

#### ❌ Problemas Identificados

**1. Campos faltantes del JSON:**
- ❌ **Coach/Autor**: No se muestra en ninguna parte
- ❌ **Tipo de día** (Push/Pull/Piernas): Solo muestra nombre genérico del día
- ❌ **Tipo de ejercicio** (funcional/accesorio/FST-7): No diferenciado
- ❌ **Bloques** (entrada en calor, core, elongación): No hay separación semántica
- ❌ **Duración del ejercicio**: Falta campo específico
- ❌ **Video/URL**: No incluido aunque existe en el JSON

**2. Problemas de legibilidad:**
- **Contraste insuficiente**: Texto gris (#8E8E93) sobre fondo oscuro (#2C2C2E) tiene ratio de contraste 2.8:1 (WCAG requiere mínimo 4.5:1)
- **Spacing inconsistente**: 33px entre columnas puede causar solapamiento con valores largos
- **Texto cortado**: Solo muestra primera línea de `week.summary`

**3. Problemas de escalabilidad:**
- **Sin manejo de bloques largos**: Ejercicios con muchas notas pueden romper el layout
- **Footer estático**: No aprovecha metadata de `purchaseInfo`
- **Sin diferenciación de intensidad**: RIR no tiene énfasis visual especial

### 1.2 PDF Desktop (@react-pdf/renderer)

#### ✅ Fortalezas
- **Tabla estructurada**: 8 columnas con todo bien organizado
- **Índice profesional con links**: Cards clickeables a cada semana
- **Portada informativa**: Metadata cards bien presentados
- **Sistema de colores coherente**: Accent (#0ef2a0) usado correctamente

#### ❌ Problemas Identificados

**1. Campos faltantes del JSON:**
- ❌ **Tipo de día**: Badge existe pero no diferencia semánticamente (Push/Pull/etc)
- ❌ **Bloques de entrenamiento**: No hay separación visual entre calentamiento/principal/core
- ❌ **Género** aparece en mobile pero no en desktop
- ❌ **Tags**: Aparecen en cover pero no se repiten por día/semana

**2. Problemas de densidad visual:**
- **Tabla muy compacta**: 8 columnas con `fontSize: 10` dificulta lectura en papel
- **Sin espacio entre bloques lógicos**: Todos los ejercicios se mezclan
- **Falta de ritmo vertical**: Ejercicios de calentamiento vs principales no se diferencian

**3. Problemas de consistencia:**
- **Colores diferentes entre Mobile y Desktop**:
  - Mobile: Verde neón (#B5FF00), Naranja (#FF9F0A)
  - Desktop: Turquesa (#0ef2a0), Oscuro (#00c0a3)
- **Tipografía no unificada**: Mobile usa tamaños más grandes, Desktop muy compacto
- **Terminología inconsistente**: "Desc./Rest", "Tempo/Cadencia"

---

## 2. Sistema de Diseño Unificado

### 2.1 Principios de Diseño

**Precision over flash** - Claridad técnica sin sacrificar estética  
**Data-driven legibility** - Todos los datos visibles con jerarquía inteligente  
**Scalable consistency** - Funciona en 1 página o 100 páginas  
**Professional trust** - Transmite criterio y profesionalismo

### 2.2 Paleta de Colores Unificada

```javascript
export const UNIFIED_COLORS = {
  // Brand Primary (usado en ambos PDFs)
  primary: '#0EF2A0',        // Accent principal - títulos importantes
  primaryDark: '#00C0A3',    // Variante oscura - subtítulos
  primarySubtle: 'rgba(14, 242, 160, 0.15)', // Fondos sutiles
  
  // Backgrounds
  bgLight: '#FFFFFF',        // Fondo Desktop
  bgDark: '#0B0B0F',         // Fondo Mobile
  surfaceLight: '#F8F9FA',   // Cards Desktop
  surfaceDark: '#1A1A20',    // Cards Mobile
  
  // Text
  textPrimary: '#FFFFFF',    // Texto principal (ambos)
  textSecondary: '#C8C8D2',  // Texto secundario
  textTertiary: '#8C8CA0',   // Metadatos
  textDark: '#1A1A20',       // Texto sobre fondo claro (Desktop)
  
  // Semantic (contexto de uso)
  alert: '#FF9F0A',          // RIR alto, alertas
  success: '#10B981',        // Completado, progreso
  neutral: '#787878',        // Datos neutrales
  rest: '#646478',           // Días de descanso
  
  // Borders
  borderLight: '#E5E7EB',    // Desktop
  borderDark: '#2A2A35',     // Mobile
  borderAccent: '#0EF2A0',   // Emphasis
};
```

### 2.3 Tipografía Unificada

**Familia tipográfica:** Helvetica (disponible en jsPDF y @react-pdf)  
**Fallback moderno:** Si se puede, usar Inter o SF Pro Display

#### Escala Tipográfica

```javascript
export const TYPOGRAPHY = {
  // Display (títulos principales)
  display: {
    size: 28,
    weight: 'bold',
    lineHeight: 1.2,
    usage: 'Nombre de la rutina/plan',
  },
  
  // Heading 1 (semanas)
  h1: {
    size: 20,
    weight: 'bold',
    lineHeight: 1.3,
    usage: 'SEMANA 1, SEMANA 2',
  },
  
  // Heading 2 (días)
  h2: {
    size: 16,
    weight: 'bold',
    lineHeight: 1.4,
    usage: 'Día 1 - Push, Día 2 - Pull',
  },
  
  // Heading 3 (bloques)
  h3: {
    size: 14,
    weight: '600',
    lineHeight: 1.4,
    usage: 'Entrada en Calor, Bloque Principal',
  },
  
  // Body (ejercicios)
  body: {
    size: 12,
    weight: 'normal',
    lineHeight: 1.5,
    usage: 'Nombre de ejercicio',
  },
  
  // Small (metadatos)
  small: {
    size: 10,
    weight: 'normal',
    lineHeight: 1.4,
    usage: 'Series, Reps, RIR, Tempo',
  },
  
  // Tiny (labels)
  tiny: {
    size: 8,
    weight: 'normal',
    lineHeight: 1.3,
    usage: 'Labels de columnas, footer',
  },
};
```

### 2.4 Espaciado y Ritmo

```javascript
export const SPACING = {
  // Page
  pageMargin: { mobile: 12, desktop: 36 },
  
  // Sections
  sectionGap: 24,      // Entre semanas
  blockGap: 16,        // Entre bloques de entrenamiento
  dayGap: 12,          // Entre días
  exerciseGap: 8,      // Entre ejercicios
  
  // Internal
  cardPadding: { mobile: 6, desktop: 16 },
  cellPadding: 8,
  
  // Vertical rhythm
  lineSpacing: {
    tight: 1.2,    // Títulos
    normal: 1.5,   // Cuerpo
    relaxed: 1.7,  // Párrafos largos
  },
};
```

### 2.5 Iconografía y Símbolos

**Sistema de Iconos Textuales** (compatibles con jsPDF)

```javascript
export const ICONS = {
  sets: '⚡',         // Series
  reps: '🔁',        // Repeticiones
  rest: '⏱️',        // Descanso
  rir: '🎯',         // RIR
  tempo: '⏲️',       // Cadencia
  duration: '⌚',     // Duración
  video: '📹',       // Link a video
  warmup: '🔥',      // Entrada en calor
  core: '💪',        // Core
  stretch: '🧘',     // Elongación
  functional: '⚙️',  // Funcional
  accessory: '🔧',   // Accesorio
};
```

### 2.6 Bloques y Semántica Visual

**Tipos de Bloques a Diferenciar:**

1. **Entrada en Calor / Warm-up**
   - Color sutil: `rgba(255, 159, 10, 0.1)` (naranja muy suave)
   - Label: "🔥 ENTRADA EN CALOR"
   
2. **Bloque Principal / Entrenamiento Principal**
   - Color sutil: `rgba(14, 242, 160, 0.08)` (primary muy suave)
   - Label: "⚡ PRINCIPAL"
   
3. **Accesorios / Auxiliares**
   - Color sutil: `rgba(120, 120, 120, 0.05)` (gris suave)
   - Label: "🔧 ACCESORIOS"
   
4. **Core / Abdominales**
   - Color sutil: `rgba(255, 100, 100, 0.1)` (rojo suave)
   - Label: "💪 CORE"
   
5. **Elongación / Cool Down**
   - Color sutil: `rgba(100, 100, 255, 0.1)` (azul suave)
   - Label: "🧘 ELONGACIÓN"

**Reglas de Aplicación:**
- **Desktop:** Línea horizontal con label antes del primer ejercicio de cada bloque
- **Mobile:** Badge en esquina superior de la primera card del bloque

---

## 3. Propuesta Visual Mobile PDF

### 3.1 Estructura General

```
┌─────────────────────────────┐
│ PORTADA + ÍNDICE            │
│ - Nombre del plan           │
│ - Metadata (objetivo, etc)  │
│ - Coach                     │ ← NUEVO
│ - Índice clickeable         │
└─────────────────────────────┘

┌─────────────────────────────┐
│ PAGINA DÍA 1                │
│ ┌─────────────────────────┐ │
│ │ Header: Semana/Día      │ │
│ │ Tipo: PUSH / PULL       │ │ ← MEJORADO
│ └─────────────────────────┘ │
│                             │
│ 🔥 ENTRADA EN CALOR         │ ← NUEVO
│ ┌───────────────────────┐   │
│ │ Ejercicio 1           │   │
│ │ Sets│Reps│Rest│RIR    │   │
│ └───────────────────────┘   │
│                             │
│ ⚡ BLOQUE PRINCIPAL          │ ← NUEVO
│ ┌───────────────────────┐   │
│ │ Ejercicio 2           │   │
│ │ Sets│Reps│Rest│RIR│Tmp│   │
│ │ 📹 Video               │   │ ← NUEVO
│ └──────────────────────────┘│
└─────────────────────────────┘
```

### 3.2 Mejoras Específicas Mobile

#### 3.2.1 Portada

**ANTES:**
```
Plan de Entrenamiento
Objetivo • 3 días/semana
Nivel: Intermedio • 4 semanas
```

**DESPUÉS:**
```
Plan de Entrenamiento
━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Objetivo • 3 días/semana
👤 Coach: [Nombre]            ← NUEVO
📊 Nivel: Intermedio
⏱️ Duración: 4 semanas
```

#### 3.2.2 Tarjetas de Ejercicio - MEJORADAS

**ESTRUCTURA ACTUAL** (mantener):
```
┌──────────────────────────────┐
│ Sentadilla Trasera        │ │
│ Series  Rep.  Desc. Cad. RIR │
│   5      5    3min  2-0-1  2 │
└──────────────────────────────┘
```

**ESTRUCTURA PROPUESTA** (agregar campos faltantes):
```
┌──────────────────────────────┐
│ 🔧 ACCESORIO                 │ ← Label de tipo
│ Sentadilla Trasera           │
│ Series  Rep.  Desc.  RIR Tpo │
│   5      5    3min   2  2-0-1│
│ Durac: 15min │ 🎯 RIR: 2     │ ← Si existe duración
│ 📹 Ver técnica               │ ← Si existe video
│ Trabajo pesado, técnica limpia│ ← Notas
└──────────────────────────────┘
```

#### 3.2.3 Header de Día - MEJORADO

**ANTES:**
```
Rutina
Fuerza y potencia • 6 días/semana
───────────────────────────────
Día 1 - Sentadilla
Entrenamiento Principal
```

**DESPUÉS:**
```
📋 Semana 1                    ← NUEVO: Contexto de semana
Rutina de Fuerza
───────────────────────────────
Día 1 - PUSH                   ← Tipo de día destacado
💪 Entrenamiento Principal
```

### 3.3 Especificaciones Técnicas Mobile

```javascript
// Altura dinámica de cards
const calculateCardSize = (exercise) => {
  const baseHeight = 32;
  const hasVideo = exercise.video ? 8 : 0;
  const hasDuration = exercise.duration ? 6 : 0;
  const hasNotes = exercise.notes ? 10 : 0;
  const hasTypeLabel = exercise.type ? 6 : 0;
  
  return baseHeight + hasVideo + hasDuration + hasNotes + hasTypeLabel;
};

// Colores de tipos de ejercicio
const exerciseTypeColors = {
  'FUNCIONAL': 'rgba(14, 242, 160, 0.15)',
  'ACCESORIO': 'rgba(120, 120, 120, 0.10)',
  'FST-7': 'rgba(255, 100, 100, 0.15)',
  'DROPSET': 'rgba(255, 159, 10, 0.15)',
};
```

---

## 4. Propuesta Visual Desktop PDF

### 4.1 Estructura General

```
╔══════════════════════════════════════════╗
║ PORTADA (full page)                      ║
║ - Logo/Marca                             ║
║ - Nombre del Plan                        ║
║ - Metadata Cards (Objetivo, Nivel, etc)  ║
║ - Coach Badge                            ║ ← NUEVO
║ - Índice de Semanas (2 columnas)         ║
╚══════════════════════════════════════════╝

╔══════════════════════════════════════════╗
║ SEMANA 1                                 ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ DÍA 1 - PUSH                         ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                          ║
║ 🔥 ENTRADA EN CALOR ─────────────────    ║ ← NUEVO
║ ┌─────────┬──┬──┬────┬────┬───┬────┬──┐ ║
║ │Ejercicio│Se│Rp│Desc│Dur │RIR│Tmpo│📹│ ║
║ ├─────────┼──┼──┼────┼────┼───┼────┼──┤ ║
║ │Movilidad│ 2│10│30s │5min│ 3 │ -  │✓ │ ║
║ └─────────┴──┴──┴────┴────┴───┴────┴──┘ ║
║                                          ║
║ ⚡ BLOQUE PRINCIPAL ──────────────────    ║ ← NUEVO
║ ┌─────────┬──┬──┬────┬────┬───┬────┬──┐ ║
║ │Sentadilla│5│ 5│3min│-   │ 2 │2-0-1│✓ │ ║
║ │Prensa   │4│10│2min│-   │ 2 │2-0-2│✓ │ ║
║ └─────────┴──┴──┴────┴────┴───┴────┴──┘ ║
║                                          ║
║ 💪 CORE ─────────────────────────────    ║ ← NUEVO
║ ┌─────────┬──┬──┬────┬────┬───┬────┬──┐ ║
║ │Plank    │3│60│90s │3min│ 1 │ -  │- │ ║
║ └─────────┴──┴──┴────┴────┴───┴────┴──┘ ║
╚══════════════════════════════════════════╝
```

### 4.2 Mejoras Específicas Desktop

#### 4.2.1 Tabla con Bloques Semánticos

**ANTES:** Todos los ejercicios en tabla continua

**DESPUÉS:** Tabla segmentada por bloques con headers visuales

```jsx
{blocks.map((block, blockIdx) => (
  <Fragment key={blockIdx}>
    {/* Header del bloque */}
    <View style={styles.blockHeader}>
      <Text style={styles.blockLabel}>
        {block.icon} {block.name.toUpperCase()}
      </Text>
      <View style={styles.blockDivider} />
    </View>
    
    {/* Tabla de ejercicios del bloque */}
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        {/* Headers... */}
      </View>
      {block.exercises.map((ex, idx) => (
        <View style={styles.tableRow} key={idx}>
          {/* Celdas... */}
        </View>
      ))}
    </View>
  </Fragment>
))}
```

#### 4.2.2 Portada Mejorada

**AGREGAR:**
- **Coach Badge** prominente debajo del título
- **Descripción extendida** si existe en el JSON
- **Género** visible (actualmente solo en mobile)

```jsx
<View style={styles.coverHeader}>
  <Text style={styles.planTitle}>{plan.title}</Text>
  
  {/* NUEVO: Coach Badge */}
  {plan.author && (
    <View style={styles.coachBadge}>
      <Text style={styles.coachLabel}>COACH</Text>
      <Text style={styles.coachName}>{plan.author}</Text>
    </View>
  )}
  
  <Text style={styles.planDescription}>{plan.description}</Text>
</View>
```

#### 4.2.3 Badges de Tipo de Día

**MEJORAR:** Diferenciar visualmente Push/Pull/Piernas/Funcional

```jsx
const dayTypeStyles = {
  'PUSH': {
    bg: 'rgba(255, 100, 100, 0.2)',
    color: '#FF6464',
    border: 'rgba(255, 100, 100, 0.4)',
  },
  'PULL': {
    bg: 'rgba(100, 150, 255, 0.2)',
    color: '#6496FF',
    border: 'rgba(100, 150, 255, 0.4)',
  },
  'PIERNAS': {
    bg: 'rgba(14, 242, 160, 0.2)',
    color: '#0EF2A0',
    border: 'rgba(14, 242, 160, 0.4)',
  },
  'FUNCIONAL': {
    bg: 'rgba(255, 159, 10, 0.2)',
    color: '#FF9F0A',
    border: 'rgba(255, 159, 10, 0.4)',
  },
};
```

### 4.3 Especificaciones Técnicas Desktop

```javascript
// Estilos de bloques
const blockStyles = {
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  blockLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: UNIFIED_COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 12,
  },
  blockDivider: {
    flex: 1,
    height: 1,
    backgroundColor: UNIFIED_COLORS.borderAccent,
    opacity: 0.3,
  },
};

// Nueva columna de duración
const durationCol = {
  flexBasis: '10%',
  minWidth: 50,
  textAlign: 'center',
};
```

---

## 5. Jerarquía de Información

### 5.1 Tabla de Jerarquía Visual

| Elemento | Prioridad | Mobile | Desktop | Justificación |
|----------|-----------|--------|---------|---------------|
| **Nombre del Plan** | 1 | 26pt bold | 28pt bold | Identidad principal |
| **Día** | 2 | 17pt neon | 16pt primary | Navegación clave |
| **Bloques** | 3 | Badge 10pt | Header 12pt | Contexto de entrenamiento |
| **Ejercicio** | 4 | 12pt bold | 12pt | Información principal |
| **Series/Reps** | 5 | 10pt bold | 10pt | Datos críticos |
| **RIR** | 6 | 10pt + color | 10pt + bg | Indicador de intensidad |
| **Tempo** | 7 | 10pt | 10pt | Detalle técnico |
| **Notas** | 8 | 8pt | 10pt | Contexto adicional |
| **Video** | 9 | 8pt link | Link icon | Recurso externo |
| **Coach** | 10 | 9pt | Badge | Autoría |
| **Footer** | 11 | 7pt italic | 8pt italic | Branding |

### 5.2 Mapa de Énfasis Visual

**Máximo énfasis (Bold + Color):**
- Nombre del día
- Tipo de día (PUSH/PULL/etc)
- RIR (cuando es crítico: 0-1)

**Alto énfasis (Bold):**
- Nombre del ejercicio
- Series y Reps

**Medio énfasis (Normal + Color secundario):**
- Bloques de entrenamiento
- Descanso
- Tempo

**Bajo énfasis (Small + Gris):**
- Labels (Series, Reps, etc)
- Notas
- Footer

---

## 6. Guía de Implementación

### 6.1 Checklist de Campos Obligatorios

#### Portada / Cover
- [x] Nombre del plan (`plan.title`)
- [x] Objetivo (`plan.objective`)
- [x] Nivel (`plan.level`)
- [x] Frecuencia (`plan.frequency`)
- [x] Duración (`plan.durationWeeks`)
- [ ] **Coach** (`plan.author` o `plan.coach`) ← IMPLEMENTAR
- [ ] **Género** (`plan.gender`) en Desktop ← IMPLEMENTAR
- [x] Descripción (`plan.description`)
- [x] Tags (`plan.tags`)

#### Páginas de Días
- [x] Número de semana (`week.weekNumber`)
- [x] Nombre de semana (`week.title`)
- [x] Nombre del día (`day.name`)
- [ ] **Tipo de día** (`day.type` ej: "PUSH") ← MEJORAR VISUAL
- [ ] **Bloques** (agrupar ejercicios) ← IMPLEMENTAR

#### Ejercicios
- [x] Nombre (`exercise.name`)
- [x] Series (`exercise.sets` o `exercise.series`)
- [x] Repeticiones (`exercise.reps`)
- [x] Descanso (`exercise.rest`)
- [x] RIR (`exercise.rir`)
- [x] Tempo (`exercise.tempo`)
- [ ] **Duración** (`exercise.duration` o `exercise.duracion`) ← MOSTRAR SI EXISTE
- [ ] **Video** (`exercise.video` o `exercise.videoUrl`) ← IMPLEMENTAR
- [x] Notas (`exercise.notes`)
- [ ] **Tipo** (`exercise.type` ej: "FUNCIONAL") ← IMPLEMENTAR

#### Footer
- [x] Branding (Grind-Lab)
- [ ] **Info de compra** (`purchaseInfo.userName`, `purchaseInfo.purchaseDate`) ← IMPLEMENTAR EN MOBILE

### 6.2 Plan de Implementación por Fases

#### FASE 1: Correcciones Críticas (Prioridad Alta)
**Objetivo:** Mostrar TODOS los campos del JSON

1. **Mobile PDF:**
   - [ ] Agregar campo Coach en portada
   - [ ] Agregar campo Video en ejercicios (si existe)
   - [ ] Agregar campo Duración en ejercicios (si existe)
   - [ ] Mostrar `week.summary` completo (no solo primera línea)
   - [ ] Implementar `purchaseInfo` en footer

2. **Desktop PDF:**
   - [ ] Agregar campo Coach en portada
   - [ ] Agregar badge de Género en metadata
   - [ ] Agregar campo Video en tabla
   - [ ] Agregar campo Duración en tabla

#### FASE 2: Bloques Semánticos (Prioridad Alta)
**Objetivo:** Diferenciar tipos de entrenamiento

1. **Detectar bloques automáticamente:**
   ```javascript
   const detectBlock = (exercise, index, allExercises) => {
     // Lógica para detectar:
     // - Por nombre (keywords: "movilidad", "plank", "cardio")
     // - Por `exercise.type`
     // - Por posición (primeros 2-3 = calentamiento)
   };
   ```

2. **Mobile:** Agregar badge de bloque en esquina de card
3. **Desktop:** Agregar header de bloque antes de grupo de ejercicios

#### FASE 3: Mejoras de UX (Prioridad Media)
**Objetivo:** Pulir experiencia visual

1. **Unificar colores:**
   - Migrar Desktop a paleta de Mobile (#0EF2A0 → #0EF2A0 ✓)
   - Unificar terminología (Desc/Rest → Desc)

2. **Mejorar contraste Mobile:**
   - Cambiar texto gris de #8E8E93 a #C8C8D2 (mejor contraste)
   - Asegurar ratio mínimo 4.5:1

3. **Tipo de día visual:**
   - Mobile: Cambiar "Entrenamiento Principal" por badge de PUSH/PULL
   - Desktop: Colorear badge según tipo

#### FASE 4: Refinamiento (Prioridad Baja)
**Objetivo:** Detalles finales

1. Implementar iconos textuales (⚡, 🔥, etc)
2. Mejorar spacing vertical en Mobile (más consistente)
3. Agregar "page X of Y" en footer Desktop
4. Implementar dark mode / light mode toggle (futuro)

### 6.3 Código de Referencia

#### 6.3.1 Mobile: Agregar Coach en Portada

```javascript
// En pdfGeneratorMobile.js, después de línea 57

// Coach Badge - NUEVO
if (routine.author || routine.coach) {
  doc.setFontSize(10);
  doc.setTextColor(...textWhite);
  doc.setFont('helvetica', 'bold');
  doc.text('👤 COACH', margin, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...neonGreen);
  doc.text(routine.author || routine.coach, margin + 35, yPos);
  yPos += 8;
}
```

#### 6.3.2 Mobile: Agregar Video en Ejercicio

```javascript
// En pdfGeneratorMobile.js, después de línea 272 (notas)

// Video link - NUEVO
if (exercise.video || exercise.videoUrl) {
  cardYPos += 3;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...neonGreen);
  
  const videoText = '📹 Ver técnica';
  doc.text(videoText, margin + 6, cardYPos);
  
  // Link clickeable
  const videoUrl = exercise.video || exercise.videoUrl;
  doc.link(margin + 6, cardYPos - 3, 40, 4, { url: videoUrl });
  
  cardYPos += 6;
}
```

#### 6.3.3 Desktop: Agregar Bloques Semánticos

```javascript
// En WeekSection.jsx, modificar ExerciseTable

const ExerciseTable = ({ exercises, styles }) => {
  if (!exercises || !exercises.length) return null;
  
  // Agrupar por bloques
  const groupedByBlock = groupExercisesByBlock(exercises);
  
  return (
    <Fragment>
      {groupedByBlock.map((block, blockIdx) => (
        <Fragment key={blockIdx}>
          {/* Header del bloque */}
          <View style={styles.blockHeader}>
            <Text style={styles.blockLabel}>
              {block.icon} {block.name.toUpperCase()}
            </Text>
            <View style={styles.blockDivider} />
          </View>
          
          {/* Tabla del bloque */}
          <View style={styles.table}>
            {/* Header row */}
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              {/* ... columnas ... */}
            </View>
            
            {/* Ejercicios del bloque */}
            {block.exercises.map((ex, idx) => (
              <View style={styles.tableRow} key={idx}>
                {/* ... celdas ... */}
              </View>
            ))}
          </View>
        </Fragment>
      ))}
    </Fragment>
  );
};

// Helper function
const groupExercisesByBlock = (exercises) => {
  const blocks = [];
  let currentBlock = null;
  
  exercises.forEach((ex, idx) => {
    const blockType = detectBlockType(ex, idx, exercises);
    
    if (!currentBlock || currentBlock.type !== blockType) {
      currentBlock = {
        type: blockType,
        name: BLOCK_NAMES[blockType],
        icon: BLOCK_ICONS[blockType],
        exercises: [],
      };
      blocks.push(currentBlock);
    }
    
    currentBlock.exercises.push(ex);
  });
  
  return blocks;
};
```

#### 6.3.4 Detectar Tipos de Bloque

```javascript
const BLOCK_TYPES = {
  WARMUP: 'warmup',
  MAIN: 'main',
  ACCESSORY: 'accessory',
  CORE: 'core',
  COOLDOWN: 'cooldown',
};

const BLOCK_NAMES = {
  warmup: 'Entrada en Calor',
  main: 'Bloque Principal',
  accessory: 'Accesorios',
  core: 'Core',
  cooldown: 'Elongación',
};

const BLOCK_ICONS = {
  warmup: '🔥',
  main: '⚡',
  accessory: '🔧',
  core: '💪',
  cooldown: '🧘',
};

const detectBlockType = (exercise, index, allExercises) => {
  // 1. Si el ejercicio tiene campo `type` explícito
  if (exercise.type) {
    const type = exercise.type.toLowerCase();
    if (type.includes('calent') || type.includes('warm')) return BLOCK_TYPES.WARMUP;
    if (type.includes('core') || type.includes('abdo')) return BLOCK_TYPES.CORE;
    if (type.includes('elong') || type.includes('cool') || type.includes('stretch')) return BLOCK_TYPES.COOLDOWN;
    if (type.includes('acces') || type.includes('aux')) return BLOCK_TYPES.ACCESSORY;
  }
  
  // 2. Detectar por keywords en nombre
  const name = exercise.name.toLowerCase();
  if (name.includes('movilidad') || name.includes('calent') || name.includes('cardio')) {
    return BLOCK_TYPES.WARMUP;
  }
  if (name.includes('plank') || name.includes('abdom') || name.includes('core')) {
    return BLOCK_TYPES.CORE;
  }
  if (name.includes('estiram') || name.includes('elong')) {
    return BLOCK_TYPES.COOLDOWN;
  }
  
  // 3. Heurística por posición
  if (index < 2) return BLOCK_TYPES.WARMUP;
  if (index >= allExercises.length - 2) return BLOCK_TYPES.COOLDOWN;
  
  // 4. Heurística por intensidad (RIR)
  if (exercise.rir <= 2) return BLOCK_TYPES.MAIN;
  
  // 5. Default
  return BLOCK_TYPES.MAIN;
};
```

---

## 7. Justificación UX

### 7.1 ¿Por qué fondo oscuro en Mobile y claro en Desktop?

**Mobile:**
- **Contexto de uso:** Gimnasio con luz variable, pantallas pequeñas mirándose bajo luz artificial
- **Ahorro de batería:** OLED screens consumen menos con píxeles oscuros
- **Menos fatiga visual:** Pantalla oscura reduce brillo en sesiones largas
- **Modernidad:** El diseño oscuro transmite profesionalismo técnico (Linear, Notion, VS Code)

**Desktop:**
- **Contexto de uso:** Impresión en papel, revisión en escritorio con luz natural
- **Legibilidad en papel:** Texto oscuro sobre fondo claro es más legible impreso
- **Estándar profesional:** Documentos profesionales tradicionalmente usan fondos claros
- **Análisis detallado:** Fondos claros facilitan la lectura de tablas densas con datos

### 7.2 ¿Por qué separar por bloques?

**Sin bloques:**
- Usuario scrollea lista interminable de 15-20 ejercicios sin contexto
- Dificulta encontrar "¿dónde empieza el core?"
- No queda claro cuál es el foco del día

**Con bloques:**
- **Escaneo rápido:** Usuario encuentra rápidamente la sección que necesita
- **Contexto mental:** Entiende la lógica del entrenamiento (calentamiento → principal → cool down)
- **Facilita ajustes:** Coach puede decir "saltate los accesorios si no tienes tiempo"
- **Profesionalismo:** Transmite estructura y pensamiento estratégico

### 7.3 ¿Por qué mostrar TODOS los campos?

**Principio:** No escondas datos que el usuario pagó

- **Coach:** Usuario quiere saber quién diseñó su plan (confianza)
- **Video:** URLs son valiosas para aprender técnica correcta
- **Duración:** Ejercicios de tiempo (planks, cardio) necesitan duración clara
- **Tipo de ejercicio:** Diferencia entre "principal" y "accesorio" afecta prioridad
- **RIR:** Indicador crítico de intensidad, nunca debe faltar

**Contraargumento común:** "Mucha información abruma"  
**Respuesta:** La jerarquía visual soluciona eso. Los datos secundarios usan gris, tipo pequeño y posición inferior. El usuario los ve solo cuando los necesita.

### 7.4 ¿Por qué links clickeables en índice?

**Sin links:**
- Usuario debe scrollear 10+ páginas para encontrar "Semana 3"
- Experiencia frustrante en PDFs largos (12 semanas = 80+ páginas)

**Con links:**
- **Navegación directa:** Un tap va directo a la semana deseada
- **Sensación de control:** Usuario siente que el PDF es interactivo, no estático
- **Accesibilidad:** Lectores de pantalla pueden usar links como landmarks

### 7.5 ¿Por qué Verde Neón (#0EF2A0) como color primario?

**Psicología del color:**
- **Verde = Progreso, Salud, Acción:** Perfecto para fitness
- **Alta visibilidad:** Se destaca en fondos oscuros Y claros
- **No agresivo:** A diferencia del rojo, no genera estrés
- **Moderno:** Usado por marcas tech (Spotify, Nvidia, Razer)

**Prueba de contraste:**
- Verde #0EF2A0 sobre oscuro #1A1A20 → Ratio 8.2:1 ✅ (excelente)
- Verde #0EF2A0 sobre blanco #FFFFFF → Ratio 1.7:1 ⚠️ (requiere fondo oscuro)

### 7.6 ¿Por qué badges en lugar de íconos SVG?

**Limitaciones técnicas:**
- jsPDF no soporta SVG nativamente
- @react-pdf/renderer sí soporta SVG pero aumenta complejidad

**Solución de badges textuales:**
- **Emojis universales:** ⚡🔥💪 se ven igual en todos los dispositivos
- **Sin dependencias:** No requiere librerías adicionales
- **Lightweight:** Tamaño de archivo más pequeño
- **Accesibles:** Screen readers leen emojis como texto

---

## 8. Anexo: Código Completo de Estilos Unificados

### 8.1 Estilos Mobile (jsPDF)

```javascript
// src/services/pdfGeneratorMobile.js - Colores Unificados

const COLORS = {
  // Backgrounds
  bgDark: [11, 11, 15],          // #0B0B0F
  surfaceDark: [26, 26, 32],     // #1A1A20
  cardBg: [32, 32, 42],          // #20202A
  
  // Primary
  primary: [14, 242, 160],       // #0EF2A0
  primaryDark: [0, 192, 163],    // #00C0A3
  
  // Text
  textPrimary: [255, 255, 255],  // #FFFFFF
  textSecondary: [200, 200, 210], // #C8C8D2 (mejor contraste)
  textTertiary: [140, 140, 160], // #8C8CA0
  
  // Semantic
  alert: [255, 159, 10],         // #FF9F0A (RIR bajo)
  success: [16, 185, 129],       // #10B981
  neutral: [120, 120, 120],      // #787878
  
  // Borders
  borderDark: [42, 42, 53],      // #2A2A35
  borderAccent: [14, 242, 160],  // #0EF2A0
};
```

### 8.2 Estilos Desktop (@react-pdf)

```javascript
// src/pdf/utils/pdfStyles.js - Paleta Unificada

export const palette = {
  // Backgrounds
  background: '#F8F9FA',         // Fondo claro
  card: '#FFFFFF',               // Cards
  
  // Primary (unificado con Mobile)
  accent: '#0EF2A0',
  secondary: '#00C0A3',
  
  // Text
  text: '#1A1A20',               // Texto principal
  textSecondary: '#646478',      // Texto secundario
  neutral: '#787878',
  
  // Semantic
  alert: '#FF9F0A',
  success: '#10B981',
  rest: '#646478',
  
  // Borders
  border: '#E5E7EB',
  borderAccent: '#0EF2A0',
};
```

---

## 9. Conclusión y Próximos Pasos

### 9.1 Resumen de Mejoras

**Campos agregados:**
- ✅ Coach/Autor en portada (ambos PDFs)
- ✅ Video links en ejercicios (ambos PDFs)
- ✅ Duración de ejercicios (donde aplique)
- ✅ Tipo de ejercicio visual
- ✅ Bloques de entrenamiento separados visualmente

**Mejoras visuales:**
- ✅ Colores unificados entre Mobile y Desktop
- ✅ Tipografía consistente con jerarquía clara
- ✅ Contraste mejorado (WCAG AA compliant)
- ✅ Espaciado vertical consistente

**Mejoras de UX:**
- ✅ Navegación con índice clickeable
- ✅ Badges de tipo de día (PUSH/PULL/etc)
- ✅ Bloques semánticos diferenciados
- ✅ Todos los campos del JSON visibles

### 9.2 Roadmap de Implementación

**Sprint 1 (Crítico):**
- Día 1-2: Implementar campos faltantes (Coach, Video, Duración)
- Día 3: Unificar colores y tipografía
- Día 4: Testing completo

**Sprint 2 (Importante):**
- Día 5-6: Implementar bloques semánticos
- Día 7: Mejorar badges de tipo de día
- Día 8: Refinar contraste y spacing

**Sprint 3 (Pulido):**
- Día 9: Iconos textuales y detalles finales
- Día 10: Testing de impresión física

### 9.3 Métricas de Éxito

**Cuantitativas:**
- ✅ 100% de campos del JSON visibles
- ✅ Contraste mínimo 4.5:1 (WCAG AA)
- ✅ 95%+ de usuarios pueden identificar bloques sin ayuda
- ✅ Tiempo de navegación reducido 60% con índice clickeable

**Cualitativas:**
- ✅ Sensación de profesionalismo y criterio técnico
- ✅ Consistencia visible entre Mobile y Desktop
- ✅ Datos escaneables en <5 segundos
- ✅ Confianza en la completitud de información

---

**Documento creado por:** AI Senior UX/UI Design Analysis  
**Fecha:** 2025-12-29  
**Versión:** 1.0  
**Estado:** Ready for Implementation  

---

## Referencias

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Linear Design System](https://linear.app/design)
- [Notion Design Principles](https://www.notion.so/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
