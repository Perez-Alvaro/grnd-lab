import { Fragment, memo } from "react";
import { IconChevronDown, IconChevronRight, IconBrandYoutube } from '@tabler/icons-react';

/** Asegura que la URL tenga protocolo absoluto para que el navegador no la trate como ruta relativa */
const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

/** Normaliza un ejercicio a los valores que se muestran (tarjeta y tabla). */
const toRow = (exercise) => {
  const val = (v) => (v === 0 || v ? v : "–");
  const rawNote = exercise.note ?? exercise.notes;
  return {
    name: exercise.name || "—",
    sets: val(exercise.sets ?? exercise.series),
    reps: val(exercise.reps),
    rest: val(exercise.rest ?? exercise.descanso),
    rir: val(exercise.rir),
    tempo: val(exercise.tempo ?? exercise.cadencia),
    video: normalizeUrl(exercise.video || exercise.videoUrl),
    note: Array.isArray(rawNote) ? rawNote.join("\n") : rawNote,
  };
};

/** Dato suelto de la tarjeta mobile (label arriba, valor en mono abajo). */
const Metric = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[10px] uppercase tracking-wide text-text-tertiary">{label}</p>
    <p className="font-mono text-sm font-semibold text-text-primary truncate">{value}</p>
  </div>
);

const DayPreview = ({ day }) => {
  const isRest = day.type === "DESCANSO";

  return (
    <div className="rounded-xl border border-border bg-primary-surface-alt p-4 space-y-3 text-natural-wrap">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-lg font-semibold text-text-primary text-natural-wrap">{day.name}</h4>
          {isRest && day.recoveryNote && (
            <p className="text-sm text-text-tertiary text-natural-wrap">{day.recoveryNote}</p>
          )}
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isRest
              ? "bg-primary-surface-alt text-text-tertiary"
              : "bg-accent/20 text-accent"
          }`}
        >
          {day.type}
        </span>
      </div>

      {!isRest && (
        <div className="space-y-3">
          {/* Mobile: tarjetas. La tabla medía 720 px de ancho mínimo y obligaba
              a hacer scroll lateral en un teléfono de 375 px. */}
          <div className="space-y-2 md:hidden">
            {(day.exercises || []).map((exercise, i) => {
              const r = toRow(exercise);
              return (
                <div
                  key={exercise.id || i}
                  className="rounded-md border border-border bg-primary-surface p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-text-primary">{r.name}</p>
                    {r.video && (
                      <a
                        href={r.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver video de ${r.name} en YouTube`}
                        className="flex h-11 w-11 -my-2 -mr-1 flex-shrink-0 items-center justify-center rounded-sm text-accent"
                      >
                        <IconBrandYoutube stroke={1.75} className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    <Metric label="Series" value={r.sets} />
                    <Metric label="Reps" value={r.reps} />
                    <Metric label="Desc" value={r.rest} />
                    <Metric label="RIR" value={r.rir} />
                    <Metric label="Cad" value={r.tempo} />
                  </div>
                  {r.note && (
                    <p className="mt-2 border-t border-border pt-2 text-xs leading-relaxed text-text-secondary whitespace-pre-line">
                      {r.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: tabla completa */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-text-tertiary border-b border-border">
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
                {(day.exercises || []).map((exercise, exerciseIndex) => {
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
                      <tr className="border-b border-border text-text-secondary">
                        <td className="py-3 pr-3 text-left text-sm font-medium text-text-primary align-top">
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
                          {videoUrl && normalizeUrl(videoUrl) ? (
                            <a
                              href={normalizeUrl(videoUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Ver video del ejercicio en YouTube"
                              className="text-xs font-semibold text-accent underline hover:text-text-primary transition-colors"
                            >
                              Link YouTube
                            </a>
                          ) : (
                            <span className="text-text-tertiary">–</span>
                          )}
                        </td>
                      </tr>
                      {note && (
                        <tr className="border-b border-border last:border-0">
                          <td
                            colSpan={7}
                            className="px-3 pb-3 pt-2 align-top text-sm text-text-secondary"
                          >
                            <p className="text-xs uppercase text-text-tertiary">
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
      className="rounded-2xl border border-border bg-primary-surface-elevated"
      data-testid="week-preview"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 border-b border-border px-5 py-4 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-text-tertiary text-natural-wrap">
            Semana {index + 1}
          </p>
          <h3 className="text-xl font-semibold text-text-primary text-natural-wrap">
            {week.title || `Semana ${index + 1}`}
          </h3>
          {week.summary && (
            <p className="text-sm text-text-secondary mt-1 text-natural-wrap">{week.summary}</p>
          )}
        </div>
        <span className="rounded-full bg-primary-surface-alt p-2 text-accent">
          {collapsed ? (
            <IconChevronRight stroke={1.75} className="h-5 w-5" />
          ) : (
            <IconChevronDown stroke={1.75} className="h-5 w-5" />
          )}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-5 px-5 pb-5 pt-4">
          {week.notes && (
            <div className="rounded-xl border border-border bg-primary-surface-alt p-4 text-natural-wrap">
              <h4 className="text-xs uppercase tracking-wide text-text-tertiary mb-1 text-natural-wrap">
                Notas de la semana
              </h4>
              <p className="text-sm text-text-secondary whitespace-pre-line text-natural-wrap">
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
