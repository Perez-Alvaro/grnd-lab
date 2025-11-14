import { useMemo, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, FileDown } from "lucide-react";
import { PlanProvider } from "../context/PlanContext.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import useRoutineEditor from "../hooks/useRoutineEditor.js";
import useRoutineSync from "../hooks/useRoutineSync.js";
import usePDFExport from "../hooks/usePDFExport.js";
import PlanMetadataForm from "../components/Trainer/editor/PlanMetadataForm.jsx";
import WeekEditor from "../components/Trainer/editor/WeekEditor.jsx";
import RoutinePreview from "../components/Trainer/preview/RoutinePreview.jsx";
import migrateTemplate from "../utils/migrateTemplate.ts";
import { toast } from "../utils/toast.js";

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
  const exportPlan = usePDFExport();

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

  const weekRefs = useRef({});
  const registerWeekRef = useCallback(
    (weekId) => (node) => {
      if (node) {
        weekRefs.current[weekId] = node;
      } else {
        delete weekRefs.current[weekId];
      }
    },
    [],
  );

  const handleNavigateWeek = useCallback((weekId) => {
    const target = weekRefs.current[weekId];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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
        toast.success("Plantilla actualizada correctamente.");
      } else {
        const created = await addRoutine(payload);
        toast.success("Plantilla creada correctamente.");
        if (!id || id === "nueva") {
          navigate(`/admin/plantillas/${created.id}/editar`, {
            replace: true,
          });
        }
      }

      planEditor.markAsSaved();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar la plantilla. Intenta nuevamente.");
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
    const { isValid, errors } = planEditor.validatePlan();
    if (!isValid) {
      handleValidationErrors(errors);
      return;
    }
    try {
      await exportPlan(planEditor.planForPdf);
      toast.success("Exportando plan a PDF.");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo exportar el PDF en este momento.");
    }
  }, [exportPlan, handleValidationErrors, planEditor]);

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

  const onActionError = useCallback((message) => toast.error(message), []);

  const isEditing = Boolean(existing);

  return (
    <PlanProvider value={planContextValue}>
      <div className="w-full bg-transparent">
        <header className="border-b border-[#2E2E2E] bg-[#0E0E0E]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
              >
                <ArrowLeft className="h-4 w-4" /> Volver
              </button>
              <h1 className="text-2xl font-bold text-white">
                Editor de Planes
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 hover:bg-accent-strong"
              >
                <Save className="h-4 w-4" />
                {isEditing ? "Actualizar plantilla" : "Guardar plantilla"}
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-2 rounded-full border border-[#2E2E2E] px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-accent/60 hover:text-white"
              >
                <FileDown className="h-4 w-4" /> Exportar PDF
              </button>
            </div>
          </div>
        </header>

        <div className="px-3 sm:px-6">
          <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-6 px-4 py-8 sm:px-6 lg:px-6">
            <section className="lg:w-1/2 flex flex-col gap-6">
              <PlanMetadataForm />
              <WeekEditor
                onNavigateWeek={handleNavigateWeek}
                registerWeekRef={registerWeekRef}
                onActionError={onActionError}
              />
            </section>
            <aside className="lg:w-1/2 sticky top-0 max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 lg:p-6">
              <RoutinePreview />
            </aside>
          </div>
        </div>
      </div>

    </PlanProvider>
  );
}
