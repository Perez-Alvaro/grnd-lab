import { memo, useCallback, useMemo, useState } from "react";
import { Copy, Trash2, ExternalLink, Plus, ChevronDown } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";

/* Hoja del árbol para NUTRICIÓN: una comida. Reutiliza los métodos de leaf del
   PlanContext (updateExerciseField/duplicateExercise/removeExercise) que operan
   sobre day.meals. Sin sub-ítems por alimento: la comida es la hoja atómica. */

const MEAL_NAMES = ["Desayuno", "Almuerzo", "Merienda", "Cena", "Colación"];

const rid = () => Math.random().toString(36).slice(2, 10);

// Devuelve SIEMPRE una URL http(s) válida. Si el valor no es una URL absoluta
// con host (texto o algo malformado de la IA), lo convierte en búsqueda YouTube.
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

const labelCls = "text-xs font-semibold uppercase tracking-wide text-text-tertiary";
const inputCls = "h-11 w-full rounded-lg border border-border bg-primary-bg px-3 text-base text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-0";
const areaCls = "min-h-[80px] w-full resize-none rounded-lg border border-border bg-primary-bg px-3 py-3 text-base text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-0";

function MacroInput({ label, value, onChange, suffix }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type="text" inputMode="numeric" value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} pr-8 text-center font-bold`}
          placeholder="0"
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

const MealEditor = memo(({ weekId, dayId, item, onActionError }) => {
  const { updateExerciseField, duplicateExercise, removeExercise } = usePlanContext();
  const [showVariantes, setShowVariantes] = useState(false);

  const setField = useCallback(
    (field, value) => updateExerciseField(weekId, dayId, item.id, field, value),
    [weekId, dayId, item.id, updateExerciseField],
  );
  const onChange = useCallback((field) => (e) => setField(field, e.target.value), [setField]);

  const openVideo = useCallback(() => {
    const u = buildVideoUrl(item.videoUrl);
    if (u) window.open(u, "_blank", "noopener,noreferrer");
  }, [item.videoUrl]);

  const handleRemove = useCallback(() => {
    const { error } = removeExercise(weekId, dayId, item.id);
    if (error && onActionError) onActionError(error);
  }, [weekId, dayId, item.id, removeExercise, onActionError]);

  const variantes = useMemo(() => item.variantes || [], [item.variantes]);
  const addVariante = useCallback(() => {
    setField("variantes", [...variantes, { id: rid(), label: "", ingredientes: "", kcal: "", proteina_g: "", carbos_g: "", grasas_g: "", videoUrl: "" }]);
    setShowVariantes(true);
  }, [setField, variantes]);
  const updateVariante = useCallback((vid, f, val) => {
    setField("variantes", variantes.map((v) => (v.id === vid ? { ...v, [f]: val } : v)));
  }, [setField, variantes]);
  const removeVariante = useCallback((vid) => {
    setField("variantes", variantes.filter((v) => v.id !== vid));
  }, [setField, variantes]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-primary-surface p-4 transition-colors hover:border-accent/40" data-testid="meal-editor">
      {/* Nombre + hora */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Comida <span className="text-red-500">*</span></label>
          <input
            type="text" list={`meal-names-${item.id}`} value={item.name || ""}
            onChange={onChange("name")} placeholder="Ej: Desayuno" className={inputCls}
          />
          <datalist id={`meal-names-${item.id}`}>
            {MEAL_NAMES.map((n) => <option key={n} value={n} />)}
          </datalist>
        </div>
        <div className="flex flex-col gap-2 sm:w-32">
          <label className={labelCls}>Hora</label>
          <input type="time" value={item.hora || ""} onChange={onChange("hora")} className={inputCls} />
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MacroInput label="Kcal" value={item.kcal} onChange={(v) => setField("kcal", v)} />
        <MacroInput label="Prot" value={item.proteina_g} onChange={(v) => setField("proteina_g", v)} suffix="g" />
        <MacroInput label="Carbos" value={item.carbos_g} onChange={(v) => setField("carbos_g", v)} suffix="g" />
        <MacroInput label="Grasas" value={item.grasas_g} onChange={(v) => setField("grasas_g", v)} suffix="g" />
      </div>

      {/* Ingredientes */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Ingredientes</label>
        <textarea rows={2} value={item.ingredientes || ""} onChange={onChange("ingredientes")} placeholder="Ej: 80g avena, 200ml leche descremada, 1 banana, 10g manteca de maní" className={areaCls} />
      </div>

      {/* Preparación */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Preparación</label>
        <textarea rows={2} value={item.preparacion || ""} onChange={onChange("preparacion")} placeholder="Instrucciones concisas (2–3 oraciones)" className={areaCls} />
      </div>

      {/* Sustituciones */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Sustituciones</label>
        <textarea rows={2} value={item.sustituciones || ""} onChange={onChange("sustituciones")} placeholder="Alternativas locales para cada ingrediente clave" className={areaCls} />
      </div>

      {/* Nota timing */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Nota de timing</label>
        <input type="text" value={item.nota_timing || ""} onChange={onChange("nota_timing")} placeholder="Ej: tomalo 30 min antes del entreno" className={inputCls} />
      </div>

      {/* Video receta (YouTube) */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Video de receta (YouTube)</label>
        <div className="flex items-center gap-2">
          <input type="url" value={item.videoUrl || ""} onChange={onChange("videoUrl")} placeholder="https://www.youtube.com/results?search_query=..." className={inputCls} />
          <button
            type="button" onClick={openVideo} disabled={!item.videoUrl}
            aria-label="Abrir video de receta"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-border text-accent transition-colors hover:border-accent hover:bg-primary-bg disabled:opacity-30"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Variantes (opciones intercambiables) */}
      <div className="rounded-lg border border-border bg-primary-bg">
        <button
          type="button" onClick={() => setShowVariantes((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Variantes ({variantes.length})
          </span>
          <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${showVariantes ? "rotate-180" : ""}`} />
        </button>
        {showVariantes && (
          <div className="flex flex-col gap-3 px-3 pb-3">
            {variantes.map((v) => (
              <div key={v.id} className="flex flex-col gap-2 rounded-lg border border-border bg-primary-surface p-3">
                <div className="flex items-center gap-2">
                  <input type="text" value={v.label || ""} onChange={(e) => updateVariante(v.id, "label", e.target.value)} placeholder="Ej: Versión rápida" className={`${inputCls} h-10`} />
                  <button type="button" onClick={() => removeVariante(v.id)} aria-label="Eliminar variante" className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-red-500/40 text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea rows={2} value={v.ingredientes || ""} onChange={(e) => updateVariante(v.id, "ingredientes", e.target.value)} placeholder="Ingredientes de la variante" className={`${areaCls} min-h-[60px]`} />
                <div className="grid grid-cols-4 gap-2">
                  <input type="text" inputMode="numeric" value={v.kcal ?? ""} onChange={(e) => updateVariante(v.id, "kcal", e.target.value)} placeholder="kcal" className={`${inputCls} h-10 text-center`} />
                  <input type="text" inputMode="numeric" value={v.proteina_g ?? ""} onChange={(e) => updateVariante(v.id, "proteina_g", e.target.value)} placeholder="P" className={`${inputCls} h-10 text-center`} />
                  <input type="text" inputMode="numeric" value={v.carbos_g ?? ""} onChange={(e) => updateVariante(v.id, "carbos_g", e.target.value)} placeholder="C" className={`${inputCls} h-10 text-center`} />
                  <input type="text" inputMode="numeric" value={v.grasas_g ?? ""} onChange={(e) => updateVariante(v.id, "grasas_g", e.target.value)} placeholder="G" className={`${inputCls} h-10 text-center`} />
                </div>
                <input type="url" value={v.videoUrl || ""} onChange={(e) => updateVariante(v.id, "videoUrl", e.target.value)} placeholder="Video de la variante (YouTube)" className={`${inputCls} h-10`} />
              </div>
            ))}
            <button type="button" onClick={addVariante} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-primary-surface">
              <Plus className="h-4 w-4" /> Agregar variante
            </button>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
        <button type="button" onClick={() => duplicateExercise(weekId, dayId, item.id)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-primary-bg">
          <Copy className="h-4 w-4" /> Duplicar
        </button>
        <button type="button" onClick={handleRemove} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" /> Eliminar
        </button>
      </div>
    </div>
  );
});

MealEditor.displayName = "MealEditor";

export default MealEditor;
