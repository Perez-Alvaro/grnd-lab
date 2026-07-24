export const INDEX_ANCHOR = "indice-interactivo";

export const weekAnchorId = (weekNumber) => `semana-${weekNumber}`;

export const indexLinkTarget = () => `#${INDEX_ANCHOR}`;

export const weekLinkTarget = (weekNumber) => `#${weekAnchorId(weekNumber)}`;

// Secciones del apéndice nutricional (accesos rápidos desde el índice)
export const SHOPPING_ANCHOR = "lista-compras";
export const MEALPREP_ANCHOR = "meal-prep";
export const FRIDGE_ANCHOR = "tarjeta-heladera";

export const anchorTarget = (anchor) => `#${anchor}`;

export const buildWeekAnchors = (weeks) =>
  weeks.map((_, index) => ({
    id: weekAnchorId(index + 1),
    number: index + 1,
  }));
