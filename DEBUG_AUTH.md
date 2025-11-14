# 🔧 Guía de Depuración de Autenticación 2FA

## ⚠️ PROBLEMA ACTUAL
El login con 2FA se queda en "Verificando autenticación..." porque hay una sesión AAL1 persistida en el navegador.

## 🛠️ SOLUCIÓN RÁPIDA

### 1. Limpiar Sesión Actual
Abre la **Consola del Navegador** (F12) y ejecuta:

```javascript
// Limpiar storage
localStorage.clear()
sessionStorage.clear()

// Limpiar cookies de Supabase
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// Recargar
location.reload()
```

### 2. Probar Flujo Completo

#### a) Sin sesión (limpio)
1. Ir a: `http://localhost:5173/admin`
   - ✅ Debe redirigir a `/mz-admin-access`

2. Hacer login con credenciales
   - ✅ Debe mostrar pantalla 2FA (6 dígitos)

3. Ingresar código TOTP
   - ✅ Debe redirigir a `/admin` (dashboard)

#### b) Con sesión AAL2 activa
1. Recargar página en `/admin`
   - ✅ Debe permanecer en dashboard (sin pedir login)

#### c) Con sesión AAL1 (expiró AAL2)
1. Ir a `/admin`
   - ✅ Debe redirigir a `/mz-admin-access`
   - ✅ Debe mostrar automáticamente pantalla 2FA (sin pedir email/password)

2. Ingresar código TOTP
   - ✅ Debe subir a AAL2 y redirigir al dashboard

---

## 🔍 LOGS DE DEBUG

### En la Consola del Navegador verás:

#### **ProtectedRoute**
```
🔐 ProtectedRoute - MFA Check: { hasMFA: true, currentAAL: 'aal1', nextAAL: 'aal2', path: '/admin' }
⚠️ MFA requerido pero no completado
🔐 MFA required, redirecting to login
```

#### **AdminLogin - Sesión Existente**
```
🔍 AdminLogin - Checking existing session: { user: true, authLoading: false, needsMFA: false }
🔐 Session AAL Status: { currentAAL: 'aal1', nextAAL: 'aal2', hasMFA: true }
⚠️ Requiere 2FA, mostrando pantalla de verificación
```

#### **AdminLogin - Login Nuevo**
```
📧 Login result: { data: {...}, error: null }
🔐 Assurance Level: { assuranceData: { currentLevel: 'aal1', nextLevel: 'aal2' } }
🔑 MFA Factors: { factorsData: { totp: [...] } }
🎯 Decision: { hasActiveMFA: true, needsAAL2: true, currentAAL: 'aal1' }
✅ 2FA detectado, mostrando pantalla de verificación
```

#### **Después de verificar 2FA**
```
✅ 2FA verificado correctamente
🔐 Nuevo Assurance Level: { currentLevel: 'aal2' }
🎯 AAL2 alcanzado, redirigiendo...
```

---

## 📋 CAMBIOS IMPLEMENTADOS

### 1. **ProtectedRoute.jsx**
- ✅ Verifica AAL antes de permitir acceso
- ✅ Redirige a login si necesita completar 2FA
- ✅ Pasa estado `requiresMFA` al redirigir

### 2. **AdminLogin.jsx**
- ✅ Detecta sesión existente al cargar
- ✅ Si usuario tiene AAL1 → muestra pantalla 2FA automáticamente
- ✅ Si usuario tiene AAL2 → redirige al dashboard
- ✅ Previene loops infinitos con `checkingSession`

### 3. **AuthContext.jsx**
- ✅ Simplificado: siempre setea `user` si es admin
- ✅ No bloquea por AAL (eso lo maneja ProtectedRoute)

---

## 🔥 CASOS DE USO SOPORTADOS

### ✅ Usuario con 2FA - Primera vez del día
```
/admin → ProtectedRoute (AAL1) → /mz-admin-access → Pantalla 2FA → Verificar → /admin (AAL2)
```

### ✅ Usuario con 2FA - Sesión AAL2 activa
```
/admin → ProtectedRoute (AAL2) → Dashboard ✓
```

### ✅ Usuario SIN 2FA
```
/mz-admin-access → Login → /admin ✓
```

### ✅ Usuario intenta /admin sin login
```
/admin → ProtectedRoute (no user) → /mz-admin-access
```

---

## 🐛 SI EL PROBLEMA PERSISTE

### Verificar que Supabase tenga MFA habilitado:
```sql
-- En Supabase SQL Editor
SELECT id, email, last_sign_in_at FROM auth.users WHERE email = 'tu-email@hotmail.com';

SELECT * FROM auth.mfa_factors WHERE user_id = 'tu-user-id';
```

### Verificar nivel de AAL actual:
Abre la consola y ejecuta:
```javascript
import { supabase } from './src/lib/supabase'

const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
console.log('Current AAL:', data)
```

### Forzar logout completo:
```javascript
import { supabase } from './src/lib/supabase'

await supabase.auth.signOut({ scope: 'global' })
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 📞 SOPORTE ADICIONAL

Si después de limpiar la sesión el problema persiste:

1. Verifica que el proyecto de Supabase tenga MFA habilitado en:
   - Dashboard → Authentication → Providers → Email → Settings → "Enable Multi-Factor Authentication"

2. Verifica que el factor TOTP esté activo:
   - Dashboard → Authentication → Users → [Tu usuario] → Factors

3. Revisa los logs en:
   - Dashboard → Logs → Auth Logs
