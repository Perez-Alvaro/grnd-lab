/**
 * HomeSaaS.jsx
 * Mock — Landing page SaaS optimizada para conversión
 * Audiencia: Entrenadores personales, coaches online, preparadores físicos
 * Posicionamiento: herramienta integral — rutina + nutrición del mismo cliente
 * Idioma: Español Argentina (vos)
 * Copy: claro, directo, humano — beneficios concretos, sin jerga de IA
 */

import {
    IconUsers, IconCircleCheck, IconArrowRight,
    IconBolt, IconTarget, IconSparkles, IconChevronDown,
    IconStar, IconMenu2, IconX, IconMessageCircle,
    IconCalendar, IconBuildingBank, IconHeadset,
    IconBarbell, IconSalad
} from '@tabler/icons-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';
import FAQ from '../components/ui/FAQ';
import PrivacyModal from '../components/Legal/PrivacyModal.jsx';
import UserMenu from '../components/navbar/UserMenu.jsx';
import { useAuth } from '../store/authStore.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SELECTED_PLAN_KEY } from '../lib/subscriptions.js';

/* ─────────────────────────────────────────────
   DATA CONSTANTS
───────────────────────────────────────────── */

const NAV_LINKS = [
    { label: 'Qué hace', id: 'servicios' },
    { label: 'Cómo funciona', id: 'how-it-works' },
    { label: 'Precios', id: 'pricing' },
    { label: 'Preguntas', id: 'faq' },
];

// Problema → solución en la misma tarjeta: antes eran dos secciones espejo
// (4 dolores + 4 beneficios) que decían lo mismo dos veces.
const PAIN_POINTS = [
    {
        title: 'Se te va la tarde armando un plan',
        description: 'La rutina por un lado, las comidas por el otro. Horas que perdés de entrenar, vender o descansar.',
        solution: 'Con Mock, rutina y nutrición salen de una sola sesión de trabajo.',
        image: 'https://images.pexels.com/photos/5717789/pexels-photo-5717789.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Entrenador trabajando de noche frente a la computadora',
    },
    {
        title: 'Excel, Word y capturas por WhatsApp',
        description: 'Tus clientes reciben planillas desprolijas que no se parecen a lo que cobrás.',
        solution: 'Entregás un PDF prolijo con tu nombre, igual para el gimnasio y la dieta.',
        image: 'https://images.pexels.com/photos/8297058/pexels-photo-8297058.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Planillas de cálculo en pantalla',
    },
    {
        title: 'Cada cliente nuevo son más horas',
        description: 'Llegás a un techo y terminás diciéndole que no a gente que quiere entrenar con vos.',
        solution: 'Al armar menos a mano, entran más clientes en las mismas horas.',
        image: 'https://images.pexels.com/photos/6455927/pexels-photo-6455927.jpeg?auto=compress&cs=tinysrgb&w=800',
        imageAlt: 'Entrenador personal acompañando a una clienta en el gimnasio',
    },
];


// 4 pasos del editor con imágenes — reemplaza StatsDeckSection
const EDITOR_STEPS = [
    {
        number: '01',
        icon: IconUsers,
        label: 'Tu cliente',
        title: 'Describí a tu cliente',
        description: 'Respondé preguntas simples sobre tu cliente: edad, experiencia, historial de lesiones, disponibilidad. Sin formularios complicados.',
        detail: ['Edad', 'Nivel', 'Historial', 'Disponibilidad'],
        highlight: false,
    },
    {
        number: '02',
        icon: IconTarget,
        label: 'Objetivo y método',
        title: 'Especificá el objetivo y el método',
        description: 'Elegís el objetivo principal — fuerza, hipertrofia, pérdida de grasa — y el método de entrenamiento que mejor le va a tu cliente.',
        detail: ['Fuerza', 'Hipertrofia', 'Cardio', 'Funcional'],
        highlight: false,
    },
    {
        number: '03',
        icon: IconCalendar,
        label: 'Estructura',
        title: 'Ingresá las semanas y los días',
        description: 'Definís cuántas semanas dura el programa y cuántos días por semana entrena. Mock arma la estructura automáticamente.',
        detail: ['Semanas', 'Días por semana', 'Distribución'],
        highlight: false,
    },
    {
        number: '04',
        icon: IconSparkles,
        label: 'Generación con IA',
        title: 'Generá la base de tu planificación',
        description: 'Con un clic copiás el prompt que arma Mock, lo pegás en la IA que ya usás y traés la rutina o el plan nutricional completo, listo para editar y exportar.',
        detail: ['ChatGPT', 'Claude', 'Gemini', 'PDF'],
        highlight: true,
    },
];


