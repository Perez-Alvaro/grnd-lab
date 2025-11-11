import { memo, useCallback, useEffect, useRef } from 'react';
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
  const exercisesEndRef = useRef(null);
  const previousExerciseCountRef = useRef(day.exercises.length);

  useEffect(() => {
    const previousCount = previousExerciseCountRef.current;
    if (day.exercises.length > previousCount) {
      requestAnimationFrame(() => {
        exercisesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    previousExerciseCountRef.current = day.exercises.length;
  }, [day.exercises.length]);

  return (
    <div
      data-testid="day-editor"
      className="flex flex-col gap-4 rounded-2xl border border-[#787878]/25 bg-[#141414] p-4 transition-all duration-150 ease-in-out hover:border-[#CBFF00]/30 hover:bg-[#1C1C1C] sm:p-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Día {index + 1}</span>
            <input
              type="text"
              value={day.name}
              onChange={handleFieldChange('name')}
              placeholder={`Día ${index + 1}`}
              className="w-full rounded-lg border border-[#787878]/30 bg-[#1A1A1A] px-4 py-2 text-lg font-semibold text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
            />
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#787878]">Entrenamiento</label>
              <select
                value={day.type}
                onChange={handleTypeChange}
                className="h-10 w-full rounded-lg border border-[#787878]/40 bg-[#1A1A1A] px-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none sm:w-40"
              >
                <option value="ENTRENAMIENTO">Entrenamiento</option>
                <option value="DESCANSO">Descanso</option>
              </select>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
              <button
                type="button"
                onClick={handleDuplicateDay}
                className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg border border-[#787878]/40 px-3 py-2 text-sm font-semibold text-[#CBFF00] transition-all duration-150 ease-in-out hover:border-[#CBFF00] hover:bg-[#1F1F1F]"
              >
                <Copy className="h-4 w-4" /> Duplicar día
              </button>
              <button
                type="button"
                onClick={handleRemoveDay}
                className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400 transition-all duration-150 ease-in-out hover:border-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" /> Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold uppercase tracking-wide text-[#9B9B9B]">
            Mensaje de recuperación
          </label>
          <textarea
            rows={2}
            value={day.recoveryNote}
            onChange={handleFieldChange('recoveryNote')}
            placeholder="Recomendaciones, movilidad, recordatorios de respiración..."
            className="w-full resize-none rounded-lg border border-[#787878]/30 bg-[#1A1A1A] px-4 py-3 text-sm text-white transition-colors focus:border-[#CBFF00] focus:outline-none"
          />
        </div>

        {!isRestDay && (
          <p className="text-sm font-semibold uppercase tracking-wide text-[#9B9B9B]">
            Ejercicios ({day.exercises.length})
          </p>
        )}
      </div>

      {isRestDay ? (
        <p className="rounded-lg border border-[#787878]/30 bg-[#1A1A1A] px-4 py-3 text-sm text-[#C9C9C9]">
          Día de descanso. Usa este espacio para pautas de recuperación activa.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {day.exercises.map((exercise, exerciseIndex) => (
            <div
              key={exercise.id}
              className={exerciseIndex > 0 ? 'mt-2 border-t border-[#242424] pt-4' : ''}
            >
              <ExerciseEditor
                weekId={weekId}
                dayId={day.id}
                exercise={exercise}
                onActionError={onActionError}
              />
            </div>
          ))}
          <div ref={exercisesEndRef} />
          <button
            type="button"
            onClick={handleAddExercise}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#CBFF00] transition-colors hover:text-[#DBFE52]"
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
