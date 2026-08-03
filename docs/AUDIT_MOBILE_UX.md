# Auditoría de experiencia MOBILE — Editores + Dashboard

> Alcance: editor de **rutinas** y editor de **nutrición** (`/src/pages/RoutineEditor.jsx`, un solo
> componente parametrizado por `?planType=`) y el **panel del entrenador** (`/src/pages/CoachDashboard.jsx`).
> Viewport de referencia: 375 × 812. Usuario objetivo: entrenador personal, no técnico.
> Método: skill `ui-ux-pro-max` v2.11.0 (§1 Accesibilidad, §2 Touch, §5 Layout, §8 Forms, §9 Navegación).

---

## Resumen ejecutivo

El flujo funciona, pero en mobile el entrenador se topa con **tres problemas de fondo**:

1. **Demasiados selectores de modo a la vista.** En el editor hay hasta **3 conmutadores apilados**
   (Editor↔Vista previa, Asistido↔Avanzado, IA↔Manual) antes de ver una sola pregunta.
2. **El flujo se corta después de pegar la respuesta de la IA.** El usuario logra cargar el plan y
   la app le dice "mirala en la vista previa" — pero no le ofrece ningún botón para hacerlo. No hay
   un "paso 3". Es exactamente donde el coach abandona.
3. **Los botones críticos no se pueden tocar bien.** `Button size="sm"` mide **32 px** de alto y es
   el tamaño usado para Guardar, Exportar PDF y el menú ⋮. El mínimo es 44 px (§2 `touch-target-size`).

---

## P0 — Bloqueantes de usabilidad

### P0.1 · No hay "¿y ahora qué?" después de cargar el JSON
**Dónde:** `FitterOnboarding.jsx:296-301`

Al importar con éxito se muestra un texto de 12 px: *"¡Rutina cargada! Mirala en la vista previa."*
No hay botón. La vista previa vive detrás de un toggle en el header, arriba de todo, fuera de la
zona del pulgar. El usuario acaba de completar la parte difícil y la app lo deja sin siguiente paso.

**Patrón esperado (app común):** pantalla de éxito con acciones explícitas — *Ver el plan* /
*Descargar PDF* / *Guardar*. Regla §8 `success-feedback` + §4 `primary-action`.

### P0.2 · Objetivos táctiles de 32 px en las acciones principales
**Dónde:** `ui/Button.jsx:20` (`sm: 'px-3 py-1.5 text-sm h-8'`), consumido en
`RoutineEditor.jsx:235,249,254,260` y en todo `CoachDashboard.jsx`.

Guardar, Exportar PDF, ⋮, Volver, Nuevo atleta, Eliminar: todos 32 px de alto. Además los tres
botones del header son **icon-only en mobile** (`hidden sm:inline` en el label) y están pegados,
sin los 8 px de separación mínimos (§2 `touch-spacing`).

### P0.3 · Vista previa sin estado vacío
**Dónde:** `RoutinePreview.jsx:34-140`, `NutritionPreview.jsx`

Si el coach toca "Vista previa" antes de generar nada ve una tarjeta casi en blanco: *"Plan sin
título"* y *"Índice del plan · 0 semanas"*. Ningún mensaje, ninguna salida. Viola §8 `empty-states`.

### P0.4 · El cuestionario de nutrición tiene 30 pantallas
**Dónde:** `constants/nutritionOnboarding.js`

| Modo | Pasos reales |
|------|--------------|
| Nutrición · detallado | **30** |
| Nutrición · simple | **17** |
| Rutina | 10 |

Una pregunta por pantalla, con animación de 250 ms entre cada una. El indicador dice "Paso 7 de 30"
sin agrupar ni contextualizar. Es el mayor costo de aprendizaje del producto y la causa más probable
de abandono a mitad de camino.

Agravante: `edad`, `peso` y `altura` son `kind: 'text'` → abren **teclado alfabético** para escribir
números (§8 `input-type-keyboard`).

---

## P1 — Claridad y carga cognitiva

### P1.1 · Tres conmutadores de modo apilados
**Dónde:** `RoutineEditor.jsx:289-298` (segmented), `:309-313` (Tabs), `:335-345` (switch IA/manual)

```
[← ] Rutina sin título        [PDF][Guardar][⋮]
[     Editor     |  Vista previa     ]
[   Asistido     |    Avanzado       ]
[ 🤖 Asistente con IA        ( ●—) ]   ← solo en rutinas
```
Cuatro filas de cromo antes del contenido. Además "Asistido/Avanzado" y el switch "IA/Formulario
manual" son **el mismo eje semántico** duplicado: dentro de la pestaña "Asistido" hay un switch que
apaga lo asistido. Viola §5 `content-priority` y §9 `avoid-mixed-patterns`.

### P1.2 · Jerga técnica en el menú ⋮
**Dónde:** `RoutineEditor.jsx:268-280`

"Editor JSON", "Importar JSON", "Exportar JSON" no significan nada para un entrenador personal.
Son 4 ítems de los cuales 3 son para desarrolladores.

### P1.3 · El modal de PDF ofrece una opción rota y nombres sin sentido
**Dónde:** `PDFExportModal.jsx:63-65, 84-89`

