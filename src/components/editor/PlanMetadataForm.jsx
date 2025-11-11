import { memo, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { usePlanContext } from "../../context/PlanContext.jsx";
import { TRAINING_GOALS } from "../../constants/objectives.js";

const PlanMetadataForm = memo(() => {
  const { metadata, updateMetadata } = usePlanContext();

  const handleChange = useCallback(
    (field) => (event) => {
      updateMetadata(field, event.target.value);
    },
    [updateMetadata],
  );

  const labelClasses = "text-sm font-medium text-gray-300";
  const inputClasses =
    "w-full rounded-lg border border-[#2E2E2E] bg-[#0A0A0A] px-4 py-3 text-sm text-white shadow-sm transition-colors focus:border-[#B5FF00] focus:outline-none focus:ring-0";

  const frequencyOptions = ["2", "3", "4", "5"];
  const durationOptions = ["1", "2", "3", "4", "6", "8", "12"];
  const levelOptions = [
    { value: "", label: "Seleccioná el nivel" },
    { value: "Principiante", label: "Principiante" },
    { value: "Intermedio", label: "Intermedio" },
    { value: "Avanzado", label: "Avanzado" },
    { value: "Todos los niveles", label: "Todos los niveles" },
  ];

  return (
    <section
      data-testid="plan-metadata-form"
      className="flex flex-col gap-4 rounded-xl border border-[#2E2E2E] bg-[#0E0E0E] p-5 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-[#B5FF00]" />
          <h2 className="text-lg font-semibold text-white">
            Datos de la plantilla
          </h2>
        </div>
        <span className="text-xs uppercase tracking-wide text-gray-500">
          Completa la información base
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Nombre de la plantilla</label>
          <input
            data-testid="plan-name-input"
            type="text"
            value={metadata.name}
            onChange={handleChange("name")}
            placeholder="Ej. Masculino Volumen FST-7 4x/semana"
            className={`${inputClasses} max-w-[600px]`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Descripción breve</label>
          <textarea
            data-testid="plan-description-input"
            rows={3}
            value={metadata.description}
            onChange={handleChange("description")}
            placeholder="Resumen clave que verá el cliente al explorar la rutina"
            className={`${inputClasses} min-h-[100px] resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Género</label>
            <select
              data-testid="plan-gender-select"
              value={metadata.gender}
              onChange={handleChange("gender")}
              className={inputClasses}
            >
              <option value="">Todos</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Frecuencia (días/semana)</label>
            <select
              data-testid="plan-frequency-input"
              value={metadata.frequency}
              onChange={handleChange("frequency")}
              className={inputClasses}
            >
              <option value="">Seleccioná la frecuencia</option>
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option} días/semana
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Objetivo</label>
            <select
              data-testid="plan-objective-select"
              value={metadata.objective}
              onChange={handleChange("objective")}
              className={inputClasses}
            >
              <option value="">Seleccioná un objetivo</option>
              {TRAINING_GOALS.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Duración (semanas)</label>
            <select
              data-testid="plan-duration-input"
              value={metadata.durationWeeks}
              onChange={handleChange("durationWeeks")}
              className={inputClasses}
            >
              <option value="">Seleccioná la duración</option>
              {durationOptions.map((option) => (
                <option key={option} value={option}>
                  {option} semanas
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Autor / Coach</label>
            <input
              data-testid="plan-author-input"
              type="text"
              value={metadata.author}
              onChange={handleChange("author")}
              placeholder="Nombre del entrenador"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Nivel</label>
            <select
              data-testid="plan-level-input"
              value={metadata.level}
              onChange={handleChange("level")}
              className={inputClasses}
            >
              {levelOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Tags</label>
          <input
            data-testid="plan-tags-input"
            type="text"
            value={metadata.tags}
            onChange={handleChange("tags")}
            placeholder="fst-7, superseries"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Precio (ARS)</label>
            <input
              data-testid="plan-price-input"
              type="number"
              min="0"
              value={metadata.price}
              onChange={handleChange("price")}
              placeholder="Valor del plan en pesos"
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Imagen de portada (URL)</label>
            <input
              data-testid="plan-image-input"
              type="url"
              value={metadata.image}
              onChange={handleChange("image")}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Notas e instrucciones</label>
          <textarea
            data-testid="plan-notes-input"
            rows={3}
            value={metadata.notes}
            onChange={handleChange("notes")}
            placeholder="Rutina estilo Hany Rambod con técnicas FST-7."
            className={`${inputClasses} min-h-[120px] resize-none`}
          />
        </div>
      </div>
    </section>
  );
});

PlanMetadataForm.displayName = "PlanMetadataForm";

export default PlanMetadataForm;
