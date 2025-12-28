# ✅ Importar JSON con Guardado Automático en Base de Datos

## Problema Resuelto

**Antes:** Cuando importabas rutinas desde JSON, solo se cargaban en el editor pero NO se guardaban en la base de datos.

**Ahora:** Al importar un JSON, puedes elegir automáticamente guardarlo en la base de datos SQLite local.

---

## 🎯 Cómo Funciona

### 1. **Importar con guardado automático (RECOMENDADO)**

Cuando importas un archivo JSON:

1. Selecciona tu archivo JSON
2. Verifica que sea válido (✅ Archivo válido)
3. **Marca el checkbox**: "**Guardar en base de datos local**" (marcado por defecto)
4. Click en "**📥 Importar y Guardar**"

**Resultado:**
- ✅ Rutina importada al editor
- ✅ Rutina guardada en la base de datos SQLite
- ✅ Acceso persistente a la rutina

### 2. **Importar solo al editor (sin guardar en BD)**

Si solo quieres cargar al editor sin guardar:

1. Selecciona tu archivo JSON
2. **Desmarca el checkbox**: "Guardar en base de datos local"
3. Click en "**📥 Importar Rutina**"

**Resultado:**
- ✅ Rutina importada al editor
- ❌ NO se guarda en la base de datos
- ⚠️ Se perderá al cerrar el navegador (a menos que la guardes manualmente)

---

## 📋 Características Nuevas

### ✨ Checkbox "Guardar en base de datos local"

- **Habilitado por defecto**: La mayoría de las veces querrás guardar
- **Se deshabilita** si el servidor no está disponible
- **Muestra advertencia** si el servidor está offline

### 🔄 Botón Inteligente

El botón cambia según tus opciones:

| Estado | Texto del Botón | Acción |
|--------|-----------------|--------|
| Normal (con guardar) | 📥 Importar y Guardar | Importa + Guarda en BD |
| Normal (sin guardar) | 📥 Importar Rutina | Solo importa al editor |
| Procesando (guardando) | 💾 Guardando... | Guardando en BD |
| Procesando (solo import) | 📥 Importando... | Importando al editor |

### ⚠️ Detección de Servidor

- **Servidor disponible**: Checkbox habilitado, mensaje verde
- **Servidor offline**: Checkbox deshabilitado, mensaje de advertencia con instrucciones

---

## 🎬 Flujo Completo

```
┌─────────────────────────────┐
│  1. Seleccionar archivo JSON │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  2. Validar formato         │
│     ✅ Archivo válido        │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  3. Elegir opciones         │
│  ☑ Guardar en BD (marcado) │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  4. Click "Importar y       │
│     Guardar"                │
└────────────┬────────────────┘
             │
        ┌────┴────┐
        │         │
        ▼         ▼
   ┌────────┐ ┌────────────────────┐
   │ Editor │ │ Base de Datos      │
   │        │ │ (SQLite)           │
   │ ✅     │ │ ✅                 │
   └────────┘ └────────────────────┘
```

---

## 💡 Casos de Uso

### ✅ Caso 1: Importar rutina de un colega

```
Tu colega te envía un archivo "rutina-hipertrofia.json"

1. Abres el ImportModal
2. Seleccionas el archivo
3. Dejas marcado "Guardar en BD" ✓
4. Click "Importar y Guardar"

Resultado:
✅ Rutina en tu editor para editarla
✅ Rutina guardada en tu BD para siempre
✅ Puedes acceder a ella desde el LoadRoutineModal
```

### ✅ Caso 2: Probar una rutina sin guardarla

```
Quieres probar una rutina pero no guardarla aún

1. Abres el ImportModal
2. Seleccionas el archivo
3. DESMARCAS "Guardar en BD" ✗
4. Click "Importar Rutina"

Resultado:
✅ Rutina en tu editor para verla/editarla
❌ NO se guarda en la BD
⚠️  Si cierras el navegador, se pierde
```

### ✅ Caso 3: Migrar rutinas de JSON a BD

```
Tienes muchas rutinas en archivos JSON y quieres pasarlas a la BD

1. Por cada archivo:
   - Abre ImportModal
   - Selecciona archivo
   - Deja marcado "Guardar en BD" ✓
   - Click "Importar y Guardar"
2. Cada rutina se guarda automáticamente
3. Ahora todas están en tu BD local

Resultado:
✅ Todas tus rutinas migradas a SQLite
✅ Acceso rápido desde LoadRoutineModal
✅ Búsqueda y filtros disponibles
```

