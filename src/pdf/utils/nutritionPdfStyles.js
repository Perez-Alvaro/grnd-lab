import { StyleSheet } from "@react-pdf/renderer";
import { createBaseStyles, palette, typography, spacing } from "./pdfStyles.js";

/**
 * Estilos del PDF nutricional. Reutiliza createBaseStyles() (paleta, tipografía,
 * índice, "volver al índice", tarjetas de metadata) y agrega lo específico de
 * nutrición: tarjetas de comida, macros, lista de compras y aviso de derivación.
 */
export const createNutritionStyles = () => {
  const base = createBaseStyles();
  const extra = StyleSheet.create({
    // Aviso de derivación (patología)
    warningBox: {
      marginTop: 14,
      marginBottom: 6,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#F59E0B",
      backgroundColor: "#FFF7ED",
    },
    warningTitle: {
      fontSize: typography.small,
      fontWeight: 700,
      color: "#B45309",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 4,
    },
    warningText: {
      fontSize: typography.base,
      color: palette.text,
      lineHeight: 1.5,
    },
    legalNote: {
      marginTop: 16,
      fontSize: typography.small,
      color: palette.neutral,
      textAlign: "center",
      lineHeight: 1.5,
    },
    // Día
    dayTotal: {
      fontSize: typography.small,
      fontWeight: 700,
      color: palette.accent,
    },
    dayBadgeTraining: {
      fontSize: typography.small - 1,
      fontWeight: 700,
      color: palette.accent,
      borderWidth: 1,
      borderColor: palette.accent,
      borderRadius: 9999,
      paddingVertical: 2,
      paddingHorizontal: 8,
      textTransform: "uppercase",
    },
    // Comida
    mealCard: {
      borderWidth: 1,
      borderColor: palette.divider,
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
    },
    mealHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    mealName: {
      fontSize: typography.medium,
      fontWeight: 700,
      color: palette.text,
    },
    mealHora: {
      fontSize: typography.small,
      color: palette.neutral,
      fontWeight: 500,
    },
    mealKcal: {
      fontSize: typography.small,
      fontWeight: 700,
      color: palette.accent,
      borderWidth: 1,
      borderColor: palette.divider,
      borderRadius: 9999,
      paddingVertical: 2,
      paddingHorizontal: 8,
    },
    mealMacros: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 6,
    },
    macroChip: {
      fontSize: typography.small,
      color: palette.neutral,
    },
    fieldLabel: {
      fontSize: typography.small - 1,
      fontWeight: 700,
      color: palette.accent,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginTop: 4,
    },
    fieldText: {
      fontSize: typography.base,
      color: palette.text,
      lineHeight: 1.45,
    },
    subsText: {
      fontSize: typography.small,
      color: palette.neutral,
      lineHeight: 1.45,
      fontStyle: "italic",
    },
    timingText: {
      fontSize: typography.small,
      color: palette.accent,
      lineHeight: 1.45,
      marginTop: 3,
    },
    recipeLink: {
      marginTop: 5,
      fontSize: typography.small,
      color: palette.accent,
      fontWeight: 700,
      textDecoration: "none",
    },
    variantesWrap: {
      marginTop: 6,
      paddingTop: 6,
      borderTopWidth: 1,
      borderTopColor: palette.divider,
    },
    varianteRow: {
      marginBottom: 3,
    },
    varianteLabel: {
      fontSize: typography.small,
      fontWeight: 600,
      color: palette.text,
    },
    varianteText: {
      fontSize: typography.small,
      color: palette.neutral,
      lineHeight: 1.4,
    },
    // Lista de compras / secciones auxiliares
    sectionTitle: {
      fontSize: typography.large,
      fontWeight: 700,
      color: palette.text,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    shopCategory: {
      marginBottom: 12,
      breakInside: "avoid",
    },
    shopCategoryTitle: {
      fontSize: typography.medium,
      fontWeight: 700,
      color: palette.accent,
      marginBottom: 4,
    },
    shopItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 2,
    },
    shopBox: {
      fontSize: typography.base,
      color: palette.neutral,
      marginRight: 6,
    },
    shopItemText: {
      fontSize: typography.base,
      color: palette.text,
      flex: 1,
    },
    prepItem: {
      marginBottom: 6,
    },
    prepText: {
      fontSize: typography.base,
      color: palette.text,
      lineHeight: 1.4,
    },
    prepMeta: {
      fontSize: typography.small,
      color: palette.neutral,
    },
  });
  return { ...base, ...extra, __palette: palette, __spacing: spacing };
};

export { palette as nutritionPalette };
