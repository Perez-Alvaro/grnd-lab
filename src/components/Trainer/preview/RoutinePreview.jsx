import { memo, useMemo, useState, useCallback } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import WeekPreview from "./WeekPreview.jsx";
import PreviewEmptyState from "./PreviewEmptyState.jsx";
import { buildWeekAnchors } from "../../../pdf/utils/pdfAnchors.js";
import { TRAINING_GOAL_LABELS } from "../../../constants/objectives.js";

const RoutinePreview = memo(({ onGoToAssistant }) => {
  const { plan } = usePlanContext();
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [activeWeekFilter, setActiveWeekFilter] = useState("all");
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const tags = useMemo(
    () =>
      (plan.metadata.tags || "")
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

  if (!plan.weeks?.length) {
    return <PreviewEmptyState onGoToAssistant={onGoToAssistant} />;
  }

  return (
    <aside
      className="flex h-full flex-col rounded-none border-0 bg-primary-bg lg:rounded-2xl lg:border lg:border-border lg:bg-primary-surface-elevated text-natural-wrap w-full"
      data-testid="routine-preview"
    >
      {/* Top Metadata Header */}
      <div className="border-b border-border bg-primary-surface px-3 py-3 sm:px-6 sm:py-5">
        {/* Mobile Header: Compact & Collapsible (<lg) */}
        <div className="block lg:hidden space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-accent truncate text-natural-wrap">
                {plan.metadata.name || "Plan sin título"}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-text-tertiary mt-0.5">
                {plan.metadata.objective && (
                  <span className="font-medium text-text-secondary capitalize">
                    {TRAINING_GOAL_LABELS[plan.metadata.objective] ||
                      plan.metadata.objective}
                  </span>
                )}
                {plan.metadata.objective && plan.metadata.durationWeeks && (
                  <span>•</span>
                )}
                {plan.metadata.durationWeeks && (
                  <span>{plan.metadata.durationWeeks} sem</span>
                )}
                {plan.metadata.frequency && (
                  <>
                    <span>•</span>
                    <span>{plan.metadata.frequency}x/sem</span>
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsHeaderOpen((prev) => !prev)}
              aria-expanded={isHeaderOpen}
              aria-label={
                isHeaderOpen
                  ? "Ocultar detalles del plan"
                  : "Ver detalles del plan"
              }
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-primary-surface-alt p-2 text-text-secondary hover:text-accent hover:border-accent/40 transition-colors"
            >
              <span className="sr-only">
                {isHeaderOpen ? "Ocultar detalles" : "Ver detalles"}
              </span>
              {isHeaderOpen ? (
                <IconChevronUp className="h-5 w-5 text-accent" stroke={2} />
              ) : (
                <IconChevronDown className="h-5 w-5" stroke={2} />
              )}
            </button>
          </div>

          {isHeaderOpen && (
            <div className="pt-2 border-t border-border/70 space-y-2.5 animate-fadeIn">
              <div className="flex flex-wrap gap-1.5 text-xs text-text-tertiary">
                {plan.metadata.level && (
                  <span className="rounded-md border border-border bg-primary-surface-alt px-2.5 py-1">
                    Nivel {plan.metadata.level}
                  </span>
                )}
                {plan.metadata.author && (
                  <span className="rounded-md border border-border bg-primary-surface-alt px-2.5 py-1 capitalize">
                    Por {plan.metadata.author}
                  </span>
                )}
              </div>
              {plan.metadata.description && (
                <p className="text-xs text-text-secondary leading-relaxed text-natural-wrap">
                  {plan.metadata.description}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-[11px] text-text-tertiary">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-primary-surface-alt/60 px-2 py-0.5 text-natural-wrap"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Header: Full (lg+) */}
        <div className="hidden lg:block space-y-4 text-center">
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

      <div className="flex-1 space-y-4 sm:space-y-6 overflow-y-auto px-1.5 py-3 sm:px-6 sm:py-6">
        {/* Mobile Horizontal Pill Slider / Segmented Tabs (<lg) */}
        <nav className="block lg:hidden" aria-label="Navegación de semanas">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none px-1"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeWeekFilter === "all"}
              onClick={() => setActiveWeekFilter("all")}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center justify-center shrink-0 ${
                activeWeekFilter === "all"
                  ? "bg-accent text-primary-surface shadow-xs"
                  : "border border-border bg-primary-surface-alt text-text-secondary hover:text-text-primary hover:bg-primary-surface-elevated"
              }`}
            >
              Ver todo
            </button>
            {plan.weeks.map((week, index) => {
              const isSelected = activeWeekFilter === week.id;
              return (
                <button
                  key={week.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveWeekFilter(week.id)}
                  className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-accent text-primary-surface shadow-xs"
                      : "border border-border bg-primary-surface-alt text-text-secondary hover:text-text-primary hover:bg-primary-surface-elevated"
                  }`}
                >
                  Semana {index + 1}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Desktop Índice de semanas (lg+) */}
        <nav
          className="hidden lg:block space-y-3"
          aria-label="Índice de semanas"
        >
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
          {plan.weeks.map((week, index) => {
            const isFilteredOutOnMobile =
              activeWeekFilter !== "all" && activeWeekFilter !== week.id;

            return (
              <div
                key={week.id}
                className={isFilteredOutOnMobile ? "hidden lg:block" : "block"}
              >
                <WeekPreview
                  week={week}
                  index={index}
                  collapsed={collapsed.has(week.id)}
                  onToggle={() => toggleWeek(week.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
});

RoutinePreview.displayName = "RoutinePreview";

export default RoutinePreview;
