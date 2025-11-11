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
    <div className="space-y-4 rounded-xl border border-[#787878]/20 bg-[#1A1A1A] p-4" data-testid="exercise-editor">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <label className="text-xs uppercase tracking-wide text-[#787878]">Ejercicio</label>
          <input
            type="text"
            value={exercise.name}
            onChange={handleChange('name')}
            placeholder="Nombre del ejercicio"
            className="mt-1 w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          <label className="text-xs uppercase tracking-wide text-[#787878]">Series</label>
          <input
            type="text"
            value={exercise.sets}
            onChange={handleChange('sets')}
            className="col-span-2 rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          <label className="text-xs uppercase tracking-wide text-[#787878]">Reps</label>
          <input
            type="text"
            value={exercise.reps}
            onChange={handleChange('reps')}
            className="col-span-2 rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          <label className="text-xs uppercase tracking-wide text-[#787878]">Desc</label>
          <input
            type="text"
            value={exercise.rest}
            onChange={handleChange('rest')}
            className="col-span-2 rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          <label className="text-xs uppercase tracking-wide text-[#787878]">RIR</label>
          <input
            type="text"
            value={exercise.rir}
            onChange={handleChange('rir')}
            className="col-span-2 rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:col-span-1">
          <label className="text-xs uppercase tracking-wide text-[#787878]">Cadencia</label>
          <input
            type="text"
            value={exercise.tempo}
            onChange={handleChange('tempo')}
            className="col-span-2 rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="lg:col-span-3">
          <label className="text-xs uppercase tracking-wide text-[#787878] mb-1 lg:hidden">Video o recurso</label>
          <input
            type="url"
            value={exercise.video}
            onChange={handleChange('video')}
            placeholder="URL del video"
            className="w-full rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="lg:col-span-12">
          <label className="text-xs uppercase tracking-wide text-[#787878] mb-1">Notas específicas</label>
          <textarea
            rows={2}
            value={exercise.note}
            onChange={handleChange('note')}
            className="w-full resize-none rounded-lg border border-[#787878]/30 bg-[#202020] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleDuplicate}
          className="inline-flex items-center gap-1 rounded-lg border border-[#787878]/40 px-3 py-1 text-xs text-[#CBFF00] hover:border-[#CBFF00] transition-colors"
        >
          <Copy className="h-4 w-4" /> Duplicar ejercicio
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:border-red-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Eliminar
        </button>
      </div>
    </div>
  );
});

ExerciseEditor.displayName = 'ExerciseEditor';

export default ExerciseEditor;
