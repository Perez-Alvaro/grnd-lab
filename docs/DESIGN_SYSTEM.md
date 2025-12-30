# GRIND LAB - Design System
## UX/UI Guidelines for Frontend Development

> **Philosophy**: Precision over flash. The design must disappear and let the tool speak.

---

## 🎨 1. BACKGROUND SYSTEM

### Objective
El fondo debe **sostener** el contenido, no **competir** con él.

### Principles
- **Base**: Negro profundo (#0B0B0F) - Foundation que transmite profundidad técnica
- **Ambient glow**: Púrpura sutil que sugiere precisión, no gaming
- **Gradientes**: Verticales, suaves, con opacidades bajas (5-30%)
- **Layers**: Múltiples capas con z-index controlado

### Implementation

```css
/* ✅ CORRECTO - Subtle, professional */
.background-layer {
  background: linear-gradient(
    180deg,
    rgba(11, 11, 15, 0.3) 0%,
    rgba(11, 11, 15, 0.6) 50%,
    rgb(11, 11, 15) 100%
  );
}

/* ❌ EVITAR - Aggressive, gaming-style */
.background-layer-wrong {
  background: radial-gradient(
    circle at 30% 20%,
    rgba(203, 255, 0, 0.5),
    transparent
  );
}
```

### LightPillar Usage
El componente LightPillar debe usarse con:
- **Opacity**: 40% máximo
- **Intensity**: 0.6-0.8
- **Rotation speed**: 0.2-0.3 (muy lento)
- **Blend mode**: `normal` (no screen, no multiply)

**Why**: Background effects no deben ser protagonistas. Son soporte atmosférico.

---

## ✍️ 2. TYPOGRAPHY SYSTEM

### Font Stack
```css
/* Primary - UI & Headings */
font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

/* Secondary - Code & Technical */
font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
```

### Hierarchy

| Element | Weight | Letter-spacing | Line-height | Usage |
|---------|--------|----------------|-------------|-------|
| **H1** | 700 (Bold) | -0.025em | 1.1 | Hero headlines |
| **H2** | 600 (Semibold) | -0.02em | 1.2 | Section titles |
| **H3** | 600 (Semibold) | -0.015em | 1.3 | Subsections |
| **H4** | 500 (Medium) | -0.01em | 1.4 | Card titles |
| **Body** | 400 (Regular) | 0em | 1.6 | Paragraph text |
| **Small** | 400 (Regular) | 0em | 1.5 | Microcopy |
| **Code** | 400-500 | 0em | 1.5 | Technical text |

### Anti-patterns to avoid
❌ Mixing too many font weights in one view  
❌ Over-using bold for emphasis  
❌ Inconsistent letter-spacing  
❌ Line-height too tight on body text  

### Best practices
✅ Use negative letter-spacing on large headings  
✅ Generous line-height (1.6) for body text  
✅ Consistent weight progression: 400 → 500 → 600 → 700  
✅ Mono font only for code, JSON, technical hints  

**Principle**: Si todo está en bold, nada está en bold.

---

## 🧠 3. VISUAL HIERARCHY

### Color Hierarchy (Not everything is white)

```css
/* Text color scale - apply with intention */
.text-primary {
  color: rgb(255, 255, 255);      /* Main headlines, CTAs */
}

.text-secondary {
  color: rgb(200, 200, 210);      /* Supporting text, descriptions */
}

.text-tertiary {
  color: rgb(140, 140, 160);      /* Labels, metadata */
}

.text-quaternary {
  color: rgb(100, 100, 120);      /* Disabled, hints */
}
```

### Usage Guide

| Content Type | Color Class | Example |
|--------------|-------------|---------|
| Main headline | `.text-primary` | "Diseña rutinas con IA" |
| Subheadline | `.text-secondary` | "La herramienta para entrenadores..." |
| Icon labels | `.text-tertiary` | "JSON editable • Export PDF" |
| Placeholders | `.text-quaternary` | "Nombre de la rutina..." |

**Rule**: Use the hierarchy to guide the eye:
1. First → Main message (white)
2. Second → Benefit (secondary gray)
3. Third → Action (accent color)

---

## 🟣 4. COLOR PALETTE

### Base Colors
```css
:root {
  /* Foundations */
  --color-bg: #0B0B0F;              /* Deep black */
  --color-surface: #141419;         /* Elevated cards */
  --color-surface-alt: #1A1A20;     /* Alternative surfaces */
  
  /* Borders */
  --color-border: #2A2A35;          /* Default separation */
  --color-border-strong: #35354A;   /* Emphasized */
  --color-border-muted: #1F1F28;    /* Subtle */
}
```

### Accent Colors
```css
:root {
  /* Purple - Technical precision */
  --color-accent: #5227FF;
  --color-accent-strong: #6B42FF;
  --color-accent-muted: #3D1FCC;
  --color-accent-subtle: rgba(82, 39, 255, 0.1);
  
  /* Pink - Secondary (rare use) */
  --color-secondary: #FF9FFC;
}
```

### When to use accent color

✅ **DO**:
- Primary CTAs (buttons)
- Active states
- Key highlights (1 word per headline)
- Interactive elements hover
- Focus rings

❌ **DON'T**:
- Long paragraphs
- Backgrounds
- Everything in a section
- Decorative elements

**Apple principle**: Accent color is a **semantic signal**, not decoration.

---

## 📐 5. SPACING & RHYTHM

### Vertical Rhythm
```css
/* Section spacing - consistent vertical rhythm */
.section-spacing {
  padding-top: 6rem;    /* 96px */
  padding-bottom: 6rem;
}

@media (min-width: 640px) {
  .section-spacing {
    padding-top: 8rem;    /* 128px */
    padding-bottom: 8rem;
  }
}
```

### Tailwind Spacing Scale
Use this scale consistently:
- `gap-2` (8px) - Inline elements
- `gap-4` (16px) - Related items
- `gap-6` (24px) - Card content
- `gap-8` (32px) - Section subdivisions
- `py-24` (96px) - Between major sections

**Why**: Consistent spacing creates visual calm and professionalism.

---

## 🎬 6. MICRO-INTERACTIONS

### Animation Principles
- **Duration**: 200-300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Apple-style)
- **Movement**: Subtle translateY (8px max)
- **Opacity**: fade-in with transform

