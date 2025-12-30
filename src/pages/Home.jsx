/**
 * GRIND LAB - Landing Page
 * "IA como cerebro externo"
 * Landing técnica, profesional, sin bullshit marketinero
 */

import { useNavigate } from 'react-router-dom';
import {
    Sparkles, Zap, Code, FileDown, ArrowRight, Dumbbell,
    Settings, Copy, CheckCircle2, XCircle, Brain,
    Users, GraduationCap, Wrench, Terminal
} from 'lucide-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';

export default function Home() {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-primary-bg">
            {/* ===== HERO SECTION ===== */}
            <div className="relative min-h-screen flex items-center overflow-hidden border-b border-border">
                {/* DotGrid Background - Interactive dots (subtle) */}
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

                {/* Vertical gradient overlay - Enhances text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/20 via-transparent to-primary-bg/80 z-[1]" />

                {/* Center spotlight - Focuses attention */}
                <div className="absolute inset-0 z-[1]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
                </div>

                {/* Hero Content - Centered composition */}
                <div className="relative z-10 w-full mx-auto max-w-5xl px-6 py-32 sm:py-40">

                    {/* Badge Pill - "What's new" style */}
                    <div className="flex justify-center mb-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
                            <Brain className="h-4 w-4" />
                            <span>IA como entrenador de alto rendimiento</span>
                        </div>
                    </div>

                    {/* Main Headline - Maximum 2 lines */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Diseña rutinas con IA.{' '}
                            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                                Ejecuta con precisión.
                            </span>
                        </h1>

                        {/* Subheadline - Technical but clear */}
                        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Convierte prompts en rutinas editables. Sin APIs pagas, sin vendor lock-in. Control total del JSON.
                        </p>

                        {/* CTAs - Centered horizontal */}
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
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-base px-8 h-12 border-text-tertiary/30 hover:border-text-secondary/50"
                            >
                                Ver cómo funciona
                            </Button>
                        </div>

                        {/* Technical metadata - Subtle */}
                        <div className="flex items-center justify-center gap-2 text-sm text-text-quaternary pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Code className="h-4 w-4" />
                            <span className="hidden sm:inline">JSON editable</span>
                            <span className="text-text-quaternary">•</span>
                            <span>Export PDF</span>
                            <span className="text-text-quaternary">•</span>
                            <span className="hidden sm:inline">Open source</span>
                            <span className="sm:hidden">OSS</span>
                        </div>

                        {/* Interaction hint - Appears on desktop only */}
                        <div className="hidden md:block pt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <p className="text-xs text-text-quaternary uppercase tracking-wider">
                                llevate al siguiente nivel →
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom fade - Smooth transition to content */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-bg to-transparent z-[1]" />
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
                                        <Settings className="h-6 w-6" />
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
                                        <Copy className="h-6 w-6" />
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
                                        <FileDown className="h-6 w-6" />
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

            {/* ===== COMPARISON TABLE ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        ¿Por qué este enfoque es superior?
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Control total sin costos recurrentes
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-2xl border border-border bg-primary-surface">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary-surface-alt">
                                    <tr className="border-b border-border">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                                            Aspecto
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-muted">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-4 w-4 text-error" />
                                                API Tradicional
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Prompt-to-JSON
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr className="hover:bg-primary-bg/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">Costo</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">$20-100/mes en APIs</td>
                                        <td className="px-6 py-4 text-sm text-accent font-medium">$0 (usa IA gratuita)</td>
                                    </tr>
                                    <tr className="hover:bg-primary-bg/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">Control</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">Black box</td>
                                        <td className="px-6 py-4 text-sm text-accent font-medium">JSON editable</td>
                                    </tr>
                                    <tr className="hover:bg-primary-bg/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">Portabilidad</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">Lock-in a proveedor</td>
                                        <td className="px-6 py-4 text-sm text-accent font-medium">Exportable universalmente</td>
                                    </tr>
                                    <tr className="hover:bg-primary-bg/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">Privacidad</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">Datos en servidores externos</td>
                                        <td className="px-6 py-4 text-sm text-accent font-medium">Todo local</td>
                                    </tr>
                                    <tr className="hover:bg-primary-bg/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-white">Flexibilidad</td>
                                        <td className="px-6 py-4 text-sm text-text-muted">Limitado a API</td>
                                        <td className="px-6 py-4 text-sm text-accent font-medium">Cambia de IA cuando quieras</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-8">
                        <p className="text-text-secondary text-center leading-relaxed">
                            <span className="text-white font-medium">"No pagamos millones en APIs para que tú pagues suscripciones.</span>
                            {' '}Usamos el poder de la IA gratuita + ingeniería de prompts de élite.
                            El resultado: <span className="text-accent font-medium">tú tienes control total</span>,
                            nosotros te damos las herramientas."
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== SPLIT VIEW DEMO ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                        <Zap className="h-4 w-4" />
                        Feature principal
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Editor Split-View
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Como Markmap o JSON Editor, pero para rutinas
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    {/* Visual Demo */}
                    <div className="rounded-2xl border border-border bg-primary-surface overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
                            {/* Left Panel - JSON Editor */}
                            <div className="p-6 bg-neutral-900">
                                <div className="flex items-center gap-2 mb-4">
                                    <Code className="h-4 w-4 text-accent" />
                                    <span className="text-sm font-mono text-text-secondary">JSON Editor</span>
                                </div>
                                <div className="rounded-lg bg-black/40 p-4 font-mono text-sm">
                                    <pre className="text-text-secondary">
                                        <span className="text-accent">{'{'}</span>{'\n'}
                                        {'  '}<span className="text-white">"name"</span>: <span className="text-success">"Rutina Push/Pull"</span>,{'\n'}
                                        {'  '}<span className="text-white">"weeks"</span>: [{'\n'}
                                        {'    {'}{'\n'}
                                        {'      '}<span className="text-white">"name"</span>: <span className="text-success">"Semana 1"</span>,{'\n'}
                                        {'      '}<span className="text-white">"days"</span>: [...]{'\n'}
                                        {'    }'}{'\n'}
                                        {'  '}]{'\n'}
                                        <span className="text-accent">{'}'}</span>
                                    </pre>
                                    <div className="mt-3 flex items-center gap-2 text-xs">
                                        <CheckCircle2 className="h-3 w-3 text-success" />
                                        <span className="text-success">JSON válido</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Preview */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="h-4 w-4 text-accent" />
                                    <span className="text-sm font-mono text-text-secondary">Preview en Vivo</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="rounded-lg border border-border bg-primary-bg p-4">
                                        <h4 className="text-sm font-semibold text-white mb-2">Semana 1</h4>
                                        <div className="space-y-2">
                                            <div className="text-xs text-text-secondary">
                                                <span className="text-accent">└</span> Día 1 - Push
                                            </div>
                                            <div className="text-xs text-text-muted ml-4">
                                                <span className="text-accent">├</span> Press Banca: 4x8-10
                                            </div>
                                            <div className="text-xs text-text-muted ml-4">
                                                <span className="text-accent">└</span> Press Inclinado: 3x10-12
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features list */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <Zap className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">Preview en tiempo real</h4>
                                <p className="text-xs text-text-muted">Debounce de 500ms para performance óptima</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">Validación no bloqueante</h4>
                                <p className="text-xs text-text-muted">Errores de sintaxis se muestran sin bloquear edición</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Code className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-1">Syntax highlighting</h4>
                                <p className="text-xs text-text-muted">Editor Monaco-style para máxima claridad</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== PROMPT MAESTRO SECTION ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                        <Terminal className="h-4 w-4" />
                        Ingeniería de prompts de élite
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Prompt Maestro
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        ~250 líneas de instrucciones precisas
                    </p>
                </div>

                <div className="mx-auto max-w-5xl space-y-8">
                    {/* What it contains */}
                    <div className="rounded-2xl border border-border bg-primary-surface p-8">
                        <h3 className="text-xl font-semibold text-white mb-6 font-display">¿Qué contiene el Prompt Maestro?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-accent/10 text-accent text-xs font-mono">1</div>
                                <span className="text-sm text-text-secondary">Contexto del cliente (género, objetivo, nivel)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-accent/10 text-accent text-xs font-mono">2</div>
                                <span className="text-sm text-text-secondary">Estructura JSON exacta esperada</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-accent/10 text-accent text-xs font-mono">3</div>
                                <span className="text-sm text-text-secondary">Reglas según objetivo (volumen/fuerza/pérdida)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-accent/10 text-accent text-xs font-mono">4</div>
                                <span className="text-sm text-text-secondary">Técnicas avanzadas (FST-7, Drop Sets, etc.)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-accent/10 text-accent text-xs font-mono">5</div>
                                <span className="text-sm text-text-secondary">Validaciones para evitar outputs inválidos</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-accent/10 text-accent text-xs font-mono">6</div>
                                <span className="text-sm text-text-secondary">Periodización entre semanas</span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-error/30 bg-error/5 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <XCircle className="h-5 w-5 text-error" />
                                <h4 className="text-sm font-semibold text-white">Prompt estándar</h4>
                            </div>
                            <div className="rounded-lg bg-black/20 p-3 font-mono text-xs text-text-muted">
                                "Crea una rutina de 4 días para volumen muscular"
                            </div>
                            <p className="mt-3 text-xs text-text-muted">Output genérico, sin estructura, inconsistente</p>
                        </div>

                        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="h-5 w-5 text-accent" />
                                <h4 className="text-sm font-semibold text-white">GRIND LAB Prompt Maestro</h4>
                            </div>
                            <div className="rounded-lg bg-black/20 p-3 font-mono text-xs text-text-secondary">
                                ACTÚA COMO ENTRENADOR EXPERTO.<br />
                                Genera JSON válido con esta estructura:<br />
                                {'{ name, metadata, weeks: [...] }'}<br />
                                <br />
                                Para Volumen Muscular:<br />
                                - Sets: 3-5, Reps: 8-12, RIR: 1-2<br />
                                [... +200 líneas de instrucciones]
                            </div>
                            <p className="mt-3 text-xs text-accent font-medium">Rutina profesional, estructurada, consistente</p>
                        </div>
                    </div>

                    {/* Benefit callout */}
                    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
                        <p className="text-text-secondary leading-relaxed">
                            <span className="text-white font-medium">La IA recibe instrucciones perfectas.</span>
                            {' '}Resultado: <span className="text-accent font-medium">rutinas profesionales</span>, no outputs genéricos.
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== USE CASES ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        ¿Para quién es GRIND LAB?
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Profesionales que valoran control y criterio
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Trainers */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <Users className="h-8 w-8 text-accent mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-3 font-display">
                                    Entrenadores Personales
                                </h3>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Genera bases de rutinas para clientes en segundos</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Ajusta con criterio profesional en el editor</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Exporta PDFs con tu branding</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Students */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <GraduationCap className="h-8 w-8 text-accent mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-3 font-display">
                                    Estudiantes de CCAFYDE
                                </h3>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Aprende estructura de periodización profesional</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Experimenta con variables (RIR, tempo, volumen)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Valida conocimientos con IA de vanguardia</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Power Users */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <Wrench className="h-8 w-8 text-accent mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-3 font-display">
                                    Power Users
                                </h3>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Crea rutinas exactas sin formularios interminables</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Exporta JSON para integrar en tus sistemas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Control total sobre cada variable</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Developers */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                            <div className="relative rounded-2xl border border-border bg-primary-surface p-8 h-full">
                                <Terminal className="h-8 w-8 text-accent mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-3 font-display">
                                    Developers Curiosos
                                </h3>
                                <ul className="space-y-2 text-sm text-text-secondary">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Ejemplo de ingeniería de prompts avanzada</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Aprende a estructurar outputs de LLMs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                        <span>Inspecciona el código (open source)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
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
                            ¿Listo para crear con criterio profesional?
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
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => window.open('https://github.com/Perez-Alvaro/grind-lab', '_blank')}
                                className="text-base px-8"
                            >
                                <Terminal className="mr-2 h-5 w-5" />
                                Ver documentación
                            </Button>
                        </div>

                        {/* Social proof */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Sin backend</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>100% gratuito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Open source</span>
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
                            <Dumbbell className="h-6 w-6 text-accent" />
                            <span className="text-lg font-bold text-white font-display">GRIND LAB</span>
                        </div>
                        <p className="text-center text-sm text-text-muted max-w-2xl">
                            Herramienta de ingeniería de prompts para crear rutinas de entrenamiento.
                            IA como cerebro externo. JSON editable. Export profesional.
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
        </div >
    );
}
