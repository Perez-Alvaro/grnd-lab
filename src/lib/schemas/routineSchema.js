/**
 * Routine Forge - JSON Schema Validation
 * 
 * Defines the normalized schema for training routines and provides
 * validation functions with detailed error reporting.
 */

// ============================================
// SCHEMA DEFINITION
// ============================================

/**
 * Normalized routine schema structure:
 * 
 * {
 *   id: string,
 *   meta: {
 *     nombre: string (required),
 *     foco: string (objetivo de entrenamiento),
 *     nivel: 'novato' | 'intermedio' | 'avanzado',
 *     duracion: number (semanas),
 *     frecuencia: number (días/semana),
 *     equipamiento: 'casa' | 'gimnasio' | 'bandas' | 'mixto',
 *     autor: string,
 *     descripcion: string,
 *     tags: string[],
 *     imagen: string (URL),
 *     precio: number
 *   },
 *   semanas: [{
 *     id: string,
 *     nombre: string,
 *     resumen: string,
 *     notas: string,
 *     dias: [{
 *       id: string,
 *       nombre: string,
 *       tipo: 'ENTRENAMIENTO' | 'DESCANSO',
 *       notaRecuperacion: string,
 *       bloques: [{
 *         id: string,
 *         tipo: 'ENTRENAMIENTO' | 'CARDIO' | 'MOVILIDAD',
 *         ejercicios: [{
 *           id: string,
 *           nombre: string (required),
 *           series: number,
 *           reps: string | number,
 *           duracion: string,
 *           descanso: string,
 *           rpe: string | number,
 *           tempo: string,
 *           cues: string,
 *           progresion: string,
 *           video: string (URL),
 *           notas: string
 *         }]
 *       }]
 *     }]
 *   }]
 * }
 */

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validation result structure
 */
class ValidationResult {
  constructor() {
    this.isValid = true;
    this.errors = [];
  }

  addError(path, message) {
    this.isValid = false;
    this.errors.push({ path, message });
  }

  getErrors() {
    return this.errors;
  }

  getErrorMessages() {
    return this.errors.map(err => `${err.path}: ${err.message}`);
  }
}

// ============================================
// FIELD VALIDATORS
// ============================================

const isValidString = (value, minLength = 0) => {
  return typeof value === 'string' && value.trim().length >= minLength;
};

const isValidNumber = (value, min = 0, max = Infinity) => {
  return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
};

const isValidEnum = (value, allowed) => {
  return allowed.includes(value);
};

const isValidArray = (value, minLength = 0) => {
  return Array.isArray(value) && value.length >= minLength;
};

