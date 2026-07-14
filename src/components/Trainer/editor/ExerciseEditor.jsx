import { memo, useCallback, useState } from "react";
import { Copy, Trash2, AlertCircle, Minus, Plus } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";

/* Stepper estilo Mynter: − [valor] +. El valor sigue siendo editable a mano
   (permite rangos como "8-12" o "AMRAP"); los botones ajustan el entero. */
function Stepper({ value, onChange, ariaLabel }) {
  const match = String(value ?? "").match(/-?\d+/);
  const num = match ? parseInt(match[0], 10) : NaN;
  const step = (delta) => onChange(String(Math.max(0, (isNaN(num) ? 0 : num) + delta)));
  const btn = "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border text-text-primary transition-colors hover:border-accent hover:text-accent active:scale-95";
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => step(-1)} aria-label={`${ariaLabel}: restar`} className={btn}>
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-primary-bg text-center text-lg font-bold text-text-primary transition-colors focus:border-accent focus:outline-none"
      />
      <button type="button" onClick={() => step(1)} aria-label={`${ariaLabel}: sumar`} className={btn}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

const ExerciseEditor = memo(({ weekId, dayId, item, exercise: exerciseProp, onActionError }) => {
  const exercise = item ?? exerciseProp; // DayEditor genérico pasa `item`
  const { updateExerciseField, duplicateExercise, removeExercise } = usePlanContext();
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value) => {
    const v = (value ?? "").toString().trim();
    switch (field) {
      case "name":
        if (!v) return "El nombre del ejercicio es obligatorio";
        if (v.length > 100) return "Máximo 100 caracteres";
        return null;
      case "sets":
        if (!v) return null;
        if (!/^(\d+)(\s*[x-]\s*\d+)?$/.test(v)) return "Formato inválido (ej: 3, 4x8, 3-4)";
        return null;
      case "reps":
        if (!v) return null;
        if (!/^(\d+(-\d+)?|AMRAP|amrap|Max|max|Máx|máx|Fallo|fallo)$/i.test(v)) return "Formato inválido (ej: 8, 8-12, AMRAP)";
        return null;
      case "rir": {
        if (!v) return null;
        if (!/^(\d{1,2}(-\d{1,2})?)$/.test(v)) return "RIR inválido (ej: 0, 2, 1-2)";
        if (parseInt(v.split("-")[0]) > 10) return "RIR máximo es 10";
        return null;
      }
      case "rest":
        if (!v) return null;
        if (!/^(\d+(\.\d+)?)(s|seg|min|m)?(\s*-\s*\d+(\.\d+)?(s|seg|min|m)?)?$/i.test(v)) return "Formato inválido (ej: 60s, 90, 1-2min)";
        return null;
      case "tempo":
        if (!v) return null;
        if (!/^(\d{1}(-\d{1}){2,3})$/.test(v)) return "Formato inválido (ej: 2-0-2, 3-1-1-0)";
        return null;
      case "video": {
        if (!v) return null;
        const url = /^https?:\/\//i.test(v) ? v : `https://${v}`;
        try { new URL(url); return null; } catch { return "URL inválida"; }
      }
      default:
        return null;
    }
  }, []);

  const setField = useCallback((field, value) => {
    updateExerciseField(weekId, dayId, exercise.id, field, value);
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }, [weekId, dayId, exercise.id, updateExerciseField, validateField]);

  const handleChange = useCallback((field) => (e) => setField(field, e.target.value), [setField]);

  const handleBlurVideo = useCallback((e) => {
    const value = e.target.value.trim();
    if (!value || /^https?:\/\//i.test(value)) return;
    const normalized = `https://${value}`;
    try { new URL(normalized); setField("video", normalized); } catch { /* ignore */ }
  }, [setField]);

  const handleDuplicate = useCallback(() => duplicateExercise(weekId, dayId, exercise.id), [dayId, duplicateExercise, exercise.id, weekId]);

  const handleRemove = useCallback(() => {
    const { error } = removeExercise(weekId, dayId, exercise.id);
    if (error && onActionError) onActionError(error);
  }, [dayId, exercise.id, onActionError, removeExercise, weekId]);

  const labelCls = "text-xs font-semibold uppercase tracking-wide text-text-tertiary";
  const inputCls = "h-11 w-full rounded-lg border border-border bg-primary-bg px-3 text-base text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-0";
  const err = (f) => errors[f] && (
    <span className="flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="h-3 w-3" /> {errors[f]}
    </span>
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-primary-surface p-4 transition-colors hover:border-accent/40" data-testid="exercise-editor">
      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Ejercicio <span className="text-red-500">*</span></label>
        <input type="text" value={exercise.name} onChange={handleChange("name")} placeholder="Nombre del ejercicio" className={`${inputCls} ${errors.name ? "border-red-500" : ""}`} />
        {err("name")}
      </div>

      {/* Series + Reps con steppers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Series</label>
          <Stepper value={exercise.sets} onChange={(v) => setField("sets", v)} ariaLabel="Series" />
          {err("sets")}
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Reps</label>
          <Stepper value={exercise.reps} onChange={(v) => setField("reps", v)} ariaLabel="Repeticiones" />
          {err("reps")}
        </div>
      </div>

      {/* RIR / Descanso / Cadencia (texto) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>RIR</label>
          <input type="text" value={exercise.rir} onChange={handleChange("rir")} placeholder="ej: 2" className={`${inputCls} ${errors.rir ? "border-red-500" : ""}`} />
          {err("rir")}
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Descanso</label>
          <input type="text" value={exercise.rest} onChange={handleChange("rest")} placeholder="ej: 90s" className={`${inputCls} ${errors.rest ? "border-red-500" : ""}`} />
          {err("rest")}
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Cadencia</label>
          <input type="text" value={exercise.tempo} onChange={handleChange("tempo")} placeholder="2-0-2" className={`${inputCls} ${errors.tempo ? "border-red-500" : ""}`} />
          {err("tempo")}
        </div>
      </div>

      {/* Video */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Video o referencia</label>
        <input type="url" value={exercise.video} onChange={handleChange("video")} onBlur={handleBlurVideo} placeholder="URL del video (YouTube, Drive, etc.)" className={`${inputCls} ${errors.video ? "border-red-500" : ""}`} />
        {err("video")}
      </div>

      {/* Notas */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Notas específicas</label>
        <textarea rows={2} value={exercise.note} onChange={handleChange("note")} placeholder="Ej. Superserie con press inclinado" className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-primary-bg px-3 py-3 text-base text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-0" />
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
        <button type="button" onClick={handleDuplicate} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-primary-bg">
          <Copy className="h-4 w-4" /> Duplicar
        </button>
        <button type="button" onClick={handleRemove} className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" /> Eliminar
        </button>
      </div>
    </div>
  );
});

ExerciseEditor.displayName = "ExerciseEditor";

export default ExerciseEditor;
