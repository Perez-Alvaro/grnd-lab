/**
 * HomeSaaS.jsx
 * BaseRutina — Landing page SaaS optimizada para conversión
 * Audiencia: Entrenadores personales, coaches online, preparadores físicos
 * Idioma: Español Argentina (vos)
 * Copy: claro, directo, sin jerga técnica — orientado a resultados
 */

import {
    TrendingUp, Clock, Users, DollarSign, CheckCircle2, ArrowRight, Zap,
    FileText, Target, Award, Shield, Sparkles, Brain, ChevronDown,
    Star, Dumbbell, Menu, X, MessageCircle, Calendar, Salad
} from 'lucide-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';
import FAQ from '../components/ui/FAQ';
import DecryptedText from '../components/ui/DecryptedText';
import UserMenu from '../components/navbar/UserMenu.jsx';
import { useAuth } from '../store/authStore.jsx';
import { useState, useEffect } from 'react';
//imageSrc: '../assets/paso-2.webp',

/* ─────────────────────────────────────────────
   DATA CONSTANTS
───────────────────────────────────────────── */

const NAV_LINKS = [
    { label: 'Servicios', id: 'servicios' },
    { label: 'Beneficios', id: 'benefits' },
    { label: 'Cómo funciona', id: 'how-it-works' },
    { label: 'Planes', id: 'pricing' },
    { label: 'Preguntas', id: 'faq' },
];

const PAIN_POINTS = [
    {
        icon: Clock,
        title: 'Horas escribiendo rutinas',
        description: 'Cada cliente nuevo suma más tiempo frente a la pantalla. Y ese tiempo lo perdés de entrenar, de crecer o de descansar.',
        tag: 'Tiempo perdido',
        image: 'https://images.pexels.com/photos/5717789/pexels-photo-5717789.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Entrenador agotado frente a la computadora',
    },
    {
        icon: FileText,
        title: 'Excel, Word y copiar y pegar',
        description: 'Tus clientes merecen algo mejor que una planilla. Y vos merecés mejores herramientas para trabajar.',
        tag: 'Poco profesional',
        image: 'https://images.pexels.com/photos/8297058/pexels-photo-8297058.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Planillas y datos en pantalla',
    },
    {
        icon: Brain,
        title: 'Energía mental agotada',
        description: 'Programar para 10 clientes distintos consume antes de que empiece el día. Esa energía debería ir al coaching.',
        tag: 'Desgaste',
        image: 'https://images.pexels.com/photos/8069139/pexels-photo-8069139.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Persona con desgaste mental en el escritorio',
    },
    {
        icon: Users,
        title: 'No podés crecer',
        description: 'Cada cliente nuevo es más tiempo de programación. Llegás a un techo y no podés aceptar más.',
        tag: 'Freno al crecimiento',
        image: 'https://images.pexels.com/photos/7984780/pexels-photo-7984780.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Profesional abrumado sin poder crecer',
    },
];

const BENEFITS = [
    {
        icon: Clock,
        title: 'Hacés rutinas en minutos, no en horas',
        description: 'Generás la base del plan al instante. Vos ajustás los detalles con tu criterio.',
    },
    {
        icon: Award,
        title: 'Entregás algo profesional',
        description: 'Planes estructurados y prolijos, listos para mandar en PDF. Sin planillas ni formatos desprolijos.',
    },
    {
        icon: Users,
        title: 'Podés atender más clientes',
        description: 'Al escribir menos, tenés tiempo para crecer. Más clientes sin más horas de trabajo.',
    },
    {
        icon: Target,
        title: 'Siempre sos vos quien decide',
        description: 'La IA genera la base. Vos revisás, ajustás y firmás el plan con tu nombre.',
    },
];


