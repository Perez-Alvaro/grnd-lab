/**
 * Tutorial Overlay - Sistema de Onboarding para GRIND LAB
 * Guía paso a paso para nuevos usuarios
 */

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Lightbulb } from 'lucide-react';
import { Button } from '../ui';

const TUTORIAL_STORAGE_KEY = 'grindlab_tutorial_completed';

const TUTORIAL_STEPS = [
    {
        id: 'metadata',
        title: 'Paso 1: Completa los datos básicos',
        description: 'Define el objetivo, frecuencia y nivel. Esto servirá de base para que la IA genere una rutina personalizada.',
        target: 'metadata-form', // ID del elemento a destacar
        position: 'bottom',
    },
    {
        id: 'generate-prompt',
        title: 'Paso 2: Genera el Prompt Maestro',
        description: 'Haz clic en "Copiar Prompt para IA". Se copiará automáticamente a tu portapapeles con instrucciones precisas.',
        target: 'copy-prompt-button',
        position: 'bottom',
    },
    {
        id: 'ai-external',
        title: 'Paso 3: Usa tu IA favorita',
        description: 'Pega el prompt en ChatGPT, Claude o Gemini (gratis). La IA te devolverá un JSON estructurado con tu rutina completa.',
        target: 'copy-prompt-button',
        position: 'bottom',
    },
    {
        id: 'json-editor',
        title: 'Paso 4: Pega el JSON y edita',
        description: 'Haz clic en "Editor JSON" y pega el código. Verás la rutina renderizarse en tiempo real en el panel derecho. ¡Magia!',
        target: 'json-editor-button',
        position: 'bottom',
    },
    {
        id: 'export',
        title: 'Paso 5: Exporta tu rutina',
        description: 'Cuando estés listo, exporta a PDF profesional para compartir con tus clientes, o a JSON para reutilizar.',
        target: 'export-pdf-button',
        position: 'bottom',
    },
];

export default function TutorialOverlay({ onComplete }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightElement, setHighlightElement] = useState(null);

    useEffect(() => {
        // Verificar si el usuario ya completó el tutorial
        const hasCompletedTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);

        if (!hasCompletedTutorial) {
            // Mostrar modal de bienvenida después de 1 segundo
            const timer = setTimeout(() => {
                setShowWelcome(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (isOpen && TUTORIAL_STEPS[currentStep]) {
            const targetId = TUTORIAL_STEPS[currentStep].target;
            const element = document.getElementById(targetId);
            setHighlightElement(element);

            // Scroll disabled per user request - elements remain highlighted without scrolling
            // if (element) {
            //     element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // }
        } else {
            setHighlightElement(null);
        }
    }, [isOpen, currentStep]);

    const handleStartTutorial = () => {
        setShowWelcome(false);
        setIsOpen(true);
        setCurrentStep(0);
    };

    const handleSkipTutorial = () => {
        setShowWelcome(false);
        localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
        if (onComplete) onComplete();
    };

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCompleteTutorial();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCompleteTutorial = () => {
        setIsOpen(false);
        localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
        if (onComplete) onComplete();
    };

    const handleCloseTutorial = () => {
        setIsOpen(false);
        setShowWelcome(false);
        // No marcamos como completado si cierran manualmente
    };

    if (!showWelcome && !isOpen) return null;

    return (
        <>
            {/* Backdrop oscuro */}
            <div
                className="fixed inset-0 bg-black transition-opacity z-40"
                style={{
                    opacity: isOpen ? 0.7 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                }}
                onClick={handleCloseTutorial}
            />

            {/* Highlight del elemento actual */}
            {isOpen && highlightElement && (() => {
                const rect = highlightElement.getBoundingClientRect();
                return (
                    <div
                        className="fixed border-2 border-accent rounded-lg shadow-glow-lg pointer-events-none z-50 transition-all duration-300"
                        style={{
                            top: rect.top - 8,
                            left: rect.left - 8,
                            width: rect.width + 16,
                            height: Math.min(rect.height, 200) + 16, // Limit height for huge elements
                        }}
                    />
                );
            })()}

            {/* Modal de Bienvenida */}
            {showWelcome && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-md w-full bg-primary-surface border border-border rounded-2xl shadow-2xl animate-slide-up">
                        {/* Header */}
                        <div className="p-6 border-b border-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                                    <Lightbulb className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white font-display">
                                        ¡Bienvenido a GRIND LAB!
                                    </h2>
                                    <p className="text-sm text-text-muted">Tu herramienta de generación de rutinas</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-text-secondary leading-relaxed mb-4">
                                ¿Es tu primera vez aquí? Te recomendamos un <span className="text-white font-medium">tutorial rápido de 5 pasos</span> para
                                aprender cómo generar rutinas profesionales con IA.
                            </p>
                            <div className="rounded-lg bg-accent/5 border border-accent/20 p-4 mb-6">
                                <p className="text-sm text-text-secondary">
                                    💡 <span className="text-accent font-medium">Tip:</span> El tutorial dura menos de 2 minutos y te ahorrará tiempo a largo plazo.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-border flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={handleSkipTutorial}
                                className="flex-1"
                            >
                                Ya sé cómo funciona
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleStartTutorial}
                                className="flex-1 group"
                            >
                                <Lightbulb className="mr-2 h-4 w-4" />
                                Ver tutorial
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tutorial Step Tooltip */}
            {isOpen && TUTORIAL_STEPS[currentStep] && highlightElement && (() => {
                const rect = highlightElement.getBoundingClientRect();
                const TOOLTIP_WIDTH = 384; // max-w-sm = 24rem = 384px
                const TOOLTIP_MARGIN = 16;

                // Calculate vertical position (below element with some spacing)
                const topPosition = Math.min(
                    rect.bottom + TOOLTIP_MARGIN,
                    window.innerHeight - 400 // Reserve 400px for tooltip height
                );

                // Calculate horizontal position (centered, but within viewport)
                let leftPosition = rect.left + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
                leftPosition = Math.max(TOOLTIP_MARGIN, Math.min(
                    leftPosition,
                    window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_MARGIN
                ));

                return (
                    <div
                        className="fixed z-50 max-w-sm animate-fade-in"
                        style={{
                            top: topPosition,
                            left: leftPosition,
                        }}
                    >
                        {/* Arrow pointing up */}
                        <div
                            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-surface border-l border-t border-border rotate-45"
                        />

                        {/* Tooltip Card */}
                        <div className="relative bg-primary-surface border border-border rounded-xl shadow-2xl overflow-hidden">
                            {/* Progress bar */}
                            <div className="h-1 bg-border">
                                <div
                                    className="h-full bg-accent transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-mono font-semibold">
                                            {currentStep + 1}
                                        </span>
                                        <span className="text-xs font-mono text-text-muted">
                                            {currentStep + 1} de {TUTORIAL_STEPS.length}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCloseTutorial}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-semibold text-white mb-2 font-display">
                                    {TUTORIAL_STEPS[currentStep].title}
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {TUTORIAL_STEPS[currentStep].description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-6 flex items-center justify-between gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="flex-shrink-0"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Anterior
                                </Button>

                                {currentStep < TUTORIAL_STEPS.length - 1 ? (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={handleNext}
                                        className="flex-shrink-0"
                                    >
                                        Siguiente
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="accent"
                                        size="sm"
                                        onClick={handleCompleteTutorial}
                                        className="flex-shrink-0"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        ¡Entendido!
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </>
    );
}
