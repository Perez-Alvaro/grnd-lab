# 🏋️ BaseRutina

**Generá la base de tus rutinas de entrenamiento profesionales usando IA**

---

## 🎯 ¿Qué es BaseRutina?

BaseRutina es una aplicación web **completamente client-side** que te permite generar la base de rutinas de entrenamiento personalizadas usando cualquier IA gratuita (ChatGPT, Claude, Gemini).

### ✨ Características principales:

- ✅ **100% Gratis** - Sin costos de API, sin suscripciones
- ✅ **Sin backend** - Todo funciona en tu navegador
- ✅ **Editor en tiempo real** - Split-view con JSON y vista previa
- ✅ **Exportación local** - PDF profesional o JSON para reutilizar
- ✅ **Prompts inteligentes** - Adaptados al objetivo, nivel y técnicas
- ✅ **Sin límites** - Genera rutinas ilimitadas

---

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/grnd-lab.git

# Instalar dependencias
cd grnd-lab
npm install

# Iniciar en desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 📖 Cómo usar

### 1️⃣ Genera el Prompt Maestro
1. Completa el formulario con los datos de la rutina
2. Click en **"Copiar Prompt para IA"**
3. El prompt se copia automáticamente

### 2️⃣ Usa tu IA favorita
1. Abre ChatGPT, Claude o Gemini (versión gratis)
2. Pega el prompt
3. Copia el JSON que te devuelve

### 3️⃣ Importa y Edita
1. Click en **"Editor JSON"**
2. Pega el JSON de la IA
3. Edita en tiempo real si necesitas
4. Click en **"Exportar PDF"** o **"Exportar JSON"**

---

## 🏗️ Arquitectura

### Client-Side Only
```
┌─────────────────────────────────────┐
│         BaseRutina (Browser)          │
├─────────────────────────────────────┤
│  • Hero/Landing Page                │
│  • Editor de Rutinas                │
│  • Generador de Prompts             │
│  • Editor JSON (Split-View)         │
│  • Exportación PDF/JSON local       │
└─────────────────────────────────────┘
```

**NO tiene:**
- ❌ Backend/API
- ❌ Base de datos
- ❌ Autenticación
- ❌ Persistencia en servidor

**TODO es local:**
- ✅ Almacenamiento en memoria (mientras editas)
- ✅ Exportación a archivos locales
- ✅ Sin dependencias externas

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - UI library
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Vite** - Build tool

### Librerías
- **@react-pdf/renderer** - Generación de PDFs
- **Lucide React** - Iconos
- **File Saver** - Descarga de archivos

---

## 📂 Estructura del Proyecto

```
grnd-lab/
├── src/
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   └── RoutineEditor.jsx       # Editor principal
│   ├── components/
│   │   ├── Editor/                 # JSON Editor + Preview
│   │   └── Trainer/                # Formularios + Visualización
│   ├── hooks/
│   │   ├── useRoutineEditor.js     # Lógica del editor
│   │   └── usePDFExport.js         # Generación de PDF
│   ├── utils/
│   │   ├── promptGenerator.js      # Generador de Prompt Maestro
│   │   └── routineTransformer.js   # Transformaciones JSON
│   └── context/
│       └── PlanContext.jsx         # Estado global
├── public/                          # Assets estáticos
├── docs/                            # Documentación adicional
└── tailwind.config.js               # Tema (Dark Mode + Lime accent)
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores (Dark Mode)

```css
/* Base */
--primary-bg: #222222          /* Fondo principal */
--primary-surface: #2A2A2A     /* Superficies elevadas */

/* Accent (Lime) */
--accent: #cbff00              /* Principal */
--accent-light: #d6ff33        /* Hover */

/* Text */
--text-primary: #FFFFFF        /* Blanco puro */
--text-secondary: #C9C9C9      /* Gris claro */
--text-muted: #787878          /* Gris medio */
```

### Tipografía

```css
Display: 'Space Grotesk' (Headlines)
Body:    'Inter' (UI, textos)
Code:    'JetBrains Mono' (JSON)
```

Inspiración: **Apple Developer Tools**, **Notion**, **Linear**

---

## 🤝 Contribuir

¡Contribuciones bienvenidas!

1. Fork el repositorio
2. Crea branch (`git checkout -b feature/MiFeature`)
3. Commit (`git commit -m 'Add: Mi feature'`)
4. Push (`git push origin feature/MiFeature`)
5. Abre Pull Request

### Guidelines
- **Código**: Seguir estilo existente (React + Tailwind)
- **Commits**: Usar [Conventional Commits](https://www.conventionalcommits.org/)
- **Tests**: Agregar tests si aplica
- **Docs**: Actualizar README si cambias funcionalidad

---

## 📄 Licencia

MIT License — Ver [LICENSE](LICENSE) para detalles.

---

## 👤 Autor

**Álvaro Pérez**
- GitHub: [@Perez-Alvaro](https://github.com/Perez-Alvaro)
- LinkedIn: [Álvaro Pérez](https://linkedin.com/in/perez-alvaro)

---

## 🙏 Agradecimientos

- Inspirado en herramientas como **Notion**, **Linear**, **Raycast**
- Para entrenadores que valoran **control** y **criterio**
- Powered by **prompt engineering** de élite

---

## 🔗 Links Útiles

- [Demo en Vivo](https://grind-lab.vercel.app) *(próximamente)*
- [Documentación Completa](docs/)
- [Issues](https://github.com/Perez-Alvaro/grnd-lab/issues)
- [Roadmap](https://github.com/Perez-Alvaro/grnd-lab/projects)

---

<div align="center">

**GRIND LAB** — Herramienta de ingeniería de prompts para rutinas de entrenamiento

*IA como cerebro externo • JSON editable • Export profesional*

[![GitHub stars](https://img.shields.io/github/stars/Perez-Alvaro/grnd-lab?style=social)](https://github.com/Perez-Alvaro/grnd-lab)

Made with 💪 for the fitness community

</div>
