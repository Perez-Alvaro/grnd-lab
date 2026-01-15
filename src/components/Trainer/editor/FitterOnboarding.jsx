import { useState, useCallback, useEffect } from "react";
import { ChevronRight, Sparkles, Copy, FileJson } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import { TRAINING_GOALS } from "../../../constants/objectives.js";
import { Button } from "../../ui";
import { motion, AnimatePresence } from "framer-motion";

// Configuración de pasos del onboarding
const ONBOARDING_STEPS = [
    {
        id: "welcome",
        questions: [
            {
                text: "¡Hola! Soy Fitter, tu asistente personal para crear rutinas increíbles. 🚀",
                subtext: "Voy a ayudarte a diseñar la rutina perfecta para tus clientes. ¿Listo para empezar?"
            }
        ],
        fields: [],
        type: "intro"
    },
    {
        id: "basic-info",
        questions: [
            {
                text: "Perfecto, empecemos con lo básico.",
                subtext: "¿Cómo querés llamar a esta rutina?"
            }
        ],
        fields: ["name"],
        type: "input"
    },
    {
        id: "description",
        questions: [
            {
                text: "Excelente nombre 👌",
                subtext: "Ahora, describime brevemente qué va a lograr tu cliente con esta rutina"
            }
        ],
        fields: ["description"],
        type: "textarea"
    },
    {
        id: "demographics",
        questions: [
            {
                text: "¿Para quién está diseñada esta rutina?",
                subtext: "Seleccioná el género y el nivel de experiencia"
            }
        ],
        fields: ["gender", "level"],
        type: "select"
    },
    {
        id: "training-structure",
        questions: [
            {
                text: "Ahora hablemos de la estructura del entrenamiento",
                subtext: "¿Cuántos días por semana va a entrenar y cuál es el objetivo principal?"
            }
        ],
        fields: ["frequency", "objective"],
        type: "select"
    },
    {
        id: "duration-author",
        questions: [
            {
                text: "Ya casi terminamos 🎯",
                subtext: "¿Cuántas semanas va a durar el plan y quién es el autor/coach?"
            }
        ],
        fields: ["durationWeeks", "author"],
        type: "mixed"
    },
    {
        id: "customization",
        questions: [
            {
                text: "Últimos detalles para personalizar la rutina",
                subtext: "Agregá tags y notas especiales si querés (opcional)"
            }
        ],
        fields: ["tags", "notes"],
        type: "optional"
    },
    {
        id: "complete",
        questions: [
            {
                text: "¡Perfecto! Ya tenemos todo listo 🎉",
                subtext: "Ahora copiá el prompt para generar tu rutina con IA"
            }
        ],
        fields: [],
        type: "completion"
    }
];

