# Configurar Variables de Entorno en Supabase

Las Edge Functions necesitan las siguientes variables de entorno configuradas en Supabase:

## Pasos para configurar:

### Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Click en **Project Settings** (engranaje en la barra lateral)
3. Click en **Edge Functions** → **Manage secrets**
4. Agrega las siguientes variables:

```
MP_ACCESS_TOKEN=APP_USR-7120234675908790-111623-91a6dd871f84dc5fd6a07cd039721117-2996192234
SUPABASE_URL=https://ylorwewmfpfbgyhxpqvr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
RESEND_API_KEY=re_Hev2bBpn_JhPNYkfxZ42aA1LtCdtU4J4b
```

**IMPORTANTE**: El `SUPABASE_SERVICE_ROLE_KEY` lo puedes obtener en:
- Project Settings → API → `service_role` key (section "Project API keys")

### Opción 2: Usando Supabase CLI

Si tienes el CLI de Supabase instalado y estás logueado:

```bash
# Configurar MP_ACCESS_TOKEN
npx supabase secrets set MP_ACCESS_TOKEN=APP_USR-7120234675908790-111623-91a6dd871f84dc5fd6a07cd039721117-2996192234

# Configurar RESEND_API_KEY
npx supabase secrets set RESEND_API_KEY=re_Hev2bBpn_JhPNYkfxZ42aA1LtCdtU4J4b

# Configurar SUPABASE_URL (ya debería estar, pero por si acaso)
npx supabase secrets set SUPABASE_URL=https://ylorwewmfpfbgyhxpqvr.supabase.co

# Configurar SUPABASE_SERVICE_ROLE_KEY
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

# Verificar que se configuraron
npx supabase secrets list
```

## Verificar que funcionan

Después de configurar las variables:

1. Ve a la consola del navegador (F12)
2. Intenta hacer una compra
3. Revisa los logs:
   - Si ves `✅ Preference created successfully`, las variables están bien
   - Si ves error `Payment gateway not configured`, falta `MP_ACCESS_TOKEN`

## Variables de entorno requeridas por función:

### `create-mp-preference`
- ✅ `MP_ACCESS_TOKEN` - Token de acceso de Mercado Pago

### `mercadopago-webhook`
- ✅ `MP_ACCESS_TOKEN` - Token de acceso de Mercado Pago
- ✅ `SUPABASE_URL` - URL del proyecto
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key para acceder a la BD
- ✅ `RESEND_API_KEY` - API key para enviar emails

### `get-mp-payment`
- ✅ `MP_ACCESS_TOKEN` - Token de acceso de Mercado Pago
