# Configuración de Mercado Pago

Esta guía te ayudará a configurar Mercado Pago para aceptar pagos en la aplicación.

---

## 📋 Pasos para Obtener Credenciales

### 1. Crear Cuenta en Mercado Pago

1. Ve a [https://www.mercadopago.com.ar](https://www.mercadopago.com.ar) (o tu país)
2. Regístrate con tu email o inicia sesión si ya tienes cuenta
3. Completa la verificación de identidad si es necesario

### 2. Acceder al Panel de Desarrolladores

1. Ve a [https://www.mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
2. Click en "Tus integraciones" en el menú
3. Click en "Crear aplicación"
4. Completa el formulario:
   - **Nombre:** Fitter Routines
   - **Modelo de integración:** Pagos online
   - **Tipo de producto:** Checkout Pro
5. Click en "Crear aplicación"

### 3. Obtener Credenciales de TEST

⚠️ **IMPORTANTE:** Primero trabaja con credenciales de TEST, nunca uses producción en desarrollo.

1. En tu aplicación, ve a la sección "Credenciales"
2. Selecciona "Credenciales de prueba"
3. Copia las siguientes credenciales:
   - **Public Key:** Empieza con `TEST-xxxxxxxx`
   - **Access Token:** Empieza con `TEST-xxxxxxxx`

### 4. Configurar Variables de Entorno

Agrega las credenciales a tu archivo `.env`:

```env
# Mercado Pago - CREDENCIALES DE TEST
VITE_MP_PUBLIC_KEY=TEST-tu-public-key-aqui
MP_ACCESS_TOKEN=TEST-tu-access-token-aqui

# Frontend URL (para back_urls)
VITE_FRONTEND_URL=http://localhost:5173
```

⚠️ **Nunca subas el archivo `.env` a Git**

---

## 🧪 Tarjetas de Prueba

### Tarjetas para Probar Pagos APROBADOS

| Tarjeta          | Número           | CVV | Fecha    |
|------------------|------------------|-----|----------|
| Visa             | 4509 9535 6623 3704 | 123 | 11/25    |
| Mastercard       | 5031 7557 3453 0604 | 123 | 11/25    |

**Datos del titular (puedes usar cualquiera):**
- Nombre: APRO
- DNI: 12345678

### Tarjetas para Probar Pagos RECHAZADOS

| Estado                | Nombre Titular | Número Tarjeta      |
|-----------------------|----------------|---------------------|
| Fondos insuficientes  | OTHE           | 5031 4332 1540 6351 |
| Tarjeta inválida      | CONT           | 5031 4332 1540 6351 |
| Rechazado por banco   | CALL           | 5031 4332 1540 6351 |

### Probar Pagos PENDIENTES

Para probar pagos pendientes (boleto, Rapipago, etc.):
1. En el Checkout Pro, selecciona "Pagar con efectivo"
2. Elige "Rapipago" o "Pago Fácil"
3. El pago quedará en estado "pending"

---

## 🔔 Configurar Webhook (Notificaciones)

### 1. Obtener URL del Webhook

Después de deployar la Edge Function de Supabase, tendrás una URL como:
```
https://ylorwewmfpfbgyhxpqvr.supabase.co/functions/v1/mercadopago-webhook
```

### 2. Configurar en Mercado Pago

1. Ve a tu aplicación en el Panel de Desarrolladores
2. Click en "Webhooks" o "Notificaciones"
3. Click en "Configurar notificaciones"
4. Agrega la URL del webhook
5. Selecciona los eventos:
   - ✅ Pagos (Payments)
   - ✅ Plan de suscripción (si aplica)
6. Guarda la configuración

### 3. Probar Webhook Localmente (Desarrollo)

Para probar el webhook en tu máquina local:

1. Instala ngrok: `npm install -g ngrok`
2. Ejecuta: `ngrok http 54321` (puerto de Supabase local)
3. Usa la URL HTTPS de ngrok como webhook URL
4. Ejecuta Supabase localmente: `supabase start`

---

## 🚀 Pasar a Producción

Cuando estés listo para aceptar pagos reales:

### 1. Completar Homologación

1. Ve a tu aplicación en Mercado Pago
2. Click en "Ir a producción"
3. Completa el checklist de seguridad
4. Realiza una venta de prueba
5. Espera aprobación (puede tardar 1-2 días)

### 2. Obtener Credenciales de PRODUCCIÓN

1. Ve a "Credenciales de producción"
2. Copia las credenciales REALES (sin "TEST-")
3. Actualiza tu `.env` de producción:

```env
# Mercado Pago - PRODUCCIÓN
VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxx
MP_ACCESS_TOKEN=APP_USR-xxxxxxxx
VITE_FRONTEND_URL=https://tudominio.com
```

### 3. Actualizar Webhook

Cambia la URL del webhook a tu dominio de producción:
```
https://tudominio.supabase.co/functions/v1/mercadopago-webhook
```

---

## 🛡️ Seguridad

### Mejores Prácticas

✅ **SI:**
- Usa credenciales de TEST en desarrollo
- Valida la firma de los webhooks
- Usa HTTPS siempre
- Guarda las credenciales en variables de entorno
- Verifica el estado del pago consultando la API de MP

❌ **NO:**
- No expongas el Access Token en el frontend
- No confíes solo en la redirección del usuario
- No proceses pagos sin validar el webhook
- No subas credenciales a Git
- No uses HTTP en producción

---

## 📚 Recursos Adicionales

- [Documentación oficial de Mercado Pago](https://www.mercadopago.com.ar/developers/es/docs)
- [Checkout Pro - Guía de integración](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing)
- [Webhooks - Notificaciones](https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks)
- [Tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards)

---

## ❓ Problemas Comunes

### "Invalid access token"
- Verifica que copiaste correctamente el Access Token
- Asegúrate de usar el token de TEST en desarrollo

### "Webhook no recibe notificaciones"
- Verifica que la URL esté accesible públicamente
- Revisa que la Edge Function esté deployed
- Chequea los logs en Supabase

### "Pago aprobado pero no se procesa"
- Revisa los logs de `webhook_logs` en Supabase
- Verifica que la firma del webhook sea válida
- Chequea la tabla `failed_webhooks` para errores

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa la sección de Problemas Comunes
2. Consulta los logs en Supabase
3. Contacta a soporte de Mercado Pago: [https://www.mercadopago.com.ar/ayuda](https://www.mercadopago.com.ar/ayuda)