const isValidUrl = (value) => {
  if (!value) return true; // URLs are optional
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// ============================================
// ENTITY VALIDATORS
// ============================================

/**
 * Validate exercise data
 */
function validateExercise(exercise, path = 'ejercicio') {
  const result = new ValidationResult();

  // Required fields
  if (!exercise?.nombre || !isValidString(exercise.nombre, 1)) {
    result.addError(`${path}.nombre`, 'El nombre del ejercicio es requerido y debe tener al menos 1 carácter');
  }

  // Optional but typed fields
  if (exercise?.series !== undefined && !isValidNumber(exercise.series, 1, 100)) {
    result.addError(`${path}.series`, 'Series debe ser un número entre 1 y 100');
  }

  if (exercise?.rpe !== undefined) {
    const rpeNum = typeof exercise.rpe === 'string' ? parseFloat(exercise.rpe) : exercise.rpe;
    if (isNaN(rpeNum) || rpeNum < 1 || rpeNum > 10) {
      result.addError(`${path}.rpe`, 'RPE debe ser un número entre 1 y 10');
    }
  }

  if (exercise?.video && !isValidUrl(exercise.video)) {
    result.addError(`${path}.video`, 'La URL del video no es válida');
  }

  return result;
}

/**
 * Validate block data
 */
function validateBlock(block, path = 'bloque', dayType = 'ENTRENAMIENTO') {
  const result = new ValidationResult();

  // Type validation
  const allowedBlockTypes = ['ENTRENAMIENTO', 'CARDIO', 'MOVILIDAD'];
  if (block?.tipo && !isValidEnum(block.tipo, allowedBlockTypes)) {
    result.addError(`${path}.tipo`, `Tipo de bloque debe ser uno de: ${allowedBlockTypes.join(', ')}`);
  }

  // Exercises validation (only required for training days)
  if (dayType === 'ENTRENAMIENTO') {
    if (!isValidArray(block?.ejercicios, 1)) {
      result.addError(`${path}.ejercicios`, 'Un bloque de entrenamiento debe tener al menos 1 ejercicio');
    } else {
      block.ejercicios.forEach((ejercicio, idx) => {
        const exResult = validateExercise(ejercicio, `${path}.ejercicios[${idx}]`);
        if (!exResult.isValid) {
          result.errors.push(...exResult.errors);
          result.isValid = false;
        }
      });
    }
  }

  return result;
}

/**
 * Validate day data
 */
function validateDay(day, path = 'dia') {
  const result = new ValidationResult();

  // Required fields
  if (!day?.nombre || !isValidString(day.nombre, 1)) {
    result.addError(`${path}.nombre`, 'El nombre del día es requerido');
  }

  // Type validation
  const allowedDayTypes = ['ENTRENAMIENTO', 'DESCANSO'];
  if (!day?.tipo || !isValidEnum(day.tipo, allowedDayTypes)) {
    result.addError(`${path}.tipo`, `Tipo de día debe ser: ${allowedDayTypes.join(' o ')}`);
  }

  // Blocks validation (only for training days)
  if (day?.tipo === 'ENTRENAMIENTO') {
    if (!isValidArray(day?.bloques)) {
      // If no blocks, check for exercises at day level (legacy support)
      if (!isValidArray(day?.ejercicios, 1)) {
        result.addError(`${path}.bloques`, 'Un día de entrenamiento debe tener al menos 1 bloque o ejercicio');
      }
    } else {
      day.bloques.forEach((bloque, idx) => {
        const blockResult = validateBlock(bloque, `${path}.bloques[${idx}]`, day.tipo);
        if (!blockResult.isValid) {
          result.errors.push(...blockResult.errors);
          result.isValid = false;
        }
      });
    }
  }

  return result;
}

/**
 * Validate week data
 */
function validateWeek(week, path = 'semana') {
  const result = new ValidationResult();

  // Required fields
  if (!week?.nombre || !isValidString(week.nombre, 1)) {
    result.addError(`${path}.nombre`, 'El nombre de la semana es requerido');
  }

  // Days validation
  if (!isValidArray(week?.dias, 1)) {
    result.addError(`${path}.dias`, 'Una semana debe tener al menos 1 día');
  } else {
    week.dias.forEach((dia, idx) => {
      const dayResult = validateDay(dia, `${path}.dias[${idx}]`);
      if (!dayResult.isValid) {
        result.errors.push(...dayResult.errors);
        result.isValid = false;
      }
    });
  }

  return result;
}

/**
 * Validate routine metadata
 */
function validateMetadata(meta, path = 'meta') {
  const result = new ValidationResult();

  // Required fields
  if (!meta?.nombre || !isValidString(meta.nombre, 1)) {
    result.addError(`${path}.nombre`, 'El nombre de la rutina es requerido');
  }

  // Optional enum fields
  if (meta?.nivel) {
    const allowedLevels = ['novato', 'intermedio', 'avanzado', 'todos'];
    if (!isValidEnum(meta.nivel.toLowerCase(), allowedLevels)) {
      result.addError(`${path}.nivel`, `Nivel debe ser: ${allowedLevels.join(', ')}`);
    }
  }

  if (meta?.equipamiento) {
    const allowedEquipment = ['casa', 'gimnasio', 'bandas', 'mixto'];
    if (!isValidEnum(meta.equipamiento.toLowerCase(), allowedEquipment)) {
      result.addError(`${path}.equipamiento`, `Equipamiento debe ser: ${allowedEquipment.join(', ')}`);
    }
  }

  // Optional numeric fields
  if (meta?.duracion !== undefined && !isValidNumber(meta.duracion, 1, 52)) {
    result.addError(`${path}.duracion`, 'Duración debe ser entre 1 y 52 semanas');
  }

  if (meta?.frecuencia !== undefined && !isValidNumber(meta.frecuencia, 1, 7)) {
    result.addError(`${path}.frecuencia`, 'Frecuencia debe ser entre 1 y 7 días/semana');
  }

  if (meta?.precio !== undefined && !isValidNumber(meta.precio, 0)) {
    result.addError(`${path}.precio`, 'Precio debe ser un número positivo');
  }

  // Optional URL fields
  if (meta?.imagen && !isValidUrl(meta.imagen)) {
    result.addError(`${path}.imagen`, 'La URL de la imagen no es válida');
  }

  // Optional array fields
  if (meta?.tags !== undefined && !isValidArray(meta.tags)) {
    result.addError(`${path}.tags`, 'Tags debe ser un array');
  }

  return result;
}

/**
 * Validate complete routine schema
 */
export function validateRoutineSchema(routine) {
  const result = new ValidationResult();

  // Top-level structure
  if (!routine || typeof routine !== 'object') {
    result.addError('root', 'La rutina debe ser un objeto válido');
    return result;
  }

  // Metadata validation
  if (!routine.meta) {
    result.addError('meta', 'La rutina debe tener metadatos (campo "meta")');
  } else {
    const metaResult = validateMetadata(routine.meta);
    if (!metaResult.isValid) {
      result.errors.push(...metaResult.errors);
      result.isValid = false;
    }
  }

  // Weeks validation
  if (!isValidArray(routine?.semanas, 1)) {
    result.addError('semanas', 'La rutina debe tener al menos 1 semana');
  } else {
    routine.semanas.forEach((semana, idx) => {
      const weekResult = validateWeek(semana, `semanas[${idx}]`);
      if (!weekResult.isValid) {
        result.errors.push(...weekResult.errors);
        result.isValid = false;
      }
    });
  }

  return result;
}

// ============================================
// CONVENIENCE EXPORTS
// ============================================

export {
  validateMetadata,
  validateWeek,
  validateDay,
  validateBlock,
  validateExercise,
  ValidationResult
};
