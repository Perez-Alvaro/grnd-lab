# Sistema de Persistencia con SQLite + Express + Sequelize

Este proyecto incluye un sistema completo de persistencia local para rutinas de entrenamiento usando SQLite, Express y Sequelize.

## 📁 Estructura del Proyecto

```
grnd-lab/
├── server/                    # Backend con Express
│   ├── database/
│   │   └── config.js         # Configuración de Sequelize/SQLite
│   ├── models/
│   │   └── Routine.js        # Modelo de Rutina
│   ├── routes/
│   │   └── routines.js       # Endpoints de API
│   ├── index.js              # Servidor Express principal
│   └── routines.sqlite       # Base de datos SQLite (se crea automáticamente)
├── src/
│   ├── services/
│   │   └── routinesAPI.js    # Cliente API para el frontend
│   ├── hooks/
│   │   └── useRoutinesAPI.js # Hook React para manejar rutinas
│   └── lib/utils/
│       └── routineTransform.js # Transformadores de formato
```

## 🚀 Uso

### 1. Iniciar el servidor backend

Puedes ejecutar el servidor de tres formas:

**Opción A: Solo el servidor backend**
```bash
npm run server
```

**Opción B: Solo el frontend (Vite)**
```bash
npm run dev
```

**Opción C: Ambos simultáneamente (RECOMENDADO)**
```bash
npm run dev:all
```

El servidor backend estará disponible en: `http://localhost:3001`

### 2. Configuración de variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`):

```env
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

### 3. Uso en el frontend

#### Ejemplo básico con el hook

```jsx
import { useRoutinesAPI } from './hooks/useRoutinesAPI';
import { editorToAPI, apiToEditor } from './lib/utils/routineTransform';

