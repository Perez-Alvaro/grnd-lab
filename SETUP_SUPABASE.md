# 🔐 Configuración de Supabase para Fitter

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Inicia sesión o crea una cuenta gratuita
3. Click en **"New Project"**
4. Completa los datos:
   - **Name**: `fitter-production` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala bien)
   - **Region**: Selecciona la más cercana (South America - São Paulo recomendado para Argentina)
   - **Pricing Plan**: Free (incluye 500MB DB, 1GB storage, 50K usuarios)
5. Click en **"Create new project"** (tarda ~2 minutos)

---

## Paso 2: Obtener Credenciales

1. Una vez creado el proyecto, ve a **Settings** (⚙️ en el menú lateral)
2. Click en **API** en el menú de settings
3. Copia las siguientes credenciales:

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

### Project API Keys
- **anon/public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (es segura para frontend)
- **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (NUNCA expongas esta en frontend)

---

## Paso 3: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto `mz-plan-selector/`
2. Reemplaza los valores:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **IMPORTANTE**: Asegúrate de que `.env` esté en tu `.gitignore` para no subir las credenciales a GitHub

---

## Paso 4: Configurar Autenticación

1. En Supabase, ve a **Authentication** > **Providers**
2. Configura **Email**:
   - Asegúrate de que esté habilitado
   - Desactiva **"Confirm email"** por ahora (para desarrollo rápido)
   - Puedes activarlo más tarde para producción

3. En **Authentication** > **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (desarrollo)
   - **Redirect URLs**: Agrega:
     - `http://localhost:5173/admin`
     - `http://localhost:5173/mz-admin-access`

---

## Paso 5: Crear Usuario Administrador

### Opción A: Desde la UI de Supabase (Más fácil)

1. Ve a **Authentication** > **Users**
2. Click en **"Add user"** > **"Create new user"**
3. Completa:
   - **Email**: `admin@fitter.com` (o tu email)
   - **Password**: `Admin123!` (cambia esto por algo más seguro)
   - **Auto Confirm User**: ✅ Activado
4. Click en **"Create user"**

### Opción B: Desde SQL Editor

1. Ve a **SQL Editor**
2. Ejecuta este query:

```sql
-- Crear usuario admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  'admin@fitter.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  'authenticated'
);
```

---

## Paso 6: Probar la Autenticación

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre el navegador en `http://localhost:5173`

3. Navega manualmente a la ruta oculta:
```
http://localhost:5173/mz-admin-access
```

4. Inicia sesión con:
   - **Email**: `admin@fitter.com`
   - **Password**: `Admin123!`

5. Deberías ser redirigido a `/admin` automáticamente

6. El botón de "Administrador" ya NO aparece en el header público

---

## Paso 7: Verificar Seguridad

### ✅ Pruebas de Seguridad

1. **Sin autenticación**: Intenta acceder a `http://localhost:5173/admin` sin login
   - ✅ Debe redirigir a `/mz-admin-access`

2. **Con autenticación**: Inicia sesión y accede a `/admin`
   - ✅ Debe permitir el acceso
   - ✅ Debe mostrar botón "Cerrar Sesión"

3. **Logout**: Click en "Cerrar Sesión"
   - ✅ Debe redirigir a `/`
   - ✅ No debe permitir volver a `/admin`

---

## Paso 8: Configurar para Producción (Vercel)

Cuando despliegues en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu anon key

4. En Supabase > Authentication > URL Configuration:
   - **Site URL**: `https://tu-dominio.vercel.app`
   - **Redirect URLs**: Agrega:
     - `https://tu-dominio.vercel.app/admin`
     - `https://tu-dominio.vercel.app/mz-admin-access`

---

## 🎯 Rutas del Sistema

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Pública | Landing page para clientes |
| `/rutinas/:id` | Pública | Vista previa de rutinas |
| `/success` | Pública | Confirmación de compra |
| `/mz-admin-access` | Pública | Login de administrador (oculta) |
| `/admin` | 🔒 Protegida | Dashboard de administrador |
| `/admin/plantillas/nueva` | 🔒 Protegida | Crear nueva rutina |
| `/admin/plantillas/:id/editar` | 🔒 Protegida | Editar rutina |

---

## 🔐 Seguridad Implementada

✅ Autenticación con Supabase Auth
✅ Rutas protegidas con `ProtectedRoute`
✅ Sesión persistente en localStorage
✅ Auto-refresh de tokens
✅ Logout seguro
✅ Ruta de admin oculta (sin botones públicos)
✅ Redirección automática si no está autenticado

---

## 📝 Próximos Pasos

Una vez que la autenticación funcione:

1. ✅ Crear schema de base de datos (productos, ventas, usuarios)
2. ✅ Migrar datos mock a Supabase
3. ✅ Implementar APIs serverless en Vercel
4. ✅ Integrar Mercado Pago
5. ✅ Configurar generación de PDFs en servidor
6. ✅ Integrar Resend para emails

---

## ❓ Problemas Comunes

### Error: "Missing Supabase environment variables"
- Verifica que `.env` tenga las variables correctas
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Invalid login credentials"
- Verifica que el usuario exista en Supabase
- Revisa que el email esté confirmado
- Prueba crear un nuevo usuario desde la UI

### No redirige después del login
- Verifica que las redirect URLs estén configuradas
- Revisa la consola del navegador por errores
- Limpia localStorage y vuelve a intentar

---

**¿Listo?** Ahora puedes iniciar sesión en la ruta oculta `/mz-admin-access` 🚀
