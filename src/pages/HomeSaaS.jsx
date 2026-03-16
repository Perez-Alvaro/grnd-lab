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
    Star, Building2, Laptop, Dumbbell, Menu, X, Lock, Headphones, Mail, MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';
import FAQ from '../components/ui/FAQ';
import UserMenu from '../components/navbar/UserMenu.jsx';
import { useAuth } from '../store/authStore.jsx';
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

// Logo ticker items (tools + feature highlights)
const TICKER_ITEMS = [
    { icon: Sparkles, label: 'ChatGPT' },
    { icon: Brain,    label: 'Claude' },
    { icon: Zap,      label: 'Gemini' },
    { icon: FileText, label: 'Exportación PDF' },
    { icon: CheckCircle2, label: 'Rutinas ilimitadas' },
    { icon: Shield,   label: '100% privado' },
    { icon: Lock,     label: 'Sin API keys' },
    { icon: Headphones, label: 'Soporte incluido' },
    { icon: TrendingUp, label: 'Escalá tu coaching' },
    { icon: Award,    label: 'Planes profesionales' },
];

/* ─────────────────────────────────────────────
   SHARED UI COMPONENTS
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
        <div className="mx-auto max-w-2xl text-center mb-16 scroll-reveal">
            {tag && <SectionTag icon={icon} label={tag} />}
            <h2
                className="font-bold tracking-tight text-white font-display"
                style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
            >
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
        <div className="relative group h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
            <div className={`relative rounded-2xl border border-border bg-primary-surface h-full ${className}`}>
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
    const { user, openLoginModal } = useAuth();

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
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-md shadow-accent/30">
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
                        {user ? (
                            <UserMenu />
                        ) : (
                            <>
                                <button
                                    onClick={openLoginModal}
                                    className="text-sm text-text-secondary hover:text-white font-medium transition-colors px-3 py-1.5"
                                >
                                    Iniciar sesión
                                </button>
                                <Button
                                    size="sm"
                                    onClick={() => onScrollTo('contact')}
                                    className="text-sm shadow-md shadow-accent/20"
                                >
                                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                    Solicitar demo
                                </Button>
                            </>
                        )}
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
                            {user ? (
                                <div className="text-sm text-text-secondary font-medium py-1">
                                    Sesión activa como <span className="text-white">{user.name}</span>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => { openLoginModal(); setMobileOpen(false); }} className="w-full text-sm">
                                    Iniciar sesión
                                </Button>
                            )}
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
            {/* DotGrid interactive background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <DotGrid
                    dotSize={6} gap={20} baseColor="#1a1a24" activeColor="#2d2d3d"
                    proximity={120} shockRadius={250} shockStrength={5}
                    resistance={750} returnDuration={1.5}
                />
            </div>

            {/* Atmospheric radial glows */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(82,39,255,0.13) 0%, transparent 65%)' }}
                />
                <div
                    className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(107,66,255,0.07) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -bottom-32 left-0 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(82,39,255,0.05) 0%, transparent 70%)' }}
                />
            </div>

            {/* Gradient vignette to ground the section */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/30 via-transparent to-primary-bg z-[2] pointer-events-none" />

            {/* Content */}
            <div
                className="relative z-10 w-full mx-auto max-w-5xl px-6 text-center"
                style={{ paddingTop: 'clamp(120px, 16vw, 180px)', paddingBottom: 'clamp(100px, 12vw, 150px)' }}
            >
                {/* Eyebrow badge */}
                <div className="flex justify-center mb-8 scroll-reveal">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
                        <Brain className="h-4 w-4 flex-shrink-0" />
                        <span>Generador de planes de entrenamiento con IA para entrenadores personales</span>
                    </div>
                </div>

                {/* Headline — display size, weight 900 */}
                <h1
                    className="text-white font-display scroll-reveal reveal-delay-1"
                    style={{
                        fontSize: 'var(--text-display)',
                        lineHeight: 'var(--leading-display)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                    }}
                >
                    Dejá de escribir planes.{' '}
                    <span className="bg-gradient-to-r from-accent via-violet-400 to-accent-light bg-clip-text text-transparent">
                        Empezá a entrenar.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="mt-6 text-xl sm:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed scroll-reveal reveal-delay-2">
                    Generá planes de entrenamiento completos y estructurados en segundos.
                    Refiná con tu criterio profesional y entregá PDFs que tus clientes van a confiar.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 scroll-reveal reveal-delay-3">
                    <button
                        onClick={() => onScrollTo('contact')}
                        className="btn-hero-primary group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-accent text-white font-bold text-base w-full sm:w-auto"
                    >
                        <Sparkles className="h-5 w-5 flex-shrink-0" />
                        Solicitar una demostración
                        <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                        onClick={() => onScrollTo('pricing')}
                        className="group inline-flex items-center justify-center h-14 px-8 rounded-xl border border-text-tertiary/30 text-text-secondary hover:border-accent/50 hover:text-white font-semibold text-base transition-all w-full sm:w-auto"
                    >
                        Ver planes y precios
                    </button>
                </div>

                {/* AI tools trust line */}
                <p className="mt-6 text-sm text-text-tertiary scroll-reveal reveal-delay-4">
                    Funciona con las herramientas de IA que ya usás:{' '}
                    <span className="text-text-secondary font-medium">ChatGPT · Claude · Gemini</span>
                </p>

                {/* Credibility bullets */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-8 scroll-reveal reveal-delay-4">
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
                <div className="mt-14 flex justify-center animate-bounce">
                    <ChevronDown className="h-6 w-6 text-text-quaternary" />
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   SOCIAL PROOF STRIP — immediately after hero
───────────────────────────────────────────── */

function LogoTicker() {
    // Duplicate for seamless infinite loop
    const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
    return (
        <div className="ticker-mask py-1" aria-hidden="true">
            <div className="ticker-track">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="inline-flex items-center gap-2.5 px-8 py-2 text-text-quaternary text-sm font-medium select-none whitespace-nowrap"
                    >
                        <item.icon className="h-4 w-4 flex-shrink-0 opacity-50" />
                        <span>{item.label}</span>
                        <span className="ml-7 opacity-20 text-base">·</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SocialProofStrip() {
    return (
        <section className="section-elevated-bg border-b border-border" style={{ padding: 'clamp(56px, 8vw, 96px) 0' }}>
            {/* Key stats — large display numbers */}
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 text-center">
                    {STATS.map((stat, i) => (
                        <div key={i} className={`scroll-reveal reveal-delay-${i + 1}`}>
                            <div
                                className="font-black text-accent leading-none mb-1.5 font-display"
                                style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
                            >
                                {stat.number}
                            </div>
                            <div className="text-sm font-medium text-text-secondary leading-snug">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Separator */}
                <div className="mt-12 border-t border-border" />
            </div>

            {/* Logo / feature ticker */}
            <div className="mt-8">
                <LogoTicker />
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   PAIN POINTS
───────────────────────────────────────────── */

function PainPointsSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
            <SectionHeader
                headline="¿Te suena familiar?"
                subline="El costo real de programar rutinas a mano"
            />
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PAIN_POINTS.map((pain, i) => (
                    <div key={i} className={`relative group scroll-reveal reveal-delay-${i + 1}`}>
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500/20 to-red-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                        <div className="relative rounded-2xl border border-border bg-primary-surface p-7 h-full flex flex-col">
                            {/* Tag badge at top */}
                            <div className="mb-5">
                                <span className="inline-block text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full font-mono tracking-wide uppercase">
                                    {pain.tag}
                                </span>
                            </div>
                            {/* Icon */}
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mb-4">
                                <pain.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3 font-display leading-tight">{pain.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed flex-1">{pain.description}</p>
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
        <section id="benefits" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header with keyword highlight */}
                <div className="mx-auto max-w-2xl text-center mb-16 scroll-reveal">
                    <SectionTag icon={TrendingUp} label="Lo que ganás como entrenador" />
                    <h2
                        className="font-bold tracking-tight text-white font-display"
                        style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                    >
                        Construido para resultados{' '}
                        <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                            reales
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        No funcionalidades. No mecánicas de IA. Resultados concretos para tu negocio de coaching.
                    </p>
                </div>

                {/* Cards — min 32px internal padding, max 2 lines description */}
                <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BENEFITS.map((benefit, i) => (
                        <div key={i} className={`scroll-reveal reveal-delay-${(i % 3) + 1}`}>
                            <GlowCard className="p-8">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
                                    <benefit.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 font-display leading-snug">{benefit.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                            </GlowCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   STATS DECK — elevated with gradient border glow
───────────────────────────────────────────── */

function StatsDeckSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
            <SectionHeader
                tag="Benchmarks de rendimiento"
                icon={TrendingUp}
                headline="Los números que le importan a los coaches"
                subline="Estimaciones basadas en flujos de programación manual típicos. Los resultados pueden variar."
            />

            <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATS.map((stat, i) => (
                    <div key={i} className={`gradient-card scroll-reveal reveal-delay-${(i % 3) + 1}`}>
                        <div className="rounded-2xl bg-primary-surface p-8 text-center flex flex-col items-center h-full">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            {/* Number — min 48px */}
                            <div
                                className="font-black text-accent leading-none mb-2 font-display"
                                style={{ fontSize: 'clamp(48px, 5vw, 64px)' }}
                            >
                                {stat.number}
                            </div>
                            <div className="text-base font-semibold text-white mb-3">{stat.label}</div>
                            <p className="text-sm text-text-secondary leading-relaxed flex-1">{stat.description}</p>
                        </div>
                    </div>
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
   HOW IT WORKS — numbered vertical steps
───────────────────────────────────────────── */

function HowItWorksSection({ onScrollTo }) {
    return (
        <section id="how-it-works" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeader
                    tag="Flujo de trabajo en 3 pasos"
                    icon={Brain}
                    headline="¿Cómo funciona?"
                    subline="Sin conocimientos técnicos. Sin ingeniería de prompts. Solo coaching."
                />

                <div className="mx-auto max-w-3xl">
                    <div className="relative space-y-4">
                        {HOW_IT_WORKS.map((step, i) => (
                            <div key={i} className={`relative flex gap-6 scroll-reveal reveal-delay-${i + 1}`}>
                                {/* Connector line between steps */}
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <div className="step-connector" />
                                )}

                                {/* Step number badge */}
                                <div className="flex-shrink-0 relative z-10">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-black text-sm font-mono shadow-lg shadow-accent/40">
                                        {step.step}
                                    </div>
                                </div>

                                {/* Step card */}
                                <div className="flex-1 pb-4">
                                    <GlowCard className="p-6 sm:p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                                <step.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3
                                                    className="font-bold text-white mb-2 font-display leading-snug"
                                                    style={{ fontSize: 'var(--text-h3)' }}
                                                >
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-text-secondary leading-relaxed mb-4">{step.description}</p>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-bg border border-border text-xs text-text-tertiary font-mono">
                                                    {step.detail}
                                                </div>
                                            </div>
                                        </div>
                                    </GlowCard>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center scroll-reveal">
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
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   USE CASES
───────────────────────────────────────────── */

function UseCasesSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
            <SectionHeader
                tag="Hecho para cada tipo de coach"
                icon={Users}
                headline="Tu negocio de entrenamiento, a escala"
                subline="Ya sea que tengas 5 clientes o 500, GRIND LAB se adapta a tu flujo de trabajo."
            />

            <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {USE_CASES.map((uc, i) => (
                    <div key={i} className={`scroll-reveal reveal-delay-${i + 1}`}>
                        <GlowCard className="p-7 text-center flex flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5">
                                <uc.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-base font-bold text-white font-display mb-3 leading-snug">{uc.archetype}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed flex-1">{uc.description}</p>
                            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                                <Zap className="h-3 w-3 flex-shrink-0" />
                                {uc.metric}
                            </div>
                        </GlowCard>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   PRICING — clear visual hierarchy, badge above recommended
───────────────────────────────────────────── */

function PricingSection({ onScrollTo }) {
    return (
        <section id="pricing" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-6 scroll-reveal">
                    <SectionTag icon={DollarSign} label="Planes de suscripción" />
                    <h2
                        className="font-bold tracking-tight text-white font-display"
                        style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                    >
                        Un solo plan, tres formas{' '}
                        <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                            de pagarlo.
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Todas las funcionalidades incluidas en cada plan. Solo elegís cada cuánto pagás.
                    </p>
                </div>

                {/* Anchoring message */}
                <div className="mx-auto max-w-3xl mb-8 text-center scroll-reveal">
                    <p className="text-sm text-text-tertiary">
                        💡 <span className="text-text-secondary">El plan mensual cuesta <strong className="text-white">$20 USD</strong> por mes.
                        Con el plan trimestral pagás <strong className="text-accent">$16 USD/mes</strong> — ahorrás un mes entero por cada trimestre.</span>
                    </p>
                </div>

                {/* Guarantee banner */}
                <div className="mx-auto max-w-xl mb-14 text-center scroll-reveal">
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

                {/* Cards — equal height grid, badge positioned ABOVE highlighted card */}
                <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {PRICING_TIERS.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative group scroll-reveal reveal-delay-${i + 1} ${tier.highlight ? 'pt-6' : ''}`}
                        >
                            {/* "Más elegido" badge — positioned ABOVE the card */}
                            {tier.highlight && tier.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-accent px-5 py-1.5 rounded-full shadow-lg shadow-accent/40 tracking-wide uppercase">
                                        <Star className="h-3 w-3 fill-white flex-shrink-0" />
                                        {tier.badge}
                                    </span>
                                </div>
                            )}

                            {/* Ambient glow for highlighted tier */}
                            {tier.highlight && (
                                <div className="absolute inset-0 -inset-1 rounded-3xl bg-gradient-to-b from-accent/30 to-accent/5 blur-xl opacity-50 transition-opacity duration-300 group-hover:opacity-75" />
                            )}

                            {/* Card */}
                            <div className={`relative rounded-3xl border p-7 h-full flex flex-col ${
                                tier.highlight
                                    ? 'border-accent/50 bg-primary-surface pricing-card-glow'
                                    : 'border-border bg-primary-surface'
                            }`}>
                                {/* Plan name */}
                                <h3 className="text-xl font-bold text-white font-display mb-3">{tier.name}</h3>

                                {/* Price block */}
                                <div className="mb-2">
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
                                    {tier.id === 'mensual' && <div className="mb-1 h-5" />}

                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className={`font-black ${tier.highlight ? 'text-accent' : 'text-white'}`}
                                            style={{ fontSize: 'clamp(40px, 5vw, 52px)', lineHeight: 1 }}
                                        >
                                            ${tier.perMonthUSD}
                                        </span>
                                        <span className="text-text-tertiary text-sm ml-1">USD/mes</span>
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-1">{tier.billedAs}</p>
                                    <p className="text-xs text-text-quaternary mt-0.5">≈ ${tier.perMonthARS.toLocaleString('es-AR')} ARS/mes*</p>
                                </div>

                                {/* Savings highlight */}
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

                                {/* Features — pushed to fill height */}
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

                                {/* CTA — pushed to card bottom */}
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

                {/* ARS note + reassurances */}
                <div className="mt-10 mx-auto max-w-3xl text-center space-y-3 scroll-reveal">
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
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   TRUST SIGNALS
───────────────────────────────────────────── */

function TrustSignalsSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border" style={{ padding: 'clamp(48px, 6vw, 80px) 1.5rem' }}>
            <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-10">
                {TRUST_SIGNALS.map((signal, i) => (
                    <div key={i} className={`flex flex-col items-center text-center gap-4 scroll-reveal reveal-delay-${i + 1}`}>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                            <signal.icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-base font-bold text-white">{signal.title}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{signal.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FAQ — accordion (handled by FAQ component)
───────────────────────────────────────────── */

function FAQSection() {
    return (
        <section id="faq" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeader
                    tag="Respuestas directas"
                    icon={CheckCircle2}
                    headline="Preguntas frecuentes"
                    subline="Respuestas claras a las dudas más comunes de los entrenadores."
                />
                <div className="mx-auto max-w-3xl scroll-reveal">
                    <FAQ items={FAQ_ITEMS} defaultOpen={0} />
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   CONTACT / DEMO
───────────────────────────────────────────── */

function ContactSection() {
    return (
        <section id="contact" className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
            <div className="mx-auto max-w-2xl text-center scroll-reveal">
                <SectionTag icon={MessageCircle} label="Contacto Directo" />
                <h2
                    className="font-bold tracking-tight text-white font-display mb-6"
                    style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                >
                    Escribinos por WhatsApp
                </h2>
                <p className="mt-4 text-lg text-text-secondary mb-10">
                    Sacate las dudas, contanos sobre tu negocio y te mostramos cómo GRIND LAB puede funcionar para vos. ¡Te respondemos enseguida!
                </p>
                <a
                    href="https://wa.me/5492996086076"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Contactar al 2996086076
                </a>
                <p className="mt-6 text-sm text-text-quaternary">
                    Sin bots, hablás directamente con nosotros.
                </p>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FINAL CTA — full-width gradient banner
───────────────────────────────────────────── */

function FinalCTASection({ onScrollTo }) {
    return (
        <section
            className="relative w-full overflow-hidden cta-gradient-banner noise-overlay"
            style={{ padding: 'var(--space-section) 0' }}
        >
            {/* Decorative orbs */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(82,39,255,0.15) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(107,66,255,0.09) 0%, transparent 70%)' }}
                />
            </div>

            {/* Border top/bottom for definition */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            {/* Content */}
            <div className="relative mx-auto max-w-4xl px-6 text-center">
                <h2
                    className="text-white font-bold tracking-tight font-display scroll-reveal"
                    style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
                >
                    Dejá de escribir rutinas.{' '}
                    <span className="bg-gradient-to-r from-accent via-violet-400 to-accent-light bg-clip-text text-transparent">
                        Empezá a escalar tu coaching.
                    </span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary leading-relaxed scroll-reveal reveal-delay-1">
                    Generá programas de entrenamiento estructurados en segundos y enfocate en entregar resultados.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 scroll-reveal reveal-delay-2">
                    <button
                        onClick={() => onScrollTo('contact')}
                        className="btn-hero-primary group inline-flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-accent text-white font-bold text-base w-full sm:w-auto"
                    >
                        <Sparkles className="h-5 w-5 flex-shrink-0" />
                        Solicitar una demostración
                        <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                        onClick={() => onScrollTo('pricing')}
                        className="group inline-flex items-center justify-center h-14 px-8 rounded-xl border border-text-tertiary/30 text-text-secondary hover:border-accent/50 hover:text-white font-semibold text-base transition-all w-full sm:w-auto"
                    >
                        Ver planes y precios
                    </button>
                </div>

                {/* Micro trust signals */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 scroll-reveal reveal-delay-3">
                    {[
                        { icon: Shield,       text: '100% privado — sin datos almacenados' },
                        { icon: Clock,        text: 'Tu primer plan en menos de 5 minutos' },
                        { icon: CheckCircle2, text: 'Cancelá cualquier plan cuando quieras' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-text-tertiary">
                            <item.icon className="h-4 w-4 text-accent flex-shrink-0" />
                            {item.text}
                        </div>
                    ))}
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

    // Global scroll reveal — IntersectionObserver on all .scroll-reveal elements
    useEffect(() => {
        const targets = document.querySelectorAll('.scroll-reveal');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
        );

        targets.forEach(t => observer.observe(t));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-primary-bg">
            <Navbar onScrollTo={scrollToSection} />
            <HeroSection onScrollTo={scrollToSection} />
            <SocialProofStrip />
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
