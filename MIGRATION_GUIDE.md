# 🔄 GUÍA DE MIGRACIÓN DE DATOS MOCK A SUPABASE

## ✅ LO QUE SE HA COMPLETADO

1. ✅ **Script SQL de datos de prueba** (`supabase/migrations/002_sample_data.sql`)
   - 3 rutinas de ejemplo: Volumen Masculino, Definición Femenino, Fuerza Unisex
   - Estructura completa con semanas y ejercicios detallados

2. ✅ **Nueva API de Supabase** (`src/api/supabaseAPI.js`)
   - Interfaz compatible con la API mock existente
   - Formateo automático de datos entre DB y frontend
   - Manejo de errores robusto

3. ✅ **Sistema de Toggle Mock/Supabase** (`src/api/endpoints.js`)
   - Variable `USE_SUPABASE = true` para cambiar entre mock y Supabase
   - Mantiene compatibilidad total con código existente

---

## 🚀 PASO 1: EJECUTAR DATOS DE PRUEBA EN SUPABASE

### **Opción A: SQL Editor (Recomendado)**

1. **Abre Supabase Dashboard**
   ```
   https://app.supabase.com → Tu Proyecto → SQL Editor
   ```

2. **Ejecuta el script de datos de prueba:**
   - Abre el archivo: `supabase/migrations/002_sample_data.sql`
   - Copia TODO el contenido
   - Pega en SQL Editor de Supabase
   - Click en **RUN** ▶️

3. **Verifica que se insertaron las rutinas:**
   ```sql
   SELECT id, name, type, price, active, featured
   FROM products
   ORDER BY created_at DESC;
   ```

   Deberías ver:
   ```
   ✅ Masculino Volumen FST-7 5x/semana - $15,000
   ✅ Femenino Definición 3x/semana - $12,000
   ✅ Unisex Fuerza 4x/semana - $18,000
   ```

4. **Verifica los detalles de las rutinas:**
   ```sql
   SELECT
     p.name,
     r.gender,
     r.objective,
     r.level,
     r.frequency,
     r.duration_weeks
   FROM products p
   JOIN routines r ON r.id = p.id
   WHERE p.type = 'routine';
   ```

---

## 🧪 PASO 2: PROBAR LA APLICACIÓN CON SUPABASE

### **2.1 Verifica que USE_SUPABASE esté en true**

Abre `src/api/endpoints.js` y verifica:

```javascript
// Línea 8:
const USE_SUPABASE = true; // ✅ Debe estar en true
```

### **2.2 Inicia la aplicación**

```bash
npm run dev
```

### **2.3 Verifica la Homepage**

1. Ve a `http://localhost:5173`
2. **Deberías ver las 3 rutinas cargadas desde Supabase:**
   - Masculino Volumen FST-7 5x/semana
   - Femenino Definición 3x/semana
   - Unisex Fuerza 4x/semana

3. **Filtros deberían funcionar:**
   - Selecciona "Masculino" → Solo ve rutina de volumen
   - Selecciona "Femenino" → Solo ve rutina de definición
   - Selecciona "Unisex" → Solo ve rutina de fuerza

4. **Click en "Vista Previa" de una rutina:**
   - Deberías ver todos los detalles
   - Semanas, días y ejercicios completos

### **2.4 Verifica el Dashboard de Admin**

1. Login como admin en `/mz-admin-access`
2. Ve al dashboard (`/admin`)
3. **Verifica las métricas:**
   - Total de rutinas activas: **3**
   - Ingresos: **$0** (aún no hay ventas)
   - Usuarios: **0** (solo hay perfiles de admin)

4. **Verifica la tabla de rutinas:**
   - Deberías ver las 3 rutinas listadas
   - Puedes editarlas
   - Puedes crear nuevas

### **2.5 Prueba Crear/Editar Rutina**

1. En `/admin`, click en "Nueva Rutina"
2. Completa el formulario
3. Guarda
4. **La rutina debería guardarse en Supabase**
5. Refresca la página → La rutina sigue ahí ✅

---

## 🔍 TROUBLESHOOTING

### **Problema: No se ven rutinas en la homepage**

**Posibles causas:**

1. **No ejecutaste el script de datos:**
   - Ve a Supabase SQL Editor
   - Ejecuta `002_sample_data.sql`

2. **USE_SUPABASE está en false:**
   - Abre `src/api/endpoints.js`
   - Cambia a `const USE_SUPABASE = true`

3. **Error en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a Console
   - Busca errores rojos
   - Comparte el error para debug

4. **Verifica las credenciales de Supabase:**
   - Abre `.env`
   - Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sean correctos

### **Problema: Error "relation does not exist"**

