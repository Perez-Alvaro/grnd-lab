# Flujo de Pago Mercado Pago - Documentación Técnica

Esta documentación describe el flujo completo de pagos con Mercado Pago, incluyendo bundles, webhooks y emails.

## Arquitectura General

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌─────────┐
│   Cliente   │─────▶│ PaymentSection│─────▶│ Edge Function   │─────▶│   MP    │
│  (Browser)  │      │   Component   │      │ create-preference│      │   API   │
└─────────────┘      └──────────────┘      └─────────────────┘      └─────────┘
       │                                                                   │
       │                                                                   │
       │                    ┌────────────────────────────────────────────┘
       │                    │
       │                    ▼
       │             ┌─────────────┐
       │             │   MP Panel  │ (Usuario paga)
       │             └─────────────┘
       │                    │
       │                    ▼
       │             ┌─────────────────┐
       └────────────▶│  /payment/*     │ (Redirect)
                     └─────────────────┘
                              │
                              ▼
       ┌──────────────────────────────────────┐
       │    MP Webhook (Async)                │
       │    Edge Function                      │
       │    1. Valida pago                     │
       │    2. Crea venta en DB                │
       │    3. Genera/obtiene PDFs             │
       │    4. Envía email con Resend          │
       └──────────────────────────────────────┘
```

## Flujo Detallado

### 1. Preparación del Checkout

**Ubicación**: `src/components/Client/PaymentSection.jsx`

```javascript
// 1.1 Detectar si es bundle
useEffect(() => {
  const isBundleProduct = await bundleService.isBundleProduct(routine.id);
  setIsBundle(isBundleProduct);

  if (isBundleProduct) {
    const info = await bundleService.getBundleInfo(routine.id);
    setBundleInfo(info);
  }
}, [routine]);

// 1.2 Mostrar formulario con validación
<form onSubmit={handleSubmit}>
  <input name="firstName" required />
  <input name="lastName" required />
  <input name="email" type="email" required />
</form>
```

### 2. Creación de Preferencia

**Ubicación**: `src/services/mercadoPagoService.js` → `supabase/functions/create-mp-preference/index.ts`

```javascript
// 2.1 Cliente solicita creación de preferencia
const { preferenceId, initPoint } = await mercadoPagoService.createPreference(
  routine,
  { email, firstName, lastName }
);

// 2.2 Edge Function crea preferencia en MP
const preference = {
  items: [{
    id: product.id,
    title: product.name,
    quantity: 1,
    unit_price: parseFloat(product.price),
    currency_id: 'ARS'
  }],
  payer: {
    email: userData.email,
    name: userData.firstName,
    surname: userData.lastName
  },
  back_urls: {
    success: `${frontendUrl}/payment/success`,
    failure: `${frontendUrl}/payment/failure`,
    pending: `${frontendUrl}/payment/pending`
  },
  notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
  auto_return: 'approved',
  metadata: {
    product_id: product.id,
    product_type: product.type,
    is_bundle: isBundle
  }
};

// 2.3 Retornar preferenceId e initPoint
return { preferenceId, initPoint };
```

### 3. Redirección a Mercado Pago

```javascript
// 3.1 Redirigir al Checkout Pro de MP
window.location.href = initPoint;
// Usuario sale del sitio y va a MP
```

### 4. Procesamiento del Pago (Usuario en MP)

El usuario completa el pago en Mercado Pago:
- Ingresa datos de tarjeta
- MP procesa el pago
- MP genera `payment_id`

### 5. Notificación via Webhook (Async)

**Ubicación**: `supabase/functions/mercadopago-webhook/index.ts`

```typescript
// 5.1 MP envía notificación POST
POST https://YOUR-PROJECT.supabase.co/functions/v1/mercadopago-webhook
{
  "type": "payment",
  "data": {
    "id": "1234567890" // payment_id
  }
}

// 5.2 Verificar idempotencia
const { data: existingSale } = await supabase
  .from('sales')
  .select('id')
  .eq('payment_id', paymentId)
  .single();

if (existingSale) {
  console.log('Payment already processed');
  return new Response('OK', { status: 200 }); // Importante!
}

// 5.3 Consultar estado real del pago en MP API
const payment = await paymentApi.get({ id: paymentId });

// 5.4 Procesar según estado
if (payment.status === 'approved') {
  // 5.4.1 Obtener productos del bundle (si aplica)
  const products = await getProductsFromMetadata(payment.metadata);

  // 5.4.2 Crear venta en DB
  const { data: sale } = await supabase
    .from('sales')
    .insert({
      payment_id: paymentId,
      customer_email: payment.payer.email,
      customer_name: `${firstName} ${lastName}`,
      total_amount: payment.transaction_amount,
      status: 'approved',
      payment_method: payment.payment_method_id
    })
    .select()
    .single();

  // 5.4.3 Crear items de venta
  for (const product of products) {
    await supabase
      .from('sale_items')
      .insert({
        sale_id: sale.id,
        product_id: product.id,
        product_type: product.type,
        quantity: 1,
        price: product.price
      });
  }

  // 5.4.4 Generar/obtener PDFs
  const pdfs = [];
  for (const product of products) {
    if (product.type === 'routine') {
      // Generar PDF de rutina
      const pdfBuffer = await generateRoutinePDF(product);
      pdfs.push({
        filename: `rutina-${product.name}.pdf`,
        content: pdfBuffer
      });
    } else if (product.type === 'libro') {
      // Obtener PDF de libro desde Storage
      const { data } = await supabase.storage
        .from('pdfs')
        .download(product.pdf_file_path);
      pdfs.push({
        filename: `libro-${product.name}.pdf`,
        content: data
      });
    }
  }

  // 5.4.5 Enviar email con PDFs adjuntos
  const resend = new Resend(RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_EMAIL,
    to: payment.payer.email,
    subject: 'Confirmación de Compra - Fitter',
    html: getPurchaseConfirmationTemplate(userData, products, sale.id),
    attachments: pdfs.map(pdf => ({
      filename: pdf.filename,
      content: pdf.content
    }))
  });

  // 5.4.6 Log exitoso
  await supabase.from('webhook_logs').insert({
    event_type: 'payment.approved',
    payment_id: paymentId,
    status: 'success',
    response: payment
  });
}

// 5.5 SIEMPRE retornar 200 OK
return new Response('OK', { status: 200 });
```

### 6. Redirección del Usuario

Después de pagar, MP redirige al usuario:

```
Aprobado:  /payment/success?payment_id=123&status=approved
Rechazado: /payment/failure?payment_id=123&status=rejected
Pendiente: /payment/pending?payment_id=123&status=pending
```

### 7. Páginas de Resultado

#### PaymentSuccess.jsx

```javascript
// 7.1 Obtener payment_id de URL
const paymentId = searchParams.get('payment_id');

// 7.2 Consultar estado en DB (el webhook ya lo procesó)
const { data: sale } = await supabase
  .from('sales')
  .select('*, sale_items(*)')
  .eq('payment_id', paymentId)
  .single();

// 7.3 Si aún no procesó, consultar MP directamente
if (!sale) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/get-mp-payment/${paymentId}`
  );
  const mpPayment = await response.json();
}

// 7.4 Mostrar confetti + información
// 7.5 Countdown y redirect a dashboard
```

#### PaymentFailure.jsx

```javascript
// Mostrar error, motivo del rechazo, sugerencias
// Botón "Intentar Nuevamente" → volver a checkout
```

#### PaymentPending.jsx

```javascript
// Mostrar estado pendiente, instrucciones según método de pago
// Botón "Verificar Estado" → recargar página
```

## Estados de Pago

| Estado MP | Estado DB | Acción |
|-----------|-----------|--------|
| `approved` | `approved` | Crear venta, enviar email con PDFs |
| `pending` | `pending` | Crear venta pendiente, enviar email informativo |
| `in_process` | `pending` | Crear venta pendiente, enviar email informativo |
| `rejected` | `rejected` | Crear registro de fallo, enviar email de rechazo |
| `cancelled` | `cancelled` | Crear registro de cancelación |
| `refunded` | `refunded` | Actualizar venta existente |
| `charged_back` | `charged_back` | Actualizar venta existente |

## Manejo de Bundles

### Configuración en DB

```sql
-- Producto Bundle
INSERT INTO products (id, type, name, price, active)
VALUES ('bundle-001', 'bundle', 'Rutina + Libro Nutrición', 15000, true);

-- Relaciones del Bundle
INSERT INTO product_bundles (bundle_id, product_id)
VALUES
  ('bundle-001', 'routine-001'),
  ('bundle-001', 'libro-001');
```

### Detección de Bundle

```javascript
// bundleService.js
export const isBundleProduct = async (productId) => {
  const { data: product } = await supabase
    .from('products')
    .select('type')
    .eq('id', productId)
    .single();
  return product?.type === 'bundle';
};

export const getBundleProducts = async (bundleId) => {
  const { data: items } = await supabase
    .from('product_bundles')
    .select('product:products(*)')
    .eq('bundle_id', bundleId);
  return items.map(item => item.product);
};
```

### Procesamiento de Bundle en Webhook

```javascript
// Si es bundle, obtener todos los productos
let products = [];
if (metadata.is_bundle) {
  products = await getBundleProducts(metadata.product_id);
} else {
  products = [await getProductById(metadata.product_id)];
}

// Crear sale_items para cada producto
for (const product of products) {
  await supabase.from('sale_items').insert({
    sale_id: sale.id,
    product_id: product.id,
    product_type: product.type,
    quantity: 1,
    price: product.price
  });

  // Generar/obtener PDF correspondiente
  if (product.type === 'routine') {
    // generar PDF
  } else if (product.type === 'libro') {
    // obtener PDF desde storage
  }
}
```

## Generación de PDFs

### Rutina

```javascript
// Generar dinámicamente desde ejercicios en DB
const { data: routine } = await supabase
  .from('products')
  .select('*, routines(*, routine_exercises(*, exercises(*)))')
  .eq('id', productId)
  .single();

const pdfBuffer = await generateRoutinePDF(routine);
```

### Libro

```javascript
// Obtener PDF estático desde Supabase Storage
const { data: libro } = await supabase
  .from('products')
  .select('pdf_file_path')
  .eq('id', productId)
  .single();

const { data: pdfData } = await supabase.storage
  .from('pdfs')
  .download(libro.pdf_file_path);
```

## Seguridad y Mejores Prácticas

### 1. Idempotencia

Siempre verificar si el pago ya fue procesado:

```typescript
const { data: existingSale } = await supabase
  .from('sales')
  .select('id')
  .eq('payment_id', paymentId)
  .single();

if (existingSale) {
  return new Response('OK', { status: 200 });
}
```

### 2. Validación del Pago

NUNCA confiar solo en los datos del webhook. Siempre validar con MP API:

```typescript
// ❌ MAL: Confiar en webhook payload
const status = req.body.status;

// ✅ BIEN: Validar con MP API
const payment = await paymentApi.get({ id: paymentId });
const status = payment.status;
```

### 3. Respuesta del Webhook

SIEMPRE retornar 200 OK para evitar reintentos:

```typescript
try {
  // procesar pago
  return new Response('OK', { status: 200 });
} catch (error) {
  // Log error pero igual retornar 200
  console.error(error);
  await logFailedWebhook(error);
  return new Response('OK', { status: 200 }); // Importante!
}
```

### 4. Manejo de Errores

Registrar fallos para retry manual:

```typescript
catch (error) {
  await supabase.from('failed_webhooks').insert({
    payment_id: paymentId,
    error_message: error.message,
    payload: webhookPayload,
    retry_count: 0
  });
}
```

### 5. Rate Limiting

Implementar exponential backoff para reintentos:

```typescript
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};
```

## Variables de Entorno

### Frontend (.env)

```env
# Mercado Pago
VITE_MP_PUBLIC_KEY=TEST-xxx-xxx

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Frontend URL
VITE_FRONTEND_URL=http://localhost:5173
```

### Backend (Supabase Edge Functions)

```env
# Mercado Pago
MP_ACCESS_TOKEN=TEST-xxx-xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@fitter.com
```

## Logs y Monitoreo

### Webhook Logs

```sql
SELECT
  event_type,
  payment_id,
  status,
  created_at,
  response
FROM webhook_logs
ORDER BY created_at DESC
LIMIT 100;
```

### Failed Webhooks

```sql
SELECT
  payment_id,
  error_message,
  retry_count,
  created_at
FROM failed_webhooks
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Payments Dashboard View

```sql
SELECT * FROM payments_dashboard
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Webhook Stats View

```sql
SELECT * FROM webhook_stats;
```

## Troubleshooting

### Webhook no se ejecuta

1. Verificar URL en MP Dashboard
2. Verificar que Edge Function está desplegada: `supabase functions list`
3. Revisar logs: `supabase functions logs mercadopago-webhook`
4. Verificar que `MP_ACCESS_TOKEN` está en secretos de Supabase

### Email no llega

1. Verificar Resend Dashboard
2. Confirmar que `FROM_EMAIL` está verificado
3. Revisar logs de webhook
4. Verificar carpeta spam

### PDFs no se adjuntan

1. Verificar permisos en Supabase Storage
2. Confirmar que `pdf_file_path` es válido
3. Revisar logs de generación de PDF
4. Verificar tamaño de archivos (Resend límite: 40MB)

### Venta duplicada

1. Verificar constraint único: `sales.payment_id`
2. Revisar lógica de idempotencia
3. Confirmar que webhook retorna 200 siempre
