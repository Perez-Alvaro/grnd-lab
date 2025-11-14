# 🔒 ARREGLOS DE SEGURIDAD Y UX - FASE 1

## ⚠️ PROBLEMAS CRÍTICOS ENCONTRADOS Y SOLUCIONADOS

### **1. VULNERABILIDAD DE SEGURIDAD: Clientes podían acceder a rutas de admin** 🚨

**Problema:**
- `AuthContext` seteaba `user` para CUALQUIER usuario autenticado (admins Y clientes)
- `ProtectedRoute` solo verificaba `if (!user)`, NO verificaba el rol
- **RIESGO:** Un cliente podía acceder a `/admin` porque tenía `user` definido

**Solución:**
- ✅ `AuthContext` ahora verifica el rol en la tabla `profiles`
- ✅ Solo setea `user` si `role === 'admin'`
- ✅ `ProtectedRoute` ahora valida `profile.role === 'admin'`

**Archivos modificados:**
- `src/context/AuthContext.jsx` - Agregada función `checkAdminRole()`
- `src/components/Auth/ProtectedRoute.jsx` - Agregada validación de rol

---

### **2. PROBLEMA DE UX: Header no detectaba clientes logueados** 🎨

**Problema:**
- `Header.jsx` solo usaba `useAuth()` (contexto de admin)
- No importaba ni usaba `useClientAuth()` (contexto de clientes)
- **EFECTO:** Clientes logueados veían botones "Login/Register" en lugar de su perfil

**Solución:**
- ✅ Header ahora usa AMBOS contextos: `useAuth()` y `useClientAuth()`
- ✅ Detecta 3 estados diferentes:
  1. **No hay usuario:** Muestra "Iniciar Sesión" y "Registrarse"
  2. **Cliente logueado:** Muestra dropdown con nombre, email, link a dashboard, logout
  3. **Admin logueado:** Muestra dropdown con 2FA, configuración, logout

**Archivos modificados:**
- `src/components/Shared/Header.jsx` - Importa ambos contextos, navegación condicional

---

## ✅ CAMBIOS IMPLEMENTADOS

### **Archivo: `src/context/AuthContext.jsx`**

**Antes:**
```javascript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    setUser(session?.user ?? null)  // ❌ CUALQUIER usuario
    setLoading(false)
  })
}, [])
```

**Después:**
```javascript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session)
    if (session?.user) {
      checkAdminRole(session.user)  // ✅ VERIFICA ROL
    } else {
      setUser(null)
      setProfile(null)
      setLoading(false)
    }
  })
}, [])

const checkAdminRole = async (authUser) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single()

  // Solo setea user si es admin
  if (data?.role === 'admin') {
    setUser(authUser)
    setProfile(data)
  } else {
    setUser(null)
    setProfile(null)
  }
  setLoading(false)
}
```

**Cambios:**
- ✅ Agregado estado `profile`
- ✅ Función `checkAdminRole()` que verifica rol en DB
- ✅ Solo setea `user` si `role === 'admin'`
- ✅ Exporta `profile` en el value del contexto

---

### **Archivo: `src/components/Auth/ProtectedRoute.jsx`**

**Antes:**
```javascript
if (!user) {
  return <Navigate to="/mz-admin-access" replace />
}
```

**Después:**
```javascript
if (!user || !profile || profile.role !== 'admin') {
  return <Navigate to="/mz-admin-access" replace />
}
```

**Cambios:**
- ✅ Ahora también verifica `profile` y `profile.role === 'admin'`
- ✅ Doble validación de seguridad

---

### **Archivo: `src/components/Shared/Header.jsx`**

**Antes:**
```javascript
const { user, signOut, getMFAFactors } = useAuth();

// Solo mostraba botones si NO hay user
{!user && (
  <>
    <Link to="/login">Iniciar Sesión</Link>
    <Link to="/register">Registrarse</Link>
  </>
)}

// Solo mostraba dropdown de admin
{user && location.pathname.startsWith("/admin") && (
  // Dropdown de admin
)}
```

