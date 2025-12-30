/**
 * Block Detector - Detecta tipos de bloques de entrenamiento automáticamente
 * 
 * Detecta bloques basándose en:
 * 1. Campo explícito `exercise.type` o `exercise.blockType`
 * 2. Keywords en nombre del ejercicio
 * 3. Heurísticas de posición (primeros/últimos ejercicios)
 * 4. Heurísticas de intensidad (RIR bajo = principal)
 */

export const BLOCK_TYPES = {
  WARMUP: 'warmup',
  MAIN: 'main',
  ACCESSORY: 'accessory',
  CORE: 'core',
  COOLDOWN: 'cooldown',
};

export const BLOCK_NAMES = {
  warmup: 'Entrada en Calor',
  main: 'Bloque Principal',
  accessory: 'Accesorios',
  core: 'Core',
  cooldown: 'Elongación',
};

export const BLOCK_ICONS = {
  warmup: '🔥',
  main: '⚡',
  accessory: '🔧',
  core: '💪',
  cooldown: '🧘',
};

// Keywords para detectar cada tipo de bloque
const KEYWORDS = {
  warmup: [
    'movilidad', 'mobility', 'calent', 'warm', 'activación', 'activation',
    'cardio ligero', 'trote', 'jog', 'dinamico', 'dynamic'
  ],
  core: [
    'plank', 'plancha', 'abdom', 'core', 'crunch', 'sit up', 'russian twist',
    'dead bug', 'hollow', 'bird dog', 'oblicuo', 'oblique'
  ],
  cooldown: [
    'estiram', 'stretch', 'elong', 'cool down', 'vuelta calma', 'relaj',
    'foam roll', 'rodillo', 'movilidad pasiva'
  ],
  accessory: [
    'accesorio', 'accessory', 'auxiliar', 'auxiliary', 'aislamiento', 'isolation',
    'unilateral', 'curl', 'extension', 'elevacion', 'raise'
  ],
};

/**
 * Detecta el tipo de bloque de un ejercicio
 * @param {Object} exercise - Objeto del ejercicio
 * @param {number} index - Índice del ejercicio en el array
 * @param {Array} allExercises - Array completo de ejercicios del día
 * @returns {string} - Tipo de bloque (BLOCK_TYPES)
 */
