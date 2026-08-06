import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  IconPlus, IconCopy, IconTrash, IconChevronUp, IconChevronDown,
  IconGripVertical, IconLayoutNavbarCollapse, IconLayoutNavbarExpand,
} from '@tabler/icons-react';
import { Reorder, useDragControls } from "framer-motion";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import DayEditor from "./DayEditor.jsx";

const weekDomId = (index) => `editor-week-${index + 1}`;

/* ── Fila de un día: drag handle (arrastrar) + flechas (alternativa a11y) ── */
function DayRow({ weekId, day, index, daysCount, reorderDay, onActionError }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="div"
      value={day}
      layout="position"
      transition={{ duration: 0 }}
      dragListener={false}
      dragControls={controls}
      className="flex items-start gap-2"
    >
      <div className="flex flex-col items-center gap-1.5 pt-4 flex-shrink-0">
        {/* Arrastrar. touch-action:none deja que el gesto lo tome el drag y no el scroll. */}
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
          className="flex h-11 w-11 cursor-grab items-center justify-center rounded-md border border-border bg-primary-bg text-text-quaternary transition-colors hover:border-accent hover:text-accent active:cursor-grabbing"
          aria-label={`Arrastrar para reordenar el día ${index + 1}`}
          title="Arrastrar para reordenar"
        >
          <IconGripVertical stroke={1.75} className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={index === 0}
          onClick={() => reorderDay(weekId, index, index - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-primary-bg text-text-quaternary transition-colors hover:border-accent hover:text-accent active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-text-quaternary"
          aria-label={`Mover el día ${index + 1} hacia arriba`}
          title="Mover arriba"
        >
          <IconChevronUp stroke={1.75} className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={index === daysCount - 1}
          onClick={() => reorderDay(weekId, index, index + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-primary-bg text-text-quaternary transition-colors hover:border-accent hover:text-accent active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-text-quaternary"
          aria-label={`Mover el día ${index + 1} hacia abajo`}
          title="Mover abajo"
        >
          <IconChevronDown stroke={1.75} className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <DayEditor weekId={weekId} day={day} index={index} onActionError={onActionError} />
      </div>
    </Reorder.Item>
  );
}

/* ── Tarjeta de una semana: colapsable (acordeón) + drag handle propio ── */
function WeekCard({
  week, index, open, onToggle,
  updateWeekField, duplicateWeek, removeWeek, addDay, reorderDay, setDaysOrder,
  onActionError,
}) {
  const controls = useDragControls();

  const onField = (field) => (e) => updateWeekField(week.id, field, e.target.value);
  const inputCls =
    "w-full rounded-lg border border-border bg-primary-bg px-4 py-3 text-base sm:text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-0";

  return (
    <Reorder.Item
      as="div"
      value={week}
      layout="position"
      transition={{ duration: 0 }}
      dragListener={false}
      dragControls={controls}
      id={weekDomId(index)}
      className="scroll-mt-4 rounded-xl border border-border bg-primary-surface shadow-sm"
      data-testid="week-card"
    >
      {/* Header (siempre visible): handle + toggle + acciones */}
      <div className="flex items-center gap-2 p-4 sm:p-5">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
          className="flex h-11 w-11 flex-shrink-0 cursor-grab items-center justify-center rounded-md border border-border bg-primary-bg text-text-quaternary transition-colors hover:border-accent hover:text-accent active:cursor-grabbing"
          aria-label={`Arrastrar para reordenar la semana ${index + 1}`}
          title="Arrastrar para reordenar"
        >
          <IconGripVertical stroke={1.75} className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onToggle(week.id)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
        >
          <span className="min-w-0">
            <span className="block text-xs uppercase tracking-wide text-text-quaternary">
              Semana {index + 1}
            </span>
            <span className="block truncate text-lg font-semibold text-text-primary">
              {week.title || `Semana ${index + 1}`}
            </span>
            <span className="mt-0.5 block text-xs text-text-tertiary">
              {week.days.length} {week.days.length === 1 ? "día" : "días"}
              {week.summary ? ` · ${week.summary}` : ""}
            </span>
          </span>
          <IconChevronDown
            stroke={1.75}
            className={`h-5 w-5 flex-shrink-0 text-text-quaternary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => duplicateWeek(week.id)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-accent transition-colors hover:border-accent hover:bg-primary-surface-alt"
            aria-label="Duplicar semana" title="Duplicar semana"
          >
            <IconCopy stroke={1.75} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const { success, error } = removeWeek(week.id);
              if (!success && error) onActionError?.(error);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-red-500/40 text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
            aria-label="Eliminar semana" title="Eliminar semana"
          >
            <IconTrash stroke={1.75} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cuerpo colapsable. Render condicional (no clases grid-rows-[0fr]): en
          este proyecto Tailwind no aplica esa utilidad arbitraria, así que el
          truco de grid-rows no colapsaba la altura y la tarjeta seguía enorme. */}
      {open && (
          <div className="flex flex-col gap-5 border-t border-border p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-tertiary">Nombre o foco de la semana</label>
                <input type="text" value={week.title} onChange={onField("title")} placeholder={`Semana ${index + 1}`} className={inputCls} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-text-tertiary">Resumen</label>
                <input type="text" value={week.summary} onChange={onField("summary")} placeholder="Descripción corta del enfoque semanal" className={inputCls} />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-medium text-text-tertiary">Notas</label>
                <textarea rows={3} value={week.notes} onChange={onField("notes")} placeholder="Notas generales, recordatorios o mensajes clave de la semana" className={`${inputCls} min-h-[100px] resize-none`} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-text-tertiary">
                  Días ({week.days.length})
                </h4>
                <button
                  type="button"
                  onClick={() => addDay(week.id)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-primary-surface-alt"
                >
                  <IconPlus stroke={1.75} className="h-4 w-4" /> Agregar día
                </button>
              </div>

              <Reorder.Group
                as="div"
                axis="y"
                values={week.days}
                onReorder={(next) => setDaysOrder(week.id, next.map((d) => d.id))}
                className="flex flex-col gap-4"
              >
                {week.days.map((day, dayIndex) => (
                  <DayRow
                    key={day.id}
                    weekId={week.id}
                    day={day}
                    index={dayIndex}
                    daysCount={week.days.length}
                    reorderDay={reorderDay}
                    onActionError={onActionError}
                  />
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}
    </Reorder.Item>
  );
}

const WeekEditor = memo(({ onActionError }) => {
  const {
    weeks,
    addWeek, duplicateWeek, removeWeek, updateWeekField,
    addDay, reorderDay, setWeeksOrder, setDaysOrder,
  } = usePlanContext();

  // Acordeón: set de ids de semanas abiertas. Por defecto solo la primera,
  // para que el formulario arranque compacto (ese es el punto de los desplegables).
  const [openWeeks, setOpenWeeks] = useState(() => new Set(weeks[0] ? [weeks[0].id] : []));
  const prevIdsRef = useRef(weeks.map((w) => w.id));

  // Al agregar una semana nueva: abrirla y hacer scroll hacia ella.
  useEffect(() => {
    const prev = prevIdsRef.current;
    const nextIds = weeks.map((w) => w.id);
    const added = nextIds.find((id) => !prev.includes(id));
    if (added && nextIds.length > prev.length) {
      setOpenWeeks((s) => new Set(s).add(added));
      const idx = weeks.findIndex((w) => w.id === added);
      requestAnimationFrame(() => {
        document.getElementById(weekDomId(idx))?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    prevIdsRef.current = nextIds;
  }, [weeks]);

  const toggleWeek = useCallback((id) => {
    setOpenWeeks((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const allOpen = weeks.length > 0 && weeks.every((w) => openWeeks.has(w.id));
  const toggleAll = useCallback(() => {
    setOpenWeeks(allOpen ? new Set() : new Set(weeks.map((w) => w.id)));
  }, [allOpen, weeks]);

  // Tocar una semana en el índice → abrirla y navegar hacia ella.
  const goToWeek = useCallback((id, index) => {
    setOpenWeeks((s) => new Set(s).add(id));
    requestAnimationFrame(() => {
      document.getElementById(weekDomId(index))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="flex flex-col gap-6" data-testid="week-editor">
      {/* Índice del plan: navegación rápida + expandir/colapsar todo */}
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-primary-surface p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Índice del plan</h2>
            <p className="text-sm text-text-tertiary">Tocá una semana para ir hacia ella</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-text-quaternary">{weeks.length} sem.</span>
            <button
              type="button"
              onClick={toggleAll}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
            >
              {allOpen
                ? <><IconLayoutNavbarCollapse stroke={1.75} className="h-4 w-4" /> Colapsar todo</>
                : <><IconLayoutNavbarExpand stroke={1.75} className="h-4 w-4" /> Expandir todo</>}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {weeks.map((week, index) => (
            <button
              key={week.id}
              type="button"
              onClick={() => goToWeek(week.id, index)}
              className="group flex flex-col gap-1 rounded-lg border border-border bg-primary-bg px-4 py-3 text-left transition-colors hover:border-accent hover:bg-primary-surface-alt"
            >
              <span className="text-xs uppercase tracking-wide text-text-quaternary">Semana {index + 1}</span>
              <span className="truncate text-sm font-semibold text-text-primary">{week.title || `Semana ${index + 1}`}</span>
              <span className="text-xs text-text-tertiary">{week.days.length} {week.days.length === 1 ? "día" : "días"}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={addWeek}
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-primary-bg px-4 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-primary-surface-alt"
          >
            <IconPlus stroke={1.75} className="h-4 w-4" /> Agregar semana
          </button>
        </div>
      </section>

      {/* Semanas (arrastrables para reordenar) */}
      <Reorder.Group
        as="div"
        axis="y"
        values={weeks}
        onReorder={(next) => setWeeksOrder(next.map((w) => w.id))}
        className="flex flex-col gap-6"
      >
        {weeks.map((week, index) => (
          <WeekCard
            key={week.id}
            week={week}
            index={index}
            open={openWeeks.has(week.id)}
            onToggle={toggleWeek}
            updateWeekField={updateWeekField}
            duplicateWeek={duplicateWeek}
            removeWeek={removeWeek}
            addDay={addDay}
            reorderDay={reorderDay}
            setDaysOrder={setDaysOrder}
            onActionError={onActionError}
          />
        ))}
      </Reorder.Group>
    </div>
  );
});

WeekEditor.displayName = "WeekEditor";

export default WeekEditor;
