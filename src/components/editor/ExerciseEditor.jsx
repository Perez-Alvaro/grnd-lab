import { memo, useCallback } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { usePlanContext } from '../../context/PlanContext.jsx';

const ExerciseEditor = memo(({ weekId, dayId, exercise, onActionError }) => {
  const { updateExerciseField, duplicateExercise, removeExercise } = usePlanContext();

  const handleChange = useCallback(
    field => event => {
      updateExerciseField(weekId, dayId, exercise.id, field, event.target.value);
    },
    [dayId, exercise.id, updateExerciseField, weekId]
  );

  const handleDuplicate = useCallback(() => {
    duplicateExercise(weekId, dayId, exercise.id);
  }, [dayId, duplicateExercise, exercise.id, weekId]);

  const handleRemove = useCallback(() => {
    const { error } = removeExercise(weekId, dayId, exercise.id);
    if (error && onActionError) {
      onActionError(error);
    }
  }, [dayId, exercise.id, onActionError, removeExercise, weekId]);

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-[#787878]/25 bg-[#1A1A1A] p-3 transition-all duration-150 ease-in-out hover:border-[#CBFF00]/40 hover:bg-[#1D1D1D] sm:p-4"
      data-testid="exercise-editor"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-6 sm:[grid-template-columns:2.4fr_repeat(4,_minmax(0,_1fr))_2.2fr]">
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Ejercicio</label>
          <input
            type="text"
            value={exercise.name}
            onChange={handleChange('name')}
            placeholder="Nombre del ejercicio"
            className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Series</label>
          <input
            type="text"
            value={exercise.sets}
            onChange={handleChange('sets')}
            className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Reps</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={exercise.reps}
              onChange={handleChange('reps')}
              className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
              placeholder="Reps"
            />
            <input
              type="text"
              value={exercise.rir}
              onChange={handleChange('rir')}
              className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
              placeholder="RIR"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Desc</label>
          <input
            type="text"
            value={exercise.rest}
            onChange={handleChange('rest')}
            className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Cadencia</label>
          <input
            type="text"
            value={exercise.tempo}
            onChange={handleChange('tempo')}
            className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Video</label>
          <input
            type="url"
            value={exercise.video}
            onChange={handleChange('video')}
            placeholder="URL del video"
            className="h-10 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Notas específicas</label>
        <textarea
          rows={2}
          value={exercise.note}
          onChange={handleChange('note')}
          className="min-h-[80px] w-full resize-none rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
        />
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-[#787878]">Gestioná este ejercicio rápidamente</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDuplicate}
            className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg border border-[#787878]/40 px-3 py-2 text-sm font-semibold text-[#CBFF00] transition-all duration-150 ease-in-out hover:border-[#CBFF00] hover:bg-[#1F1F1F]"
          >
            <Copy className="h-4 w-4" /> Duplicar ejercicio
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400 transition-all duration-150 ease-in-out hover:border-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
});

ExerciseEditor.displayName = 'ExerciseEditor';

export default ExerciseEditor;
