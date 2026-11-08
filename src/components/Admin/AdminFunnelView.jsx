/**
 * src/components/Admin/AdminFunnelView.jsx
 * Embudo de activacion y conversion (Product-Led Growth).
 * Detecta fortalezas y debilidades del software y la retencion de valor.
 * Sin emojis; diseno sobrio con tokens del proyecto y Tabler Icons.
 */
import {
  IconUserCheck,
  IconBarbell,
  IconFileExport,
  IconFlame,
  IconCrown,
  IconArrowRight,
  IconBulb,
} from '@tabler/icons-react';
import { Badge } from '../ui';

const STEP_ICONS = {
  signup: IconUserCheck,
  routine: IconBarbell,
  pdf: IconFileExport,
  saturated: IconFlame,
  paid: IconCrown,
};

export default function AdminFunnelView({ funnel = [] }) {
  if (!funnel || funnel.length === 0) return null;

  const totalSignups = funnel[0]?.count || 1;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-primary-surface p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Embudo de Activacion y Conversion (Product-Led Growth)
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Seguimiento de la adopcion: desde el registro hasta el pago recurrente.
            </p>
          </div>
          <Badge variant="accent" size="sm">
            {funnel[funnel.length - 1]?.conversionPct}% conversion final a pago
          </Badge>
        </div>

        {/* Pasos del Embudo */}
        <div className="space-y-4">
          {funnel.map((step, idx) => {
            const Icon = STEP_ICONS[step.id] || IconArrowRight;
            const prevStep = idx > 0 ? funnel[idx - 1] : null;
            const dropoffPct = prevStep && prevStep.count > 0
              ? Math.max(0, 100 - Math.round((step.count / prevStep.count) * 100))
              : 0;

            const widthPct = Math.max(6, Math.round((step.count / totalSignups) * 100));

            return (
              <div key={step.id} className="relative rounded-lg border border-border bg-primary-bg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-surface border border-border text-accent flex-shrink-0">
                      <Icon stroke={1.75} className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-text-muted">Paso {idx + 1}</span>
                        <h4 className="text-sm font-bold text-text-primary">{step.name}</h4>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right flex-shrink-0">
                    <div>
                      <p className="font-mono text-lg font-bold text-text-primary">{step.count}</p>
                      <p className="text-2xs text-text-muted font-mono">{step.conversionPct}% del total</p>
                    </div>
                    {idx > 0 && dropoffPct > 0 && (
                      <div className="hidden md:block pl-3 border-l border-border text-left">
                        <p className="text-2xs uppercase tracking-wider text-text-muted">Abandono</p>
                        <p className="text-xs font-mono font-medium text-warning">-{dropoffPct}%</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barra de progreso visual */}
                <div className="h-2 rounded-full bg-primary-surface overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Diagnostico de Fortalezas y Debilidades del Embudo */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-primary-bg p-4">
            <div className="flex items-center gap-2 text-text-primary mb-2">
              <IconBulb stroke={1.75} className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider">Fortalezas del Flujo</span>
            </div>
            <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
              <li>El boton de carga de rutina de ejemplo acelera el Time-to-Value (TTV) inicial.</li>
              <li>La exportacion de PDF con marca propia es el principal Aha! moment que fideliza al entrenador.</li>
              <li>El tier Freemium reduce la friccion de registro al no solicitar tarjeta bancaria de entrada.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-primary-bg p-4">
            <div className="flex items-center gap-2 text-text-primary mb-2">
              <IconBulb stroke={1.75} className="h-4 w-4 text-warning" />
              <span className="text-xs font-semibold uppercase tracking-wider">Puntos de Fuga Detectados</span>
            </div>
            <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4">
              <li>Los entrenadores que crean rutinas pero no exportan PDF suelen abandonar por desconocimiento de las plantillas.</li>
              <li>Los usuarios que alcanzan 3 rutinas gratuitas requieren un llamado a la accion claro para contratar Pro.</li>
              <li>La renovacion de transferencias manuales tiene mayor friccion que el debito automatico por Mercado Pago.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
