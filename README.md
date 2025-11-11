# 🏋️‍♂️ Fitter

**Fitter** es un prototipo frontend hecho con React + TailwindCSS para generar y entregar rutinas de entrenamiento. Todo el sistema está mocked: los pagos, el envío de emails y la generación de PDF se simulan en el cliente.

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
- `src/pdf/PlanRenderer.jsx` expone `generateTrainingPlanPDF` con la nueva plantilla unificada, construida con `@react-pdf/renderer`.

Para conectar con un backend real, reemplazá las funciones de `mockApi.js` por llamadas a los métodos definidos en `api.js`.

## 📄 Generación de PDF

El PDF comienza con una portada y un índice interactivo que enlaza a cada semana del plan. Luego, cada semana se muestra en secciones independientes con sus días (entrenamiento o descanso), tablas de ejercicios con columnas estándar (Ejercicio, Series, Reps, Desc, Video) y notas en viñetas, respetando la paleta oscura original.

## 💡 Notas
Este repositorio está listo para ser mostrado como prototipo funcional y para escalar a una integración completa con backend.

## PARA BORRAR LA ULTIMA VERSION Y HACER ROLLBACK 
git reset --hard HEAD~1
git push origin main --force
## PARA LIMPIAR DEPENDENCIAS Y REINSTALAR 
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
