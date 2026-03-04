import { useState, useCallback, useEffect } from "react";
import { ChevronRight, Sparkles, Copy, FileJson, ExternalLink } from "lucide-react";
import { generateAIPrompt } from "../../../utils/promptGenerator.js";
import { universalImport } from "../../../lib/transformers/routineTransformer.js";
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

const AI_PLATFORMS = [
    {
        id: "gemini",
        name: "Gemini",
        url: "https://gemini.google.com/",
        gradient: "from-[#1a73e8] to-[#34a853]",
        hoverGlow: "hover:shadow-blue-500/30",
        icon: (
            <svg viewBox="0 0 28 28" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.1633 15.8433 5.46 15.12C3.7567 14.3733 1.9367 14 0 14C1.9367 14 3.7567 13.6383 5.46 12.915C7.1633 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.1633 12.88 5.46C13.6267 3.7567 14 1.9367 14 0C14 1.9367 14.3617 3.7567 15.085 5.46C15.8317 7.1633 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" fill="url(#gemini_gradient)" />
                <defs>
                    <linearGradient id="gemini_gradient" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4285F4" />
                        <stop offset="1" stopColor="#0F9D58" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        hint: "Pegá con Ctrl+V"
    },
    {
        id: "claude",
        name: "Claude",
        url: "https://claude.ai/new",
        gradient: "from-[#d97757] to-[#c96442]",
        hoverGlow: "hover:shadow-orange-500/30",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.27l-4.56.08v-1.37l6.97-4.07.7 1.23-4.88 2.71-.08.24.08.128h.16l4.56-.08v1.36l-6.97 4.08-.54-.903zM10.1 20.07l2.07-10.4 1.35.27-2.07 10.4-1.35-.27zm6.61-4.135l-1.55-.87.07-5.43 1.36-.02-.07 5.43 1.55.87-.07 1.37-1.29-.72v-.62zm1.24-8.07l-1.55-.87 1.37-.77 1.55.87-1.37.77z" />
            </svg>
        ),
        hint: "Pegá con Ctrl+V"
    },
    {
        id: "chatgpt",
        name: "ChatGPT",
        url: "https://chatgpt.com/",
        gradient: "from-[#10a37f] to-[#0d8f6f]",
        hoverGlow: "hover:shadow-emerald-500/30",
        icon: (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.879zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
            </svg>
        ),
        hint: "Pegá con Ctrl+V"
    }
];

const FitterOnboarding = ({ onCopyPrompt, onImportJSON }) => {
    const { metadata, updateMetadata } = usePlanContext();
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [jsonInput, setJsonInput] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [importSuccess, setImportSuccess] = useState(false);
    const [copiedPlatform, setCopiedPlatform] = useState(null);

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

    const handleOpenAI = useCallback(async (platform) => {
        // 1. Copy prompt to clipboard
        const prompt = generateAIPrompt(metadata);
        try {
            await navigator.clipboard.writeText(prompt);
        } catch {
            // Fallback for browsers without clipboard API
            const textarea = document.createElement("textarea");
            textarea.value = prompt;
            textarea.style.position = "fixed";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }
        // 2. Show copied feedback
        setCopiedPlatform(platform.id);
        setTimeout(() => setCopiedPlatform(null), 4000);
        // 3. Open the AI chat in a new tab
        window.open(platform.url, "_blank", "noopener,noreferrer");
    }, [metadata]);

    const handleImportJSON = useCallback(() => {
        try {
            setJsonError("");
            setImportSuccess(false);

            if (!jsonInput.trim()) {
                setJsonError("Por favó, pegá el JSON generado por la IA.");
                return;
            }

            // Parsear el JSON
            let parsedJSON;
            try {
                parsedJSON = JSON.parse(jsonInput);
            } catch {
                setJsonError("El JSON no es válido. Verificá que esté bien copiado (sin texto adicional antes o después).");
                return;
            }

            // Usar el importador universal que detecta el formato automáticamente
            const result = universalImport(parsedJSON);

            if (!result.success) {
                setJsonError(
                    result.errors?.[0] ||
                    "El JSON no tiene la estructura correcta. Aseguráte de copiar el JSON completo."
                );
                return;
            }

            // Pasar los datos ya convertidos al formato interno del editor
            onImportJSON(result.data);
            setImportSuccess(true);
            setJsonInput("");

        } catch (error) {
            console.error("Error al importar JSON:", error);
            setJsonError("Error inesperado al procesar el JSON.");
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
                    <div className="flex gap-3 mb-5">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-md shadow-accent/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="bg-[#0E0E0E] border border-[#2E2E2E] rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                                <p className="text-sm font-medium text-white leading-snug">
                                    {step.questions[0].text}
                                </p>
                                <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                                    {step.questions[0].subtext}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    {step.fields.length > 0 && (
                        <div className="bg-[#0E0E0E] border border-[#2E2E2E] rounded-xl p-4 space-y-4">
                            {step.fields.map((field) => renderField(field))}
                        </div>
                    )}

                    {/* Completion Step */}
                    {step.type === "completion" && (
                        <div className="space-y-4">

                            {/* Step 1: Open AI with prompt */}
                            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">
                                            Abrí tu IA favorita con el prompt listo
                                        </h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Hacé clic en un botón → <strong className="text-white">el prompt se copia automáticamente</strong> y se abre la IA. Solo tenés que pegar con <kbd className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">Ctrl+V</kbd>
                                        </p>
                                    </div>
                                </div>

                                {/* AI Platform Buttons */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {AI_PLATFORMS.map((platform) => (
                                        <button
                                            key={platform.id}
                                            onClick={() => handleOpenAI(platform)}
                                            className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer
                                                ${copiedPlatform === platform.id
                                                    ? "border-green-500/40 bg-green-500/10 scale-95"
                                                    : "border-[#2E2E2E] bg-[#0E0E0E] hover:border-white/20 hover:bg-[#161616] hover:-translate-y-0.5 active:translate-y-0"
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${copiedPlatform === platform.id ? "bg-green-500/20" : "bg-[#1A1A1A] group-hover:bg-[#222]"
                                                }`}>
                                                {copiedPlatform === platform.id
                                                    ? <span className="text-green-400 text-lg">✓</span>
                                                    : platform.icon
                                                }
                                            </div>
                                            <span className="text-xs font-semibold text-white">{platform.name}</span>
                                            <span className={`text-[10px] text-center leading-tight ${copiedPlatform === platform.id ? "text-green-400" : "text-white/40"
                                                }`}>
                                                {copiedPlatform === platform.id ? "¡Prompt copiado!" : platform.hint}
                                            </span>
                                            {copiedPlatform !== platform.id && (
                                                <ExternalLink className="absolute top-2 right-2 w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Success banner after clicking */}
                                {copiedPlatform && (
                                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-3">
                                        <span className="text-green-400">✓</span>
                                        <p className="text-xs text-green-300 leading-relaxed">
                                            <strong>Prompt copiado.</strong> Ya se abrió la IA en una nueva pestaña. Hacé clic en el cuadro de texto y pegá con{" "}
                                            <kbd className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">Ctrl+V</kbd>
                                        </p>
                                    </div>
                                )}


                                {/* Fallback: manual copy */}
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-[10px] text-gray-600 whitespace-nowrap">o copiá el prompt manualmente</span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onCopyPrompt}
                                    className="w-full mt-2 border border-white/10 text-gray-400 hover:text-white"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                    Copiar Prompt al portapapeles
                                </Button>
                            </div>

                            {/* Step 2: Paste JSON */}
                            <div className="bg-[#0E0E0E] border-2 border-accent/40 rounded-xl p-6 relative overflow-hidden">
                                {/* Accent glow line at top */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-accent/30">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-semibold text-white">
                                                Pegá el JSON que te dio la IA
                                            </h4>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 uppercase tracking-wide">
                                                Importante
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Copiá <strong className="text-white">todo el JSON</strong> que te respondió la IA
                                            (desde <code className="text-accent bg-accent/10 px-1 rounded">{'{'}</code> hasta <code className="text-accent bg-accent/10 px-1 rounded">{'}'}</code>)
                                            y pegálo en el campo de abajo.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <textarea
                                        value={jsonInput}
                                        onChange={(e) => setJsonInput(e.target.value)}
                                        placeholder="Pegá acá el JSON completo que te dio la IA..."
                                        className={`${inputClasses} min-h-[200px] resize-none font-mono text-xs border-accent/20 focus:border-accent`}
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
                                                ¡Rutina importada! Podés verla en la vista previa a la derecha.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        variant="accent"
                                        size="lg"
                                        onClick={handleImportJSON}
                                        disabled={!jsonInput.trim()}
                                        className="w-full"
                                    >
                                        <FileJson className="h-4 w-4" />
                                        Importar Rutina → Cargar en el Editor
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