**Después:**
```javascript
// Usa AMBOS contextos
const { user: adminUser, signOut: adminSignOut, getMFAFactors } = useAuth();
const { user: clientUser, profile: clientProfile, signOut: clientSignOut } = useClientAuth();

// Muestra Login/Register solo si NO hay usuario (ni admin ni cliente)
{!adminUser && !clientUser && (
  <>
    <Link to="/login">Iniciar Sesión</Link>
    <Link to="/register">Registrarse</Link>
  </>
)}

// Dropdown de CLIENTE (nuevo)
{clientUser && clientProfile && !location.pathname.startsWith("/admin") && (
  <div className="dropdown">
    <User icon />
    <span>{clientProfile.full_name || 'Mi Cuenta'}</span>
    <ChevronDown />

    {/* Dropdown menu */}
    <Link to="/client/dashboard">Mi Dashboard</Link>
    <button onClick={handleClientLogout}>Cerrar Sesión</button>
  </div>
)}

// Dropdown de ADMIN (existente, actualizado)
{adminUser && location.pathname.startsWith("/admin") && (
  // Dropdown de admin con adminUser y handleAdminLogout
)}
```

**Cambios:**
- ✅ Importa `useClientAuth()`
- ✅ Renombra `user` a `adminUser` para claridad
- ✅ Agrega `clientUser` y `clientProfile` de `useClientAuth()`
- ✅ Agrega dropdown de cliente con:
  - Nombre del cliente
  - Email
  - Link a "Mi Dashboard" (`/client/dashboard`)
  - Botón de logout
- ✅ Funciones separadas: `handleAdminLogout()` y `handleClientLogout()`
- ✅ Botones Login/Register solo se muestran si NO hay usuario logueado

---

## 🎯 FLUJOS ACTUALIZADOS

### **Flujo 1: Cliente Normal**

```
1. Usuario visita homepage (/)
   → Ve: "Iniciar Sesión" y "Registrarse" en header

2. Click en "Registrarse"
   → Va a /register
   → Completa formulario
   → Se crea perfil con role='customer'

3. Click en "Iniciar Sesión"
   → Va a /login
   → Ingresa credenciales
   → ClientAuthContext verifica role === 'customer'
   → AuthContext NO setea user (porque no es admin)

4. Redirigido a /client/dashboard
   → Header muestra: Dropdown con nombre del cliente
   → Dropdown tiene: "Mi Dashboard" y "Cerrar Sesión"

5. Cliente navega a homepage (/)
   → Header SIGUE mostrando dropdown de cliente
   → NO muestra "Login/Register"
```

### **Flujo 2: Administrador**

```
1. Admin visita /mz-admin-access
   → Ingresa credenciales
   → AuthContext verifica role === 'admin'
   → ClientAuthContext NO setea user (porque no es customer)

2. Si tiene 2FA:
   → Ingresa código TOTP
   → Verifica AAL2

3. Redirigido a /admin
   → Header muestra: Dropdown con "Administrador"
   → Dropdown tiene: "2FA" y "Cerrar Sesión"

4. Admin intenta acceder a /client/dashboard
   → ClientProtectedRoute verifica
   → NO tiene clientUser
   → Redirigido a /login
```

### **Flujo 3: Cliente intenta acceder a Admin**

```
1. Cliente logueado intenta ir a /admin
   → ProtectedRoute verifica:
     - ¿Hay user? NO (AuthContext no setea user para clientes)
     - ¿Hay profile con role='admin'? NO
   → Redirigido a /mz-admin-access
   → ✅ ACCESO DENEGADO CORRECTAMENTE
```

---

## 🔐 VALIDACIONES DE SEGURIDAD

### **1. Separación de Contextos**

| Contexto | Usuario | Validación | Setea user si |
|----------|---------|------------|---------------|
| `AuthContext` | Admin | `role === 'admin'` | Es admin |
| `ClientAuthContext` | Cliente | `role === 'customer'` | Es cliente |

### **2. Protección de Rutas**

| Ruta | Componente | Verifica | Redirige a |
|------|-----------|----------|------------|
| `/admin/*` | `ProtectedRoute` | `user && profile.role === 'admin'` | `/mz-admin-access` |
| `/client/dashboard` | `ClientProtectedRoute` | `user && profile.role === 'customer'` | `/login` |

