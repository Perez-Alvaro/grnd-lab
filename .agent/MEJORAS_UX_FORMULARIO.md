# 📋 Mejora UX: Textos Explicativos del Formulario

## 🎯 Objetivo Cumplido

Se rediseñaron completamente los textos explicativos (helper text / preview) de cada campo del formulario de creación de rutinas (`PlanMetadataForm.jsx`), para que el usuario entienda con claridad **qué debe escribir**, **por qué es importante** ese campo y **cómo impacta en el Prompt Maestro**.

---

## ✅ Implementación Realizada

### **Componente Helper Text Creado**

Se creó un componente reutilizable que muestra textos explicativos con:
- ✅ Ícono `Info` de lucide-react
- ✅ Estilo consistente (texto gris, tamaño xs, espaciado adecuado)
- ✅ Diseño responsive que se integra perfectamente con el formulario

```jsx
const HelperText = ({ children }) => (
  <div className="mt-1.5 flex items-start gap-2 text-xs text-gray-400">
    <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-accent/70" />
    <p className="leading-relaxed">{children}</p>
  </div>
);
```

---

## 📝 Textos por Campo

### 1️⃣ **Nombre de la plantilla**

**Placeholder:**
```
Ej: "Masculino Volumen FST-7 · 4 días por semana"
```

**Helper Text:**
```
Es el nombre con el que el cliente reconocerá este plan. Debe describir claramente el objetivo, 
el estilo de entrenamiento y la frecuencia. Este nombre se usa como identidad principal del plan 
en el sistema.
```

**Función en el Prompt Maestro:**
- Define el nombre visible del plan y su identidad principal
- Se usa como título y referencia en todo el sistema

---

### 2️⃣ **Descripción breve**

**Placeholder:**
```
Ej: "Plan enfocado en ganar masa muscular combinando fuerza y técnicas FST-7, 
ideal para intermedios y avanzados"
```

**Helper Text:**
```
Breve resumen del plan que verá el cliente antes de comprar o iniciar. Explicá qué va a lograr 
y cómo se entrena. Esta descripción se utiliza para contextualizar el enfoque general en el 
Prompt Maestro.
```

**Función en el Prompt Maestro:**
- Resume el enfoque general del plan
- Se usa para explicar la rutina al cliente
- Contextualiza el enfoque para la IA generadora

---

### 3️⃣ **Género**

**Opciones:**
```
Masculino / Femenino
```

**Helper Text:**
```
Define el enfoque general del plan según características fisiológicas y preferencias de 
entrenamiento. Ajusta la selección de ejercicios, volumen y enfoque metabólico.
```

**Función en el Prompt Maestro:**
- Ajusta selección de ejercicios
- Modifica volumen y enfoque fisiológico
- Personaliza el enfoque metabólico

---

### 4️⃣ **Frecuencia (días/semana)**

**Opciones:**
```
2, 3, 4, 5 días/semana
```

**Helper Text:**
```
Cantidad de días que el cliente entrenará por semana. Define cómo se reparten los grupos 
musculares: 3 días → Full body o torso/pierna · 5 días → División por grupos musculares.
```

**Función en el Prompt Maestro:**
- Determina la cantidad de días de entrenamiento
- Define la distribución semanal
- Estructura la división de grupos musculares

---

### 5️⃣ **Objetivo**

**Opciones:**
```
Volumen (fuerza e hipertrofia)
Pérdida de grasa / recomposición
Funcional
...etc
```

**Helper Text:**
```
Objetivo principal del plan. Es uno de los pilares del algoritmo de generación: define tipo de 
estímulo, volumen, descansos y progresión.
```

**Función en el Prompt Maestro:**
- Pilar fundamental del algoritmo de generación
- Define tipo de estímulo muscular
- Determina volumen, descansos y progresión

---

### 6️⃣ **Duración (semanas)**

**Opciones:**
```
1, 2, 3, 4, 6, 8, 12 semanas
```

**Helper Text:**
```
Cantidad total de semanas que dura el plan. Se usa para estructurar mesociclos y progresiones: 
4 semanas → bloque corto · 8–12 semanas → mesociclo completo.
```

**Función en el Prompt Maestro:**
- Define el largo del mesociclo
- Estructura progresiones temporales
- Planifica bloques de entrenamiento

---

### 7️⃣ **Autor / Coach**

**Placeholder:**
```
Ej: "Nick Bare" o "Coach MZ"
```

**Helper Text:**
```
Nombre del entrenador o referente del plan. Aparece en la presentación al cliente y se utiliza 
como referencia de estilo y branding en el prompt.
```

**Función en el Prompt Maestro:**
- Se utiliza como referencia de estilo
- Aparece en branding del plan
- Define la presentación al cliente

---

### 8️⃣ **Nivel**

**Opciones:**
```
Principiante
Intermedio
Avanzado
Todos los niveles
```

**Helper Text:**
```
Nivel del plan según la experiencia del cliente. Ajusta complejidad, volumen y selección de 
ejercicios: Principiante → ejercicios básicos · Avanzado → técnicas intensivas (FST-7, superseries).
```