- *"Formato Mobile"* con badge rojo **"En desarrollo!"** — se le ofrece al usuario algo que no
  funciona (§9 `empty-nav-state`).
- *"Formato Mobile" / "Formato Desktop"* describe el dispositivo del **generador**, no el uso. El
  coach quiere "para imprimir" o "para mandar por WhatsApp".
- El badge "Recomendado" está fuera del bloque de texto en el markup (`h3` → `span` → `p`), por lo
  que se renderiza suelto entre el título y la descripción.

### P1.4 · Sin barra de acción en la zona del pulgar
Todas las acciones (Guardar, PDF) están en el header. En 812 px de alto con contenido scrolleable,
el coach tiene que subir hasta arriba cada vez. Patrón esperado: **bottom action bar** fija con
safe-area (§5 `safe-area-compliance`, §9 `persistent-nav`).

### P1.5 · `window.confirm` como diálogo de confirmación
**Dónde:** `RoutineEditor.jsx:148`, `CoachDashboard.jsx:64,74,83`

Diálogo nativo del navegador: rompe el tema oscuro, no es traducible y en iOS muestra la URL.
Ya existe `Modal` en `components/ui` — no se está usando.

### P1.6 · No se ve si hay cambios sin guardar
`planEditor.dirty` existe (`useRoutineEditor.js:802`) pero no se muestra en ningún lado. El coach no
sabe si tiene que apretar Guardar.

---

## P2 — Dashboard del entrenador

### P2.1 · Al tocar un atleta "no pasa nada" (mobile)
**Dónde:** `CoachDashboard.jsx:126` — `grid-cols-1 lg:grid-cols-[1fr_1.3fr]`

En mobile la lista y el detalle son dos bloques apilados. Al tocar un atleta el detalle se rellena
**abajo, fuera de pantalla**, sin scroll ni transición. Patrón esperado: navegación
**lista → detalle** con back (§9 `back-behavior`).

### P2.2 · Contadores crípticos
**Dónde:** `CoachDashboard.jsx:159` — `{n} rut · {n} nutri`

### P2.3 · Densidad de la pantalla principal
`SubscriptionSection` arriba + lista + detalle + `FeedbackSection` abajo. En mobile lo primero que
ve el coach al entrar es el estado de su suscripción, no sus atletas.

### P2.4 · Acciones destructivas sin separación
Editar (✏️) y Eliminar (🗑️) están pegados, 32 px, en `CoachDashboard.jsx:184-187`.
Viola §8 `destructive-emphasis` y §9 `destructive-nav-separation`.

---

## Correcciones aplicadas

| # | Cambio | Archivos | Resuelve |
|---|--------|----------|----------|
| 1 | ✅ Tamaños táctiles ≥44 px en mobile (`sm`/`md` suben a 44/48 px, nuevo tamaño `icon`) | `ui/Button.jsx` | P0.2 · global |
| 2 | ✅ Pantalla de éxito con *Ver el plan / Descargar PDF / Guardar en mi cuenta* | `FitterOnboarding.jsx`, `RoutineEditor.jsx` | P0.1 |
| 3 | ✅ Estado vacío compartido en ambas previews + CTA al asistente | `PreviewEmptyState.jsx` (nuevo), ambas previews | P0.3 |
| 4 | ✅ Secciones nombradas en el progreso + `inputMode="numeric"` + "Simple · recomendado" | `FitterOnboarding.jsx`, `*Onboarding.js` | P0.4 |
| 5 | ✅ 3 conmutadores → 1: *Crear con IA* / *Editar a mano* | `RoutineEditor.jsx` | P1.1 |
| 6 | ✅ Bottom action bar contextual con `env(safe-area-inset-bottom)` | `RoutineEditor.jsx` | P1.4 |
| 7 | ✅ Menú ⋮ en lenguaje de entrenador, con lo técnico agrupado bajo "Avanzado" | `RoutineEditor.jsx` | P1.2 |
| 8 | ✅ Modal de PDF nombrado por uso; la opción sólida va primero | `PDFExportModal.jsx` | P1.3 |
| 9 | ✅ Indicador "Sin guardar / Guardado" en el header | `RoutineEditor.jsx` | P1.6 |
| 10 | ✅ Dashboard: navegación lista → detalle con "Volver", contadores en palabras, eliminar separado y en rojo | `CoachDashboard.jsx` | P2.1, P2.2, P2.4 |

### Pendiente (no aplicado)

- **P1.5 · `window.confirm`** — reemplazar por el `Modal` del design system en el editor y en las
  tres confirmaciones de borrado del dashboard.
- **P2.3 · Orden de la pantalla principal** — `SubscriptionSection` sigue arriba de todo. Es una
  decisión de negocio (gate de pago), no la cambié sin confirmarlo.
- **Verificación visual** — el editor y el dashboard están detrás de `ProtectedRoute` + sesión real
  de Supabase, así que no se pudieron recorrer en el navegador. Validado con `vite build` + `eslint`
  limpios y sin errores de consola al cargar la app.

---

_Generado con la skill `ui-ux-pro-max` v2.11.0 · julio 2026_