// 4 pasos del editor con imágenes — reemplaza StatsDeckSection
const EDITOR_STEPS = [
    {
        number: '01',
        icon: Users,
        label: 'Tu cliente',
        title: 'Describí a tu cliente',
        description: 'Respondé preguntas simples sobre tu cliente: edad, experiencia, historial de lesiones, disponibilidad. Sin formularios complicados.',
        detail: ['Edad', 'Nivel', 'Historial', 'Disponibilidad'],
        // Reemplazá con la ruta real del screenshot cuando lo tengas
        imageSrc: '/assets/paso-1.png',
        imageAlt: 'Editor — datos del cliente',
        highlight: false,
    },
    {
        number: '02',
        icon: Target,
        label: 'Objetivo y método',
        title: 'Especificá el objetivo y el método',
        description: 'Elegís el objetivo principal — fuerza, hipertrofia, pérdida de grasa — y el método de entrenamiento que mejor le va a tu cliente.',
        detail: ['Fuerza', 'Hipertrofia', 'Cardio', 'Funcional'],
        imageSrc: '/assets/paso-2.png',
        imageAlt: 'Editor — objetivos y métodos',
        highlight: false,
    },
    {
        number: '03',
        icon: Calendar,
        label: 'Estructura',
        title: 'Ingresá las semanas y los días',
        description: 'Definís cuántas semanas dura el programa y cuántos días por semana entrena. BaseRutina arma la estructura automáticamente.',
        detail: ['Semanas', 'Días por semana', 'Distribución'],
        imageSrc: '/assets/paso-3.png',
        imageAlt: 'Editor — semanas y días',
        highlight: false,
    },
    {
        number: '04',
        icon: Sparkles,
        label: 'Generación con IA',
        title: 'Generá la base de tu planificación',
        description: 'Con un clic generás el prompt optimizado, lo pegás en ChatGPT o Claude y obtenés la planificación completa lista para editar y exportar.',
        detail: ['ChatGPT', 'Claude', 'Gemini', 'PDF'],
        imageSrc: '/assets/paso-4.png',
        imageAlt: 'Editor — generación con IA',
        highlight: true,
    },
];


const PRICING_TIERS = [
    {
        id: 'mensual',
        name: 'Mensual',
        totalUSD: 10,
        perMonthUSD: 10,
        perMonthARS: 10000,
        period: '/mes',
        billedAs: 'Se renueva cada mes',
        description: 'Acceso sin compromisos. Cancela cuando quieras.',
        cta: 'Empezar ahora',
        ctaVariant: 'outline',
        savings: null,
        highlight: false,
        badge: null,
        features: [
            'Rutinas ilimitadas',
            'Exportación PDF profesional',
            'Compatible con ChatGPT, Claude y Gemini',
            'Soporte por email',
        ],
    },
    {
        id: 'trimestral',
        name: 'Trimestral',
        totalUSD: 27,
        perMonthUSD: 9,
        perMonthARS: 9000,
        period: '/mes',
        billedAs: 'Pago único: USD 27 por 3 meses completos',
        description: 'El balance perfecto. Pago único, ahorro garantizado.',
        cta: 'Elegir este plan',
        ctaVariant: 'default',
        savings: { label: 'Ahorrás $3 vs mensual', pct: '10% off', monthlySaved: 1 },
        highlight: true,
        badge: 'Más elegido',
        features: [
            'Rutinas ilimitadas',
            'Exportación PDF profesional',
            'Compatible con ChatGPT, Claude y Gemini',
            'Soporte prioritario por email',
            'Acceso a nuevas features antes',
        ],
    },
    {
        id: 'anual',
        name: 'Anual',
        totalUSD: 48,
        perMonthUSD: 4,
        perMonthARS: 4000,
        period: '/mes',
        billedAs: 'Pago único: USD 48 por 12 meses completos',
        description: 'Lleva tu coaching al siguiente nivel. Pago único, máximo ahorro garantizado.',
        cta: 'Elegir este plan',
        ctaVariant: 'outline',
        savings: { label: 'Ahorrás $72 vs pagar mensual', pct: '60% off', monthlySaved: 6 },
        highlight: false,
        badge: null,
        features: [
            'Rutinas ilimitadas',
            'Exportación PDF profesional',
            'Compatible con ChatGPT, Claude y Gemini',
            'Soporte prioritario + WhatsApp',
            'Acceso a nuevas features antes',
        ],
    },
];

