import { memo, useCallback } from 'react';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { usePlanContext } from '../../context/PlanContext.jsx';
import DayEditor from './DayEditor.jsx';

const WeekEditor = memo(({ onNavigateWeek, registerWeekRef, onActionError }) => {
  const { weeks, addWeek, duplicateWeek, removeWeek, updateWeekField, addDay } = usePlanContext();

  const handleAddWeek = useCallback(() => {
    addWeek();
  }, [addWeek]);

  const handleDuplicateWeek = useCallback(
    weekId => {
      duplicateWeek(weekId);
    },
    [duplicateWeek]
  );

  const handleRemoveWeek = useCallback(
    weekId => {
      const { error, success } = removeWeek(weekId);
      if (!success && error && onActionError) {
        onActionError(error);
      }
    },
    [onActionError, removeWeek]
  );

  const handleWeekFieldChange = useCallback(
    (weekId, field) => event => {
      updateWeekField(weekId, field, event.target.value);
    },
    [updateWeekField]
  );

  return (
    <div className="space-y-6" data-testid="week-editor">
      <section className="bg-[#202020] border border-[#787878]/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Índice del plan</h2>
          <span className="text-sm text-[#787878]">{weeks.length} semanas</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {weeks.map((week, index) => (
            <button
              key={week.id}
              type="button"
              onClick={() => onNavigateWeek?.(week.id)}
              className="group rounded-2xl border border-[#787878]/30 bg-[#1A1A1A] p-4 text-left transition-colors hover:border-[#CBFF00]/50 hover:bg-[#242424]"
            >
              <p className="text-sm font-semibold text-white">{week.title || `Semana ${index + 1}`}</p>
              <p className="mt-1 text-xs text-[#787878]">
                {week.summary || 'Añadí una descripción corta'}
              </p>
            </button>
          ))}
          <button
            type="button"
            onClick={handleAddWeek}
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#787878]/40 bg-[#1A1A1A] p-4 text-sm font-semibold text-[#CBFF00] transition-colors hover:border-[#CBFF00] hover:bg-[#242424]"
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
          className="rounded-2xl border border-[#787878]/20 bg-[#202020]"
          data-testid="week-card"
        >
          <div className="flex flex-col gap-4 border-b border-[#787878]/20 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#787878]">Semana {index + 1}</p>
              <h2 className="text-xl font-semibold text-white">{week.title || `Semana ${index + 1}`}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDuplicateWeek(week.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#787878]/40 px-3 py-2 text-sm text-[#CBFF00] hover:border-[#CBFF00] transition-colors"
              >
                <Copy className="h-4 w-4" /> Duplicar semana
              </button>
              <button
                type="button"
                onClick={() => handleRemoveWeek(week.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:border-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Eliminar semana
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#787878] mb-2">
                  Nombre o foco de la semana
                </label>
                <input
                  type="text"
                  value={week.title}
                  onChange={handleWeekFieldChange(week.id, 'title')}
                  placeholder={`Semana ${index + 1}`}
                  className="w-full rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#787878] mb-2">Resumen</label>
                <input
                  type="text"
                  value={week.summary}
                  onChange={handleWeekFieldChange(week.id, 'summary')}
                  placeholder="Descripción corta del enfoque semanal"
                  className="w-full rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#787878] mb-2">Notas</label>
                <textarea
                  rows={3}
                  value={week.notes}
                  onChange={handleWeekFieldChange(week.id, 'notes')}
                  placeholder="Notas generales, recordatorios o mensajes clave de la semana"
                  className="w-full resize-none rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              {week.days.map((day, dayIndex) => (
                <DayEditor
                  key={day.id}
                  weekId={week.id}
                  day={day}
                  index={dayIndex}
                  onActionError={onActionError}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => addDay(week.id)}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#787878]/40 px-4 py-2 text-sm font-semibold text-[#CBFF00] transition-colors hover:border-[#CBFF00] hover:bg-[#1A1A1A]"
            >
              <Plus className="h-4 w-4" /> Agregar día
            </button>
          </div>
        </section>
      ))}
    </div>
  );
});

WeekEditor.displayName = 'WeekEditor';

export default WeekEditor;