---

## 🔧 Detalles Técnicos

### Funcionamiento Interno

```javascript
// Cuando importas con "Guardar en BD" marcado:

1. Importar al editor (siempre sucede)
   onImport(validation.data)

2. Si saveToDatabase && serverAvailable:
   const apiData = editorToAPI(validation.data)
   const saved = await saveRoutine(apiData)
   
3. Mostrar notificación
   alert('✅ Rutina guardada en BD')
```

### Transformación de Datos

La rutina pasa por 2 transformaciones:

1. **JSON → Editor**: `importToEditor()`
2. **Editor → API**: `editorToAPI()`

```javascript
JSON del archivo
      ↓
  importToEditor()
      ↓
  Formato Editor
      ↓
  editorToAPI()
      ↓
  Formato API
      ↓
  saveRoutine()
      ↓
  Base de Datos SQLite
```

### Manejo de Errores

El sistema maneja errores gracefully:

```javascript
try {
  // Importar al editor (siempre)
  onImport(data)
  
  // Intentar guardar en BD
  if (saveToDatabase) {
    await saveRoutine(data)
  }
} catch (dbError) {
  // Si falla BD, la rutina YA está en el editor
  alert('⚠️ Rutina en editor, pero error en BD')
}
```

**Ventaja**: Incluso si falla el guardado en BD, la rutina queda en el editor.

---

## 📝 Notificaciones

El sistema muestra diferentes notificaciones:

| Situación | Mensaje |
|-----------|---------|
| Éxito total | ✅ Rutina "[nombre]" importada y guardada en la base de datos |
| Solo editor | (sin mensaje, solo cierra el modal) |
| Error en BD | ⚠️ Rutina importada al editor, pero hubo un error al guardar en la base de datos: [detalles] |
| Error general | ❌ Error al importar: [detalles] |

---

## 🚀 Uso Rápido

### Paso a paso en 30 segundos:

1. **Asegúrate que el servidor esté corriendo**
   ```bash
   npm run dev:all
   ```

2. **En tu aplicación, abre el modal de importar**

3. **Arrastra tu archivo JSON** o selecciónalo

4. **Verifica que el checkbox esté marcado** ☑ Guardar en BD

5. **Click "Importar y Guardar"** 

6. **¡Listo!** Tu rutina está en el editor Y en la base de datos

---

## ❓ FAQ

### ¿Qué pasa si el servidor no está corriendo?

El checkbox se deshabilita automáticamente y muestra:
> ⚠️ Servidor no disponible. Ejecuta `npm run server` para habilitar.

### ¿Puedo importar sin guardar en BD?

Sí, solo desmarca el checkbox "Guardar en base de datos local"

### ¿La rutina se duplica si ya existe?

No, si importas una rutina con el mismo `id`, se actualizará en la BD en lugar de duplicarse.

### ¿Qué pasa si falla el guardado en BD?

- La rutina YA está en el editor (puedes usarla)
- Recibes una alerta con el error
- Puedes intentar guardarla manualmente con el botón "Guardar"

### ¿Puedo deshacer la importación?

No hay "deshacer" automático, pero puedes:
- Eliminar la rutina de la BD (desde LoadRoutineModal)
- Cargar otra rutina en el editor

---

## ✅ Beneficios

### Antes (sin esta feature):
- ❌ Importar JSON → Solo en editor
- ❌ Cerrar navegador → Rutina perdida
- ❌ Tener que guardar manualmente después
- ❌ Fácil olvidar guardar

### Ahora (con esta feature):
- ✅ Importar JSON → Editor + BD automático
- ✅ Cerrar navegador → Rutina guardada
- ✅ Un solo click para importar y guardar
- ✅ Sin riesgo de perder datos

---

## 🎉 Resumen

**La nueva funcionalidad permite**:
- ✅ Importar rutinas desde JSON
- ✅ Guardarlas automáticamente en la BD local
- ✅ Elegir si guardar o solo cargar al editor
- ✅ Ver el estado del servidor en tiempo real
- ✅ Manejar errores gracefully

**Todo esto con un solo checkbox** ☑ y un click en el botón.

¡Disfruta de tu nuevo sistema de importación inteligente! 🚀
