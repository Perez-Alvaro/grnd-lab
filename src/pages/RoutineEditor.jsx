/**
 * Mock - Editor de planes (parametrizado por planType: 'workout' | 'nutrition').
 * Mobile-first: 1 columna en mobile con toggle Editor ↔ Vista previa;
 * dos columnas lado a lado en desktop (lg+).
 * El tipo se resuelve por ?planType= (default 'workout'); toda la config
 * (hoja, preview, steps, prompt, persistencia) viene de src/config/planTypes.js.
 */

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IconArrowLeft, IconFileDownload, IconDotsVertical, IconCopy, IconCode, IconJson, IconDownload, IconDeviceFloppy, IconPencil, IconEye, IconSparkles, IconAdjustments } from '@tabler/icons-react';
import { PlanProvider } from "../context/PlanContext.jsx";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import { getPlanTypeConfig } from "../config/planTypes.js";
import usePDFExport from "../hooks/usePDFExport.js";
import PlanMetadataForm from "../components/Trainer/editor/PlanMetadataForm.jsx";
import StepsMetadataForm from "../components/Trainer/editor/StepsMetadataForm.jsx";
import FitterOnboarding from "../components/Trainer/editor/FitterOnboarding.jsx";
import ImportModal from "../components/Editor/ImportModal.jsx";
import ExportModal from "../components/Editor/ExportModal.jsx";
import PDFExportModal from "../components/Editor/PDFExportModal.jsx";
import WeekEditor from "../components/Trainer/editor/WeekEditor.jsx";
import { Button } from "../components/ui";
import JSONEditor from "../components/Editor/JSONEditor.jsx";
import { useSnackbar, TUTORIAL_SNACKBARS } from "../components/Tutorial/Snackbar.jsx";
import { trackEvent } from "../lib/usage.js";

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
  setWeeksOrder: planEditor.setWeeksOrder,
  setDaysOrder: planEditor.setDaysOrder,
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