const FitterOnboarding = ({ onCopyPrompt, onImportJSON }) => {
    const { metadata, updateMetadata } = usePlanContext();
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [jsonInput, setJsonInput] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [importSuccess, setImportSuccess] = useState(false);

    const step = ONBOARDING_STEPS[currentStep];
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    const handleChange = useCallback(
        (field) => (event) => {
            updateMetadata(field, event.target.value);
        },
        [updateMetadata]
    );

    const canProceed = useCallback(() => {
        if (step.type === "intro" || step.type === "completion" || step.type === "optional") {
            return true;
        }

        // Verificar que los campos requeridos estén completos
        return step.fields.every((field) => {
            const value = metadata[field];
            return value && value.toString().trim() !== "";
        });
    }, [step, metadata]);

    const handleNext = useCallback(() => {
        if (canProceed() && currentStep < ONBOARDING_STEPS.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
                setIsAnimating(false);
            }, 300);
        }
    }, [canProceed, currentStep]);

    const handlePrevious = useCallback(() => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep((prev) => prev - 1);
                setIsAnimating(false);
            }, 300);
        }
    }, [currentStep]);

    const handleImportJSON = useCallback(() => {
        try {
            setJsonError("");
            setImportSuccess(false);

            // Validar que haya contenido
            if (!jsonInput.trim()) {
                setJsonError("Por favor, pegá el JSON generado por la IA");
                return;
            }

            // Intentar parsear el JSON
            const parsedJSON = JSON.parse(jsonInput);

            // Validar estructura básica
            if (!parsedJSON.metadata || !parsedJSON.weeks) {
                setJsonError("El JSON no tiene la estructura correcta. Asegurate de copiar el JSON completo.");
                return;
            }

            // Importar usando la función del padre
            onImportJSON(parsedJSON);
            setImportSuccess(true);
            setJsonInput(""); // Limpiar el campo

        } catch (error) {
            console.error("Error al importar JSON:", error);
            setJsonError("El JSON no es válido. Verificá que esté bien copiado.");
        }
    }, [jsonInput, onImportJSON]);

    // Auto-scroll al cambiar de paso
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

    const inputClasses =
        "w-full rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white shadow-sm transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

    const labelClasses = "text-sm font-medium text-gray-300 mb-2 block";

    const frequencyOptions = ["2", "3", "4", "5"];
    const durationOptions = ["1", "2", "3", "4", "6", "8", "12"];
    const levelOptions = [
        { value: "", label: "Seleccioná el nivel" },
        { value: "Principiante", label: "Principiante" },
        { value: "Intermedio", label: "Intermedio" },
        { value: "Avanzado", label: "Avanzado" },
        { value: "Todos los niveles", label: "Todos los niveles" },
    ];

    const renderField = (field) => {
        switch (field) {
            case "name":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Nombre de la rutina</label>
                        <input
                            type="text"
                            value={metadata.name}
                            onChange={handleChange("name")}
                            placeholder='Ej: "Masculino Volumen FST-7 · 4 días por semana"'
                            className={inputClasses}
                            autoFocus
                        />
                    </div>
                );

            case "description":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Descripción breve</label>
                        <textarea
                            rows={4}
                            value={metadata.description}
                            onChange={handleChange("description")}
                            placeholder='Ej: "Plan enfocado en ganar masa muscular combinando fuerza y técnicas FST-7"'
                            className={`${inputClasses} min-h-[120px] resize-none`}
                        />
                    </div>
                );

            case "gender":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Género</label>
                        <select
                            value={metadata.gender}
                            onChange={handleChange("gender")}
                            className={inputClasses}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                );

            case "level":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Nivel de experiencia</label>
                        <select
                            value={metadata.level}
                            onChange={handleChange("level")}
                            className={inputClasses}
                        >
                            {levelOptions.map((option) => (
                                <option key={option.value || "all"} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "frequency":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Días por semana</label>
                        <select
                            value={metadata.frequency}
                            onChange={handleChange("frequency")}
                            className={inputClasses}
                        >
                            <option value="">Seleccioná la frecuencia</option>
                            {frequencyOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option} días/semana
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "objective":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Objetivo principal</label>
                        <select
                            value={metadata.objective}
                            onChange={handleChange("objective")}
                            className={inputClasses}
                        >
                            <option value="">Seleccioná un objetivo</option>
                            {TRAINING_GOALS.map((goal) => (
                                <option key={goal.value} value={goal.value}>
                                    {goal.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "durationWeeks":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Duración (semanas)</label>
                        <select
                            value={metadata.durationWeeks}
                            onChange={handleChange("durationWeeks")}
                            className={inputClasses}
                        >
                            <option value="">Seleccioná la duración</option>
                            {durationOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option} semanas
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case "author":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Autor / Coach</label>
                        <input
                            type="text"
                            value={metadata.author}
                            onChange={handleChange("author")}
                            placeholder='Ej: "Nick Bare" o "Coach MZ"'
                            className={inputClasses}
                        />
                    </div>
                );

            case "tags":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Tags (opcional)</label>
                        <input
                            type="text"
                            value={metadata.tags}
                            onChange={handleChange("tags")}
                            placeholder='Ej: "hipertrofia, fuerza, funcional, fst-7"'
                            className={inputClasses}
                        />
                    </div>
                );

            case "notes":
                return (
                    <div key={field} className="flex flex-col gap-2">
                        <label className={labelClasses}>Notas especiales (opcional)</label>
                        <textarea
                            rows={4}
                            value={metadata.notes}
                            onChange={handleChange("notes")}
                            placeholder='Ej: "Rutina estilo Hany Rambod con foco en congestión y control del tempo"'
                            className={`${inputClasses} min-h-[120px] resize-none`}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400">
                        Paso {currentStep + 1} de {ONBOARDING_STEPS.length}
                    </span>
                    <span className="text-xs font-medium text-accent">
                        {Math.round(progress)}% completado
                    </span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent to-accent/70"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Fitter Avatar & Message */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex gap-4 mb-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="bg-[#0E0E0E] border border-[#2E2E2E] rounded-2xl rounded-tl-none p-6 shadow-xl">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {step.questions[0].text}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {step.questions[0].subtext}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    {step.fields.length > 0 && (
                        <div className="bg-[#0E0E0E] border border-[#2E2E2E] rounded-xl p-6 space-y-4">
                            {step.fields.map((field) => renderField(field))}
                        </div>
                    )}

                    {/* Completion Step */}
                    {step.type === "completion" && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                        <Copy className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">
                                            Paso 1: Copiá el Prompt Maestro
                                        </h4>
                                        <p className="text-xs text-gray-400">
                                            Este prompt contiene toda la información que acabás de completar
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="accent"
                                    size="lg"
                                    onClick={onCopyPrompt}
                                    className="w-full"
                                >
                                    <Copy className="h-4 w-4" />
                                    Copiar Prompt para IA
                                </Button>
                            </div>

                            <div className="bg-[#0E0E0E] border border-[#2E2E2E] rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                        <FileJson className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white mb-1">
                                            Paso 2: Pegá el JSON generado
                                        </h4>
                                        <p className="text-xs text-gray-400 mb-3">
                                            Copiá el JSON que te devolvió ChatGPT o Claude y pegalo acá abajo
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <textarea
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        placeholder='Pegá aquí el JSON completo que generó la IA...'
                                        className={`${inputClasses} min-h-[200px] resize-none font-mono text-xs`}
                                        rows={10}
                                    />

                                    {jsonError && (
                                        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            <span className="text-red-400 text-xs">⚠️</span>
                                            <p className="text-xs text-red-400">{jsonError}</p>
                                        </div>
                                    )}

                                    {importSuccess && (
                                        <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                            <span className="text-green-400 text-xs">✓</span>
                                            <p className="text-xs text-green-400">
                                                ¡Rutina importada exitosamente! Podés verla en la vista previa a la derecha.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        variant="default"
                                        size="lg"
                                        onClick={handleImportJSON}
                                        disabled={!jsonInput.trim()}
                                        className="w-full"
                                    >
                                        <FileJson className="h-4 w-4" />
                                        Importar Rutina
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="disabled:opacity-30"
                >
                    Anterior
                </Button>

                {currentStep < ONBOARDING_STEPS.length - 1 ? (
                    <Button
                        variant="default"
                        onClick={handleNext}
                        disabled={!canProceed() || isAnimating}
                        className="min-w-[120px]"
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                ) : (
                    <Button
                        variant="accent"
                        onClick={() => setCurrentStep(0)}
                        className="min-w-[120px]"
                    >
                        Reiniciar
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FitterOnboarding;
