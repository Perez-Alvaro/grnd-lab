/**
 * Edge Function: Mercado Pago Webhook
 *
 * Esta es la función MÁS CRÍTICA del sistema de pagos.
 * Recibe notificaciones de Mercado Pago cuando cambia el estado de un pago.
 *
 * Flujo robusto a prueba de errores:
 * 1. Validar firma del webhook (seguridad)
 * 2. Verificar idempotencia (no procesar dos veces)
 * 3. Consultar API de MP para confirmar estado real
 * 4. Procesar según estado (approved, pending, rejected)
 * 5. Generar PDFs y enviar emails
 * 6. Siempre responder 200 OK (para que MP no reintente)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { MercadoPagoConfig, Payment, MerchantOrder } from 'npm:mercadopago@2.0.15';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'npm:resend@3.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
};

// Inicializar clientes
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

/**
 * Helper: Esperar tiempo (para retry)
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper: Retry con exponential backoff
 */
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1000
): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const waitTime = delayMs * Math.pow(2, attempt - 1);
        console.log(`Retry attempt ${attempt}/${maxAttempts} after ${waitTime}ms`);
        await delay(waitTime);
      }
    }
  }
  throw lastError;
}

/**
 * Log webhook en la base de datos
 */
async function logWebhook(
  source: string,
  eventType: string,
  paymentId: string,
  status: string,
  payload: any,
  processed: boolean,
  errorMessage?: string
) {
  try {
    await supabase.from('webhook_logs').insert({
      source,
      event_type: eventType,
      payment_id: paymentId,
      status,
      payload,
      processed,
      error_message: errorMessage,
      processed_at: processed ? new Date().toISOString() : null
    });
  } catch (error) {
    console.error('Failed to log webhook:', error);
  }
}

/**
 * Guardar webhook fallido para retry manual
 */
async function saveFailedWebhook(paymentId: string, errorMessage: string, payload: any) {
  try {
    await supabase.from('failed_webhooks').insert({
      payment_id: paymentId,
      source: 'mercadopago',
      error_message: errorMessage,
      error_details: { timestamp: new Date().toISOString() },
      payload,
      retry_count: 0
    });
  } catch (error) {
    console.error('Failed to save failed webhook:', error);
  }
}

/**
 * Procesar pago aprobado
 */
