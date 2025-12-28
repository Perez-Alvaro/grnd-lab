/**
 * Utilidades para transformar rutinas entre el formato del editor
 * y el formato de la API/base de datos
 */

/**
 * Convierte una rutina del formato del editor al formato de la API
 * @param {Object} editorRoutine - Rutina en formato del editor
 * @returns {Object} Rutina en formato API
 */
export function editorToAPI(editorRoutine) {
  if (!editorRoutine) return null;

  const { meta, semanas, id } = editorRoutine;

  return {
    ...(id && { id }),
    meta: {
      nombre: meta?.nombre || 'Rutina sin nombre',
      foco: meta?.foco || '',
      nivel: meta?.nivel || 'todos',
      duracion: meta?.duracion || null,
      frecuencia: meta?.frecuencia || null,
      equipamiento: meta?.equipamiento || null,
      autor: meta?.autor || '',
      descripcion: meta?.descripcion || '',
      tags: meta?.tags || [],
      imagen: meta?.imagen || '',
      precio: meta?.precio || 0,
    },
    semanas: semanas || [],
  };
}

/**
 * Convierte una rutina del formato de la API al formato del editor
 * @param {Object} apiRoutine - Rutina en formato API
 * @returns {Object} Rutina en formato editor
 */
export function apiToEditor(apiRoutine) {
  if (!apiRoutine) return null;

  return {
    id: apiRoutine.id,
    meta: {
      nombre: apiRoutine.nombre,
      foco: apiRoutine.foco,
      nivel: apiRoutine.nivel,
      duracion: apiRoutine.duracion,
      frecuencia: apiRoutine.frecuencia,
      equipamiento: apiRoutine.equipamiento,
      autor: apiRoutine.autor,
      descripcion: apiRoutine.descripcion,
      tags: apiRoutine.tags || [],
      imagen: apiRoutine.imagen,
      precio: apiRoutine.precio,
    },
    semanas: apiRoutine.semanas || [],
  };
}

/**
 * Convierte un array de rutinas de API a formato editor
 * @param {Array} apiRoutines - Array de rutinas en formato API
 * @returns {Array} Array de rutinas en formato editor
 */
export function apiRoutinesToEditor(apiRoutines) {
  if (!Array.isArray(apiRoutines)) return [];
  return apiRoutines.map(apiToEditor);
}

/**
 * Crea una estructura de rutina vacía para el editor
 * @returns {Object} Rutina vacía
 */
export function createEmptyRoutine() {
  return {
    meta: {
      nombre: 'Nueva Rutina',
      foco: '',
      nivel: 'todos',
      duracion: 4,
      frecuencia: 3,
      equipamiento: 'gimnasio',
      autor: '',
      descripcion: '',
      tags: [],
      imagen: '',
      precio: 0,
    },
    semanas: [{
      id: crypto.randomUUID(),
      nombre: 'Semana 1',
      resumen: '',
      notas: '',
      dias: [{
        id: crypto.randomUUID(),
        nombre: 'Día 1',
        tipo: 'ENTRENAMIENTO',
        notaRecuperacion: '',
        bloques: [{
          id: crypto.randomUUID(),
          tipo: 'ENTRENAMIENTO',
          ejercicios: [{
            id: crypto.randomUUID(),
            nombre: '',
            series: 3,
            reps: '10',
            duracion: '',
            descanso: '60s',
            rpe: '',
            tempo: '',
            cues: '',
            progresion: '',
            video: '',
            notas: '',
          }],
        }],
      }],
    }],
  };
}
