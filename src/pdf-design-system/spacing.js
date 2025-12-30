const scaleToken = (value, scale) => Math.round(value * scale * 10) / 10;

export const baseSpacing = {
  pagePadding: 36,
  pageMargin: 24,
  sectionGap: 22,
  cardGap: 12,
  cardPadding: 16,
  rowGap: 10,
  columnGap: 10,
  tableCellPadding: 8,
  badgePaddingX: 10,
  badgePaddingY: 4,
  mediaGap: 14,
};

export const getSpacing = (scale = 1) =>
  Object.fromEntries(
    Object.entries(baseSpacing).map(([key, value]) => [
      key,
      scaleToken(value, scale),
    ]),
  );

export default getSpacing;