function MyComponent() {
  const {
    routines,
    loading,
    error,
    serverAvailable,
    loadRoutines,
    saveRoutine,
    deleteRoutine,
  } = useRoutinesAPI();

  // Cargar rutinas al montar
  useEffect(() => {
    loadRoutines();
  }, [loadRoutines]);

  // Guardar una rutina
  const handleSave = async (routineData) => {
    try {
      const apiData = editorToAPI(routineData);
      const saved = await saveRoutine(apiData);
      console.log('Rutina guardada:', saved);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {!serverAvailable && (
        <div className="error">
          ⚠️ Servidor no disponible. Ejecuta 'npm run server'
        </div>
      )}
      
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      
      <ul>
        {routines.map(routine => (
          <li key={routine.id}>{routine.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Uso directo del servicio API

```jsx
import routinesAPI from './services/routinesAPI';

// Obtener todas las rutinas
const { data } = await routinesAPI.getAll();

// Obtener rutinas filtradas
const { data } = await routinesAPI.getAll({
  nivel: 'intermedio',
  equipamiento: 'gimnasio',
  search: 'hipertrofia',
});

// Obtener una rutina por ID
const { data } = await routinesAPI.getById('uuid-aqui');

// Crear nueva rutina
const { data } = await routinesAPI.create({
  meta: { nombre: 'Mi Rutina', ... },
  semanas: [ ... ],
});

// Actualizar rutina
const { data } = await routinesAPI.update('uuid-aqui', routineData);

// Eliminar rutina
await routinesAPI.delete('uuid-aqui');

// Duplicar rutina
const { data } = await routinesAPI.duplicate('uuid-aqui');
```

## 🔌 API Endpoints

### GET `/api/routines`
Obtener todas las rutinas con filtros opcionales.

**Query Parameters:**
- `nivel`: `novato` | `intermedio` | `avanzado` | `todos`
- `equipamiento`: `casa` | `gimnasio` | `bandas` | `mixto`
- `search`: Buscar en nombre, descripción, foco
- `limit`: Número de resultados (default: 50)
- `offset`: Offset para paginación (default: 0)

**Respuesta:**
```json
{
  "success": true,
  "data": [ ... ],
  "total": 10,
  "limit": 50,
  "offset": 0
}
```

### GET `/api/routines/:id`
Obtener una rutina específica.

### POST `/api/routines`
Crear una nueva rutina.

**Body:**
```json
{
  "meta": {
    "nombre": "Rutina de Ejemplo",
    "nivel": "intermedio",
    ...
  },
  "semanas": [ ... ]
}
```

### PUT `/api/routines/:id`
Actualizar una rutina existente.

### DELETE `/api/routines/:id`
Eliminar una rutina.

### POST `/api/routines/:id/duplicate`
Duplicar una rutina existente.

### GET `/health`
Health check del servidor.

## 💾 Base de Datos

La base de datos SQLite se crea automáticamente en `server/routines.sqlite`.

### Estructura de la tabla `routines`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| nombre | STRING | Nombre de la rutina (requerido) |
| foco | STRING | Objetivo de entrenamiento |
| nivel | ENUM | novato, intermedio, avanzado, todos |
| duracion | INTEGER | Duración en semanas (1-52) |
| frecuencia | INTEGER | Días por semana (1-7) |
| equipamiento | ENUM | casa, gimnasio, bandas, mixto |
| autor | STRING | Autor de la rutina |
| descripcion | TEXT | Descripción detallada |
| tags | JSON | Array de tags |
| imagen | STRING | URL de imagen |
| precio | DECIMAL | Precio de la rutina |
| semanas | JSON | Contenido de semanas/días/bloques/ejercicios |
| isPublic | BOOLEAN | Si es pública o privada |
| version | STRING | Versión de la rutina |
| createdAt | TIMESTAMP | Fecha de creación |
| updatedAt | TIMESTAMP | Fecha de última actualización |

## 🔧 Transformadores de Datos

El sistema incluye utilidades para transformar datos entre el formato del editor y el formato de la API:

```jsx
import { 
  editorToAPI, 
  apiToEditor, 
  apiRoutinesToEditor,
  createEmptyRoutine 
} from './lib/utils/routineTransform';

// Convertir de editor a API
const apiData = editorToAPI(editorRoutine);

// Convertir de API a editor
const editorData = apiToEditor(apiRoutine);

// Convertir array de rutinas
const editorRoutines = apiRoutinesToEditor(apiRoutines);

// Crear rutina vacía
const newRoutine = createEmptyRoutine();
```

## 🛠️ Desarrollo

### Tecnologías usadas

- **Backend:**
  - Express.js - Framework web
  - Sequelize - ORM
  - SQLite3 - Base de datos
  - CORS - Cross-Origin Resource Sharing

- **Frontend:**
  - React - UI Framework
  - Vite - Build tool
  - Custom hooks - Manejo de estado

### Próximas mejoras

- [ ] Autenticación de usuarios
- [ ] Exportar/Importar base de datos
- [ ] Sincronización con la nube (opcional)
- [ ] Versionado de rutinas
- [ ] Categorías y etiquetas avanzadas
- [ ] Búsqueda full-text

## 📝 Notas

- La base de datos se crea automáticamente la primera vez que ejecutas el servidor
- Los datos se almacenan localmente en tu computadora
- Puedes respaldar la base de datos copiando el archivo `server/database/routines.sqlite`
- El servidor usa el puerto 3001 por defecto (configurable en `.env`)
- **WAL Mode**: La base de datos usa Write-Ahead Logging para mejor persistencia y concurrencia
- **Sincronización FULL**: Los datos se escriben al disco inmediatamente para evitar pérdida de datos

## 🔍 Verificar Datos

Para verificar que los datos se están guardando correctamente:

```bash
npm run check-db
```

Este comando mostrará:
- Número total de rutinas en la base de datos
- Listado de todas las rutinas con sus metadatos
- Fechas de creación y actualización

## ❓ Solución de problemas

### El servidor no inicia
- Verifica que el puerto 3001 no esté en uso
- Asegúrate de tener todas las dependencias instaladas: `npm install`

### Error de CORS
- Verifica que la URL en `.env` coincida con la del servidor
- El servidor ya tiene CORS habilitado por defecto

### Base de datos corrupta
- Elimina el archivo `server/database/routines.sqlite` y reinicia el servidor
- Se creará una nueva base de datos vacía

### Servidor no disponible en el frontend
- Asegúrate de que el servidor esté corriendo: `npm run server`
- Verifica la URL en `.env`: `VITE_API_URL=http://localhost:3001/api`
- Reinicia el servidor de Vite después de cambiar `.env`

### **Los datos no se guardan después de reiniciar el servidor** ⚠️ SOLUCIONADO
Este era un problema crítico que se ha corregido con las siguientes mejoras:

1. **WAL Mode activado**: Ahora se usa Write-Ahead Logging para mejor durabilidad
2. **Sincronización completa**: Los datos se escriben al disco inmediatamente con `PRAGMA synchronous = FULL`
3. **Cierre graceful mejorado**: Al detener el servidor con Ctrl+C, se ejecuta `PRAGMA wal_checkpoint(FULL)` para asegurar que todos los datos se guarden
4. **Múltiples señales manejadas**: Se capturan SIGINT, SIGTERM y SIGQUIT para un cierre seguro

**Pasos para verificar la solución:**
1. Reinicia el servidor: `npm run dev:all`
2. Crea una rutina de prueba
3. Verifica que se guardó: `npm run check-db`
4. Detén el servidor con Ctrl+C (espera a ver el mensaje "✅ Conexión a base de datos cerrada correctamente")
5. Reinicia el servidor: `npm run dev:all`
6. Verifica que la rutina sigue ahí: `npm run check-db`

**IMPORTANTE**: Cuando detengas el servidor, **espera unos segundos** hasta ver el mensaje de confirmación. No mates el proceso abruptamente (evita cerrar la terminal directamente).