**Función en el Prompt Maestro:**
- Ajusta complejidad de ejercicios
- Modifica volumen de entrenamiento
- Selecciona ejercicios adecuados al nivel

---

### 9️⃣ **Tags**

**Placeholder:**
```
Ej: "hipertrofia, fuerza, funcional, fst-7, superseries"
```

**Helper Text:**
```
Palabras clave que describen el estilo del plan. Se usan para búsqueda y categorización. 
Podés incluir técnicas, metodologías o enfoques específicos.
```

**Función en el Prompt Maestro:**
- Ayudan a clasificar rutinas
- Facilitan búsqueda y filtrado
- Describen técnicas y metodologías

---

### 🔟 **Notas e instrucciones**

**Placeholder:**
```
Ej: "Rutina estilo Hany Rambod con foco en congestión y control del tempo. 
Incluir variaciones unilaterales para corrección de asimetrías"
```

**Helper Text:**
```
Instrucciones especiales para el sistema o el cliente. Acá podés aclarar el estilo, técnicas 
específicas, recomendaciones clave o cualquier detalle que personalice la generación de la rutina.
```

**Función en el Prompt Maestro:**
- Aporta contexto cualitativo
- Personaliza la rutina
- Define estilo y técnicas especiales

---

## 🎨 Características del Diseño

### **Estilo Visual**
- ✅ Ícono `Info` sutil con color accent (`text-accent/70`)
- ✅ Texto gris suave (`text-gray-400`) para no competir con inputs
- ✅ Tamaño pequeño (`text-xs`) pero legible
- ✅ Espaciado consistente (`mt-1.5`, `gap-2`)
- ✅ Líneas relajadas (`leading-relaxed`)

### **UX Writing**
- ✅ Lenguaje claro, cercano y profesional
- ✅ Explicaciones breves pero significativas (2-3 líneas)
- ✅ Ejemplos concretos entre comillas
- ✅ Tono de coach experto, no técnico
- ✅ Palabras clave resaltadas con `<strong>`

### **Función Educativa**
Cada helper text responde a:
1. **¿Qué escribir?** → Descripción clara del contenido esperado
2. **¿Por qué es importante?** → Impacto en el plan y el cliente
3. **¿Cómo funciona?** → Relación con el Prompt Maestro
4. **¿Ejemplos?** → Casos concretos y reales

---

## 📊 Resultados Esperados

### **Para el Usuario**
✅ **Educación progresiva** mientras completa el formulario  
✅ **Reducción de errores** por falta de comprensión  
✅ **Mayor confianza** al entender el impacto de cada campo  
✅ **Inputs de calidad superior** con ejemplos claros  

### **Para el Sistema**
✅ **Prompts Maestro más ricos** con información detallada  
✅ **Rutinas mejor estructuradas** gracias a inputs claros  
✅ **Menos casos de "no sé qué poner"**  
✅ **Mejor calidad de datos** para la generación con IA  

### **UX General**
✅ Formulario que **educa como un coach profesional**  
✅ Usuario entiende **para qué sirve cada campo**  
✅ Experiencia **guiada y profesional**  
✅ **Reduce fricción** en el proceso de creación  

---

## 🔧 Implementación Técnica

**Cambios realizados:**
1. ✅ Agregado componente `HelperText` reutilizable
2. ✅ Importado ícono `Info` de lucide-react
3. ✅ Actualizado cada campo con helper text correspondiente
4. ✅ Mejorados todos los placeholders con ejemplos concretos
5. ✅ Mantenida estructura y lógica del formulario original
6. ✅ Sin cambios en validaciones ni comportamiento

**Sin modificaciones:**
- ❌ Labels de campos
- ❌ Inputs ni estructura del formulario
- ❌ Validaciones
- ❌ Lógica de negocio
- ❌ Layout responsive

---

## 💡 Principios de UX Writing Aplicados

1. **Claridad sobre brevedad**: Texto suficiente para educar, no solo cubrir espacio
2. **Ejemplos > Teoría**: Casos concretos en lugar de explicaciones abstractas
3. **Contexto funcional**: Explicar QUÉ hace el sistema con el dato
4. **Tono coach experto**: Profesional pero cercano y motivador
5. **Jerarquía visual**: Strong en conceptos clave, símbolos como separadores (→, ·)

---

## 🎯 Conclusión

Este formulario ahora cumple una **doble función**:

1. **Recolectar datos** para el sistema
2. **Educar al usuario** sobre cómo crear planes efectivos

El resultado es una experiencia que **reduce fricción**, **mejora la calidad del input** y hace que el usuario se sienta **guiado por un coach profesional** en todo momento.

---

**Archivo modificado:**
- `src/components/Trainer/editor/PlanMetadataForm.jsx`

**Total de cambios:**
- 9 campos actualizados con helper texts
- 9 placeholders mejorados con ejemplos
- 1 componente nuevo (`HelperText`)
- 1 ícono nuevo importado (`Info`)

**Líneas agregadas:** ~45 líneas de helper texts educativos
**Impacto en UX:** ⭐⭐⭐⭐⭐ ALTO
