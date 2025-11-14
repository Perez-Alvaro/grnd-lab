# 🗄️ GUÍA DE CONFIGURACIÓN DE BASE DE DATOS

## 📋 RESUMEN DEL SCHEMA

Se ha creado un schema completo con **17 tablas y vistas** para un sistema completamente auditable:

### **Tablas Principales:**
1. ✅ `profiles` - Perfiles de usuarios (clientes + admins)
2. ✅ `products` - Productos generales (rutinas, libros, combos)
3. ✅ `routines` - Detalles de rutinas de entrenamiento
4. ✅ `books` - Detalles de libros digitales
5. ✅ `product_bundles` - Combos de productos
6. ✅ `sales` - Ventas/transacciones
7. ✅ `sale_items` - Items de cada venta
8. ✅ `generated_files` - PDFs generados
9. ✅ `downloads` - **Tracking de descargas** (auditoría)
10. ✅ `activity_logs` - **Logs de actividad** (auditoría completa)
11. ✅ `email_logs` - **Tracking de emails enviados**

### **Características de Auditoría:**
- ✅ Todos los logins registrados
- ✅ Todas las ventas trackeadas
- ✅ Todas las descargas con IP y timestamp
- ✅ Todos los emails enviados
- ✅ Activación/desactivación de 2FA registrada
- ✅ Triggers automáticos para logging

---

## 🚀 PASO 1: EJECUTAR MIGRATION EN SUPABASE

### Opción A: SQL Editor (Recomendado)

1. **Ve a tu proyecto en Supabase**
   ```
   https://app.supabase.com
   ```

2. **Click en "SQL Editor"** (en el menú lateral)

3. **Click en "+ New query"**

4. **Copia el contenido completo de:**
   ```
   supabase/migrations/001_initial_schema.sql
   ```

5. **Pega en el editor de Supabase**

6. **Click en "RUN"** ▶️

7. **Verifica que no haya errores**
   - Deberías ver: "Success. No rows returned"
   - Si hay errores, cópialos y avísame

### Opción B: Supabase CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link con tu proyecto
supabase link --project-ref xxxxx

# Ejecutar migration
supabase db push
```

---

## ✅ PASO 2: VERIFICAR QUE TODO ESTÁ BIEN

### Verificar Tablas Creadas

En SQL Editor, ejecuta:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deberías ver:
```
activity_logs
books
downloads
email_logs
generated_files
product_bundles
products
profiles
routines
sale_items
sales
```

### Verificar Triggers

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

### Verificar RLS (Row Level Security)

```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;
```

Todas las tablas deberían tener `rowsecurity = true`.

---

## 👤 PASO 3: CREAR TU PRIMER ADMIN

El usuario admin que ya tienes (`admin@fitter.com`) ahora tiene un perfil.

Pero necesitamos **cambiar su rol a admin**:

```sql
-- Obtener ID del usuario
SELECT id, email FROM auth.users WHERE email = 'admin@fitter.com';

-- Copiar el ID y ejecutar:
UPDATE profiles
SET role = 'admin'
WHERE id = 'PEGA-AQUI-EL-ID-DEL-USUARIO';

-- Verificar:
SELECT p.id, u.email, p.role
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'admin@fitter.com';
```

Deberías ver:
```
| id | email | role |
|----|-------|------|
| xxx... | admin@fitter.com | admin |
```

---

## 📊 PASO 4: INSERTAR DATOS DE PRUEBA

Ahora vamos a insertar algunos productos de prueba para validar.

```sql
-- ===================================
-- INSERTAR RUTINA DE EJEMPLO
-- ===================================

-- 1. Crear producto (rutina)
INSERT INTO products (id, type, name, slug, description, price, active, featured)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'routine',
  'Rutina de Volumen Intermedio',
  'rutina-volumen-intermedio',
  'Rutina diseñada para ganancia muscular en nivel intermedio',
  15000.00,
  true,
  true
);

-- 2. Crear detalles de rutina
INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, weeks)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'unisex',
  'muscle_gain',
  'intermediate',
  4,
  8,
  '[
    {
      "weekNumber": 1,
      "days": [
        {
          "dayNumber": 1,
          "name": "Día 1 - Pecho y Tríceps",
          "exercises": [
            {
              "name": "Press de Banca",
              "sets": 4,
              "reps": "8-10",
              "rest": "90s",
              "rir": 2,
              "notes": "Técnica perfecta"
            }
          ]
        }
      ]
    }
  ]'::jsonb
);

