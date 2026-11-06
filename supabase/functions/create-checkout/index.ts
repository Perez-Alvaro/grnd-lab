import { corsHeaders } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabaseAdmin.ts';
import { MP_ACCESS_TOKEN, MP_PLANS, PlanKey } from '../_shared/mp.ts';

declare const Deno: {
  serve(handler: (req: Request) => Promise<Response>): void;
  env: {
    get(key: string): string | undefined;
  };
};

Deno.serve(async (req: Request): Promise<Response> => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verificación de autenticación de usuario
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Falta encabezado de autorización' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Sesión no válida o expirada' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Parseo y validación del plan
    let body: { plan?: string } = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Cuerpo de solicitud inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const plan = (body.plan || 'pro_monthly') as PlanKey;
    if (plan !== 'pro_monthly' && plan !== 'pro_annual') {
      return new Response(JSON.stringify({ error: 'Plan no válido. Debe ser pro_monthly o pro_annual' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const planConfig = MP_PLANS[plan];
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://zxxbfwggfrfsfpmfveyj.supabase.co';
    const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173';

    // 3. Crear Checkout Preference en Mercado Pago
    if (!MP_ACCESS_TOKEN) {
      console.warn('MP_ACCESS_TOKEN no configurado en entorno. Generando preferencia de simulación para desarrollo.');
      return new Response(
        JSON.stringify({
          init_point: `${appUrl}/dashboard?payment=success&plan=${plan}&mock=true`,
          sandbox_init_point: `${appUrl}/dashboard?payment=success&plan=${plan}&mock=true`,
          preference_id: `mock-pref-${Date.now()}`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const preferencePayload = {
      items: [
        {
          id: planConfig.id,
          title: planConfig.title,
          description: planConfig.description,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: planConfig.priceARS,
        },
      ],
      payer: {
        email: user.email || 'coach@baserutina.com',
      },
      external_reference: `${user.id}:${plan}`,
      notification_url: `${supabaseUrl}/functions/v1/mercado-pago-webhook`,
      back_urls: {
        success: `${appUrl}/dashboard?payment=success&plan=${plan}`,
        pending: `${appUrl}/dashboard?payment=pending&plan=${plan}`,
        failure: `${appUrl}/dashboard?payment=failure&plan=${plan}`,
      },
      auto_return: 'approved',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferencePayload),
    });

    const prefData = await mpResponse.json();
    if (!mpResponse.ok) {
      console.error('Error de Mercado Pago al crear preferencia:', prefData);
      return new Response(
        JSON.stringify({
          error: prefData.message || 'Error al comunicarse con Mercado Pago',
          details: prefData,
        }),
        {
          status: mpResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        init_point: prefData.init_point,
        sandbox_init_point: prefData.sandbox_init_point,
        preference_id: prefData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado';
    console.error('Excepción en create-checkout:', err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