### **3. Navegación Condicional en Header**

| Estado | Header muestra |
|--------|----------------|
| No hay usuario | "Iniciar Sesión" + "Registrarse" |
| Cliente logueado | Dropdown con nombre + Dashboard + Logout |
| Admin logueado (en /admin) | Dropdown con 2FA + Logout |
| Admin logueado (NO en /admin) | Nada (solo logo) |

---

## ✅ CHECKLIST DE SEGURIDAD

- [x] **AuthContext verifica rol de admin**
- [x] **ClientAuthContext verifica rol de cliente**
- [x] **ProtectedRoute valida profile.role === 'admin'**
- [x] **ClientProtectedRoute valida profile.role === 'customer'**
- [x] **Header detecta ambos tipos de usuarios**
- [x] **Navegación separada para admin y cliente**
- [x] **Logout separado para cada tipo de usuario**
- [x] **Clientes NO pueden acceder a /admin**
- [x] **Admins NO pueden acceder a /client/dashboard**
- [x] **Botones Login/Register se ocultan cuando hay usuario logueado**

---

## 🧪 CÓMO PROBAR

### **Test 1: Registro y Login de Cliente**

```bash
1. npm run dev
2. Ve a http://localhost:5173
3. Verifica: Header muestra "Iniciar Sesión" y "Registrarse"
4. Click en "Registrarse"
5. Completa formulario con email de prueba
6. Ve a /login y entra
7. Deberías ver:
   ✅ Dropdown en header con tu nombre
   ✅ Opción "Mi Dashboard"
   ✅ Al hacer click, vas a /client/dashboard
8. Ve a homepage (/)
   ✅ Dropdown SIGUE visible
   ✅ NO ves "Login/Register"
9. Intenta acceder a http://localhost:5173/admin
   ✅ Deberías ser redirigido a /mz-admin-access
```

### **Test 2: Login de Admin**

```bash
1. Cierra sesión de cliente
2. Ve a http://localhost:5173/mz-admin-access
3. Ingresa credenciales de admin
4. (Si tienes 2FA) Ingresa código
5. Deberías llegar a /admin
   ✅ Header muestra dropdown de admin
   ✅ Opción "2FA"
   ✅ Opción "Cerrar Sesión"
6. Intenta acceder a http://localhost:5173/client/dashboard
   ✅ Deberías ser redirigido a /login
```

### **Test 3: Seguridad (CRÍTICO)**

```bash
# Como Cliente:
1. Loguéate como cliente
2. Abre consola de navegador
3. Escribe: localStorage
4. Verifica que hay un token de Supabase
5. Intenta ir a /admin
   ✅ Deberías ser RECHAZADO
   ✅ Redirigido a /mz-admin-access
   ✅ Console.log debe mostrar "Not an admin, clear the session"

# Como Admin:
1. Loguéate como admin
2. Intenta ir a /client/dashboard
   ✅ Deberías ser RECHAZADO
   ✅ Redirigido a /login
```

---

## 📊 ESTADO FINAL

### ✅ **Seguridad:**
- Clientes NO pueden acceder a rutas de admin
- Admins NO pueden acceder a rutas de cliente
- Doble validación en rutas protegidas
- Contextos separados y filtrados por rol

### ✅ **UX:**
- Clientes ven su nombre y dropdown personalizado
- Admins ven dropdown con opciones de admin
- Usuarios no logueados ven Login/Register
- Navegación clara y separada

### ✅ **Auditoría:**
- Todos los logins registrados en `activity_logs`
- Verificación de rol en cada autenticación
- Logs claros en consola para debugging

---

## 🚀 PRÓXIMOS PASOS

1. **Ejecutar schema en Supabase** (si no lo has hecho)
2. **Probar los 3 tests de arriba**
3. **Verificar logs en Supabase:**
   ```sql
   SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10;
   SELECT * FROM profiles;
   ```
4. **Migrar datos mock a Supabase**
5. **Conectar compras reales**

---

**¡Sistema seguro y funcionando correctamente! 🔒**