// ¿El borrador local ya tiene un plan GENERADO (algún ítem con nombre)?
// Sirve para decidir el modo inicial del editor: si ya hay un plan, se abre
// directo el editor a mano (el cuestionario ya cumplió); si no, el cuestionario.
// Ojo: un plan nuevo tiene días con ítems vacíos (name: ""), así que no cuentan.
const draftHasGeneratedPlan = (leafKey) => {
  try {
    const raw = localStorage.getItem(`plan-editor-draft-${leafKey}-new`);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return (data?.weeks || []).some((w) =>
      (w?.days || []).some((day) =>
        (day?.[leafKey] || []).some((it) => (it?.name || "").trim() !== "")
      )
    );
  } catch {
    return false;
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
  // Un único selector de modo. Antes había tres apilados (Editor↔Preview,
  // Asistido↔Avanzado, IA↔Manual) y dos de ellos eran el mismo eje.
  // El cuestionario corre UNA sola vez. Si estás editando un plan existente, o
  // el borrador ya tiene un plan generado, se abre directo el editor a mano
  // con todo cargado (no se vuelve a mostrar el preguntero).
  const [editorMode, setEditorMode] = useState(() => {
    const editingExisting = !!(searchParams.get("planId") || searchParams.get("routineId"));
    return editingExisting || draftHasGeneratedPlan(config.leaf.key) ? "manual" : "ai";
  }); // 'ai' | 'manual'
  const [mobileView, setMobileView] = useState("editor"); // 'editor' | 'preview' (solo mobile)

  // Uso por editor (workout vs nutrition) para el dashboard del admin
  useEffect(() => {
    trackEvent("editor_open", config.id);
  }, [config.id]);

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
      trackEvent("plan_saved", config.id);
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
        trackEvent("pdf_export", config.id);
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
      trackEvent("pdf_export", config.id);
      snackbar.success(TUTORIAL_SNACKBARS.pdfExported);
    } catch (error) {
      console.error("PDF Export Error:", error);
      snackbar.error(`Error: ${error.message || "No se pudo exportar el PDF"}`);
    }
  }, [exportPDF, planEditor.planForPdf, snackbar, config.id]);

  const handleImport = useCallback((importedData) => {
    try {
      // expandToDuration: en nutrición, replica el bloque modelo por mes según
      // la duración elegida en la encuesta (el round-trip de carga NO lo hace).
      planEditor.loadPlan(importedData, { expandToDuration: true });
      // El cuestionario cumplió: pasamos al editor a mano con todo cargado.
      // Al recargar, draftHasGeneratedPlan() mantiene este modo.
      setEditorMode("manual");
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

  const goToPreview = useCallback(() => setMobileView("preview"), []);
  const goToEditor = useCallback(() => setMobileView("editor"), []);

  const onboardingProps = {
    onCopyPrompt: handleCopyPrompt,
    onImportJSON: handleImport,
    steps: config.steps,
    generatePrompt: config.generatePrompt,
    importFn: config.importFromAI,
    planTypeId: config.id, // separa el paso guardado de rutina vs nutrición
    // "Paso 3": qué hacer una vez que el plan quedó cargado.
    onGoToPreview: goToPreview,
    onExportPdf: (isWorkout || config.pdfExport) ? handleExportPdf : null,
    onSave: handleSave,
    planNoun: config.labels.singular,
  };

  const canExportPdf = isWorkout || Boolean(config.pdfExport);
  const hasContent = planEditor.weeks.length > 0;

  const menuItem =
    "w-full flex items-center gap-3 px-4 py-3 min-h-[48px] hover:bg-primary-bg transition-colors text-sm text-text-primary text-left";

  const segBtn = (active) =>
    `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
      active ? "bg-accent text-primary-bg shadow-sm" : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <PlanProvider value={planContextValue}>
      <div className="flex h-dvh flex-col bg-primary-bg overflow-hidden">
        {/* ── Top bar ── */}
        <header className="flex-shrink-0 border-b border-border bg-primary-surface">
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Volver al panel">
                <IconArrowLeft stroke={1.75} className="h-4 w-4" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-semibold text-text-primary font-display truncate max-w-[45vw] sm:max-w-none">
                  {planEditor.metadata.name || config.labels.untitled}
                </h1>
                {/* El coach necesita saber si le falta guardar (dirty existía pero no se mostraba). */}
                <p className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${planEditor.dirty ? "bg-warning" : "bg-success"}`} />
                  {planEditor.dirty ? "Sin guardar" : "Guardado"}
                  <span className="hidden sm:inline">· {config.labels.editorSubtitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative flex-shrink-0">
              {/* En mobile estas dos acciones viven en la barra inferior (zona del pulgar). */}
              {canExportPdf && (
                <Button variant="ghost" size="sm" onClick={handleExportPdf} className="hidden lg:inline-flex">
                  <IconFileDownload stroke={1.75} className="h-4 w-4" /> Exportar PDF
                </Button>
              )}
              <Button variant="accent" size="sm" onClick={handleSave} loading={saving} className="hidden lg:inline-flex">
                <IconDeviceFloppy stroke={1.75} className="h-4 w-4" /> Guardar
              </Button>

              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setShowToolsMenu(!showToolsMenu)} aria-label="Más opciones">
                  <IconDotsVertical stroke={1.75} className="h-5 w-5" />
                </Button>

                {showToolsMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowToolsMenu(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-64 bg-primary-surface border border-border rounded-xl shadow-xl shadow-black/30 z-50 overflow-hidden py-1">
                      <button onClick={() => { handleCopyPrompt(); setShowToolsMenu(false); }} className={menuItem}>
                        <IconCopy stroke={1.75} className="h-4 w-4 flex-shrink-0 text-text-tertiary" /> Copiar el prompt
                      </button>
                      <button onClick={() => { setShowImportModal(true); setShowToolsMenu(false); }} className={menuItem}>
                        <IconJson stroke={1.75} className="h-4 w-4 flex-shrink-0 text-text-tertiary" /> Pegar respuesta de la IA
                      </button>
                      <div className="my-1 border-t border-border" />
                      <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-text-quaternary">Avanzado</p>
                      <button onClick={() => { setShowExportModal(true); setShowToolsMenu(false); }} className={menuItem}>
                        <IconDownload stroke={1.75} className="h-4 w-4 flex-shrink-0 text-text-tertiary" /> Descargar copia de respaldo
                      </button>
                      <button onClick={() => { setShowJSONEditor(!showJSONEditor); setShowToolsMenu(false); }} className={menuItem}>
                        <IconCode stroke={1.75} className="h-4 w-4 flex-shrink-0 text-text-tertiary" /> {showJSONEditor ? "Cerrar el código del plan" : "Editar el código del plan"}
                      </button>
                    </div>
                  </>
                )}
              </div>
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
              <div className="p-4 pb-28 sm:p-6 lg:pb-6">
                {/* Un solo selector: cómo querés armar el plan. */}
                <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-primary-bg p-1">
                  <button onClick={() => setEditorMode("ai")} className={segBtn(editorMode === "ai")} aria-pressed={editorMode === "ai"}>
                    <IconSparkles stroke={1.75} className="h-4 w-4" /> Crear con IA
                  </button>
                  <button onClick={() => setEditorMode("manual")} className={segBtn(editorMode === "manual")} aria-pressed={editorMode === "manual"}>
                    <IconAdjustments stroke={1.75} className="h-4 w-4" /> Editar a mano
                  </button>
                </div>

                {editorMode === "ai" ? (
                  <div id="metadata-form">
                    <FitterOnboarding {...onboardingProps} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {config.hasManualForm ? (
                      <PlanMetadataForm onCopyPrompt={handleCopyPrompt} />
                    ) : (
                      // Nutrición (y cualquier editor sin form propio): metadata
                      // editable a partir de los mismos pasos del onboarding, para
                      // poder cambiar el título y demás al reeditar un plan.
                      <StepsMetadataForm steps={config.steps} onCopyPrompt={handleCopyPrompt} />
                    )}
                    <WeekEditor />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className={`${mobileView === "preview" ? "block" : "hidden"} lg:block flex-1 overflow-y-auto bg-primary-surface`}>
            <div className="p-4 pb-28 sm:p-6 lg:pb-6">
              <h3 className="text-lg font-semibold text-text-primary font-display mb-4">Vista previa</h3>
              <Preview onGoToAssistant={() => { setEditorMode("ai"); goToEditor(); }} />
            </div>
          </div>
        </div>

        {/* ── Barra de acción inferior (mobile/tablet) ──
            Las acciones principales viven en la zona del pulgar y cambian
            según dónde está el usuario: en el editor ofrece ver el plan;
            mirando el plan ofrece descargarlo. */}
        <div className="lg:hidden flex-shrink-0 border-t border-border bg-primary-surface pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center gap-3 px-4 py-3">
            {mobileView === "editor" ? (
              <>
                <Button variant="outline" size="md" onClick={handleSave} loading={saving} className="flex-1">
                  <IconDeviceFloppy stroke={1.75} className="h-4 w-4" /> Guardar
                </Button>
                <Button variant="accent" size="md" onClick={goToPreview} className="flex-1">
                  <IconEye stroke={1.75} className="h-4 w-4" /> Ver el plan
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="md" onClick={goToEditor} className="flex-1">
                  <IconPencil stroke={1.75} className="h-4 w-4" /> Editar
                </Button>
                {canExportPdf && (
                  <Button variant="accent" size="md" onClick={handleExportPdf} disabled={!hasContent} className="flex-1">
                    <IconFileDownload stroke={1.75} className="h-4 w-4" /> Descargar PDF
                  </Button>
                )}
              </>
            )}
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
