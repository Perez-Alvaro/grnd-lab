/**
 * Grind-Lab - Editor de planes (parametrizado por planType: 'workout' | 'nutrition').
 * Mobile-first: 1 columna en mobile con toggle Editor ↔ Vista previa;
 * dos columnas lado a lado en desktop (lg+).
 * El tipo se resuelve por ?planType= (default 'workout'); toda la config
 * (hoja, preview, steps, prompt, persistencia) viene de src/config/planTypes.js.
 */

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, FileDown, MoreVertical, Copy, Code, FileJson, Download, Save,
  Pencil, Eye, Bot,
} from "lucide-react";
import { PlanProvider } from "../context/PlanContext.jsx";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import { getPlanTypeConfig } from "../config/planTypes.js";
import usePDFExport from "../hooks/usePDFExport.js";
import PlanMetadataForm from "../components/Trainer/editor/PlanMetadataForm.jsx";
import FitterOnboarding from "../components/Trainer/editor/FitterOnboarding.jsx";
import ImportModal from "../components/Editor/ImportModal.jsx";
import ExportModal from "../components/Editor/ExportModal.jsx";
import PDFExportModal from "../components/Editor/PDFExportModal.jsx";
import WeekEditor from "../components/Trainer/editor/WeekEditor.jsx";
import { Button } from "../components/ui";
import JSONEditor from "../components/Editor/JSONEditor.jsx";
import TutorialOverlay from "../components/Tutorial/TutorialOverlay.jsx";
import { useSnackbar, TUTORIAL_SNACKBARS } from "../components/Tutorial/Snackbar.jsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs.jsx";

const buildContextValue = (planEditor) => ({
  plan: planEditor.plan,
  metadata: planEditor.metadata,
  weeks: planEditor.weeks,
  updateMetadata: planEditor.updateMetadata,
  addWeek: planEditor.addWeek,
  duplicateWeek: planEditor.duplicateWeek,
  removeWeek: planEditor.removeWeek,
  addDay: planEditor.addDay,
  duplicateDay: planEditor.duplicateDay,
  removeDay: planEditor.removeDay,
  reorderDay: planEditor.reorderDay,
  updateWeekField: planEditor.updateWeekField,
  updateDayField: planEditor.updateDayField,
  setDayType: planEditor.setDayType,
  addExercise: planEditor.addExercise,
  duplicateExercise: planEditor.duplicateExercise,
  removeExercise: planEditor.removeExercise,
  updateExerciseField: planEditor.updateExerciseField,
});

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
};

