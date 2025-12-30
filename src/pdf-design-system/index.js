import pdfColors, { hexToRgb, hexToRgba } from "./colors.js";
import { getTypography } from "./typography.js";
import { getSpacing } from "./spacing.js";
import { getCards } from "./cards.js";
import { getHeaders } from "./headers.js";
import { getScaleForVariant } from "./layout.js";

export const getPdfDesignSystem = ({ variant = "desktop" } = {}) => {
  const scale = getScaleForVariant(variant);

  return {
    colors: pdfColors,
    typography: getTypography(scale),
    spacing: getSpacing(scale),
    cards: getCards(scale),
    headers: getHeaders(scale),
    scale,
  };
};

export { pdfColors, hexToRgb, hexToRgba };

export default getPdfDesignSystem;
