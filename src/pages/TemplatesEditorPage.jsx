import { useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileDown } from 'lucide-react';
import { PlanProvider } from '../context/PlanContext.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import usePlanEditor from '../hooks/usePlanEditor.js';
import usePDFExport from '../hooks/usePDFExport.js';
import PlanMetadataForm from '../components/editor/PlanMetadataForm.jsx';
import WeekEditor from '../components/editor/WeekEditor.jsx';
import RoutinePreview from '../components/preview/RoutinePreview.jsx';
import EditorActionBar from '../components/editor/EditorActionBar.jsx';
import migrateTemplate from '../utils/migrateTemplate.ts';
import { toast } from '../utils/toast.js';
import { savePlan, updatePlan } from '../services/planService.js';

const buildContextValue = planEditor => ({
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
  updateExerciseField: planEditor.updateExerciseField
});

export default function TemplatesEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const exportPlan = usePDFExport();

  const existing = useMemo(
    () => (id ? state.templates.find(template => String(template.id) === String(id)) : null),
    [id, state.templates]
  );

  const migratedTemplate = useMemo(() => migrateTemplate(existing), [existing]);

  const planEditor = usePlanEditor({ template: migratedTemplate, templateId: id, existingTemplate: existing });

  const planContextValue = useMemo(
    () => buildContextValue(planEditor),
    [
      planEditor.plan,
      planEditor.metadata,
      planEditor.weeks,
      planEditor.updateMetadata,
      planEditor.addWeek,
      planEditor.duplicateWeek,
      planEditor.removeWeek,
      planEditor.addDay,
      planEditor.duplicateDay,
      planEditor.removeDay,
      planEditor.updateWeekField,
      planEditor.updateDayField,
      planEditor.setDayType,
      planEditor.addExercise,
      planEditor.duplicateExercise,
      planEditor.removeExercise,
      planEditor.updateExerciseField
    ]
  );

  const weekRefs = useRef({});
  const registerWeekRef = useCallback(weekId => node => {
    if (node) {
      weekRefs.current[weekId] = node;
    } else {
      delete weekRefs.current[weekId];
    }
  }, []);

  const handleNavigateWeek = useCallback(weekId => {
    const target = weekRefs.current[weekId];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleBack = useCallback(() => {
    if (planEditor.dirty && !window.confirm('Hay cambios sin guardar. ¿Desea salir igualmente?')) {
      return;
    }
    navigate('/admin');
  }, [navigate, planEditor.dirty]);

  const handleValidationErrors = useCallback(errors => {
    errors.forEach(message => toast.error(message));
  }, []);

  const handleSave = useCallback(async () => {
    const { isValid, errors } = planEditor.validatePlan();
    if (!isValid) {
      handleValidationErrors(errors);
      return;
    }

    try {
      const payload = planEditor.buildTemplatePayload();
      const persisted = existing
        ? await updatePlan(payload.id, payload)
        : await savePlan(payload);

      if (existing) {
        dispatch({ type: 'UPDATE_TEMPLATE', payload: persisted });
        toast.success('Plantilla actualizada correctamente.');
      } else {
        dispatch({ type: 'ADD_TEMPLATE', payload: persisted });
        toast.success('Plantilla creada correctamente.');
        if (!id || id === 'nueva') {
          navigate(`/admin/plantillas/${persisted.id}/editar`, { replace: true });
        }
      }

      planEditor.markAsSaved();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo guardar la plantilla. Intenta nuevamente.');
    }
  }, [dispatch, existing, handleValidationErrors, id, navigate, planEditor]);

  const handleExportPdf = useCallback(async () => {
    const { isValid, errors } = planEditor.validatePlan();
    if (!isValid) {
      handleValidationErrors(errors);
      return;
    }
    try {
      await exportPlan(planEditor.planForPdf);
      toast.success('Exportando plan a PDF.');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo exportar el PDF en este momento.');
    }
  }, [exportPlan, handleValidationErrors, planEditor]);

  useEffect(() => {
    const handleKeyDown = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const onActionError = useCallback(message => toast.error(message), []);

  const isEditing = Boolean(existing);

  return (
    <PlanProvider value={planContextValue}>
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-2 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2D2D2D]"
            >
              <ArrowLeft className="h-4 w-4" /> Volver
            </button>
            <h1 className="text-2xl font-bold">Editor de Planes</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-[#CBFF00] px-4 py-2 font-semibold text-[#1A1A1A] transition-colors hover:bg-[#DBFE52]"
            >
              <Save className="h-4 w-4" />
              {isEditing ? 'Actualizar plantilla' : 'Guardar plantilla'}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-2 rounded-xl border border-[#CBFF00]/40 bg-[#1A1A1A] px-4 py-2 font-semibold text-[#CBFF00] transition-colors hover:border-[#CBFF00] hover:bg-[#CBFF00] hover:text-black"
            >
              <FileDown className="h-4 w-4" /> Exportar PDF
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-6 lg:w-1/3">
            <PlanMetadataForm />
            <WeekEditor onNavigateWeek={handleNavigateWeek} registerWeekRef={registerWeekRef} onActionError={onActionError} />
          </div>
          <div className="w-full lg:w-2/3">
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl border border-[#787878]/20 bg-[#161616] p-4 lg:p-6">
              <RoutinePreview />
            </div>
          </div>
        </div>
      </div>

      <EditorActionBar dirty={planEditor.dirty} onSave={handleSave} onPdf={handleExportPdf} onBack={handleBack} />
    </PlanProvider>
  );
}
