# 🚀 Sistema de Generación de Rutinas con Prompt Manual

## ✨ Nueva Funcionalidad: Workflow Copy/Paste (SIN COSTOS)

Ahora puedes generar rutinas profesionales usando **cualquier IA GRATUITA** (ChatGPT, Claude, Gemini, etc.) sin necesidad de API keys nin costos.

---

## 📋 Cómo Funciona (3 Pasos Simples)

### Paso 1: Copiar el Prompt Maestro
1. Ve al **Editor de Rutinas** (`/admin/plantillas/nueva/editar`)
2. Llena los campos del formulario:
   - Género, Objetivo, Nivel, Frecuencia, etc.
   - **Mientras más completo, mejor será la rutina**
3. Click en el botón **"Copiar Prompt para IA"** 📋
4. El prompt se copia automáticamente a tu portapapeles

### Paso 2: Generar con tu IA Favorita
1. Abre **ChatGPT**, **Claude**, **Gemini** o cualquier IA
2. **Pega el prompt** (Ctrl+V)
3. **Envía el mensaje**
4. La IA te responderá con un JSON completo
5. **Copia TODO el JSON** que te devuelve (desde `{` hasta `}`)

### Paso 3: Importar a la App
1. Vuelve al Editor de Rutinas
2. Click en **"Editor JSON"** (botón en la barra superior)
3. **Pega el JSON** en el panel izquierdo
4. **¡MAGIA!** 🎉 La vista previa se actualiza en tiempo real
5. Si algo no te gusta, **edita el JSON** directamente
6. Click en **"Guardar"** cuando estés conforme

---

## 🎯 Ventajas de Este Sistema

### ✅ Gratis Absoluto
- Usa versiones gratuitas de cualquier IA
- Sin API keys, sin costos, sin límites

### ✅ Editor Split-View
- **Izquierda**: Editor de JSON (editable en vivo)
- **Derecha**: Vista previa visual (se actualiza automáticamente)
- Como **Markmap** pero para rutinas

### ✅ Máxima Flexibilidad
- Si la IA se equivoca, corriges en el JSON
- Ves los cambios al instante
- Total control sobre cada campo

### ✅ Portabilidad
- Guarda los JSON en notas
- Compártelos con otros entrenadores
- Impórtalos cuando quieras

---

## 💡 Ejemplo Práctico

### 1. Formulario Inicial
```
Nombre: Rutina Hipertrofia
Género: Masculino
Objetivo: Volumen muscular
Frecuencia: 4 días/semana
Duración: 8 semanas
Nivel: Intermedio
Tags: FST-7, drop sets, superseries
Notas: Énfasis en brazos
```

### 2. Click "Copiar Prompt para IA"
Se copia un prompt completo con:
- Instrucciones para la IA
- Todos tus datos
- Esquema JSON de referencia
- Reglas específicas según objetivo/nivel

### 3. Pegar en ChatGPT/Claude
```
TÚ: [Pegas el prompt]

IA: {
  "name": "Rutina Hipertrofia Intermedia FST-7",
  "description": "Programa de 8 semanas con énfasis en técnicas avanzadas",
  "weeks": [
    {
      "name": "Semana 1",
      "days": [
        {
          "name": "Día 1 - Push (Pecho, Hombros, Tríceps)",
          "type": "training",
          "exercises": [
            {
              "name": "Press de Banca con Barra",
              "sets": "4",
              "reps": "8-10",
              "rir": "2",
              "tempo": "3010",
              "rest": "90s",
              "notes": "Controla la fase excéntrica 3 segundos"
            },
            ...
          ]
        }
      ]
    }
  ]
}
```

### 4. Copiar y Pegar en Editor JSON
1. Copia TODO el JSON (desde `{` hasta `}`)
2. Click "Editor JSON"
3. Pega en el panel izquierdo
4. ¡La vista previa se actualiza instantáneamente!

### 5. Editar si es Necesario
Si la IA puso 10 reps y quieres 12:
```json
"reps": "10-12",  ← Cambias esto
```
Y ves el cambio en la vista previa al instante.

---

