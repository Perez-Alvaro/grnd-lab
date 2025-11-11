export const TRAINING_GOALS = [
  { value: 'volumen', label: 'Volumen (fuerza e hipertrofia)' },
  { value: 'perdida_grasa', label: 'Pérdida de grasa (fuerza y resistencia)' }
];

export const TRAINING_GOAL_LABELS = TRAINING_GOALS.reduce((acc, goal) => {
  acc[goal.value] = goal.label;
  return acc;
}, {});
