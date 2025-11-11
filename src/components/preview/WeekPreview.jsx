import { memo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const DayPreview = ({ day }) => {
  const isRest = day.type === 'DESCANSO';

  return (
    <div className="rounded-xl border border-[#787878]/20 bg-[#1A1A1A] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-lg font-semibold text-white">{day.name}</h4>
          {isRest && day.recoveryNote && <p className="text-sm text-[#787878]">{day.recoveryNote}</p>}
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isRest ? 'bg-[#787878]/20 text-[#A1A1A1]' : 'bg-[#CBFF00]/20 text-[#CBFF00]'
          }`}
        >
          {day.type}
        </span>
      </div>

      {!isRest && (
        <div className="space-y-3">
          <div className="hidden lg:grid grid-cols-12 gap-3 text-[11px] uppercase tracking-wide text-[#787878]">
            <span className="col-span-4">Ejercicio</span>
            <span>Series</span>
            <span>Reps</span>
            <span>Desc</span>
            <span>RIR</span>
            <span>Cadencia</span>
            <span className="col-span-3">Video</span>
          </div>
          {day.exercises.map(exercise => (
            <div key={exercise.id} className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-medium text-white">{exercise.name || '—'}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#C9C9C9] lg:col-span-1">
                <span className="lg:hidden text-xs uppercase text-[#787878]">Series:</span>
                <span>{exercise.sets || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#C9C9C9] lg:col-span-1">
                <span className="lg:hidden text-xs uppercase text-[#787878]">Reps:</span>
                <span>{exercise.reps || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#C9C9C9] lg:col-span-1">
                <span className="lg:hidden text-xs uppercase text-[#787878]">Desc:</span>
                <span>{exercise.rest || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#C9C9C9] lg:col-span-1">
                <span className="lg:hidden text-xs uppercase text-[#787878]">RIR:</span>
                <span>{exercise.rir || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#C9C9C9] lg:col-span-1">
                <span className="lg:hidden text-xs uppercase text-[#787878]">Cadencia:</span>
                <span>{exercise.tempo || '—'}</span>
              </div>
              <div className="lg:col-span-3">
                {exercise.video ? (
                  <a
                    href={exercise.video}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#CBFF00] hover:underline break-words"
                  >
                    {exercise.video}
                  </a>
                ) : (
                  <span className="text-sm text-[#787878]">Sin video</span>
                )}
              </div>
              {exercise.note && (
                <div className="lg:col-span-12">
                  <p className="text-xs uppercase text-[#787878]">Notas</p>
                  <p className="text-sm text-[#C9C9C9] whitespace-pre-line">{exercise.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WeekPreview = memo(({ week, index, collapsed, onToggle }) => {
  return (
    <div
      id={`semana${index + 1}`}
      className="rounded-2xl border border-[#787878]/20 bg-[#202020]"
      data-testid="week-preview"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 border-b border-[#787878]/20 px-5 py-4 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-[#787878]">Semana {index + 1}</p>
          <h3 className="text-xl font-semibold text-white">{week.title || `Semana ${index + 1}`}</h3>
          {week.summary && <p className="text-sm text-[#C9C9C9] mt-1">{week.summary}</p>}
        </div>
        <span className="rounded-full bg-[#1A1A1A] p-2 text-[#CBFF00]">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-5 px-5 pb-5 pt-4">
          {week.notes && (
            <div className="rounded-xl border border-[#787878]/20 bg-[#1A1A1A] p-4">
              <h4 className="text-xs uppercase tracking-wide text-[#787878] mb-1">Notas de la semana</h4>
              <p className="text-sm text-[#C9C9C9] whitespace-pre-line">{week.notes}</p>
            </div>
          )}

          <div className="space-y-4">
            {week.days.map(day => (
              <DayPreview key={day.id} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

WeekPreview.displayName = 'WeekPreview';

export default WeekPreview;