## 🔧 Funcionalidades del Editor JSON

### Validación en Tiempo Real
- ✅ Icono verde = JSON válido
- ⚠️ Icono amarillo = Error de sintaxis
- Muestra el mensaje de error pero **no bloquea** la app

### Números de Línea
- Facilita encontrar errores
- Referencia rápida al editar

### Formateo Automático
- El JSON se muestra con indentación
- Fácil de leer y editar

### Sincronización Instantánea
- Cualquier cambio en el JSON actualiza la vista previa
- Sin demoras, sin recargas

---

## 📌 Tips y Mejores Prácticas

### Para el Prompt
1. **Llena TODOS los campos** del formulario antes de copiar el prompt
2. **Sé específico en las notas**: "Lesión en hombro derecho" > "Adaptado"
3. **Usa tags claros**: "FST-7, drop sets" > "avanzado"

### Para la IA
1. **Usa Claude** si quieres más detalle (gratis en claude.ai)
2. **Usa ChatGPT** si quieres más variedad (gratis en chat.openai.com)
3. **Si el JSON tiene errores**, simplemente pide que lo corrija:
   - "El JSON tiene un error de sintaxis, corrigelo"

### Para Editar
1. **Valida antes de guardar**: Verifica el ícono verde
2. **Usa el modo Visual** para ver el resultado final
3. **Guarda versiones**: Exporta JSON antes de cambios grandes

---

## ⚙️ Estructura del JSON (Referencia)

```json
{
  "name": "Nombre de la rutina",
  "description": "Descripción breve",
  "metadata": {
    "author": "Tu nombre",
    "gender": "Masculino/Femenino",
    "objective": "Volumen muscular",
    "level": "Intermedio",
    "frequency": "4",
    "durationWeeks": "8",
    "tags": "FST-7, drop sets"
  },
  "weeks": [
    {
      "name": "Semana 1",
      "days": [
        {
          "name": "Día 1 - Grupo muscular",
          "type": "training",
          "exercises": [
            {
              "name": "Nombre del ejercicio",
              "sets": "4",
              "reps": "8-12",
              "rir": "2",           // 0=fallo, 3=fácil
              "tempo": "3010",      // 3s bajar, 0s pausa, 1s subir, 0s arriba
              "rest": "90s",
              "notes": "Consejo técnico"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🎨 IAs Recomendadas (Todas Gratis)

### ChatGPT (chat.openai.com)
- ✅ Gratis con GPT-3.5
- ✅ Muy bueno para rutinas
- ✅ Respuestas rápidas

### Claude (claude.ai)
- ✅ Gratis
- ✅ Excelente para prompts largos
- ✅ MUY detallado

### Google Gemini (gemini.google.com)
- ✅ Gratis
- ✅ Integrado con Google
- ✅ Buen balance

### Perplexity (perplexity.ai)
- ✅ Gratis
- ✅ Puede buscar información adicional
- ✅ Útil para ejercicios específicos

---

## ❓ Preguntas Frecuentes

### ¿Puedo seguir usando el botón "Generar con IA"?
Sí, pero requiere API key de OpenAI y tiene costo. El método del prompt es gratis.

### ¿Qué pasa si el JSON tiene errores?
El editor te muestra el error pero no bloquea. Simplemente vuelve a pedirle a la IA que lo corrija.

### ¿Puedo editar manualmente el JSON?
¡SÍ! Ese es el propósito. Edit y ve los cambios en tiempo real.

### ¿Se guardan mis JSON?
Al hacer click en "Guardar", la rutina se guarda localmente. También puedes "Exportar JSON" para tener un backup.

### ¿Funciona offline?
Una vez que tengas el JSON de la IA, sí. El editor funciona 100% local.

---

## 🎉 ¡Empieza Ahora!

1. Abre el **Editor de Rutinas**
2. Llena el formulario
3. Click **"Copiar Prompt para IA"**
4. Pega en ChatGPT/Claude
5. Copia el JSON
6. Click **"Editor JSON"**
7. Pega y ve la magia ✨

**¡Cero costos, infinitas posibilidades!** 🚀
