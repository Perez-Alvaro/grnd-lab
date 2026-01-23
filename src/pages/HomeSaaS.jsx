/**
 * HomeSaaS.jsx
 * Landing page B2B SaaS para entrenadores
 * Enfoque: Conversión, outcomes, escalabilidad
 */

import { useNavigate } from 'react-router-dom';
import {
    TrendingUp, Clock, Users, DollarSign, Calendar, CreditCard,
    BarChart3, Smartphone, CheckCircle2, ArrowRight, Zap,
    FileText, Bell, Target, Award, Shield, Headphones
} from 'lucide-react';
import { Button } from '../components/ui';
import DotGrid from '../components/ui/DotGrid';
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
                            <Target className="h-4 w-4" />
                            <span>Hecho para entrenadores que quieren escalar</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tighter animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Gestiona más clientes.{' '}
                            <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                                Sin perder el control.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Centraliza agenda, pagos y seguimiento de clientes en una plataforma
                            diseñada para entrenadores que quieren profesionalizar su negocio.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <Button
                                size="lg"
                                onClick={() => navigate('/signup')}
                                className="group text-base px-8 h-12 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all"
                            >
                                <Zap className="mr-2 h-5 w-5" />
                                Prueba gratis 14 días
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
                                <span>Sin tarjeta de crédito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Setup en 2 minutos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Cancela cuando quieras</span>
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
                        Los problemas de gestionar clientes manualmente
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: FileText,
                                title: 'Caos administrativo',
                                description: 'Excel para rutinas, notas en el móvil, WhatsApp para coordinar. Pierdes 10+ horas semanales buscando información.'
                            },
                            {
                                icon: DollarSign,
                                title: 'Pagos desordenados',
                                description: 'Transferencias sin confirmar, recordatorios olvidados, facturas pendientes. No sabes cuánto facturaste este mes.'
                            },
                            {
                                icon: Smartphone,
                                title: '5 apps abiertas',
                                description: 'Calendar + Excel + WhatsApp + Stripe + Notion. Cada herramienta resuelve una cosa, ninguna habla con las demás.'
                            },
                            {
                                icon: BarChart3,
                                title: 'Sin visibilidad',
                                description: '¿Cuántos clientes activos? ¿Tasa de retención? ¿Plan más rentable? No deberías calcularlo manualmente.'
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
                        Qué logran los entrenadores con nuestra plataforma
                    </h2>
                </div>

                <div className="mx-auto max-w-5xl space-y-6">
                    {[
                        {
                            icon: Users,
                            headline: 'De 20 a 100 clientes sin contratar',
                            description: 'Automatiza onboarding, recordatorios y seguimiento. Gestiona 5x más clientes con el mismo tiempo.',
                            metric: '+400% capacidad'
                        },
                        {
                            icon: Clock,
                            headline: '15h/semana → 5h/semana en admin',
                            description: 'Deja de perseguir pagos, confirmar sesiones y buscar datos. La plataforma hace el trabajo pesado por ti.',
                            metric: '-66% tiempo admin'
                        },
                        {
                            icon: Award,
                            headline: '+30% retención con seguimiento profesional',
                            description: 'Recordatorios automáticos, progreso visible, comunicación clara. Tus clientes se sienten atendidos.',
                            metric: 'MRR predecible'
                        },
                        {
                            icon: TrendingUp,
                            headline: 'De entrenador a negocio escalable',
                            description: 'Onboarding estructurado, facturación automática, reportes de progreso. Imagen premium.',
                            metric: '+25% precio/sesión'
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
                        Todo lo que necesitas para escalar
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Una plataforma completa para tu negocio
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: 'Gestión de Clientes',
                                description: 'Perfiles completos y organizados. Historial de sesiones, objetivos, métricas de progreso y notas en un solo lugar.',
                                solves: 'Información dispersa'
                            },
                            {
                                icon: Calendar,
                                title: 'Calendario y Sesiones',
                                description: 'Agenda inteligente con recordatorios automáticos. Tus clientes reservan, confirman y reprograman sin que intervengas.',
                                solves: 'Coordinación manual'
                            },
                            {
                                icon: CreditCard,
                                title: 'Facturación y Pagos',
                                description: 'Cobros automáticos con Stripe. Planes recurrentes, pagos por sesión, facturas generadas automáticamente.',
                                solves: 'Pagos desordenados'
                            },
                            {
                                icon: BarChart3,
                                title: 'Reportes y Métricas',
                                description: 'Dashboard con métricas de tu negocio. Ingresos, retención, clientes activos, sesiones. Todo en tiempo real.',
                                solves: 'Falta de visibilidad'
                            },
                            {
                                icon: Bell,
                                title: 'Onboarding Automatizado',
                                description: 'Nuevos clientes sin fricción. Formulario de bienvenida, firma de términos, configuración de pagos. Todo digital.',
                                solves: 'Proceso manual de alta'
                            },
                            {
                                icon: Smartphone,
                                title: 'App Móvil',
                                description: 'Gestiona desde cualquier lugar. iOS y Android. Tus clientes y tú tienen acceso completo desde el móvil.',
                                solves: 'Dependencia de desktop'
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

            {/* ===== PRICING ===== */}
            <div id="pricing" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Planes que escalan contigo
                    </h2>
                    <p className="mt-4 text-lg text-text-secondary">
                        Sin permanencia. Cambia o cancela cuando quieras.
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Starter */}
                        <div className="relative rounded-2xl border border-border bg-primary-surface p-8">
                            <h3 className="text-xl font-semibold text-white mb-2 font-display">Starter</h3>
                            <p className="text-sm text-text-secondary mb-6">Para empezar sin riesgo</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-text-muted">/mes</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Hasta 10 clientes activos</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Calendario básico</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Pagos manuales</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Soporte por email</span>
                                </li>
                            </ul>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/signup?plan=starter')}
                            >
                                Empezar gratis
                            </Button>
                            <p className="text-xs text-text-muted text-center mt-3">Sin tarjeta de crédito</p>
                        </div>

                        {/* Pro - Highlighted */}
                        <div className="relative rounded-2xl border-2 border-accent bg-primary-surface p-8 shadow-lg shadow-accent/10 scale-105">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className="px-4 py-1 rounded-full bg-accent text-white text-xs font-medium">
                                    RECOMENDADO
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 font-display">Pro</h3>
                            <p className="text-sm text-text-secondary mb-6">Para entrenadores profesionales</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$49</span>
                                <span className="text-text-muted">/mes</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Hasta 50 clientes activos</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Calendario + recordatorios automáticos</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Pagos automáticos con Stripe</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Reportes y métricas</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Onboarding automatizado</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Soporte prioritario</span>
                                </li>
                            </ul>
                            <Button
                                className="w-full"
                                onClick={() => navigate('/signup?plan=pro')}
                            >
                                Prueba gratis 14 días
                            </Button>
                            <p className="text-xs text-text-muted text-center mt-3">Plan más popular</p>
                        </div>

                        {/* Studio */}
                        <div className="relative rounded-2xl border border-border bg-primary-surface p-8">
                            <h3 className="text-xl font-semibold text-white mb-2 font-display">Studio</h3>
                            <p className="text-sm text-text-secondary mb-6">Para gimnasios y equipos</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">$149</span>
                                <span className="text-text-muted">/mes</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Hasta 200 clientes activos</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Multi-entrenador (hasta 5)</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Branding personalizado</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>API access</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Integraciones avanzadas</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-text-secondary">
                                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                    <span>Soporte dedicado</span>
                                </li>
                            </ul>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/contact?plan=studio')}
                            >
                                Agendar demo
                            </Button>
                            <p className="text-xs text-text-muted text-center mt-3">Personalización incluida</p>
                        </div>
                    </div>

                    {/* Pricing footer */}
                    <div className="mt-12 rounded-2xl border border-border bg-primary-surface p-6">
                        <p className="text-sm text-text-secondary text-center mb-4">Todos los planes incluyen:</p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-accent" />
                                <span>Datos encriptados (SSL)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Backups automáticos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>GDPR compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Actualizaciones gratuitas</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== TESTIMONIALS ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Entrenadores que ya escalaron su negocio
                    </h2>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                quote: 'Pasé de 15 a 60 clientes en 6 meses. La plataforma me dio el tiempo que necesitaba para enfocarme en entrenar, no en administrar. Ahora facturo 4x más con el mismo esfuerzo.',
                                author: 'María González',
                                role: 'Entrenadora Personal',
                                location: 'Madrid'
                            },
                            {
                                quote: 'Antes perdía 2-3 horas diarias en WhatsApp coordinando sesiones y persiguiendo pagos. Ahora todo es automático. Mis clientes están más contentos y yo menos estresado.',
                                author: 'Carlos Ruiz',
                                role: 'Coach de Rendimiento',
                                location: 'Barcelona'
                            },
                            {
                                quote: 'La diferencia es brutal. Pasé de Excel y notas en papel a tener todo centralizado. Mis clientes perciben el profesionalismo y están dispuestos a pagar más.',
                                author: 'Laura Martínez',
                                role: 'Entrenadora Online',
                                location: 'Valencia'
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                                <div className="relative rounded-2xl border border-border bg-primary-surface p-6 h-full">
                                    <p className="text-sm text-text-secondary leading-relaxed mb-6">
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="border-t border-border pt-4">
                                        <p className="text-sm font-semibold text-white">{testimonial.author}</p>
                                        <p className="text-xs text-text-muted">{testimonial.role}, {testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Entrenadores activos', value: '500+' },
                            { label: 'Clientes gestionados', value: '15,000+' },
                            { label: 'Tasa de renovación', value: '98%' },
                            { label: 'Valoración promedio', value: '4.9/5' }
                        ].map((metric, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-accent mb-1">{metric.value}</div>
                                <div className="text-sm text-text-muted">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== FAQ ===== */}
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 border-b border-border">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
                        Preguntas frecuentes
                    </h2>
                </div>

                <div className="mx-auto max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                q: '¿Sirve si soy entrenador independiente?',
                                a: 'Absolutamente. El plan Starter es gratuito y perfecto para empezar. Cuando crezcas, puedes escalar al plan Pro sin perder ningún dato.'
                            },
                            {
                                q: '¿Necesito conocimientos técnicos?',
                                a: 'No. La plataforma está diseñada para entrenadores, no para developers. Setup en 2 minutos, interfaz intuitiva, soporte en español.'
                            },
                            {
                                q: '¿Puedo migrar desde Excel/WhatsApp?',
                                a: 'Sí. Importa tus clientes desde CSV en un clic. Nuestro equipo te ayuda con la migración inicial sin costo adicional.'
                            },
                            {
                                q: '¿Cómo empiezo?',
                                a: '1) Crea tu cuenta (2 minutos) 2) Importa tus clientes o crea nuevos 3) Configura tu calendario 4) Conecta Stripe para pagos 5) Invita a tus clientes. Tienes 14 días de prueba gratis en el plan Pro.'
                            },
                            {
                                q: '¿Qué pasa con mis datos si cancelo?',
                                a: 'Tus datos son tuyos. Puedes exportar todo en formato CSV/JSON en cualquier momento. Si cancelas, tienes 30 días para descargar tu información.'
                            },
                            {
                                q: '¿Tienen app móvil?',
                                a: 'Sí. App nativa para iOS y Android, tanto para entrenadores como para clientes. Sincronización en tiempo real.'
                            }
                        ].map((faq, index) => (
                            <div key={index} className="rounded-2xl border border-border bg-primary-surface p-6">
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    className="w-full text-left"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-sm font-semibold text-white">{faq.q}</h3>
                                        <ArrowRight className={`h-4 w-4 text-accent flex-shrink-0 transition-transform ${openFAQ === index ? 'rotate-90' : ''}`} />
                                    </div>
                                </button>
                                {openFAQ === index && (
                                    <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
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
                            Empieza a escalar hoy
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-text-secondary">
                            Prueba gratis 14 días. Sin tarjeta. Setup en 2 minutos.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                onClick={() => navigate('/signup')}
                                className="group text-base px-8"
                            >
                                <Zap className="mr-2 h-5 w-5" />
                                Crear cuenta gratis
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-accent" />
                                <span>GDPR compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-accent" />
                                <span>Datos encriptados (SSL 256-bit)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Headphones className="h-4 w-4 text-accent" />
                                <span>Soporte en español 24/7</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                                <span>Backups automáticos</span>
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
                            <Target className="h-6 w-6 text-accent" />
                            <span className="text-lg font-bold text-white font-display">Plataforma SaaS para Entrenadores</span>
                        </div>
                        <p className="text-center text-sm text-text-muted max-w-2xl">
                            Centraliza agenda, pagos y seguimiento de clientes. Escala tu negocio de entrenamiento sin contratar asistente.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                            <span>© 2025 SaaS Entrenadores</span>
                            <span>•</span>
                            <a href="/privacy" className="hover:text-accent transition-colors">
                                Privacidad
                            </a>
                            <span>•</span>
                            <a href="/terms" className="hover:text-accent transition-colors">
                                Términos
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