const PRICING_TIERS = [
    {
        id: 'freemium',
        name: 'Plan Inicial',
        badge: 'Gratis para siempre',
        price: '$0',
        period: 'para siempre',
        billedAs: 'Sin tarjeta de crédito · Empezás en 30 segundos',
        description: 'Probá Mock con tus primeros atletas y armá rutinas completas sin costo.',
        cta: 'Crear cuenta gratis',
        highlight: false,
        features: [
            '3 rutinas completas en el editor visual',
            'Planes de entrenamiento y nutrición',
            'Exportación a PDF estándar',
            'Compatible con ChatGPT, Claude y Gemini',
            'Acceso inmediato sin tarjeta',
        ],
    },
    {
        id: 'pro_monthly',
        name: 'Pro Mensual',
        badge: 'Flexibilidad total',
        price: '$15.000',
        period: 'ARS / mes',
        billedAs: 'Suscripción mensual vía Mercado Pago · Cancelás cuando quieras',
        description: 'Para entrenadores activos que necesitan programar sin límites de clientes.',
        cta: 'Elegir Pro Mensual',
        highlight: false,
        features: [
            'Rutinas y planes de entrenamiento ilimitados',
            'Planes nutricionales ilimitados para Argentina',
            'Atletas y alumnos ilimitados',
            'Tu marca personal en portada y encabezados (White-label)',
            'Lista de compras y guías de meal prep automáticas',
            'Soporte prioritario por WhatsApp',
        ],
    },
    {
        id: 'pro_annual',
        name: 'Pro Anual',
        badge: 'Más elegido · Ahorrás 33%',
        price: '$120.000',
        period: 'ARS / año',
        equivalent: 'Equivale a $10.000 ARS/mes (4 meses gratis)',
        billedAs: 'Un único pago anual vía Mercado Pago · Ahorrás $60.000 ARS',
        description: 'La opción más inteligente para consolidar y profesionalizar tu negocio todo el año.',
        cta: 'Elegir Pro Anual',
        highlight: true,
        features: [
            'Todo lo incluido en Pro Mensual',
            'Rutinas, nutrición y atletas ilimitados',
            'Marca blanca completa en todos tus documentos PDF',
            'Acceso anticipado a nuevas funciones y plantillas',
            'Soporte VIP directo vía WhatsApp',
            'Precio congelado por 12 meses',
        ],
    },
];

const FAQ_ITEMS = [
    {
        question: '¿Cómo funciona el plan gratuito (Freemium)?',
        answer: 'Podés registrarte gratis sin tarjeta de crédito y armar hasta 3 rutinas completas con edición visual y exportación a PDF. Es ideal para que pruebes el flujo con tus atletas reales antes de decidir si querés pasar a un plan Pro.',
    },
    {
        question: '¿Qué medios de pago aceptan?',
        answer: 'Cobramos en pesos argentinos (ARS) a través de Mercado Pago con tarjeta de débito, crédito o dinero en cuenta de Mercado Pago. Sin cargos por impuestos extranjeros ni cotizaciones de dólar tarjeta.',
    },
    {
        question: '¿Puedo cancelar mi suscripción cuando quiera?',
        answer: 'Sí. Si elegís el plan Pro Mensual podés cancelar con un solo clic desde tu panel cuando quieras. Tu acceso sigue activo hasta el último día del período ya abonado.',
    },
    {
        question: '¿Mis clientes ven la marca Mock o la mía?',
        answer: 'En los planes Pro podés configurar tu propio nombre o marca comercial para que aparezca destacado en la portada, encabezados y pie de página de los PDFs exportados.',
    },
    {
        question: '¿La nutrición está incluida en el mismo precio?',
        answer: 'Sí. Con el mismo plan armás tanto las rutinas de entrenamiento como los planes de comidas pensados para alimentos y compras de Argentina.',
    },
    {
        question: '¿Reemplaza mi criterio como entrenador?',
        answer: 'Para nada. Mock te ahorra el trabajo mecánico de tipear y diagramar. Vos revisás, corregís ejercicios, series o comidas con tu conocimiento técnico antes de entregar el plan.',
    },
];


