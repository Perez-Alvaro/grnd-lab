import { memo, useCallback } from 'react';
import { Copy, Trash2, Plus } from 'lucide-react';
import { usePlanContext } from '../../context/PlanContext.jsx';
import ExerciseEditor from './ExerciseEditor.jsx';

const DayEditor = memo(({ weekId, day, index, onActionError }) => {
  const {
    updateDayField,
    setDayType,
    duplicateDay,
    removeDay,
    addExercise
  } = usePlanContext();

  const handleFieldChange = useCallback(
    field => event => {
      updateDayField(weekId, day.id, field, event.target.value);
    },
    [day.id, updateDayField, weekId]
  );

  const handleTypeChange = useCallback(
    event => {
      setDayType(weekId, day.id, event.target.value);
    },
    [day.id, setDayType, weekId]
  );

  const handleDuplicateDay = useCallback(() => {
    duplicateDay(weekId, day.id);
  }, [day.id, duplicateDay, weekId]);

  const handleRemoveDay = useCallback(() => {
    const { error } = removeDay(weekId, day.id);
    if (error && onActionError) {
      onActionError(error);
    }
  }, [day.id, onActionError, removeDay, weekId]);

  const handleAddExercise = useCallback(() => {
    addExercise(weekId, day.id);
  }, [addExercise, day.id, weekId]);

  const isRestDay = day.type === 'DESCANSO';

  return (
    <div
      data-testid="day-editor"
      className="space-y-4 rounded-xl border border-[#787878]/20 bg-[#141414] p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wide text-[#787878]">
            Día {index + 1}
          </label>
          <input
            type="text"
            value={day.name}
            onChange={handleFieldChange('name')}
            placeholder={`Día ${index + 1}`}
            className="w-full rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={day.type}
            onChange={handleTypeChange}
            className="rounded-lg border border-[#787878]/40 bg-[#1A1A1A] px-3 py-2 text-sm text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          >
            <option value="ENTRENAMIENTO">Entrenamiento</option>
            <option value="DESCANSO">Descanso</option>
          </select>
          <button
            type="button"
            onClick={handleDuplicateDay}
            className="inline-flex items-center gap-1 rounded-lg border border-[#787878]/40 px-3 py-1 text-xs text-[#CBFF00] hover:border-[#CBFF00] transition-colors"
          >
            <Copy className="h-4 w-4" /> Duplicar día
          </button>
          <button
            type="button"
            onClick={handleRemoveDay}
            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:border-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-[#787878] mb-1">
            Mensaje de recuperación
          </label>
          <textarea
            rows={2}
            value={day.recoveryNote}
            onChange={handleFieldChange('recoveryNote')}
            placeholder="Recomendaciones, movilidad, recordatorios de respiración..."
            className="w-full resize-none rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
          />
        </div>
        {!isRestDay && (
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-wide text-[#787878]">
              Ejercicios ({day.exercises.length})
            </p>
          </div>
        )}
      </div>

      {isRestDay ? (
        <p className="rounded-lg border border-[#787878]/30 bg-[#1A1A1A] px-3 py-2 text-sm text-[#C9C9C9]">
          Día de descanso. Usa este espacio para pautas de recuperación activa.
        </p>
      ) : (
        <div className="space-y-4">
          {day.exercises.map(exercise => (
            <ExerciseEditor
              key={exercise.id}
              weekId={weekId}
              dayId={day.id}
              exercise={exercise}
              onActionError={onActionError}
            />
          ))}
          <button
            type="button"
            onClick={handleAddExercise}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#CBFF00] hover:text-[#DBFE52]"
          >
            <Plus className="h-4 w-4" /> Agregar ejercicio
          </button>
        </div>
      )}
    </div>
  );
});

DayEditor.displayName = 'DayEditor';

export default DayEditor;
