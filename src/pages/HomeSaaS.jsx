/**
 * HomeSaaS.jsx
 * GRIND LAB — Landing page SaaS optimizada para conversión
 * Audiencia: Entrenadores personales, coaches online, preparadores físicos
 * Idioma: Español Argentina (vos)
 */

import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Clock, Users, DollarSign, CheckCircle2, ArrowRight, Zap,
    FileText, Target, Award, Shield, Sparkles, Brain, ChevronDown,
    Star, Building2, Laptop, Dumbbell, Menu, X, Lock, Headphones, Mail
} from 'lucide-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';
import FAQ from '../components/ui/FAQ';
import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   DATA CONSTANTS
───────────────────────────────────────────── */

const NAV_LINKS = [
    { label: 'Beneficios', id: 'benefits' },
    { label: 'Cómo funciona', id: 'how-it-works' },
    { label: 'Planes', id: 'pricing' },
    { label: 'Preguntas', id: 'faq' },
];

const PAIN_POINTS = [
    {
        icon: Clock,
        title: '3 horas por rutina',
        description: 'Planificar semanas, días, ejercicios, series y repeticiones desde cero — para cada cliente. Una y otra vez.',
        tag: 'Tiempo perdido'
    },
    {
        icon: FileText,
        title: 'Excel y Word',
        description: 'Plantillas desactualizadas, copiar y pegar errores, formatear PDFs a mano. Tu trabajo merece mejores herramientas.',
        tag: 'Poco profesional'
    },
    {
        icon: Brain,
        title: 'Fatiga mental',
        description: 'Decidir progresiones, periodización y volumen para 10+ clientes drena tu energía antes de que empiece el entrenamiento.',
        tag: 'Riesgo de burnout'
    },
    {
        icon: Users,
        title: 'El crecimiento se frena',
        description: 'Sumar clientes significa más horas escribiendo rutinas. El crecimiento genera el mismo cuello de botella que lo limita.',
        tag: 'Barrera de escala'
    },
];

const BENEFITS = [
    {
        icon: Clock,
        title: 'Ahorrás horas cada semana',
        description: 'Generá la estructura completa de un programa al instante para enfocarte en el coaching y en los resultados de tus clientes.',
    },
    {
        icon: Award,
        title: 'Entregás planes consistentes y profesionales',
        description: 'Cada rutina sigue un sistema estructurado que elimina las planillas desordenadas y los errores de copiar y pegar.',
    },
    {
        icon: Users,
        title: 'Escalás tu negocio de coaching',
        description: 'Atendé más clientes sin dedicar más horas a escribir rutinas.',
    },
    {
        icon: Target,
        title: 'Mantenés el control profesional',
        description: 'La IA genera la estructura base — vos refinás cada detalle con tu experiencia.',
    },
    {
        icon: Sparkles,
        title: 'Mejorás la experiencia de tus clientes',
        description: 'Entregá planes de entrenamiento estructurados y prolijos con exportación a PDF con tu marca.',
    },
];

const STATS = [
    {
        icon: Clock,
        number: '40 hs',
        label: 'ahorradas por mes',
        description: 'Estimado en base a 3 horas por rutina × 4 rutinas por semana',
    },
    {
        icon: Users,
        number: '3×',
        label: 'más clientes',
        description: 'Con la misma carga de programación — la automatización reduce el tiempo de creación ~80%',
    },
    {
        icon: Zap,
        number: '<5 min',
        label: 'para tu primer resultado',
        description: 'Generá el prompt → pegalo en la IA → importá el JSON → exportá la rutina',
    },
    {
        icon: CheckCircle2,
        number: '100%',
        label: 'planes estructurados',
        description: 'Cada rutina sigue la misma estructura de datos — calidad consistente en todos tus clientes',
    },
    {
        icon: TrendingUp,
        number: '90%',
        label: 'más rápido',
        description: 'Medido en comparación con flujos de programación manual',
    },
];

