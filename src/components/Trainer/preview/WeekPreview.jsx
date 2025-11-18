import { Fragment, memo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const DayPreview = ({ day }) => {
  const isRest = day.type === "DESCANSO";

  return (
    <div className="rounded-xl border border-[#787878]/20 bg-[#1A1A1A] p-4 space-y-3 text-natural-wrap">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-lg font-semibold text-white text-natural-wrap">{day.name}</h4>
          {isRest && day.recoveryNote && (
            <p className="text-sm text-[#787878] text-natural-wrap">{day.recoveryNote}</p>
          )}
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isRest
              ? "bg-[#787878]/20 text-[#A1A1A1]"
              : "bg-accent/20 text-accent"
          }`}
        >
          {day.type}
        </span>
      </div>

      {!isRest && (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-[#787878] border-b border-[#787878]/20">
                  <th className="py-2 pr-3 text-left font-semibold">
                    Ejercicio
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Series
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">Reps</th>
                  <th className="px-3 py-2 text-center font-semibold">Desc</th>
                  <th className="px-3 py-2 text-center font-semibold">RIR</th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Cadencia
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">Video</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((exercise, exerciseIndex) => {
                  const setsValue = exercise.sets ?? exercise.series;
                  const sets = setsValue === 0 || setsValue ? setsValue : "–";
                  const repsValue = exercise.reps;
                  const reps = repsValue === 0 || repsValue ? repsValue : "–";
                  const restValue = exercise.rest ?? exercise.descanso;
                  const rest = restValue === 0 || restValue ? restValue : "–";
                  const rir = exercise.rir ?? "–";
                  const tempoValue = exercise.tempo ?? exercise.cadencia;
                  const tempo =
                    tempoValue === 0 || tempoValue ? tempoValue : "–";
                  const videoUrl = exercise.video || exercise.videoUrl;
                  const rawNote = exercise.note ?? exercise.notes;
                  const note = Array.isArray(rawNote)
                    ? rawNote.join("\n")
                    : rawNote;

                  return (
                    <Fragment key={exercise.id || exerciseIndex}>
                      <tr className="border-b border-[#787878]/20 text-[#C9C9C9]">
                        <td className="py-3 pr-3 text-left text-sm font-medium text-white align-top">
                          {exercise.name || "—"}
                        </td>
                        <td className="px-3 py-3 text-center align-top">
                          {sets}
                        </td>
                        <td className="px-3 py-3 text-center align-top">
                          {reps}
                        </td>
                        <td className="px-3 py-3 text-center align-top">
                          {rest}
                        </td>
                        <td className="px-3 py-3 text-center align-top">
                          {rir}
                        </td>
                        <td className="px-3 py-3 text-center align-top">
                          {tempo}
                        </td>
                        <td className="px-3 py-3 text-right align-top">
                          {videoUrl ? (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Ver video del ejercicio"
                              className="text-sm font-semibold text-accent hover:underline"
                            >
                              Ver
                            </a>
                          ) : (
                            <span className="text-[#787878]">Sin video</span>
                          )}
                        </td>
                      </tr>
                      {note && (
                        <tr className="border-b border-[#787878]/20 last:border-0">
                          <td
                            colSpan={7}
                            className="px-3 pb-3 pt-2 align-top text-sm text-[#C9C9C9]"
                          >
                            <p className="text-xs uppercase text-[#787878]">
                              Notas
                            </p>
                            <p className="mt-1 whitespace-pre-line">{note}</p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          <p className="text-xs uppercase tracking-wide text-[#787878] text-natural-wrap">
            Semana {index + 1}
          </p>
          <h3 className="text-xl font-semibold text-white text-natural-wrap">
            {week.title || `Semana ${index + 1}`}
          </h3>
          {week.summary && (
            <p className="text-sm text-[#C9C9C9] mt-1 text-natural-wrap">{week.summary}</p>
          )}
        </div>
        <span className="rounded-full bg-[#1A1A1A] p-2 text-accent">
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-5 px-5 pb-5 pt-4">
          {week.notes && (
            <div className="rounded-xl border border-[#787878]/20 bg-[#1A1A1A] p-4 text-natural-wrap">
              <h4 className="text-xs uppercase tracking-wide text-[#787878] mb-1 text-natural-wrap">
                Notas de la semana
              </h4>
              <p className="text-sm text-[#C9C9C9] whitespace-pre-line text-natural-wrap">
                {week.notes}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {week.days.map((day) => (
              <DayPreview key={day.id} day={day} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

WeekPreview.displayName = "WeekPreview";

export default WeekPreview;