const FAQ_ITEMS = [
    {
        question: '¿Esto reemplaza al entrenador?',
        answer: 'No. La IA genera una base. Vos revisás cada ejercicio, progresión y volumen antes de mandar el plan. El criterio profesional siempre es tuyo.',
    },
    {
        question: '¿Necesito saber de tecnología?',
        answer: 'No hace falta nada especial. Completás un formulario, copiás el prompt que genera BaseRutina y lo pegás en ChatGPT o cualquier IA que ya usás. Eso es todo.',
    },
    {
        question: '¿Puedo modificar las rutinas?',
        answer: 'Sí, completamente. Tenés un editor para cambiar cualquier ejercicio, serie, repetición o nota. El plan es tuyo y lo ajustás como querés antes de exportarlo.',
    },
    {
        question: '¿Puedo cancelar cuando quiero?',
        answer: 'Sí. Cancelás desde tu cuenta en cualquier momento, sin penalidades ni trámites. Seguís teniendo acceso hasta que termine el período que pagaste.',
    },
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
                className="font-bold tracking-tight text-text-primary font-display"
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
   SERVICIOS — Rutinas + Nutrición (dual offering)
───────────────────────────────────────────── */

const SERVICES = [
    {
        icon: Dumbbell,
        badge: 'Disponible',
        badgeClass: 'bg-accent/15 text-accent border-accent/25',
        image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1200',
        imageAlt: 'Gimnasio con bolsa de boxeo iluminada',
        title: 'Rutinas de entrenamiento',
        desc: 'Generá la base de cualquier plan en minutos: fuerza, hipertrofia o pérdida de grasa. Vos ajustás cada detalle y lo exportás con tu marca.',
        points: ['Editor en vivo', 'Export a PDF profesional', 'Organizado por atleta'],
    },
    {
        icon: Salad,
        badge: 'Próximamente',
        badgeClass: 'bg-text-tertiary/15 text-text-tertiary border-text-tertiary/25',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
        imageAlt: 'Ensalada de quinoa con vegetales frescos',
        title: 'Planes nutricionales argentinos',
        desc: 'Recetas pensadas para Argentina, con alimentos que conseguís en el supermercado de tu zona. Nada de traducciones genéricas ni ingredientes imposibles.',
        points: ['Alimentos locales y de estación', 'Recetas simples y económicas', 'Adaptado a tu región'],
    },
];

function ServicesSection() {
    return (
        <section
            id="servicios"
            className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 border-b border-border"
            style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
        >
            <SectionHeader
                tag="Una plataforma, dos servicios"
                icon={Sparkles}
                headline="Entrenamiento y nutrición, en un solo lugar"
                subline="Arrancá hoy con las rutinas. Muy pronto vas a poder armar también los planes de alimentación de tus clientes."
            />

            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
                {SERVICES.map((s) => (
                    <GlowCard key={s.title} className="overflow-hidden">
                        <div className="flex h-full flex-col">
                            {/* Foto real (Pexels) en vez de un ícono genérico */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                                <img
                                    src={s.image}
                                    alt={s.imageAlt}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-surface via-primary-surface/25 to-transparent" />
                                <span className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${s.badgeClass}`}>
                                    {s.badge}
                                </span>
                                <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-bg/70 text-accent backdrop-blur-sm">
                                    <s.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col p-6 sm:p-8">
                                <h3 className="mb-3 text-xl font-bold text-text-primary font-display">{s.title}</h3>
                                <p className="mb-6 leading-relaxed text-text-secondary">{s.desc}</p>
                                <ul className="mt-auto space-y-2.5">
                                    {s.points.map((p) => (
                                        <li key={p} className="flex items-center gap-2.5 text-sm text-text-secondary">
                                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-accent" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </GlowCard>
                ))}
            </div>
        </section>
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
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary-bg shadow-md shadow-accent/30">
                            <Zap className="h-4 w-4" />
                        </div>
                        <span className="text-text-primary font-bold text-lg tracking-tight font-display">BaseRutina</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                onClick={() => onScrollTo(link.id)}
                                className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <UserMenu />
                        ) : (
                            <>
                                <button
                                    onClick={() => openLoginModal('login')}
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium px-3 py-1.5"
                                >
                                    Iniciar sesión
                                </button>
                                <Button
                                    size="sm"
                                    onClick={() => openLoginModal('signup')}
                                    className="text-sm shadow-md shadow-accent/20"
                                >
                                    Crear cuenta
                                </Button>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Abrir menú"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-primary-bg/98 backdrop-blur-md border-b border-border">
                    <div className="px-6 py-4 space-y-4">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                onClick={() => { onScrollTo(link.id); setMobileOpen(false); }}
                                className="block w-full text-left text-sm text-text-secondary hover:text-text-primary transition-colors py-2"
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="pt-2 space-y-3">
                            {user ? (
                                <div className="text-sm text-text-secondary font-medium py-1">
                                    Sesión activa como <span className="text-text-primary">{user.name}</span>
                                </div>
                            ) : (
                                <>
                                    <Button size="sm" onClick={() => { openLoginModal('signup'); setMobileOpen(false); }} className="w-full text-sm shadow-md shadow-accent/20">
                                        Crear cuenta
                                    </Button>
                                    <button onClick={() => { openLoginModal('login'); setMobileOpen(false); }} className="block w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors py-2">
                                        Iniciar sesión
                                    </button>
                                </>
                            )}
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
            <div className="absolute inset-0 z-0 opacity-30">
                <DotGrid
                    dotSize={6} gap={20} baseColor="#1a1a24" activeColor="#2d2d3d"
                    proximity={120} shockRadius={250} shockStrength={5}
                    resistance={750} returnDuration={1.5}
                />
            </div>

            <div className="absolute inset-0 z-[1] pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(91,179,160,0.13) 0%, transparent 65%)' }}
                />
                <div
                    className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(123,213,185,0.07) 0%, transparent 70%)' }}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/30 via-transparent to-primary-bg z-[2] pointer-events-none" />

            <div
                className="relative z-10 w-full mx-auto max-w-6xl px-6"
                style={{ paddingTop: 'clamp(120px, 16vw, 180px)', paddingBottom: 'clamp(100px, 12vw, 150px)' }}
            >
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                    <div className="text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-8 scroll-reveal">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
                                <Zap className="h-4 w-4 flex-shrink-0" />
                                <span>Para entrenadores personales y coaches online</span>
                            </div>
                        </div>

                        <h1
                            className="text-text-primary font-display scroll-reveal reveal-delay-1"
                            style={{
                                fontSize: 'var(--text-display)',
                                lineHeight: 'var(--leading-display)',
                                fontWeight: 900,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            <DecryptedText
                                text="Creá rutinas profesionales "
                                animateOn="view"
                                sequential
                                speed={38}
                                revealDirection="start"
                            />
                            <DecryptedText
                                text="en segundos."
                                animateOn="view"
                                sequential
                                speed={38}
                                revealDirection="start"
                                parentClassName="bg-gradient-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-transparent"
                            />
                        </h1>

                        <p className="mt-6 text-xl sm:text-2xl text-text-secondary max-w-2xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed scroll-reveal reveal-delay-2">
                            Vos ponés el criterio, la IA arma la base. Tenés la rutina de tu cliente lista en minutos —y muy pronto, también sus planes de nutrición.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-10 scroll-reveal reveal-delay-3">
                            <button
                                onClick={() => onScrollTo('pricing')}
                                className="btn-hero-primary group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-accent text-primary-bg font-bold text-base w-full sm:w-auto"
                            >
                                <Sparkles className="h-5 w-5 flex-shrink-0" />
                                Conocer planes
                                <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                onClick={() => onScrollTo('how-it-works')}
                                className="group inline-flex items-center justify-center h-14 px-8 rounded-xl border border-text-tertiary/30 text-text-secondary hover:border-accent/50 hover:text-text-primary font-semibold text-base transition-all w-full sm:w-auto"
                            >
                                Ver cómo funciona
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-text-tertiary scroll-reveal reveal-delay-4">
                            Compatible con las herramientas que ya usás:{' '}
                            <span className="text-text-secondary font-medium">ChatGPT · Claude · Gemini</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 scroll-reveal reveal-delay-4">
                            {[
                                'Tu primera rutina en menos de 5 minutos',
                                'Sin planillas ni copiar y pegar',
                                'Vos decidís cada detalle del plan',
                            ].map((bullet, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                                    {bullet}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full max-w-[440px] mx-auto lg:ml-auto scroll-reveal reveal-delay-2">
                        <img
                            src="/assets/mobile.png"
                            alt="Vista móvil de BaseRutina"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                <div className="mt-14 flex justify-center animate-bounce">
                    <ChevronDown className="h-6 w-6 text-text-quaternary" />
                </div>
            </div>
        </div>
    );
}


/* ─────────────────────────────────────────────
   PAIN POINTS
───────────────────────────────────────────── */

function PainPointsSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}>
            <SectionHeader
                headline="¿Te pasa esto?"
                subline="El costo real de programar rutinas a mano."
            />
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PAIN_POINTS.map((pain, i) => (
                    <div key={i} className={`relative group scroll-reveal reveal-delay-${i + 1}`}>
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500/20 to-red-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-primary-surface h-full flex flex-col">
                            {/* Foto real (Pexels) con mood "problema" */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden">
                                <img
                                    src={pain.image}
                                    alt={pain.imageAlt}
                                    loading="lazy"
                                    className="h-full w-full object-cover grayscale-[35%]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-surface via-primary-surface/40 to-transparent" />
                                <span className="absolute left-3 top-3 inline-block text-xs font-bold text-red-200 bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full font-mono tracking-wide uppercase backdrop-blur-sm">
                                    {pain.tag}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <div className="relative z-10 -mt-9 mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 ring-4 ring-primary-surface">
                                    <pain.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-3 font-display leading-tight">{pain.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed flex-1">{pain.description}</p>
                            </div>
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
                <div className="mx-auto max-w-2xl text-center mb-16 scroll-reveal">
                    <SectionTag icon={TrendingUp} label="Lo que ganás" />
                    <h2
                        className="font-bold tracking-tight text-text-primary font-display"
                        style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                    >
                        Menos tiempo escribiendo.{' '}
                        <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                            Más tiempo entrenando.
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Resultados concretos para tu negocio de coaching. Sin promesas vacías.
                    </p>
                </div>

                <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="relative w-full scroll-reveal">
                        <img
                            src="/assets/editor.png"
                            alt="Editor de rutinas de BaseRutina"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {BENEFITS.map((benefit, i) => (
                            <div key={i} className={`scroll-reveal reveal-delay-${(i % 2) + 1}`}>
                                <GlowCard className="p-8 h-full">
                                    <div className="flex items-start gap-5">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                            <benefit.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-text-primary mb-2 font-display leading-snug">{benefit.title}</h3>
                                            <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
                                        </div>
                                    </div>
                                </GlowCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   EDITOR STEPS — reemplaza StatsDeckSection
   Mobile-first: imagen arriba, texto abajo en mobile
   Desktop: alternado izquierda / derecha
───────────────────────────────────────────── */

function StepImageFrame({ step }) {
    return (
        <div className="relative">
            {/* Número flotante sobre la imagen */}
            <div className="absolute -top-4 -left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary-bg font-black text-sm font-mono shadow-lg shadow-accent/40 border-2 border-primary-bg">
                {step.number}
            </div>

            {/* Glow ambiental para el paso destacado */}
            {step.highlight && (
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-accent/25 to-accent/5 blur-xl" />
            )}

            {/* Frame estilo browser */}
            <div className={`
                relative rounded-2xl overflow-hidden border
                ${step.highlight ? 'border-accent/40' : 'border-border'}
                bg-primary-surface aspect-[4/3]
                shadow-2xl ${step.highlight ? 'shadow-accent/10' : 'shadow-black/30'}
            `}>
                {/* Chrome bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-primary-bg">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                    <div className="ml-3 h-4 flex-1 rounded-full bg-border/50 max-w-[140px]" />
                </div>

                {/* Imagen real o placeholder */}
                <div className="h-[calc(100%-44px)]">
                    {step.imageSrc ? (
                        <img
                            src={step.imageSrc}
                            alt={step.imageAlt}
                            className="w-full h-full object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                                step.highlight
                                    ? 'bg-accent text-primary-bg shadow-lg shadow-accent/40'
                                    : 'bg-accent/10 text-accent'
                            }`}>
                                <step.icon className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-mono text-text-tertiary mb-1 uppercase tracking-widest">Preview</p>
                                <p className="text-sm text-text-secondary">{step.imageAlt}</p>
                            </div>
                            <div className="w-full max-w-xs space-y-2 mt-2">
                                {[80, 60, 70, 50].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-2.5 rounded-full bg-border/60"
                                        style={{ width: `${w}%`, opacity: 1 - i * 0.15 }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditorStepCard({ step, index }) {
    const isEven = index % 2 === 0;
    return (
        <div className={`scroll-reveal reveal-delay-${(index % 3) + 1}`}>
            <div className={`
                flex flex-col gap-8
                lg:flex-row lg:items-center lg:gap-16
                ${!isEven ? 'lg:flex-row-reverse' : ''}
            `}>
                {/* Imagen — arriba en mobile, lado en desktop */}
                <div className="w-full lg:w-1/2 flex-shrink-0">
                    <StepImageFrame step={step} />
                </div>

                {/* Texto — abajo en mobile, lado en desktop */}
                <div className="w-full lg:w-1/2 flex flex-col gap-5">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 self-start">
                        <span className={`
                            text-xs font-bold px-3 py-1.5 rounded-full border font-mono tracking-widest uppercase
                            ${step.highlight
                                ? 'text-accent bg-accent/10 border-accent/30'
                                : 'text-text-tertiary bg-primary-surface border-border'
                            }
                        `}>
                            Paso {step.number}
                        </span>
                        <span className="text-xs text-text-tertiary font-medium">{step.label}</span>
                    </div>

                    {/* Título */}
                    <h3
                        className="font-bold text-text-primary font-display leading-tight"
                        style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}
                    >
                        {step.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-base text-text-secondary leading-relaxed">
                        {step.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {step.detail.map((tag, i) => (
                            <span
                                key={i}
                                className={`
                                    text-xs px-3 py-1.5 rounded-lg border font-medium
                                    ${step.highlight
                                        ? 'bg-accent/10 border-accent/20 text-accent'
                                        : 'bg-primary-surface border-border text-text-tertiary'
                                    }
                                `}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditorStepsSection() {
    return (
        <section
            id="how-it-works"
            className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border"
            style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
        >
            {/* Header */}
            <div className="mx-auto max-w-2xl text-center mb-16 scroll-reveal">
                <SectionTag icon={Sparkles} label="4 pasos simples" />
                <h2
                    className="font-bold tracking-tight text-text-primary font-display"
                    style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                >
                    De cero al plan{' '}
                    <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                        en minutos.
                    </span>
                </h2>
                <p className="mt-4 text-lg text-text-secondary">
                    Seguís los pasos y BaseRutina arma todo. Vos ajustás los detalles.
                </p>
            </div>

            {/* Lista de pasos */}
            <div className="mx-auto max-w-5xl flex flex-col gap-16 lg:gap-24">
                {EDITOR_STEPS.map((step, i) => (
                    <div key={step.number}>
                        <EditorStepCard step={step} index={i} />

                        {/* Conector visual entre pasos — solo desktop */}
                        {i < EDITOR_STEPS.length - 1 && (
                            <div className="hidden lg:flex items-center justify-center mt-12" aria-hidden="true">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="h-6 w-px bg-gradient-to-b from-border to-accent/30" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent/40" />
                                    <div className="h-6 w-px bg-gradient-to-b from-accent/30 to-border" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Nota al pie */}
            <div className="mt-16 mx-auto max-w-2xl text-center scroll-reveal">
                <p className="text-xs text-text-quaternary leading-relaxed">
                    Compatible con ChatGPT, Claude y Gemini gratuitos. No necesitás API keys ni conocimientos técnicos.
                </p>
            </div>
        </section>
    );
}


/* ─────────────────────────────────────────────
   PRICING
───────────────────────────────────────────── */

function PricingSection({ onScrollTo }) {
    return (
        <section id="pricing" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-6 scroll-reveal">
                    <SectionTag icon={DollarSign} label="Planes" />
                    <h2
                        className="font-bold tracking-tight text-text-primary font-display"
                        style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                    >
                        Empezar es{' '}
                        <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                            fácil.
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Todas las funciones incluidas en cada plan. Solo elegís cada cuánto pagás.
                    </p>
                </div>

                <div className="mx-auto max-w-3xl mb-8 text-center scroll-reveal">
                    <p className="text-sm text-text-tertiary">
                        💡 <span className="text-text-secondary">Pago único, sin suscripción. <strong className="text-text-primary">Mensual: $10</strong> · <strong className="text-accent">Trimestral: $27</strong> · <strong className="text-green-400">Anual: $48</strong></span>
                    </p>
                </div>

                <div className="mx-auto max-w-xl mb-14 text-center scroll-reveal">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-accent/5 border border-accent/20">
                        <Shield className="h-5 w-5 text-accent flex-shrink-0" />
                        <div className="text-left">
                            <div className="text-sm font-semibold text-text-primary">Probalo 24 hs luego de la compra</div>
                            <div className="text-xs text-text-secondary mt-0.5">
                                Probalo con rutinas reales. Si no funciona para vos, cancelás sin preguntas.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {PRICING_TIERS.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative group scroll-reveal reveal-delay-${i + 1} ${tier.highlight ? 'pt-6' : ''}`}
                        >
                            {tier.highlight && tier.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary-bg bg-accent px-5 py-1.5 rounded-full shadow-lg shadow-accent/40 tracking-wide uppercase">
                                        <Star className="h-3 w-3 fill-white flex-shrink-0" />
                                        {tier.badge}
                                    </span>
                                </div>
                            )}

                            {tier.highlight && (
                                <div className="absolute inset-0 -inset-1 rounded-3xl bg-gradient-to-b from-accent/30 to-accent/5 blur-xl opacity-50 transition-opacity duration-300 group-hover:opacity-75" />
                            )}

                            <div className={`relative rounded-3xl border p-7 h-full flex flex-col ${
                                tier.highlight
                                    ? 'border-accent/50 bg-primary-surface pricing-card-glow'
                                    : 'border-border bg-primary-surface'
                            }`}>
                                <h3 className="text-xl font-bold text-text-primary font-display mb-3">{tier.name}</h3>

                                <div className="mb-2">
                                    {tier.id === 'trimestral' && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm text-text-quaternary line-through">$30 USD (3 × $10)</span>
                                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">−10%</span>
                                        </div>
                                    )}
                                    {tier.id === 'anual' && (
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm text-text-quaternary line-through">$120 USD (12 × $10)</span>
                                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">−60%</span>
                                        </div>
                                    )}
                                    {tier.id === 'mensual' && <div className="mb-1 h-5" />}

                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className={`font-black ${tier.highlight ? 'text-accent' : 'text-text-primary'}`}
                                            style={{ fontSize: 'clamp(40px, 5vw, 52px)', lineHeight: 1 }}
                                        >
                                            ${tier.perMonthUSD}
                                        </span>
                                        <span className="text-text-tertiary text-sm ml-1">USD/mes</span>
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-1">{tier.billedAs}</p>
                                    <p className="text-xs text-text-quaternary mt-0.5">≈ ${tier.perMonthARS.toLocaleString('es-AR')} ARS/mes*</p>
                                </div>

                                {tier.savings && (
                                    <div className={`my-4 px-4 py-2.5 rounded-xl text-sm font-medium ${
                                        tier.highlight
                                            ? 'bg-accent/15 border border-accent/30 text-accent'
                                            : 'bg-primary-bg border border-border text-text-secondary'
                                    }`}>
                                        {tier.id === 'trimestral' ? (
                                            <span>🎁 Pago único de <strong>3 meses</strong> · {tier.savings.label}</span>
                                        ) : tier.id === 'anual' ? (
                                            <span>🔥 Pago único de <strong>12 meses</strong> · {tier.savings.label}</span>
                                        ) : (
                                            <span>✓ {tier.savings.label} vs plan mensual</span>
                                        )}
                                    </div>
                                )}

                                <p className="text-sm text-text-secondary mb-5">{tier.description}</p>

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

                <div className="mt-10 mx-auto max-w-3xl text-center space-y-3 scroll-reveal">
                    <p className="text-xs text-text-quaternary">
                        * El equivalente en pesos es aproximado y se actualiza según la cotización del dólar al momento de la facturación.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-sm text-text-tertiary">
                            <Zap className="h-4 w-4 text-accent" />
                            Pago único, sin suscripción
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-tertiary">
                            <Shield className="h-4 w-4 text-accent" />
                            24 hs luego de la compra
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-tertiary">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            Todo incluido en cada plan
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


/* ─────────────────────────────────────────────
   FAQ
───────────────────────────────────────────── */

function FAQSection() {
    return (
        <section id="faq" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeader
                    tag="Dudas frecuentes"
                    icon={CheckCircle2}
                    headline="Preguntas frecuentes"
                    subline="Las preguntas que más nos hacen los entrenadores."
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
                <SectionTag icon={MessageCircle} label="Contacto" />
                <h2
                    className="font-bold tracking-tight text-text-primary font-display mb-6"
                    style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                >
                    ¿Querés ahorrar horas de trabajo entregando rutinas? Escribime.
                </h2>
                <p className="mt-4 text-lg text-text-secondary mb-10">
                    Contanos sobre tu negocio y te mostramos cómo funciona BaseRutina para vos. Te respondemos enseguida.
                </p>
                <a
                    href="https://wa.me/5492996086076"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-500/20"
                >
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Escribir por WhatsApp
                </a>
                <p className="mt-6 text-sm text-text-quaternary">
                    Sin bots. Hablás directo con Álvaro.
                </p>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */

function FinalCTASection({ onScrollTo }) {
    return (
        <section
            className="relative w-full overflow-hidden cta-gradient-banner noise-overlay"
            style={{ padding: 'var(--space-section) 0' }}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(91,179,160,0.15) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(123,213,185,0.09) 0%, transparent 70%)' }}
                />
            </div>

            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <div className="relative mx-auto max-w-4xl px-6 text-center">
                <h2
                    className="text-white font-bold tracking-tight font-display scroll-reveal"
                    style={{ fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
                >
                    Dejá de escribir rutinas desde cero.{' '}
                    <span className="bg-gradient-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-transparent">
                        Empezá hoy.
                    </span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-lg text-white/70 leading-relaxed scroll-reveal reveal-delay-1">
                    Dejá de empezar las rutinas desde cero. Con BaseRutina podés generar la base de cualquier plan en minutos.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 scroll-reveal reveal-delay-2">
                    <button
                        onClick={() => onScrollTo('contact')}
                        className="btn-hero-primary group inline-flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-accent text-primary-bg font-bold text-base w-full sm:w-auto"
                    >
                        <Sparkles className="h-5 w-5 flex-shrink-0" />
                        Crear mi primera rutina
                        <ArrowRight className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                        onClick={() => onScrollTo('pricing')}
                        className="group inline-flex items-center justify-center h-14 px-8 rounded-xl border border-white/25 text-white/80 hover:border-accent/50 hover:text-white font-semibold text-base transition-all w-full sm:w-auto"
                    >
                        Ver planes
                    </button>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 scroll-reveal reveal-delay-3">
                    {[
                        { icon: Shield,       text: 'Tus datos no se guardan en ningún servidor' },
                        { icon: Clock,        text: 'Primera rutina en menos de 5 minutos' },
                        { icon: CheckCircle2, text: 'Cancelás cuando querás' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/60">
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary-bg">
                                <Zap className="h-4 w-4" />
                            </div>
                            <span className="text-text-primary font-bold text-lg font-display">BaseRutina</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            Generá la base de tus rutinas con IA. Ajustá con tu criterio. Entregá PDFs que tus clientes van a confiar.
                        </p>
                        <p className="mt-4 text-xs text-text-quaternary">Hecho para entrenadores. Por entrenadores.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-4">Producto</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Beneficios', action: () => onScrollTo('benefits') },
                                { label: 'Cómo funciona', action: () => onScrollTo('how-it-works') },
                                { label: 'Planes y precios', action: () => onScrollTo('pricing') },
                                { label: 'Preguntas frecuentes', action: () => onScrollTo('faq') },
                            ].map(link => (
                                <li key={link.label}>
                                    <button onClick={link.action} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Escribir por WhatsApp', action: () => onScrollTo('contact') },
                                { label: 'Soporte', action: () => onScrollTo('contact') },
                                { label: 'Privacidad', action: () => {} },
                            ].map(link => (
                                <li key={link.label}>
                                    <button onClick={link.action} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border space-y-4">
                    <p className="text-xs text-text-quaternary leading-relaxed max-w-3xl">
                        Las métricas mostradas son estimaciones basadas en flujos de programación manual típicos.
                        Los resultados reales pueden variar según el estilo de coaching y la complejidad de cada cliente.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs text-text-quaternary">© 2026 BaseRutina. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-2 text-xs text-text-quaternary">
                            <Shield className="h-3.5 w-3.5 text-accent" />
                            Tus datos nunca salen de tu navegador
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
            <PainPointsSection />
            <BenefitsSection />
            <ServicesSection />
            <EditorStepsSection onScrollTo={scrollToSection} />
            <PricingSection onScrollTo={scrollToSection} />
            <FAQSection />
            <ContactSection />
            <FinalCTASection onScrollTo={scrollToSection} />
            <Footer onScrollTo={scrollToSection} />
        </div>
    );
}
