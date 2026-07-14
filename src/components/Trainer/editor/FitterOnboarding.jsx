import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Copy, ClipboardPaste, ExternalLink, Check, AlertCircle } from "lucide-react";
import { generateAIPrompt } from "../../../utils/promptGenerator.js";
import { universalImport } from "../../../lib/transformers/routineTransformer.js";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import { WORKOUT_STEPS } from "../../../constants/workoutOnboarding.js";
import { Button } from "../../ui";
import { motion, AnimatePresence } from "framer-motion";

const AI_PLATFORMS = [
    { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/",
      icon: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.879zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" /></svg>) },
    { id: "claude", name: "Claude", url: "https://claude.ai/new",
      icon: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.27l-4.56.08v-1.37l6.97-4.07.7 1.23-4.88 2.71-.08.24.08.128h.16l4.56-.08v1.36l-6.97 4.08-.54-.903zM10.1 20.07l2.07-10.4 1.35.27-2.07 10.4-1.35-.27zm6.61-4.135l-1.55-.87.07-5.43 1.36-.02-.07 5.43 1.55.87-.07 1.37-1.29-.72v-.62z" /></svg>) },
    { id: "gemini", name: "Gemini", url: "https://gemini.google.com/",
      icon: (<svg viewBox="0 0 28 28" className="w-5 h-5" fill="currentColor"><path d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.1633 15.8433 5.46 15.12C3.7567 14.3733 1.9367 14 0 14C1.9367 14 3.7567 13.6383 5.46 12.915C7.1633 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.1633 12.88 5.46C13.6267 3.7567 14 1.9367 14 0C14 1.9367 14.3617 3.7567 15.085 5.46C15.8317 7.1633 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z" /></svg>) },
];

const inputCls = "w-full rounded-xl border border-border bg-primary-bg px-4 py-3 text-base text-text-primary placeholder:text-text-quaternary transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

const FitterOnboarding = ({
    onCopyPrompt,
    onImportJSON,
    steps = WORKOUT_STEPS,
    generatePrompt = generateAIPrompt,
    importFn = universalImport,
}) => {
    const STEPS = steps;
    const { metadata, updateMetadata } = usePlanContext();
    const [i, setI] = useState(0);
    const [copied, setCopied] = useState(null);
    const [jsonError, setJsonError] = useState("");
    const [ok, setOk] = useState(false);
    const [showTextarea, setShowTextarea] = useState(false);
    const [jsonInput, setJsonInput] = useState("");

    const step = STEPS[i];
    const progress = ((i + 1) / STEPS.length) * 100;
    const val = step.field ? (metadata[step.field] || "") : "";
    const filled = !step.required || (val && val.toString().trim() !== "");

    const next = useCallback(() => setI((p) => Math.min(p + 1, STEPS.length - 1)), [STEPS.length]);
    const prev = useCallback(() => setI((p) => Math.max(p - 1, 0)), []);

    const pick = useCallback((field, value) => {
        updateMetadata(field, value);
        setTimeout(() => setI((p) => Math.min(p + 1, STEPS.length - 1)), 220);
    }, [updateMetadata, STEPS.length]);

    const importFromText = useCallback((text) => {
        setJsonError(""); setOk(false);
        if (!text || !text.trim()) { setJsonError("No encontré nada para pegar. Copiá el JSON de la IA e intentá de nuevo."); return; }
        let parsed;
        try { parsed = JSON.parse(text); }
        catch { setJsonError("Eso no es un JSON válido. Copiá solo lo que te dio la IA, desde { hasta }."); return; }
        const result = importFn(parsed);
        if (!result.success) { setJsonError(result.errors?.[0] || "El JSON no tiene la estructura correcta."); return; }
        onImportJSON(result.data);
        setOk(true); setJsonInput(""); setShowTextarea(false);
    }, [onImportJSON, importFn]);

    const smartPaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text || !text.trim()) { setShowTextarea(true); return; }
            importFromText(text);
        } catch {
            setShowTextarea(true); // sin permiso de portapapeles → fallback manual
        }
    }, [importFromText]);

    const openAI = useCallback(async (platform) => {
        const prompt = generatePrompt(metadata);
        try { await navigator.clipboard.writeText(prompt); }
        catch {
            const ta = document.createElement("textarea");
            ta.value = prompt; ta.style.position = "fixed"; ta.style.left = "-9999px";
            document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
        }
        setCopied(platform.id);
        setTimeout(() => setCopied(null), 5000);
        window.open(platform.url, "_blank", "noopener,noreferrer");
    }, [metadata, generatePrompt]);

    useEffect(() => {
        const el = document.querySelector("input[data-onb], textarea[data-onb]");
        if (el) setTimeout(() => el.focus(), 60);
    }, [i]);

    return (
        <div className="mx-auto max-w-2xl">
            {/* Progreso */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-text-tertiary">Paso {i + 1} de {STEPS.length}</span>
                    <span className="text-xs font-medium text-accent">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-primary-bg rounded-full overflow-hidden">
                    <motion.div className="h-full bg-accent" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
                    {/* Pregunta (chat de Fitter) */}
                    <div className="flex gap-3 mb-5">
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-md shadow-accent/20">
                            <Sparkles className="w-4 h-4 text-primary-bg" />
                        </div>
                        <div className="flex-1 bg-primary-bg border border-border rounded-2xl rounded-tl-none px-4 py-3">
                            <p className="text-sm font-semibold text-text-primary leading-snug">{step.q}</p>
                            {step.sub && <p className="text-xs text-text-tertiary leading-relaxed mt-0.5">{step.sub}</p>}
                        </div>
                    </div>

                    {/* Respuesta */}
                    {step.kind === "chips" && (
                        <div className="flex flex-wrap gap-2.5">
                            {step.options.map((o) => {
                                const selected = val === o.v;
                                return (
                                    <button
                                        key={o.v}
                                        onClick={() => pick(step.field, o.v)}
                                        className={`min-h-[44px] px-5 rounded-xl border text-sm font-medium transition-colors ${
                                            selected
                                                ? "border-accent bg-accent/15 text-accent"
                                                : "border-border bg-primary-bg text-text-secondary hover:border-accent/50 hover:text-text-primary"
                                        }`}
                                    >
                                        {(o.label || o.v)}{step.suffix || ""}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {step.kind === "text" && (
                        <input
                            data-onb type="text" value={val}
                            onChange={(e) => updateMetadata(step.field, e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && filled && next()}
                            placeholder={step.placeholder} className={inputCls}
                        />
                    )}

                    {step.kind === "textarea" && (
                        <textarea
                            data-onb rows={4} value={val}
                            onChange={(e) => updateMetadata(step.field, e.target.value)}
                            placeholder={step.placeholder} className={`${inputCls} min-h-[120px] resize-none`}
                        />
                    )}

                    {/* Paso final: generar */}
                    {step.kind === "completion" && (
                        <div className="space-y-4">
                            {/* 1. Abrir IA con el prompt copiado */}
                            <div className="rounded-2xl border border-border bg-primary-bg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-bold">1</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-text-primary">Abrí tu IA con el prompt listo</h4>
                                        <p className="text-xs text-text-tertiary leading-relaxed mt-0.5">
                                            Tocá una → <strong className="text-text-primary">copiamos el prompt y abrimos la IA</strong>. Solo pegás con Ctrl/Cmd+V.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {AI_PLATFORMS.map((pl) => {
                                        const c = copied === pl.id;
                                        return (
                                            <button
                                                key={pl.id} onClick={() => openAI(pl)}
                                                className={`group relative flex flex-col items-center gap-2 min-h-[88px] p-3 rounded-xl border transition-colors ${
                                                    c ? "border-accent/50 bg-accent/10" : "border-border bg-primary-surface hover:border-accent/40"
                                                }`}
                                            >
                                                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${c ? "bg-accent/20 text-accent" : "bg-primary-bg text-text-secondary"}`}>
                                                    {c ? <Check className="w-5 h-5" /> : pl.icon}
                                                </span>
                                                <span className="text-xs font-semibold text-text-primary">{pl.name}</span>
                                                {!c && <ExternalLink className="absolute top-2 right-2 w-3 h-3 text-text-quaternary" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {copied && (
                                    <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-accent/10 border border-accent/25">
                                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                                        <p className="text-xs text-text-secondary">Prompt copiado y IA abierta. Pegá con <strong className="text-text-primary">Ctrl/Cmd+V</strong> y enviá.</p>
                                    </div>
                                )}
                                <button onClick={onCopyPrompt} className="mt-3 w-full text-xs text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center justify-center gap-1.5">
                                    <Copy className="w-3.5 h-3.5" /> o copiar el prompt manualmente
                                </button>
                            </div>

                            {/* 2. Pegar lo que dio la IA — botón grande */}
                            <div className="rounded-2xl border-2 border-accent/40 bg-primary-bg p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-primary-bg flex items-center justify-center text-sm font-bold">2</div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-text-primary">Traé la respuesta de la IA</h4>
                                        <p className="text-xs text-text-tertiary leading-relaxed mt-0.5">Copiá lo que te respondió la IA y tocá el botón.</p>
                                    </div>
                                </div>

                                {!showTextarea ? (
                                    <Button variant="accent" size="lg" onClick={smartPaste} className="w-full h-14 text-base">
                                        <ClipboardPaste className="h-5 w-5" /> Pegá lo que te dio la IA
                                    </Button>
                                ) : (
                                    <div className="space-y-3">
                                        <textarea
                                            value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}
                                            placeholder="Pegá acá el JSON completo (desde { hasta })…"
                                            className={`${inputCls} min-h-[160px] resize-none font-mono text-xs`} rows={8} autoFocus
                                        />
                                        <Button variant="accent" size="lg" onClick={() => importFromText(jsonInput)} disabled={!jsonInput.trim()} className="w-full">
                                            <ClipboardPaste className="h-4 w-4" /> Cargar rutina
                                        </Button>
                                    </div>
                                )}

                                {jsonError && (
                                    <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-300">{jsonError}</p>
                                    </div>
                                )}
                                {ok && (
                                    <div className="mt-3 flex items-center gap-2 p-3 bg-accent/10 border border-accent/25 rounded-lg">
                                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                                        <p className="text-xs text-text-secondary">¡Rutina cargada! Mirala en la vista previa.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navegación (los chips autoavanzan; igual dejamos Atrás y Siguiente/Omitir) */}
            {step.kind !== "completion" ? (
                <div className="flex items-center justify-between mt-6">
                    <Button variant="ghost" onClick={prev} disabled={i === 0} className="disabled:opacity-30">
                        <ChevronLeft className="h-4 w-4" /> Atrás
                    </Button>
                    {step.kind !== "chips" ? (
                        <Button variant="accent" onClick={next} disabled={!filled} className="min-w-[130px]">
                            {step.required || filled ? "Siguiente" : "Omitir"}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        !step.required && (
                            <Button variant="ghost" onClick={next}>Omitir <ChevronRight className="h-4 w-4" /></Button>
                        )
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-between mt-6">
                    <Button variant="ghost" onClick={prev}><ChevronLeft className="h-4 w-4" /> Atrás</Button>
                    <Button variant="ghost" onClick={() => setI(0)}>Empezar de nuevo</Button>
                </div>
            )}
        </div>
    );
};

export default FitterOnboarding;
