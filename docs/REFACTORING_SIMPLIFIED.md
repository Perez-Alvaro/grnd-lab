# 🚀 Backend Refactoring - Enfoque Simplificado

**Fecha**: 26 de Diciembre de 2025  
**Tiempo Estimado**: 4-6 horas  
**Estrategia**: Mejorar arquitectura manteniendo esquema actual

---

## 🎯 OBJETIVOS

### ✅ Mantener
- SQLite con archivo físico
- Modelo `Routine` con JSON blob para `semanas`
- Persistencia que ya funciona
- Estructura de datos actual del frontend

### 🔧 Mejorar
1. **Separación de Responsabilidades**
   - Services (lógica de negocio)
   - Controllers (HTTP handling)
   - Middlewares (validación, errors)

2. **Validación Robusta**
   - Zod schemas para input validation
   - Errores claros y útiles

3. **Error Handling Centralizado**
   - Custom errors
   - Respuestas uniformes
   - Logging consistente

4. **Transaction Safety**
   - Usar transactions donde importa
   - Rollback automático

5. **API Consistency**
   - Respuestas predecibles
   - Status codes correctos

---

## 📁 NUEVA ESTRUCTURA

```
server/
├── database/
│   └── config.js                 ✅ Ya existe
├── models/
│   └── Routine.js                ✅ Ya existe (sin cambios)
├── services/                     🆕 NUEVO
│   └── routineService.js
├── controllers/                  🆕 NUEVO
│   └── routineController.js
├── middlewares/                  🆕 NUEVO
│   ├── errorHandler.js
│   ├── validateRequest.js
│   └── asyncHandler.js
├── validators/                   🆕 NUEVO
│   └── routineSchemas.js
├── utils/                        🆕 NUEVO
│   ├── ApiResponse.js
│   └── ApiError.js
├── routes/
│   └── routines.js               🔄 REFACTORIZAR
└── index.js                      🔄 ACTUALIZAR
```

---

## 🔨 IMPLEMENTACIÓN

### PASO 1: Utilities & Errors (15 min)

**utils/ApiError.js**
```javascript
class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message, details) {
    super(message, 400, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message) {
    super(message, 404);
  }
}

export class ValidationError extends ApiError {
  constructor(message, details) {
    super(message, 422, details);
  }
}

export default ApiError;
```

**utils/ApiResponse.js**
```javascript
export const successResponse = (data, message = 'Success', meta = {}) => ({
  success: true,
  message,
  data,
  ...meta
});

export const errorResponse = (error, message = 'Error') => ({
  success: false,
  message,
  error: error.message || error,
  ...(error.details && { details: error.details })
});
```

---

### PASO 2: Middlewares (20 min)

**middlewares/asyncHandler.js**
```javascript
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

**middlewares/errorHandler.js**
```javascript
import ApiError from '../utils/ApiError.js';
import { errorResponse } from '../utils/ApiResponse.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      errorResponse(err, err.message)
    );
  }

  // Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json(
      errorResponse(err, 'Validation error')
    );
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json(
      errorResponse(err, 'Duplicate entry')
    );
  }

  // Default error
  res.status(500).json(
    errorResponse(err, 'Internal server error')
  );
};
```

**middlewares/validateRequest.js**
```javascript
import { z } from 'zod';
import { ValidationError } from '../utils/ApiError.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        next(new ValidationError('Invalid request data', details));
      } else {
        next(error);
      }
    }
  };
};
```

---

### PASO 3: Validators con Zod (25 min)

**validators/routineSchemas.js**
```javascript
import { z } from 'zod';

// Schema para metadata de rutina
const routineMetaSchema = z.object({
  nombre: z.string().min(1, 'Name is required').max(255),
  foco: z.string().max(255).optional(),
  nivel: z.enum(['novato', 'intermedio', 'avanzado', 'todos']).optional(),
  duracion: z.number().int().min(1).max(52).optional(),
  frecuencia: z.number().int().min(1).max(7).optional(),
  equipamiento: z.enum(['casa', 'gimnasio', 'bandas', 'mixto']).optional(),
  autor: z.string().max(255).optional(),
  descripcion: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imagen: z.string().url().optional().or(z.literal('')),
  precio: z.number().min(0).optional(),
  isPublic: z.boolean().optional(),
});

// Schema para ejercicio
const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, 'Exercise name is required'),
  series: z.number().int().min(1).optional(),
  reps: z.string().optional(),
  descanso: z.string().optional(),
  tempo: z.string().optional(),
  rpe: z.string().optional(),
  peso: z.string().optional(),
  notas: z.string().optional(),
  cues: z.string().optional(),
});

// Schema para bloque
const blockSchema = z.object({
  id: z.string().uuid().optional(),
  tipo: z.enum(['ENTRENAMIENTO', 'CARDIO', 'ESTIRAMIENTO']).optional(),
  ejercicios: z.array(exerciseSchema).optional(),
});

