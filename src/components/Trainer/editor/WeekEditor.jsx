import { memo, useCallback, useEffect, useRef } from "react";
import { Plus, Copy, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import DayEditor from "./DayEditor.jsx";

const WeekEditor = memo(
  ({ onNavigateWeek, registerWeekRef, onActionError }) => {
    const {
      weeks,
      addWeek,
      duplicateWeek,
      removeWeek,
      updateWeekField,
      addDay,
      reorderDay,
    } = usePlanContext();
    const dayRefs = useRef({});
    const previousDayCountRef = useRef({});

    const handleAddWeek = useCallback(() => {
      addWeek();
    }, [addWeek]);

    const handleDuplicateWeek = useCallback(
      (weekId) => {
        duplicateWeek(weekId);
      },
      [duplicateWeek],
    );

    const handleRemoveWeek = useCallback(
      (weekId) => {
        const { error, success } = removeWeek(weekId);
        if (!success && error && onActionError) {
          onActionError(error);
        }
      },
      [onActionError, removeWeek],
    );

    const handleWeekFieldChange = useCallback(
      (weekId, field) => (event) => {
        updateWeekField(weekId, field, event.target.value);
      },
      [updateWeekField],
    );

    const registerDayRef = useCallback((weekId, dayId) => {
      const key = `${weekId}-${dayId}`;
      return (node) => {
        if (node) {
          dayRefs.current[key] = node;
        } else {
          delete dayRefs.current[key];
        }
      };
    }, []);

    useEffect(() => {
      weeks.forEach((week) => {
        const previousCount = previousDayCountRef.current[week.id];
        if (
          typeof previousCount === "number" &&
          week.days.length > previousCount
        ) {
          const lastDay = week.days[week.days.length - 1];
          const node = dayRefs.current[`${week.id}-${lastDay.id}`];
          if (node) {
            requestAnimationFrame(() => {
              node.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          }
        }
        previousDayCountRef.current[week.id] = week.days.length;
      });
    }, [weeks]);

    return (
      <div className="flex flex-col gap-6" data-testid="week-editor">
        <section className="flex flex-col gap-4 rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Índice del plan
              </h2>
              <p className="text-sm text-gray-400">
                Gestiona las semanas y navega rápidamente
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {weeks.length} semanas
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {weeks.map((week, index) => (
              <button
                key={week.id}
                type="button"
                onClick={() => onNavigateWeek?.(week.id)}
                className="group flex flex-col gap-1 rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-left transition-colors hover:border-accent hover:bg-[#101010]"
              >
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Semana {index + 1}
                </span>
                <span className="text-sm font-semibold text-white">
                  {week.title || `Semana ${index + 1}`}
                </span>
                <span className="text-xs text-gray-400">
                  {week.summary || "Añadí una descripción corta"}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddWeek}
              className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-[#101010]"
            >
              <Plus className="h-4 w-4" /> Agregar semana
            </button>
          </div>
        </section>

        {weeks.map((week, index) => (
          <section
            key={week.id}
            ref={registerWeekRef ? registerWeekRef(week.id) : undefined}
            id={`editor-week-${index + 1}`}
            className="flex flex-col gap-5 rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] p-5 shadow-sm"
            data-testid="week-card"
          >
            <div className="flex flex-col gap-4 border-b border-[#2E2E2E] pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  Semana {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-white">
                  {week.title || `Semana ${index + 1}`}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDuplicateWeek(week.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2E2E2E] px-3 py-2 text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-[#101010]"
                >
                  <Copy className="h-4 w-4" /> Duplicar semana
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveWeek(week.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar semana
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">
                  Nombre o foco de la semana
                </label>
                <input
                  type="text"
                  value={week.title}
                  onChange={handleWeekFieldChange(week.id, "title")}
                  placeholder={`Semana ${index + 1}`}
                  className="w-full rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white transition-colors focus:border-accent focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">
                  Resumen
                </label>
                <input
                  type="text"
                  value={week.summary}
                  onChange={handleWeekFieldChange(week.id, "summary")}
                  placeholder="Descripción corta del enfoque semanal"
                  className="w-full rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white transition-colors focus:border-accent focus:outline-none focus:ring-0"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">
                  Notas
                </label>
                <textarea
                  rows={3}
                  value={week.notes}
                  onChange={handleWeekFieldChange(week.id, "notes")}
                  placeholder="Notas generales, recordatorios o mensajes clave de la semana"
                  className="min-h-[100px] w-full resize-none rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white transition-colors focus:border-accent focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Días ({week.days.length})
                </h4>
                <button
                  type="button"
                  onClick={() => addDay(week.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#2E2E2E] px-3 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-[#101010]"
                >
                  <Plus className="h-4 w-4" /> Agregar día
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {week.days.map((day, dayIndex) => (
                  <div key={day.id} className="flex items-start gap-2">
                    {/* Reorder arrows */}
                    <div className="flex flex-col gap-1 pt-4 flex-shrink-0">
                      <button
                        type="button"
                        disabled={dayIndex === 0}
                        onClick={() => reorderDay(week.id, dayIndex, dayIndex - 1)}
                        className="flex items-center justify-center w-7 h-7 rounded-md border border-[#2E2E2E] bg-[#0A0A0A] text-gray-500 transition-colors hover:border-accent hover:text-accent disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-[#2E2E2E] disabled:hover:text-gray-500"
                        title="Mover arriba"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={dayIndex === week.days.length - 1}
                        onClick={() => reorderDay(week.id, dayIndex, dayIndex + 1)}
                        className="flex items-center justify-center w-7 h-7 rounded-md border border-[#2E2E2E] bg-[#0A0A0A] text-gray-500 transition-colors hover:border-accent hover:text-accent disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-[#2E2E2E] disabled:hover:text-gray-500"
                        title="Mover abajo"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <DayEditor
                        weekId={week.id}
                        day={day}
                        index={dayIndex}
                        onActionError={onActionError}
                        registerDayRef={registerDayRef(week.id, day.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  },
);

WeekEditor.displayName = "WeekEditor";

export default WeekEditor;
