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
    _format: 'grnd-lab-v1',  // Marca de formato para re-importación
    id: metadata.id || createId(),
    meta: {
      nombre: metadata.name || '',
      foco: metadata.objective || '',
      nivel: metadata.level || '',
      duracion: parseInt(metadata.durationWeeks, 10) || weeks.length,
      frecuencia: parseInt(metadata.frequency, 10) || 0,
      equipamiento: metadata.equipment || 'gimnasio',
      genero: metadata.gender || '',
      autor: metadata.author || '',
      descripcion: metadata.description || '',
      notas: metadata.notes || '',
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
        tipo: (day.type || 'ENTRENAMIENTO').toUpperCase(),
        notaRecuperacion: day.recoveryNote || '',
        bloques: (day.type || '').toUpperCase() === 'DESCANSO'
          ? []
          : [{
            id: createId(),
            tipo: 'ENTRENAMIENTO',
            ejercicios: (day.exercises || []).map(exercise => ({
              id: exercise.id || createId(),
              nombre: exercise.name || '',
              series: parseInt(exercise.sets, 10) || 0,
              reps: String(exercise.reps || ''),
              duracion: exercise.duration || '',
              descanso: exercise.rest || '',
              rpe: String(exercise.rir || ''),
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
 * Detecta el formato del JSON importado
 * @returns 'spanish' | 'ai' | 'internal' | 'unknown'
 */
function detectFormat(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') return 'unknown';
  // Formato exportación español: tiene meta + semanas
  if (jsonData.semanas && Array.isArray(jsonData.semanas)) return 'spanish';
  // Formato Prompt Maestro / IA: tiene weeks con days y exercises flat
  if (jsonData.weeks && Array.isArray(jsonData.weeks)) return 'ai';
  return 'unknown';
}

/**
 * Convierte el formato del Prompt Maestro (inglés) al formato interno del editor
 * Formato IA: { name, description, metadata:{author,gender,objective,level,frequency,durationWeeks,tags}, weeks:[{name,days:[{name,type,exercises:[{name,sets,reps,rir,rest,tempo,notes,video}]}]}] }
 * @param {Object} jsonData - JSON generado por la IA
 * @returns {Object} { success, data?, errors? }
 */
function importFromAIFormat(jsonData) {
  try {
    // Extraer metadatos: la IA puede usar jsonData.metadata o campos directos en jsonData
    const aiMeta = jsonData.metadata || {};

    // Validación mínima: necesitamos al menos weeks con contenido
    if (!jsonData.weeks || !Array.isArray(jsonData.weeks) || jsonData.weeks.length === 0) {
      return {
        success: false,
        errors: ['El JSON no contiene semanas (campo "weeks"). Aseguráte de copiar el JSON completo que generó la IA.']
      };
    }

    const editorData = {
      metadata: {
        id: jsonData.id || createId(),
        name: jsonData.name || aiMeta.name || aiMeta.nombre || '',
        gender: aiMeta.gender || aiMeta.genero || '',
        objective: aiMeta.objective || aiMeta.foco || '',
        durationWeeks: String(aiMeta.durationWeeks || aiMeta.duracion || jsonData.weeks.length || 4),
        frequency: String(aiMeta.frequency || aiMeta.frecuencia || ''),
        level: aiMeta.level || aiMeta.nivel || '',
        equipment: aiMeta.equipment || aiMeta.equipamiento || '',
        description: jsonData.description || aiMeta.description || aiMeta.descripcion || '',
        notes: aiMeta.notes || aiMeta.notas || '',
        author: aiMeta.author || aiMeta.autor || '',
        tags: Array.isArray(aiMeta.tags)
          ? aiMeta.tags.join(', ')
          : (typeof aiMeta.tags === 'string' ? aiMeta.tags : ''),
        image: aiMeta.image || aiMeta.imagen || '',
        price: String(aiMeta.price || aiMeta.precio || ''),
      },
      weeks: jsonData.weeks.map((week, weekIdx) => ({
        id: week.id || createId(),
        title: week.name || week.nombre || week.title || `Semana ${weekIdx + 1}`,
        summary: week.summary || week.resumen || '',
        notes: week.notes || week.notas || '',
        days: (week.days || week.dias || []).map((day, dayIdx) => {
          // Normalizar tipo: 'training'/'rest'/'ENTRENAMIENTO'/'DESCANSO' etc.
          const rawType = (day.type || day.tipo || 'training').toLowerCase().trim();
          const isRest = rawType === 'rest' || rawType === 'descanso' || rawType === 'off';
          const typeNormalized = isRest ? 'DESCANSO' : 'ENTRENAMIENTO';

          // Ejercicios: la IA los pone directo en day.exercises (flat, sin bloques)
          const rawExercises = day.exercises || day.ejercicios ||
            (day.bloques ? day.bloques.flatMap(b => b.ejercicios || b.exercises || []) : []);

          // Entrada en calor: campo warmup del formato IA
          const rawWarmup = day.warmup || day.entradaEnCalor || [];

          return {
            id: day.id || createId(),
            name: day.name || day.nombre || `Día ${dayIdx + 1}`,
            type: typeNormalized,
            recoveryNote: day.recoveryNote || day.notaRecuperacion || day.notes || '',
            warmupExercises: isRest ? [] : rawWarmup.map(ex => ({
              name: ex.name || ex.nombre || '',
              duration: ex.duration || ex.duracion || '',
              notes: ex.notes || ex.notas || '',
            })),
            exercises: isRest ? [] : rawExercises.map(ex => ({
              id: ex.id || createId(),
              name: ex.name || ex.nombre || '',
              sets: String(ex.sets || ex.series || ''),
              reps: String(ex.reps || ''),
              duration: ex.duration || ex.duracion || '',
              rest: ex.rest || ex.descanso || '',
              rir: String(ex.rir || ex.rpe || ''),
              tempo: ex.tempo || '',
              cues: ex.cues || '',
              progression: ex.progression || ex.progresion || '',
              video: ex.video || '',
              note: ex.notes || ex.note || ex.notas || '',
            }))
          };
        })
      }))
    };

    return { success: true, data: editorData };
  } catch (error) {
    return {
      success: false,
      errors: [`Error al procesar el JSON de la IA: ${error.message}`]
    };
  }
}

/**
 * Importador universal: detecta el formato del JSON y lo convierte al formato interno del editor.
 * Acepta:
 *   - Formato Prompt Maestro / IA  ({ name, metadata, weeks[].days[].exercises[] })
 *   - Formato exportación español  ({ meta, semanas[].dias[].bloques[].ejercicios[] })
 * @param {Object} jsonData - JSON a importar
 * @returns {{ success: boolean, data?: Object, errors?: string[] }}
 */
export function universalImport(jsonData) {
  const format = detectFormat(jsonData);

  if (format === 'spanish') {
    // Usar el pipeline original que ya valida con routineSchema
    return importToEditor(jsonData);
  }

  if (format === 'ai') {
    return importFromAIFormat(jsonData);
  }

  return {
    success: false,
    errors: [
      'Formato de JSON no reconocido. El archivo debe ser un JSON exportado desde Grind-Lab o generado por la IA con el Prompt Maestro.',
      'Formatos válidos: { semanas: [...] } (exportación) o { weeks: [...] } (formato IA)'
    ]
  };
}

/**
 * Transform imported JSON to editor internal format (formato español/exportación)
 * Validates schema first, then converts to editor structure
 * @param {Object} jsonData - Imported JSON in Spanish export format
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
        days: (semana.dias || []).map(dia => {
          // Normalizar tipo: acepta "descanso", "Descanso", "DESCANSO", etc.
          const tipoNormalizado = (dia.tipo || 'ENTRENAMIENTO').toUpperCase().trim();
          const tipoFinal = tipoNormalizado === 'DESCANSO' ? 'DESCANSO' : 'ENTRENAMIENTO';
          return {
            id: dia.id || createId(),
            name: dia.nombre || '',
            type: tipoFinal,
            recoveryNote: dia.notaRecuperacion || '',
            exercises: tipoFinal === 'DESCANSO'
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
          };
        })
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
      days: week.days.map((day, dayIdx) => ({
        name: day.name || '',
        type: day.type || 'ENTRENAMIENTO',
        recoveryMessage: day.recoveryNote || '',
        notes: day.recoveryNote || '',
        dayNumber: dayIdx + 1,
        warmupExercises: (day.warmupExercises || []).map(ex => ({
          name: ex.name || '',
          duration: ex.duration || '',
          notes: ex.notes || '',
        })),
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
  universalImport,
  editorToPDF,
  migrateLegacyTemplate,
  sanitizeRoutineData
};
