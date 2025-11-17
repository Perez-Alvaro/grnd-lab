# Guía de Despliegue - Integración Mercado Pago

Esta guía te llevará paso a paso desde el código actual hasta tener el sistema funcionando en producción.

## Resumen de lo Implementado

✅ **Frontend:**
- PaymentSection.jsx modificado con integración real de MP
- Servicios: mercadoPagoService, bundleService, emailService
- Utilidades: validation.js, logger.js
- Páginas de resultado: PaymentSuccess, PaymentFailure, PaymentPending
- Rutas configuradas en App.jsx

✅ **Backend:**
- 3 Edge Functions creadas (create-mp-preference, mercadopago-webhook, get-mp-payment)
- Migración de base de datos (003_webhook_audit.sql)
- Templates de email con Resend

✅ **Documentación:**
- MERCADOPAGO_SETUP.md - Guía de configuración inicial
- PAYMENT_FLOW.md - Documentación técnica del flujo
- TESTING_CHECKLIST.md - Checklist completo de pruebas

## Pasos para Despliegue

### Fase 1: Obtener Credenciales (TEST)

#### 1.1 Mercado Pago

1. Ir a https://www.mercadopago.com.ar/developers/panel
2. Crear una aplicación nueva (si no existe)
3. Ir a "Credenciales"
4. Copiar credenciales de **TEST**:
   - Public Key → `VITE_MP_PUBLIC_KEY`
   - Access Token → `MP_ACCESS_TOKEN`

⚠️ **Importante**: Empezar SIEMPRE con credenciales de TEST

#### 1.2 Resend

1. Ir a https://resend.com
2. Crear cuenta o login
3. Ir a "API Keys"
4. Crear nueva API Key
5. Copiar: `RESEND_API_KEY`

6. Ir a "Domains"
7. Agregar y verificar tu dominio (ej: `fitter.com`)
8. Una vez verificado, usar: `noreply@fitter.com` como `RESEND_FROM_EMAIL`

### Fase 2: Configurar Variables de Entorno

#### 2.1 Frontend (.env local)

Editar `mz-plan-selector/.env`:

```env
# Mercado Pago TEST
VITE_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Supabase (ya deberías tenerlas)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Frontend URL (cambiar según entorno)
VITE_FRONTEND_URL=http://localhost:5173
```

#### 2.2 Supabase Edge Functions (Secretos)

Configurar secretos en Supabase:

```bash
# 1. Instalar Supabase CLI si no lo tienes
npm install -g supabase

# 2. Login
supabase login

# 3. Link al proyecto
cd mz-plan-selector
supabase link --project-ref your-project-ref

# 4. Configurar secretos
supabase secrets set MP_ACCESS_TOKEN=TEST-xxxx-xxxx
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
supabase secrets set RESEND_FROM_EMAIL=noreply@fitter.com
```

### Fase 3: Ejecutar Migración de Base de Datos

```bash
# 1. Abrir Supabase SQL Editor
# 2. Ejecutar el contenido de: supabase/migrations/003_webhook_audit.sql

# O desde CLI:
supabase db push
```

Verificar que se crearon:
- ✅ Tabla `webhook_logs`
- ✅ Tabla `failed_webhooks`
- ✅ Constraint único en `sales.payment_id`
- ✅ Vistas `payments_dashboard` y `webhook_stats`

### Fase 4: Desplegar Edge Functions

```bash
# Desde el directorio mz-plan-selector/

# 1. Desplegar create-mp-preference
supabase functions deploy create-mp-preference

# 2. Desplegar mercadopago-webhook
supabase functions deploy mercadopago-webhook

# 3. Desplegar get-mp-payment
supabase functions deploy get-mp-payment

# Verificar despliegue
supabase functions list
```

Deberías ver algo como:
```
┌──────────────────────────┬─────────┬────────────────┐
│ NAME                     │ STATUS  │ UPDATED AT     │
├──────────────────────────┼─────────┼────────────────┤
│ create-mp-preference     │ ACTIVE  │ 2025-01-XX ... │
│ mercadopago-webhook      │ ACTIVE  │ 2025-01-XX ... │
│ get-mp-payment           │ ACTIVE  │ 2025-01-XX ... │
└──────────────────────────┴─────────┴────────────────┘
```

