import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Copy, Trash2, Plus, ChevronDown } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import ExerciseEditor from "./ExerciseEditor.jsx";

// Config de hoja por defecto (rutina) si el contexto no la provee.
const DEFAULT_LEAF_UI = {
  key: "exercises",
  ItemEditor: ExerciseEditor,
  labelPlural: "ejercicios",
  addLabel: "Agregar ejercicio",
  showDayType: true,
  showWarmup: true,
};

const DayEditor = memo(
  ({ weekId, day, index, onActionError, registerDayRef }) => {
    const ctx = usePlanContext();
    const { updateDayField, setDayType, duplicateDay, removeDay, addExercise } = ctx;
    const ui = ctx.leafUI || DEFAULT_LEAF_UI;
    const ItemEditor = ui.ItemEditor;
    const items = day[ui.key] || [];

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

    const handleAddItem = useCallback(() => {
      addExercise(weekId, day.id);
    }, [addExercise, day.id, weekId]);

    const isRestDay = ui.showDayType && day.type === "DESCANSO";
    const itemsEndRef = useRef(null);
    const previousItemCountRef = useRef(items.length);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      const previousCount = previousItemCountRef.current;
      if (items.length > previousCount) {
        requestAnimationFrame(() => {
          itemsEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      }
      previousItemCountRef.current = items.length;
    }, [items.length]);

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
                        : ui.showDayType
                          ? "Sesión de entrenamiento"
                          : "Comidas del día"}
                    </span>
                    {!isRestDay && items.length > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[#2E2E2E]" />
                        <span>{items.length} {ui.labelPlural}</span>
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
                  {ui.showDayType && (
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
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClasses}>Notas del día</label>
                  <textarea
                    rows={3}
                    value={day.recoveryNote}
                    onChange={handleFieldChange("recoveryNote")}
                    placeholder="Recomendaciones, movilidad, recordatorios..."
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
                    {/* Entrada en calor (solo rutina) */}
                    {ui.showWarmup && day.warmupExercises && day.warmupExercises.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                            Entrada en calor ({day.warmupExercises.length})
                          </h5>
                        </div>
                        <div className="rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] p-3 overflow-x-auto">
                          <table className="w-full text-sm text-text-primary">
                            <thead>
                              <tr className="border-b border-[#2E2E2E] text-xs uppercase text-text-muted">
                                <th className="text-left px-3 py-2">Ejercicio</th>
                                <th className="text-left px-3 py-2">Duración</th>
                                <th className="text-left px-3 py-2">Notas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.warmupExercises.map((warmup, idx) => (
                                <tr key={idx} className="border-b border-[#1E1E1E] hover:bg-[#0E0E0E]">
                                  <td className="px-3 py-2">{warmup.name}</td>
                                  <td className="px-3 py-2 text-gray-400">{warmup.duration}</td>
                                  <td className="px-3 py-2 text-gray-400 text-xs">{warmup.notes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold uppercase tracking-wide text-gray-400 capitalize">
                        {ui.labelPlural} ({items.length})
                      </h5>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#2E2E2E] px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-[#101010]"
                      >
                        <Plus className="h-4 w-4" /> {ui.addLabel}
                      </button>
                    </div>

                    <div className="flex flex-col gap-5">
                      {items.map((item) => (
                        <ItemEditor
                          key={item.id}
                          weekId={weekId}
                          dayId={day.id}
                          item={item}
                          onActionError={onActionError}
                        />
                      ))}
                      <div ref={itemsEndRef} />
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
