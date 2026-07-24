import { memo, useMemo, useState, useCallback } from "react";
import { IconChevronDown, IconChevronRight, IconExternalLink, IconAlertTriangle } from '@tabler/icons-react';
import { usePlanContext } from "../../../context/PlanContext.jsx";

// Devuelve SIEMPRE una URL http(s) válida y clickeable. Si el valor no es una
// URL absoluta con host (la IA a veces devuelve texto o algo malformado), lo
// convierte en una búsqueda de YouTube (evita el about:blank#blocked del navegador).
const buildVideoUrl = (raw) => {
  if (!raw) return "";
  const t = String(raw).trim();
  if (!t) return "";
  if (!/\s/.test(t)) {
    const candidate = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    try {
      const u = new URL(candidate);
      if (u.hostname.includes(".")) return u.href;
    } catch { /* cae al fallback de búsqueda */ }
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(t.replace(/^https?:\/\/+/i, ""))}`;
};

const VideoLink = ({ url, label = "Ver receta" }) => {
  const u = buildVideoUrl(url);
  if (!u) return null;
  return (
    <a href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
      <IconExternalLink stroke={1.75} className="h-3 w-3" /> {label}
    </a>
  );
};

const Macro = ({ label, value, unit = "g" }) =>
  value === 0 || value ? (
    <span className="text-xs text-text-tertiary">
      {label} <span className="font-semibold text-text-secondary">{value}{unit}</span>
    </span>
  ) : null;

const MealCard = ({ meal }) => {
  const variantes = meal.variantes || [];
  return (
    <div className="rounded-xl border border-border bg-primary-bg p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h5 className="text-base font-semibold text-text-primary">
          {meal.name || "Comida"}{meal.hora ? <span className="ml-2 text-sm font-normal text-text-muted">{meal.hora}</span> : null}
        </h5>
        {(meal.kcal === 0 || meal.kcal) && (
          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">{meal.kcal} kcal</span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
        <Macro label="P" value={meal.proteina_g} />
        <Macro label="C" value={meal.carbos_g} />
        <Macro label="G" value={meal.grasas_g} />
      </div>

      {meal.ingredientes && <p className="mt-3 text-sm text-text-secondary">{meal.ingredientes}</p>}
      {meal.preparacion && (
        <p className="mt-2 text-sm text-text-tertiary"><span className="font-semibold text-text-secondary">Preparación: </span>{meal.preparacion}</p>
      )}
      {meal.sustituciones && (
        <p className="mt-2 text-sm text-text-tertiary"><span className="font-semibold text-text-secondary">↔ Sustituciones: </span>{meal.sustituciones}</p>
      )}
      {meal.nota_timing && (
        <p className="mt-2 rounded-lg bg-accent/5 px-3 py-2 text-xs text-text-tertiary">⏱ {meal.nota_timing}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <VideoLink url={meal.videoUrl} />
      </div>

      {variantes.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Variantes equivalentes</p>
          {variantes.map((v, i) => (
            <div key={v.id || i} className="rounded-lg border border-border bg-primary-surface p-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-text-primary">{v.label || `Opción ${i + 1}`}</span>
                {(v.kcal === 0 || v.kcal) && <span className="text-xs text-text-tertiary">{v.kcal} kcal</span>}
              </div>
              {v.ingredientes && <p className="mt-1 text-xs text-text-secondary">{v.ingredientes}</p>}
              <div className="mt-1.5"><VideoLink url={v.videoUrl} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DayBlock = ({ day }) => {
  const meals = day.meals || [];
  const total = day.totalDia || {};
  return (
    <div className="rounded-xl border border-border bg-primary-surface p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold text-text-primary">{day.name}</h4>
          {day.esDiaEntreno && <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">Día de entreno</span>}
        </div>
        {(total.kcal === 0 || total.kcal) && (
          <span className="text-sm font-semibold text-text-secondary">Total: {total.kcal} kcal</span>
        )}
      </div>
      <div className="space-y-3">
        {meals.length === 0 ? (
          <p className="text-sm text-text-muted">Sin comidas cargadas.</p>
        ) : meals.map((m) => <MealCard key={m.id} meal={m} />)}
      </div>
    </div>
  );
};

const WeekBlock = memo(({ week, index, collapsed, onToggle }) => (
  <div className="rounded-2xl border border-border bg-primary-surface" id={`semana${index + 1}`}>
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-2 border-b border-border px-5 py-4 text-left">
      <div>
        <p className="text-xs uppercase tracking-wide text-text-muted">Semana {index + 1}</p>
        <h3 className="text-xl font-semibold text-text-primary">{week.title || `Semana ${index + 1}`}</h3>
        {week.summary && <p className="mt-1 text-sm text-text-tertiary">{week.summary}</p>}
      </div>
      <span className="rounded-full bg-primary-bg p-2 text-accent">
        {collapsed ? <IconChevronRight stroke={1.75} className="h-5 w-5" /> : <IconChevronDown stroke={1.75} className="h-5 w-5" />}
      </span>
    </button>
    {!collapsed && (
      <div className="space-y-4 px-4 pb-5 pt-4 sm:px-5">
        {week.notes && (
          <div className="rounded-xl border border-border bg-primary-bg p-4">
            <h4 className="mb-1 text-xs uppercase tracking-wide text-text-muted">Notas de la semana</h4>
            <p className="whitespace-pre-line text-sm text-text-tertiary">{week.notes}</p>
          </div>
        )}
        {(week.days || []).map((day) => <DayBlock key={day.id} day={day} />)}
      </div>
    )}
  </div>
));
WeekBlock.displayName = "NutritionWeekBlock";

const NutritionPreview = memo(() => {
  const { plan } = usePlanContext();
  const [collapsed, setCollapsed] = useState(() => new Set());
  const meta = plan.metadata || {};
  const pm = useMemo(() => meta.planMeta || {}, [meta.planMeta]);
  const notasSemana = meta.notas_semana || [];

  const toggleWeek = useCallback((weekId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(weekId)) next.delete(weekId); else next.add(weekId);
      return next;
    });
  }, []);

  const chips = useMemo(() => {
    const out = [];
    if (pm.targetKcal) out.push(`${pm.targetKcal} kcal/día`);
    if (pm.proteina_g) out.push(`P ${pm.proteina_g}g`);
    if (pm.carbos_g) out.push(`C ${pm.carbos_g}g`);
    if (pm.grasas_g) out.push(`G ${pm.grasas_g}g`);
    return out;
  }, [pm]);

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-border bg-primary-bg" data-testid="nutrition-preview">
      {/* Encabezado */}
      <div className="border-b border-border px-5 py-5">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-accent">{meta.name || "Plan sin título"}</h2>
          {chips.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {chips.map((c) => (
                <span key={c} className="rounded-full border border-border bg-primary-surface px-3 py-1 font-semibold text-text-secondary">{c}</span>
              ))}
            </div>
          )}
          {(pm.tmb || pm.tdee) && (
            <p className="text-xs text-text-muted">
              {pm.tmb ? `TMB ${pm.tmb} kcal` : ""}{pm.tmb && pm.tdee ? " · " : ""}{pm.tdee ? `TDEE ${pm.tdee} kcal` : ""}
              {pm.deficit ? ` · ${pm.deficit > 0 ? "+" : ""}${pm.deficit} kcal` : ""}
            </p>
          )}
          {meta.author && <p className="text-xs text-text-muted">{meta.author}</p>}
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
        {/* Aviso de derivación */}
        {pm.requiereDerivacion && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <IconAlertTriangle stroke={1.75} className="h-5 w-5 flex-shrink-0 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-amber-300">Requiere derivación a profesional</h3>
              <p className="mt-0.5 text-xs text-text-tertiary">{pm.notaDerivacion || "Se detectó una condición de salud. Recomendá consulta con un profesional matriculado."}</p>
            </div>
          </div>
        )}

        {/* Rationale */}
        {pm.rationale && (
          <section className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <h3 className="mb-1 text-sm font-semibold text-accent">Racional del plan</h3>
            <p className="text-sm text-text-tertiary">{pm.rationale}</p>
          </section>
        )}

        {/* Notas de la semana */}
        {notasSemana.length > 0 && (
          <section className="rounded-xl border border-border bg-primary-surface p-4">
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Notas generales</h3>
            <ul className="space-y-1.5">
              {notasSemana.map((n, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-tertiary"><span className="text-accent">•</span>{n}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Semanas → días → comidas */}
        <div className="space-y-4 pb-4">
          {(plan.weeks || []).map((week, index) => (
            <WeekBlock key={week.id} week={week} index={index} collapsed={collapsed.has(week.id)} onToggle={() => toggleWeek(week.id)} />
          ))}
        </div>

        <p className="text-center text-[11px] leading-relaxed text-text-muted">
          Este plan fue generado con asistencia de IA. No reemplaza la consulta con un profesional matriculado en nutrición.
        </p>
      </div>
    </aside>
  );
});

NutritionPreview.displayName = "NutritionPreview";

export default NutritionPreview;
