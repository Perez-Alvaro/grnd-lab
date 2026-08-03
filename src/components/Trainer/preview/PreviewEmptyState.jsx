import { IconSparkles, IconArrowRight } from "@tabler/icons-react";
import { Button } from "../../ui";

/**
 * Estado vacío compartido por RoutinePreview y NutritionPreview.
 * Sin esto, entrar a "Vista previa" antes de generar mostraba una tarjeta en
 * blanco con "0 semanas" y ninguna salida.
 */
export default function PreviewEmptyState({
  title = "Todavía no hay nada para mostrar",
  subtitle = "Respondé las preguntas del asistente y pegá la respuesta de la IA. El plan va a aparecer acá.",
  onGoToAssistant,
}) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-primary-surface-elevated px-6 py-12 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
        <IconSparkles stroke={1.75} className="h-7 w-7 text-accent" />
      </div>
      <p className="text-base font-semibold text-text-primary">{title}</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-tertiary">{subtitle}</p>
      {onGoToAssistant && (
        <Button variant="accent" size="md" onClick={onGoToAssistant} className="mt-6">
          Ir al asistente <IconArrowRight stroke={1.75} className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
