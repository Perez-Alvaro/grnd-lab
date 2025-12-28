# 🏗️ Database & Backend Refactoring - Master Plan

**Fecha de Inicio**: 25 de Diciembre de 2025  
**Objetivo**: Simplificar, robustificar y normalizar la arquitectura de base de datos y backend  
**Stack**: SQLite + Express + Sequelize + React

---

## 📊 ESTADO ACTUAL (Auditoría)

### Estructura Actual del Backend
```
server/
├── database/
│   ├── config.js          ✅ Configurado con SQLite
│   └── routines.sqlite    ✅ Base de datos física
├── models/
│   └── Routine.js         ⚠️ Modelo monolítico con JSON embebido
├── routes/
│   └── routines.js        ⚠️ Lógica mezclada con controladores
└── index.js               ✅ Express server básico
```

### Problemas Identificados

#### 🔴 **CRÍTICO: Modelo No Normalizado**
- `Routine.semanas` almacenado como **JSON blob**
- No hay tablas separadas para `Week`, `Day`, `Block`, `Exercise`
- Imposible hacer queries eficientes sobre ejercicios
- No hay relaciones Sequelize reales
- Datos anidados dificultan validación y transacciones

#### 🟡 **MODERADO: Arquitectura Plana**
- No hay separación de capas (controllers/services/repositories)
- Lógica de negocio mezclada con HTTP handling
- No hay DTOs (Data Transfer Objects)
- No hay validación de input centralizada
- Services en frontend no están integrados con backend

#### 🟡 **MODERADO: Sin Migrations**
- No hay control de versiones de esquema
- `sync()` usado en lugar de migrations
- Difícil hacer rollbacks o cambios incrementales

#### 🟢 **MENOR: Sin Transacciones**
- Operaciones complejas no usan transactions
- Riesgo de datos inconsistentes en errores

---

## 🎯 OBJETIVOS DE LA REFACTORIZACIÓN

### 1. **Normalización de Base de Datos**
- Separar `Routine` en múltiples tablas relacionadas
- Implementar FK constraints
- Índices apropiados
- Esquema versionado con migrations

### 2. **Arquitectura Clean Layers**
```
server/
├── config/          # Configuración centralizada
├── database/        # Sequelize config + migrations
├── models/          # Solo definiciones de modelos
├── repositories/    # Acceso a datos (opcional)
├── services/        # Lógica de negocio
├── controllers/     # HTTP handlers
├── routes/          # Definiciones REST
├── middlewares/     # Validación, auth, error handling
├── dtos/            # Schemas de validación
└── utils/           # Helpers
```

### 3. **API Consistency**
- Respuestas uniformes
- Error handling centralizado
- Validación con Zod/Joi
- Documentación clara

### 4. **Robustez y Confiabilidad**
- Transactions para operaciones críticas
- Soft deletes opcionales
- Auditoría (createdAt, updatedAt, deletedAt)
- Rollback automático en errores

### 5. **Integración Frontend**
- API client centralizado en React
- Hooks consistentes
- Error handling uniforme
- Loading states

---

## 📐 NUEVO DISEÑO DE BASE DE DATOS

### Esquema Normalizado

