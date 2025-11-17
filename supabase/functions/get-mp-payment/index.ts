/**
 * Edge Function: Get Mercado Pago Payment
 *
 * Consulta el estado de un pago en Mercado Pago.
 * Usado por el frontend para verificar el estado después del redirect.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MercadoPagoConfig, Payment } from 'npm:mercadopago@2.0.15';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extraer payment ID de la URL
    const url = new URL(req.url);
    const paymentId = url.pathname.split('/').pop();

    if (!paymentId || paymentId === 'get-mp-payment') {
      return new Response(
        JSON.stringify({ error: 'Payment ID required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Fetching payment info for: ${paymentId}`);

    // Obtener Access Token
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN not configured');
    }

    // Consultar API de Mercado Pago
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);

    const payment = await paymentApi.get({ id: paymentId });

    // Retornar información del pago (solo datos públicos)
    return new Response(
      JSON.stringify({
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        payment_type_id: payment.payment_type_id,
        payment_method_id: payment.payment_method_id,
        transaction_amount: payment.transaction_amount,
        date_created: payment.date_created,
        date_approved: payment.date_approved,
        payer: {
          email: payment.payer?.email
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error fetching payment:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch payment',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
