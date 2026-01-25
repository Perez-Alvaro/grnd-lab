/**
 * HomeSaaS.jsx
 * Landing page para GRIND LAB - Editor de rutinas con IA
 * Enfoque: Productividad para entrenadores personales
 */

import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Clock, Users, DollarSign, Calendar, CreditCard,
    BarChart3, Smartphone, CheckCircle2, ArrowRight, Zap,
    FileText, Bell, Target, Award, Shield, Headphones, Sparkles, Brain
} from 'lucide-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';
import FAQ from '../components/ui/FAQ';
import { useState } from 'react';

export default function HomeSaaS() {
    const navigate = useNavigate();
    const [openFAQ, setOpenFAQ] = useState(null);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-primary-bg">
            {/* ===== HERO SECTION ===== */}
            <div className="relative min-h-screen flex items-center overflow-hidden border-b border-border">
                {/* Background */}
                <div className="absolute inset-0 z-0 opacity-30">
                    <DotGrid
                        dotSize={6}
                        gap={20}
                        baseColor="#1a1a24"
                        activeColor="#2d2d3d"
                        proximity={120}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                </div>

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/20 via-transparent to-primary-bg/80 z-[1]" />
                <div className="absolute inset-0 z-[1]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 w-full mx-auto max-w-5xl px-6 py-32 sm:py-40">
                    {/* Badge */}
                    <div className="flex justify-center mb-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
                            <Brain className="h-4 w-4" />
                            <span>Editor de rutinas con IA para entrenadores profesionales</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Diseña rutinas con IA.{' '}
                            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                                Aumenta tu productividad.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Editor de rutinas potenciado por IA para entrenadores personales.
                            Crea, edita y exporta rutinas profesionales en minutos, no horas.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <Button
                                size="lg"
                                onClick={() => navigate('/editor')}
                                className="group text-base px-8 h-12 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Empezar a crear
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => scrollToSection('features')}
                                className="text-base px-8 h-12 border-text-tertiary/30 hover:border-text-secondary/50"
                            >
                                Ver cómo funciona
                            </Button>
                        </div>

                        {/* Trust signals */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-quaternary pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Editor con IA integrada</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Export a PDF profesional</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>JSON editable</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-bg to-transparent z-[1]" />
            </div>

            {/* ===== PAIN POINTS ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        ¿Te suena familiar?
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Los problemas de crear rutinas manualmente
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Clock,
                                title: 'Horas perdidas',
                                description: 'Crear una rutina desde cero te toma 2-3 horas. Entre planificar semanas, días, ejercicios, series y repeticiones.'
                            },
                            {
                                icon: FileText,
                                title: 'Excel y Word',
                                description: 'Plantillas desactualizadas, copiar-pegar ejercicios, formatear PDFs manualmente. Un proceso tedioso y repetitivo.'
                            },
                            {
                                icon: Brain,
                                title: 'Fatiga mental',
                                description: 'Pensar en progresiones, periodización, volumen... para cada cliente. Tu cerebro se agota antes de entrenar.'
                            },
                            {
                                icon: Smartphone,
                                title: 'PDFs poco profesionales',
                                description: 'Exportas desde Excel o Word. El resultado se ve amateur. Tus clientes merecen algo mejor.'
                            }
                        ].map((pain, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-error/10 to-error/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                                <div className="relative rounded-2xl border border-border bg-primary-surface p-6 h-full">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error/10 text-error mb-4">
                                        <pain.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 font-display">
                                        {pain.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {pain.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== OUTCOMES ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                        <TrendingUp className="h-4 w-4" />
                        Resultados reales
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Qué logran los entrenadores con GRIND LAB
                    </h2>
                </div>

                <div className="mx-auto max-w-5xl space-y-6">
                    {[
                        {
                            icon: Clock,
                            headline: 'De 3 horas a 15 minutos por rutina',
                            description: 'La IA genera la estructura base. Tú ajustas con tu criterio profesional. Exporta a PDF premium en un clic.',
                            metric: '-90% tiempo'
                        },
                        {
                            icon: Brain,
                            headline: 'IA como cerebro externo',
                            description: 'Prompt Maestro con 250+ líneas de instrucciones. La IA entiende periodización, RIR, volumen. Tú mantienes el control.',
                            metric: 'Criterio profesional'
                        },
                        {
                            icon: Sparkles,
                            headline: 'JSON editable en tiempo real',
                            description: 'Editor split-view. Cambias el JSON, ves el resultado al instante. Sin APIs pagas, sin vendor lock-in.',
                            metric: 'Control total'
                        },
                        {
                            icon: Award,
                            headline: 'PDFs profesionales que impresionan',
                            description: 'Diseño premium, estructura clara, branding personalizable. Tus clientes perciben el valor inmediatamente.',
                            metric: '+Imagen profesional'
                        }
                    ].map((outcome, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8">
                                <div className="flex items-start gap-6">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <outcome.icon className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2 font-display">
                                            {outcome.headline}
                                        </h3>
                                        <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                            {outcome.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono font-medium">
                                            {outcome.metric}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== FEATURES ===== */}
            <div id="features" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Características del editor
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Todo lo que necesitas para crear rutinas profesionales
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'Prompt Maestro IA',
                                description: '250+ líneas de instrucciones optimizadas. La IA entiende periodización, RIR, volumen y progresiones.',
                                solves: 'Outputs genéricos'
                            },
                            {
                                icon: Sparkles,
                                title: 'Editor Split-View',
                                description: 'JSON editable a la izquierda, preview en tiempo real a la derecha. Cambios instantáneos, validación no bloqueante.',
                                solves: 'Edición a ciegas'
                            },
                            {
                                icon: FileText,
                                title: 'Export PDF Premium',
                                description: 'PDFs profesionales con diseño moderno. Versión desktop y mobile. Branding personalizable.',
                                solves: 'PDFs amateur'
                            },
                            {
                                icon: Zap,
                                title: 'Sin APIs pagas',
                                description: 'Usa ChatGPT, Claude o Gemini gratis. Sin vendor lock-in, sin costos recurrentes. Control total.',
                                solves: 'Dependencia de APIs'
                            },
                            {
                                icon: CheckCircle2,
                                title: 'JSON Estructurado',
                                description: 'Formato estándar, portable, versionable. Exporta e importa rutinas. Integra con tus sistemas.',
                                solves: 'Formatos propietarios'
                            },
                            {
                                icon: Target,
                                title: 'Metadatos Completos',
                                description: 'Objetivo, nivel, frecuencia, duración. La IA genera rutinas contextualizadas para cada cliente.',
                                solves: 'Rutinas genéricas'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                                <div className="relative rounded-2xl border border-border bg-primary-surface p-6 h-full">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 font-display">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                                        {feature.description}
                                    </p>
                                    <div className="text-xs text-text-muted">
                                        <span className="text-accent">→</span> Resuelve: {feature.solves}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== HOW IT WORKS ===== */}
            <div id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                        <Brain className="h-4 w-4" />
                        IA como cerebro externo
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        ¿Cómo funciona?
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        4 pasos. Sin complejidad innecesaria.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-6xl">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-mono text-accent">PASO 1</span>
                                            <h3 className="text-xl font-semibold text-white font-display">
                                                Configura tu rutina
                                            </h3>
                                        </div>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            Completa los metadatos: objetivo, nivel, frecuencia.
                                            GRIND LAB genera un <span className="text-white font-medium">Prompt Maestro</span> optimizado
                                            con instrucciones precisas para la IA.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-mono text-accent">PASO 2</span>
                                            <h3 className="text-xl font-semibold text-white font-display">
                                                Copia el Prompt
                                            </h3>
                                        </div>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            Botón <span className="text-white font-medium">"Copiar Prompt para IA"</span>.
                                            Un solo clic. Listo para pegar en tu IA favorita.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-mono text-accent">PASO 3</span>
                                            <h3 className="text-xl font-semibold text-white font-display">
                                                IA genera el JSON
                                            </h3>
                                        </div>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            Pega en ChatGPT, Claude o Gemini <span className="text-accent font-medium">(gratis)</span>.
                                            La IA devuelve un <span className="text-white font-medium">JSON estructurado</span> con
                                            tu rutina completa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-mono text-accent">PASO 4</span>
                                            <h3 className="text-xl font-semibold text-white font-display">
                                                Edita y exporta
                                            </h3>
                                        </div>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            Pega el JSON en el editor. Ve cambios <span className="text-white font-medium">en tiempo real</span>.
                                            Ajusta lo que necesites. Exporta a <span className="text-white font-medium">PDF profesional</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== PRICING ===== */}
            <div id="pricing" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                        <DollarSign className="h-4 w-4" />
                        Inversión inteligente
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Inversión: $0. <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">Retorno: ilimitado.</span>
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Acceso completo al editor de rutinas con IA. Sin costos ocultos, sin límites artificiales.
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    {/* Main Pricing Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent-light to-accent rounded-3xl opacity-75 group-hover:opacity-100 blur transition-all duration-300" />
                        <div className="relative rounded-3xl border-2 border-accent/30 bg-primary-surface p-8 sm:p-12">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                                    <Sparkles className="h-4 w-4" />
                                    Acceso Completo
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2 font-display">
                                    $0/mes — Para siempre
                                </h3>
                                <p className="text-text-secondary">
                                    Para entrenadores que valoran control, criterio profesional y cero dependencias.
                                </p>
                            </div>

                            {/* Price Display */}
                            <div className="text-center mb-10">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-6xl font-bold text-white">$0</span>
                                    <span className="text-2xl text-text-muted">/mes</span>
                                </div>
                                <p className="mt-2 text-sm text-accent font-medium">
                                    Sin tarjeta • Sin registro • Sin instalación
                                </p>
                            </div>

                            {/* Features - Benefit First */}
                            <div className="space-y-4 mb-10">
                                <h4 className="text-lg font-semibold text-white mb-6 font-display text-center">
                                    Qué obtenés con GRIND LAB:
                                </h4>
                                {[
                                    {
                                        icon: Clock,
                                        title: 'Ahorrás 2.5 horas por rutina',
                                        description: 'De 3 horas (Excel/Word) a 15 minutos con IA + editor.'
                                    },
                                    {
                                        icon: Brain,
                                        title: 'Prompt Maestro incluido',
                                        description: '250+ líneas optimizadas para outputs profesionales (periodización, RIR, volumen).'
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Editor split-view en tiempo real',
                                        description: 'JSON editable + preview instantáneo. Sin validación bloqueante.'
                                    },
                                    {
                                        icon: FileText,
                                        title: 'Exportá PDFs premium con tu branding',
                                        description: 'Diseño profesional (desktop + mobile). Personalizá logo, colores, nombre.'
                                    },
                                    {
                                        icon: Zap,
                                        title: 'Usá tu IA favorita gratis',
                                        description: 'ChatGPT, Claude, Gemini. Sin APIs pagas, sin vendor lock-in.'
                                    },
                                    {
                                        icon: TrendingUp,
                                        title: 'Rutinas ilimitadas',
                                        description: 'Sin caps mensuales, sin "upgrades" forzados. Creá todo lo que necesites.'
                                    },
                                    {
                                        icon: Shield,
                                        title: 'JSON portable y versionable',
                                        description: 'Exportá, importá, integrá con tus sistemas. Tus datos, tu control.'
                                    },
                                    {
                                        icon: CheckCircle2,
                                        title: 'Sin backend, sin riesgos',
                                        description: 'Todo funciona en tu navegador. Cero almacenamiento en servidores externos.'
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-colors">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white font-semibold mb-1">
                                                {item.title}
                                            </div>
                                            <div className="text-sm text-text-secondary leading-relaxed">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTAs */}
                            <div className="space-y-4">
                                {/* Primary CTA */}
                                <div className="text-center">
                                    <Button
                                        size="lg"
                                        onClick={() => navigate('/editor')}
                                        className="group text-base px-10 h-14 w-full sm:w-auto shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
                                    >
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Crear mi primera rutina ahora
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                    <p className="mt-3 text-xs text-text-muted">
                                        Sin registro • Sin tarjeta • Sin instalación<br />
                                        Empezás en menos de 60 segundos
                                    </p>
                                </div>

                                {/* Secondary CTA */}
                                <div className="text-center pt-2">
                                    <Button
                                        size="md"
                                        variant="outline"
                                        onClick={() => scrollToSection('how-it-works')}
                                        className="text-sm px-6 border-text-tertiary/30 hover:border-accent/50"
                                    >
                                        Ver ejemplo de PDF exportado
                                    </Button>
                                    <p className="mt-2 text-xs text-text-muted">
                                        Mirá cómo se ve una rutina profesional generada con GRIND LAB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini-Validadores (Trust Badges) */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Target,
                                title: 'Hecho para entrenadores',
                                description: 'Client-side, sin backend, sin vendor lock-in'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Sin límites artificiales',
                                description: 'Rutinas ilimitadas, exportación ilimitada, branding personalizable'
                            },
                            {
                                icon: Award,
                                title: 'PDFs que impresionan',
                                description: 'Diseño premium, estructura clara, formato mobile + desktop'
                            }
                        ].map((badge, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/10 to-accent/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                                <div className="relative rounded-xl border border-border bg-primary-surface p-6 text-center h-full">
                                    <div className="flex justify-center mb-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                            <badge.icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h5 className="text-white font-semibold mb-2 text-sm">
                                        {badge.title}
                                    </h5>
                                    <p className="text-xs text-text-secondary leading-relaxed">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ROI Calculator */}
                    <div className="mt-12 rounded-2xl border border-border bg-primary-surface/50 p-8">
                        <h4 className="text-xl font-semibold text-white mb-2 text-center font-display">
                            ¿Cuánto tiempo recuperás?
                        </h4>
                        <p className="text-sm text-text-secondary text-center mb-8">
                            Ejemplo estimado para un entrenador con 4 clientes nuevos/semana
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Before */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-error mb-4 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-error" />
                                    Excel/Word manual
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Tiempo por rutina:</span>
                                    <span className="text-white font-medium">3 horas</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Total semanal:</span>
                                    <span className="text-white font-medium">12 horas</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Valor hora ($30):</span>
                                    <span className="text-white font-medium">$360/semana</span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-border">
                                    <span className="text-text-secondary font-medium">Valor mensual:</span>
                                    <span className="text-error font-bold">$1,440</span>
                                </div>
                            </div>

                            {/* After */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-accent mb-4 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-accent" />
                                    GRIND LAB + IA
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Tiempo por rutina:</span>
                                    <span className="text-white font-medium">15 minutos</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Total semanal:</span>
                                    <span className="text-white font-medium">1 hora</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Diferencia:</span>
                                    <span className="text-white font-medium">-11 horas</span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-border">
                                    <span className="text-text-secondary font-medium">Ahorro mensual:</span>
                                    <span className="text-accent font-bold">$1,320</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-8 p-5 rounded-xl bg-accent/5 border border-accent/20">
                            <p className="text-sm text-text-secondary mb-2 text-center">
                                <span className="font-semibold text-white">Resultado:</span> Recuperás el equivalente a
                            </p>
                            <p className="text-3xl font-bold text-accent text-center mb-2">
                                44 horas/mes
                            </p>
                            <p className="text-sm text-text-secondary text-center leading-relaxed">
                                Tiempo que podés invertir en:
                            </p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                                    Entrenar más clientes
                                </span>
                                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                                    Mejorar tu servicio
                                </span>
                                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                                    Capacitarte o descansar
                                </span>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-6 p-4 rounded-lg bg-primary-bg/50 border border-border/50">
                            <p className="text-xs text-text-muted text-center leading-relaxed">
                                <span className="text-text-secondary font-medium">Estimación conservadora:</span> Basado en valor hora de $30 USD.
                                Tu ahorro depende de tu flujo de trabajo, cantidad de clientes y complejidad de rutinas.
                            </p>
                        </div>
                    </div>

                    {/* Zero Risk Guarantee */}
                    <div className="mt-12 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-transparent to-transparent p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/10 text-accent mb-4">
                                <Shield className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2 font-display">
                                Cero riesgo. Literalmente.
                            </h4>
                        </div>
                        <div className="max-w-2xl mx-auto space-y-3 text-sm text-text-secondary leading-relaxed">
                            <p>
                                <span className="text-white font-semibold">GRIND LAB es 100% gratuito</span> porque funciona completamente en tu navegador.
                                No hay backend, no hay servidores, no hay costos operativos que trasladarte.
                            </p>
                            <p>
                                Usás tu propia cuenta de <span className="text-white">ChatGPT/Claude/Gemini (gratis)</span>.
                                Tus rutinas se exportan a tu computadora.
                                Tus datos nunca salen de tu navegador.
                            </p>
                            <p className="text-accent font-medium">
                                No hay "letra chica" porque no hay nada que ocultar.
                            </p>
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="mt-16">
                        <h4 className="text-2xl font-bold text-white mb-8 text-center font-display">
                            Preguntas frecuentes
                        </h4>
                        <FAQ
                            items={[
                                {
                                    question: '¿Necesito pagar ChatGPT, Claude o Gemini?',
                                    answer: 'No. Las versiones gratuitas de ChatGPT, Claude y Gemini son suficientes. GRIND LAB genera el "Prompt Maestro" optimizado; vos lo copiás, lo pegás en tu IA favorita, y obtenés el JSON. No necesitás API keys ni suscripciones pagas.'
                                },
                                {
                                    question: '¿Qué pasa con mis datos y rutinas?',
                                    answer: 'Todo funciona en tu navegador (client-side). Tus rutinas no se almacenan en servidores externos. Cuando exportás a PDF o JSON, los archivos se descargan directamente a tu computadora. Cero almacenamiento en la nube, cero riesgos de privacidad.'
                                },
                                {
                                    question: '¿Puedo personalizar el branding del PDF?',
                                    answer: 'Sí. Podés agregar tu logo, nombre de entrenador, colores personalizados y metadatos del cliente. El PDF exportado se ve profesional, con diseño moderno y formato optimizado para mobile y desktop.'
                                },
                                {
                                    question: '¿Puedo exportar o importar el JSON?',
                                    answer: 'Totalmente. El JSON es portable y versionable. Podés exportarlo, guardarlo, importarlo en otra sesión, o integrarlo con tus propios sistemas. No hay vendor lock-in: tus datos son tuyos.'
                                },
                                {
                                    question: '¿Qué significa "sin backend" y por qué importa?',
                                    answer: 'Significa que GRIND LAB funciona 100% en tu navegador. No hay servidores, no hay bases de datos, no hay autenticación. Esto garantiza privacidad total, cero costos operativos (por eso es gratis), y cero dependencia de terceros.'
                                },
                                {
                                    question: '¿Qué pasa si el JSON tiene errores?',
                                    answer: 'El editor tiene validación no bloqueante: te muestra errores en tiempo real pero te deja seguir editando. Si la IA genera un JSON con formato incorrecto, podés corregirlo manualmente en el editor split-view y ver los cambios al instante.'
                                },
                                {
                                    question: '¿Habrá un plan pago en el futuro?',
                                    answer: 'No está en el roadmap. GRIND LAB es sostenible como herramienta gratuita porque no tiene costos de backend ni APIs pagas. Si en el futuro agregamos features premium (ej: plantillas avanzadas, integraciones), el core siempre será gratis.'
                                },
                                {
                                    question: '¿Puedo usar GRIND LAB con mi sistema actual?',
                                    answer: 'Sí. El JSON exportado es estándar y portable. Podés integrarlo con tu CRM, app de clientes, o cualquier sistema que acepte JSON. No hay formatos propietarios ni dependencias.'
                                },
                                {
                                    question: '¿Funciona en mobile?',
                                    answer: 'El editor está optimizado para desktop (por el split-view JSON + preview). Pero los PDFs exportados tienen versión mobile optimizada, perfecta para que tus clientes los vean en el celular.'
                                },
                                {
                                    question: '¿Por qué es gratis si es tan bueno?',
                                    answer: 'Porque no tiene costos operativos. No hay backend, no hay servidores, no hay APIs pagas. Vos usás tu propia IA gratis. GRIND LAB es una herramienta de ingeniería de prompts + editor JSON, no un SaaS tradicional. Es gratis porque puede serlo.'
                                }
                            ]}
                            defaultOpen={0}
                        />
                    </div>
                </div>
            </div>

            {/* ===== FINAL CTA ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                <div className="relative isolate overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent px-6 py-24 text-center shadow-2xl sm:px-16">
                    {/* Gradient orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                            ¿Listo para crear con IA?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-text-secondary">
                            Sin registros. Sin pagos. Sin complicaciones.<br />
                            Solo tú, tu IA favorita, y GRIND LAB.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate('/editor')}
                                className="group text-base px-8"
                            >
                                <Sparkles className="mr-2 h-5 w-5" />
                                Ir al Editor
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>100% gratuito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Sin backend</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Control total del JSON</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-border">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <Brain className="h-6 w-6 text-accent" />
                            <span className="text-lg font-bold text-white font-display">GRIND LAB</span>
                        </div>
                        <p className="text-center text-sm text-text-muted max-w-2xl">
                            Editor de rutinas potenciado por IA para entrenadores personales.
                            Crea, edita y exporta rutinas profesionales con control total del JSON.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                            <span>© 2025 GRIND LAB</span>
                            <span>•</span>
                            <a href="https://github.com/Perez-Alvaro/grnd-lab" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
