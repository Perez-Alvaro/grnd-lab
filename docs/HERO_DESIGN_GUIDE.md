# GRIND LAB - Hero Section Design Guide
## React Bits-Inspired Centered Composition

> **Design Philosophy**: El fondo genera emoción. El texto genera claridad. El usuario entiende en 3 segundos qué hace la herramienta.

---

## 🎯 COMPOSICIÓN VISUAL

### Estructura (Centrada - Estilo React Bits)

```
┌─────────────────────────────────────────┐
│                                         │
│        [Badge Pill - Accent]            │
│                                         │
│         HEADLINE (Bold, 2 líneas)       │
│          Keyword destacado              │
│                                         │
│        Subheadline (Technical)          │
│                                         │
│      CTA Primary   CTA Secondary        │
│                                         │
│         Metadata (• separators)         │
│                                         │
│      "Click & hold para acelerar"       │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │ Hyperspeed Background Tunnel    │   │
│   │ (Interactive on click & hold)   │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Reglas de oro**:
1. ✅ Todo centrado horizontalmente
2. ✅ El fondo converge visualmente hacia el centro
3. ✅ El texto NUNCA se mueve lateralmente
4. ✅ spacing generoso entre elementos (24px - 48px)
5. ✅ Hero min-height: 100vh (full viewport)

---

## ✍️ TIPOGRAFÍA Y JERARQUÍA

### Headline (H1)
```jsx
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tighter">
  Diseña rutinas con IA.{' '}
  <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
    Ejecuta con precisión.
  </span>
</h1>
```

**Specs**:
- **Size**: 5xl → 6xl → 7xl (responsive)
- **Weight**: 700 (bold)
- **Line-height**: 1.1 (tight, readable)
- **Letter-spacing**: tighter (-0.025em)
- **Max lines**: 2
- **Keyword highlighting**: Gradient text-clip (accent → accent-light)

**Why**: Tracking negativo crea densidad visual. Gradiente en keyword crea foco sin gritar.

---

### Subheadline (P)
```jsx
<p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
  Convierte prompts en rutinas editables. Sin APIs pagas, sin vendor lock-in. Control total del JSON.
</p>
```

**Specs**:
- **Size**: lg → xl (responsive)
-  **Color**: text-secondary (#C8C8D2)
- **Max-width**: 2xl (672px)
- **Line-height**: relaxed (1.625)
- **Content**: 1 frase técnica clara

**Why**: Color desaturado reduce jerarquía. Max-width mantiene legibilidad. **No** se usan bullets, **No** se usan muchas palabras destacadas.

---

### Badge Pill
```jsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
  <Brain className="h-4 w-4" />
  <span>IA como cerebro externo</span>
</div>
```

**Specs**:
- **Background**: accent/10 + border accent/20
- **Text**: accent color, font-medium
- **Icon**: Lucide icon, h-4 w-4
- **Effect**: backdrop-blur-sm (glassmorphism sutil)

**Why**: Glassmorphism moderno. Color accent establece paleta. Tamaño pequeño (no dominante).

---

## 🔘 CTAs (Call to Actions)

### Primary Button
```jsx
<Button
  size="lg"
  className="group text-base px-8 h-12 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
>
  <Sparkles className="mr-2 h-5 w-5" />
  Empezar a crear
  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
</Button>
```

**Specs**:
- **Size**: lg (h-12, px-8)
- **Shadow**: accent/20 → accent/30 (hover)
- **Icons**: Leading + trailing
- **Animation**: Arrow translates on hover

**Why**: Shadow accent crea depth. Iconos comunican acción. Hover feedback inmediato.

---

### Secondary Button
```jsx
<Button
  size="lg"
  variant="outline"
  className="text-base px-8 h-12 border-text-tertiary/30 hover:border-text-secondary/50"
>
  Ver cómo funciona
</Button>
```

**Specs**:
- **Variant**: outline (ghost)
- **Border**: text-tertiary/30 → text-secondary/50 (hover)
- **No shadow**: Jerarquía visual clara

**Why**: Outline reduce peso visual. Border hover feedback sutil. Jerarquía clara con Primary.

---

### CTA Container
```jsx
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
  {/* CTAs */}
</div>
```

**Mobile**: Stack vertical (flex-col)  
**Desktop**: Horizontal (sm:flex-row)  
**Gap**: 16px (gap-4)

---

## 🌌 BACKGROUND (Hyperspeed)

### Implementación
```jsx
<div className="absolute inset-0 z-0 opacity-70">
  <Hyperspeed />
