# 🏗️ Arquitectura de Componentes - Landing SaaS

## Stack Técnico

### Frontend
- **Framework**: React 18+ con Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + CSS Variables
- **Icons**: Lucide React
- **Animations**: CSS Transitions + Tailwind Animations

### Design System (Mantener Existente)
- **Colors**: Theme CSS variables (`--color-*`)
- **Typography**: Inter (sans), JetBrains Mono (mono)
- **Spacing**: 8px base system
- **Borders**: Consistent radius system
- **Shadows**: Accent-based glow effects

---

## Estructura de Componentes

```
src/
├── pages/
│   ├── Home.jsx                 // Landing actual (técnica)
│   └── HomeSaaS.jsx            // Nueva landing SaaS ⭐
│
├── components/
│   ├── saas/                    // Nuevos componentes SaaS
│   │   ├── HeroSaaS.jsx
│   │   ├── PainPoints.jsx
│   │   ├── Outcomes.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   ├── Testimonials.jsx
│   │   ├── FAQ.jsx
│   │   └── FinalCTA.jsx
│   │
│   ├── ui/                      // Componentes reutilizables (existentes)
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   └── DotGrid.jsx
│   │
│   └── Shared/
│       ├── Navbar.jsx           // Adaptar para SaaS
│       └── Footer.jsx           // Adaptar para SaaS
│
└── styles/
    ├── index.css                // Mantener
    └── theme.css                // Mantener
```

---

## Componentes Nuevos (SaaS)

### 1. HeroSaaS.jsx

**Propósito**: Hero section orientado a beneficios B2B

**Props**:
```typescript
interface HeroSaaSProps {
  badge?: string;
  headline: string;
  subheadline: string;
  ctaPrimary: {
    text: string;
    onClick: () => void;
  };
  ctaSecondary?: {
    text: string;
    onClick: () => void;
  };
  trustSignals?: string[];
}
```

**Estructura**:
```jsx
<section className="hero-saas">
  <DotGrid background />
  <Badge>{badge}</Badge>
  <h1>{headline}</h1>
  <p>{subheadline}</p>
  <div className="cta-group">
    <Button primary>{ctaPrimary.text}</Button>
    <Button secondary>{ctaSecondary.text}</Button>
  </div>
  <TrustSignals items={trustSignals} />
</section>
```

**Características**:
- Background con DotGrid (opacity 30%)
- Gradiente vertical para legibilidad
- Spotlight central con accent color
- CTAs horizontales en mobile/desktop
- Trust signals con checkmarks

---

### 2. PainPoints.jsx

**Propósito**: Mostrar problemas del entrenador (empatía)

**Props**:
```typescript
interface PainPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PainPointsProps {
  headline: string;
  points: PainPoint[];
}
```

**Estructura**:
```jsx
<section className="pain-points">
  <h2>{headline}</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    {points.map(point => (
      <PainPointCard
        icon={point.icon}
        title={point.title}
        description={point.description}
      />
    ))}
  </div>
</section>
```

**Características**:
- Grid responsive (1→2→4 cols)
- Cards con hover effect sutil
- Icons con accent color
- Copy empático y directo

---

### 3. Outcomes.jsx

**Propósito**: Casos de uso con métricas de impacto

**Props**:
```typescript
interface Outcome {
  icon: LucideIcon;
  headline: string;
  description: string;
  metric: string;
}

interface OutcomesProps {
  headline: string;
  subheadline?: string;
  outcomes: Outcome[];
}
```

**Estructura**:
```jsx
<section className="outcomes">
  <h2>{headline}</h2>
  <p>{subheadline}</p>
  <div className="space-y-6">
    {outcomes.map(outcome => (
      <OutcomeCard
        icon={outcome.icon}
        headline={outcome.headline}
        description={outcome.description}
        metric={outcome.metric}
      />
    ))}
  </div>
</section>
```

**Características**:
- Cards horizontales con métrica destacada
- Números grandes y visibles
- Iconos con background accent/10
- Hover effect con border glow

---

### 4. Features.jsx

**Propósito**: Features como capacidades (qué resuelven)

**Props**:
```typescript
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  solves: string; // Pain point que resuelve
}

interface FeaturesProps {
  headline: string;
  subheadline?: string;
  features: Feature[];
}
```

**Estructura**:
```jsx
<section className="features">
  <h2>{headline}</h2>
  <p>{subheadline}</p>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {features.map(feature => (
      <FeatureCard
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
        solves={feature.solves}
      />
    ))}
  </div>
</section>
```

**Características**:
- Grid 2x3 en desktop
- Cada card responde "¿Qué resuelve?"
- Icons con accent background
- Hover effect con gradient border

---

### 5. Pricing.jsx

**Propósito**: Planes con enfoque en escalabilidad

