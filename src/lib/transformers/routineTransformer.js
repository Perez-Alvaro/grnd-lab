/**
 * Routine Forge - Data Transformers
 * 
 * Bidirectional transformations between different data representations:
 * - Editor internal format ↔ Normalized JSON export
 * - Editor internal format ↔ PDF render format
 * - Legacy format → Editor internal format (migration)
 */

import { validateRoutineSchema } from '../schemas/routineSchema.js';

const createId = () => Math.random().toString(36).slice(2, 10);

// ============================================
// EDITOR TO EXPORT (JSON)
// ============================================

/**
 * Transform editor internal format to clean export JSON
 * @param {Object} planData - Editor plan data from useRoutineEditor
 * @returns {Object} Normalized JSON for export
 */
export function editorToExport(planData) {
  const { metadata, weeks } = planData;

  const exportData = {
    id: metadata.id || createId(),
    meta: {
      nombre: metadata.name || '',
      foco: metadata.objective || '',
      nivel: metadata.level?.toLowerCase() || '',
      duracion: parseInt(metadata.durationWeeks, 10) || weeks.length,
      frecuencia: parseInt(metadata.frequency, 10) || 0,
      equipamiento: metadata.equipment?.toLowerCase() || 'gimnasio',
      autor: metadata.author || '',
      descripcion: metadata.description || '',
      tags: Array.isArray(metadata.tags) 
        ? metadata.tags 
        : metadata.tags?.split(',').map(t => t.trim()).filter(Boolean) || [],
      imagen: metadata.image || '',
      precio: parseFloat(metadata.price) || 0,
    },
    semanas: weeks.map((week, weekIdx) => ({
      id: week.id || createId(),
      nombre: week.title || `Semana ${weekIdx + 1}`,
      resumen: week.summary || '',
      notas: week.notes || '',
      dias: week.days.map((day, dayIdx) => ({
        id: day.id || createId(),
        nombre: day.name || `Día ${dayIdx + 1}`,
        tipo: day.type || 'ENTRENAMIENTO',
        notaRecuperacion: day.recoveryNote || '',
        bloques: day.type === 'DESCANSO' 
          ? []
          : [{
              id: createId(),
              tipo: 'ENTRENAMIENTO',
              ejercicios: (day.exercises || []).map(exercise => ({
                id: exercise.id || createId(),
                nombre: exercise.name || '',
                series: parseInt(exercise.sets, 10) || 0,
                reps: exercise.reps || '',
                duracion: exercise.duration || '',
                descanso: exercise.rest || '',
                rpe: exercise.rir || '',
                tempo: exercise.tempo || '',
                cues: exercise.cues || '',
                progresion: exercise.progression || '',
                video: exercise.video || '',
                notas: exercise.note || '',
              }))
            }]
      }))
    }))
  };

  return exportData;
}

// ============================================
// IMPORT TO EDITOR
// ============================================

/**
 * Transform imported JSON to editor internal format
 * Validates schema first, then converts to editor structure
 * @param {Object} jsonData - Imported JSON (normalized or legacy)
 * @returns {Object} { success: boolean, data?: Object, errors?: string[] }
 */
