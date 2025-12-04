/**
 * Routine Forge - Routine Editor
 *  2-Panel Layout: Form Editor | PDF Preview
 */

import React, { useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, FileDown, FileJson, Download } from "lucide-react";
import { PlanProvider } from "../context/PlanContext.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import useRoutineSync from "../hooks/useRoutineSync.js";
import usePDFExport from "../hooks/usePDFExport.js";
import PlanMetadataForm from "../components/Trainer/editor/PlanMetadataForm.jsx";
import RoutinePreview from "../components/Trainer/preview/RoutinePreview.jsx";
import ImportModal from "../components/Editor/ImportModal.jsx";
import ExportModal from "../components/Editor/ExportModal.jsx";
import WeekEditor from "../components/Trainer/editor/WeekEditor.jsx";
import migrateTemplate from "../utils/migrateTemplate.ts";
import { toast } from "../utils/toast.js";
import { Button } from "../components/ui";

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
  const { id } = useParams();
  const { state } = useAppContext();
  const { addRoutine, updateRoutine } = useRoutineSync();
  const exportPDF = usePDFExport();

  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showExportModal, setShowExportModal] = React.useState(false);

  const existing = useMemo(
    () =>
      id
        ? state.routines.find((template) => String(template.id) === String(id))
        : null,
    [id, state.routines],
  );

  const migratedTemplate = useMemo(() => migrateTemplate(existing), [existing]);

  const planEditor = useRoutineEditor({
    template: migratedTemplate,
    templateId: id,
    existingTemplate: existing,
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
    navigate("/admin");
  }, [navigate, planEditor.dirty]);

  const handleValidationErrors = useCallback((errors) => {
    errors.forEach((message) => toast.error(message));
  }, []);

  const handleSave = useCallback(async () => {
    const { isValid, errors } = planEditor.validatePlan();
    if (!isValid) {
      handleValidationErrors(errors);
      return;
    }

    try {
      const payload = planEditor.buildTemplatePayload();
      if (existing) {
        await updateRoutine(payload.id, payload);
        toast.success("Rutina actualizada correctamente");
      } else {
        const created = await addRoutine(payload);
        toast.success("Rutina creada correctamente");
        if (!id || id === "nueva") {
          navigate(`/admin/plantillas/${created.id}/editar`, {
            replace: true,
          });
        }
      }

      planEditor.markAsSaved();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar la rutina");
    }
  }, [
    addRoutine,
    existing,
    handleValidationErrors,
    id,
    navigate,
    planEditor,
    updateRoutine,
  ]);

  const handleExportPdf = useCallback(async () => {
    try {
      console.log("Exporting PDF with plan:", planEditor.plan);
      await exportPDF(planEditor.plan);
      toast.success("PDF exportado correctamente");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error(`Error: ${error.message || "No se pudo exportar el PDF"}`);
    }
  }, [exportPDF, planEditor.plan]);

  const handleImport = useCallback((importedData) => {
    // TODO: Implement import logic to update planEditor state
    console.log("Import data:", importedData);
    toast.success("Rutina importada correctamente");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const isEditing = Boolean(existing);

  return (
    <PlanProvider value={planContextValue}>
      <div className="flex h-screen flex-col bg-primary-bg overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 border-b border-border bg-primary-surface">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-text-primary font-display">
                  {isEditing ? 'Editar Rutina' : 'Nueva Rutina'}
                </h1>
                <p className="text-sm text-text-muted">
                  {planEditor.metadata.name || 'Rutina sin nombre'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowImportModal(true)}>
                <FileJson className="h-4 w-4" />
                Importar JSON
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowExportModal(true)}>
                <Download className="h-4 w-4" />
                Exportar JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                {isEditing ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </div>
        </header>

        {/* 2-Panel Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Form Editor (50%) */}
          <div className="flex-1 overflow-y-auto border-r border-border">
            <div className="p-6 space-y-6">
              <PlanMetadataForm />
              <WeekEditor />
            </div>
          </div>

          {/* Right Panel - PDF Preview (50%) */}
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
    </PlanProvider>
  );
}
