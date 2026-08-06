/**
 * src/components/Trainer/editor/StepsMetadataForm.jsx
 * Formulario de metadata "a mano": renderiza los MISMOS pasos del onboarding
 * (config.steps) pero todos juntos y editables de una, en vez del asistente
 * paso a paso. Así, en "Editar a mano", el coach puede cambiar el título y el
 * resto de los datos del prompt — sobre todo al reabrir un plan ya guardado.
 *
 * Genérico: sirve para rutina (WORKOUT_STEPS) y nutrición (NUTRITION_STEPS)
 * porque ambos comparten el shape { id, section, field, kind, q, options, showIf }.
 */
import { memo, useMemo } from "react";
import { IconCopy, IconAdjustments } from '@tabler/icons-react';
import { Button } from "../../ui";
import { usePlanContext } from "../../../context/PlanContext.jsx";

const inputCls =
  "w-full rounded-lg border border-border bg-primary-bg px-4 py-3 text-base sm:text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-0";

const StepsMetadataForm = memo(({ steps = [], onCopyPrompt }) => {
  const { metadata, updateMetadata } = usePlanContext();

  // Solo campos editables (el paso 'completion' es la generación con IA, no un dato).
  // Respeta showIf para no mostrar preguntas que no aplican (modo simple).
  const visible = useMemo(
    () => steps.filter((s) => s.field && s.kind !== "completion" && (!s.showIf || s.showIf(metadata))),
    [steps, metadata],
  );

  // Agrupa por sección conservando el orden de aparición.
  const sections = useMemo(() => {
    const order = [];
    const map = new Map();
    for (const step of visible) {
      const key = step.section || "Datos del plan";
      if (!map.has(key)) { map.set(key, []); order.push(key); }
      map.get(key).push(step);
    }
    return order.map((key) => ({ key, steps: map.get(key) }));
  }, [visible]);

  const set = (field) => (e) => updateMetadata(field, e.target.value);

  return (
    <section
      data-testid="steps-metadata-form"
      className="flex flex-col gap-5 rounded-xl border border-border bg-primary-surface p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <IconAdjustments stroke={1.75} className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold text-text-primary">Datos del plan</h2>
      </div>

      {sections.map(({ key, steps: group }) => (
        <div key={key} className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-quaternary">{key}</h3>
          <div className="grid grid-cols-1 gap-4">
            {group.map((step) => {
              const value = metadata[step.field] ?? "";
              return (
                <div key={step.id || step.field} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {step.q}{step.required ? " *" : ""}
                  </label>
                  {step.sub && <p className="-mt-1 text-xs text-text-tertiary">{step.sub}</p>}

                  {step.kind === "chips" ? (
                    <div className="flex flex-wrap gap-2">
                      {(step.options || []).map((o) => {
                        const selected = value === o.v;
                        return (
                          <button
                            key={o.v}
                            type="button"
                            onClick={() => updateMetadata(step.field, selected && !step.required ? "" : o.v)}
                            aria-pressed={selected}
                            className={`min-h-[44px] rounded-lg border px-4 text-sm font-medium transition-colors ${
                              selected
                                ? "border-accent bg-accent/15 text-accent"
                                : "border-border bg-primary-bg text-text-secondary hover:border-accent/50 hover:text-text-primary"
                            }`}
                          >
                            {(o.label || o.v)}{step.suffix || ""}
                          </button>
                        );
                      })}
                    </div>
                  ) : step.kind === "textarea" ? (
                    <textarea
                      rows={3}
                      value={value}
                      onChange={set(step.field)}
                      placeholder={step.placeholder}
                      className={`${inputCls} min-h-[96px] resize-none`}
                    />
                  ) : (
                    <input
                      type="text"
                      inputMode={step.inputMode || undefined}
                      value={value}
                      onChange={set(step.field)}
                      placeholder={step.placeholder}
                      className={inputCls}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {onCopyPrompt && (
        <div className="border-t border-border pt-4">
          <Button onClick={onCopyPrompt} variant="accent" className="w-full sm:w-auto">
            <IconCopy stroke={1.75} className="h-4 w-4" /> Copiar el prompt para la IA
          </Button>
          <p className="mt-3 text-xs text-text-tertiary leading-relaxed">
            Cambiá lo que necesites y volvé a copiar el prompt para regenerar con la IA, o editá el plan a mano abajo.
          </p>
        </div>
      )}
    </section>
  );
});

StepsMetadataForm.displayName = "StepsMetadataForm";

export default StepsMetadataForm;
