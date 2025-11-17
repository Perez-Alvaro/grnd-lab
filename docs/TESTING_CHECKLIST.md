# Testing Checklist - Integración Mercado Pago

Esta guía te ayudará a probar la integración completa de Mercado Pago con bundles, emails y manejo de estados.

## Pre-requisitos

- [ ] Credenciales de TEST de Mercado Pago configuradas en `.env`
- [ ] Edge Functions desplegadas en Supabase
- [ ] Webhook URL configurada en Mercado Pago Dashboard
- [ ] Variables de entorno en Supabase configuradas (MP_ACCESS_TOKEN, RESEND_API_KEY)
- [ ] Servidor de desarrollo corriendo (`pnpm dev`)

## 1. Pruebas de Productos Individuales (Rutina sola)

### 1.1 Pago Aprobado
- [ ] Seleccionar una rutina individual (NO bundle)
- [ ] Completar formulario de checkout
- [ ] Hacer clic en "Proceder al pago"
- [ ] Verificar redirección a Mercado Pago Checkout Pro
- [ ] Usar tarjeta de prueba aprobada: `4509 9535 6623 3704`
  - CVV: cualquier 3 dígitos
  - Fecha: cualquier fecha futura
  - Nombre: APRO
- [ ] Verificar redirección a `/payment/success?payment_id=xxx`
- [ ] Verificar página de éxito muestra confetti
- [ ] Verificar datos del pago (monto, ID, email)
- [ ] Verificar countdown de redirección
- [ ] Verificar en Supabase que se creó registro en `sales`
- [ ] Verificar en Supabase que se creó registro en `sale_items`
- [ ] Verificar que `sales.status = 'approved'`
- [ ] Verificar webhook log en tabla `webhook_logs`
- [ ] Revisar email recibido con PDF adjunto

### 1.2 Pago Rechazado
- [ ] Seleccionar una rutina individual
- [ ] Completar formulario de checkout
- [ ] Usar tarjeta de prueba rechazada: `4444 4444 4444 4444`
  - Nombre: OCHO
- [ ] Verificar redirección a `/payment/failure?payment_id=xxx`
- [ ] Verificar página muestra error apropiado
- [ ] Verificar sugerencias de acción
- [ ] Verificar botones "Intentar Nuevamente" y "Volver al Dashboard"
- [ ] Verificar en Supabase que se creó registro en `sales` con status `rejected`
- [ ] Revisar email de rechazo

### 1.3 Pago Pendiente
- [ ] Seleccionar una rutina individual
- [ ] Completar formulario de checkout
- [ ] Usar tarjeta de prueba pendiente: `3782 822463 10005`
  - Nombre: EXPE
- [ ] Verificar redirección a `/payment/pending?payment_id=xxx`
- [ ] Verificar página muestra estado pendiente
- [ ] Verificar instrucciones apropiadas
- [ ] Verificar en Supabase que se creó registro con status `pending`
- [ ] Revisar email de pago pendiente

## 2. Pruebas de Bundles (Rutina + Libro)

### 2.1 Crear Bundle de Prueba
- [ ] En base de datos, verificar que existe un producto tipo `bundle`
- [ ] Verificar que existe relación en `product_bundles` con:
  - Un producto tipo `routine`
  - Un producto tipo `libro`
- [ ] Verificar que el libro tiene `pdf_file_path` configurado

### 2.2 Pago de Bundle Aprobado
- [ ] Seleccionar el bundle (rutina + libro)
- [ ] Verificar que en PaymentSection se muestra badge "Bundle: 2 productos"
- [ ] Completar formulario de checkout
- [ ] Usar tarjeta APRO para aprobar
- [ ] Verificar redirección exitosa
- [ ] Verificar en Supabase que se crearon 2 registros en `sale_items`
- [ ] Verificar email recibido con 2 PDFs adjuntos:
  - PDF de rutina (generado)
  - PDF de libro (existente)

## 3. Pruebas de Validación de Formulario

- [ ] Intentar submit con email vacío → debe mostrar error
- [ ] Intentar submit con email inválido → debe mostrar error
- [ ] Intentar submit con nombre vacío → debe mostrar error
- [ ] Intentar submit con apellido vacío → debe mostrar error
- [ ] Verificar que errores se limpian al escribir en campo

## 4. Pruebas de Seguridad y Manejo de Errores

### 4.1 Idempotencia del Webhook
- [ ] Aprobar un pago
- [ ] Intentar reenviar el webhook manualmente (mismo payment_id)
- [ ] Verificar que NO se crea venta duplicada
- [ ] Verificar log en `webhook_logs` con `already_processed: true`

### 4.2 Validación de Pago
- [ ] Intentar acceder a `/payment/success?payment_id=999999` (ID inexistente)
- [ ] Verificar manejo de error apropiado
- [ ] Verificar que no crashea la aplicación

### 4.3 Usuario No Logueado
- [ ] Cerrar sesión
- [ ] Seleccionar una rutina
- [ ] Intentar proceder al pago
- [ ] Verificar redirección a `/login`
- [ ] Verificar que rutina se guarda en `localStorage` como `pending_purchase`
- [ ] Login exitoso debe retomar el flujo de compra

