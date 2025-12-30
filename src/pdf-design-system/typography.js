const scaleToken = (value, scale) => Math.round(value * scale * 10) / 10;

export const baseTypography = {
  display: 30,
  title: 24,
  sectionTitle: 18,
  cardTitle: 14,
  body: 12,
  bodySmall: 10,
  label: 9,
  micro: 8,
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

export const getTypography = (scale = 1) => ({
  sizes: Object.fromEntries(
    Object.entries(baseTypography).map(([key, value]) => [
      key,
      scaleToken(value, scale),
    ]),
  ),
  weights: fontWeights,
  lineHeights,
});

export default getTypography;
