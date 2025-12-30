import { themeColors } from "@/styles/theme.js";

const normalizeHex = (hex) => {
  if (!hex) return "#000000";
  if (hex.startsWith("#")) return hex;
  return `#${hex}`;
};

export const hexToRgb = (hex) => {
  const normalized = normalizeHex(hex).replace("#", "");
  const bigint = parseInt(normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized,
  16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255,
  ];
};

export const hexToRgba = (hex, alpha = 1) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const pdfColors = {
  background: themeColors.surfaceAlt,
  surface: themeColors.surface,
  surfaceAlt: themeColors.base,
  text: themeColors.text,
  textSecondary: themeColors.textSecondary,
  textMuted: themeColors.textMuted,
  accent: themeColors.accent,
  accentStrong: themeColors.accentStrong,
  border: themeColors.border,
  borderLight: themeColors.borderLight,
};

export default pdfColors;
