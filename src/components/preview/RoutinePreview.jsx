import { memo, useMemo, useState, useCallback } from "react";
import { usePlanContext } from "../../context/PlanContext.jsx";
import WeekPreview from "./WeekPreview.jsx";
import { buildWeekAnchors } from "../../pdf/utils/pdfAnchors.js";
import { TRAINING_GOAL_LABELS } from "../../constants/objectives.js";

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
      className="flex h-full flex-col rounded-2xl border border-[#787878]/20 bg-[#202020]"
      data-testid="routine-preview"
    >
      <div className="border-b border-[#787878]/20 px-6 py-5">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-[#CBFF00]">
            {plan.metadata.name || "Plan sin título"}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-wider text-[#787878]">
            {plan.metadata.objective && (
              <span className="rounded-full border border-[#787878]/20 bg-[#787878]/20 px-3 py-1 capitalize">
                {TRAINING_GOAL_LABELS[plan.metadata.objective] ||
                  plan.metadata.objective}
              </span>
            )}
            {plan.metadata.frequency && (
              <span className="rounded-full border border-[#787878]/20 bg-[#787878]/20 px-3 py-1">
                {plan.metadata.frequency}x semana
              </span>
            )}
            {plan.metadata.durationWeeks && (
              <span className="rounded-full border border-[#787878]/20 bg-[#787878]/20 px-3 py-1">
                {plan.metadata.durationWeeks} semanas
              </span>
            )}
            {plan.metadata.level && (
              <span className="rounded-full border border-[#787878]/20 bg-[#787878]/20 px-3 py-1">
                Nivel {plan.metadata.level}
              </span>
            )}
            {plan.metadata.author && (
              <span className="rounded-full border border-[#787878]/20 bg-[#787878]/20 px-3 py-1 capitalize">
                {plan.metadata.author}
              </span>
            )}
          </div>
          {plan.metadata.description && (
            <p className="text-sm text-[#C9C9C9]">
              {plan.metadata.description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 text-[11px] text-[#787878]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#787878]/20 bg-[#787878]/10 px-2 py-1"
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
            <h3 className="text-sm font-semibold text-white">
              Índice del plan
            </h3>
            <span className="text-xs text-[#787878]">
              {plan.weeks.length} semanas
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {weekAnchors.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="rounded-xl border border-[#787878]/30 bg-[#1A1A1A] p-4 text-sm text-white transition-colors hover:border-[#CBFF00]/60 hover:bg-[#242424]"
              >
                Semana {anchor.number}
              </a>
            ))}
          </div>
        </nav>

        {plan.metadata.notes && (
          <section className="rounded-2xl border border-[#CBFF00]/20 bg-[#CBFF00]/10 p-4 text-left">
            <h3 className="text-sm font-semibold text-[#CBFF00] mb-2">
              Notas generales
            </h3>
            <p className="text-sm text-[#C9C9C9] whitespace-pre-line">
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