// Schema para día
const daySchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1),
  tipo: z.enum(['ENTRENAMIENTO', 'DESCANSO', 'ACTIVO']).optional(),
  bloques: z.array(blockSchema).optional(),
});

// Schema para semana
const weekSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1),
  resumen: z.string().optional(),
  notas: z.string().optional(),
  dias: z.array(daySchema).optional(),
});

// Schema para crear rutina completa
export const createRoutineSchema = z.object({
  meta: routineMetaSchema,
  semanas: z.array(weekSchema).optional(),
});

// Schema para actualizar rutina
export const updateRoutineSchema = z.object({
  meta: routineMetaSchema.partial().optional(),
  semanas: z.array(weekSchema).optional(),
});

// Schema para query params
export const routineQuerySchema = z.object({
  nivel: z.enum(['novato', 'intermedio', 'avanzado', 'todos']).optional(),
  equipamiento: z.enum(['casa', 'gimnasio', 'bandas', 'mixto']).optional(),
  search: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});
```

---

### PASO 4: Service Layer (30 min)

**services/routineService.js**
```javascript
import Routine from '../models/Routine.js';
import { Op } from 'sequelize';
import { NotFoundError, BadRequestError } from '../utils/ApiError.js';
import sequelize from '../database/config.js';

class RoutineService {
  /**
   * Obtener todas las rutinas con filtros
   */
  async getAllRoutines(filters = {}) {
    const { nivel, equipamiento, search, limit = 50, offset = 0 } = filters;
    
    const where = {};
    
    if (nivel && nivel !== 'todos') {
      where.nivel = nivel;
    }
    
    if (equipamiento) {
      where.equipamiento = equipamiento;
    }
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
        { foco: { [Op.like]: `%${search}%` } },
      ];
    }

    const result = await Routine.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return {
      routines: result.rows,
      total: result.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };
  }

  /**
   * Obtener rutina por ID
   */
  async getRoutineById(id) {
    const routine = await Routine.findByPk(id);
    
    if (!routine) {
      throw new NotFoundError(`Routine with id ${id} not found`);
    }
    
    return routine;
  }

  /**
   * Crear nueva rutina
   */
  async createRoutine(routineData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { meta, semanas } = routineData;
      
      // Validar que tenga al menos nombre
      if (!meta?.nombre) {
        throw new BadRequestError('Routine name is required');
      }
      
      const newRoutine = await Routine.create({
        nombre: meta.nombre,
        foco: meta.foco,
        nivel: meta.nivel || 'todos',
        duracion: meta.duracion,
        frecuencia: meta.frecuencia,
        equipamiento: meta.equipamiento,
        autor: meta.autor,
        descripcion: meta.descripcion,
        tags: meta.tags || [],
        imagen: meta.imagen,
        precio: meta.precio || 0,
        semanas: semanas || [],
        isPublic: meta.isPublic || false,
      }, { transaction });

      await transaction.commit();
      
      return newRoutine;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Actualizar rutina existente
   */
  async updateRoutine(id, routineData) {
    const transaction = await sequelize.transaction();
    
    try {
      const routine = await Routine.findByPk(id);
      
      if (!routine) {
        throw new NotFoundError(`Routine with id ${id} not found`);
      }

      const { meta, semanas } = routineData;
      
      const updateData = {};
      
      if (meta) {
        if (meta.nombre !== undefined) updateData.nombre = meta.nombre;
        if (meta.foco !== undefined) updateData.foco = meta.foco;
        if (meta.nivel !== undefined) updateData.nivel = meta.nivel;
        if (meta.duracion !== undefined) updateData.duracion = meta.duracion;
        if (meta.frecuencia !== undefined) updateData.frecuencia = meta.frecuencia;
        if (meta.equipamiento !== undefined) updateData.equipamiento = meta.equipamiento;
        if (meta.autor !== undefined) updateData.autor = meta.autor;
        if (meta.descripcion !== undefined) updateData.descripcion = meta.descripcion;
        if (meta.tags !== undefined) updateData.tags = meta.tags;
        if (meta.imagen !== undefined) updateData.imagen = meta.imagen;
        if (meta.precio !== undefined) updateData.precio = meta.precio;
        if (meta.isPublic !== undefined) updateData.isPublic = meta.isPublic;
      }
      
      if (semanas !== undefined) {
        updateData.semanas = semanas;
      }

      await routine.update(updateData, { transaction });
      await transaction.commit();
      
      return routine;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Eliminar rutina
   */
  async deleteRoutine(id) {
    const routine = await Routine.findByPk(id);
    
    if (!routine) {
      throw new NotFoundError(`Routine with id ${id} not found`);
    }

    await routine.destroy();
    
    return { message: 'Routine deleted successfully' };
  }

  /**
   * Duplicar rutina
   */
  async duplicateRoutine(id) {
    const transaction = await sequelize.transaction();
    
    try {
      const original = await Routine.findByPk(id);
      
      if (!original) {
        throw new NotFoundError(`Routine with id ${id} not found`);
      }

      const duplicate = await Routine.create({
        nombre: `${original.nombre} (Copia)`,
        foco: original.foco,
        nivel: original.nivel,
        duracion: original.duracion,
        frecuencia: original.frecuencia,
        equipamiento: original.equipamiento,
        autor: original.autor,
        descripcion: original.descripcion,
        tags: original.tags,
        imagen: original.imagen,
        precio: original.precio,
        semanas: original.semanas,
        isPublic: false, // Las copias no son públicas por defecto
      }, { transaction });

      await transaction.commit();
      
      return duplicate;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new RoutineService();
```

---

### PASO 5: Controller Layer (25 min)

**controllers/routineController.js**
```javascript
import routineService from '../services/routineService.js';
import { successResponse } from '../utils/ApiResponse.js';

class RoutineController {
  async getAll(req, res) {
    const result = await routineService.getAllRoutines(req.query);
    
    res.json(successResponse(
      result.routines,
      'Routines retrieved successfully',
      {
        total: result.total,
        limit: result.limit,
        offset: result.offset
      }
    ));
  }

  async getById(req, res) {
    const routine = await routineService.getRoutineById(req.params.id);
    
    res.json(successResponse(
      routine,
      'Routine retrieved successfully'
    ));
  }

  async create(req, res) {
    const routine = await routineService.createRoutine(req.body);
    
    res.status(201).json(successResponse(
      routine,
      'Routine created successfully'
    ));
  }

  async update(req, res) {
    const routine = await routineService.updateRoutine(req.params.id, req.body);
    
    res.json(successResponse(
      routine,
      'Routine updated successfully'
    ));
  }

  async delete(req, res) {
    const result = await routineService.deleteRoutine(req.params.id);
    
    res.json(successResponse(
      result,
      'Routine deleted successfully'
    ));
  }

  async duplicate(req, res) {
    const routine = await routineService.duplicateRoutine(req.params.id);
    
    res.status(201).json(successResponse(
      routine,
      'Routine duplicated successfully'
    ));
  }
}

export default new RoutineController();
```

---

### PASO 6: Routes Refactorizadas (20 min)

**routes/routines.js**
```javascript
import express from 'express';
import routineController from '../controllers/routineController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createRoutineSchema, updateRoutineSchema } from '../validators/routineSchemas.js';

const router = express.Router();

// GET /api/routines
router.get(
  '/',
  asyncHandler(routineController.getAll.bind(routineController))
);

// GET /api/routines/:id
router.get(
  '/:id',
  asyncHandler(routineController.getById.bind(routineController))
);

// POST /api/routines
router.post(
  '/',
  validateRequest(createRoutineSchema),
  asyncHandler(routineController.create.bind(routineController))
);

// PUT /api/routines/:id
router.put(
  '/:id',
  validateRequest(updateRoutineSchema),
  asyncHandler(routineController.update.bind(routineController))
);

// DELETE /api/routines/:id
router.delete(
  '/:id',
  asyncHandler(routineController.delete.bind(routineController))
);

// POST /api/routines/:id/duplicate
router.post(
  '/:id/duplicate',
  asyncHandler(routineController.duplicate.bind(routineController))
);

export default router;
```

---

### PASO 7: Actualizar Server Index (15 min)

**server/index.js**
```javascript
import express from 'express';
import cors from 'cors';
import sequelize, { initializeSQLite } from './database/config.js';
import routinesRouter from './routes/routines.js';
import { errorHandler } from './middlewares/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/routines', routinesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: path.resolve(__dirname, 'database', 'routines.sqlite'),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler (debe ser el último middleware)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await initializeSQLite();
    await sequelize.sync({ force: false });
    console.log('✅ Models synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api/routines`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Shutting down (signal: ${signal})...`);
  
  try {
    await sequelize.close();
    console.log('✅ Database closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();

export default app;
```

---

## ✅ CHECKLIST

- [ ] Instalar Zod: `npm install zod`
- [ ] Crear utils (ApiError, ApiResponse)
- [ ] Crear middlewares (errorHandler, asyncHandler, validateRequest)
- [ ] Crear validators (routineSchemas.js)
- [ ] Crear service (routineService.js)
- [ ] Crear controller (routineController.js)
- [ ] Refactorizar routes
- [ ] Actualizar server index
- [ ] Probar endpoints
- [ ] Validar error handling
- [ ] Actualizar frontend si necesario

---

## 🎯 BENEFICIOS

✅ Código más limpio y mantenible  
✅ Validación robusta con Zod  
✅ Errores claros y útiles  
✅ Transacciones para operaciones críticas  
✅ Separación de responsabilidades  
✅ API responses consistentes  
✅ Fácil de testear  
✅ Fácil de extender  

---

**PRÓXIMO PASO**: Implementar cada paso en orden