### Fase 5: Configurar Webhook en Mercado Pago

#### 5.1 Obtener URL del Webhook

Tu URL será:
```
https://YOUR-PROJECT-REF.supabase.co/functions/v1/mercadopago-webhook
```

Ejemplo:
```
https://abcdefgh.supabase.co/functions/v1/mercadopago-webhook
```

#### 5.2 Configurar en MP Dashboard

1. Ir a https://www.mercadopago.com.ar/developers/panel/app
2. Seleccionar tu aplicación
3. Ir a "Webhooks"
4. Click en "Configurar notificaciones"
5. Modo: **Producción** (aunque uses TEST keys, configura aquí)
6. URL: Pegar la URL del webhook
7. Eventos a escuchar:
   - ✅ `payment` (Pagos)
8. Guardar

#### 5.3 Probar Webhook

MP proporciona un simulador de eventos:
1. En la misma página de Webhooks
2. Click en "Simular notificación"
3. Seleccionar evento "payment"
4. Enviar

Verificar en Supabase Edge Function logs:
```bash
supabase functions logs mercadopago-webhook --tail
```

### Fase 6: Instalar Dependencias Frontend

```bash
cd mz-plan-selector
pnpm install
```

Esto instalará las nuevas dependencias:
- `mercadopago@2.0.15`
- `resend@4.8.0`
- `react-confetti@6.4.0`

### Fase 7: Testing Local

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

Realizar las pruebas del `TESTING_CHECKLIST.md`:

#### Prueba Rápida (Pago Aprobado)

1. Ir a http://localhost:5173
2. Seleccionar una rutina
3. Completar formulario:
   - Email: tu-email@test.com
   - Nombre: Test
   - Apellido: Usuario
4. Click "Proceder al pago"
5. En MP, usar tarjeta de prueba:
   - Número: `4509 9535 6623 3704`
   - CVV: `123`
   - Fecha: `11/25`
   - Nombre: `APRO`
6. Completar pago
7. Verificar:
   - ✅ Redirige a `/payment/success`
   - ✅ Muestra confetti
   - ✅ Muestra datos del pago
   - ✅ Registro en DB `sales`
   - ✅ Email recibido con PDF

### Fase 8: Verificar Logs y Monitoreo

#### 8.1 Logs de Edge Functions

```bash
# Ver logs del webhook
supabase functions logs mercadopago-webhook --tail

# Ver logs de create-preference
supabase functions logs create-mp-preference --tail
```

#### 8.2 Verificar Base de Datos

```sql
-- Ver últimas ventas
SELECT * FROM sales ORDER BY created_at DESC LIMIT 10;

-- Ver logs de webhook
SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;

-- Ver webhooks fallidos
SELECT * FROM failed_webhooks WHERE status = 'pending';

-- Ver estadísticas
SELECT * FROM webhook_stats;
```

#### 8.3 Verificar Emails (Resend Dashboard)

1. Ir a https://resend.com/emails
2. Ver emails enviados
3. Verificar estado de entrega
4. Revisar logs de errores

### Fase 9: Testing Completo

Seguir el checklist completo en `TESTING_CHECKLIST.md`:

- [ ] Pago aprobado (rutina individual)
- [ ] Pago rechazado
- [ ] Pago pendiente
- [ ] Bundle (rutina + libro)
- [ ] Validación de formulario
- [ ] Idempotencia del webhook
- [ ] Manejo de errores
- [ ] Responsive design
- [ ] Logs y monitoreo

### Fase 10: Preparar para Producción

#### 10.1 Obtener Credenciales de Producción

⚠️ **Solo después de testear exhaustivamente con TEST**

1. Ir a MP Dashboard → Credenciales
2. Cambiar a vista de **PRODUCCIÓN**
3. Copiar:
   - Public Key (PROD)
   - Access Token (PROD)

#### 10.2 Actualizar Variables de Entorno

**Frontend (Producción):**
```env
VITE_MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_FRONTEND_URL=https://fitter.com
```

**Supabase (Producción):**
```bash
supabase secrets set MP_ACCESS_TOKEN=APP_USR-xxxx-xxxx-PROD
```

#### 10.3 Configurar Webhook en Producción