```sql
-- Rutinas (metadata principal)
CREATE TABLE routines (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  goal VARCHAR(255),
  level ENUM('novato', 'intermedio', 'avanzado', 'todos'),
  duration_weeks INTEGER,
  frequency_days INTEGER,
  equipment ENUM('casa', 'gimnasio', 'bandas', 'mixto'),
  author VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  price DECIMAL(10, 2),
  is_public BOOLEAN DEFAULT false,
  version VARCHAR(20) DEFAULT '1.0.0',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Semanas de rutina
CREATE TABLE weeks (
  id UUID PRIMARY KEY,
  routine_id UUID NOT NULL,
  week_number INTEGER NOT NULL,
  name VARCHAR(255),
  summary TEXT,
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
);

-- Días de entrenamiento
CREATE TABLE days (
  id UUID PRIMARY KEY,
  week_id UUID NOT NULL,
  day_number INTEGER NOT NULL,
  name VARCHAR(255),
  type ENUM('ENTRENAMIENTO', 'DESCANSO', 'ACTIVO') DEFAULT 'ENTRENAMIENTO',
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (week_id) REFERENCES weeks(id) ON DELETE CASCADE
);

-- Bloques de ejercicios
CREATE TABLE blocks (
  id UUID PRIMARY KEY,
  day_id UUID NOT NULL,
  block_number INTEGER NOT NULL,
  type ENUM('ENTRENAMIENTO', 'CARDIO', 'ESTIRAMIENTO') DEFAULT 'ENTRENAMIENTO',
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
);

-- Ejercicios
CREATE TABLE exercises (
  id UUID PRIMARY KEY,
  block_id UUID NOT NULL,
  exercise_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  sets INTEGER,
  reps VARCHAR(50),
  rest VARCHAR(50),
  tempo VARCHAR(50),
  rpe VARCHAR(10),
  weight VARCHAR(50),
  notes TEXT,
  cues TEXT,
  video_url VARCHAR(500),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- Tags (opcional, si se quieren queries eficientes)
CREATE TABLE tags (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE routine_tags (
  routine_id UUID,
  tag_id UUID,
  PRIMARY KEY (routine_id, tag_id),
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

### Índices Propuestos
```sql
CREATE INDEX idx_routines_level ON routines(level);
CREATE INDEX idx_routines_equipment ON routines(equipment);
CREATE INDEX idx_routines_created_at ON routines(created_at);
CREATE INDEX idx_weeks_routine_id ON weeks(routine_id);
CREATE INDEX idx_days_week_id ON days(week_id);
CREATE INDEX idx_blocks_day_id ON blocks(day_id);
CREATE INDEX idx_exercises_block_id ON exercises(block_id);
CREATE INDEX idx_exercises_name ON exercises(name);
```

---

## 🗂️ PLAN DE IMPLEMENTACIÓN

### **FASE 1: Setup & Migrations** ⏱️ 2-3 horas

#### 1.1 Instalar Sequelize CLI
```bash
npm install --save-dev sequelize-cli
```

#### 1.2 Configurar estructura de migrations
```bash
npx sequelize-cli init
```
Esto crea:
- `config/config.json`
- `migrations/`
- `seeders/`

#### 1.3 Configurar Sequelize CLI para ES modules
Crear `.sequelizerc`:
```js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  'config': path.resolve(__dirname, 'server/config/database.js'),
  'models-path': path.resolve(__dirname, 'server/models'),
  'seeders-path': path.resolve(__dirname, 'server/seeders'),
  'migrations-path': path.resolve(__dirname, 'server/migrations')
};
```

#### 1.4 Crear migrations iniciales
```bash
# Crear migration para routines normalizada
npx sequelize-cli migration:generate --name create-routines-table

# Crear migration para weeks
npx sequelize-cli migration:generate --name create-weeks-table

# Y así sucesivamente...
```

#### 1.5 Escribir migrations con relaciones CASCADE

**Entregables Fase 1:**
- ✅ Sequelize CLI configurado
- ✅ Migrations escritas y versionadas
- ✅ Seeders básicos para testing
- ✅ Esquema puede recrearse desde cero

---

### **FASE 2: Modelos Sequelize Normalizados** ⏱️ 2-3 horas

#### 2.1 Crear modelos separados
```
server/models/
├── index.js          # Importa todos los modelos y define asociaciones
├── Routine.js        # Solo metadata
├── Week.js
├── Day.js
├── Block.js
├── Exercise.js
└── Tag.js (opcional)
```

#### 2.2 Definir asociaciones en un solo lugar
```js
// models/index.js
import Routine from './Routine.js';
import Week from './Week.js';
// ... otros imports

// Definir relaciones
Routine.hasMany(Week, { foreignKey: 'routineId', onDelete: 'CASCADE', as: 'weeks' });
Week.belongsTo(Routine, { foreignKey: 'routineId' });

Week.hasMany(Day, { foreignKey: 'weekId', onDelete: 'CASCADE', as: 'days' });
Day.belongsTo(Week, { foreignKey: 'weekId' });

// ... etc

