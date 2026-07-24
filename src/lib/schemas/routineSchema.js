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

const isValidEnum = (value, allowed) => {
  return allowed.includes(value);
};

const isValidArray = (value, minLength = 0) => {
  return Array.isArray(value) && value.length >= minLength;
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
  if (exercise?.series !== undefined && exercise.series !== null && exercise.series !== '') {
    const seriesNum = typeof exercise.series === 'string' ? parseInt(exercise.series, 10) : exercise.series;
    if (!isNaN(seriesNum) && (seriesNum < 0 || seriesNum > 200)) {
      result.addError(`${path}.series`, 'Series debe ser un número entre 0 y 200');
    }
  }

  // RPE: solo validar si el valor existe y no es 0/nulo/vacío
  if (exercise?.rpe !== undefined && exercise.rpe !== null && exercise.rpe !== '' && exercise.rpe !== 0) {
    const rpeNum = typeof exercise.rpe === 'string' ? parseFloat(exercise.rpe) : exercise.rpe;
    if (!isNaN(rpeNum) && (rpeNum < 0 || rpeNum > 10)) {
      result.addError(`${path}.rpe`, 'RPE debe ser un número entre 0 y 10');
    }
  }

  // El campo video es opcional y no se valida su formato (nunca debe bloquear la importación)

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

  // Type validation: si no es DESCANSO, se trata como ENTRENAMIENTO
  const allowedDayTypes = ['ENTRENAMIENTO', 'DESCANSO'];
  const effectiveDayType = (day?.tipo && allowedDayTypes.includes(day.tipo)) ? day.tipo : 'ENTRENAMIENTO';

  // Blocks validation (only for non-rest days)
  if (effectiveDayType === 'ENTRENAMIENTO') {
    if (!isValidArray(day?.bloques)) {
      // If no blocks, check for exercises at day level (legacy support)
      // Only warn, don't block import
    } else {
      day.bloques.forEach((bloque, idx) => {
        const blockResult = validateBlock(bloque, `${path}.bloques[${idx}]`, effectiveDayType);
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

  // Optional enum fields: se aceptan valores desconocidos (la IA puede generar variantes)
  // No se bloquea la importación por nivel o equipamiento fuera de enum

  // Optional numeric fields: solo advertir si los valores son extremos, no bloquear
  if (meta?.duracion !== undefined && meta.duracion !== null && meta.duracion !== '') {
    const dur = typeof meta.duracion === 'string' ? parseInt(meta.duracion, 10) : meta.duracion;
    if (!isNaN(dur) && dur < 0) {
      result.addError(`${path}.duracion`, 'Duración no puede ser negativa');
    }
  }

  if (meta?.frecuencia !== undefined && meta.frecuencia !== null && meta.frecuencia !== '') {
    const frec = typeof meta.frecuencia === 'string' ? parseInt(meta.frecuencia, 10) : meta.frecuencia;
    if (!isNaN(frec) && (frec < 0 || frec > 14)) {
      result.addError(`${path}.frecuencia`, 'Frecuencia debe ser entre 0 y 14 días/semana');
    }
  }

  // precio: solo verificar que sea positivo si existe
  if (meta?.precio !== undefined && meta.precio !== null && meta.precio !== '') {
    const precio = typeof meta.precio === 'string' ? parseFloat(meta.precio) : meta.precio;
    if (!isNaN(precio) && precio < 0) {
      result.addError(`${path}.precio`, 'Precio debe ser un número positivo');
    }
  }

  // El campo imagen es opcional y no se valida su formato

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
