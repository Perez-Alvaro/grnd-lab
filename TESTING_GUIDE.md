# 🧪 GUÍA DE TESTING - SISTEMA COMPLETO DE COMPRAS

## ✅ FUNCIONALIDADES IMPLEMENTADAS PARA TESTEAR

### **FLUJO COMPLETO:**
1. ✅ Crear rutina (Admin) → Se guarda en Supabase
2. ✅ Cliente se registra → Perfil en DB
3. ✅ Cliente compra rutina → PDF generado, venta registrada
4. ✅ Cliente ve compra en dashboard
5. ✅ Cliente descarga PDF → Tracking en DB
6. ✅ Auditoría completa → Todos los logs registrados

---

## 🚀 CONFIGURACIÓN INICIAL (ANTES DE TESTEAR)

### **Paso 1: Ejecutar Schemas en Supabase**

```sql
-- 1. Ejecuta el schema principal (si no lo hiciste aún)
-- Archivo: supabase/migrations/001_initial_schema.sql
-- Copia y ejecuta en Supabase SQL Editor

-- 2. Promociona tu usuario a admin
SELECT id, email FROM auth.users WHERE email = 'TU-EMAIL';
-- Copia el ID

UPDATE profiles SET role = 'admin'
WHERE id = 'PEGA-AQUI-EL-ID';
```

### **Paso 2: Crear Bucket de Storage**

1. **Ve a Supabase Dashboard** → Tu Proyecto → **Storage**
2. **Click en "Create Bucket"**
3. **Nombre:** `routines`
4. **Public bucket:** `NO` (dejarlo privado)
5. **Click en "Create"**

### **Paso 3: Configurar RLS del Bucket**

En Storage → `routines` → Políticas:

```sql
-- Política de INSERT: Solo usuarios autenticados pueden subir
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'routines');

-- Política de SELECT: Solo el dueño puede descargar
CREATE POLICY "Users can download their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'routines' AND
  (storage.foldername(name))[1] IN (
    SELECT sale_id::text FROM sales WHERE user_id = auth.uid()
  )
);
```

### **Paso 4: Iniciar la App**

```bash
npm run dev
```

---

## 🧪 TEST 1: CREAR RUTINA COMO ADMIN

### **Objetivo:**
Verificar que puedes crear y editar rutinas desde el admin.

### **Pasos:**

1. **Login como admin**
   ```
   http://localhost:5173/mz-admin-access
   Email: tu-email-admin@example.com
   Password: tu-contraseña
   ```

2. **Ve al Dashboard**
   ```
   http://localhost:5173/admin
   ```

3. **Click en "Nueva Rutina"**

4. **Completa el formulario:**
   - Nombre: "Rutina de Prueba"
   - Género: Masculino / Femenino / Unisex
   - Objetivo: Selecciona uno
   - Nivel: Inicial / Intermedio / Avanzado
   - Frecuencia: 4
   - Duración: 6 semanas
   - Precio: 10000

5. **Agrega Días y Ejercicios:**
   - Click en "Agregar Día"
   - Nombre del día: "Día 1 - Pecho"
   - Agregar ejercicios (sets, reps, rest, etc.)

6. **Guarda la rutina**

7. **Verifica en Supabase:**
   ```sql
   SELECT * FROM products WHERE type = 'routine' ORDER BY created_at DESC;
   SELECT * FROM routines ORDER BY created_at DESC;
   ```

### **Resultado Esperado:**
- ✅ Rutina aparece en la tabla del admin
- ✅ Rutina guardada en Supabase
- ✅ Puedes editarla y los cambios persisten

---

## 🧪 TEST 2: REGISTRO DE CLIENTE

### **Objetivo:**
Verificar que un cliente puede registrarse.

### **Pasos:**

1. **Cierra sesión del admin** (o abre navegador en modo incógnito)

2. **Ve a la homepage**
   ```
   http://localhost:5173
   ```

3. **Click en "Registrarse"** (en el header)

4. **Completa el formulario:**
   - Nombre completo: Juan Pérez
   - Email: cliente-test@example.com
   - Contraseña: test123
   - Confirmar contraseña: test123

5. **Click en "Crear Cuenta"**

6. **Deberías ver:**
   - Mensaje de "Cuenta Creada"
   - Confirmación de email

7. **Verifica en Supabase:**
   ```sql
   SELECT * FROM profiles WHERE role = 'customer' ORDER BY created_at DESC;
   SELECT * FROM activity_logs WHERE action_type = 'signup' ORDER BY created_at DESC;
   ```

### **Resultado Esperado:**
- ✅ Perfil creado con `role='customer'`
- ✅ Log de signup registrado en `activity_logs`
- ✅ Redirigido a `/login`

---

## 🧪 TEST 3: LOGIN DE CLIENTE

### **Objetivo:**
Verificar que el cliente puede iniciar sesión.

### **Pasos:**

