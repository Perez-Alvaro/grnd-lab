/**
 * Grind-Lab - Routine Editor
 * Client-side only - No backend, no database
 * 2-Panel Layout: Form Editor | Preview
 */

import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileDown, MoreVertical, Copy, Code, FileJson, Download } from "lucide-react";
import { PlanProvider } from "../context/PlanContext.jsx";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import usePDFExport from "../hooks/usePDFExport.js";
import PlanMetadataForm from "../components/Trainer/editor/PlanMetadataForm.jsx";
import FitterOnboarding from "../components/Trainer/editor/FitterOnboarding.jsx";
import RoutinePreview from "../components/Trainer/preview/RoutinePreview.jsx";
import ImportModal from "../components/Editor/ImportModal.jsx";
import ExportModal from "../components/Editor/ExportModal.jsx";
import PDFExportModal from "../components/Editor/PDFExportModal.jsx";
import WeekEditor from "../components/Trainer/editor/WeekEditor.jsx";
import { Button } from "../components/ui";
import { copyPromptToClipboard } from "../utils/promptGenerator.js";
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
  updateWeekField: planEditor.updateWeekField,
  updateDayField: planEditor.updateDayField,
  setDayType: planEditor.setDayType,
  addExercise: planEditor.addExercise,
  duplicateExercise: planEditor.duplicateExercise,
  removeExercise: planEditor.removeExercise,
  updateExerciseField: planEditor.updateExerciseField,
});