const HOW_IT_WORKS = [
    {
        step: '01',
        icon: Target,
        title: 'Configurá la rutina',
        description: 'Ingresá los parámetros básicos: objetivo, nivel, frecuencia de entrenamiento. GRIND LAB genera el prompt optimizado — sin necesidad de ingeniería de prompts.',
        detail: 'Objetivo · Nivel · Frecuencia semanal',
    },
    {
        step: '02',
        icon: Sparkles,
        title: 'Generá el prompt con IA',
        description: 'Copiá el prompt optimizado y pegalo en ChatGPT, Claude o Gemini. En segundos obtenés un plan de entrenamiento completamente estructurado.',
        detail: 'ChatGPT · Claude · Gemini (cuentas gratuitas)',
    },
    {
        step: '03',
        icon: FileText,
        title: 'Refiná y entregá',
        description: 'Editá la rutina, ajustá cada detalle con tu criterio profesional, y exportá un plan de entrenamiento profesional.',
        detail: 'Editor en vivo · Exportación PDF · Backup JSON',
    },
];

const USE_CASES = [
    {
        icon: Laptop,
        archetype: 'Entrenadores personales independientes',
        description: 'Creá programas estructurados para cada cliente en minutos.',
        metric: 'Más tiempo entrenando, menos escribiendo',
    },
    {
        icon: Users,
        archetype: 'Coaches online',
        description: 'Escalá tu coaching sin gastar horas en programación.',
        metric: '3× capacidad de clientes',
    },
    {
        icon: Building2,
        archetype: 'Box y estudios de entrenamiento',
        description: 'Estandarizá la programación entre todos los coaches.',
        metric: 'Calidad consistente a escala',
    },
    {
        icon: Dumbbell,
        archetype: 'Coaches híbridos',
        description: 'Combiná la eficiencia de la IA con tu experiencia profesional.',
        metric: 'Programación de élite en minutos',
    },
];

// Pricing recalculado para que el plan trimestral sea el punto óptimo:
// Mensual $20/mes (precio base, sin descuento)
// Trimestral $48 → $16/mes — 20% off — 1 mes de regalo ← mejor precio por mes
// Semestral $108 → $18/mes — 10% off — mismo ahorro total pero más plata adelante
const PRICING_TIERS = [
    {
        id: 'mensual',
        name: 'Mensual',
        totalUSD: 20,
        perMonthUSD: 20,
        perMonthARS: 20000,
        period: '/mes',
        billedAs: 'Facturado mes a mes',
        description: 'Ideal para probar la plataforma. Sin compromisos.',
        cta: 'Empezar ahora',
        ctaVariant: 'outline',
        savings: null,
        highlight: false,
        badge: null,
        features: [
            'Todos los beneficios de la plataforma',
            'Rutinas ilimitadas',
            'Exportación PDF profesional',
            'Soporte incluido',
        ],
    },
    {
        id: 'trimestral',
        name: 'Trimestral',
        totalUSD: 48,
        perMonthUSD: 16,
        perMonthARS: 16000,
        period: '/mes',
        billedAs: 'USD 48 cada 3 meses · 1 mes de regalo',
        description: 'El punto óptimo entre precio y flexibilidad.',
        cta: 'Elegir este plan',
        ctaVariant: 'default',
        savings: { label: '1 mes gratis', pct: '20% off', monthlySaved: 4 },
        highlight: true,
        badge: 'Más elegido',
        features: [
            'Todos los beneficios de la plataforma',
            'Rutinas ilimitadas',
            'Exportación PDF profesional',
            'Soporte prioritario',
        ],
    },
    {
        id: 'semestral',
        name: 'Semestral',
        totalUSD: 108,
        perMonthUSD: 18,
        perMonthARS: 18000,
        period: '/mes',
        billedAs: 'USD 108 cada 6 meses',
        description: 'Para quienes prefieren pagar con menos frecuencia.',
        cta: 'Elegir este plan',
        ctaVariant: 'outline',
        savings: { label: 'Ahorrás $12/total', pct: '10% off', monthlySaved: 2 },
        highlight: false,
        badge: null,
        features: [
            'Todos los beneficios de la plataforma',
            'Rutinas ilimitadas',
            'Exportación PDF profesional',
            'Soporte incluido',
        ],
    },
];