### Examples

```css
/* ✅ CORRECT - Subtle, purposeful */
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

/* ❌ AVOID - Excessive bounce */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

### Interactive States
```css
/* Focus - Clear but not aggressive */
*:focus-visible {
  outline: 2px solid rgba(82, 39, 255, 0.5);
  outline-offset: 2px;
}

/* Hover - Quick transition */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Rule**: Animations should feel like natural reactions, not performances.

---

## 🚨 7. ANTI-PATTERNS (What NOT to do)

### ❌ Background Anti-patterns
- Aggressive radial gradients
- Multiple competing light sources
- High contrast patterns
- Animated backgrounds
- Gaming-style neon effects

### ❌ Typography Anti-patterns
- Too many font families (>2)
- Inconsistent weights
- Tight line-height on body text
- ALL CAPS everywhere
- Decorative fonts

### ❌ Color Anti-patterns
- Everything in white
- Accent color overuse
- Low contrast text
- Bright neon greens (gaming vibe)
- Multiple competing accent colors

### ❌ Animation Anti-patterns
- Constant motion
- Parallax overuse
- Long durations (>500ms)
- Bounce / elastic easings
- Multiple simultaneous animations

---

## ✅ 8. BEST PRACTICES CHECKLIST

### Before releasing a component:
- [ ] Background supports, doesn't compete
- [ ] Text hierarchy is clear (3-4 levels max)
- [ ] Accent color used sparingly (<10% of elements)
- [ ] Spacing follows 8px grid
- [ ] Animations are subtle (<300ms)
- [ ] Focus states are visible
- [ ] Mobile responsive
- [ ] AA contrast ratio minimum

### When in doubt:
> **"Would Apple ship this?"**

If it feels:
- Too flashy → Reduce
- Too complex → Simplify
- Too many colors → Remove
- Too animated → Calm it down

---

## 📚 9. TECHNICAL REFERENCE

### CSS Custom Properties (Variables)
Location: `src/styles/theme.css`

### Tailwind Extensions
Location: `tailwind.config.js`

### Typography Utilities
Location: `src/styles/index.css`

### Component Styling
- Follow utility-first approach with Tailwind
- Extract repeated patterns to CSS classes
- Use semantic class names

---

## 🎯 10. DESIGN PRINCIPLES SUMMARY

1. **Precision over flash** - Technical feel, not marketing hype
2. **Clarity over decoration** - Every element has purpose
3. **Hierarchy guides the eye** - Don't make everything scream
4. **Silence is powerful** - White space is not empty space
5. **Consistency builds trust** - Use the system, don't improvise
6. **Accessibility is mandatory** - WCAG AA minimum
7. **Performance matters** - Smooth 60fps interactions

---

## 📞 QUESTIONS?

If you encounter a design decision not covered here:

1. Check Linear, Apple, or other tool-grade products
2. Ask: "Does this help or distract?"
3. Default to minimal, add only if necessary
4. Document new patterns here

**Remember**: The best design is invisible. Users should remember the tool, not the interface.

---

Last updated: 2025-12-28  
Maintained by: Design System Team
