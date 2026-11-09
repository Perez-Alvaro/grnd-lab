/**
 * HomeSaaS.jsx
 * Mock — Landing page SaaS optimizada para conversión
 * Audiencia: Entrenadores personales, coaches online, preparadores físicos
 * Principio: Claridad, producto real y cero "AI slop" (20 reglas de diseño)
 */

import {
    IconUsers, IconCircleCheck, IconArrowRight,
    IconBolt, IconSparkles,
    IconMenu2, IconX, IconMail,
    IconBuildingBank, IconHeadset,
    IconBarbell, IconFileText, IconCopy,
    IconFileSpreadsheet, IconAlertTriangle
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

const PROBLEM_POINTS = [
    {
        title: 'Tardes enteras perdidas en planillas',
        description: 'La rutina en un Excel, las comidas en un Word y mensajes dispersos en WhatsApp. Horas que perdés de entrenar, vender o descansar.',
    },
    {
        title: 'Archivos desprolijos que desvalorizan tu servicio',
        description: 'Capturas borrosas y tablas difíciles de leer en el celular del alumno que no reflejan la calidad ni el precio de lo que cobrás.',
    },
    {
        title: 'Techo operativo por falta de tiempo',
        description: 'Llegás a un límite donde cada alumno nuevo te satura la semana, obligándote a frenar tu crecimiento o descuidar la atención personalizada.',
    },
];

const SOLUTION_POINTS = [
    {
        icon: IconBarbell,
        title: 'Rutinas y nutrición sincronizadas en minutos',
        description: 'Armás ambos planes en un solo flujo rápido: series, repeticiones, descansos, calorías y recetas reales adaptadas a Argentina.',
    },
    {
        icon: IconFileText,
        title: 'PDF profesional listo para WhatsApp con tu marca',
        description: 'Exportás un documento impecable con tu logo y colores, perfectamente legible en el celular del alumno y listo para enviar en un clic.',
    },
    {
        icon: IconSparkles,
        title: 'Escalá tu negocio sin duplicar horas de trabajo',
        description: 'Al resolver la base mecánica en 5 minutos por alumno, podés atender el doble de alumnos brindando un seguimiento de mayor valor.',
    },
];

const EDITOR_STEPS = [
    {
        number: '01',
        icon: IconUsers,
        title: 'Respondé las preguntas',
        description: 'Indicá edad, nivel de experiencia, lesiones, objetivo y disponibilidad semanal en un asistente ágil sin formularios eternos.',
        chips: ['Edad y nivel', 'Historial clínico', 'Objetivo principal', 'Días semanales'],
    },
    {
        number: '02',
        icon: IconCopy,
        title: 'Copiá y pegá en la IA que quieras',
        description: 'Con un solo clic copiás el prompt estructurado de Mock y lo pegás en ChatGPT, Claude o Gemini gratuitos. No necesitás pagar APIs ni suscripciones caras.',
        chips: ['ChatGPT', 'Claude', 'Gemini', '1 Clic para copiar'],
    },
    {
        number: '03',
        icon: IconSparkles,
        title: 'Volvé y pegá lo que te respondió tu IA y listo',
        description: 'Pegás la respuesta en Mock y tu plan se carga automáticamente en el editor interactivo: ajustás series, comidas y cargas con tu criterio y exportás el PDF con tu marca.',
        chips: ['Editor en vivo', 'Ajuste de cargas y gramos', 'PDF listo para WhatsApp'],
    },
];

const PRICING_TIERS = [
    {
        id: 'freemium',
        name: 'Plan Inicial',
        price: '$0',
        period: 'para siempre',
        billedAs: 'Sin tarjeta de crédito · Acceso inmediato',
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
        price: '$15.000',
        period: 'ARS / mes',
        billedAs: 'Pago mensual por transferencia bancaria · Sin renovación automática',
        description: 'Para entrenadores activos que necesitan programar sin límites de clientes.',
        cta: 'Elegir Pro Mensual',
        highlight: false,
        features: [
            'Rutinas y planes de entrenamiento ilimitados',
            'Planes nutricionales ilimitados para Argentina',
            'Atletas y alumnos ilimitados',
            'Tu marca personal en portada y encabezados (White-label)',
            'Lista de compras y guías de meal prep automáticas',
            'Soporte prioritario por email',
        ],
    },
    {
        id: 'pro_annual',
        name: 'Pro Anual',
        badge: 'Más elegido · Ahorrás 33%',
        price: '$120.000',
        period: 'ARS / año',
        equivalent: 'Equivale a $10.000 ARS/mes (4 meses gratis)',
        billedAs: 'Un único pago anual por transferencia bancaria · Ahorrás $60.000 ARS',
        description: 'La opción más conveniente para consolidar y profesionalizar tu negocio todo el año.',
        cta: 'Elegir Pro Anual',
        highlight: true,
        features: [
            'Todo lo incluido en Pro Mensual',
            'Rutinas, nutrición y atletas ilimitados',
            'Marca blanca completa en todos tus documentos PDF',
            'Acceso anticipado a nuevas funciones y plantillas',
            'Soporte VIP directo vía email',
            'Precio congelado por 12 meses',
        ],
    },
];

const FAQ_ITEMS = [
    {
        question: '¿Cómo funciona el plan gratuito inicial?',
        answer: 'Podés registrarte gratis sin ingresar tarjeta de crédito y armar hasta 3 rutinas completas con edición visual y exportación a PDF. Es ideal para que pruebes el flujo con tus atletas reales antes de decidir si querés pasar a un plan Pro.',
    },
    {
        question: '¿Qué medios de pago aceptan?',
        answer: 'Cobramos en pesos argentinos (ARS) mediante suscripción automática con Mercado Pago o por transferencia bancaria (CBU/CVU/Alias). Podés cancelar cuando quieras de forma transparente y sin costos ocultos.',
    },
    {
        question: '¿Puedo cancelar mi plan cuando quiera?',
        answer: 'Sí. Al operar por transferencia bancaria sin débitos automáticos, no hay sorpresas ni renovaciones forzadas. Tenés control total de cada mes que decidís renovar.',
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

function SectionHeader({ headline, subline }) {
    return (
        <div className="mx-auto max-w-2xl text-center mb-14 sm:mb-16 scroll-reveal">
            <h2
                className="font-bold tracking-tight text-text-primary font-display text-balance text-3xl sm:text-4xl"
                style={{ lineHeight: '1.15' }}
            >
                {headline}
            </h2>
            {subline && (
                <p className="mt-4 text-base sm:text-lg text-text-secondary text-balance leading-relaxed">
                    {subline}
                </p>
            )}
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
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
                scrolled
                    ? 'bg-primary-bg/95 backdrop-blur-md border-b border-border shadow-sm'
                    : 'bg-transparent'
            }`}
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <button
                        type="button"
                        className="flex items-center cursor-pointer text-left focus:outline-none"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Mock - Inicio"
                    >
                        <img
                            src="/mz-logo-mark.PNG"
                            alt="Mock"
                            className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply"
                        />
                    </button>

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
                                    className="text-sm rounded-lg"
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
                    <div className="px-6 py-4 space-y-3">
                        {NAV_LINKS.map(link => (
                            <button
                                key={link.id}
                                onClick={() => { onScrollTo(link.id); setMobileOpen(false); }}
                                className="block w-full text-left text-sm text-text-secondary hover:text-text-primary transition-colors py-2"
                            >
                                {link.label}
                            </button>
                        ))}
                        <div className="pt-2 border-t border-border space-y-2">
                            {user ? (
                                <div className="text-sm text-text-secondary font-medium py-1">
                                    Sesión activa como <span className="text-text-primary font-semibold">{user.name}</span>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => { openLoginModal('signup'); setMobileOpen(false); }}
                                        className="w-full text-sm rounded-lg"
                                    >
                                        Crear cuenta
                                    </Button>
                                    <button
                                        onClick={() => { openLoginModal('login'); setMobileOpen(false); }}
                                        className="block w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors py-2"
                                    >
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
   HERO — Flujo centrado según boceto con fade in sencillo
───────────────────────────────────────────── */

function HeroSection({ onScrollTo, onSignup }) {
    return (
        <section className="relative overflow-hidden border-b border-border bg-primary-bg">
            {/* Grilla interactiva de puntos en tono más visible */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
                <DotGrid
                    dotSize={5} gap={22}
                    baseColor="var(--c-border-strong)" activeColor="var(--c-accent)"
                    proximity={120} shockRadius={220} shockStrength={4}
                    resistance={800} returnDuration={1.2}
                />
            </div>

            <div
                className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8"
                style={{ paddingTop: 'clamp(90px, 11vw, 130px)', paddingBottom: 'clamp(60px, 8vw, 90px)' }}
            >
                {/* 1. hero_title (Centrado superior) */}
                <div className="max-w-4xl mx-auto text-center scroll-reveal">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-3.5">
                        Software para entrenadores personales y coaches online
                    </p>

                    <h1
                        className="text-text-primary font-display font-extrabold tracking-tight text-balance text-4xl sm:text-5xl lg:text-6xl"
                        style={{ lineHeight: '1.08' }}
                    >
                        Armá rutinas y dietas profesionales en{' '}
                        <span className="text-accent">minutos, no horas</span>.
                    </h1>
                </div>

                {/* 2. editor (Visual central en el medio) */}
                <div className="mt-8 sm:mt-10 max-w-4xl mx-auto relative flex items-center justify-center scroll-reveal">
                    <div className="relative w-full flex items-center justify-center">
                        <img
                            src="/assets/editor.png"
                            alt="Editor interactivo de rutinas y planes nutricionales en Mock"
                            className="w-auto max-w-full max-h-[440px] sm:max-h-[500px] object-contain rounded-xl border border-border shadow-2xl"
                            loading="eager"
                        />

                        {/* Marco flotante: PDF listo para exportar y enviar por WhatsApp */}
                        <div className="hidden sm:flex absolute -bottom-4 sm:bottom-4 -left-2 sm:left-4 items-center gap-3 bg-primary-surface/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-xl max-w-[270px]">
                            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                <IconFileText stroke={1.75} className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-text-primary">PDF listo para exportar</p>
                                <p className="text-[11px] text-text-secondary leading-snug">Listo para enviar por WhatsApp</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. texto (Centrado debajo del editor) */}
                <div className="mt-8 max-w-2xl mx-auto text-center scroll-reveal">
                    <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                        Dejá de perder tardes enteras en planillas de Excel y audios de WhatsApp. Mock genera la base completa del entrenamiento y la alimentación de cada atleta; vos revisás con tu criterio técnico y entregás un PDF impecable con tu marca.
                    </p>
                </div>

                {/* 4. [CTA] [btn] (Centrados) */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5 scroll-reveal">
                    <button
                        onClick={onSignup}
                        className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-accent text-primary-bg font-bold text-base w-full sm:w-auto shadow-md shadow-accent/25 hover:bg-accent-light active:scale-[0.99] transition-all"
                    >
                        <span>Probar gratis 3 rutinas</span>
                        <IconArrowRight stroke={1.75} className="h-4 w-4 flex-shrink-0" />
                    </button>
                    <button
                        onClick={() => onScrollTo('how-it-works')}
                        className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-border bg-primary-surface text-text-secondary hover:text-text-primary hover:border-border-strong font-medium text-base transition-colors w-full sm:w-auto"
                    >
                        Ver cómo funciona
                    </button>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-text-secondary scroll-reveal">
                    <div className="flex items-center gap-1.5">
                        <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Sin tarjeta de crédito requerida</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <IconFileText stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>PDF con tu logo y tus colores</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <IconSparkles stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Compatible con ChatGPT, Claude y Gemini</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   PROBLEMA — 2 Columnas: Excel desordenado + 3 Bullets
───────────────────────────────────────────── */

function MessyExcelMockup() {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-white text-slate-800 select-none">
            {/* Barra superior estilo Excel */}
            <div className="bg-[#107c41] text-white px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                    <IconFileSpreadsheet stroke={1.75} className="h-4 w-4 flex-shrink-0 text-white" />
                    <span className="font-semibold text-xs truncate">
                        rutina_juan_martinez_FINAL_v3_revisada (1).xlsx
                    </span>
                </div>
                <div className="flex items-center gap-1.5 opacity-90 flex-shrink-0 text-[10px]">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="hidden sm:inline">Sin guardar</span>
                </div>
            </div>

            {/* Barra de fórmulas */}
            <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 text-[11px] font-mono text-slate-600">
                <span className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 font-semibold text-[10px]">
                    C5
                </span>
                <span className="text-slate-400 font-bold">fx</span>
                <span className="truncate text-slate-700">
                    =BUSCARV(B5, 'Dieta_2024'!$A$2:$E$50, 4, FALSO) + #¡REF!
                </span>
            </div>

            {/* Grilla de la planilla */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[460px] border-collapse font-sans text-[11px]">
                    <thead>
                        <tr className="bg-slate-100 text-slate-500 font-medium border-b border-slate-200 text-center">
                            <th className="w-7 py-1 border-r border-slate-200 bg-slate-200/60 font-mono text-[10px]">#</th>
                            <th className="py-1 px-2 border-r border-slate-200 text-left">A (Ejercicio)</th>
                            <th className="py-1 px-2 border-r border-slate-200">B (Series)</th>
                            <th className="py-1 px-2 border-r border-slate-200">C (Reps)</th>
                            <th className="py-1 px-2 border-r border-slate-200">D (Carga)</th>
                            <th className="py-1 px-2 text-left">E (Notas / WhatsApp)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {/* Fila 1: Título manual desordenado */}
                        <tr className="bg-amber-100/70 font-semibold text-amber-950">
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">1</td>
                            <td colSpan={5} className="px-2 py-1 text-[11px]">
                                RUTINA HIPERTROFIA Y FUERZA — NO TOCAR FORMULAS
                            </td>
                        </tr>

                        {/* Fila 2 */}
                        <tr>
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">2</td>
                            <td className="px-2 py-1 font-medium border-r border-slate-200">Press banca plano</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">4</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">8-10</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 font-semibold">80 kg</td>
                            <td className="px-2 py-1 text-slate-500 text-[10px]">calentar manguito rotador</td>
                        </tr>

                        {/* Fila 3 */}
                        <tr>
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">3</td>
                            <td className="px-2 py-1 font-medium border-r border-slate-200">Sentadilla libre</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">5</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">5</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 font-semibold">115 kg</td>
                            <td className="px-2 py-1">
                                <span className="bg-amber-200 text-amber-900 px-1 py-0.5 rounded text-[10px] font-semibold">
                                    ojo rodilla izquierda!
                                </span>
                            </td>
                        </tr>

                        {/* Fila 4: Error #¡REF! */}
                        <tr className="bg-red-50/50">
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">4</td>
                            <td className="px-2 py-1 font-medium border-r border-slate-200">Remo con barra</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">4</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">10</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 font-mono font-bold text-red-600 bg-red-100/70">
                                #¡REF!
                            </td>
                            <td className="px-2 py-1 text-slate-500 text-[10px]">falta confirmar carga</td>
                        </tr>

                        {/* Fila 5 */}
                        <tr>
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">5</td>
                            <td className="px-2 py-1 font-medium border-r border-slate-200">Press militar manc.</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">3</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">12</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 font-semibold">24 kg</td>
                            <td className="px-2 py-1 text-slate-500 text-[10px]">audio wsp 14/04 (¿subir a 26?)</td>
                        </tr>

                        {/* Fila 6: Error #¡VALOR! con dieta pegada a mano */}
                        <tr className="bg-red-50/50">
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">6</td>
                            <td className="px-2 py-1 font-medium border-r border-slate-200 text-slate-700">Dieta asociada</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 font-mono font-bold text-red-600 bg-red-100/70">
                                #¡VALOR!
                            </td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 text-slate-400">-</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 text-slate-400">-</td>
                            <td className="px-2 py-1">
                                <span className="bg-red-200 text-red-900 px-1 py-0.5 rounded text-[10px] font-bold">
                                    desactualizado (revisar)
                                </span>
                            </td>
                        </tr>

                        {/* Fila 7 */}
                        <tr>
                            <td className="text-center bg-slate-100 border-r border-slate-200 font-mono text-[10px] text-slate-400 py-1">7</td>
                            <td className="px-2 py-1 font-medium border-r border-slate-200">Cardio cinta</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">20 min</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200">LISS</td>
                            <td className="px-2 py-1 text-center border-r border-slate-200 text-slate-400">-</td>
                            <td className="px-2 py-1 text-slate-400 text-[10px]">nunca lo hace...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Pestañas inferiores de hojas desordenadas */}
            <div className="bg-slate-100 border-t border-slate-200 px-2 py-1.5 flex items-center gap-1 overflow-x-auto text-[11px]">
                <div className="bg-white border border-slate-300 border-b-white rounded-t px-2.5 py-0.5 font-bold text-[#107c41] flex items-center gap-1.5 flex-shrink-0 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#107c41]" />
                    <span>Rutina Juan</span>
                </div>
                <div className="bg-slate-200/70 border border-slate-300 rounded px-2 py-0.5 text-slate-500 flex-shrink-0">
                    Hoja 2 (copia)
                </div>
                <div className="bg-slate-200/70 border border-slate-300 rounded px-2 py-0.5 text-slate-500 flex-shrink-0">
                    Dieta_2024_vieja
                </div>
                <div className="bg-slate-200/70 border border-slate-300 rounded px-2 py-0.5 text-slate-500 flex-shrink-0">
                    alumnos_pendientes
                </div>
                <span className="text-slate-400 font-bold px-1">+</span>
            </div>

            {/* Badge flotante de advertencia */}
            <div className="hidden sm:flex absolute bottom-3 right-3 items-center gap-2 rounded-lg bg-red-600 text-white px-3 py-1.5 text-xs font-semibold shadow-xl border border-red-500">
                <IconAlertTriangle stroke={2} className="h-4 w-4 flex-shrink-0 text-amber-300" />
                <span>Imposible de leer en el celular del alumno</span>
            </div>
        </div>
    );
}

function PainPointsSection() {
    return (
        <section
            id="problema"
            className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border bg-primary-bg"
            style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
        >
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
                {/* Izquierda: Mockup de Excel desordenado */}
                <div className="lg:col-span-6 scroll-reveal">
                    <MessyExcelMockup />
                </div>

                {/* Derecha: 3 Bullets de Dolor del Entrenador */}
                <div className="lg:col-span-6 scroll-reveal">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-3">
                        El problema
                    </p>
                    <h2
                        className="font-bold tracking-tight text-text-primary font-display text-balance text-3xl sm:text-4xl"
                        style={{ lineHeight: '1.15' }}
                    >
                        El costo de seguir armando planes a mano
                    </h2>
                    <p className="mt-3 text-base text-text-secondary leading-relaxed">
                        El cuello de botella operativo que frena a los entrenadores independientes todos los meses.
                    </p>

                    <div className="mt-7 space-y-4">
                        {PROBLEM_POINTS.map((item, idx) => (
                            <div key={idx} className="rounded-xl border border-border bg-primary-surface p-4 flex items-start gap-3.5">
                                <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                                    <IconX stroke={2} className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-text-primary mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   SOLUCIÓN — 2 Columnas: Mockup sin fondo + 3 Bullets
───────────────────────────────────────────── */

function ServicesSection() {
    return (
        <section
            id="servicios"
            className="relative overflow-hidden border-b border-border bg-primary-bg"
            style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
        >
            {/* Fondo ilustrado herobg.png — tenue para máxima legibilidad */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25"
                style={{ backgroundImage: 'url(/assets/herobg.png)' }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
                    {/* Izquierda: Mockup transparente sin fondo */}
                    <div className="lg:col-span-5 flex items-center justify-center scroll-reveal">
                        <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
                            <img
                                src="/assets/paso-2.png"
                                alt="Mockup de planes de entrenamiento y nutrición unificados"
                                loading="lazy"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Derecha: 3 Bullets de Valor para Entrenadores */}
                    <div className="lg:col-span-7 scroll-reveal">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary mb-3">
                            La solución
                        </p>
                        <h2
                            className="font-bold tracking-tight text-text-primary font-display text-balance text-3xl sm:text-4xl"
                            style={{ lineHeight: '1.15' }}
                        >
                            Planes de entrenamiento y nutrición en un solo lugar
                        </h2>
                        <p className="mt-3 text-base text-text-secondary leading-relaxed">
                            Dejá de usar herramientas separadas. Mock genera la base completa del entrenamiento y la alimentación de cada atleta, bajo el mismo criterio técnico.
                        </p>

                        <div className="mt-7 space-y-4">
                            {SOLUTION_POINTS.map((item, idx) => {
                                const IconComponent = item.icon;
                                return (
                                    <div key={idx} className="rounded-xl border border-border bg-primary-surface/95 backdrop-blur-sm p-4 flex items-start gap-3.5 shadow-sm">
                                        <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                                            <IconComponent stroke={1.75} className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-text-primary mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   CÓMO FUNCIONA — 3 Pasos Directos
───────────────────────────────────────────── */

function StepMockup({ number }) {
    const chip = 'rounded-md border border-border bg-primary-bg px-2.5 py-1 text-xs text-text-secondary font-medium';
    const chipOn = 'rounded-md border border-accent bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent';
    const field = 'rounded-md border border-border bg-primary-bg px-3 py-2 text-xs text-text-secondary font-medium';

    if (number === '01') {
        return (
            <div className="flex flex-col gap-3">
                <div className="rounded-lg border border-border bg-primary-bg p-3">
                    <p className="text-xs font-semibold text-text-primary">Asistente ágil de perfil del alumno</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">Datos clave sin formularios interminables.</p>
                </div>
                <div className="flex gap-2">
                    <div className={`${field} w-24 tabular-nums`}>28 años</div>
                    <div className="flex-1 flex gap-1.5 flex-wrap">
                        <span className={chip}>Principiante</span>
                        <span className={chipOn}>Intermedio</span>
                        <span className={chip}>Avanzado</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex-1 flex gap-1.5 flex-wrap">
                        <span className={chipOn}>Hipertrofia</span>
                        <span className={chip}>Fuerza</span>
                        <span className={chip}>Déficit</span>
                    </div>
                    <span className="text-[11px] font-semibold text-accent px-2 py-1 bg-accent/10 rounded-md border border-accent/20">
                        4 días/sem
                    </span>
                </div>
            </div>
        );
    }

    if (number === '02') {
        return (
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-text-primary">Elegí tu modelo favorito</p>
                    <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Gratis sin API Key</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center justify-center py-2 rounded-md border border-accent bg-accent/10 text-xs font-bold text-accent">
                        ChatGPT
                    </div>
                    <div className="flex items-center justify-center py-2 rounded-md border border-border bg-primary-bg text-xs font-medium text-text-secondary">
                        Claude
                    </div>
                    <div className="flex items-center justify-center py-2 rounded-md border border-border bg-primary-bg text-xs font-medium text-text-secondary">
                        Gemini
                    </div>
                </div>
                <div className="rounded-lg border border-dashed border-accent/30 bg-accent/5 p-3 flex items-center justify-between">
                    <div className="truncate pr-2">
                        <p className="text-xs font-mono text-text-primary truncate">Prompt estructurado listo...</p>
                        <p className="text-[11px] text-text-secondary">Incluye reglas de gramos, series y periodización</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent text-primary-bg font-bold text-xs px-2.5 py-1.5 flex-shrink-0">
                        <IconCopy stroke={2} className="h-3.5 w-3.5" />
                        <span>Copiar</span>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between rounded-md border border-border bg-primary-bg px-3 py-2">
                <span className="text-xs font-bold text-text-primary">Plan cargado en el editor interactivo</span>
                <span className="text-xs text-accent font-semibold tabular-nums">4 semanas</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-border bg-primary-bg p-2.5">
                    <p className="font-semibold text-text-primary mb-1">Entrenamiento</p>
                    <p className="text-[11px] text-text-secondary">Empuje / Tracción / Piernas</p>
                </div>
                <div className="rounded-md border border-border bg-primary-bg p-2.5">
                    <p className="font-semibold text-text-primary mb-1">Nutrición</p>
                    <p className="text-[11px] text-text-secondary">2.650 kcal · Gramos + Porciones</p>
                </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-accent/25 bg-accent/10 px-3 py-2 text-accent text-xs font-semibold">
                <IconCircleCheck stroke={1.75} className="h-4 w-4 flex-shrink-0" />
                <span>PDF con tu logo listo para WhatsApp</span>
            </div>
        </div>
    );
}

function EditorStepsSection() {
    return (
        <section
            id="how-it-works"
            className="mx-auto max-w-7xl px-6 lg:px-8 border-b border-border bg-primary-bg"
            style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
        >
            <SectionHeader
                headline="De la consulta al PDF en 3 pasos directos"
                subline="Mock arma la base técnica, tu IA favorita genera la propuesta y vos ajustás todo con tu criterio profesional."
            />

            <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16">
                {EDITOR_STEPS.map((step, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={step.number}
                            className={`grid items-center gap-8 lg:grid-cols-12 lg:gap-14 scroll-reveal ${
                                !isEven ? 'lg:grid-flow-dense' : ''
                            }`}
                        >
                            {/* Visual Mockup */}
                            <div className={`lg:col-span-6 ${!isEven ? 'lg:col-start-7' : ''}`}>
                                <div className="rounded-xl border border-border bg-primary-surface p-4 shadow-sm">
                                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border text-xs text-text-tertiary">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-accent tabular-nums text-sm">Paso {step.number}</span>
                                            <span className="text-text-primary font-medium">· Editor Mock</span>
                                        </div>
                                        <step.icon stroke={1.75} className="h-4 w-4 text-text-secondary" />
                                    </div>
                                    <StepMockup number={step.number} />
                                </div>
                            </div>

                            {/* Text Description */}
                            <div className={`lg:col-span-6 ${!isEven ? 'lg:col-start-1' : ''}`}>
                                <div className="flex items-center gap-2 text-accent font-bold text-sm mb-2 tabular-nums">
                                    <span>0{index + 1}</span>
                                    <span>/ 03</span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-text-primary font-display text-balance mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-base text-text-secondary leading-relaxed mb-5">
                                    {step.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {step.chips.map((chip, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-2.5 py-1 rounded-md bg-primary-surface border border-border text-text-secondary font-medium"
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}


/* ─────────────────────────────────────────────
   PRICING — Clear, High-Contrast, Honest
───────────────────────────────────────────── */

function PricingSection({ onSelectPlan, onSignup }) {
    return (
        <section id="pricing" className="border-b border-border bg-primary-bg" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <SectionHeader
                    headline="Elegí el plan para tu volumen de atletas"
                    subline="Empezá gratis con 3 rutinas completas. Pasate a Pro cuando necesites planificar sin límites."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch scroll-reveal">
                    {PRICING_TIERS.map((tier) => {
                        const isAnnual = tier.id === 'pro_annual';
                        const isFreemium = tier.id === 'freemium';

                        return (
                            <div
                                key={tier.id}
                                className={`relative rounded-2xl flex flex-col justify-between transition-all overflow-hidden ${
                                    tier.highlight
                                        ? 'border-2 border-accent bg-primary-surface shadow-xl'
                                        : 'border border-border bg-primary-surface'
                                }`}
                            >
                                {tier.highlight && (
                                    <div className="w-full bg-accent text-white text-center py-2.5 px-4 text-xs font-bold tracking-wider uppercase">
                                        {tier.badge}
                                    </div>
                                )}

                                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-text-primary font-display">
                                            {tier.name}
                                        </h3>
                                        <p className="text-sm text-text-secondary mt-1.5 min-h-[40px] leading-relaxed">
                                            {tier.description}
                                        </p>

                                        {/* Price Container */}
                                        <div className="mt-5 pb-5 border-b border-border">
                                            <div className="flex items-baseline gap-2">
                                                <span
                                                    className={`font-black font-display tracking-tight tabular-nums ${
                                                        tier.highlight ? 'text-accent' : 'text-text-primary'
                                                    }`}
                                                    style={{ fontSize: 'clamp(32px, 4vw, 40px)', lineHeight: 1 }}
                                                >
                                                    {tier.price}
                                                </span>
                                                <span className="text-text-secondary text-sm font-semibold">
                                                    {tier.period}
                                                </span>
                                            </div>
                                            {tier.equivalent && (
                                                <p className="text-xs font-semibold text-accent mt-2">
                                                    {tier.equivalent}
                                                </p>
                                            )}
                                            <p className="text-xs text-text-tertiary mt-1.5 leading-normal">
                                                {tier.billedAs}
                                            </p>
                                        </div>

                                        {/* Features List */}
                                        <ul className="space-y-3 text-sm text-text-primary my-6">
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
                                                className="w-full rounded-lg font-semibold border-border hover:border-text-primary"
                                            >
                                                {tier.cta}
                                            </Button>
                                        ) : isAnnual ? (
                                            <Button
                                                variant="accent"
                                                size="lg"
                                                onClick={() => onSelectPlan(tier.id)}
                                                className="w-full rounded-lg font-bold shadow-md shadow-accent/25"
                                            >
                                                <span>{tier.cta}</span>
                                                <IconArrowRight stroke={1.75} className="ml-1.5 h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => onSelectPlan(tier.id)}
                                                className="w-full rounded-lg font-bold border-accent text-accent hover:bg-accent/10"
                                            >
                                                {tier.cta}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Badges */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary scroll-reveal">
                    <div className="flex items-center gap-1.5">
                        <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent" />
                        <span>Sin tarjeta para empezar</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <IconBuildingBank stroke={1.75} className="h-4 w-4 text-accent" />
                        <span>Cobro en pesos (ARS) por transferencia bancaria</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <IconHeadset stroke={1.75} className="h-4 w-4 text-accent" />
                        <span>Sin suscripción automática ni ataduras</span>
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
        <section id="faq" className="border-b border-border bg-primary-bg" style={{ padding: 'var(--space-section) 0' }}>
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
   FINAL CTA — High Contrast, Clean, No Slop
───────────────────────────────────────────── */

function FinalCTASection({ onSignup }) {
    return (
        <section className="border-b border-border bg-primary-surface" style={{ padding: 'var(--space-section) 0' }}>
            <div className="mx-auto max-w-4xl px-6 text-center">
                <h2
                    className="text-text-primary font-bold tracking-tight font-display text-balance scroll-reveal text-3xl sm:text-4xl lg:text-5xl"
                    style={{ lineHeight: 1.12 }}
                >
                    Dejá de armar planes desde cero.{' '}
                    <span className="text-accent">Empezá hoy</span>.
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-text-secondary leading-relaxed scroll-reveal">
                    Con Mock, la rutina y la nutrición de cada cliente salen de la misma herramienta. Probalo con tu próximo cliente gratis.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 scroll-reveal">
                    <button
                        onClick={onSignup}
                        className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg bg-accent text-primary-bg font-bold text-base w-full sm:w-auto shadow-md shadow-accent/25 hover:bg-accent-light active:scale-[0.99] transition-all"
                    >
                        <span>Crear mi primer plan gratis</span>
                        <IconArrowRight stroke={1.75} className="h-4 w-4 flex-shrink-0" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const email = atob('cGVyZXphbHZhcm9yYXVsMjZAZ21haWwuY29t');
                            window.location.href = `mailto:${email}`;
                        }}
                        className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg border border-border bg-primary-bg text-text-secondary hover:text-text-primary hover:border-border-strong font-medium text-base transition-colors w-full sm:w-auto"
                    >
                        <IconMail stroke={1.75} className="h-4 w-4 flex-shrink-0 text-accent" />
                        <span>Contacto por email</span>
                    </button>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary scroll-reveal">
                    <div className="flex items-center gap-1.5">
                        <IconCircleCheck stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>3 rutinas gratis sin tarjeta</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <IconBuildingBank stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Cobro en pesos (ARS)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <IconHeadset stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                        <span>Soporte directo por email</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

function FooterEmailButton() {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);

    const getEmail = () => atob('cGVyZXphbHZhcm9yYXVsMjZAZ21haWwuY29t');

    if (!revealed) {
        return (
            <button
                type="button"
                onClick={() => setRevealed(true)}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2 text-left group"
                title="Mostrar email de contacto"
            >
                <IconMail stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="underline decoration-dotted underline-offset-4">Ver email de contacto</span>
            </button>
        );
    }

    const email = getEmail();
    const handleCopy = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <a
                href={`mailto:${email}`}
                className="text-sm text-accent hover:underline inline-flex items-center gap-2 font-mono break-all"
            >
                <IconMail stroke={1.75} className="h-4 w-4 text-accent flex-shrink-0" />
                <span>{email}</span>
            </a>
            <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-text-tertiary hover:text-text-primary text-left inline-flex items-center gap-1"
            >
                <IconCopy stroke={1.75} className="h-3 w-3" />
                <span>{copied ? '¡Copiado!' : 'Copiar email'}</span>
            </button>
        </div>
    );
}

function Footer({ onScrollTo, onOpenPrivacy }) {
    return (
        <footer className="bg-primary-bg border-t border-border">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-4">
                            <img
                                src="/mz-logo-mark.PNG"
                                alt="Mock"
                                className="h-8 sm:h-9 w-auto object-contain mix-blend-multiply"
                            />
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
                            Planes de entrenamiento y nutrición en una sola herramienta. La base la hace la IA; el criterio lo ponés vos.
                        </p>
                        <p className="mt-3 text-xs text-text-tertiary">Hecho para entrenadores. Por entrenadores.</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Navegación</h4>
                        <ul className="space-y-2.5">
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
                        <h4 className="text-sm font-semibold text-text-primary mb-3">Contacto</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <FooterEmailButton />
                            </li>
                            <li>
                                <button
                                    onClick={onOpenPrivacy}
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left"
                                >
                                    Privacidad y términos
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-tertiary">
                    <p>© {new Date().getFullYear()} Mock. Todos los derechos reservados.</p>
                    <p>Planes de entrenamiento y nutrición profesionales · Mock</p>
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
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach(t => observer.observe(t));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-primary-bg selection:bg-accent/20 selection:text-text-primary">
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