/* ─────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────── */

function SectionTag({ icon: Icon, label }) {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            {Icon && <Icon stroke={1.75} className="h-4 w-4" />}
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

/* ─────────────────────────────────────────────
   SERVICIOS — Rutinas + Nutrición (dual offering)
───────────────────────────────────────────── */

const SERVICES = [
    {
        icon: IconBarbell,
        badge: 'Disponible',
        badgeClass: 'bg-accent/15 text-accent border-accent/25',
        // Foto propia: guardá la imagen como public/assets/rutinas.jpg.
        // Mientras no exista, imageFallback evita la imagen rota.
        image: '/assets/paso-1.png',
        imageFallback: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=1200',
        imageAlt: 'Dos atletas chocando el puño en el gimnasio',
        title: 'Planes de entrenamiento',
        desc: 'Armá la base de cualquier plan en minutos: fuerza, hipertrofia o pérdida de grasa. Vos ajustás cada detalle y lo exportás con tu marca.',
        points: ['Editor en vivo', 'Export a PDF profesional', 'Organizado por atleta'],
    },
    {
        icon: IconSalad,
        badge: 'Disponible',
        badgeClass: 'bg-accent/15 text-accent border-accent/25',
        image: '/assets/paso-2.png',
        imageAlt: 'Ensalada de quinoa con vegetales frescos',
        title: 'Planes nutricionales',
        desc: 'Planes de comida pensados para Argentina, con alimentos que se consiguen en el súper de tu zona. Con lista de compras, meal prep y tarjeta de heladera incluidos.',
        points: ['Alimentos locales y económicos', 'Lista de compras y meal prep', 'Cálculo calórico y macros por objetivo'],
    },
];

function ServicesSection() {
    return (
        <section
            id="servicios"
            className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 border-b border-border"
            style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
        >

            <div className="space-y-20 sm:space-y-24">
                {SERVICES.map((s, index) => {
                    const textFirst = index % 2 === 0;

                    const textBlock = (
                        <div className="max-w-xl">
                            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-medium text-accent">
                                <s.icon className="h-3.5 w-3.5" />
                                {s.badge}
                            </div>
                            <h3 className="mb-4 text-[clamp(1.9rem,4vw,3.5rem)] font-bold tracking-tight text-text-primary font-display leading-[0.98]">
                                {s.title}
                            </h3>
                            <p className="mb-8 max-w-lg text-lg leading-relaxed text-text-secondary">
                                {s.desc}
                            </p>
                            <ul className="grid gap-3 text-sm sm:grid-cols-2">
                                {s.points.map((p) => (
                                    <li key={p} className="flex items-center gap-2.5 text-text-secondary">
                                        <IconCircleCheck stroke={1.75} className="h-4 w-4 flex-shrink-0 text-accent" />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );

                    const imageBlock = (
                        <div className="relative mx-auto w-full max-w-[34rem]">
                            <img
                                src={s.image}
                                alt={s.imageAlt}
                                loading="lazy"
                                className="h-auto w-full object-contain drop-shadow-[0_32px_80px_rgba(0,0,0,0.42)]"
                                onError={(e) => {
                                    if (s.imageFallback && e.currentTarget.src !== s.imageFallback) {
                                        e.currentTarget.src = s.imageFallback;
                                    }
                                }}
                            />
                            <div className="pointer-events-none absolute inset-x-12 bottom-3 h-10 rounded-full bg-accent/10 blur-3xl" />
                        </div>
                    );

                    return (
                        <div key={s.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                            {textFirst ? textBlock : imageBlock}
                            {textFirst ? imageBlock : textBlock}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

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
                            <IconBolt stroke={1.75} className="h-4 w-4" />
                        </div>
                        <span className="text-text-primary font-bold text-lg tracking-tight font-display">Mock</span>
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
                        {mobileOpen ? <IconX stroke={1.75} className="h-5 w-5" /> : <IconMenu2 stroke={1.75} className="h-5 w-5" />}
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

function HeroSection({ onScrollTo, onSignup }) {
    return (
        <div className="relative min-h-screen flex items-center overflow-hidden border-b border-border">
            <div className="absolute inset-0 z-0 opacity-30">
                <DotGrid
                    dotSize={6} gap={20}
                    baseColor="var(--c-border-muted)" activeColor="var(--c-border-strong)"
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
                                <IconBolt stroke={1.75} className="h-4 w-4 flex-shrink-0" />
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
                            Armá rutinas y dietas profesionales en{' '}
                            <span className="bg-gradient-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-transparent">
                                minutos, no en horas.
                            </span>
                        </h1>

                        <p className="mt-6 text-xl sm:text-2xl text-text-secondary max-w-2xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed scroll-reveal reveal-delay-2">
                            Dejá de perder tardes enteras en planillas de Excel y audios de WhatsApp. Mock te genera la base completa del entrenamiento y la alimentación de cada atleta; vos revisás con tu criterio y entregás un PDF impecable con tu propia marca.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-10 scroll-reveal reveal-delay-3">
                            <button
                                onClick={onSignup}
                                className="btn-hero-primary group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-accent text-primary-bg font-bold text-base w-full sm:w-auto shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all"
                            >
                                Empezá gratis (3 rutinas sin cargo)
                                <IconArrowRight stroke={1.75} className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                onClick={() => onScrollTo('pricing')}
                                className="group inline-flex items-center justify-center h-14 px-8 rounded-xl border border-text-tertiary/30 text-text-secondary hover:border-accent/50 hover:text-text-primary font-semibold text-base transition-all w-full sm:w-auto"
                            >
                                Ver planes y precios
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-text-tertiary scroll-reveal reveal-delay-4">
                            Compatible con las herramientas que ya usás:{' '}
                            <span className="text-text-secondary font-medium">ChatGPT · Claude · Gemini</span>
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 scroll-reveal reveal-delay-4">
                            {[
                                '3 rutinas completas gratis para probar sin tarjeta',
                                'Rutina y plan de comidas en una sola herramienta',
                                'Exportación a PDF profesional con tu logo',
                            ].map((bullet, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                    <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                                    {bullet}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full max-w-[440px] mx-auto lg:ml-auto scroll-reveal reveal-delay-2">
                        <img
                            src="/assets/mobile.png"
                            alt="Vista móvil de Mock"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                <div className="mt-14 flex justify-center animate-bounce">
                    <IconChevronDown stroke={1.75} className="h-6 w-6 text-text-quaternary" />
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
            <SectionHeader headline="¿Te pasa esto?" />
            <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
                {PAIN_POINTS.map((pain, i) => (
                    <div
                        key={i}
                        className={`overflow-hidden rounded-md border border-border bg-primary-surface flex flex-col scroll-reveal reveal-delay-${i + 1}`}
                    >
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <img
                                src={pain.image}
                                alt={pain.imageAlt}
                                loading="lazy"
                                className="h-full w-full object-cover grayscale-[35%]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-surface via-primary-surface/40 to-transparent" />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                            <h3 className="text-lg font-bold text-text-primary mb-2 font-display leading-tight">{pain.title}</h3>
                            <p className="text-sm text-text-tertiary leading-relaxed flex-1">{pain.description}</p>
                            {/* La salida, en la misma tarjeta que el problema */}
                            <p className="mt-4 pt-4 border-t border-border flex items-start gap-2 text-sm text-text-secondary">
                                <IconCircleCheck stroke={1.75} className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                                {pain.solution}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   CÓMO FUNCIONA — 4 pasos
   Mobile-first: maqueta arriba, texto abajo en mobile
   Desktop: alternado izquierda / derecha
───────────────────────────────────────────── */

/**
 * Maqueta de la UI real de cada paso.
 *
 * Antes eran capturas PNG (/assets/paso-*.png) sacadas antes del rebrand:
 * mostraban la paleta violeta vieja y la marca "BaseRutina"/"Fitter" en una
 * landing que ya es Mock y teal. Como se dibujan con los mismos tokens que la
 * app, no se vuelven a desactualizar cuando cambia el design system.
 */
function StepMockup({ number }) {
    const chip = 'rounded-sm border border-border bg-primary-bg px-2.5 py-1 text-[11px] text-text-secondary';
    const chipOn = 'rounded-sm border border-accent bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent';
    const field = 'rounded-sm border border-border bg-primary-bg px-3 py-2 text-[11px] text-text-quaternary';

    if (number === '01') {
        return (
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-accent" />
                    <div className="flex-1 rounded-md rounded-tl-none border border-border bg-primary-bg px-3 py-2">
                        <p className="text-xs font-semibold text-text-primary">¿Qué edad tiene?</p>
                        <p className="text-[11px] text-text-tertiary">Para calcular su gasto energético.</p>
                    </div>
                </div>
                <div className={field}>28</div>
                <div className="flex gap-2">
                    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-accent" />
                    <div className="flex-1 rounded-md rounded-tl-none border border-border bg-primary-bg px-3 py-2">
                        <p className="text-xs font-semibold text-text-primary">¿Qué nivel de actividad tiene?</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className={chip}>Sedentario</span>
                    <span className={chipOn}>Moderado</span>
                    <span className={chip}>Muy activo</span>
                </div>
            </div>
        );
    }

    if (number === '02') {
        return (
            <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-text-primary">¿Cuál es el objetivo?</p>
                <div className="flex flex-wrap gap-2">
                    <span className={chipOn}>Hipertrofia</span>
                    <span className={chip}>Fuerza</span>
                    <span className={chip}>Pérdida de grasa</span>
                    <span className={chip}>Recomposición</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-text-primary">¿Querés un plan detallado o simple?</p>
                <div className="flex flex-wrap gap-2">
                    <span className={chip}>Simple (rápido)</span>
                    <span className={chipOn}>Detallado</span>
                </div>
            </div>
        );
    }

    if (number === '03') {
        return (
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-md border border-border bg-primary-bg px-3 py-2">
                    <span className="text-xs font-semibold text-text-primary">Semana 1</span>
                    <span className="font-mono text-[11px] text-text-tertiary">4 días</span>
                </div>
                {['Día 1 · Empuje', 'Día 2 · Tracción', 'Día 3 · Piernas'].map((d) => (
                    <div key={d} className="flex items-center justify-between rounded-sm border border-border px-3 py-2">
                        <span className="text-[11px] text-text-secondary">{d}</span>
                        <span className="font-mono text-[11px] text-accent">6 ej.</span>
                    </div>
                ))}
                <div className="rounded-sm border border-dashed border-border px-3 py-2 text-center text-[11px] font-semibold text-accent">
                    + Agregar día
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold text-text-primary">Abrí tu IA con el prompt listo</p>
            <div className="grid grid-cols-3 gap-2">
                {['ChatGPT', 'Claude', 'Gemini'].map((ia) => (
                    <div key={ia} className="flex flex-col items-center gap-1.5 rounded-sm border border-border bg-primary-bg py-2.5">
                        <div className="h-5 w-5 rounded-full bg-text-quaternary/30" />
                        <span className="text-[10px] font-semibold text-text-secondary">{ia}</span>
                    </div>
                ))}
            </div>
            <div className="rounded-sm bg-accent py-2.5 text-center text-xs font-bold text-primary-bg">
                Pegá lo que te dio la IA
            </div>
            <div className="flex items-center gap-2 rounded-sm border border-accent/25 bg-accent/10 px-3 py-2">
                <IconCircleCheck stroke={1.75} className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                <span className="text-[11px] text-text-secondary">Plan cargado. Revisalo y exportá el PDF.</span>
            </div>
        </div>
    );
}

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

                {/* Maqueta de la UI real, dibujada con los tokens de la app */}
                <div className="h-[calc(100%-44px)] overflow-hidden p-5">
                    <StepMockup number={step.number} />
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
                <h2
                    className="font-bold tracking-tight text-text-primary font-display"
                    style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                >
                    Cómo funciona
                </h2>
                <p className="mt-4 text-lg text-text-secondary">
                    Seguís los pasos y Mock arma todo. Vos ajustás los detalles.
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

function PricingSection({ onSelectPlan, onSignup }) {
    return (
        <section id="pricing" className="section-elevated-bg border-b border-border" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* Header Breve */}
                <div className="mx-auto max-w-2xl text-center mb-12 scroll-reveal">
                    <SectionTag icon={IconSparkles} label="Precios Transparentes" />
                    <h2
                        className="font-bold tracking-tight text-text-primary font-display"
                        style={{ fontSize: 'var(--text-h2)', lineHeight: '1.1' }}
                    >
                        Elegí el plan que mejor se adapte a{' '}
                        <span className="bg-gradient-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-transparent">
                            tu volumen de atletas.
                        </span>
                    </h2>
                    <p className="mt-3 text-base sm:text-lg text-text-secondary">
                        Empezá gratis con 3 rutinas completas. Pasate a Pro cuando necesites planificar sin límites.
                    </p>
                </div>

                {/* Grid 3 Tarjetas de Precios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch scroll-reveal">
                    {PRICING_TIERS.map((tier) => {
                        const isAnnual = tier.id === 'pro_annual';
                        const isFreemium = tier.id === 'freemium';

                        return (
                            <div
                                key={tier.id}
                                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                                    tier.highlight
                                        ? 'border-2 border-accent/70 bg-primary-surface shadow-2xl shadow-accent/15 pricing-card-glow'
                                        : 'border border-border-strong bg-primary-surface/80 hover:border-border-strong'
                                }`}
                            >
                                {/* Badge superior */}
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${
                                            tier.highlight
                                                ? 'text-primary-bg bg-accent shadow-md shadow-accent/40 font-black'
                                                : 'text-text-secondary bg-primary-bg border border-border'
                                        }`}
                                    >
                                        {tier.highlight && <IconStar stroke={1.75} className="h-3.5 w-3.5 fill-current flex-shrink-0" />}
                                        {tier.badge}
                                    </span>
                                </div>

                                <div>
                                    {/* Tier Title */}
                                    <h3 className="text-xl font-bold text-text-primary font-display mt-2">
                                        {tier.name}
                                    </h3>
                                    <p className="text-xs text-text-tertiary mt-1 min-h-[32px]">
                                        {tier.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mt-5 pb-5 border-b border-border">
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className={`font-black font-display tracking-tight ${
                                                    tier.highlight ? 'text-accent' : 'text-text-primary'
                                                }`}
                                                style={{ fontSize: 'clamp(36px, 5vw, 44px)', lineHeight: 1 }}
                                            >
                                                {tier.price}
                                            </span>
                                            <span className="text-text-secondary text-sm font-semibold">
                                                {tier.period}
                                            </span>
                                        </div>
                                        {tier.equivalent && (
                                            <p className="text-xs font-semibold text-accent mt-1.5">
                                                {tier.equivalent}
                                            </p>
                                        )}
                                        <p className="text-xs text-text-tertiary mt-1.5">
                                            {tier.billedAs}
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-3 text-sm text-text-secondary my-6 rounded-2xl bg-primary-bg/70 border border-border p-4 sm:p-5">
                                        {tier.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                                <span className="leading-snug">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    {isFreemium ? (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={onSignup}
                                            className="w-full border-border hover:border-accent/60 font-semibold"
                                        >
                                            {tier.cta}
                                        </Button>
                                    ) : isAnnual ? (
                                        <Button
                                            variant="accent"
                                            size="lg"
                                            onClick={() => onSelectPlan(tier.id)}
                                            className="w-full shadow-lg shadow-accent/30 hover:shadow-accent/50 font-bold"
                                        >
                                            {tier.cta}
                                            <IconArrowRight stroke={1.75} className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={() => onSelectPlan(tier.id)}
                                            className="w-full border-accent/40 text-accent hover:border-accent hover:bg-accent/10 font-bold"
                                        >
                                            {tier.cta}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Micro badges de confianza */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-text-tertiary scroll-reveal">
                    <div className="flex items-center gap-1.5">
                        <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent" />
                        <span>Sin tarjeta requerida para empezar</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <IconBuildingBank stroke={1.75} className="h-4 w-4 text-accent" />
                        <span>Cobro en pesos (ARS) vía Mercado Pago</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <IconHeadset stroke={1.75} className="h-4 w-4 text-accent" />
                        <span>Cancelación simple con 1 clic</span>
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
                <SectionHeader headline="Preguntas frecuentes" />
                <div className="mx-auto max-w-3xl scroll-reveal">
                    <FAQ items={FAQ_ITEMS} defaultOpen={0} />
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */

function FinalCTASection({ onSignup }) {
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
                    Dejá de armar planes desde cero.{' '}
                    <span className="bg-gradient-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-transparent">
                        Empezá hoy.
                    </span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-lg text-white/70 leading-relaxed scroll-reveal reveal-delay-1">
                    Con Mock, la rutina y la nutrición de cada cliente salen de la misma herramienta. Probalo con tu próximo cliente.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 scroll-reveal reveal-delay-2">
                    <button
                        onClick={onSignup}
                        className="btn-hero-primary group inline-flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-accent text-primary-bg font-bold text-base w-full sm:w-auto"
                    >
                        Crear mi primer plan
                        <IconArrowRight stroke={1.75} className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>
                    <a
                        href="https://wa.me/5492996086076"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl border border-white/25 text-white/80 hover:border-accent/50 hover:text-white font-semibold text-base transition-all w-full sm:w-auto"
                    >
                        <IconMessageCircle stroke={1.75} className="h-5 w-5 flex-shrink-0" />
                        Hablar con Álvaro
                    </a>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-6 scroll-reveal reveal-delay-3">
                    {[
                        { icon: IconCircleCheck,  text: '3 rutinas gratis sin tarjeta' },
                        { icon: IconBuildingBank, text: 'Cobro en pesos argentinos (ARS)' },
                        { icon: IconBolt,         text: 'Activación inmediata vía Mercado Pago' },
                        { icon: IconHeadset,     text: 'Soporte prioritario por WhatsApp' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                            <item.icon stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
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

function Footer({ onScrollTo, onOpenPrivacy }) {
    return (
        <footer className="border-t border-border bg-primary-bg">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary-bg">
                                <IconBolt stroke={1.75} className="h-4 w-4" />
                            </div>
                            <span className="text-text-primary font-bold text-lg font-display">Mock</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            Planes de entrenamiento y nutrición en una sola herramienta. La base la hace la IA; el criterio lo ponés vos.
                        </p>
                        <p className="mt-4 text-xs text-text-quaternary">Hecho para entrenadores. Por entrenadores.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-4">Producto</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Qué hace', action: () => onScrollTo('servicios') },
                                { label: 'Cómo funciona', action: () => onScrollTo('how-it-works') },
                                { label: 'Planes y precios', action: () => onScrollTo('pricing') },
                                { label: 'Preguntas frecuentes', action: () => onScrollTo('faq') },
                            ].map(link => (
                                <li key={link.label}>
                                    <button
                                        onClick={link.action}
                                        className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="https://wa.me/5492996086076"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                                >
                                    <IconMessageCircle stroke={1.75} className="h-4 w-4 text-accent" />
                                    WhatsApp: +54 9 299 608-6076
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={onOpenPrivacy}
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left"
                                >
                                    Privacidad
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-quaternary">
                        © {new Date().getFullYear()} Mock. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-text-quaternary">
                        Planes transparentes para entrenadores · Crece con Mock
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function HomeSaaS() {
    const { user, openLoginModal } = useAuth();
    const navigate = useNavigate();
    const [privacyOpen, setPrivacyOpen] = useState(false);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Flujo de suscripción: elegir plan → registrarse → pagar desde el panel.
    // Guardamos el plan elegido; el dashboard abre el modal de pago con él.
    const handleSelectPlan = (planId) => {
        localStorage.setItem(SELECTED_PLAN_KEY, planId);
        if (user) {
            navigate('/dashboard');
        } else {
            openLoginModal('signup');
        }
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
            <HeroSection onScrollTo={scrollToSection} onSignup={() => openLoginModal('signup')} />
            <PainPointsSection />
            <ServicesSection />
            <EditorStepsSection onScrollTo={scrollToSection} />
            <PricingSection onSelectPlan={handleSelectPlan} onSignup={() => openLoginModal('signup')} />
            <FAQSection />
            <FinalCTASection onSignup={() => openLoginModal('signup')} />
            <Footer onScrollTo={scrollToSection} onOpenPrivacy={() => setPrivacyOpen(true)} />
            <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        </div>
    );
}
