// Mapeo entre DB enums (Supabase) y labels de UI (Product Owner)
export const OBJECTIVE_MAPPING = {
  // DB enum → UI label
  'muscle_gain': 'Volumen (Fuerza e Hipertrofia)',
  'fat_loss': 'Pérdida de Grasa (Fuerza y Resistencia)',
  'strength': 'Recomposición (Fuerza y Movilidad)',
  'endurance': 'Resistencia (Potencia Aeróbica)',
  // No usamos: mobility, general
};

// Descripciones completas según Product Owner
export const OBJECTIVE_DESCRIPTIONS = {
  'muscle_gain': 'Programación de hipertrofia estructurada con énfasis en palancas, progresión lineal y capacidad neural.',
  'fat_loss': 'Sesiones de fuerza metabolizada con bloques de conditioning y control de cargas para optimizar la recomposición.',
  'strength': 'Personalizamos los bloques semanales y la densidad de trabajo según tu misión principal.',
  'endurance': 'Personalizamos los bloques semanales y la densidad de trabajo según tu misión principal.',
};

// Array para UI (select options)
export const TRAINING_GOALS = Object.entries(OBJECTIVE_MAPPING).map(([dbValue, label]) => ({
  value: dbValue,        // Usar DB enum como value
  label: label,          // UI label para mostrar
  description: OBJECTIVE_DESCRIPTIONS[dbValue]
}));

// Mapeo inverso: UI label → DB enum (para compatibilidad con código legacy)
export const TRAINING_GOAL_LABELS = Object.entries(OBJECTIVE_MAPPING).reduce((acc, [dbValue, label]) => {
  acc[dbValue] = label;  // muscle_gain → "Volumen (Fuerza e Hipertrofia)"
  acc[label] = label;     // "Volumen..." → "Volumen..." (compatibilidad)
  return acc;
}, {});

// Helper: convertir de cualquier formato a DB enum
export const toDBObjective = (objective) => {
  if (!objective) return 'muscle_gain'; // default

  const normalized = objective.toLowerCase().trim();

  // Si ya es un enum válido, retornarlo
  if (Object.keys(OBJECTIVE_MAPPING).includes(normalized)) {
    return normalized;
  }

  // Buscar por label
  for (const [dbValue, label] of Object.entries(OBJECTIVE_MAPPING)) {
    if (label.toLowerCase() === normalized || objective === label) {
      return dbValue;
    }
  }

  // Fallback legacy (código viejo)
  if (normalized.includes('volumen') || normalized.includes('hipertrofia')) return 'muscle_gain';
  if (normalized.includes('grasa') || normalized.includes('pérdida')) return 'fat_loss';
  if (normalized.includes('recomposición') || normalized.includes('fuerza')) return 'strength';
  if (normalized.includes('resistencia') || normalized.includes('aeróbica')) return 'endurance';

  return 'muscle_gain'; // default
};

// Helper: convertir de DB enum a UI label
export const toUIObjective = (dbEnum) => {
  return OBJECTIVE_MAPPING[dbEnum] || dbEnum;
};