export const detectBlockType = (exercise, index, allExercises) => {
  const totalExercises = allExercises.length;
  
  // 1. Si el ejercicio tiene campo `type` o `blockType` explícito
  if (exercise.blockType) {
    const type = exercise.blockType.toLowerCase();
    if (type.includes('calent') || type.includes('warm')) return BLOCK_TYPES.WARMUP;
    if (type.includes('core') || type.includes('abdo')) return BLOCK_TYPES.CORE;
    if (type.includes('elong') || type.includes('cool') || type.includes('stretch')) return BLOCK_TYPES.COOLDOWN;
    if (type.includes('acces') || type.includes('aux')) return BLOCK_TYPES.ACCESSORY;
    if (type.includes('principal') || type.includes('main')) return BLOCK_TYPES.MAIN;
  }

  // Similar check para `exercise.type`
  if (exercise.type) {
    const type = exercise.type.toLowerCase();
    if (type.includes('calent') || type.includes('warm')) return BLOCK_TYPES.WARMUP;
    if (type.includes('core') || type.includes('abdo')) return BLOCK_TYPES.CORE;
    if (type.includes('elong') || type.includes('cool') || type.includes('stretch')) return BLOCK_TYPES.COOLDOWN;
    if (type.includes('acces') || type.includes('aux')) return BLOCK_TYPES.ACCESSORY;
    if (type.includes('principal') || type.includes('main')) return BLOCK_TYPES.MAIN;
  }
  
  // 2. Detectar por keywords en nombre del ejercicio
  const name = (exercise.name || '').toLowerCase();
  
  // Check warmup keywords
  if (KEYWORDS.warmup.some(keyword => name.includes(keyword))) {
    return BLOCK_TYPES.WARMUP;
  }
  
  // Check core keywords
  if (KEYWORDS.core.some(keyword => name.includes(keyword))) {
    return BLOCK_TYPES.CORE;
  }
  
  // Check cooldown keywords
  if (KEYWORDS.cooldown.some(keyword => name.includes(keyword))) {
    return BLOCK_TYPES.COOLDOWN;
  }
  
  // Check accessory keywords
  if (KEYWORDS.accessory.some(keyword => name.includes(keyword))) {
    return BLOCK_TYPES.ACCESSORY;
  }
  
  // 3. Heurísticas por posición
  // Primeros 1-2 ejercicios = calentamiento (si no es principal)
  if (index < 2 && totalExercises > 4) {
    // Solo si no tiene alta intensidad (RIR bajo)
    const rir = parseInt(exercise.rir);
    if (isNaN(rir) || rir > 3) {
      return BLOCK_TYPES.WARMUP;
    }
  }
  
  // Últimos 1-2 ejercicios = elongación (si no es principal)
  if (index >= totalExercises - 2 && totalExercises > 4) {
    const rir = parseInt(exercise.rir);
    if (isNaN(rir) || rir > 3) {
      return BLOCK_TYPES.COOLDOWN;
    }
  }
  
  // 4. Heurística por intensidad (RIR)
  // RIR 0-2 = ejercicio principal
  const rir = parseInt(exercise.rir);
  if (!isNaN(rir) && rir <= 2) {
    return BLOCK_TYPES.MAIN;
  }
  
  // RIR 3-4 = puede ser accesorio o principal
  if (!isNaN(rir) && rir <= 4) {
    // Si está en el medio del workout, probablemente sea principal
    if (index >= 2 && index < totalExercises - 2) {
      return BLOCK_TYPES.MAIN;
    }
    return BLOCK_TYPES.ACCESSORY;
  }
  
  // 5. Default: Si está en el medio del workout = principal
  if (index >= 2 && index < totalExercises - 2) {
    return BLOCK_TYPES.MAIN;
  }
  
  // 6. Fallback final
  return BLOCK_TYPES.MAIN;
};

/**
 * Agrupa ejercicios por bloques
 * @param {Array} exercises - Array de ejercicios
 * @returns {Array} - Array de bloques con ejercicios agrupados
 */
export const groupExercisesByBlock = (exercises) => {
  if (!exercises || exercises.length === 0) return [];
  
  const blocks = [];
  let currentBlock = null;
  
  exercises.forEach((exercise, index) => {
    const blockType = detectBlockType(exercise, index, exercises);
    
    // Si cambiamos de tipo de bloque, crear nuevo bloque
    if (!currentBlock || currentBlock.type !== blockType) {
      currentBlock = {
        type: blockType,
        name: BLOCK_NAMES[blockType],
        icon: BLOCK_ICONS[blockType],
        exercises: [],
      };
      blocks.push(currentBlock);
    }
    
    // Agregar ejercicio al bloque actual
    currentBlock.exercises.push(exercise);
  });
  
  return blocks;
};

/**
 * Detecta si un ejercicio es el primero de un nuevo bloque
 * @param {Object} exercise - Ejercicio actual
 * @param {number} index - Índice del ejercicio
 * @param {Array} allExercises - Todos los ejercicios
 * @returns {Object|null} - Info del bloque si es inicio, null si no
 */
export const isBlockStart = (exercise, index, allExercises) => {
  if (index === 0) {
    // Primer ejercicio siempre es inicio de bloque
    const blockType = detectBlockType(exercise, index, allExercises);
    return {
      type: blockType,
      name: BLOCK_NAMES[blockType],
      icon: BLOCK_ICONS[blockType],
    };
  }
  
  const currentType = detectBlockType(exercise, index, allExercises);
  const previousType = detectBlockType(allExercises[index - 1], index - 1, allExercises);
  
  if (currentType !== previousType) {
    return {
      type: currentType,
      name: BLOCK_NAMES[currentType],
      icon: BLOCK_ICONS[currentType],
    };
  }
  
  return null;
};

export default {
  BLOCK_TYPES,
  BLOCK_NAMES,
  BLOCK_ICONS,
  detectBlockType,
  groupExercisesByBlock,
  isBlockStart,
};
