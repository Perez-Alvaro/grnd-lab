export const INDEX_ANCHOR = 'indice-interactivo';

export const weekAnchorId = (weekNumber) => `semana-${weekNumber}`;

export const indexLinkTarget = () => `#${INDEX_ANCHOR}`;

export const weekLinkTarget = (weekNumber) => `#${weekAnchorId(weekNumber)}`;

export const buildWeekAnchors = weeks =>
  weeks.map((_, index) => ({
    id: weekAnchorId(index + 1),
    number: index + 1
  }));
