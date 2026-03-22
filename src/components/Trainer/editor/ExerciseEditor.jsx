import { memo, useCallback, useState } from "react";
import { Copy, Trash2, AlertCircle } from "lucide-react";
import { usePlanContext } from "../../../context/PlanContext.jsx";

const ExerciseEditor = memo(({ weekId, dayId, exercise, onActionError }) => {
  const { updateExerciseField, duplicateExercise, removeExercise } =
    usePlanContext();

  const [errors, setErrors] = useState({});

  // Funciones de validación específicas para entrenamiento
  const validateField = useCallback((field, value) => {
    const trimmedValue = value.trim();

    switch (field) {
      case 'name':
        if (!trimmedValue) return 'El nombre del ejercicio es obligatorio';
        if (trimmedValue.length > 100) return 'Máximo 100 caracteres';
        return null;

      case 'sets':
        if (!trimmedValue) return null; // Opcional
        // Formatos válidos: "3", "4x8", "3-4", "3 x 8"
        if (!/^(\d+)(\s*[x-]\s*\d+)?$/.test(trimmedValue)) {
          return 'Formato inválido (ej: 3, 4x8, 3-4)';
        }
        return null;

      case 'reps':
        if (!trimmedValue) return null; // Opcional
        // Formatos válidos: "8", "8-12", "10-15", "AMRAP", "Max"
        if (!/^(\d+(-\d+)?|AMRAP|amrap|Max|max|Máx|máx|Fallo|fallo)$/i.test(trimmedValue)) {
          return 'Formato inválido (ej: 8, 8-12, AMRAP)';
        }
        return null;

      case 'rir':
        if (!trimmedValue) return null; // Opcional
        // RIR debe ser 0-10 o formatos como "0-1", "2-3"
        if (!/^(\d{1,2}(-\d{1,2})?)$/.test(trimmedValue)) {
          return 'RIR inválido (ej: 0, 2, 1-2)';
        }
        const rir = parseInt(trimmedValue.split('-')[0]);
        if (rir > 10) return 'RIR máximo es 10';
        return null;

      case 'rest':
        if (!trimmedValue) return null; // Opcional
        // Formatos válidos: "60", "90s", "60-90", "1-2min", "1.5min"
        if (!/^(\d+(\.\d+)?)(s|seg|min|m)?(\s*-\s*\d+(\.\d+)?(s|seg|min|m)?)?$/i.test(trimmedValue)) {
          return 'Formato inválido (ej: 60s, 90, 1-2min)';
        }
        return null;

      case 'tempo':
        if (!trimmedValue) return null; // Opcional
        // Formatos válidos: "2-0-2", "3-1-1", "2-0-2-0"
        if (!/^(\d{1}(-\d{1}){2,3})$/.test(trimmedValue)) {
          return 'Formato inválido (ej: 2-0-2, 3-1-1-0)';
        }
        return null;

      case 'video':
        if (!trimmedValue) return null; // Opcional
        // Normalizar provisoriamente para validación
        let urlToTest = trimmedValue;
        if (!/^https?:\/\//i.test(urlToTest)) {
          urlToTest = `https://${urlToTest}`;
        }
        // Validar que sea una URL válida
        try {
          new URL(urlToTest);
          return null;
        } catch {
          return 'URL inválida';
        }

      default:
        return null;
    }
  }, []);

  const handleChange = useCallback(
    (field) => (event) => {
      const value = event.target.value;

      // Actualizar el valor original
      updateExerciseField(
        weekId,
        dayId,
        exercise.id,
        field,
        value,
      );

      // Validar el campo original o semi-normalizado
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    },
    [dayId, exercise.id, updateExerciseField, weekId, validateField],
  );

  const handleBlurVideo = useCallback(
    (event) => {
      const value = event.target.value.trim();
      if (!value) return;
      if (!/^https?:\/\//i.test(value)) {
        const normalized = `https://${value}`;
        // Si la url completada pasa la validación, la guardo autocorregida
        try {
          new URL(normalized);
          updateExerciseField(weekId, dayId, exercise.id, "video", normalized);
          setErrors(prev => ({ ...prev, video: null }));
        } catch {}
      }
    },
    [dayId, exercise.id, updateExerciseField, weekId]
  );


  const handleDuplicate = useCallback(() => {
    duplicateExercise(weekId, dayId, exercise.id);
  }, [dayId, duplicateExercise, exercise.id, weekId]);

  const handleRemove = useCallback(() => {
    const { error } = removeExercise(weekId, dayId, exercise.id);
    if (error && onActionError) {
      onActionError(error);
    }
  }, [dayId, exercise.id, onActionError, removeExercise, weekId]);

  const labelClasses =
    "text-xs font-semibold uppercase tracking-wide text-neutral-500";
  const inputClasses =
    "h-11 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white transition-colors focus:border-accent focus:outline-none focus:ring-0";

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/70 p-4 shadow-sm transition-colors duration-200 ease-in-out hover:border-accent/40 hover:bg-neutral-900"
      data-testid="exercise-editor"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className={labelClasses}>
            Ejercicio <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={exercise.name}
            onChange={handleChange("name")}
            placeholder="Nombre del ejercicio"
            className={`${inputClasses} ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Series</label>
          <input
            type="text"
            value={exercise.sets}
            onChange={handleChange("sets")}
            placeholder="ej: 3"
            className={`${inputClasses} ${errors.sets ? 'border-red-500' : ''}`}
          />
          {errors.sets && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.sets}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Reps</label>
          <input
            type="text"
            value={exercise.reps}
            onChange={handleChange("reps")}
            className={`${inputClasses} ${errors.reps ? 'border-red-500' : ''}`}
            placeholder="ej: 8-12"
          />
          {errors.reps && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.reps}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>RIR</label>
          <input
            type="text"
            value={exercise.rir}
            onChange={handleChange("rir")}
            className={`${inputClasses} ${errors.rir ? 'border-red-500' : ''}`}
            placeholder="ej: 2"
          />
          {errors.rir && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.rir}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Descanso</label>
          <input
            type="text"
            value={exercise.rest}
            onChange={handleChange("rest")}
            className={`${inputClasses} ${errors.rest ? 'border-red-500' : ''}`}
            placeholder="ej: 90s"
          />
          {errors.rest && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.rest}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-1">
          <label className={labelClasses}>Cadencia</label>
          <input
            type="text"
            value={exercise.tempo}
            onChange={handleChange("tempo")}
            className={`${inputClasses} ${errors.tempo ? 'border-red-500' : ''}`}
            placeholder="ej: 2-0-2"
          />
          {errors.tempo && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.tempo}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 md:col-span-3">
          <label className={labelClasses}>Video o referencia</label>
          <input
            type="url"
            value={exercise.video}
            onChange={handleChange("video")}
            onBlur={handleBlurVideo}
            placeholder="URL del video (ej. YouTube, Drive, etc.)"
            className={`${inputClasses} ${errors.video ? 'border-red-500' : ''}`}
          />
          {errors.video && (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors.video}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Notas específicas
        </label>
        <textarea
          rows={2}
          value={exercise.note}
          onChange={handleChange("note")}
          className="min-h-[80px] w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-white transition-colors focus:border-accent focus:outline-none focus:ring-0"
          placeholder="Ej. Superserie con press inclinado"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-3 md:flex-row md:items-center md:justify-between">
        <span className="text-xs text-neutral-500">
          Gestioná este ejercicio rápidamente
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDuplicate}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:border-accent hover:bg-neutral-900"
          >
            <Copy className="h-4 w-4" /> Duplicar ejercicio
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
});

ExerciseEditor.displayName = "ExerciseEditor";

export default ExerciseEditor;
