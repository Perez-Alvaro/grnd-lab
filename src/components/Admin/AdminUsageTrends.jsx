/**
 * src/components/Admin/AdminUsageTrends.jsx
 * Analitica de uso de editores, stickiness (WAU/MAU) y tasas de finalizacion.
 * Filtro por ventana de tiempo: 7 dias, 30 dias o Historico completo.
 * Diseno sobrio sin emojis.
 */
import {
  IconBarbell,
  IconSalad,
  IconChartBar,
  IconActivity,
  IconFileCheck,
} from '@tabler/icons-react';
import { Badge } from '../ui';

export default function AdminUsageTrends({ usage, timeframe, onTimeframeChange, loading }) {
  if (!usage) return null;

  const {
    wau = 0,
    mau = 0,
    stickiness = 0,
    workout = { created: 0, opens: 0, saves: 0, pdf: 0, completionRate: 0 },
    nutrition = { created: 0, opens: 0, saves: 0, pdf: 0, completionRate: 0 },
  } = usage;

  const totalOpens = workout.opens + nutrition.opens;
  const workoutShare = totalOpens > 0 ? Math.round((workout.opens / totalOpens) * 100) : 50;
  const nutritionShare = totalOpens > 0 ? Math.round((nutrition.opens / totalOpens) * 100) : 50;

  return (
    <div className="space-y-6">
      {/* Selector de Ventana Temporal y Tarjetas de Stickiness */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Intensidad de Uso y Adopcion de Editores
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Comportamiento y conversion de uso en las herramientas de prescripcion.
          </p>
        </div>

        {/* Botones de ventana de tiempo */}
        <div className="inline-flex rounded-lg border border-border bg-primary-surface p-1">
          {[
            { id: '7d', label: 'Ultimos 7d' },
            { id: '30d', label: 'Ultimos 30d' },
            { id: 'all', label: 'Historico' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onTimeframeChange(t.id)}
              disabled={loading}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                timeframe === t.id
                  ? 'bg-accent text-primary-bg font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Indicadores de Actividad de Usuarios (WAU / MAU / Stickiness) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-primary-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">WAU (Usuarios Semanales)</span>
            <IconActivity stroke={1.75} className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-text-primary">{wau}</p>
          <p className="text-2xs text-text-muted mt-1">Coaches activos en los ultimos 7 dias</p>
        </div>

        <div className="rounded-xl border border-border bg-primary-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">MAU (Usuarios Mensuales)</span>
            <IconChartBar stroke={1.75} className="h-4 w-4 text-text-secondary" />
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-text-primary">{mau}</p>
          <p className="text-2xs text-text-muted mt-1">Coaches activos en los ultimos 30 dias</p>
        </div>

        <div className="rounded-xl border border-border bg-primary-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Stickiness (WAU / MAU)</span>
            <Badge variant="accent" size="sm">{stickiness}%</Badge>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-text-primary">{stickiness}%</p>
          <p className="text-2xs text-text-muted mt-1">Frecuencia de habito semanal dentro del mes</p>
        </div>
      </div>

      {/* Comparativa Detallada: Editor de Rutinas vs Editor de Nutricion */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor de Rutinas */}
        <div className="rounded-xl border border-border bg-primary-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <IconBarbell stroke={1.75} className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary font-display">Editor de Rutinas</h4>
                <p className="text-xs text-text-muted">{workoutShare}% del uso total de editores</p>
              </div>
            </div>
            <Badge variant="accent" size="sm">
              {workout.completionRate}% finalizacion
            </Badge>
          </div>

          <div className="h-2 rounded-full bg-primary-bg overflow-hidden mb-6 border border-border/40">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${workoutShare}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">Planes en BD</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{workout.created}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">Aperturas</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{workout.opens}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">Guardados</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{workout.saves}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">PDFs Exportados</span>
              <p className="font-mono text-lg font-bold text-accent mt-0.5">{workout.pdf}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
            <span className="flex items-center gap-1.5">
              <IconFileCheck stroke={1.75} className="h-4 w-4 text-accent" />
              Tasa de conversion a PDF:
            </span>
            <span className="font-mono font-medium text-text-primary">{workout.completionRate}%</span>
          </div>
        </div>

        {/* Editor de Nutricion */}
        <div className="rounded-xl border border-border bg-primary-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-bg border border-border text-text-secondary">
                <IconSalad stroke={1.75} className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-text-primary font-display">Editor de Nutricion</h4>
                <p className="text-xs text-text-muted">{nutritionShare}% del uso total de editores</p>
              </div>
            </div>
            <Badge variant="secondary" size="sm">
              {nutrition.completionRate}% finalizacion
            </Badge>
          </div>

          <div className="h-2 rounded-full bg-primary-bg overflow-hidden mb-6 border border-border/40">
            <div
              className="h-full bg-text-secondary/60 rounded-full transition-all"
              style={{ width: `${nutritionShare}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">Planes en BD</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{nutrition.created}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">Aperturas</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{nutrition.opens}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">Guardados</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{nutrition.saves}</p>
            </div>
            <div className="rounded-lg border border-border bg-primary-bg p-3">
              <span className="text-2xs uppercase tracking-wider text-text-muted">PDFs Exportados</span>
              <p className="font-mono text-lg font-bold text-text-primary mt-0.5">{nutrition.pdf}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border">
            <span className="flex items-center gap-1.5">
              <IconFileCheck stroke={1.75} className="h-4 w-4 text-text-secondary" />
              Tasa de conversion a PDF:
            </span>
            <span className="font-mono font-medium text-text-primary">{nutrition.completionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
