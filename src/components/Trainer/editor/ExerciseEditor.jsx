import { memo, useCallback } from "react";
import { Copy, Trash2 } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";

const ExerciseEditor = memo(({ weekId, dayId, exercise, onActionError }) => {
  const { updateExerciseField, duplicateExercise, removeExercise } =
    usePlanContext();

  const handleChange = useCallback(
    (field) => (event) => {
      updateExerciseField(
        weekId,
        dayId,
        exercise.id,
        field,
        event.target.value,
      );
    },
    [dayId, exercise.id, updateExerciseField, weekId],
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

  const labelClasses =
    "text-xs font-semibold uppercase tracking-wide text-neutral-500";
  const inputClasses =
    "h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white transition-colors focus:border-[#B5FF00] focus:outline-none focus:ring-0";

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 shadow-sm transition-colors duration-200 ease-in-out hover:border-[#B5FF00]/40 hover:bg-neutral-900"
      data-testid="exercise-editor"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className={labelClasses}>Ejercicio</label>
          <input
            type="text"
            value={exercise.name}
            onChange={handleChange("name")}
            placeholder="Nombre del ejercicio"
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Series</label>
          <input
            type="text"
            value={exercise.sets}
            onChange={handleChange("sets")}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Reps</label>
          <input
            type="text"
            value={exercise.reps}
            onChange={handleChange("reps")}
            className={inputClasses}
            placeholder="Reps"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>RIR</label>
          <input
            type="text"
            value={exercise.rir}
            onChange={handleChange("rir")}
            className={inputClasses}
            placeholder="RIR"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Descanso</label>
          <input
            type="text"
            value={exercise.rest}
            onChange={handleChange("rest")}
            className={inputClasses}
            placeholder="Ej. 90s"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Cadencia</label>
          <input
            type="text"
            value={exercise.tempo}
            onChange={handleChange("tempo")}
            className={inputClasses}
            placeholder="Ej. 2-1-2"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-3">
          <label className={labelClasses}>Video o referencia</label>
          <input
            type="url"
            value={exercise.video}
            onChange={handleChange("video")}
            placeholder="URL del video"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Notas específicas
        </label>
        <textarea
          rows={2}
          value={exercise.note}
          onChange={handleChange("note")}
          className="min-h-[80px] w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-white transition-colors focus:border-[#B5FF00] focus:outline-none focus:ring-0"
          placeholder="Ej. Superserie con press inclinado"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-3 md:flex-row md:items-center md:justify-between">
        <span className="text-xs text-neutral-500">
          Gestioná este ejercicio rápidamente
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDuplicate}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-semibold text-[#B5FF00] transition-colors hover:border-[#B5FF00] hover:bg-neutral-900"
          >
            <Copy className="h-4 w-4" /> Duplicar ejercicio
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
});

ExerciseEditor.displayName = "ExerciseEditor";

export default ExerciseEditor;
