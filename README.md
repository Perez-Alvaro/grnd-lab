# 🏋️‍♂️ FitPlan Selector

**FitPlan Selector** es un prototipo frontend hecho con React + TailwindCSS para generar y entregar rutinas de entrenamiento. Todo el sistema está mocked: los pagos, el envío de emails y la generación de PDF se simulan en el cliente.

## 🚀 Ejecutar el proyecto

```bash
npm install
npm run dev
```

El sitio se abrirá en `http://localhost:5173`.

## 🗂️ Estructura

```
src/
├── components/      # Componentes reutilizables (Header, Hero, etc.)
├── pages/           # Páginas completas (Home, AdminDashboard, ...)
├── data/            # JSON con plantillas, usuarios y ventas mockeadas
├── utils/           # Funciones auxiliares y mocks (pagos, PDF, etc.)
├── styles/          # Estilos globales de Tailwind
└── context/         # Contexto global de la app
```

## 🔧 Mocks y futura integración
- `src/utils/mockApi.js` contiene funciones que simulan pago y envío de rutinas.
- `src/utils/api.js` define funciones vacías para futuras llamadas a `/api/pagar`, `/api/generarRutina` y `/api/enviarRutina`.
- `src/utils/pdf.jsx` exporta `generateRoutinePdf` que arma PDFs con tarjetas oscuras mobile‑friendly usando `@react-pdf/renderer`.

Para conectar con un backend real, reemplazá las funciones de `mockApi.js` por llamadas a los métodos definidos en `api.js`.

## 📄 Generación de PDF

El PDF muestra cada ejercicio como una card oscura con miniatura, métricas en grilla (series, repeticiones, descanso, cadencia, RIR y notas) y encabezados por día. Diseñado mobile-first con contraste AA y margenes de 24/36 px.

## 💡 Notas
Este repositorio está listo para ser mostrado como prototipo funcional y para escalar a una integración completa con backend.
PARA BORRAR LA ULTIMA VERSION Y HACER ROLLBACK 
git reset --hard HEAD~1
git push origin main --force