1. **Ve a Login**
   ```
   http://localhost:5173/login
   ```

2. **Ingresa credenciales:**
   - Email: cliente-test@example.com
   - Password: test123

3. **Click en "Iniciar Sesión"**

4. **Verifica:**
   - Redirigido a `/client/dashboard`
   - Header muestra dropdown con nombre del cliente
   - Dashboard muestra "No tienes compras aún"

5. **Verifica en Supabase:**
   ```sql
   SELECT * FROM activity_logs WHERE action_type = 'login' ORDER BY created_at DESC LIMIT 5;
   ```

### **Resultado Esperado:**
- ✅ Cliente logueado correctamente
- ✅ Dashboard muestra mensaje vacío
- ✅ Login registrado en `activity_logs`

---

## 🧪 TEST 4: COMPRA DE RUTINA (FUNCIONALIDAD PRINCIPAL)

### **Objetivo:**
Verificar el flujo completo de compra con generación de PDF.

### **Pasos:**

1. **Cliente logueado, ve a homepage**
   ```
   http://localhost:5173
   ```

2. **Selecciona una rutina:**
   - Click en "Vista Previa" de cualquier rutina
   - Click en "Seleccionar Rutina"

3. **Scroll hasta sección de Pago**

4. **Completa formulario:**
   - Nombre: Juan
   - Apellido: Pérez
   - Email: (debería estar prellenado)

5. **Click en "Proceder al pago"**

6. **Observa la consola del navegador (F12):**
   ```
   Deberías ver:
   🛒 Iniciando proceso de compra...
   ✅ Venta creada: [ID]
   ✅ Item de venta creado: [ID]
   📄 Generando PDF de la rutina...
   ☁️ Subiendo PDF a Storage...
   ✅ PDF subido: [path]
   ✅ Archivo registrado en DB: [ID]
   ✅ Actividad registrada
   ✅ Compra procesada
   ```

7. **Deberías ver:**
   - Mensaje de "¡Listo! Pago acreditado"
   - "Redirigiendo en 3 segundos..."
   - Redirigido a `/client/dashboard`

8. **En el Dashboard verifica:**
   - Orden #XXX visible
   - Producto comprado listado
   - Botón "Descargar" habilitado
   - Contador "Descargas: 0 / 10"

9. **Verifica en Supabase:**
   ```sql
   -- Ver la venta
   SELECT * FROM sales ORDER BY created_at DESC LIMIT 1;

   -- Ver el item de venta
   SELECT * FROM sale_items ORDER BY created_at DESC LIMIT 1;

   -- Ver el archivo generado
   SELECT * FROM generated_files ORDER BY created_at DESC LIMIT 1;

   -- Ver el log de actividad
   SELECT * FROM activity_logs WHERE action_type = 'purchase' ORDER BY created_at DESC LIMIT 1;
   ```

10. **Verifica en Supabase Storage:**
    - Ve a Storage → `routines`
    - Deberías ver el PDF subido

### **Resultado Esperado:**
- ✅ Venta creada en tabla `sales`
- ✅ Item creado en tabla `sale_items`
- ✅ PDF generado y subido a Storage
- ✅ Archivo registrado en `generated_files`
- ✅ Compra registrada en `activity_logs`
- ✅ Cliente redirigido a dashboard
- ✅ Compra visible en dashboard

---

## 🧪 TEST 5: DESCARGA DE PDF

### **Objetivo:**
Verificar que el cliente puede descargar el PDF y se trackea.

### **Pasos:**

1. **En Dashboard del cliente, click en "Descargar"**

2. **Observa la consola:**
   - Deberías ver logs de descarga

3. **Verifica:**
   - PDF descargado automáticamente
   - Nombre del archivo: `[Nombre-Rutina].pdf`
   - Contador actualizado: "Descargas: 1 / 10"

4. **Abre el PDF descargado:**
   - Verifica que tenga portada con logo "Fitter"
   - Nombre de la rutina
   - Información (género, objetivo, nivel, etc.)
   - Semanas con días y ejercicios
   - Página de consejos

5. **Verifica en Supabase:**
   ```sql
   -- Ver las descargas
   SELECT * FROM downloads ORDER BY downloaded_at DESC LIMIT 1;

   -- Verificar contador actualizado
   SELECT download_count FROM generated_files ORDER BY created_at DESC LIMIT 1;
   ```

### **Resultado Esperado:**
- ✅ PDF descargado correctamente
- ✅ Descarga registrada en tabla `downloads`
- ✅ Contador de descargas incrementado
- ✅ PDF tiene formato profesional con toda la información

---

## 🧪 TEST 6: LÍMITE DE DESCARGAS

### **Objetivo:**
Verificar que el límite de descargas funciona.

### **Pasos:**

1. **Descarga el PDF 10 veces** (el límite está en 10)

2. **Intenta descargar una 11va vez**

