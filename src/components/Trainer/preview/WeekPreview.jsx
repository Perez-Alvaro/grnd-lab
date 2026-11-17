import { Fragment, memo, useState } from "react";
import { IconChevronDown, IconChevronRight, IconBrandYoutube } from '@tabler/icons-react';
import { buildExerciseVideoUrl } from "../../../lib/recipeSearch.js";

/** Normaliza un ejercicio a los valores que se muestran (tarjeta y tabla). */
const toRow = (exercise) => {
  const val = (v) => (v === 0 || v ? v : "–");
  const rawNote = exercise.note ?? exercise.notes;
  const video = buildExerciseVideoUrl(exercise);
  return {
    name: exercise.name || "—",
    sets: val(exercise.sets ?? exercise.series),
    reps: val(exercise.reps),
    rest: val(exercise.rest ?? exercise.descanso),
    rir: val(exercise.rir),
    tempo: val(exercise.tempo ?? exercise.cadencia),
    video,
    note: Array.isArray(rawNote) ? rawNote.join("\n") : rawNote,
  };
};

/** Dato suelto de la tarjeta mobile (pill micro-card con label arriba, valor mono abajo). */
const Metric = ({ label, value }) => (
  <div className="min-w-0 rounded-lg border border-border/80 bg-primary-surface-alt/70 px-1.5 py-1.5 text-center">
    <p className="text-[10px] uppercase font-medium tracking-wide text-text-tertiary">{label}</p>
    <p className="font-mono text-xs sm:text-sm font-bold text-text-primary truncate mt-0.5" title={value}>{value}</p>
  </div>
);

const DayPreview = ({ day }) => {
  const isRest = day.type === "DESCANSO";

  return (
    <div className="rounded-lg sm:rounded-xl border border-border bg-primary-surface-alt p-2.5 sm:p-4 space-y-2.5 sm:space-y-3 text-natural-wrap">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-text-primary text-natural-wrap">{day.name}</h4>
          {isRest && day.recoveryNote && (
            <p className="text-xs sm:text-sm text-text-tertiary text-natural-wrap">{day.recoveryNote}</p>
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
          {/* Mobile: tarjetas con clara jerarquía visual y botón YouTube accesible (min 44x44px hitbox). */}
          <div className="space-y-2.5 md:hidden">
            {(day.exercises || []).map((exercise, i) => {
              const r = toRow(exercise);
              return (
                <div
                  key={exercise.id || i}
                  className="rounded-lg sm:rounded-xl border border-border bg-primary-surface p-2.5 sm:p-3.5 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-surface-alt border border-border text-[11px] font-bold text-accent">
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-text-primary text-natural-wrap truncate">
                        {r.name}
                      </p>
                    </div>
                    <a
                      href={r.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver video de ${r.name} en YouTube`}
                      className="flex min-h-[44px] min-w-[44px] h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconBrandYoutube stroke={1.75} className="h-6 w-6" />
                    </a>
                  </div>

                  <div className="mt-2.5 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <Metric label="Series" value={r.sets} />
                    <Metric label="Reps" value={r.reps} />
                    <Metric label="Desc" value={r.rest} />
                    <Metric label="RIR" value={r.rir} />
                    <Metric label="Cad" value={r.tempo} />
                  </div>

                  {r.note && (
                    <p className="mt-2.5 border-t border-border pt-2 text-xs leading-relaxed text-text-secondary whitespace-pre-line text-natural-wrap">
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
                  const videoUrl = buildExerciseVideoUrl(exercise);
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
                          <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ver video de ${exercise.name || "ejercicio"} en YouTube`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline hover:text-text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconBrandYoutube stroke={1.75} className="h-4 w-4" /> YouTube
                          </a>
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
  const [selectedDayId, setSelectedDayId] = useState("all");

  return (
    <div
      id={`semana${index + 1}`}
      className="rounded-none sm:rounded-2xl border-x-0 sm:border border-y border-border bg-primary-surface-elevated"
      data-testid="week-preview"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-5 sm:py-4 text-left"
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
        <div className="space-y-4 px-2 pb-4 pt-3 sm:space-y-5 sm:px-5 sm:pb-5 sm:pt-4">
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

          {/* Sub-navegación selector de día en mobile (<md) */}
          {week.days && week.days.length > 1 && (
            <nav
              className="md:hidden"
              aria-label={`Selector de días para ${week.title || `Semana ${index + 1}`}`}
            >
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedDayId === "all"}
                  onClick={() => setSelectedDayId("all")}
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors flex items-center justify-center shrink-0 ${
                    selectedDayId === "all"
                      ? "bg-accent text-primary-surface font-semibold shadow-xs"
                      : "border border-border bg-primary-surface-alt text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Toda la semana
                </button>
                {week.days.map((day, dIdx) => {
                  const isSelected = selectedDayId === day.id;
                  return (
                    <button
                      key={day.id || dIdx}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedDayId(day.id)}
                      className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-accent text-primary-surface font-semibold shadow-xs"
                          : "border border-border bg-primary-surface-alt text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {day.name || `Día ${dIdx + 1}`}
                    </button>
                  );
                })}
              </div>
            </nav>
          )}

          <div className="space-y-4">
            {week.days.map((day) => {
              const isHiddenOnMobile =
                selectedDayId !== "all" && selectedDayId !== day.id;
              return (
                <div
                  key={day.id}
                  className={isHiddenOnMobile ? "hidden md:block" : "block"}
                >
                  <DayPreview day={day} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

WeekPreview.displayName = "WeekPreview";

export default WeekPreview;
