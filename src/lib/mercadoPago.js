/**
 * src/lib/mercadoPago.js
 * Integración frontend de Mercado Pago para cobros automatizados en ARS.
 * Invoca la Edge Function create-checkout y redirige al init_point devuelto.
 */
import { supabase } from './supabaseClient.js';

/**
 * Inicia el flujo de checkout con Mercado Pago para el plan especificado.
 * @param {'pro_monthly' | 'pro_annual'} plan
 * @returns {Promise<void>} Redirige la ventana a la pasarela de pago de Mercado Pago
 */
export async function startMercadoPagoCheckout(plan = 'pro_monthly') {
  const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
  if (sessionErr || !sessionData?.session) {
    throw new Error('Debés iniciar sesión para suscribirte con Mercado Pago');
  }

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { plan },
  });

  if (error) {
    console.error('Error al invocar create-checkout:', error);
    throw new Error(error.message || 'No se pudo conectar con el servicio de pagos');
  }

  const redirectUrl = data?.init_point || data?.sandbox_init_point;
  if (!redirectUrl) {
    throw new Error('No se recibió la dirección de pago de Mercado Pago');
  }

  window.location.href = redirectUrl;
}