3. **Verifica:**
   - Mensaje de error: "Límite de descargas alcanzado"
   - Botón de descarga deshabilitado
   - Contador: "Descargas: 10 / 10"

### **Resultado Esperado:**
- ✅ Límite de 10 descargas funciona
- ✅ Mensaje de error claro
- ✅ No se puede descargar más

---

## 🧪 TEST 7: AUDITORÍA COMPLETA

### **Objetivo:**
Verificar que TODOS los eventos están trackeados.

### **Pasos:**

1. **Ve a Supabase SQL Editor**

2. **Ejecuta queries de auditoría:**

```sql
-- Todos los logs de actividad del cliente
SELECT * FROM activity_logs
WHERE user_email = 'cliente-test@example.com'
ORDER BY created_at DESC;

-- Deberías ver:
-- ✅ signup
-- ✅ login (múltiples)
-- ✅ purchase

-- Todas las descargas del cliente
SELECT
  d.downloaded_at,
  d.user_email,
  gf.file_path,
  gf.download_count
FROM downloads d
JOIN generated_files gf ON gf.id = d.generated_file_id
WHERE d.user_email = 'cliente-test@example.com'
ORDER BY d.downloaded_at DESC;

-- Ventas completas con detalles
SELECT
  s.order_number,
  s.total_amount,
  s.status,
  s.created_at,
  si.product_name,
  gf.file_path,
  gf.download_count,
  gf.download_limit
FROM sales s
JOIN sale_items si ON si.sale_id = s.id
LEFT JOIN generated_files gf ON gf.sale_item_id = si.id
WHERE s.user_email = 'cliente-test@example.com'
ORDER BY s.created_at DESC;
```

### **Resultado Esperado:**
- ✅ Todos los eventos están registrados
- ✅ Puedes auditar cualquier acción del usuario
- ✅ Sistema completamente auditable

---

## 🧪 TEST 8: DASHBOARD DE ADMIN

### **Objetivo:**
Verificar que el admin ve las ventas.

### **Pasos:**

1. **Cierra sesión del cliente**

2. **Login como admin**
   ```
   http://localhost:5173/mz-admin-access
   ```

3. **Ve al Dashboard**

4. **Verifica métricas:**
   - Total de ingresos: Debería mostrar el total de ventas
   - Ingresos mensuales: Total de ventas del mes actual
   - Total de usuarios: Al menos 1 (el cliente de prueba)
   - Rutinas activas: Cantidad de rutinas creadas

5. **Verifica tabla de ventas:**
   - Debería mostrar la venta del cliente
   - Email del cliente
   - Rutina comprada
   - Monto
   - Fecha

### **Resultado Esperado:**
- ✅ Métricas actualizadas con datos reales
- ✅ Ventas visibles en el dashboard
- ✅ Información completa de cada venta

---

## ✅ CHECKLIST COMPLETO DE TESTING

Antes de dar por terminado el testing, verifica:

### **Backend/Database:**
- [ ] Schema ejecutado sin errores
- [ ] Bucket `routines` creado en Storage
- [ ] Políticas RLS configuradas
- [ ] Admin promocionado a role='admin'

### **Admin:**
- [ ] Crear rutina → Se guarda en Supabase
- [ ] Editar rutina → Cambios persisten
- [ ] Ver métricas → Datos reales
- [ ] Ver ventas → Listado completo

### **Cliente:**
- [ ] Registro → Perfil creado
- [ ] Login → Redirige a dashboard
- [ ] Compra rutina → PDF generado
- [ ] Ver compras → Listado completo
- [ ] Descargar PDF → Funciona correctamente
- [ ] Límite de descargas → Respetado

### **Auditoría:**
- [ ] Signup registrado en `activity_logs`
- [ ] Login registrado en `activity_logs`
- [ ] Compra registrada en `activity_logs`
- [ ] Descargas registradas en `downloads`
- [ ] Ventas en `sales` y `sale_items`
- [ ] PDFs en `generated_files`

---

## 🐛 PROBLEMAS COMUNES

### **Error: "relation does not exist"**
- Ejecuta el schema: `001_initial_schema.sql`

### **Error: "bucket does not exist"**
- Crea el bucket `routines` en Supabase Storage

### **PDF no se descarga**
- Verifica políticas RLS del bucket
- Verifica que el PDF existe en Storage

### **No se crea la venta**
- Abre consola del navegador (F12)
- Busca errores en rojo
- Verifica que el usuario esté logueado

---

## 📊 RESULTADO FINAL

Si todos los tests pasan, tienes:

✅ **Sistema completo de compras funcional**
✅ **Generación automática de PDFs**
✅ **Sistema de descarga con límites**
✅ **Auditoría completa** (todo trackeado)
✅ **Dashboard de cliente** (ver compras y descargar)
✅ **Dashboard de admin** (ver ventas y métricas)

---

**¿Encontraste algún error? Cópialo y compártelo para debug.**