</div>
```

**Specs**:
- **Position**: absolute, inset-0
- **Z-index**: 0 (behind everything)
- **Opacity**: 70% (sutil, no invasivo)
- **Effect**: 3D tunnel with cars/lights
- **Theme**: Purple (#5227FF), Cyan (#03b3c3), Pink (#FF9FFC)

---

### Estados

#### Idle (Default)
- Rotación lenta automática
- FOV: 90deg
- Speed: normal
- **Feeling**: Profundidad, expectativa

#### Interaction (Click & Hold)
- Speed aumenta 2x
- FOV expande a 150deg
- Efecto "turbo"
- **Feeling**: Potencia, control

**Why**: Interactividad genera engagement. Click & hold = commitment temporal. Release = volver a calma.

---

### Overlays

```jsx
{/* Vertical gradient - Readability */}
<div className="absolute inset-0 bg-gradient-to-b from-primary-bg/20 via-transparent to-primary-bg/80 z-[1]" />

{/* Center spotlight - Focus */}
<div className="absolute inset-0 z-[1]">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
</div>

{/* Bottom fade - Transition */}
<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-bg to-transparent z-[1]" />
```

**Layers (z-index)**:
- Background (z-0): Hyperspeed efecto
- Overlays (z-[1]): Gradientes + spotlight
- Content (z-10): Texto, CTAs

**Why**: Overlays crean legibilidad sin matar background. Bottom fade transiciona suavemente al contenido.

---

## 🎬 ANIMACIONES

### Fade-in-up (Staggered)
```jsx
className="animate-fade-in-up"
style={{ animationDelay: '0.1s' }}
```

**Secuencia**:
1. Badge pill: 0s
2. Headline: 0.1s
3. Subheadline: 0.2s
4. CTAs: 0.3s
5. Metadata: 0.4s
6. Hint: 0.5s

**Effect**: fadeInUp (8px translateY, 300ms ease-out)

**Why**: Stagger crea narrativa visual progresiva. Users siguen el flujo naturalmente.

---

## 📱 RESPONSIVE (Mobile-First)

### Breakpoints

| Element | Mobile (< 640px) | Desktop (≥ 640px) |
|---------|------------------|-------------------|
| **Headline** | text-5xl | text-6xl → text-7xl |
| **Subheadline** | text-lg | text-xl |
| **CTAs** | flex-col (stack) | flex-row (horizontal) |
| **Metadata** | "OSS" | "Open source" |
| **Interaction hint** | hidden | visible |
| **Hyperspeed opacity** | 60% | 70% |

**Mobile optimizations**:
- ✅ Headline más corto
- ✅ Background simplificado (menos opacity)
- ✅ Metadata abreviado
- ✅ No interaction hint
- ✅ Touch para acelerar (mismo efecto)

---

## 🎨 PALETA DE COLORES

### Background
```css
--color-bg: #0B0B0F;           /* Deep black */
--color-accent: #5227FF;        /* Purple - primary */
--color-accent-light: #6B42FF;  /* Lighter purple */
--color-secondary: #FF9FFC;     /* Pink accent */
```

### Text
```css
--color-text-primary: #FFFFFF;     /* Headlines */
--color-text-secondary: #C8C8D2;   /* Subheadline */
--color-text-tertiary: #8C8CA0;    /* Metadata */
--color-text-quaternary: #646478;  /* Hints, disabled */
```

### Usage
- **Headline**: white
- **Keyword**: accent gradient
- **Subheadline**: text-secondary
- **Metadata**: text-quaternary
- **Badge**: accent
- **CTAs**: accent (primary), outline (secondary)

---

## 🧠 INTERACTION FLOW

### User Journey (3 segundos)

**0-1s**: User ve headline  
→ "Diseña rutinas con IA"

**1-2s**: User lee subheadline  
→ "Convierte prompts... control total JSON"

**2-3s**: User ve CTAs  
→ Decision point: "Empezar a crear" o "Ver cómo funciona"

**3s+**: User explora background  
→ Click & hold to interact → "Wow effect"

**Why**: Claridad inmediata. Background genera curiosidad. Interacción recompensa exploración.

---

## ✅ DESIGN PRINCIPLES (Resumed)

| Principle | Application |
|-----------|-------------|
| **Centered composition** | Todo horizontal centrado, vertical flow |
| **Visual hierarchy** | Headline → Subheadline → CTAs → Metadata |
| **Accent usage** | Solo keywords, badges, CTAs |
| **Background as support** | No compite, genera atmósfera |
| **Interactivity** | Click & hold = power, release = calm |
| **Mobile-first** | Stack vertical, simplify content |
| **Performance** | Animations 300ms, background 60fps |
| **Accessibility** | AA contrast, keyboard nav, touch friendly |

---

## 🚨 ANTI-PATTERNS

### ❌ NO hacer:
- Logo gigante arriba del headline
- Múltiples badges/pills
- Más de 2 líneas en headline
- Más de 1 frase en subheadline
- Múltiples keywords destacados
- Background con motion constante
- Parallax scrolling
- Bounce animations
- Más de 2 CTAs
- Metadata arriba del headline

### ✅ SÍ hacer:
- Badge pill (singular, pequeño)
- Headline conciso (2 líneas max)
- 1 keyword destacado por headline
- Subheadline técnico (1 frase)
- Background idle hasta interacción
- Subtle fade-in animations
- 2 CTAs jerárquicos
- Metadata abajo (opcional)

---

## 📏 SPACING SYSTEM

```css
/* Vertical spacing (from top to bottom) */
padding-top: 8rem;        /* 128px - Hero top spacing */
margin-bottom: 2rem;      /* 32px - Badge to Headline */
margin-top: 1.5rem;       /* 24px - Headline to Subheadline */
padding-top: 1rem;        /* 16px - Subheadline to CTAs */
padding-top: 2rem;        /* 32px - CTAs to Metadata */
padding-top: 3rem;        /* 48px - Metadata to Hint */
```

**Why**: Spacing generoso crea calm. Ratio consistente crea ritmo visual.

---

## 🔧 TECHNICAL SPECS

### Hyperspeed Component
- **Framework**: Three.js + React
- **Post-processing**: Bloom, SMAA
- **Performance**: 60fps target, devicePixelRatio capped at 2
- **Preset**: turbulentDistortion (purple/pink/cyan theme)
- **Cleanup**: Proper disposal on unmount

### Animations (CSS)
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
```

