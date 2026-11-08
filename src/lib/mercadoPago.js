/**
 * src/lib/mercadoPago.js
 * Integración frontend de Mercado Pago temporalmente deshabilitada
 * hasta conectar las credenciales de la API de producción.
 * Mientras tanto, el sistema opera exclusivamente por Transferencia Bancaria.
 */

export const MERCADO_PAGO_ENABLED = false;

/**
 * Deshabilitado temporalmente: lanza aviso indicando usar transferencia bancaria.
 * @param {'pro_monthly' | 'pro_annual'} _plan
 */
export async function startMercadoPagoCheckout() {
  throw new Error(
    'El pago automático por Mercado Pago está temporalmente deshabilitado. Por favor usá la opción "Informar transferencia" para activar tu plan.'
  );
}