const FAQ_ITEMS = [
    {
        question: '¿Esto reemplaza al entrenador?',
        answer: 'No. La IA genera una estructura base. Vos controlás cada ajuste — selección de ejercicios, progresiones, volumen, notas. El plan siempre es tuyo. Tu experiencia como coach es lo que lo hace funcionar.',
    },
    {
        question: '¿Necesito conocimientos técnicos?',
        answer: 'Para nada. El flujo funciona con las herramientas de IA que ya usás — ChatGPT, Claude o Gemini. Completás un formulario, copiás un prompt, lo pegás e importás el resultado. Sin APIs, sin configuración, sin pasos técnicos.',
    },
    {
        question: '¿Qué pasa con mis datos?',
        answer: 'Tus rutinas quedan privadas y bajo tu control. GRIND LAB funciona completamente en tu navegador — no hay servidor backend que almacene tus datos. Cuando exportás, los archivos van directamente a tu dispositivo.',
    },
    {
        question: '¿Puedo cancelar cuando quiero?',
        answer: 'Sí. Todos los planes pagos se pueden cancelar sin compromiso. Podés cancelar desde la configuración de tu cuenta en cualquier momento y conservás el acceso hasta el final del período de facturación.',
    },
];

const TRUST_SIGNALS = [
    {
        icon: Shield,
        title: 'Privacidad',
        description: 'Tus datos de rutinas son privados y no se almacenan ni venden.',
    },
    {
        icon: Lock,
        title: 'Seguridad',
        description: 'No se requieren API keys. Funciona completamente en tu navegador.',
    },
    {
        icon: Headphones,
        title: 'Soporte',
        description: 'Onboarding guiado y documentación incluida.',
    },
];

/* ─────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────── */

function SectionTag({ icon: Icon, label }) {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
        </div>
    );
}

function SectionHeader({ tag, icon, headline, subline }) {
    return (
        <div className="mx-auto max-w-2xl text-center mb-16">
            {tag && <SectionTag icon={icon} label={tag} />}
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.1]">
                {headline}
            </h2>
            {subline && (
                <p className="mt-4 text-lg text-text-secondary">{subline}</p>
            )}
        </div>
    );
}

function GlowCard({ children, className = '' }) {
    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
            <div className={`relative rounded-2xl border border-border bg-primary-surface ${className}`}>
                {children}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */

function Navbar({ onScrollTo }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary-bg/95 backdrop-blur-md border-b border-border shadow-lg' : 'bg-transparent'}`}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                            <Zap className="h-4 w-4" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight font-display">GRIND LAB</span>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                onClick={() => onScrollTo(link.id)}
                                className="text-sm text-text-secondary hover:text-white transition-colors font-medium"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onScrollTo('pricing')}
                            className="text-sm border-text-tertiary/30 hover:border-accent/50"
                        >
                            Ver planes
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onScrollTo('contact')}
                            className="text-sm shadow-md shadow-accent/20"
                        >
                            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                            Solicitar demo
                        </Button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Abrir menú"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-primary-bg/98 backdrop-blur-md border-b border-border">
                    <div className="px-6 py-4 space-y-4">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                onClick={() => { onScrollTo(link.id); setMobileOpen(false); }}
                                className="block w-full text-left text-sm text-text-secondary hover:text-white transition-colors py-2"
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="pt-2 space-y-3">
                            <Button variant="outline" size="sm" onClick={() => { onScrollTo('pricing'); setMobileOpen(false); }} className="w-full text-sm">
                                Ver planes
                            </Button>
                            <Button size="sm" onClick={() => { onScrollTo('contact'); setMobileOpen(false); }} className="w-full text-sm">
                                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                Solicitar demo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */

function HeroSection({ onScrollTo }) {
    return (
        <div className="relative min-h-screen flex items-center overflow-hidden border-b border-border">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-25">
                <DotGrid
                    dotSize={6} gap={20} baseColor="#1a1a24" activeColor="#2d2d3d"
                    proximity={120} shockRadius={250} shockStrength={5}
                    resistance={750} returnDuration={1.5}
                />
            </div>
            <div className="absolute inset-0 z-[1]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-3xl" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/10 via-transparent to-primary-bg/90 z-[1]" />

            {/* Content */}
            <div className="relative z-10 w-full mx-auto max-w-5xl px-6 py-32 sm:py-40 text-center">

                {/* Badge */}
                <div className="flex justify-center mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
                        <Brain className="h-4 w-4" />
                        <span>Generador de planes de entrenamiento con IA para entrenadores personales</span>
                    </div>
                </div>

                {/* Headline — elevator pitch kept */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    Dejá de escribir planes.{' '}
                    <span className="bg-gradient-to-r from-accent via-violet-400 to-accent-light bg-clip-text text-transparent">
                        Empezá a entrenar.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="mt-6 text-xl sm:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                    Generá planes de entrenamiento completos y estructurados en segundos.
                    Refiná con tu criterio profesional y entregá PDFs que tus clientes van a confiar.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                    <Button
                        size="lg"
                        onClick={() => onScrollTo('contact')}
                        className="group text-base px-8 h-14 shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-all"
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Solicitar una demostración
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => onScrollTo('pricing')}
                        className="text-base px-8 h-14 border-text-tertiary/30 hover:border-accent/50 transition-all"
                    >
                        Ver planes y precios
                    </Button>
                </div>

                {/* AI tools line */}
                <p className="mt-6 text-sm text-text-tertiary animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    Funciona con las herramientas de IA que ya usás:{' '}
                    <span className="text-text-secondary font-medium">ChatGPT · Claude · Gemini</span>
                </p>

                {/* Credibility bullets */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                    {[
                        'Generá rutinas en segundos, no en horas',
                        'Mantené el control profesional de cada programa',
                        'Entregá planes listos para el cliente al instante',
                    ].map((bullet, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                            <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                            {bullet}
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="mt-16 flex justify-center animate-bounce">
                    <ChevronDown className="h-6 w-6 text-text-quaternary" />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-bg to-transparent z-[1]" />
        </div>
    );
}

/* ─────────────────────────────────────────────
   PAIN POINTS
───────────────────────────────────────────── */

function PainPointsSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <SectionHeader
                headline="¿Te suena familiar?"
                subline="El costo real de programar rutinas a mano"
            />
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PAIN_POINTS.map((pain, i) => (
                    <div key={i} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-red-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                        <div className="relative rounded-2xl border border-border bg-primary-surface p-6 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                    <pain.icon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded-full">{pain.tag}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2 font-display">{pain.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{pain.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   BENEFITS
───────────────────────────────────────────── */

function BenefitsSection() {
    return (
        <section id="benefits" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <SectionTag icon={TrendingUp} label="Lo que ganás como entrenador" />
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.1]">
                    Construido para resultados reales
                </h2>
                <p className="mt-4 text-lg text-text-secondary">
                    No funcionalidades. No mecánicas de IA. Resultados concretos para tu negocio de coaching.
                </p>
            </div>

            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BENEFITS.map((benefit, i) => (
                    <GlowCard key={i} className="p-6 h-full">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                            <benefit.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 font-display">{benefit.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                    </GlowCard>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   STATS DECK
───────────────────────────────────────────── */

function StatsDeckSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <SectionTag icon={TrendingUp} label="Benchmarks de rendimiento" />
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.1]">
                    Los números que le importan a los coaches
                </h2>
                <p className="mt-4 text-sm text-text-tertiary">
                    Estimaciones basadas en flujos de programación manual típicos. Los resultados pueden variar.
                </p>
            </div>

            <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATS.map((stat, i) => (
                    <GlowCard key={i} className="p-8 text-center h-full flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="text-4xl sm:text-5xl font-bold text-accent mb-1">{stat.number}</div>
                        <div className="text-base font-semibold text-white mb-3">{stat.label}</div>
                        <p className="text-sm text-text-secondary leading-relaxed">{stat.description}</p>
                    </GlowCard>
                ))}
            </div>

            {/* Disclosure */}
            <div className="mt-10 mx-auto max-w-2xl text-center">
                <p className="text-xs text-text-quaternary leading-relaxed">
                    Las métricas mostradas son estimaciones basadas en flujos de programación manual típicos de entrenadores personales.
                    El ahorro real de tiempo puede variar según el estilo de coaching y la complejidad de los clientes.
                </p>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */

function HowItWorksSection({ onScrollTo }) {
    return (
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <SectionTag icon={Brain} label="Flujo de trabajo en 3 pasos" />
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.1]">
                    ¿Cómo funciona?
                </h2>
                <p className="mt-4 text-lg text-text-secondary">
                    Sin conocimientos técnicos. Sin ingeniería de prompts. Solo coaching.
                </p>
            </div>

            <div className="mx-auto max-w-4xl">
                <div className="relative space-y-6">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div key={i} className="relative flex gap-6">
                            {i < HOW_IT_WORKS.length - 1 && (
                                <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-accent/40 to-accent/0" style={{ marginLeft: '-0.5px' }} />
                            )}
                            <div className="flex-shrink-0 relative z-10">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-bold text-sm font-mono shadow-lg shadow-accent/30">
                                    {step.step}
                                </div>
                            </div>
                            <GlowCard className="flex-1 p-6 sm:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2 font-display">{step.title}</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed mb-4">{step.description}</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-bg border border-border text-xs text-text-tertiary font-mono">
                                            {step.detail}
                                        </div>
                                    </div>
                                </div>
                            </GlowCard>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button
                        size="lg"
                        onClick={() => onScrollTo('contact')}
                        className="group text-base px-8 h-12 shadow-lg shadow-accent/20"
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Quiero empezar
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <p className="mt-3 text-xs text-text-muted">Sin registro requerido. Tu primera rutina en menos de 5 minutos.</p>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   USE CASES
───────────────────────────────────────────── */

function UseCasesSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <SectionHeader
                tag="Hecho para cada tipo de coach"
                icon={Users}
                headline="Tu negocio de entrenamiento, a escala"
                subline="Ya sea que tengas 5 clientes o 500, GRIND LAB se adapta a tu flujo de trabajo."
            />

            <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {USE_CASES.map((uc, i) => (
                    <GlowCard key={i} className="p-6 h-full text-center flex flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                            <uc.icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-bold text-white font-display mb-3">{uc.archetype}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed flex-1">{uc.description}</p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                            <Zap className="h-3 w-3" />
                            {uc.metric}
                        </div>
                    </GlowCard>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   PRICING
───────────────────────────────────────────── */

function PricingSection({ onScrollTo }) {
    return (
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            {/* Header */}
            <div className="mx-auto max-w-2xl text-center mb-6">
                <SectionTag icon={DollarSign} label="Planes de suscripción" />
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.1]">
                    Un solo plan, tres formas{' '}
                    <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                        de pagarlo.
                    </span>
                </h2>
                <p className="mt-4 text-lg text-text-secondary">
                    Todas las funcionalidades incluidas en cada plan. Solo elegís cada cuánto pagás.
                </p>
            </div>

            {/* Anchoring message — makes monthly feel expensive */}
            <div className="mx-auto max-w-3xl mb-10 text-center">
                <p className="text-sm text-text-tertiary">
                    💡 <span className="text-text-secondary">El plan mensual cuesta <strong className="text-white">$20 USD</strong> por mes.
                    Con el plan trimestral pagás <strong className="text-accent">$16 USD/mes</strong> — ahorrás un mes entero por cada trimestre.</span>
                </p>
            </div>

            {/* Guarantee banner */}
            <div className="mx-auto max-w-xl mb-12 text-center">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-accent/5 border border-accent/20">
                    <Shield className="h-5 w-5 text-accent flex-shrink-0" />
                    <div className="text-left">
                        <div className="text-sm font-semibold text-white">7 días de prueba sin riesgo</div>
                        <div className="text-xs text-text-secondary mt-0.5">
                            Probalo con rutinas reales. Si no mejora tu flujo de trabajo, cancelás cuando quieras.
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {PRICING_TIERS.map((tier, i) => (
                    <div key={i} className="relative group">
                        {/* Glow effect for highlighted tier */}
                        {tier.highlight && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-violet-500 to-accent rounded-3xl opacity-60 blur-md transition-all duration-300 group-hover:opacity-90" />
                        )}

                        <div className={`relative rounded-3xl border p-7 h-full flex flex-col ${
                            tier.highlight
                                ? 'border-accent/50 bg-primary-surface'
                                : 'border-border bg-primary-surface opacity-90'
                        }`}>

                            {/* Badge */}
                            {tier.badge ? (
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent/15 border border-accent/30 px-3 py-1.5 rounded-full">
                                        <Star className="h-3 w-3 fill-accent" />
                                        {tier.badge}
                                    </span>
                                </div>
                            ) : (
                                <div className="mb-4 h-7" /> // spacer
                            )}

                            {/* Plan name */}
                            <h3 className="text-xl font-bold text-white font-display mb-3">{tier.name}</h3>

                            {/* Price block */}
                            <div className="mb-2">
                                {/* Show strikethrough monthly price on trimestral */}
                                {tier.id === 'trimestral' && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-text-quaternary line-through">$20 USD/mes</span>
                                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">−20%</span>
                                    </div>
                                )}
                                {tier.id === 'semestral' && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-text-quaternary line-through">$20 USD/mes</span>
                                        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">−10%</span>
                                    </div>
                                )}
                                {tier.id === 'mensual' && (
                                    <div className="mb-1 h-5" /> // spacer to align
                                )}

                                <div className="flex items-baseline gap-1">
                                    <span className={`text-5xl font-black ${
                                        tier.highlight ? 'text-accent' : 'text-white'
                                    }`}>${tier.perMonthUSD}</span>
                                    <span className="text-text-tertiary text-sm ml-1">USD/mes</span>
                                </div>
                                <p className="text-xs text-text-tertiary mt-1">{tier.billedAs}</p>
                                {/* ARS equivalent */}
                                <p className="text-xs text-text-quaternary mt-0.5">≈ ${tier.perMonthARS.toLocaleString('es-AR')} ARS/mes*</p>
                            </div>

                            {/* Savings highlight (only for discounted plans) */}
                            {tier.savings && (
                                <div className={`my-4 px-4 py-2.5 rounded-xl text-sm font-medium ${
                                    tier.highlight
                                        ? 'bg-accent/15 border border-accent/30 text-accent'
                                        : 'bg-primary-bg border border-border text-text-secondary'
                                }`}>
                                    {tier.id === 'trimestral' ? (
                                        <span>🎁 <strong>1 mes de regalo</strong> por periodo · Ahorrás ${tier.savings.monthlySaved * 3} USD</span>
                                    ) : (
                                        <span>✓ {tier.savings.label} vs plan mensual</span>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-sm text-text-secondary mb-5">{tier.description}</p>

                            {/* Features */}
                            <ul className="space-y-3 flex-1 mb-7">
                                {tier.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                                            tier.highlight ? 'text-accent' : 'text-text-tertiary'
                                        }`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button
                                variant={tier.ctaVariant}
                                size="md"
                                onClick={() => onScrollTo('contact')}
                                className={`w-full group ${
                                    tier.highlight
                                        ? 'shadow-xl shadow-accent/30 hover:shadow-accent/50'
                                        : 'border-border hover:border-accent/50'
                                }`}
                            >
                                {tier.cta}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ARS note + comparison CTA */}
            <div className="mt-10 mx-auto max-w-3xl text-center space-y-3">
                <p className="text-xs text-text-quaternary">
                    * El equivalente en pesos argentinos es aproximado y se actualiza según la cotización del dólar al momento de la facturación.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        Cancelás cuando querés, sin penalidades
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                        <Shield className="h-4 w-4 text-accent" />
                        7 días de devolución garantizada
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                        <Zap className="h-4 w-4 text-accent" />
                        Todas las funciones en todos los planes
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   TRUST SIGNALS
───────────────────────────────────────────── */

function TrustSignalsSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 border-b border-border">
            <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-8">
                {TRUST_SIGNALS.map((signal, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                            <signal.icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-base font-semibold text-white">{signal.title}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{signal.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */

function FAQSection() {
    return (
        <section id="faq" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <SectionHeader
                tag="Respuestas directas"
                icon={CheckCircle2}
                headline="Preguntas frecuentes"
                subline="Respuestas claras a las dudas más comunes de los entrenadores."
            />
            <div className="mx-auto max-w-3xl">
                <FAQ items={FAQ_ITEMS} defaultOpen={0} />
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   CONTACT / DEMO
───────────────────────────────────────────── */

function ContactSection() {
    const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder — replace with your form handler / email service
        setEnviado(true);
    };

    return (
        <section id="contact" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
            <div className="mx-auto max-w-2xl">
                <div className="text-center mb-12">
                    <SectionTag icon={Mail} label="Contacto" />
                    <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display leading-[1.1]">
                        Solicitá tu demostración
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Contanos sobre tu negocio y te mostramos cómo GRIND LAB puede funcionar para vos.
                    </p>
                </div>

                {enviado ? (
                    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
                        <p className="text-text-secondary">
                            Te respondemos a la brevedad. Revisá tu bandeja de entrada en los próximos minutos.
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-violet-500/10 rounded-3xl blur opacity-50" />
                        <form
                            onSubmit={handleSubmit}
                            className="relative rounded-2xl border border-border bg-primary-surface p-8 space-y-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-text-secondary mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        required
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        className="w-full px-4 py-3 rounded-xl bg-primary-bg border border-border text-white placeholder-text-quaternary text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-primary-bg border border-border text-white placeholder-text-quaternary text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="mensaje" className="block text-sm font-medium text-text-secondary mb-2">
                                    Contanos sobre tu negocio
                                </label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    rows={4}
                                    value={form.mensaje}
                                    onChange={handleChange}
                                    placeholder="¿Cuántos clientes tenés? ¿Cómo programás actualmente? ¿Qué querés mejorar?"
                                    className="w-full px-4 py-3 rounded-xl bg-primary-bg border border-border text-white placeholder-text-quaternary text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 shadow-lg shadow-accent/20 group"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar solicitud de demo
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <p className="text-xs text-text-quaternary text-center">
                                Respondemos en menos de 24 horas. Sin compromisos.
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */

function FinalCTASection({ onScrollTo }) {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="relative isolate overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent px-6 py-24 text-center">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative">
                    <h2 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-bold tracking-tight text-white font-display leading-[1.05]">
                        Dejá de escribir rutinas.{' '}
                        <span className="bg-gradient-to-r from-accent via-violet-400 to-accent-light bg-clip-text text-transparent">
                            Empezá a escalar tu coaching.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary leading-relaxed">
                        Generá programas de entrenamiento estructurados en segundos y enfocate en entregar resultados.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            onClick={() => onScrollTo('contact')}
                            className="group text-base px-10 h-14 shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all"
                        >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Solicitar una demostración
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => onScrollTo('pricing')}
                            className="text-base px-8 h-14 border-text-tertiary/30 hover:border-accent/50"
                        >
                            Ver planes y precios
                        </Button>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                        {[
                            { icon: Shield, text: '100% privado — sin datos almacenados' },
                            { icon: Clock, text: 'Tu primer plan en menos de 5 minutos' },
                            { icon: CheckCircle2, text: 'Cancelá cualquier plan cuando quieras' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-text-tertiary">
                                <item.icon className="h-4 w-4 text-accent" />
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

function Footer({ onScrollTo }) {
    return (
        <footer className="border-t border-border bg-primary-bg">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                                <Zap className="h-4 w-4" />
                            </div>
                            <span className="text-white font-bold text-lg font-display">GRIND LAB</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            El editor de planes de entrenamiento potenciado por IA, creado para coaches profesionales.
                            Generá, refiná y entregá programas estructurados que tus clientes van a confiar.
                        </p>
                        <p className="mt-4 text-xs text-text-quaternary">Hecho para entrenadores. Por entrenadores.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Producto</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Beneficios', action: () => onScrollTo('benefits') },
                                { label: 'Cómo funciona', action: () => onScrollTo('how-it-works') },
                                { label: 'Planes y precios', action: () => onScrollTo('pricing') },
                                { label: 'Preguntas frecuentes', action: () => onScrollTo('faq') },
                            ].map(link => (
                                <li key={link.label}>
                                    <button onClick={link.action} className="text-sm text-text-secondary hover:text-white transition-colors">
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Solicitar demo', action: () => onScrollTo('contact') },
                                { label: 'Soporte', action: () => onScrollTo('contact') },
                                { label: 'Privacidad', action: () => { } },
                            ].map(link => (
                                <li key={link.label}>
                                    <button onClick={link.action} className="text-sm text-text-secondary hover:text-white transition-colors">
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border space-y-4">
                    <p className="text-xs text-text-quaternary leading-relaxed max-w-3xl">
                        Las métricas de rendimiento mostradas son estimaciones basadas en flujos de programación manual típicos de entrenadores personales.
                        El ahorro de tiempo y el aumento de capacidad reales pueden variar según el estilo de coaching y la complejidad de cada cliente.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs text-text-quaternary">© 2026 GRIND LAB. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-2 text-xs text-text-quaternary">
                            <Shield className="h-3.5 w-3.5 text-accent" />
                            100% del lado del cliente · Tus datos nunca salen de tu navegador
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ─────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────── */

export default function HomeSaaS() {
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-primary-bg">
            <Navbar onScrollTo={scrollToSection} />
            <HeroSection onScrollTo={scrollToSection} />
            <PainPointsSection />
            <BenefitsSection />
            <StatsDeckSection />
            <HowItWorksSection onScrollTo={scrollToSection} />
            <UseCasesSection />
            <PricingSection onScrollTo={scrollToSection} />
            <TrustSignalsSection />
            <FAQSection />
            <ContactSection />
            <FinalCTASection onScrollTo={scrollToSection} />
            <Footer onScrollTo={scrollToSection} />
        </div>
    );
}
