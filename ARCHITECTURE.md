# 🏗️ GRIND-LAB - Arquitectura y Decisiones Técnicas

## 📐 Principios de Diseño

**Filosofía:** "Software funcionando sobre documentación exhaustiva" (Manifiesto Ágil)

### Core Principles:
1. **Client-Side Only** - Sin backend, sin API, sin autenticación
2. **AI como Cerebro Externo** - Prompt engineering sobre integración directa
3. **JSON como Fuente de Verdad** - Editable, portable, versionable
4. **Exportación Universal** - PDF profesional + JSON reutilizable

---

## 🗂️ Estructura del Proyecto

```
grnd-lab/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                # Landing page (696 líneas - monolítico por diseño)
│   │   └── RoutineEditor.jsx       # Editor principal con estado
│   │
│   ├── components/
│   │   ├── Editor/                 # JSON Editor + Preview
│   │   │   ├── JSONEditor.jsx      # Monaco-style editor con syntax highlighting
│   │   │   ├── ImportModal.jsx     # Importar JSON desde IA
│   │   │   ├── ExportModal.jsx     # Exportar JSON
│   │   │   └── PDFExportModal.jsx  # Selector Desktop/Mobile PDF
│   │   │
│   │   ├── Trainer/                # Forms + Preview
│   │   │   ├── editor/             # Metadata form, Week/Day/Exercise editors
│   │   │   └── preview/            # Vista previa en tiempo real
│   │   │
│   │   ├── Tutorial/               # Onboarding interactivo
│   │   │   ├── TutorialOverlay.jsx # Sistema de tooltips guiados
│   │   │   └── Snackbar.jsx        # Notificaciones
│   │   │
│   │   ├── Shared/                 # Componentes compartidos
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Toast.jsx           # Sistema de notificaciones
│   │   │
│   │   └── ui/                     # Design System (única fuente de verdad)
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Select.jsx
│   │       ├── Textarea.jsx
│   │       ├── Badge.jsx
│   │       ├── Tooltip.jsx
│   │       ├── Tabs.jsx
│   │       └── DotGrid.jsx         # Background interactivo (GSAP)
│   │
│   ├── hooks/
│   │   ├── useRoutineEditor.js     # Estado central del editor (22KB)
│   │   └── usePDFExport.js         # Maneja exportación Desktop/Mobile
│   │
│   ├── services/
│   │   ├── pdfGenerator.js         # Desktop PDF (jsPDF) - LEGACY, mantener
│   │   └── pdfGeneratorMobile.js   # Mobile PDF (jsPDF) - EN DESARROLLO
│   │
│   ├── pdf/                        # PDF Desktop (@react-pdf/renderer)
│   │   ├── PlanRenderer.jsx        # Generador principal
│   │   ├── sections/
│   │   │   ├── CoverPage.jsx
│   │   │   ├── WeekSection.jsx
│   │   │   └── ProgressPage.jsx
│   │   └── utils/
│   │       ├── pdfStyles.js        # Styles para @react-pdf
│   │       ├── pdfLayout.js
│   │       ├── pdfAnchors.js
│   │       └── imageUtils.js
│   │
│   ├── lib/
│   │   ├── schemas/
│   │   │   └── routineSchema.js    # Validación JSON Schema
│   │   └── transformers/
│   │       └── routineTransformer.js # Conversiones formato editor ↔ export
│   │
│   ├── utils/
│   │   ├── promptGenerator.js      # Prompt Maestro (~250 líneas de instrucciones)
│   │   ├── blockDetector.js        # Detecta bloques warmup/main/cooldown (usado en PDF mobile)
│   │   ├── toast.js                # Helpers de notificaciones
│   │   └── cn.js                   # Utility para className (tailwind-merge)
│   │
│   ├── context/
│   │   └── ToastContext.jsx        # Context de notificaciones globales
│   │
│   └── styles/
│       ├── index.css               # Estilos globales + Tailwind
│       ├── theme.css               # CSS variables (Dark Mode)
│       └── theme.js                # Constantes de tema
│
├── docs/                           # Documentación técnica consolidada
├── public/                         # Assets estáticos
└── README.md                       # Documentación principal
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores (Dark Mode)
```css
/* Base */
--primary-bg: #0E0E0E          /* Fondo principal */
--primary-surface: #1A1A1A     /* Superficies elevadas */
--surface-alt: #222222         /* Variante de superficie */