### Z-index Layers
- Background (0): Hyperspeed canvas
- Overlays (1): Gradients, spotlight, fade
- Content (10): Text, CTAs, all interactive elements

---

## 📸 VISUAL REFERENCE

### Layout Intentions

**Badge Pill**:
- Sutil, no dominante
- Glassmorphism (backdrop-blur)
- Purple accent

**Headline**:
- Maximum impact
- Keyword destacado con gradient
- Tracking tight

**CTAs**:
- Primary con shadow
- Secondary outline
- Gap 16px

**Background**:
- Converge hacia centro
- Interactivo (click & hold)
- No distrae en idle

---

## 🎯 SUCCESS METRICS

### User Understanding (3 seconds)
- ✅ User sabe que es una herramienta de IA
- ✅ User entiende "rutinas" + "JSON"
- ✅ User ve CTA claro "Empezar"

### Visual Impact
- ✅ Background genera "wow" sin distraer
- ✅ Headline comunica valor instantáneamente
- ✅ Jerarquía visual es obvia

### Interaction
- ✅ Click & hold es descubierto naturalmente
- ✅ Release siente satisfactorio
- ✅ Mobile touch funciona igual

---

## 📝 IMPLEMENTATION CHECKLIST

Before deploying:
- [ ] Headline tiene max 2 líneas
- [ ] Solo 1 keyword destacado
- [ ] Subheadline es 1 frase
- [ ] 2 CTAs con clara jerarquía
- [ ] Background opacity ≤ 70%
- [ ] Animations stagger correcto (0s → 0.5s)
- [ ] Mobile: CTAs stack vertical
- [ ] Mobile: Metadata abreviado
- [ ] Interaction hint solo desktop
- [ ] Z-index layers correcto
- [ ] AA contrast en todos los textos
- [ ] Hyperspeed cleanup on unmount
- [ ] 60fps animations
- [ ] Touch events working

---

**Last updated**: 2025-12-28  
**Design Lead**: UX/UI Senior Designer (Apple/Linear principles)  
**Implementation**: React + Tailwind + Three.js

---

> **Remember**: El mejor diseño es el que el usuario no nota. Se siente natural, obvio, inevitable.
