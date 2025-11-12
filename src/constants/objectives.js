export const TRAINING_GOALS = [
  {
    value: "Volumen (Fuerza e Hipertrofia)",
    label: "Volumen (Fuerza e Hipertrofia)",
  },
  {
    value: "Pérdida de Grasa (Fuerza y Resistencia)",
    label: "Pérdida de Grasa (Fuerza y Resistencia)",
  },
];

export const TRAINING_GOAL_LABELS = TRAINING_GOALS.reduce((acc, goal) => {
  acc[goal.value] = goal.label;
  return acc;
}, {});
