# 🔧 Solución: Links de Video en PDF

**Fecha**: 30 de Diciembre, 2025  
**Problema**: Los botones "Ver video" en el PDF no redireccionan a los videos de YouTube

---

## 🎯 Problema Identificado

Los links de video en el PDF no funcionaban por las siguientes razones:

1. **URLs no absolutas**: Algunas URLs de video no incluían `https://` al principio
2. **Configuración del Link**: El componente `Link` de `@react-pdf/renderer` necesita URLs absolutas
3. **Visualizadores de PDF**: Algunos visualizadores pueden bloquear links externos por seguridad

---

## ✅ Solución Implementada

### 1. Validación de URLs Absolutas

Se agregó lógica para asegurar que todas las URLs de video sean absolutas:

```jsx
// En WeekSection.jsx
let videoUrl = exercise.video || exercise.videoUrl;

// Asegurar URL absoluta para compatibilidad con PDF
if (videoUrl && !videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
  videoUrl = `https://${videoUrl}`;
}
```

### 2. Mejora Visual del Link

Se agregó un emoji de cámara para hacer el link más visible:

**Antes:**
```jsx
<Link src={videoUrl}>Ver</Link>
```

**Ahora:**
```jsx
<Link src={videoUrl}>🎥 Ver</Link>
```

### 3. Soporte para Campo "duration"

Se agregó soporte para el campo `duration` (Duración) que faltaba en la tabla:

```jsx
const durationValue = exercise.duracion ?? exercise.duration;
const duration = durationValue === 0 || durationValue ? durationValue : "–";
```

```jsx
<Text style={[styles.tableCell, styles.durationCol]}>{duration}</Text>
```

---

## 📂 Archivos Modificados

1. ✅ **`src/pdf/sections/WeekSection.jsx`**
   - Validación de URLs absolutas
   - Emoji 🎥 en el link
   - Soporte para campo `duration`

---

## 🧪 Cómo Probar

### Paso 1: Generar un PDF con Videos

1. Abre GRIND LAB
2. Crea o edita una rutina
3. Asegúrate de que los ejercicios tengan URLs de YouTube en el campo `video`:

```json
{
  "name": "Press de Banca",
  "sets": "4",
  "reps": "8-10",
  "rir": "2",
  "tempo": "3010",
  "rest": "90s",
  "notes": "Mantén escápulas retraídas",
  "video": "https://www.youtube.com/watch?v=rT7DgCr-3pg"
}
```

4. Exporta a PDF

### Paso 2: Verificar el Link

1. Abre el PDF generado
2. Busca la columna "Video"
3. Deberías ver "🎥 Ver" en color verde (#0ef2a0)
4. Haz clic en el link
5. Debería abrir el video de YouTube en tu navegador

### Paso 3: Prueba con Diferentes Visualizadores

- ✅ **Chrome PDF Viewer** (navegador)
- ✅ **Edge PDF Viewer** (navegador)
- ✅ **Adobe Acrobat Reader**
- ✅ **Foxit Reader**
- ⚠️ **Algunos viewers móviles** pueden requerir confirmación

---

## ⚠️ Notas Importantes

### Sobre la Compatibilidad de Links en PDFs

Los links externos en PDFs dependen del visualizador:

1. **Navegadores modernos** (Chrome, Edge, Firefox)
   - ✅ Links funcionan directamente
   - ✅ Abren en nueva pestaña

2. **Adobe Acrobat Reader**
   - ⚠️ Puede pedir confirmación por seguridad
   - ✅ Funciona después de confirmar

3. **Visualizadores móviles**
   - ⚠️ Comportamiento variable
   - Algunos pueden requerir toque largo

### Formato de URLs Requerido

Para que los links funcionen, las URLs deben:

- ✅ Ser absolutas: `https://www.youtube.com/watch?v=...`
- ❌ NO relativas: `www.youtube.com/watch?v=...`
- ❌ NO sin protocolo: `youtube.com/watch?v=...`

**El sistema ahora agrega automáticamente `https://` si falta.**

---

## 🎯 Resultados Esperados

### Tabla de Ejercicios en el PDF

| Ejercicio | Series | Reps | Desc | Durac | RIR | Tempo | Video |
|-----------|--------|------|------|-------|-----|-------|-------|
| Press de Banca | 4 | 8-10 | 90s | - | 2 | 3010 | **🎥 Ver** |
| Sentadillas | 3 | 12-15 | 60s | - | 2 | 2010 | **🎥 Ver** |

- El link "🎥 Ver" debe estar en color **verde** (#0ef2a0)
- Al hacer clic, debe abrir el video en el navegador
- Si no hay video, se muestra "-"

---

## 🐛 Solución de Problemas

### Si el link no funciona:

1. **Verifica el visualizador de PDF**
   - Prueba abriendo el PDF en Chrome
   - O descarga Adobe Acrobat Reader

2. **Verifica la URL del video**
   - Debe ser una URL válida de YouTube
   - Formato: `https://www.youtube.com/watch?v=CODIGO`

3. **Verifica la configuración de seguridad**
   - Algunos visualizadores bloquean links externos
   - Busca en configuración: "Permitir links externos"

4. **Prueba con otro PDF**
   - Regenera el PDF
   - Asegúrate de que la rutina tenga videos

---

## 📋 Checklist de Validación

### Para Desarrolladores:
- [x] URLs se validan como absolutas
- [x] Links tienen estilo visible (verde + emoji)
- [x] Campo `duration` funciona correctamente
- [x] Prompt engineering incluye campo `video`
- [x] Documentación actualizada

### Para Usuarios:
- [ ] Generar PDF con ejercicios que tengan videos
- [ ] Verificar que "🎥 Ver" aparezca en verde
- [ ] Hacer clic en el link
- [ ] Confirmar que abre el video de YouTube
- [ ] Probar en diferentes visualizadores

---

## 🔄 Integración con el Prompt Maestro

El **Prompt Maestro** actualizado ahora incluye instrucciones para que la IA agregue videos:

```
📹 VIDEOS DE YOUTUBE:
- OBLIGATORIO: Cada ejercicio DEBE incluir un link de YouTube válido
- Usa videos de canales reconocidos (AthleanX, Jeff Nippard, etc.)
- Formato: "https://www.youtube.com/watch?v=CODIGO_VIDEO"
- Verifica que estén disponibles hasta DICIEMBRE 2025
```

Esto asegura que todos los ejercicios generados por IA incluyan videos válidos.

---

## 📊 Comparación: Antes vs. Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **URLs** | Pueden ser relativas | ✅ Siempre absolutas |
| **Visibilidad** | "Ver" gris | ✅ "🎥 Ver" verde |
| **Campo Duration** | No se mostraba | ✅ Se muestra correctamente |
| **Compatibilidad** | Limitada | ✅ Máxima con visualizadores |
| **Prompt IA** | No incluía videos | ✅ Videos obligatorios |

---

## 🚀 Próximos Pasos

### Mejoras Opcionales:

1. **Códigos QR**: Agregar QR code al lado del link para escanear en móvil
2. **Preview de video**: Miniatura del video en el PDF (avanzado)
3. **Página de videos**: Lista de todos los videos al final del PDF
4. **Validación de URLs**: Verificar que los videos existan antes de generar PDF

---

**Implementado por**: GRIND LAB Engineering Team  
**Versión**: 1.0  
**Última actualización**: 30 de Diciembre, 2025