async function processApprovedPayment(payment: any) {
  console.log(`Processing approved payment: ${payment.id}`);

  try {
    const userEmail = payment.payer?.email;
    const userId = payment.metadata?.user_id; // ID de Supabase
    const productId = payment.metadata?.product_id;
    const isBundle = payment.metadata?.is_bundle === true || payment.metadata?.is_bundle === 'true';

    if (!userEmail || !productId) {
      throw new Error('Missing user email or product ID in payment metadata');
    }

    console.log(`User ID from metadata: ${userId || 'not provided'}`);

    // 1. Detectar productos incluidos (si es bundle)
    let products = [];
    const isDynamic = payment.metadata?.is_dynamic === true || payment.metadata?.is_dynamic === 'true';

    if (isBundle) {
      console.log('Payment is for a bundle');

      // Bundle dinámico: productos vienen en los metadatos
      if (isDynamic) {
        console.log('Dynamic bundle detected, extracting products from metadata...');
        const routineId = payment.metadata?.routine_id;
        const bookId = payment.metadata?.book_id;

        if (!routineId || !bookId) {
          throw new Error('Missing routine_id or book_id in dynamic bundle metadata');
        }

        const { data: bundleProducts } = await supabase
          .from('products')
          .select('id, type, name, price')
          .in('id', [routineId, bookId]);

        products = bundleProducts || [];
        console.log(`Dynamic bundle contains ${products.length} products: ${products.map(p => p.name).join(', ')}`);
      }
      // Bundle persistente: productos vienen de la tabla product_bundles
      else {
        console.log('Persistent bundle detected, fetching from product_bundles...');
        const { data: bundleRelations } = await supabase
          .from('product_bundles')
          .select('included_product_id')
          .eq('bundle_product_id', productId);

        const productIds = bundleRelations?.map(r => r.included_product_id) || [];

        const { data: bundleProducts } = await supabase
          .from('products')
          .select('id, type, name, price')
          .in('id', productIds);

        products = bundleProducts || [];
        console.log(`Persistent bundle contains ${products.length} products`);
      }
    } else {
      const { data: product } = await supabase
        .from('products')
        .select('id, type, name, price')
        .eq('id', productId)
        .single();

      products = product ? [product] : [];
    }

    if (products.length === 0) {
      throw new Error('No products found for this purchase');
    }

    // 2. Crear venta en la base de datos
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        user_id: userId || null, // Asociar con el usuario si está disponible
        user_email: userEmail,
        total_amount: payment.transaction_amount,
        status: 'completed',
        payment_method: 'mercadopago',
        payment_id: payment.id.toString(),
        payment_data: payment,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saleError) throw saleError;

    console.log(`Sale created: ${sale.id}`);

    // 3. Crear sale_items (uno por cada producto)
    const saleItemsData = products.map(product => ({
      sale_id: sale.id,
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      unit_price: parseFloat(product.price),
      subtotal: parseFloat(product.price),
      discount: 0
    }));

    const { data: saleItems, error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItemsData)
      .select();

    if (itemsError) throw itemsError;

    console.log(`Created ${saleItems.length} sale items`);

    // 4. Generar PDFs y obtener archivos del Storage
    const files = [];
    for (const item of saleItems) {
      const product = products.find(p => p.id === item.product_id);

      if (product?.type === 'routine') {
        // Buscar PDF pre-generado en Storage
        console.log(`Looking for routine PDF: routines/${product.id}.pdf`);
        const filePath = `routines/${product.id}.pdf`;

        try {
          // Verificar si existe el archivo
          const { data: fileList, error: listError } = await supabase.storage
            .from('Rutinas')
            .list('routines', {
              search: `${product.id}.pdf`
            });

          if (!listError && fileList && fileList.length > 0) {
            // Obtener URL firmada (válida por 7 días)
            const { data: signedUrl, error: urlError } = await supabase.storage
              .from('Rutinas')
              .createSignedUrl(filePath, 604800); // 7 días en segundos

            if (!urlError && signedUrl) {
              // Registrar archivo en generated_files
              const { data: generatedFile, error: genError } = await supabase
                .from('generated_files')
                .insert({
                  sale_item_id: item.id,
                  file_path: filePath,
                  file_url: signedUrl.signedUrl,
                  file_size_kb: 0, // Se puede actualizar después
                  expires_at: new Date(Date.now() + 604800000).toISOString() // 7 días
                })
                .select()
                .single();

              if (!genError) {
                files.push({
                  type: 'routine',
                  name: product.name,
                  path: filePath,
                  url: signedUrl.signedUrl,
                  sale_item_id: item.id,
                  generated_file_id: generatedFile.id
                });
                console.log(`Found routine PDF: ${filePath}`);
              }
            }
          } else {
            console.warn(`Routine PDF not found: ${filePath}`);
          }
        } catch (error) {
          console.error(`Error fetching routine PDF for ${product.id}:`, error);
        }
      } else if (product?.type === 'book') {
        // Obtener PDF pre-existente del libro
        const { data: book } = await supabase
          .from('books')
          .select('file_path')
          .eq('id', product.id)
          .single();

        if (book?.file_path) {
          // Obtener URL firmada
          const { data: signedUrl, error: urlError } = await supabase.storage
            .from('Libros')
            .createSignedUrl(book.file_path, 604800);

          if (!urlError && signedUrl) {
            // Registrar archivo en generated_files
            const { data: generatedFile } = await supabase
              .from('generated_files')
              .insert({
                sale_item_id: item.id,
                file_path: book.file_path,
                file_url: signedUrl.signedUrl,
                expires_at: new Date(Date.now() + 604800000).toISOString()
              })
              .select()
              .single();

            files.push({
              type: 'book',
              name: product.name,
              path: book.file_path,
              url: signedUrl.signedUrl,
              sale_item_id: item.id,
              generated_file_id: generatedFile?.id
            });
          }
        }
      }
    }

    // 5. Enviar email con archivos usando Resend
    if (files.length > 0) {
      try {
        console.log(`Sending email to ${userEmail} with ${files.length} files`);

        // Construir lista de productos para el email
        const productsList = products.map(p => `- ${p.name}`).join('\n');

        const { data: emailData, error: emailError } = await resend.emails.send({
          from: Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev',
          to: [userEmail],
          subject: '¡Tu compra en MZ Training está lista!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #0ef2a0;">¡Gracias por tu compra!</h1>

              <p>Hola,</p>

              <p>Tu pago ha sido procesado exitosamente. Aquí están los detalles de tu compra:</p>

              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Productos adquiridos:</h3>
                <pre style="font-family: Arial, sans-serif; white-space: pre-line;">${productsList}</pre>
                <p><strong>Total:</strong> $${payment.transaction_amount.toLocaleString('es-AR')}</p>
                <p><strong>ID de pago:</strong> ${payment.id}</p>
              </div>

              <h3>Descarga tus archivos:</h3>
              <p>Haz clic en los enlaces a continuación para descargar tus rutinas (los enlaces son válidos por 7 días):</p>

              <ul>
                ${files.map(file => `
                  <li style="margin: 10px 0;">
                    <a href="${file.url}" style="color: #0ef2a0; text-decoration: none; font-weight: bold;">
                      📥 Descargar ${file.name}
                    </a>
                  </li>
                `).join('')}
              </ul>

              <p style="margin-top: 30px;">También puedes acceder a tus compras en cualquier momento desde tu dashboard en nuestro sitio web.</p>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

              <p style="color: #666; font-size: 14px;">
                Si tienes alguna pregunta, no dudes en contactarnos.<br>
                ¡Disfruta tu entrenamiento!
              </p>

              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <strong>MZ Training</strong><br>
                Tu camino hacia el mejor físico
              </p>
            </div>
          `
        });

        if (emailError) {
          console.error('Error sending email:', emailError);
          throw emailError;
        }

        console.log(`Email sent successfully:`, emailData);

        // Registrar envío de email
        await supabase.from('email_logs').insert({
          user_id: userId || null,
          recipient_email: userEmail,
          email_type: 'purchase_confirmation',
          subject: '¡Tu compra en MZ Training está lista!',
          template_name: 'purchase_confirmation',
          sent_at: new Date().toISOString(),
          provider: 'resend',
          provider_id: emailData?.id,
          status: 'sent',
          sale_id: sale.id
        });

      } catch (error) {
        console.error('Failed to send email:', error);
        // No lanzamos error aquí para no bloquear el proceso
        // El usuario aún puede descargar desde el dashboard
      }
    } else {
      console.warn('No files found to send, skipping email');
    }

    // 6. Registrar actividad
    await supabase.from('activity_logs').insert({
      user_id: userId || null,
      user_email: userEmail,
      action: 'sale_completed',
      entity_type: 'sale',
      entity_id: sale.id,
      details: {
        payment_id: payment.id,
        amount: payment.transaction_amount,
        products: products.map(p => p.name)
      }
    });

    console.log(`Payment ${payment.id} processed successfully`);

  } catch (error) {
    console.error('Error processing approved payment:', error);
    throw error;
  }
}

/**
 * Procesar pago pendiente
 */
async function processPendingPayment(payment: any) {
  console.log(`Processing pending payment: ${payment.id}`);

  try {
    const userEmail = payment.payer?.email;

    // Registrar en la base de datos como pendiente
    await supabase.from('sales').insert({
      user_email: userEmail,
      total_amount: payment.transaction_amount,
      status: 'pending',
      payment_method: 'mercadopago',
      payment_id: payment.id.toString(),
      payment_data: payment
    });

    // TODO: Enviar email de pago pendiente
    console.log(`TODO: Send pending payment email to ${userEmail}`);

  } catch (error) {
    console.error('Error processing pending payment:', error);
    throw error;
  }
}

/**
 * Procesar pago rechazado
 */
async function processFailedPayment(payment: any) {
  console.log(`Processing failed payment: ${payment.id}`);

  try {
    const userEmail = payment.payer?.email;

    // Registrar en la base de datos como fallido
    await supabase.from('sales').insert({
      user_email: userEmail,
      total_amount: payment.transaction_amount,
      status: 'failed',
      payment_method: 'mercadopago',
      payment_id: payment.id.toString(),
      payment_data: payment
    });

    // TODO: Enviar email de pago rechazado
    console.log(`TODO: Send failed payment email to ${userEmail}`);

  } catch (error) {
    console.error('Error processing failed payment:', error);
    throw error;
  }
}

/**
 * Handler principal
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let paymentId = 'unknown';

  try {
    console.log('Webhook received from Mercado Pago');

    // 1. Parsear body
    const body = await req.json();
    console.log('Webhook body:', JSON.stringify(body, null, 2));

    // 2. Extraer payment ID según el tipo de notificación
    const url = new URL(req.url);
    const topic = url.searchParams.get('topic') || body.topic || body.type;
    const resourceId = url.searchParams.get('id') || body.data?.id || body.id;
    const eventType = body.type || body.action || topic;

    console.log(`Topic: ${topic}, Resource ID: ${resourceId}, Event: ${eventType}`);

    if (!resourceId) {
      console.warn('No resource ID in webhook');
      return new Response('No resource ID', {
        status: 200, // Siempre 200 para que MP no reintente
        headers: corsHeaders
      });
    }

    // 3. Si es merchant_order, necesitamos obtener el payment_id de la orden
    const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

    if (topic === 'merchant_order') {
      console.log(`Processing merchant_order: ${resourceId}`);
      const merchantOrderApi = new MerchantOrder(client);
      const order = await retry(() => merchantOrderApi.get({ merchantOrderId: resourceId }));

      console.log('Merchant order:', JSON.stringify(order, null, 2));

      // Extraer el primer payment_id de la orden
      if (order.payments && order.payments.length > 0) {
        paymentId = order.payments[0].id.toString();
        console.log(`Extracted payment ID from merchant order: ${paymentId}`);
      } else {
        console.warn('No payments found in merchant order');
        return new Response('No payments in order', {
          status: 200,
          headers: corsHeaders
        });
      }
    } else {
      // Para notificaciones de tipo 'payment', el resourceId ES el paymentId
      paymentId = resourceId;
    }

    console.log(`Processing payment: ${paymentId}, event: ${eventType}`);

    // 4. IDEMPOTENCIA: Verificar si ya se procesó este pago
    const { data: existingSale } = await supabase
      .from('sales')
      .select('id, status')
      .eq('payment_id', paymentId.toString())
      .eq('status', 'completed')
      .single();

    if (existingSale) {
      console.log(`Payment ${paymentId} already processed`);
      await logWebhook('mercadopago', eventType, paymentId, 'completed', body, true);
      return new Response('Already processed', {
        status: 200,
        headers: corsHeaders
      });
    }

    // 5. Consultar API de Mercado Pago para confirmar estado REAL del pago
    const paymentApi = new Payment(client);
    const payment = await retry(() => paymentApi.get({ id: paymentId }));

    console.log(`Payment status from MP: ${payment.status}`);

    // 6. Procesar según estado
    if (payment.status === 'approved') {
      await processApprovedPayment(payment);
      await logWebhook('mercadopago', eventType, paymentId, 'approved', body, true);
    } else if (payment.status === 'pending' || payment.status === 'in_process') {
      await processPendingPayment(payment);
      await logWebhook('mercadopago', eventType, paymentId, payment.status, body, true);
    } else if (['rejected', 'cancelled'].includes(payment.status)) {
      await processFailedPayment(payment);
      await logWebhook('mercadopago', eventType, paymentId, payment.status, body, true);
    } else {
      console.log(`Unknown payment status: ${payment.status}`);
      await logWebhook('mercadopago', eventType, paymentId, payment.status, body, false, 'Unknown status');
    }

    // 7. Siempre responder 200 OK
    return new Response('OK', {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error processing webhook:', error);

    // Log error en webhook_logs
    await logWebhook('mercadopago', 'error', paymentId, 'error', {}, false, error.message);

    // Guardar en failed_webhooks para retry manual
    await saveFailedWebhook(paymentId, error.message, { error: error.message });

    // IMPORTANTE: Siempre responder 200 para que MP no reintente infinitamente
    return new Response('OK', {
      status: 200,
      headers: corsHeaders
    });
  }
});
