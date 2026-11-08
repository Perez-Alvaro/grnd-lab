/**
 * src/components/Admin/AdminMetricsOverview.jsx
 * Vista ejecutiva y analitica con KPIs de ingresos, distribucion de planes y alertas accionables.
 * No utiliza emojis; utiliza Tabler Icons y tokens del sistema de diseno.
 */
import {
  IconReceipt,
  IconUsers,
  IconTrendingUp,
  IconAlertTriangle,
  IconFlame,
  IconClockHour4,
  IconCreditCard,
  IconBuildingBank,
} from '@tabler/icons-react';
import { Badge } from '../ui';

export default function AdminMetricsOverview({ metrics, onSelectSection }) {
  if (!metrics) return null;

  const {
    totalCoaches = 0,
    active = 0,
    freemiumCount = 0,
    freemiumSaturatedCount = 0,
    churnRiskCount = 0,
    expiring7d = 0,
    expiring30d = 0,
    mrrARS = 0,
    mrrUSD = 0,
    arrARS = 0,
    cobrado30dARS = 0,
    cobrado30dUSD = 0,
    conversionRate = 0,
    planDist = { freemium: 0, pro_monthly: 0, pro_annual: 0, legacy: 0 },
    paymentMethodDist = { mercadopago: 0, transfer: 0 },
  } = metrics;

  return (
    <div className="space-y-6">
      {/* Alertas Accionables de Negocio */}
      {(freemiumSaturatedCount > 0 || churnRiskCount > 0 || expiring7d > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {freemiumSaturatedCount > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <IconFlame stroke={1.75} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider">Oportunidad de Upgrade</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">
                  <span className="font-mono font-bold">{freemiumSaturatedCount}</span> {freemiumSaturatedCount === 1 ? 'coach alcanzo' : 'coaches alcanzaron'} el limite del plan inicial (2 o 3 rutinas).
                </p>
                <button
                  onClick={() => onSelectSection?.('clientes')}
                  className="mt-2 text-xs font-medium text-accent hover:underline inline-flex items-center gap-1"
                >
                  Ver clientes listos para Pro
                </button>
              </div>
            </div>
          )}

          {churnRiskCount > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                <IconAlertTriangle stroke={1.75} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-warning uppercase tracking-wider">Riesgo de Cancelacion</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">
                  <span className="font-mono font-bold">{churnRiskCount}</span> {churnRiskCount === 1 ? 'cliente pago lleva' : 'clientes pagos llevan'} mas de 14 dias sin actividad.
                </p>
                <button
                  onClick={() => onSelectSection?.('clientes')}
                  className="mt-2 text-xs font-medium text-warning hover:underline inline-flex items-center gap-1"
                >
                  Revisar clientes inactivos
                </button>
              </div>
            </div>
          )}

          {expiring7d > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-border bg-primary-surface p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-bg text-text-secondary border border-border">
                <IconClockHour4 stroke={1.75} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Renovaciones Proximas</p>
                <p className="text-sm font-medium text-text-primary mt-0.5">
                  <span className="font-mono font-bold">{expiring7d}</span> {expiring7d === 1 ? 'suscripcion vence' : 'suscripciones vencen'} en los proximos 7 dias ({expiring30d} en 30 dias).
                </p>
                <button
                  onClick={() => onSelectSection?.('clientes')}
                  className="mt-2 text-xs font-medium text-text-secondary hover:underline inline-flex items-center gap-1"
                >
                  Gestionar vencimientos
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tarjetas Principales de KPIs Financieros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR ARS */}
        <div className="rounded-xl border border-border bg-primary-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">MRR Proyectado (ARS)</span>
            <div className="h-7 w-7 rounded-md bg-accent/10 flex items-center justify-center text-accent">
              <IconTrendingUp stroke={1.75} className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-text-primary">
            ${mrrARS.toLocaleString('es-AR')}
            {mrrUSD > 0 && (
              <span className="text-sm font-normal text-text-muted ml-1.5">+ ${mrrUSD} USD</span>
            )}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <span>ARR anualizado:</span>
            <span className="font-mono font-medium text-text-secondary">${arrARS.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* Cobrado 30d */}
        <div className="rounded-xl border border-border bg-primary-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Cobrado Ultimos 30d</span>
            <div className="h-7 w-7 rounded-md bg-primary-bg flex items-center justify-center text-text-secondary border border-border">
              <IconReceipt stroke={1.75} className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-text-primary">
            ${cobrado30dARS.toLocaleString('es-AR')}
            {cobrado30dUSD > 0 && (
              <span className="text-sm font-normal text-text-muted ml-1.5">+ ${cobrado30dUSD} USD</span>
            )}
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Pagos reales que impactaron en el periodo
          </p>
        </div>

        {/* Clientes Activos */}
        <div className="rounded-xl border border-border bg-primary-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Coaches con Acceso</span>
            <div className="h-7 w-7 rounded-md bg-primary-bg flex items-center justify-center text-text-secondary border border-border">
              <IconUsers stroke={1.75} className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold text-text-primary">
            {active} <span className="text-sm font-normal text-text-muted">/ {totalCoaches}</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
            <span>Tasa de conversion a Pro:</span>
            <span className="font-mono font-medium text-accent">{conversionRate}%</span>
          </div>
        </div>

        {/* Distribucion Freemium vs Pago */}
        <div className="rounded-xl border border-border bg-primary-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold text-text-muted uppercase tracking-wider">Plan Inicial vs Pro</span>
            <Badge variant="accent" size="sm">Freemium activo</Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-mono text-2xl font-bold text-text-primary">{freemiumCount}</p>
            <p className="text-xs text-text-muted">en plan inicial gratuito</p>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            {freemiumSaturatedCount} cerca del limite de 3 rutinas
          </p>
        </div>
      </div>

      {/* Desglose de Planes y Canales de Cobro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose de Tiers */}
        <div className="rounded-xl border border-border bg-primary-surface p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Distribucion de Entrenadores por Plan
          </h3>
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-text-primary font-medium">Plan Inicial (Freemium, hasta 3 rutinas)</span>
                <span className="font-mono text-text-muted">{planDist.freemium} coaches</span>
              </div>
              <div className="h-2 rounded-full bg-primary-bg overflow-hidden border border-border/40">
                <div
                  className="h-full bg-text-muted/40 rounded-full"
                  style={{ width: `${totalCoaches > 0 ? (planDist.freemium / totalCoaches) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-text-primary font-medium">Pro Mensual ($15.000 ARS/mes)</span>
                <span className="font-mono text-accent font-semibold">{planDist.pro_monthly} suscripciones</span>
              </div>
              <div className="h-2 rounded-full bg-primary-bg overflow-hidden border border-border/40">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${totalCoaches > 0 ? (planDist.pro_monthly / totalCoaches) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-text-primary font-medium">Pro Anual ($120.000 ARS/ano)</span>
                <span className="font-mono text-accent font-semibold">{planDist.pro_annual} suscripciones</span>
              </div>
              <div className="h-2 rounded-full bg-primary-bg overflow-hidden border border-border/40">
                <div
                  className="h-full bg-accent/70 rounded-full"
                  style={{ width: `${totalCoaches > 0 ? (planDist.pro_annual / totalCoaches) * 100 : 0}%` }}
                />
              </div>
            </div>

            {planDist.legacy > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">Planes Legacy / Historicos</span>
                  <span className="font-mono text-text-muted">{planDist.legacy} suscripciones</span>
                </div>
                <div className="h-2 rounded-full bg-primary-bg overflow-hidden border border-border/40">
                  <div
                    className="h-full bg-border rounded-full"
                    style={{ width: `${totalCoaches > 0 ? (planDist.legacy / totalCoaches) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canales y Metodos de Cobro */}
        <div className="rounded-xl border border-border bg-primary-surface p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Canales de Cobro Aprobados
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-primary-bg p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <IconCreditCard stroke={1.75} className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wider">Mercado Pago</span>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-text-primary">{paymentMethodDist.mercadopago}</p>
                <p className="text-2xs text-text-muted mt-1">Cobros procesados de forma automatica</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-primary-bg p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-text-secondary mb-2">
                <IconBuildingBank stroke={1.75} className="h-4 w-4 text-text-secondary" />
                <span className="text-xs font-semibold uppercase tracking-wider">Transferencia</span>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-text-primary">{paymentMethodDist.transfer}</p>
                <p className="text-2xs text-text-muted mt-1">Impactos con aprobacion manual del admin</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
            <span>Moneda base de operacion:</span>
            <span className="font-mono font-medium text-text-primary">ARS (Pesos Argentinos)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
