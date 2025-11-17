/**
 * Edge Function: Create Mercado Pago Preference
 *
 * Esta función se ejecuta server-side para crear preferencias de pago
 * en Mercado Pago usando el Access Token (que es secreto).
 *
 * El frontend llama a esta función, NO directamente a la API de MP.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MercadoPagoConfig, Preference } from 'npm:mercadopago@2.0.15';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Obtener Access Token desde env
    const accessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!accessToken) {
      console.error('MP_ACCESS_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Payment gateway not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parsear body
    const preferenceData = await req.json();

    console.log('Creating preference with items:', preferenceData.items?.length);

    // Validar datos
    if (!preferenceData.items || !Array.isArray(preferenceData.items) || preferenceData.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Items are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!preferenceData.payer?.email) {
      return new Response(
        JSON.stringify({ error: 'Payer email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Configurar cliente de Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: accessToken,
      options: {
        timeout: 10000 // 10 segundos
      }
    });

    const preference = new Preference(client);

    // Crear la preferencia
    const result = await preference.create({ body: preferenceData });

    console.log('Preference created successfully:', result.id);

    // Retornar resultado
    return new Response(
      JSON.stringify({
        preferenceId: result.id,
        initPoint: result.init_point,
        sandboxInitPoint: result.sandbox_init_point
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error creating preference:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to create preference',
        message: error.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