Significa que no ejecutaste el schema principal:
```bash
# Ejecuta primero:
supabase/migrations/001_initial_schema.sql

# Luego:
supabase/migrations/002_sample_data.sql
```

### **Problema: Rutinas sin detalles**

Si ves rutinas pero sin ejercicios/semanas:

1. Verifica en Supabase:
   ```sql
   SELECT id, weeks FROM routines;
   ```

2. Verifica que `weeks` sea un JSONB válido
3. Si está vacío, vuelve a ejecutar `002_sample_data.sql`

### **Problema: No puedo editar rutinas**

Verifica permisos RLS:
```sql
-- Como admin, deberías poder editar todo
SELECT * FROM products WHERE active = true;

-- Si no funciona, verifica que tu usuario tenga role='admin'
SELECT role FROM profiles WHERE id = auth.uid();
```

---

## 🎨 COMPARACIÓN: MOCK VS SUPABASE

| Característica | Mock (Antes) | Supabase (Ahora) |
|----------------|--------------|------------------|
| **Persistencia** | ❌ Se pierden al recargar | ✅ Guardado permanente |
| **Ediciones** | ❌ Solo en sesión actual | ✅ Persisten entre sesiones |
| **Multi-dispositivo** | ❌ Datos diferentes | ✅ Mismos datos en todos lados |
| **Ventas reales** | ❌ No se registran | ✅ Se registran en DB |
| **Auditoría** | ❌ No hay tracking | ✅ Todo trackeado |
| **Escalabilidad** | ❌ Limitado | ✅ Ilimitado |

---

## 📊 ESTRUCTURA DE DATOS EN SUPABASE

### **Tabla `products`**
```sql
id          | type    | name                                   | price
------------|---------|----------------------------------------|--------
a0eebc99... | routine | Masculino Volumen FST-7 5x/semana     | 15000
b1eebc99... | routine | Femenino Definición 3x/semana         | 12000
c2eebc99... | routine | Unisex Fuerza 4x/semana               | 18000
```

### **Tabla `routines`**
```sql
id          | gender    | objective    | level        | frequency | duration_weeks
------------|-----------|--------------|--------------|-----------|---------------
a0eebc99... | masculino | muscle_gain  | intermediate | 5         | 6
b1eebc99... | femenino  | fat_loss     | beginner     | 3         | 6
c2eebc99... | unisex    | strength     | advanced     | 4         | 8
```

### **Campo `weeks` (JSONB)**

Cada rutina tiene un array de semanas:
```json
[
  {
    "weekNumber": 1,
    "title": "Semana 1",
    "summary": "Introducción al bloque FST-7",
    "notes": "Registrar RIR en movimientos principales",
    "days": [
      {
        "dayNumber": 1,
        "name": "Día 1 - Pecho y Tríceps",
        "type": "ENTRENAMIENTO",
        "exercises": [
          {
            "name": "Press banca con barra",
            "sets": 4,
            "reps": "8-10",
            "rest": "90s",
            "rir": 2,
            "tempo": "2-0-1",
            "notes": "Foco en control excéntrico"
          }
        ]
      }
    ]
  }
]
```

---

## 🔄 TOGGLE ENTRE MOCK Y SUPABASE

Si necesitas volver a usar datos mock temporalmente:

1. Abre `src/api/endpoints.js`
2. Cambia la línea 8:
   ```javascript
   const USE_SUPABASE = false; // Usar mock
   ```
3. Guarda y recarga la app
4. Ahora usará datos mock locales

Para volver a Supabase:
```javascript
const USE_SUPABASE = true; // Usar Supabase
```

---

## 📝 SIGUIENTE PASO: COMPRAS Y PDFS

Ahora que las rutinas están en Supabase, el siguiente paso es:

1. **Configurar Supabase Storage para PDFs**
2. **Conectar el sistema de compras con Mercado Pago**
3. **Generar PDFs de rutinas**
4. **Enviar emails con Resend**

Esto será el tema de la próxima guía.

---

## ✅ CHECKLIST DE MIGRACIÓN

Antes de continuar, verifica:

- [ ] Schema principal ejecutado (`001_initial_schema.sql`)
- [ ] Datos de prueba ejecutados (`002_sample_data.sql`)
- [ ] 3 rutinas visibles en Supabase
- [ ] `USE_SUPABASE = true` en `endpoints.js`
- [ ] Homepage muestra las 3 rutinas
- [ ] Filtros funcionan correctamente
- [ ] Vista previa muestra detalles completos
- [ ] Dashboard de admin muestra 3 rutinas
- [ ] Puedes crear/editar rutinas
- [ ] Los cambios persisten al recargar

---

**¡Migración completada! 🎉**

Ahora tu aplicación usa Supabase para almacenar rutinas de forma permanente.
