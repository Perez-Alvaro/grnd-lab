import React, { memo, useCallback, useRef, useState } from "react";
import { IconChevronRight, IconInfoCircle, IconCopy, IconPhoto, IconUpload, IconTrash, IconCheck, IconSparkles } from '@tabler/icons-react';
import { getCoachBranding, saveCoachBranding, processLogoFile } from '../../../lib/branding.js';
import { toast } from '../../../utils/toast.js';
import { Button } from "../../ui";
import { usePlanContext } from "../../../context/PlanContext.jsx";
import { TRAINING_GOALS } from "../../../constants/objectives.js";

// Componente Helper Text reutilizable con icono de información e interactividad hover / focus / tap
const HelperTooltip = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((prev) => !prev);
        }}
        aria-label="Más información"
        className="text-text-tertiary hover:text-accent focus:text-accent focus:outline-none p-0.5 rounded transition-colors"
      >
        <IconInfoCircle stroke={1.75} className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[85vw] p-2.5 bg-primary-surface border border-border rounded-xl shadow-xl z-50 text-xs text-text-secondary leading-relaxed pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          {children}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-primary-surface" />
        </div>
      )}
    </div>
  );
};

const PlanMetadataForm = memo(({ onCopyPrompt }) => {
  const { metadata, updateMetadata } = usePlanContext();
  const fileInputRef = useRef(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Logo activo: específico de la plantilla o heredado de la configuración global
  const activeLogo = metadata.brandLogo || (typeof window !== 'undefined' ? getCoachBranding().brandLogo : '') || '';
  const activeBrandName = metadata.brandName !== undefined ? metadata.brandName : (metadata.author || (typeof window !== 'undefined' ? getCoachBranding().brandName : '') || '');

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const dataUrl = await processLogoFile(file);
      updateMetadata('brandLogo', dataUrl);
      toast.success('Logo cargado para esta rutina');
    } catch (err) {
      toast.error(err.message || 'Error al procesar el logo');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    updateMetadata('brandLogo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Logo quitado de esta plantilla');
  };

  const handleSaveAsDefault = () => {
    saveCoachBranding({
      brandName: activeBrandName,
      brandLogo: activeLogo,
    });
    toast.success('Marca y logo guardados como predeterminados para todos tus planes');
  };

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
          <label className={labelClasses}>Nombre de la plantilla <HelperTooltip>Es el nombre con el que el cliente reconocerá este plan. Debe describir claramente el <strong>objetivo</strong>, el <strong>estilo de entrenamiento</strong> y la <strong>frecuencia</strong>. Este nombre se usa como identidad principal del plan en el sistema.</HelperTooltip></label>
<input
            data-testid="plan-name-input"
            type="text"
            value={metadata.name}
            onChange={handleChange("name")}
            placeholder='Ej: "Masculino Volumen FST-7 · 4 días por semana"'
            className={`${inputClasses} max-w-[600px]`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Descripción breve <HelperTooltip>Breve resumen del plan que verá el cliente antes de comprar o iniciar. Explicá <strong>qué va a lograr</strong> y <strong>cómo se entrena</strong>. Esta descripción se utiliza para contextualizar el enfoque general en el Prompt Maestro.</HelperTooltip></label>
<textarea
            data-testid="plan-description-input"
            rows={3}
            value={metadata.description}
            onChange={handleChange("description")}
            placeholder='Ej: "Plan enfocado en ganar masa muscular combinando fuerza y técnicas FST-7, ideal para intermedios y avanzados"'
            className={`${inputClasses} min-h-[100px] resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Género <HelperTooltip>Define el enfoque general del plan según <strong>características fisiológicas</strong> y preferencias de entrenamiento. Ajusta la selección de ejercicios, volumen y enfoque metabólico.</HelperTooltip></label>
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
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Frecuencia (días/semana) <HelperTooltip>Cantidad de días que el cliente entrenará por semana. Define cómo se reparten los grupos musculares: <strong>3 días</strong> → Full body o torso/pierna · <strong>5 días</strong> → División por grupos musculares.</HelperTooltip></label>
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
            <label className={labelClasses}>Objetivo <HelperTooltip>Objetivo principal del plan. Es uno de los pilares del algoritmo de generación: define <strong>tipo de estímulo</strong>, <strong>volumen</strong>, <strong>descansos</strong> y <strong>progresión</strong>.</HelperTooltip></label>
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
            <label className={labelClasses}>Duración (semanas) <HelperTooltip>Cantidad total de semanas que dura el plan. Se usa para estructurar mesociclos y progresiones: <strong>4 semanas</strong> → bloque corto · <strong>8–12 semanas</strong> → mesociclo completo.</HelperTooltip></label>
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
            <label className={labelClasses}>Autor / Coach <HelperTooltip>Nombre del entrenador o referente del plan. Aparece en la presentación al cliente y se utiliza como referencia de <strong>estilo y branding</strong> en el prompt.</HelperTooltip></label>
<input
              data-testid="plan-author-input"
              type="text"
              value={metadata.author}
              onChange={handleChange("author")}
              placeholder='Ej: "Nick Bare" o "Coach MZ"'
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClasses}>Nivel <HelperTooltip>Nivel del plan según la experiencia del cliente. Ajusta <strong>complejidad</strong>, <strong>volumen</strong> y <strong>selección de ejercicios</strong>: Principiante → ejercicios básicos · Avanzado → técnicas intensivas (FST-7, superseries).</HelperTooltip></label>
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
          <label className={labelClasses}>Tags <HelperTooltip>Palabras clave que describen el <strong>estilo del plan</strong>. Se usan para búsqueda y categorización. Podés incluir técnicas, metodologías o enfoques específicos.</HelperTooltip></label>
<input
            data-testid="plan-tags-input"
            type="text"
            value={metadata.tags}
            onChange={handleChange("tags")}
            placeholder='Ej: "hipertrofia, fuerza, funcional, fst-7, superseries"'
            className={inputClasses}
          />
        </div>

        {/* Sección de Marca y Logo en PDF */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconSparkles stroke={1.75} className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
                Identidad de Marca y Logo en PDF (White-Label)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleSaveAsDefault}
              className="text-xs text-accent hover:underline font-semibold flex items-center gap-1"
              title="Guardar como marca predeterminada para futuras rutinas"
            >
              <IconCheck stroke={1.75} className="h-3.5 w-3.5" />
              Guardar como predeterminada
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col gap-2">
              <label className={labelClasses}>Nombre de Marca / Coach en Portada <HelperTooltip>Aparece destacado en la carátula, en el encabezado de cada semana y en el pie de página de los PDFs.</HelperTooltip></label>
<input
                data-testid="plan-brand-name-input"
                type="text"
                value={activeBrandName}
                onChange={(e) => {
                  updateMetadata("brandName", e.target.value);
                  updateMetadata("author", e.target.value);
                }}
                placeholder='Ej: "Power & Iron Coaching" o "Coach Lucas"'
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClasses}>Logo Comercial de la Portada <HelperTooltip>Se imprime centrado sobre el nombre de marca en la primera página de la rutina y del plan nutricional.</HelperTooltip></label>
<input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />

              {activeLogo ? (
                <div className="rounded-lg border border-border bg-primary-bg p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-24 items-center justify-center rounded border border-border/80 bg-white p-1 overflow-hidden shadow-sm flex-shrink-0">
                      <img
                        src={activeLogo}
                        alt="Logo de marca"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">Logo activo</p>
                      <p className="text-2xs text-text-tertiary">Se imprimirá en la portada del PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingLogo}
                    >
                      Cambiar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveLogo}
                      disabled={uploadingLogo}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <IconTrash stroke={1.75} className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-dashed border-border hover:border-accent bg-primary-bg p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <IconPhoto stroke={1.75} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-primary">Subir logo en portada</p>
                      <p className="text-2xs text-text-tertiary">PNG, JPG, WebP o SVG</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={uploadingLogo}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <IconUpload stroke={1.75} className="h-3.5 w-3.5" /> Subir
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClasses}>Notas e instrucciones <HelperTooltip>Instrucciones especiales para el sistema o el cliente. Acá podés aclarar el <strong>estilo</strong>, <strong>técnicas específicas</strong>, <strong>recomendaciones clave</strong> o cualquier detalle que personalice la generación de la rutina.</HelperTooltip></label>
<textarea
            data-testid="plan-notes-input"
            rows={3}
            value={metadata.notes}
            onChange={handleChange("notes")}
            placeholder='Ej: "Rutina estilo Hany Rambod con foco en congestión y control del tempo. Incluir variaciones unilaterales para corrección de asimetrías"'
            className={`${inputClasses} min-h-[120px] resize-none`}
          />
        </div>
      </div>
    </section>
  );
});

PlanMetadataForm.displayName = "PlanMetadataForm";

export default PlanMetadataForm;
