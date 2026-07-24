import { memo, useMemo, useState, useCallback } from "react";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import WeekPreview from "./WeekPreview.jsx";
import { buildWeekAnchors } from "../../../pdf/utils/pdfAnchors.js";
import { TRAINING_GOAL_LABELS } from "../../../constants/objectives.js";

const RoutinePreview = memo(() => {
  const { plan } = usePlanContext();
  const [collapsed, setCollapsed] = useState(() => new Set());

  const tags = useMemo(
    () =>
      plan.metadata.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [plan.metadata.tags],
  );

  const weekAnchors = useMemo(() => buildWeekAnchors(plan.weeks), [plan.weeks]);

  const toggleWeek = useCallback((weekId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) {
        next.delete(weekId);
      } else {
        next.add(weekId);
      }
      return next;
    });
  }, []);

  return (
    <aside
      className="flex h-full flex-col rounded-2xl border border-border bg-primary-surface-elevated text-natural-wrap"
      data-testid="routine-preview"
    >
      <div className="border-b border-border px-6 py-5">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-accent text-natural-wrap">
            {plan.metadata.name || "Plan sin título"}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-wider text-text-tertiary">
            {plan.metadata.objective && (
              <span className="rounded-full border border-border bg-primary-surface-alt px-3 py-1 capitalize">
                {TRAINING_GOAL_LABELS[plan.metadata.objective] ||
                  plan.metadata.objective}
              </span>
            )}
            {plan.metadata.frequency && (
              <span className="rounded-full border border-border bg-primary-surface-alt px-3 py-1">
                {plan.metadata.frequency}x semana
              </span>
            )}
            {plan.metadata.durationWeeks && (
              <span className="rounded-full border border-border bg-primary-surface-alt px-3 py-1">
                {plan.metadata.durationWeeks} semanas
              </span>
            )}
            {plan.metadata.level && (
              <span className="rounded-full border border-border bg-primary-surface-alt px-3 py-1">
                Nivel {plan.metadata.level}
              </span>
            )}
            {plan.metadata.author && (
              <span className="rounded-full border border-border bg-primary-surface-alt px-3 py-1 capitalize">
                {plan.metadata.author}
              </span>
            )}
          </div>
          {plan.metadata.description && (
            <p className="text-sm text-text-secondary text-natural-wrap">
              {plan.metadata.description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 text-[11px] text-text-tertiary">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-primary-surface-alt/60 px-2 py-1 text-natural-wrap"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <nav className="space-y-3" aria-label="Índice de semanas">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              Índice del plan
            </h3>
            <span className="text-xs text-text-tertiary">
              {plan.weeks.length} semanas
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {weekAnchors.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="rounded-xl border border-border-strong bg-primary-surface-alt p-4 text-sm text-text-primary transition-colors hover:border-accent/60 hover:bg-primary-surface-elevated"
              >
                Semana {anchor.number}
              </a>
            ))}
          </div>
        </nav>

        {plan.metadata.notes && (
          <section className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-left">
            <h3 className="text-sm font-semibold text-accent mb-2">
              Notas generales
            </h3>
            <p className="text-sm text-text-secondary whitespace-pre-line">
              {plan.metadata.notes}
            </p>
          </section>
        )}

        <div className="space-y-6 pb-6">
          {plan.weeks.map((week, index) => (
            <WeekPreview
              key={week.id}
              week={week}
              index={index}
              collapsed={collapsed.has(week.id)}
              onToggle={() => toggleWeek(week.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
});

RoutinePreview.displayName = "RoutinePreview";

export default RoutinePreview;
