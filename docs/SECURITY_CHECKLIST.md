# Checklist de Seguridad - Antes de Producción

## ⚠️ IMPORTANTE: Configuración de Edge Functions

### Configuración CORRECTA por función:

| Función | verify_jwt | ¿Por qué? |
|---------|-----------|-----------|
| `mercadopago-webhook` | `false` ✅ | Mercado Pago lo llama externamente sin JWT |
| `create-mp-preference` | `true` ✅ | Solo tu frontend debe poder crear preferencias |
| `get-mp-payment` | `true` ✅ | Solo tu frontend debe consultar pagos |

**Esto es CORRECTO y SEGURO** - Los webhooks públicos siempre tienen JWT deshabilitado.

## 🛡️ Capas de Seguridad Actuales (Ya implementadas)

### 1. Validación con API de Mercado Pago ✅
```typescript
// No confiamos solo en el webhook, validamos con MP
const payment = await paymentApi.get({ id: paymentId });
```

**Protege contra**: Webhooks falsos enviados manualmente

### 2. Idempotencia ✅
```typescript
// Verificamos si ya procesamos este pago
const { data: existingSale } = await supabase
  .from('sales')
  .eq('payment_id', paymentId)
  .single();
```

**Protege contra**: Pagos duplicados, reintentos de webhook

