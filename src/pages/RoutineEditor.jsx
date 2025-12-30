/**
 * Grind-Lab - Routine Editor
 * Client-side only - No backend, no database
 * 2-Panel Layout: Form Editor | Preview
 */

import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileDown, FileJson, Download, Copy, Code } from "lucide-react";
import { PlanProvider } from "../context/PlanContext.jsx";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import usePDFExport from "../hooks/usePDFExport.js";
import PlanMetadataForm from "../components/Trainer/editor/PlanMetadataForm.jsx";
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

  return (
    <PlanProvider value={planContextValue}>
      <div className="flex h-screen flex-col bg-primary-bg overflow-hidden">
        {/* Tutorial Overlay */}
        <TutorialOverlay />

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
                  Grind-Lab - Editor de Rutinas
                </h1>
                <p className="text-sm text-text-muted">
                  {planEditor.metadata.name || 'Rutina sin nombre'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                id="copy-prompt-button"
                variant="accent"
                size="sm"
                onClick={handleCopyPrompt}
              >
                <Copy className="h-4 w-4" />
                Copiar Prompt para IA
              </Button>
              <Button
                id="json-editor-button"
                variant={showJSONEditor ? "default" : "outline"}
                size="sm"
                onClick={() => setShowJSONEditor(!showJSONEditor)}
              >
                <Code className="h-4 w-4" />
                {showJSONEditor ? 'Modo Visual' : 'Editor JSON'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowImportModal(true)}>
                <FileJson className="h-4 w-4" />
                Importar JSON
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4" />
                Exportar JSON
              </Button>
              <Button
                id="export-pdf-button"
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
              >
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </Button>
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
              <div id="metadata-form" className="p-6 space-y-6">
                <PlanMetadataForm />
                <WeekEditor />
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