export default function RoutineEditorPage() {
  const navigate = useNavigate();
  const exportPDF = usePDFExport();
  const snackbar = useSnackbar();

  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [showPDFExportModal, setShowPDFExportModal] = React.useState(false);
  const [showJSONEditor, setShowJSONEditor] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [useAIMode, setUseAIMode] = useState(true); // Default to AI mode
  const [showTutorial, setShowTutorial] = useState(false); // Control tutorial activation

  // Inicializar el editor sin templates previos (siempre nueva rutina)
  const planEditor = useRoutineEditor({
    template: null,
    templateId: null,
    existingTemplate: null,
  });

  const planContextValue = useMemo(
    () => buildContextValue(planEditor),
    [planEditor],
  );

  const handleBack = useCallback(() => {
    if (
      planEditor.dirty &&
      !window.confirm("Hay cambios sin guardar. ¿Desea salir igualmente?")
    ) {
      return;
    }
    navigate("/");
  }, [navigate, planEditor.dirty]);

  const handleExportPdf = useCallback(() => {
    // Abrir modal de selección de tipo de PDF
    setShowPDFExportModal(true);
  }, []);

  const handlePDFTypeSelect = useCallback(async (type) => {
    try {
      console.log(`Exporting PDF as ${type} with planForPdf:`, planEditor.planForPdf);
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
    } catch (error) {
      console.error("Import error:", error);
      snackbar.error(TUTORIAL_SNACKBARS.jsonError);
    }
  }, [planEditor, snackbar]);

  const handleCopyPrompt = useCallback(async () => {
    try {
      const success = await copyPromptToClipboard(planEditor.metadata);
      if (success) {
        snackbar.success(TUTORIAL_SNACKBARS.promptCopied, 6000);
      } else {
        snackbar.error("No se pudo copiar el prompt");
      }
    } catch (error) {
      console.error("Error copiando prompt:", error);
      snackbar.error("Error al copiar el prompt");
    }
  }, [planEditor.metadata, snackbar]);

  const handleJSONEditorChange = useCallback((parsedJSON) => {
    try {
      planEditor.loadPlan(parsedJSON);
      snackbar.success(TUTORIAL_SNACKBARS.jsonLoaded);
    } catch (error) {
      console.error("Error al aplicar JSON:", error);
      snackbar.error(TUTORIAL_SNACKBARS.jsonError);
    }
  }, [planEditor, snackbar]);

  // Handler para cuando se cambia a la pestaña avanzada
  const handleTabChange = useCallback((value) => {
    if (value === 'advanced') {
      setShowTutorial(true);
    }
  }, []);

  return (
    <PlanProvider value={planContextValue}>
      <div className="flex h-screen flex-col bg-primary-bg overflow-hidden">
        {/* Tutorial Overlay - Solo se muestra si showTutorial es true */}
        <TutorialOverlay shouldShow={showTutorial} />

        {/* Top Bar */}
        <header className="flex-shrink-0 border-b border-border bg-primary-surface">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-text-primary font-display">
                  BaseRutina - Editor de Rutinas
                </h1>
                <p className="text-sm text-text-muted">
                  {planEditor.metadata.name || 'Rutina sin nombre'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              <Button
                id="export-pdf-button"
                variant="accent"
                size="sm"
                onClick={handleExportPdf}
              >
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>

                {showToolsMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-secondary-bg border border-border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        handleCopyPrompt();
                        setShowToolsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary-bg hover:bg-primary-bg/80 transition-colors text-sm text-text-primary border-b border-border"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar Prompt para IA
                    </button>
                    <button
                      onClick={() => {
                        setShowJSONEditor(!showJSONEditor);
                        setShowToolsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary-bg hover:bg-primary-bg/80 transition-colors text-sm text-text-primary border-b border-border"
                    >
                      <Code className="h-4 w-4" />
                      Editor JSON
                    </button>
                    <button
                      onClick={() => {
                        setShowImportModal(true);
                        setShowToolsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary-bg hover:bg-primary-bg/80 transition-colors text-sm text-text-primary border-b border-border"
                    >
                      <FileJson className="h-4 w-4" />
                      Importar JSON
                    </button>
                    <button
                      onClick={() => {
                        setShowExportModal(true);
                        setShowToolsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary-bg hover:bg-primary-bg/80 transition-colors text-sm text-text-primary"
                    >
                      <Download className="h-4 w-4" />
                      Exportar JSON
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 2-Panel Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - JSON Editor o Form Editor */}
          <div className="flex-1 overflow-y-auto border-r border-border">
            {showJSONEditor ? (
              <JSONEditor
                value={planEditor.plan}
                onChange={handleJSONEditorChange}
              />
            ) : (
              <div className="p-6">
                <Tabs defaultValue="basic" className="w-full" onValueChange={handleTabChange}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="basic">
                      Configuración Básica
                    </TabsTrigger>
                    <TabsTrigger value="advanced">
                      Configuración Avanzada
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic">
                    <div id="metadata-form" className="space-y-6">
                      {/* Toggle Switch between AI Mode and Advanced Form */}
                      <div className="flex items-center justify-between p-4 bg-[#0E0E0E] border border-[#2E2E2E] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                            <span className="text-lg">🤖</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              {useAIMode ? "Modo Asistido con IA" : "Modo Avanzado"}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {useAIMode
                                ? "Fitter te guía paso a paso"
                                : "Formulario completo tradicional"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setUseAIMode(!useAIMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#0E0E0E] ${useAIMode ? 'bg-accent' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useAIMode ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      {/* Conditional Rendering: AI Mode or Traditional Form */}
                      {useAIMode ? (
                        <FitterOnboarding
                          onCopyPrompt={handleCopyPrompt}
                          onImportJSON={handleImport}
                        />
                      ) : (
                        <>
                          <PlanMetadataForm onCopyPrompt={handleCopyPrompt} />

                          <div className="rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] p-5">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-2 w-2 rounded-full bg-accent"></div>
                              <h3 className="text-sm font-semibold text-white">
                                Información Importante
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              Completá los datos básicos de la plantilla y luego generá el <strong>Prompt Maestro</strong> usando el botón "Copiar Prompt para IA". Pegalo en ChatGPT o Claude para obtener el JSON de la rutina completa.
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed mt-3">
                              Si necesitás hacer ajustes manuales en la estructura de semanas, días y ejercicios, usá la pestaña <strong>"Configuración Avanzada"</strong>.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced">
                    <div className="space-y-4">
                      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-accent"></div>
                          <h3 className="text-sm font-semibold text-white">
                            Modo Avanzado Activado
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Ahora podés editar manualmente la estructura de semanas, días y ejercicios (ABMC completo). Estos cambios son avanzados y requieren conocimiento del sistema.
                        </p>
                      </div>
                      <WeekEditor />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 overflow-y-auto bg-primary-surface">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-text-primary font-display mb-4">
                Vista Previa
              </h3>
              <RoutinePreview />
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
      />

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        planData={planEditor.plan}
      />

      {/* PDF Export Type Selection Modal */}
      <PDFExportModal
        open={showPDFExportModal}
        onClose={() => setShowPDFExportModal(false)}
        onSelectType={handlePDFTypeSelect}
      />
    </PlanProvider>
  );
}
