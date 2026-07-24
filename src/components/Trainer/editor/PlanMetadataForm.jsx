import { memo, useCallback } from "react";
import { IconChevronRight, IconInfoCircle, IconCopy } from '@tabler/icons-react';
import { Button } from "../../ui";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import { TRAINING_GOALS } from "../../../constants/objectives.js";

// Componente Helper Text reutilizable
const HelperText = ({ children }) => (
  <div className="mt-1.5 flex items-start gap-2 text-xs text-text-tertiary">
    <IconInfoCircle stroke={1.75} className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent/70" />
    <p className="leading-relaxed">{children}</p>
  </div>
);

const PlanMetadataForm = memo(({ onCopyPrompt }) => {
  const { metadata, updateMetadata } = usePlanContext();

  const handleChange = useCallback(
    (field) => (event) => {
      updateMetadata(field, event.target.value);
    },
    [updateMetadata],
  );

  const labelClasses = "text-sm font-medium text-text-secondary";
  const inputClasses =
    "w-full rounded-lg border border-border bg-primary-bg px-4 py-3 text-sm text-text-primary shadow-sm transition-colors focus:border-accent focus:outline-none focus:ring-0";

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
      className="flex flex-col gap-4 rounded-xl border border-border bg-primary-surface p-5 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconChevronRight stroke={1.75} className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">
            Datos de la plantilla
          </h2>
        </div>
        <span className="text-xs uppercase tracking-wide text-text-quaternary">
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
            placeholder='Ej: "Masculino Volumen FST-7 · 4 días por semana"'
            className={`${inputClasses} max-w-[600px]`}
          />
          <HelperText>
            Es el nombre con el que el cliente reconocerá este plan. Debe describir claramente el <strong>objetivo</strong>, el <strong>estilo de entrenamiento</strong> y la <strong>frecuencia</strong>. Este nombre se usa como identidad principal del plan en el sistema.
          </HelperText>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Descripción breve</label>
          <textarea
            data-testid="plan-description-input"
            rows={3}
            value={metadata.description}
            onChange={handleChange("description")}
            placeholder='Ej: "Plan enfocado en ganar masa muscular combinando fuerza y técnicas FST-7, ideal para intermedios y avanzados"'
            className={`${inputClasses} min-h-[100px] resize-none`}
          />
          <HelperText>
            Breve resumen del plan que verá el cliente antes de comprar o iniciar. Explicá <strong>qué va a lograr</strong> y <strong>cómo se entrena</strong>. Esta descripción se utiliza para contextualizar el enfoque general en el Prompt Maestro.
          </HelperText>
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
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            <HelperText>
              Define el enfoque general del plan según <strong>características fisiológicas</strong> y preferencias de entrenamiento. Ajusta la selección de ejercicios, volumen y enfoque metabólico.
            </HelperText>
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
            <HelperText>
              Cantidad de días que el cliente entrenará por semana. Define cómo se reparten los grupos musculares: <strong>3 días</strong> → Full body o torso/pierna · <strong>5 días</strong> → División por grupos musculares.
            </HelperText>
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
            <HelperText>
              Objetivo principal del plan. Es uno de los pilares del algoritmo de generación: define <strong>tipo de estímulo</strong>, <strong>volumen</strong>, <strong>descansos</strong> y <strong>progresión</strong>.
            </HelperText>
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
            <HelperText>
              Cantidad total de semanas que dura el plan. Se usa para estructurar mesociclos y progresiones: <strong>4 semanas</strong> → bloque corto · <strong>8–12 semanas</strong> → mesociclo completo.
            </HelperText>
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Autor / Coach</label>
            <input
              data-testid="plan-author-input"
              type="text"
              value={metadata.author}
              onChange={handleChange("author")}
              placeholder='Ej: "Nick Bare" o "Coach MZ"'
              className={inputClasses}
            />
            <HelperText>
              Nombre del entrenador o referente del plan. Aparece en la presentación al cliente y se utiliza como referencia de <strong>estilo y branding</strong> en el prompt.
            </HelperText>
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
            <HelperText>
              Nivel del plan según la experiencia del cliente. Ajusta <strong>complejidad</strong>, <strong>volumen</strong> y <strong>selección de ejercicios</strong>: Principiante → ejercicios básicos · Avanzado → técnicas intensivas (FST-7, superseries).
            </HelperText>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Tags</label>
          <input
            data-testid="plan-tags-input"
            type="text"
            value={metadata.tags}
            onChange={handleChange("tags")}
            placeholder='Ej: "hipertrofia, fuerza, funcional, fst-7, superseries"'
            className={inputClasses}
          />
          <HelperText>
            Palabras clave que describen el <strong>estilo del plan</strong>. Se usan para búsqueda y categorización. Podés incluir técnicas, metodologías o enfoques específicos.
          </HelperText>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Notas e instrucciones</label>
          <textarea
            data-testid="plan-notes-input"
            rows={3}
            value={metadata.notes}
            onChange={handleChange("notes")}
            placeholder='Ej: "Rutina estilo Hany Rambod con foco en congestión y control del tempo. Incluir variaciones unilaterales para corrección de asimetrías"'
            className={`${inputClasses} min-h-[120px] resize-none`}
          />
          <HelperText>
            Instrucciones especiales para el sistema o el cliente. Acá podés aclarar el <strong>estilo</strong>, <strong>técnicas específicas</strong>, <strong>recomendaciones clave</strong> o cualquier detalle que personalice la generación de la rutina.
          </HelperText>
        </div>

        {/* Botón para copiar prompt - Solo en modo no asistido */}
        {onCopyPrompt && (
          <div className="pt-4 border-t border-border">
            <Button
              onClick={onCopyPrompt}
              variant="accent"
              className="w-full sm:w-auto"
            >
              <IconCopy stroke={1.75} className="h-4 w-4" />
              Copiar Prompt para IA
            </Button>
            <p className="text-xs text-text-tertiary mt-3 leading-relaxed">
              Una vez completada la plantilla, copia el prompt y pégalo en <strong>ChatGPT, Claude o Gemini</strong> para generar automáticamente tu rutina completa con ejercicios, series, repeticiones y notas técnicas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
});

PlanMetadataForm.displayName = "PlanMetadataForm";

export default PlanMetadataForm;