-- ===================================
-- INSERTAR LIBRO DE EJEMPLO
-- ===================================

-- 1. Crear producto (libro)
INSERT INTO products (id, type, name, slug, description, price, active)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'book',
  'Guía Completa de Nutrición',
  'guia-nutricion-completa',
  'Todo lo que necesitas saber sobre nutrición deportiva',
  8000.00,
  true
);

-- 2. Crear detalles del libro
INSERT INTO books (id, author, pages, file_path, file_size_mb)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Dr. Carlos Pérez',
  120,
  '/books/guia-nutricion.pdf',
  5.2
);

-- Verificar productos
SELECT p.id, p.name, p.type, p.price
FROM products p
ORDER BY p.created_at DESC;
```

---

## 🧪 PASO 5: PROBAR RLS (Row Level Security)

Vamos a verificar que las políticas de seguridad funcionan:

```sql
-- Como admin, deberías ver todo
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "TU-USER-ID-ADMIN", "role": "authenticated"}';

SELECT * FROM products; -- Deberías ver todos
SELECT * FROM sales; -- Deberías ver todas

-- Como cliente, solo ves productos activos
-- (esto lo probaremos cuando tengamos clientes)
```

---

## 📈 PASO 6: PROBAR VISTAS

```sql
-- Vista de ventas detalladas (vacía por ahora)
SELECT * FROM sales_detailed;

-- Vista de productos más vendidos (vacía por ahora)
SELECT * FROM top_selling_products;

-- Vista de estadísticas de descargas
SELECT * FROM download_stats;
```

---

## 🔍 PASO 7: VERIFICAR AUDITORÍA

```sql
-- Ver logs de actividad (vacío por ahora, se llenará con uso)
SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10;

-- Ver logs de emails (vacío)
SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 10;

-- Ver descargas (vacío)
SELECT * FROM downloads ORDER BY downloaded_at DESC LIMIT 10;
```

---

## 🎯 ESTRUCTURA COMPLETA DEL SCHEMA

```
┌─────────────────────────────────────────────────┐
│                  AUTENTICACIÓN                  │
│                 auth.users (Supabase)           │
│                      ↓                          │
│                  profiles                       │
│         (role: admin | customer)                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                   PRODUCTOS                     │
│                   products                      │
│        (type: routine | book | bundle)          │
│           ↓          ↓          ↓               │
│       routines    books   product_bundles       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                    VENTAS                       │
│                    sales                        │
│                      ↓                          │
│                 sale_items                      │
│                      ↓                          │
│              generated_files                    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│                  AUDITORÍA                      │
│       downloads | activity_logs | email_logs    │
│         (TODO registrado para compliance)       │
└─────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de continuar, asegúrate de:

- [ ] Todas las tablas creadas (11 tablas)
- [ ] Todas las vistas creadas (3 vistas)
- [ ] Todos los triggers funcionando (6 triggers)
- [ ] RLS habilitado en todas las tablas
- [ ] Admin promocionado a role 'admin'
- [ ] Productos de prueba insertados
- [ ] Sin errores en SQL Editor

---

## 🚨 TROUBLESHOOTING

### Error: "relation already exists"

Si ya ejecutaste el script antes, necesitas limpiar:

```sql
-- CUIDADO: Esto borra TODAS las tablas
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS generated_files CASCADE;
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS product_bundles CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS routines CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Luego vuelve a ejecutar el script completo
```

### Error: "permission denied"

Verifica que estás usando el usuario correcto de Supabase (no el anon key).

### No se creó el profile automáticamente

Ejecuta manualmente:

```sql
INSERT INTO profiles (id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'admin@fitter.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## 📝 PRÓXIMOS PASOS

Una vez que hayas ejecutado el schema exitosamente:

1. ✅ Continuar con autenticación de clientes
2. ✅ Crear dashboard de cliente
3. ✅ Migrar datos mock a Supabase
4. ✅ Implementar APIs serverless

---

**¿Ejecutaste el schema? ¿Algún error? Avísame para continuar.**
