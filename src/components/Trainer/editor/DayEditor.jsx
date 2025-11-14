import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Copy, Trash2, Plus, ChevronDown } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import ExerciseEditor from "./ExerciseEditor.jsx";

const DayEditor = memo(
  ({ weekId, day, index, onActionError, registerDayRef }) => {
    const { updateDayField, setDayType, duplicateDay, removeDay, addExercise } =
      usePlanContext();

    const handleFieldChange = useCallback(
      (field) => (event) => {
        updateDayField(weekId, day.id, field, event.target.value);
      },
      [day.id, updateDayField, weekId],
    );

    const handleTypeChange = useCallback(
      (event) => {
        setDayType(weekId, day.id, event.target.value);
      },
      [day.id, setDayType, weekId],
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

    const isRestDay = day.type === "DESCANSO";
    const exercisesEndRef = useRef(null);
    const previousExerciseCountRef = useRef(day.exercises.length);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      const previousCount = previousExerciseCountRef.current;
      if (day.exercises.length > previousCount) {
        requestAnimationFrame(() => {
          exercisesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      }
      previousExerciseCountRef.current = day.exercises.length;
    }, [day.exercises.length]);

    const labelClasses = "text-sm font-medium text-gray-400";
    const inputClasses =
      "w-full rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white transition-colors focus:border-accent focus:outline-none focus:ring-0";

    return (
      <div
        data-testid="day-editor"
        ref={registerDayRef}
        className="overflow-hidden rounded-xl border border-[#2E2E2E] bg-[#0A0A0A] shadow-sm transition-all duration-200 ease-in-out"
      >
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                className="flex flex-1 items-center justify-between gap-4 text-left"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    Día {index + 1}
                  </span>
                  <span className="text-base font-semibold text-white">
                    {day.name ? day.name : `Día ${index + 1}`}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span>
                      {isRestDay
                        ? "Día de descanso"
                        : "Sesión de entrenamiento"}
                    </span>
                    {!isRestDay && day.exercises.length > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#2E2E2E]" />
                        <span>{day.exercises.length} ejercicios</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDuplicateDay}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2E2E2E] px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-[#101010]"
                >
                  <Copy className="h-4 w-4" /> Duplicar
                </button>
                <button
                  type="button"
                  onClick={handleRemoveDay}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          </div>

          <div
            className={`grid transition-all duration-200 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-6 pt-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Título del día</label>
                    <input
                      type="text"
                      value={day.name}
                      onChange={handleFieldChange("name")}
                      placeholder={`Día ${index + 1}`}
                      className={inputClasses}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClasses}>Tipo de día</label>
                    <select
                      value={day.type}
                      onChange={handleTypeChange}
                      className={inputClasses}
                    >
                      <option value="ENTRENAMIENTO">Entrenamiento</option>
                      <option value="DESCANSO">Descanso</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Notas del día</label>
                  <textarea
                    rows={3}
                    value={day.recoveryNote}
                    onChange={handleFieldChange("recoveryNote")}
                    placeholder="Recomendaciones, movilidad, recordatorios de respiración..."
                    className={`${inputClasses} min-h-[100px] resize-none`}
                  />
                </div>

                {isRestDay ? (
                  <p className="rounded-lg border border-dashed border-[#2E2E2E] bg-[#0A0A0A] px-4 py-4 text-sm text-gray-300">
                    Día de descanso. Usa este espacio para pautas de
                    recuperación activa.
                  </p>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                        Ejercicios ({day.exercises.length})
                      </h5>
                      <button
                        type="button"
                        onClick={handleAddExercise}
                        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#2E2E2E] px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-[#101010]"
                      >
                        <Plus className="h-4 w-4" /> Agregar ejercicio
                      </button>
                    </div>

                    <div className="flex flex-col gap-5">
                      {day.exercises.map((exercise) => (
                        <ExerciseEditor
                          key={exercise.id}
                          weekId={weekId}
                          dayId={day.id}
                          exercise={exercise}
                          onActionError={onActionError}
                        />
                      ))}
                      <div ref={exercisesEndRef} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

DayEditor.displayName = "DayEditor";

export default DayEditor;
