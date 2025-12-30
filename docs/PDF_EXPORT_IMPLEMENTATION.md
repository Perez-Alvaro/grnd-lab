# Implementación de Exportación PDF con Dos Formatos

## Resumen de Cambios

Se ha implementado un sistema de exportación de PDF con dos opciones de formato:
- **Formato Mobile**: Diseño moderno tipo tarjetas, optimizado para dispositivos móviles
- **Formato Desktop**: Diseño clásico en tabla (ya existente)

Ambos formatos mantienen la primera página con el índice de semanas.

## Archivos Creados

### 1. `src/components/Editor/PDFExportModal.jsx`
Modal de selección que aparece cuando el usuario presiona "Exportar PDF".

**Características:**
- Diseño moderno con iconos distintivos (Smartphone/Monitor)
- Explicación clara de cada formato
- Animaciones suaves y diseño coherente con el theme
- Botón de cancelar

### 2. `src/services/pdfGeneratorMobile.js`
Generador de PDF en formato Mobile usando jsPDF.

**Características del diseño:**
- **Portada con índice de semanas**: Tarjetas compactas mostrando cada semana
- **Colores**: Fondo blanco con accent color del landing (#5227FF)
- **Ejercicios en tarjetas**: Cada ejercicio se muestra en una tarjeta con:
  - Borde de color izquierdo (accent)
  - Fondo claro (#FAFAFC)
  - Bordes redondeados
  - Información organizada en dos líneas:
    - Línea 1: Series, Reps, Descanso
    - Línea 2: Cadencia, RIR
  - Notas con icono 💡
- **Header de página**: Banda de color accent en la parte superior
- **Tipografía**: Jerarquía clara con tamaños y pesos diferentes

**Funciones exportadas:**
- `generateRoutinePDFMobile(routine, purchaseInfo)`: Genera el blob del PDF
- `downloadRoutinePDFMobile(routine, purchaseInfo)`: Genera y descarga automáticamente

## Archivos Modificados

### 1. `src/hooks/usePDFExport.js`
**Cambios:**
- Agregado parámetro `type` con valor por defecto `'desktop'`
- Lógica condicional para llamar al generador correspondiente:
  - `type === 'mobile'` → `downloadRoutinePDFMobile`
  - por defecto → `generateTrainingPlanPDF` (desktop)

### 2. `src/pages/RoutineEditor.jsx`
**Cambios:**
- **Import agregado**: `PDFExportModal`
- **Estado agregado**: `showPDFExportModal`
- **Handler modificado**: `handleExportPdf` ahora abre el modal en lugar de exportar directamente
- **Handler nuevo**: `handlePDFTypeSelect(type)` maneja la selección del tipo y ejecuta la exportación
- **JSX agregado**: Componente `<PDFExportModal>` con sus props

## Flujo de Usuario

1. Usuario presiona "Exportar PDF"
2. Se abre modal con dos opciones:
   - **Formato Mobile** (tarjetas, moderno)
   - **Formato Desktop** (tabla, clásico)
3. Usuario selecciona el formato deseado
4. Se genera y descarga el PDF en el formato seleccionado

## Compatibilidad

✅ **Funcionalidades preservadas:**
- Toda la funcionalidad de exportación Desktop existente
- Estructura de datos sin cambios
- No se afecta ninguna otra funcionalidad del editor

✅ **Primera página con índice:**
- Desktop: Ya existía, se mantiene
- Mobile: Implementado con diseño tipo tarjetas

## Colores Utilizados (Mobile)

| Elemento | Color | Valor RGB | Hex |
|----------|-------|-----------|-----|
| Accent (principal) | Morado | `82, 39, 255` | `#5227FF` |
| Texto oscuro | Gris oscuro | `45, 45, 55` | `#2D2D37` |
| Texto secundario | Gris medio | `140, 140, 160` | `#8C8CA0` |
| Fondo tarjetas | Blanco suave | `250, 250, 252` | `#FAFAFC` |
| Bordes | Gris claro | `230, 230, 240` | `#E6E6F0` |

## Pruebas Sugeridas

Para probar la implementación:

1. Crear/editar una rutina en el editor
2. Agregar al menos 2 semanas con varios días y ejercicios
3. Presionar "Exportar PDF"
4. Seleccionar "Formato Mobile" y verificar:
   - Primera página con índice de semanas
   - Diseño tipo tarjetas de los ejercicios
   - Colores correctos (blanco + morado)
   - Todos los campos se muestran correctamente
5. Seleccionar "Formato Desktop" y verificar:
   - Funciona como antes
   - Primera página con índice

## Notas Técnicas

- **jsPDF vs @react-pdf/renderer**: 
  - Desktop usa `@react-pdf/renderer` (más complejo, basado en React)
  - Mobile usa `jsPDF` (más simple, basado en canvas)
  - Ambos son independientes y no interfieren entre sí

- **Diseño responsive del PDF Mobile**:
  - Verifica espacio disponible antes de agregar elementos
  - Agrega páginas automáticamente cuando es necesario
  - Ajusta alturas de tarjetas según contenido (con/sin notas)

- **Extensibilidad**:
  - Fácil agregar más formatos en el futuro
  - Solo requiere agregar nueva opción en el modal y nuevo generador