export { Routine, Week, Day, Block, Exercise, Tag };
```

#### 2.3 Usar naming conventions consistentes
- **Tablas**: `snake_case` (ej: `routine_tags`)
- **Columnas**: `snake_case` (ej: `created_at`)
- **Modelos JS**: `PascalCase` (ej: `RoutineTag`)
- **Campos JS**: `camelCase` con `field: 'snake_case'` mapping

**Entregables Fase 2:**
- ✅ Modelos Sequelize limpios
- ✅ Relaciones correctamente definidas
- ✅ Validaciones en modelos
- ✅ Hooks si necesario (ej: soft delete)

---

### **FASE 3: Backend Architecture Refactor** ⏱️ 4-5 horas

#### 3.1 Crear estructura de carpetas
```
server/
├── config/
│   ├── database.js          # Sequelize config para CLI
│   └── app.js               # Configs generales
├── database/
│   └── config.js            # Conexión Sequelize
├── models/                  # Ya hecho en Fase 2
├── migrations/              # Ya hecho en Fase 1
├── seeders/
├── repositories/            # OPCIONAL: si quieres capa extra
│   └── RoutineRepository.js
├── services/
│   ├── RoutineService.js    # Lógica de negocio
│   ├── WeekService.js
│   └── ExerciseService.js
├── controllers/
│   ├── RoutineController.js # Solo req/res handling
│   └── ...
├── routes/
│   ├── index.js             # Combina todas las rutas
│   ├── routines.routes.js
│   └── ...
├── middlewares/
│   ├── errorHandler.js
│   ├── validateRequest.js
│   └── asyncHandler.js
├── dtos/
│   ├── routineSchemas.js    # Zod/Joi schemas
│   └── ...
├── utils/
│   ├── response.js          # Respuestas estandarizadas
│   └── errors.js            # Custom errors
└── index.js                 # Entry point
```

#### 3.2 Implementar Services Layer

**Ejemplo: RoutineService.js**
```js
import { Routine, Week, Day, Block, Exercise } from '../models/index.js';
import sequelize from '../database/config.js';

class RoutineService {
  async createRoutine(routineData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Crear routine
      const routine = await Routine.create({
        name: routineData.name,
        goal: routineData.goal,
        // ... otros campos
      }, { transaction });
      
      // Crear weeks (si vienen)
      if (routineData.weeks?.length > 0) {
        for (const weekData of routineData.weeks) {
          const week = await Week.create({
            routineId: routine.id,
            weekNumber: weekData.weekNumber,
            name: weekData.name,
            // ...
          }, { transaction });
          
          // Crear days, blocks, exercises en cascada
          // ...
        }
      }
      
      await transaction.commit();
      
      // Retornar routine completa con includes
      return this.getRoutineById(routine.id);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async getRoutineById(id) {
    return Routine.findByPk(id, {
      include: [
        {
          model: Week,
          as: 'weeks',
          include: [
            {
              model: Day,
              as: 'days',
              include: [
                {
                  model: Block,
                  as: 'blocks',
                  include: [
                    {
                      model: Exercise,
                      as: 'exercises'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  }
  
  async getAllRoutines(filters = {}) {
    const { level, equipment, search, limit = 50, offset = 0 } = filters;
    
    const where = {};
    if (level) where.level = level;
    if (equipment) where.equipment = equipment;
    // ... otros filtros
    
    return Routine.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{ model: Week, as: 'weeks' }] // Solo metadata
    });
  }
  
  async updateRoutine(id, updates) {
    // Similar con transaction
  }
  
  async deleteRoutine(id) {
    // Soft delete o hard delete
  }
}

export default new RoutineService();
```

#### 3.3 Implementar Controllers Layer

**Ejemplo: RoutineController.js**
```js
import RoutineService from '../services/RoutineService.js';
import { successResponse, errorResponse } from '../utils/response.js';

class RoutineController {
  async create(req, res, next) {
    try {
      const routine = await RoutineService.createRoutine(req.body);
      return successResponse(res, routine, 'Routine created successfully', 201);
    } catch (error) {
      next(error);
    }
  }
  
  async getAll(req, res, next) {
    try {
      const result = await RoutineService.getAllRoutines(req.query);
      return successResponse(res, result.rows, 'Routines retrieved', 200, {
        total: result.count,
        limit: parseInt(req.query.limit || 50),
        offset: parseInt(req.query.offset || 0)
      });
    } catch (error) {
      next(error);
    }
  }
  
  // ... otros métodos
}

export default new RoutineController();
```

#### 3.4 Definir Routes con validación

**Ejemplo: routines.routes.js**
```js
import express from 'express';
import RoutineController from '../controllers/RoutineController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createRoutineSchema, updateRoutineSchema } from '../dtos/routineSchemas.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(RoutineController.getAll.bind(RoutineController)));
router.get('/:id', asyncHandler(RoutineController.getById.bind(RoutineController)));
router.post('/', validateRequest(createRoutineSchema), asyncHandler(RoutineController.create.bind(RoutineController)));
router.put('/:id', validateRequest(updateRoutineSchema), asyncHandler(RoutineController.update.bind(RoutineController)));
router.delete('/:id', asyncHandler(RoutineController.delete.bind(RoutineController)));

export default router;
```

#### 3.5 Implementar Middleware de validación

**Ejemplo: validateRequest.js**
```js
import { z } from 'zod';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }
      next(error);
    }
  };
};
```

**Ejemplo: routineSchemas.js (Zod)**
```js
import { z } from 'zod';

export const createRoutineSchema = z.object({
  name: z.string().min(1).max(255),
  goal: z.string().optional(),
  level: z.enum(['novato', 'intermedio', 'avanzado', 'todos']).optional(),
  durationWeeks: z.number().int().min(1).max(52).optional(),
  frequencyDays: z.number().int().min(1).max(7).optional(),
  equipment: z.enum(['casa', 'gimnasio', 'bandas', 'mixto']).optional(),
  description: z.string().optional(),
  weeks: z.array(z.object({
    weekNumber: z.number().int(),
    name: z.string(),
    days: z.array(z.object({
      // ... schema anidado
    })).optional()
  })).optional()
});

export const updateRoutineSchema = createRoutineSchema.partial();
```

**Entregables Fase 3:**
- ✅ Separación clara de responsabilidades
- ✅ Services con lógica de negocio
- ✅ Controllers solo manejan HTTP
- ✅ Validación centralizada con Zod
- ✅ Error handling uniforme
- ✅ Respuestas API consistentes

---

### **FASE 4: Frontend Integration** ⏱️ 2-3 horas

#### 4.1 Refactorizar API Client

**Ejemplo: src/services/api/client.js**
```js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new ApiError(data.error || 'Request failed', response.status, data);
      }
      
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 0, error);
    }
  }
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
  
  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export default new ApiClient();