1. MP Dashboard → Webhooks
2. Asegurar que URL apunta a producción
3. Modo: **Producción**
4. Guardar

#### 10.4 Desplegar Frontend

```bash
# Build de producción
pnpm build

# Desplegar a tu hosting (ej: Vercel, Netlify)
# Asegurar que variables de entorno están configuradas
```

### Fase 11: Monitoreo Post-Lanzamiento

#### 11.1 Configurar Alertas

En Supabase Dashboard:
1. Ir a "Database" → "Webhooks"
2. Crear webhook para errores en `failed_webhooks`
3. Notificar a Slack/Email cuando haya fallos

#### 11.2 Dashboards

Crear vistas para monitorear:
```sql
-- Ventas diarias
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_sales,
  SUM(total_amount) as revenue
FROM sales
WHERE status = 'approved'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Tasa de conversión
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM sales
GROUP BY status;
```

#### 11.3 Revisión Semanal

- Revisar `failed_webhooks` y reintentar manualmente
- Verificar tasa de entrega de emails en Resend
- Monitorear latencia de Edge Functions
- Revisar logs de errores

## Checklist Final Pre-Producción

- [ ] Credenciales TEST funcionando correctamente
- [ ] Todos los tests pasados (TESTING_CHECKLIST.md)
- [ ] Edge Functions desplegadas y funcionando
- [ ] Webhook configurado y probado
- [ ] Emails llegando correctamente
- [ ] PDFs generándose y adjuntándose
- [ ] Bundles funcionando (si aplica)
- [ ] Logs y monitoreo configurados
- [ ] Documentación revisada
- [ ] Credenciales PROD obtenidas
- [ ] Frontend en producción desplegado
- [ ] Prueba end-to-end en producción con compra real pequeña
- [ ] Alertas configuradas
- [ ] Equipo capacitado en troubleshooting

## Rollback Plan

Si algo falla en producción:

### 1. Problema en Edge Function

```bash
# Ver logs
supabase functions logs mercadopago-webhook --tail

# Si hay error crítico, pausar webhook en MP Dashboard
# Arreglar código
# Redesplegar
supabase functions deploy mercadopago-webhook

# Reprocesar pagos fallidos manualmente desde failed_webhooks
```

### 2. Problema en Frontend

```bash
# Revertir a versión anterior
git revert HEAD
pnpm build
# Redesplegar
```

### 3. Problema en Base de Datos

```sql
-- Backup antes de cualquier cambio
-- Revertir migración si es necesario
```

## Soporte y Troubleshooting

### Recursos

- Documentación MP: https://www.mercadopago.com.ar/developers/es/docs
- Resend Docs: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

### Contactos de Soporte

- Mercado Pago: https://www.mercadopago.com.ar/developers/panel/support
- Resend: support@resend.com
- Supabase: https://supabase.com/dashboard/support

### Logs Importantes

```bash
# Ver todos los logs de una función
supabase functions logs FUNCTION_NAME --tail

# Ver logs con filtro
supabase functions logs FUNCTION_NAME --tail | grep ERROR

# Ver logs históricos
supabase functions logs FUNCTION_NAME --since 1h
```

## Métricas de Éxito

Después del lanzamiento, monitorear:

- **Tasa de conversión**: % de pagos aprobados vs iniciados
- **Tiempo de procesamiento**: Webhook debería completar en < 5s
- **Tasa de entrega de emails**: > 98%
- **Errores de webhook**: < 1%
- **Pagos duplicados**: 0 (gracias a idempotencia)

## Próximos Pasos (Opcional)

Una vez estable en producción:

1. **Agregar más métodos de pago**: Rapipago, Pago Fácil, transferencia
2. **Implementar webhooks de estado**: Notificar al usuario cuando pago pendiente se aprueba
3. **Dashboard de analytics**: Visualizar ventas, conversión, etc.
4. **Cupones de descuento**: Integrar sistema de promociones
5. **Suscripciones**: Si aplica, usar Mercado Pago Subscriptions

---

**¡Éxito con el lanzamiento! 🚀**

Para cualquier duda, revisar:
- `PAYMENT_FLOW.md` - Flujo técnico detallado
- `TESTING_CHECKLIST.md` - Lista de pruebas
- `MERCADOPAGO_SETUP.md` - Configuración de MP
