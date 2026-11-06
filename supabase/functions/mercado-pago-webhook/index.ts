import { corsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';
import { MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, verifyMpWebhookSignature } from '../_shared/mp.ts';

declare const Deno: {
  serve(handler: (req: Request) => Promise<Response>): void;
};

interface WebhookBody {
  id?: string | number;
  type?: string;
  action?: string;
  data?: {
    id?: string | number;
    status?: string;
    external_reference?: string;
    transaction_amount?: number;
  };
}

interface PaymentRecord {
  id: string | number;
  status: string;
  external_reference?: string;
  transaction_amount?: number;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // 1. Parsear cuerpo si existe
    let body: WebhookBody | null = null;
    try {
      body = await req.json();
    } catch {
      // Notificaciones GET o cuerpos vacíos
    }

    // 2. Extraer identificadores del recurso y evento
    const dataId = String(
      url.searchParams.get('data.id') ||
      url.searchParams.get('id') ||
      body?.data?.id ||
      body?.id ||
      ''
    );

    const eventType = String(
      url.searchParams.get('type') ||
      url.searchParams.get('topic') ||
      body?.type ||
      body?.action ||
      'payment'
    );

    const xSignature = req.headers.get('x-signature') || '';
    const xRequestId = req.headers.get('x-request-id') || '';

    // 3. Validación de firma HMAC-SHA256 (si MP_WEBHOOK_SECRET está configurado)
    if (MP_WEBHOOK_SECRET) {
      const isValidSig = await verifyMpWebhookSignature({
        xSignature,
        xRequestId,
        dataId,
        secret: MP_WEBHOOK_SECRET,
      });

      if (!isValidSig) {
        console.error('Firma de webhook inválida para dataId:', dataId);
        return new Response(JSON.stringify({ error: 'Firma de webhook inválida' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Guardia de Idempotencia contra tabla mp_events
    if (dataId) {
      const { data: existingEvent, error: eventErr } = await supabaseAdmin
        .from('mp_events')
        .select('id')
        .eq('id', dataId)
        .maybeSingle();

      if (eventErr) {
        console.warn('Error al consultar idempotencia en mp_events:', eventErr);
      }

      if (existingEvent) {
        return new Response(
          JSON.stringify({ status: 'already_processed', id: dataId }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 5. Consultar estado en vivo desde Mercado Pago API
    let payment: PaymentRecord | null = null;
    const isPaymentEvent =
      eventType.includes('payment') ||
      url.searchParams.has('data.id') ||
      Boolean(body?.data?.id);

    if (isPaymentEvent && dataId) {
      if (MP_ACCESS_TOKEN) {
        try {
          const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
            headers: {
              'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
            },
          });
          if (mpRes.ok) {
            payment = await mpRes.json();
          } else {
            console.error(`Error al consultar pago ${dataId} en API de Mercado Pago:`, await mpRes.text());
          }
        } catch (fetchErr) {
          console.error('Error de red al consultar API de Mercado Pago:', fetchErr);
        }
      }

      // Si no hay token de MP o es payload sintético de prueba
      if (!payment && body?.data?.status && body?.data?.external_reference) {
        payment = {
          id: dataId || 'synthetic-payment',
          status: body.data.status,
          external_reference: body.data.external_reference,
          transaction_amount: body.data.transaction_amount,
        };
      }
    }

    // Si no es un evento de pago o no está aprobado, responder 200 sin registrar en mp_events
    if (!payment || payment.status !== 'approved') {
      return new Response(
        JSON.stringify({ received: true, status: payment?.status || 'skipped' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 6. Activar suscripción y registrar pago en Supabase
    // external_reference: "${userId}:${plan}"
    const externalRef = payment.external_reference || '';
    const [userId, rawPlan] = externalRef.split(':');
    if (!userId) {
      console.error('external_reference no contiene userId:', externalRef);
      return new Response(
        JSON.stringify({ error: 'external_reference inválido' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const plan = rawPlan === 'pro_annual' ? 'pro_annual' : 'pro_monthly';
    const durationDays = plan === 'pro_annual' ? 365 : 30;

    // Obtener suscripción actual para calcular extensión acumulativa
    const { data: existingSub, error: subFetchErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id, current_period_end')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subFetchErr) {
      console.warn('Error al buscar suscripción actual:', subFetchErr);
    }

    const now = new Date();
    let baseDate = now;
    if (existingSub?.current_period_end) {
      const currentEnd = new Date(existingSub.current_period_end);
      if (currentEnd > now) {
        baseDate = currentEnd;
      }
    }
    const newPeriodEnd = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    let subId = existingSub?.id;
    if (existingSub) {
      const { error: updateSubErr } = await supabaseAdmin
        .from('subscriptions')
        .update({
          plan,
          status: 'active',
          payment_method: 'mercado_pago',
          mp_payment_id: String(payment.id || dataId),
          current_period_end: newPeriodEnd.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', existingSub.id);

      if (updateSubErr) {
        console.error('Error al actualizar suscripción:', updateSubErr);
        throw updateSubErr;
      }
    } else {
      const { data: newSub, error: insertSubErr } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          status: 'active',
          payment_method: 'mercado_pago',
          mp_payment_id: String(payment.id || dataId),
          current_period_end: newPeriodEnd.toISOString(),
        })
        .select('id')
        .single();

      if (insertSubErr) {
        console.error('Error al insertar suscripción:', insertSubErr);
        throw insertSubErr;
      }
      subId = newSub.id;
    }

    // Registrar pago en tabla payments
    const amountArs = payment.transaction_amount || (plan === 'pro_annual' ? 120000 : 15000);
    const { error: insertPayErr } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        subscription_id: subId,
        plan,
        amount_ars: amountArs,
        payment_method: 'mercado_pago',
        reference: String(payment.id || dataId),
        status: 'approved',
        receipt_path: 'mercado_pago',
        period_end: newPeriodEnd.toISOString(),
        reviewed_at: now.toISOString(),
      });

    if (insertPayErr) {
      console.warn('Error al registrar pago en tabla payments:', insertPayErr);
    }

    // Registrar en mp_events para asegurar idempotencia futura
    if (dataId) {
      const { error: insertEventErr } = await supabaseAdmin
        .from('mp_events')
        .insert({
          id: dataId,
          type: eventType,
          processed_at: now.toISOString(),
        });

      if (insertEventErr) {
        console.warn('Error al registrar evento en mp_events:', insertEventErr);
      }
    }

    return new Response(
      JSON.stringify({
        received: true,
        status: 'approved',
        user_id: userId,
        plan,
        period_end: newPeriodEnd.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno en webhook';
    console.error('Excepción en mercado-pago-webhook:', err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