export function importToEditor(jsonData) {
  // Validate schema first
  const validation = validateRoutineSchema(jsonData);
  
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.getErrorMessages()
    };
  }

  try {
    const { meta, semanas } = jsonData;

    const editorData = {
      metadata: {
        id: jsonData.id,
        name: meta.nombre || '',
        gender: meta.genero || '',
        objective: meta.foco || '',
        durationWeeks: String(meta.duracion || semanas?.length || 1),
        frequency: String(meta.frecuencia || ''),
        level: meta.nivel || '',
        equipment: meta.equipamiento || '',
        description: meta.descripcion || '',
        notes: meta.notas || '',
        author: meta.autor || '',
        tags: Array.isArray(meta.tags) ? meta.tags.join(', ') : '',
        image: meta.imagen || '',
        price: String(meta.precio || ''),
      },
      weeks: (semanas || []).map(semana => ({
        id: semana.id || createId(),
        title: semana.nombre || '',
        summary: semana.resumen || '',
        notes: semana.notas || '',
        days: (semana.dias || []).map(dia => ({
          id: dia.id || createId(),
          name: dia.nombre || '',
          type: dia.tipo || 'ENTRENAMIENTO',
          recoveryNote: dia.notaRecuperacion || '',
          exercises: dia.tipo === 'DESCANSO' 
            ? []
            : (dia.bloques || [])
                .flatMap(bloque => bloque.ejercicios || [])
                .map(ejercicio => ({
                  id: ejercicio.id || createId(),
                  name: ejercicio.nombre || '',
                  sets: String(ejercicio.series || ''),
                  reps: String(ejercicio.reps || ''),
                  duration: ejercicio.duracion || '',
                  rest: ejercicio.descanso || '',
                  rir: String(ejercicio.rpe || ''),
                  tempo: ejercicio.tempo || '',
                  cues: ejercicio.cues || '',
                  progression: ejercicio.progresion || '',
                  video: ejercicio.video || '',
                  note: ejercicio.notas || '',
                }))
        }))
      }))
    };

    return {
      success: true,
      data: editorData
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Error al transformar datos: ${error.message}`]
    };
  }
}

// ============================================
// EDITOR TO PDF
// ============================================

/**
 * Transform editor format to PDF render format
 * @param {Object} planData - Editor plan data
 * @returns {Object} PDF-ready data structure
 */
export function editorToPDF(planData) {
  const { metadata, weeks } = planData;

  return {
    title: metadata.name || 'Plan de Entrenamiento',
    planName: metadata.name || '',
    objective: metadata.objective || '',
    duration: metadata.durationWeeks ? `${metadata.durationWeeks} semanas` : '',
    frequency: metadata.frequency ? `${metadata.frequency} días/semana` : '',
    author: metadata.author || '',
    notes: metadata.notes || '',
    description: metadata.description || '',
    level: metadata.level || '',
    durationWeeks: metadata.durationWeeks || '',
    weeks: weeks.map((week, index) => ({
      number: index + 1,
      title: week.title || `Semana ${index + 1}`,
      summary: week.summary || '',
      notes: week.notes ? [week.notes] : [],
      days: week.days.map(day => ({
        name: day.name || '',
        type: day.type || 'ENTRENAMIENTO',
        recoveryMessage: day.recoveryNote || '',
        notes: day.recoveryNote || '',
        exercises: (day.exercises || []).map(exercise => ({
          name: exercise.name || '',
          series: exercise.sets || '',
          reps: exercise.reps || '',
          descanso: exercise.rest || '',
          rir: exercise.rir || '',
          cadencia: exercise.tempo || '',
          videoUrl: exercise.video || '',
          notes: exercise.note || '',
        }))
      }))
    }))
  };
}

// ============================================
// LEGACY MIGRATION
// ============================================

/**
 * Enhanced migration from legacy template format
 * Extends existing migrateTemplate functionality
 * @param {Object} legacyTemplate - Old template format
 * @returns {Object} Editor-compatible format
 */
export function migrateLegacyTemplate(legacyTemplate) {
  if (!legacyTemplate) return null;

  // Check if already normalized
  if (legacyTemplate.meta && legacyTemplate.semanas) {
    return importToEditor(legacyTemplate).data;
  }

  // Legacy format with weeks array
  if (legacyTemplate.weeks) {
    return {
      metadata: {
        name: legacyTemplate.name || '',
        gender: legacyTemplate.gender || '',
        objective: legacyTemplate.objective || '',
        durationWeeks: String(legacyTemplate.duration || legacyTemplate.weeks.length),
        frequency: String(legacyTemplate.frequency || ''),
        level: legacyTemplate.level || '',
        description: legacyTemplate.description || '',
        notes: legacyTemplate.notes || '',
        author: legacyTemplate.author || '',
        tags: Array.isArray(legacyTemplate.tags) ? legacyTemplate.tags.join(', ') : '',
        image: legacyTemplate.image || '',
        price: String(legacyTemplate.price || ''),
      },
      weeks: legacyTemplate.weeks
    };
  }

  // Oldest legacy format with days only
  return {
    metadata: {
      name: legacyTemplate.name || '',
      gender: legacyTemplate.gender || '',
      objective: legacyTemplate.objective || '',
      durationWeeks: '1',
      frequency: String(legacyTemplate.frequency || ''),
      level: legacyTemplate.level || '',
      description: legacyTemplate.description || '',
      notes: legacyTemplate.notes || '',
      author: legacyTemplate.author || '',
      tags: Array.isArray(legacyTemplate.tags) ? legacyTemplate.tags.join(', ') : '',
      image: legacyTemplate.image || '',
      price: String(legacyTemplate.price || ''),
    },
    weeks: [{
      id: createId(),
      title: 'Semana 1',
      summary: '',
      notes: '',
      days: legacyTemplate.days || []
    }]
  };
}

// ============================================
// SANITIZERS
// ============================================

/**
 * Sanitize and normalize routine data before save/export
 * @param {Object} data - Routine data
 * @returns {Object} Sanitized data
 */
export function sanitizeRoutineData(data) {
  if (!data) return data;

  // Remove empty strings, normalize whitespace
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim() || '';
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
    return obj;
  };

  return sanitizeObject(data);
}

// ============================================
// EXPORTS
// ============================================

export default {
  editorToExport,
  importToEditor,
  editorToPDF,
  migrateLegacyTemplate,
  sanitizeRoutineData
};