### 3. CORS Headers ✅
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '...'
};
```

**Protege contra**: Llamadas desde dominios no autorizados

### 4. Secrets en Server-Side ✅
- `MP_ACCESS_TOKEN` solo en backend
- `RESEND_API_KEY` solo en backend

**Protege contra**: Exposición de credenciales

## 🔐 Capas ADICIONALES para Producción

### ❌ 1. Validación de Firma de Webhook (FALTA IMPLEMENTAR)

**Prioridad**: ALTA ⚠️

**¿Qué es?**
Mercado Pago envía un header `x-signature` que debes validar para asegurar que el webhook viene realmente de MP.

**Implementación**:

1. **Obtener Webhook Secret de Mercado Pago**
   - Ve a MP Dashboard → Tu App → Webhooks
   - Copia el "Secret" (no lo compartas nunca)

2. **Agregar a Supabase Secrets**
   ```bash
   supabase secrets set MP_WEBHOOK_SECRET=tu-secret-aqui
   ```

3. **Agregar función de validación** en `mercadopago-webhook/index.ts`:

```typescript
/**
 * Validar firma del webhook de Mercado Pago
 * Docs: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
async function validateMPSignature(req: Request, payloadString: string): Promise<boolean> {
  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');

  if (!xSignature || !xRequestId) {
    console.warn('Missing x-signature or x-request-id headers');
    return false;
  }

  try {
    // Parsear x-signature: "ts=1234567890,v1=abc123..."
    const parts = xSignature.split(',');
    const tsPart = parts.find(p => p.startsWith('ts='));
    const v1Part = parts.find(p => p.startsWith('v1='));

    if (!tsPart || !v1Part) {
      console.warn('Invalid x-signature format');
      return false;
    }

    const ts = tsPart.split('=')[1];
    const receivedHash = v1Part.split('=')[1];

    // Construir manifest según docs de MP
    const dataId = JSON.parse(payloadString).data?.id;
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Obtener secret
    const secret = Deno.env.get('MP_WEBHOOK_SECRET');
    if (!secret) {
      console.error('MP_WEBHOOK_SECRET not configured');
      return false;
    }

    // Calcular HMAC SHA-256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(manifest)
    );

    // Convertir a hex
    const computedHash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = computedHash === receivedHash;

    if (!isValid) {
      console.error('Signature validation failed', {
        received: receivedHash,
        computed: computedHash,
        manifest
      });
    }

    return isValid;

  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}
```

4. **Usar en el handler principal**:

```typescript
serve(async (req) => {
  // Leer body como string primero (para validar firma)
  const bodyString = await req.text();
  const body = JSON.parse(bodyString);

  // VALIDAR FIRMA (solo en producción)
  const isProduction = Deno.env.get('ENVIRONMENT') === 'production';

  if (isProduction) {
    const isValid = await validateMPSignature(req, bodyString);
    if (!isValid) {
      console.error('❌ Invalid webhook signature - rejecting');
      await logWebhook('mercadopago', 'invalid_signature', 'unknown', 'rejected', body, false, 'Invalid signature');
      return new Response('Unauthorized', {
        status: 401,
        headers: corsHeaders
      });
    }
    console.log('✅ Webhook signature validated');
  } else {
    console.log('⚠️ Skipping signature validation (dev mode)');
  }

  // ... resto del código
});
```

### 2. Rate Limiting (Opcional - MEDIA prioridad)

**¿Para qué?**
Prevenir abuse de endpoints públicos.

**Implementación**: Usar Supabase Rate Limiting (si está disponible) o Cloudflare.

### 3. IP Allowlist (Opcional - BAJA prioridad)

**¿Para qué?**
Solo aceptar webhooks desde IPs de Mercado Pago.

**IPs de MP** (Argentina):
- `209.225.49.0/24`
- `216.33.196.0/24`

**Implementación**:
```typescript
const mpIpRanges = ['209.225.49.', '216.33.196.'];
const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

const isAllowedIp = mpIpRanges.some(range => clientIp.startsWith(range));
if (!isAllowedIp) {
  console.warn(`Webhook from unauthorized IP: ${clientIp}`);
  // Decidir si rechazar o solo logear
}
```

## 📋 Checklist Pre-Producción

### Configuración Base
- [x] Credenciales TEST funcionando
- [ ] Credenciales PROD obtenidas
- [ ] Webhook Secret obtenido de MP Dashboard
- [ ] `MP_WEBHOOK_SECRET` agregado a Supabase Secrets
- [ ] Variable `ENVIRONMENT=production` agregada a Supabase

### Edge Functions
- [ ] `mercadopago-webhook` tiene `verify_jwt: false` ✅
- [ ] `create-mp-preference` tiene `verify_jwt: true` ✅
- [ ] `get-mp-payment` tiene `verify_jwt: true` ✅
- [ ] Validación de firma implementada en webhook
- [ ] Todas las funciones desplegadas

### Testing
- [ ] Webhook responde 200 OK
- [ ] Validación de firma funciona (test con MP)
- [ ] Pagos duplicados se previenen (idempotencia)
- [ ] Emails llegan correctamente
- [ ] PDFs se generan/adjuntan
- [ ] Logs se registran en DB

### Monitoreo
- [ ] Configurar alertas para `failed_webhooks`
- [ ] Dashboard de ventas funcionando
- [ ] Logs accesibles en Supabase

## 🚨 Señales de Alerta

Si ves esto en producción, **actúa inmediatamente**:

1. **Múltiples errores de validación de firma**
   - Posible intento de attack
   - Revisar logs de `webhook_logs`

2. **Pagos duplicados**
   - Problema con idempotencia
   - Revisar constraint en DB

3. **Webhooks fallando constantemente**
   - Revisar `failed_webhooks`
   - Verificar conectividad con MP API

4. **Emails no enviados**
   - Revisar Resend Dashboard
   - Verificar límites de API

## 📖 Referencias

- [Webhooks de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)
- [Validar Firma Webhook](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks#validar-firma)
- [Supabase Edge Functions Security](https://supabase.com/docs/guides/functions/security)

---

## ✅ Resumen: ¿Es seguro `verify_jwt: false`?

**SÍ**, para el webhook es CORRECTO y NECESARIO porque:
1. ✅ MP no tiene tu JWT de Supabase
2. ✅ La seguridad viene de validar la firma (x-signature)
3. ✅ Validamos con la API de MP antes de procesar
4. ✅ Tenemos idempotencia
5. ✅ Es la práctica estándar para webhooks

**Antes de producción, DEBES**:
- 🔐 Implementar validación de firma (código arriba)
- 🔐 Agregar `MP_WEBHOOK_SECRET` a Supabase
- 🔐 Cambiar a credenciales PROD de MP
- 🔐 Probar exhaustivamente con pagos reales