**Props**:
```typescript
interface Plan {
  name: string;
  price: number;
  period: 'month' | 'year';
  tagline: string;
  features: string[];
  limits: {
    clients: number;
    features: string[];
  };
  cta: {
    text: string;
    onClick: () => void;
  };
  highlighted?: boolean;
  badge?: string;
}

interface PricingProps {
  headline: string;
  subheadline?: string;
  plans: Plan[];
  footer?: string[];
}
```

**Estructura**:
```jsx
<section className="pricing">
  <h2>{headline}</h2>
  <p>{subheadline}</p>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {plans.map(plan => (
      <PricingCard
        plan={plan}
        highlighted={plan.highlighted}
      />
    ))}
  </div>
  <PricingFooter items={footer} />
</section>
```

**Características**:
- Plan central destacado (scale + shadow)
- Badges para "RECOMENDADO"
- Microcopy ("Sin tarjeta", etc.)
- CTAs diferenciados por plan
- Footer con garantías

---

### 6. Testimonials.jsx

**Propósito**: Prueba social con testimonios + métricas

**Props**:
```typescript
interface Testimonial {
  quote: string;
  author: {
    name: string;
    role: string;
    location: string;
    avatar?: string;
  };
}

interface TestimonialsProps {
  headline: string;
  testimonials: Testimonial[];
  metrics?: {
    label: string;
    value: string;
  }[];
}
```

**Estructura**:
```jsx
<section className="testimonials">
  <h2>{headline}</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {testimonials.map(t => (
      <TestimonialCard testimonial={t} />
    ))}
  </div>
  {metrics && <MetricsBar metrics={metrics} />}
</section>
```

**Características**:
- Cards con quote destacado
- Author info con role + location
- Opcional: avatar (placeholder)
- Metrics bar con números grandes
- Border accent sutil

---

### 7. FAQ.jsx

**Propósito**: Resolver objeciones comunes

**Props**:
```typescript
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  headline: string;
  items: FAQItem[];
}
```

**Estructura**:
```jsx
<section className="faq">
  <h2>{headline}</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {items.map(item => (
      <FAQAccordion
        question={item.question}
        answer={item.answer}
      />
    ))}
  </div>
</section>
```

**Características**:
- Accordion con expand/collapse
- 2 columnas en desktop
- Smooth transitions
- Icons de expand (ChevronDown)
- Answer con line-height generoso

---

### 8. FinalCTA.jsx

**Propósito**: CTA final con refuerzo de beneficio

**Props**:
```typescript
interface FinalCTAProps {
  headline: string;
  subheadline: string;
  cta: {
    text: string;
    onClick: () => void;
  };
  trustBadges?: string[];
}
```

**Estructura**:
```jsx
<section className="final-cta">
  <div className="gradient-orbs" />
  <h2>{headline}</h2>
  <p>{subheadline}</p>
  <Button size="lg">{cta.text}</Button>
  <TrustBadges items={trustBadges} />
</section>
```

**Características**:
- Background gradient con orbs
- Full-width, centrado
- CTA grande y destacado
- Trust badges con checkmarks
- Border accent glow

---

## Componentes Reutilizables (UI)

### Button.jsx (Existente - Adaptar)

**Variantes necesarias**:
```jsx
// Primary (accent background)
<Button variant="primary" size="lg">
  Prueba gratis 14 días
</Button>

// Secondary (outline)
<Button variant="secondary" size="lg">
  Ver demo
</Button>

// Ghost (sin border)
<Button variant="ghost">
  Saber más
</Button>
```

**Sizes**:
- `sm`: h-10, px-4, text-sm
- `md`: h-12, px-6, text-base (default)
- `lg`: h-14, px-8, text-lg

---

### Badge.jsx (Nuevo)

**Propósito**: Pills para badges, tags, labels

```jsx
<Badge variant="accent">
  🎯 Hecho para entrenadores
</Badge>

<Badge variant="success">
  RECOMENDADO
</Badge>
```

**Variantes**:
- `accent`: bg-accent/10, text-accent, border-accent/20
- `success`: bg-success/10, text-success, border-success/20
- `neutral`: bg-surface-alt, text-secondary, border

---

### Card.jsx (Nuevo)

**Propósito**: Container reutilizable para cards

```jsx
<Card hover glow>
  <CardIcon icon={Users} />
  <CardTitle>Gestión de Clientes</CardTitle>
  <CardDescription>
    Perfiles completos y organizados...
  </CardDescription>
</Card>
```

**Props**:
- `hover`: Hover effect con scale + shadow
- `glow`: Border glow en hover
- `highlighted`: Border accent permanente

---

## Layout y Spacing

### Section Spacing
```css
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

### Container
```css
.container-saas {
  max-width: 1280px;  /* 7xl */
  margin: 0 auto;
  padding: 0 1.5rem;  /* 24px */
}