/* Accent (Lime) */
--accent: #cbff00              /* Verde lima principal */
--accent-strong: #d6ff33       /* Hover states */

/* Text */
--text-primary: #FFFFFF        /* Blanco puro */
--text-secondary: #C9C9C9      /* Gris claro */
--text-tertiary: #8E8E8E       /* Gris medio */
--text-quaternary: #5C5C5C     /* Gris oscuro */

/* Borders */
--border: #2E2E2E              /* Bordes sutiles */
```

### Tipografía
- **Display:** 'Space Grotesk' (Headlines, títulos)
- **Body:** 'Inter' (UI, texto general)
- **Mono:** 'JetBrains Mono' (JSON editor, código)

### Inspiración
- Apple Developer Tools (claridad técnica)
- Notion (editor split-view)
- Linear (diseño minimalista)
- Raycast (comandos + shortcuts)

---

## 🔧 Stack Tecnológico

### Frontend Core
- **React 18.3** - UI library
- **React Router 7.7** - Navegación SPA
- **Vite 5.4** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Utility-first styling

### Librerías Principales
- **@react-pdf/renderer 4.3** - Generación PDF Desktop (React components → PDF)
- **jsPDF 3.0** - Generación PDF Mobile (Canvas-based, mayor control)
- **framer-motion 12.23** - Animaciones (Toast, modals)
- **gsap 3.14** - Animaciones avanzadas (DotGrid background)
- **lucide-react 0.344** - Icon system

### Razón de Doble PDF Engine:
1. **@react-pdf/renderer** (Desktop):
   - Declarativo (JSX → PDF)
   - Ideal para layouts estructurados (tablas, texto)
   - Usado en exportación Desktop (activa)

2. **jsPDF** (Mobile):
   - Imperativo (Canvas API)
   - Mayor control de posicionamiento pixel-perfect
   - Usado en exportación Mobile (en desarrollo, deshabilitada en UI)

---

## 🧩 Flujo de Datos Principal

```
┌─────────────────────────────────────────────────────────┐
│  1. Usuario completa formulario metadata               │
│     (Objetivo, Nivel, Frecuencia, Técnicas)             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  2. promptGenerator.js genera "Prompt Maestro"          │
│     - ~250 líneas de instrucciones                      │
│     - Incluye schema JSON + reglas según objetivo       │
│     - Se copia al clipboard                             │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  3. Usuario pega en ChatGPT/Claude/Gemini (GRATIS)      │
│     - IA procesa prompt                                 │
│     - Devuelve JSON estructurado                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  4. Usuario pega JSON en JSONEditor.jsx                 │
│     - Validación en tiempo real (routineSchema.js)      │
│     - Preview instantáneo (debounce 500ms)              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  5. useRoutineEditor.js mantiene estado                 │
│     - CRUD de semanas/días/ejercicios                   │
│     - Transformaciones con routineTransformer.js        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  6. Exportación                                         │
│     - JSON: descarga directa (File System API)          │
│     - PDF Desktop: @react-pdf/renderer                  │
│     - PDF Mobile: jsPDF (futuro)                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Persistencia

**Estrategia:** Ninguna (por diseño)

- ❌ Sin localStorage
- ❌ Sin sessionStorage
- ❌ Sin IndexedDB
- ❌ Sin backend

**Razón:** Privacidad máxima. Los datos solo existen en memoria durante la sesión.
El usuario exporta JSON o PDF y gestiona sus archivos localmente.

---

## 🎯 Decisiones Técnicas Clave

### 1. ¿Por qué NO hay backend?
- **Costo $0** - Sin servidor, sin APIs pagas
- **Privacidad** - Datos nunca salen del navegador
- **Simplicidad** - Deploy estático (Vercel, Netlify, GitHub Pages)
- **Portabilidad** - Fork y usa inmediatamente