export default function RoutineEditorPage() {
  const navigate = useNavigate();
  const exportPDF = usePDFExport();
  const snackbar = useSnackbar();

  const [searchParams] = useSearchParams();
  const planType = searchParams.get("planType") || "workout";
  const config = useMemo(() => getPlanTypeConfig(planType), [planType]);
  const Preview = config.Preview;
  const isWorkout = config.id === "workout";

  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPDFExportModal, setShowPDFExportModal] = useState(false);
  const [showJSONEditor, setShowJSONEditor] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [useAIMode, setUseAIMode] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [mobileView, setMobileView] = useState("editor"); // 'editor' | 'preview' (solo mobile)

  const planEditor = useRoutineEditor({
    template: null,
    templateId: null,
    existingTemplate: null,
    leafKey: config.leaf.key,
    createLeaf: config.leaf.create,
    normalizeImport: config.normalizeImport,
  });

  const planContextValue = useMemo(
    () => ({ ...buildContextValue(planEditor), leafUI: config.leaf }),
    [planEditor, config],
  );

  // ── Persistencia en la nube ──────────────────────────────────
  const [planId, setPlanId] = useState(
    searchParams.get("planId") || searchParams.get("routineId") || null,
  );
  const [athleteId] = useState(searchParams.get("athleteId") || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const pid = searchParams.get("planId") || searchParams.get("routineId");
    if (!pid) return;
    (async () => {
      try {
        const r = await config.lib.get(pid);
        planEditor.loadPlan(r.data);
        setPlanId(r.id);
      } catch (error) {
        console.error("Error cargando el plan:", error);
        snackbar.error("No se pudo cargar el plan");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const saved = await config.lib.save({
        id: planId,
        title: planEditor.metadata.name || config.labels.untitled,
        data: planEditor.plan,
        athlete_id: athleteId,
      });
      setPlanId(saved.id);
      snackbar.success("Cambios guardados");
    } catch (error) {
      console.error("Error guardando el plan:", error);
      snackbar.error("No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }, [config, planId, athleteId, planEditor.metadata.name, planEditor.plan, snackbar]);

  const handleBack = useCallback(() => {
    if (planEditor.dirty && !window.confirm("Hay cambios sin guardar. ¿Desea salir igualmente?")) return;
    navigate("/dashboard");
  }, [navigate, planEditor.dirty]);

  const handleExportPdf = useCallback(async () => {
    if (config.pdfExport) {
      try {
        await config.pdfExport(planEditor.plan);
        snackbar.success(TUTORIAL_SNACKBARS.pdfExported);
      } catch (error) {
        console.error("PDF Export Error:", error);
        snackbar.error(`Error: ${error.message || "No se pudo exportar el PDF"}`);
      }
      return;
    }
    setShowPDFExportModal(true);
  }, [config, planEditor.plan, snackbar]);

  const handlePDFTypeSelect = useCallback(async (type) => {
    try {
      await exportPDF(planEditor.planForPdf, type);
      snackbar.success(TUTORIAL_SNACKBARS.pdfExported);
    } catch (error) {
      console.error("PDF Export Error:", error);
      snackbar.error(`Error: ${error.message || "No se pudo exportar el PDF"}`);
    }
  }, [exportPDF, planEditor.planForPdf, snackbar]);

  const handleImport = useCallback((importedData) => {
    try {
      planEditor.loadPlan(importedData);
      snackbar.success(TUTORIAL_SNACKBARS.jsonLoaded);
      setShowImportModal(false);
      setMobileView("preview"); // tras importar, mostramos el resultado en mobile
    } catch (error) {
      console.error("Import error:", error);
      snackbar.error(TUTORIAL_SNACKBARS.jsonError);
    }
  }, [planEditor, snackbar]);

  const handleCopyPrompt = useCallback(async () => {
    try {
      const ok = await copyText(config.generatePrompt(planEditor.metadata));
      if (ok) snackbar.success(TUTORIAL_SNACKBARS.promptCopied, 6000);
      else snackbar.error("No se pudo copiar el prompt");
    } catch (error) {
      console.error("Error copiando el prompt:", error);
      snackbar.error("Error al copiar el prompt");
    }
  }, [config, planEditor.metadata, snackbar]);

  const handleJSONEditorChange = useCallback((parsedJSON) => {
    try {
      planEditor.loadPlan(parsedJSON);
      snackbar.success(TUTORIAL_SNACKBARS.jsonLoaded);
    } catch (error) {
      console.error("Error al aplicar JSON:", error);
      snackbar.error(TUTORIAL_SNACKBARS.jsonError);
    }
  }, [planEditor, snackbar]);

  const handleTabChange = useCallback((value) => {
    if (value === "advanced") setShowTutorial(true);
  }, []);

  const onboardingProps = {
    onCopyPrompt: handleCopyPrompt,
    onImportJSON: handleImport,
    steps: config.steps,
    generatePrompt: config.generatePrompt,
    importFn: config.importFromAI,
  };

  const menuItem =
    "w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-bg transition-colors text-sm text-text-primary";

  const segBtn = (active) =>
    `inline-flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold transition-colors ${
      active ? "bg-accent text-primary-bg shadow-sm" : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <PlanProvider value={planContextValue}>
      <div className="flex h-dvh flex-col bg-primary-bg overflow-hidden">
        <TutorialOverlay shouldShow={showTutorial} />

        {/* ── Top bar ── */}
        <header className="flex-shrink-0 border-b border-border bg-primary-surface">
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Volver al panel">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-text-primary font-display truncate max-w-[45vw] sm:max-w-none">
                  {planEditor.metadata.name || config.labels.untitled}
                </h1>
                <p className="hidden sm:block text-xs text-text-muted">{config.labels.editorSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative flex-shrink-0">
              <Button variant="accent" size="sm" onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Guardar</span>
              </Button>

              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowToolsMenu(!showToolsMenu)} aria-label="Más opciones">
                  <MoreVertical className="h-4 w-4" />
                </Button>

                {showToolsMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowToolsMenu(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-56 bg-primary-surface border border-border rounded-xl shadow-xl shadow-black/30 z-50 overflow-hidden py-1">
                      {(isWorkout || config.pdfExport) && (
                        <button onClick={() => { handleExportPdf(); setShowToolsMenu(false); }} className={menuItem}>
                          <FileDown className="h-4 w-4 text-text-tertiary" /> Exportar PDF
                        </button>
                      )}
                      <button onClick={() => { handleCopyPrompt(); setShowToolsMenu(false); }} className={menuItem}>
                        <Copy className="h-4 w-4 text-text-tertiary" /> Copiar prompt para IA
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button onClick={() => { setShowJSONEditor(!showJSONEditor); setShowToolsMenu(false); }} className={menuItem}>
                        <Code className="h-4 w-4 text-text-tertiary" /> {showJSONEditor ? "Cerrar editor JSON" : "Editor JSON"}
                      </button>
                      <button onClick={() => { setShowImportModal(true); setShowToolsMenu(false); }} className={menuItem}>
                        <FileJson className="h-4 w-4 text-text-tertiary" /> Importar JSON
                      </button>
                      <button onClick={() => { setShowExportModal(true); setShowToolsMenu(false); }} className={menuItem}>
                        <Download className="h-4 w-4 text-text-tertiary" /> Exportar JSON
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Segmented toggle Editor ↔ Vista previa — solo mobile */}
          <div className="lg:hidden px-4 sm:px-6 pb-3">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-primary-bg border border-border">
              <button onClick={() => setMobileView("editor")} className={segBtn(mobileView === "editor")} aria-pressed={mobileView === "editor"}>
                <Pencil className="h-4 w-4" /> Editor
              </button>
              <button onClick={() => setMobileView("preview")} className={segBtn(mobileView === "preview")} aria-pressed={mobileView === "preview"}>
                <Eye className="h-4 w-4" /> Vista previa
              </button>
            </div>
          </div>
        </header>

        {/* ── Layout: 1 col mobile (toggle) · 2 col desktop ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div className={`${mobileView === "editor" ? "block" : "hidden"} lg:block flex-1 overflow-y-auto lg:border-r border-border`}>
            {showJSONEditor ? (
              <JSONEditor value={planEditor.plan} onChange={handleJSONEditorChange} />
            ) : (
              <div className="p-4 sm:p-6">
                <Tabs defaultValue="basic" className="w-full" onValueChange={handleTabChange}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="basic">Asistido</TabsTrigger>
                    <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic">
                    <div id="metadata-form" className="space-y-6">
                      {config.hasManualForm ? (
                        <>
                          {/* Toggle IA / formulario manual */}
                          <div className="flex items-center justify-between gap-3 p-4 bg-primary-bg border border-border rounded-xl">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                                <Bot className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-text-primary">
                                  {useAIMode ? "Asistente con IA" : "Formulario manual"}
                                </h3>
                                <p className="text-xs text-text-tertiary">
                                  {useAIMode ? "Te guía paso a paso" : "Formulario tradicional"}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => setUseAIMode(!useAIMode)}
                              role="switch"
                              aria-checked={useAIMode}
                              aria-label="Alternar modo asistido con IA"
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary-bg ${
                                useAIMode ? "bg-accent" : "bg-text-quaternary"
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useAIMode ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </div>

                          {useAIMode ? (
                            <FitterOnboarding {...onboardingProps} />
                          ) : (
                            <>
                              <PlanMetadataForm onCopyPrompt={handleCopyPrompt} />
                              <div className="rounded-xl border border-border bg-primary-bg p-5">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="h-2 w-2 rounded-full bg-accent" />
                                  <h3 className="text-sm font-semibold text-text-primary">Cómo sigue</h3>
                                </div>
                                <p className="text-xs text-text-tertiary leading-relaxed">
                                  Completá los datos y generá el <strong className="text-text-primary">Prompt Maestro</strong> con "Copiar prompt para IA". Pegalo en ChatGPT o Claude para obtener el JSON.
                                </p>
                                <p className="text-xs text-text-tertiary leading-relaxed mt-3">
                                  Para ajustes manuales de semanas, días e ítems, usá la pestaña <strong className="text-text-primary">Avanzado</strong>.
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <FitterOnboarding {...onboardingProps} />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced">
                    <div className="space-y-4">
                      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                          <h3 className="text-sm font-semibold text-text-primary">Modo avanzado</h3>
                        </div>
                        <p className="text-xs text-text-tertiary leading-relaxed">
                          Editá manualmente la estructura de semanas, días e ítems (ABMC completo).
                        </p>
                      </div>
                      <WeekEditor />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className={`${mobileView === "preview" ? "block" : "hidden"} lg:block flex-1 overflow-y-auto bg-primary-surface`}>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-text-primary font-display mb-4">Vista previa</h3>
              <Preview />
            </div>
          </div>
        </div>
      </div>

      <ImportModal open={showImportModal} onClose={() => setShowImportModal(false)} onImport={handleImport} />
      <ExportModal open={showExportModal} onClose={() => setShowExportModal(false)} planData={planEditor.plan} />
      {isWorkout && (
        <PDFExportModal open={showPDFExportModal} onClose={() => setShowPDFExportModal(false)} onSelectType={handlePDFTypeSelect} />
      )}
    </PlanProvider>
  );
}