## 5. Pruebas de Edge Functions

### 5.1 Create MP Preference
- [ ] Verificar logs en Supabase Edge Functions
- [ ] Confirmar que preferencia se crea correctamente
- [ ] Confirmar que `notification_url` apunta al webhook
- [ ] Confirmar que `back_urls` son correctas

### 5.2 Mercado Pago Webhook
- [ ] Verificar que webhook responde 200 OK siempre
- [ ] Verificar logs de webhook en tabla `webhook_logs`
- [ ] Confirmar que PDF se genera correctamente
- [ ] Confirmar retry logic en caso de error
- [ ] Verificar que errores se registran en `failed_webhooks`

### 5.3 Get MP Payment
- [ ] Verificar que retorna información correcta del pago
- [ ] Confirmar que datos sensibles NO se exponen

## 6. Pruebas de Email (Resend)

- [ ] Verificar email de confirmación (pago aprobado)
  - Template correcto
  - PDFs adjuntos
  - Información de compra correcta
- [ ] Verificar email de pago pendiente
  - Instrucciones apropiadas según método de pago
- [ ] Verificar email de pago rechazado
  - Motivo del rechazo
  - Sugerencias de acción

## 7. Pruebas de UI/UX

- [ ] Verificar responsive en mobile
- [ ] Verificar responsive en tablet
- [ ] Verificar responsive en desktop
- [ ] Verificar animaciones (confetti, fade-in)
- [ ] Verificar loading states
- [ ] Verificar que no hay console errors
- [ ] Verificar accesibilidad (navegación por teclado)

## 8. Pruebas de Logger

- [ ] Verificar logs en consola del navegador (modo dev)
- [ ] Verificar logs en Supabase (modo producción)
- [ ] Confirmar que tiempos de ejecución se registran
- [ ] Confirmar que errores se registran con contexto

## 9. Pruebas de Migración de Base de Datos

- [ ] Ejecutar migración `003_webhook_audit.sql`
- [ ] Verificar que tabla `webhook_logs` existe
- [ ] Verificar que tabla `failed_webhooks` existe
- [ ] Verificar que constraint único en `sales.payment_id` existe
- [ ] Verificar que vistas `payments_dashboard` y `webhook_stats` funcionan

## 10. Pruebas de Configuración

- [ ] Verificar que `.env` tiene todas las variables necesarias:
  - `VITE_MP_PUBLIC_KEY`
  - `MP_ACCESS_TOKEN` (en Supabase)
  - `RESEND_API_KEY` (en Supabase)
  - `RESEND_FROM_EMAIL` (en Supabase)
  - `VITE_FRONTEND_URL`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Tarjetas de Prueba Mercado Pago

| Resultado | Número | Nombre | CVV | Fecha |
|-----------|--------|--------|-----|-------|
| Aprobado | 4509 9535 6623 3704 | APRO | 123 | 11/25 |
| Rechazado fondos | 4444 4444 4444 4444 | OCHO | 123 | 11/25 |
| Rechazado otros | 4013 5406 8274 6260 | FAIL | 123 | 11/25 |
| Pendiente | 3782 822463 10005 | EXPE | 1234 | 11/25 |

## Resultados Esperados

### Flujo Completo Exitoso
1. Usuario selecciona rutina/bundle
2. Completa formulario
3. Redirige a MP Checkout Pro
4. Paga con tarjeta de prueba
5. MP notifica via webhook
6. Webhook procesa pago:
   - Crea venta en DB
   - Genera/obtiene PDFs
   - Envía email con adjuntos
7. Usuario redirige a página de éxito
8. Usuario recibe email de confirmación
9. PDFs disponibles en email

### Métricas de Éxito
- ✅ 0 errores en consola
- ✅ Tiempo de respuesta webhook < 5 segundos
- ✅ Email enviado en < 10 segundos
- ✅ PDFs correctamente adjuntos
- ✅ Datos consistentes en base de datos
- ✅ No ventas duplicadas

## Troubleshooting

### Webhook no se ejecuta
1. Verificar URL del webhook en MP Dashboard
2. Verificar que Edge Function está desplegada
3. Revisar logs en Supabase Edge Functions
4. Confirmar que `MP_ACCESS_TOKEN` está configurado

### Email no llega
1. Verificar `RESEND_API_KEY` en Supabase
2. Revisar logs de Resend Dashboard
3. Verificar carpeta de spam
4. Confirmar que `RESEND_FROM_EMAIL` está verificado en Resend

### PDFs no se generan
1. Verificar permisos en Supabase Storage
2. Confirmar que rutina tiene ejercicios
3. Revisar logs de generación de PDF en webhook
4. Verificar que libro tiene `pdf_file_path` válido

### Venta duplicada
1. Verificar constraint único en `sales.payment_id`
2. Revisar lógica de idempotencia en webhook
3. Confirmar que webhook retorna 200 OK siempre