@media (min-width: 1024px) {
  .container-saas {
    padding: 0 2rem;  /* 32px */
  }
}
```

### Grid Systems
```css
/* 2 columns */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3 columns */
.grid-3 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Animaciones y Micro-interacciones

### Fade In Up (Existente)
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

### Stagger Delays
```jsx
{items.map((item, index) => (
  <div
    key={index}
    className="animate-fade-in-up"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {item}
  </div>
))}
```

### Hover Effects
```css
.card-hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(82, 39, 255, 0.15);
}
```

### Border Glow
```css
.border-glow {
  position: relative;
}

.border-glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(
    to right,
    rgba(82, 39, 255, 0.2),
    rgba(82, 39, 255, 0)
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.border-glow:hover::before {
  opacity: 1;
}
```

---

## Responsive Breakpoints

```javascript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Mobile-First Approach
```jsx
// Base: Mobile
<div className="text-2xl">

// Tablet
<div className="text-2xl md:text-3xl">

// Desktop
<div className="text-2xl md:text-3xl lg:text-4xl">
```

---

## Accesibilidad (A11y)

### Contraste
- **Text primary**: #FFFFFF sobre #0B0B0F (21:1) ✅
- **Text secondary**: #C8C8D2 sobre #0B0B0F (12:1) ✅
- **Accent**: #5227FF sobre #0B0B0F (4.5:1) ⚠️ (usar con cuidado)

### Semántica
```jsx
// ✅ Correcto
<section aria-labelledby="pricing-heading">
  <h2 id="pricing-heading">Planes</h2>
</section>

// ❌ Incorrecto
<div>
  <span className="text-2xl">Planes</span>
</div>
```

### Navegación por Teclado
```jsx
// Focus visible
<button className="focus:outline-2 focus:outline-accent">
  CTA
</button>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Saltar al contenido
</a>
```

### ARIA Labels
```jsx
<button aria-label="Cerrar modal">
  <X className="h-4 w-4" />
</button>

<nav aria-label="Navegación principal">
  <ul>...</ul>
</nav>
```

---

## Performance

### Code Splitting
```jsx
// Lazy load componentes pesados
const Pricing = lazy(() => import('./components/saas/Pricing'));
const Testimonials = lazy(() => import('./components/saas/Testimonials'));

<Suspense fallback={<Spinner />}>
  <Pricing />
</Suspense>
```

### Image Optimization
```jsx
// Usar WebP con fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>

// Lazy loading
<img loading="lazy" src="..." alt="..." />
```

### Debounce en Scroll
```javascript
const handleScroll = debounce(() => {
  // Track scroll depth
  trackEvent('scroll_depth', { percentage: 50 });
}, 500);
```

---

## SEO

### Meta Tags
```jsx
<Helmet>
  <title>Plataforma SaaS para Entrenadores | Gestiona más clientes</title>
  <meta name="description" content="Centraliza agenda, pagos y seguimiento de clientes. Escala tu negocio de entrenamiento sin contratar asistente." />
  <meta property="og:title" content="Plataforma SaaS para Entrenadores" />
  <meta property="og:description" content="Gestiona más clientes sin perder el control" />
  <meta property="og:image" content="/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Plataforma SaaS para Entrenadores",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "USD"
  }
}
```

---

## Tracking Events

### Analytics Setup
```javascript
// Hero CTA
onClick={() => {
  trackEvent('cta_click', {
    location: 'hero',
    action: 'signup',
    plan: null
  });
  navigate('/signup');
}}

// Pricing CTA
onClick={() => {
  trackEvent('pricing_cta_click', {
    plan: 'pro',
    period: 'monthly',
    price: 49
  });
  navigate('/signup?plan=pro');
}}

// Scroll depth
useEffect(() => {
  const depths = [25, 50, 75, 100];
  const handleScroll = () => {
    const scrolled = (window.scrollY / document.body.scrollHeight) * 100;
    depths.forEach(depth => {
      if (scrolled >= depth && !tracked[depth]) {
        trackEvent('scroll_depth', { percentage: depth });
        setTracked(prev => ({ ...prev, [depth]: true }));
      }
    });
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

## Deployment Checklist

### Pre-Launch
- [ ] Copy review (typos, tone)
- [ ] Responsive testing (mobile/tablet/desktop)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WAVE, axe)
- [ ] SEO meta tags
- [ ] Analytics setup
- [ ] GDPR compliance (cookie banner)

### Post-Launch
- [ ] Monitor conversion rate
- [ ] A/B test headlines
- [ ] Collect user feedback
- [ ] Iterate on copy
- [ ] Optimize CTAs

---

**Objetivo**: Arquitectura modular, reutilizable y optimizada para conversión B2B SaaS.