### 2. ¿Por qué Prompt Engineering en vez de API directa?
- **Flexibilidad** - Cambias de IA cuando quieras (ChatGPT → Claude → Gemini)
- **Costo** - Usas versiones gratuitas
- **Control** - Editas el JSON antes de exportar
- **Educación** - Usuarios aprenden a estructurar prompts

### 3. ¿Por qué JSON editable?
- **Portabilidad** - Importa en cualquier sistema
- **Versionado** - Git-friendly
- **Debugging** - Ves exactamente qué genera la IA
- **Power Users** - Edición manual avanzada

### 4. ¿Por qué Tailwind en vez de CSS-in-JS?
- **Performance** - Purge CSS elimina clases no usadas
- **DX** - Utility-first es más rápido que escribir CSS custom
- **Consistencia** - Design tokens en config fácil de mantener

---

## 📊 Performance Targets

| Métrica | Target | Actual |
|---------|--------|--------|
| **First Contentful Paint** | < 1.5s | ✅ |
| **Time to Interactive** | < 3s | ✅ |
| **Bundle Size (gzipped)** | < 200KB | ✅ |
| **Lighthouse Score** | > 90 | ✅ |

### Optimizaciones Aplicadas:
1. **Code Splitting** - Lazy load de editor con React.lazy()
2. **Debouncing** - Preview JSON con debounce de 500ms
3. **Memoization** - useMemo/useCallback en componentes pesados
4. **Tree Shaking** - Vite elimina dead code automáticamente

---

## 🚀 Build & Deploy

### Desarrollo
```bash
npm run dev      # Vite dev server (http://localhost:5173)
```

### Producción
```bash
npm run build    # Genera dist/ optimizado
npm run preview  # Preview del build
```

### Deploy Recomendado
- **Vercel** - Deploy automático desde main branch
- **Netlify** - Alternativa con edge functions si se necesita
- **GitHub Pages** - Para proyectos open source

**Build Output:**
- HTML/CSS/JS estático
- Sin server-side rendering
- Compatible con CDN

---

## 🔐 Seguridad

### XSS Prevention:
- ✅ React escapa todo por defecto
- ✅ NO usa `dangerouslySetInnerHTML`
- ✅ Validación de JSON con schema antes de renderizar

### Data Privacy:
- ✅ Sin tracking
- ✅ Sin analytics (opcional agregar)
- ✅ Sin cookies

---

## 🧪 Testing Strategy (Futuro)

**No implementado aún, pero recomendado:**

```
tests/
├── unit/
│   ├── promptGenerator.test.js
│   ├── routineTransformer.test.js
│   └── routineSchema.test.js
│
├── integration/
│   └── editor-flow.test.jsx
│
└── e2e/
    └── full-workflow.spec.js
```

**Stack sugerido:**
- Vitest (unit/integration)
- Playwright (e2e)

---

## 📝 Mantenimiento

### Código a revisar periódicamente:
1. **`promptGenerator.js`** - Actualizar según nuevos modelos de IA
2. **`routineSchema.js`** - Extender schema si se agregan features
3. **Tailwind config** - Mantener design tokens actualizados

### Deuda técnica conocida:
1. **Home.jsx** - 696 líneas monolíticas (funcional, pero dificulta testing)
2. **useRoutineEditor.js** - 22KB, podría split en hooks más pequeños
3. **Tests** - Coverage 0% (agregar Vitest)

---

## 🔮 Roadmap Técnico

### Próximas implementaciones:
1. ✅ **PDF Mobile** - Activar formato mobile (actualmente deshabilitado)
2. 🔜 **Templates Predefinidos** - Biblioteca de rutinas comunes
3. 🔜 **Keyboard Shortcuts** - Navegación tipo Raycast
4. 🔜 **Dark/Light Mode Toggle** - Actualmente solo dark
5. 🔜 **Export a otros formatos** - Excel, Notion, Google Sheets

---

## 📚 Referencias

- [Documentación completa](./docs/)
- [Prompt Engineering Guide](./PROMPT_MAESTRO_EXAMPLE.md)
- [GitHub Repository](https://github.com/Perez-Alvaro/grnd-lab)

---

**Última actualización:** 2025-12-30
**Versión:** 1.0.0
**Mantenedor:** [@Perez-Alvaro](https://github.com/Perez-Alvaro)