```

#### 4.2 Actualizar Routines API Service

**src/services/routinesAPI.js**
```js
import apiClient from './api/client.js';

export const routinesAPI = {
  getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/routines${queryString ? '?' + queryString : ''}`);
  },
  
  getById(id) {
    return apiClient.get(`/routines/${id}`);
  },
  
  create(routineData) {
    return apiClient.post('/routines', routineData);
  },
  
  update(id, routineData) {
    return apiClient.put(`/routines/${id}`, routineData);
  },
  
  delete(id) {
    return apiClient.delete(`/routines/${id}`);
  },
  
  async healthCheck() {
    try {
      await apiClient.get('/health');
      return true;
    } catch {
      return false;
    }
  }
};
```

#### 4.3 Actualizar React Hooks

**src/hooks/useRoutines.js**
```js
import { useState, useEffect, useCallback } from 'react';
import { routinesAPI } from '../services/routinesAPI';

export function useRoutines(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverAvailable, setServerAvailable] = useState(true);
  
  const loadRoutines = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await routinesAPI.getAll({ ...filters, ...params });
      setData(response.data);
      return response;
    } catch (err) {
      setError(err.message);
      setServerAvailable(err.status !== 0);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  const createRoutine = useCallback(async (routineData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await routinesAPI.create(routineData);
      setData(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    routinesAPI.healthCheck().then(setServerAvailable);
  }, []);
  
  return {
    data,
    loading,
    error,
    serverAvailable,
    loadRoutines,
    createRoutine,
    // ... otros métodos
  };
}
```

**Entregables Fase 4:**
- ✅ API client centralizado
- ✅ Error handling uniforme
- ✅ React hooks actualizados
- ✅ Loading states consistentes

---

### **FASE 5: Migration & Testing** ⏱️ 2-3 horas

#### 5.1 Crear script de migración de datos

**scripts/migrate-old-data.js**
```js
// Script para migrar de estructura JSON a tablas normalizadas
import { Routine as OldRoutine } from '../server/models/Routine.js';
import { Routine, Week, Day, Block, Exercise } from '../server/models/index.js';
import sequelize from '../server/database/config.js';

async function migrateData() {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. Leer rutinas antiguas
    const oldRoutines = await OldRoutine.findAll();
    
    for (const oldRoutine of oldRoutines) {
      // 2. Crear nueva rutina
      const newRoutine = await Routine.create({
        id: oldRoutine.id,
        name: oldRoutine.nombre,
        goal: oldRoutine.foco,
        level: oldRoutine.nivel,
        // ... mapear campos
      }, { transaction });
      
      // 3. Migrar semanas del JSON
      if (oldRoutine.semanas?.length > 0) {
        for (const [idx, weekData] of oldRoutine.semanas.entries()) {
          const week = await Week.create({
            routineId: newRoutine.id,
            weekNumber: idx + 1,
            name: weekData.nombre,
            // ...
          }, { transaction });
          
          // 4. Migrar días, bloques, ejercicios
          // ...
        }
      }
    }
    
    await transaction.commit();
    console.log('✅ Migration completed successfully');
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Migration failed:', error);
    throw error;
  }
}
```

#### 5.2 Crear seeders para testing

```bash
npx sequelize-cli seed:generate --name demo-routines
```

#### 5.3 Testing Checklist

**Checklist de Robustez:**
- [ ] Crear rutina completa con semanas/días/ejercicios
- [ ] Verificar persistencia después de restart
- [ ] Update de rutina (metadata)
- [ ] Update de ejercicio específico
- [ ] Delete de rutina (cascade)
- [ ] Delete de semana (cascade)
- [ ] Rollback en error de transaction
- [ ] Queries con filtros (level, equipment, search)
- [ ] Paginación funciona
- [ ] Includes (eager loading) correcto
- [ ] No hay datos huérfanos
- [ ] FK constraints funcionan
- [ ] Índices mejoran performance
- [ ] Frontend consume API correctamente
- [ ] Error handling muestra mensajes claros

#### 5.4 Documentar

**docs/API.md**
- Endpoints disponibles
- Request/Response examples
- Error codes
- Ejemplos de uso

**Entregables Fase 5:**
- ✅ Script de migración funcional
- ✅ Seeders para testing
- ✅ Checklist 100% validado
- ✅ Documentación completa

---

## 🚦 ESTRATEGIA DE ROLLOUT

### Opción 1: Big Bang (Recomendado para desarrollo)
1. Backup de base de datos actual
2. Ejecutar todas las migrations
3. Migrar datos con script
4. Deploy nuevo backend
5. Deploy nuevo frontend
6. Validar

### Opción 2: Incremental (Si hay datos de producción)
1. Mantener ambos modelos en paralelo
2. Escribir en ambos (dual write)
3. Migrar datos en background
4. Validar consistencia
5. Switch a nuevo modelo
6. Limpiar código viejo

---

## ✅ CHECKLIST FINAL

**Antes de considerar completo:**
- [ ] Todas las migrations ejecutan sin errores
- [ ] Seeders crean datos de ejemplo
- [ ] Modelos Sequelize tienen todas las relaciones
- [ ] Services layer tiene todas las operaciones CRUD
- [ ] Controllers solo hacen HTTP handling
- [ ] Validación funciona con Zod
- [ ] Error handling es uniforme
- [ ] API responses son consistentes
- [ ] Frontend consume nueva API
- [ ] Hooks React funcionan
- [ ] Persistencia es 100% confiable
- [ ] Transacciones funcionan correctamente
- [ ] Cascades funcionan
- [ ] Índices mejoran queries
- [ ] Código está documentado
- [ ] Hay ejemplos de uso

---

## 📚 DOCUMENTACIÓN A CREAR

1. **README del backend** - Cómo correr, migrations, seeders
2. **API Documentation** - Endpoints, payloads, responses
3. **Database Schema** - Diagrama ER, relaciones
4. **Guía de Desarrollo** - Cómo agregar nuevos modelos/endpoints
5. **Troubleshooting** - Problemas comunes y soluciones

---

## 🎯 PRÓXIMOS PASOS

1. **Ahora**: Revisar y aprobar este plan
2. **Fase 1**: Configurar Sequelize CLI y crear migrations
3. **Fase 2**: Implementar modelos normalizados
4. **Fase 3**: Refactorizar backend en capas
5. **Fase 4**: Integrar con frontend
6. **Fase 5**: Migrar datos y validar

**Tiempo estimado total**: 12-16 horas de trabajo enfocado

---

**¿Proceder con Fase 1?**
