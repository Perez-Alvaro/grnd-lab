import { StyleSheet } from "@react-pdf/renderer";
import { getPdfDesignSystem, hexToRgba } from "@/pdf-design-system/index.js";

export const createBaseStyles = () => {
  const design = getPdfDesignSystem({ variant: "desktop" });
  const { colors, spacing, typography, cards } = design;
  const { sizes, weights, lineHeights } = typography;

  const accentSoft = hexToRgba(colors.accent, 0.12);
  const accentBorder = hexToRgba(colors.accent, 0.3);
  const cardBorder = hexToRgba(colors.borderLight, 0.6);
  const headerBackground = hexToRgba(colors.surfaceAlt, 0.8);

  return StyleSheet.create({
    page: {
      padding: spacing.pagePadding,
      backgroundColor: colors.background,
      fontFamily: "Helvetica",
      fontSize: sizes.body,
      color: colors.text,
    },
    coverWrapper: {
      flexDirection: "column",
      justifyContent: "space-between",
      flexGrow: 1,
    },
    coverHeader: {
      marginBottom: spacing.sectionGap,
    },
    coverImage: {
      width: "100%",
      height: 180,
      borderRadius: cards.elevatedRadius,
      marginBottom: spacing.sectionGap,
      objectFit: "cover",
    },
    planTitle: {
      fontSize: sizes.display,
      fontWeight: weights.bold,
      color: colors.text,
      textAlign: "center",
      letterSpacing: 0.6,
      marginBottom: spacing.rowGap,
    },
    headerSection: {
      marginBottom: spacing.sectionGap,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: colors.accent,
      marginVertical: spacing.rowGap,
    },
    notesDivider: {
      width: "100%",
      height: 1,
      backgroundColor: colors.accent,
      marginTop: 6,
      marginBottom: spacing.rowGap,
      opacity: 0.3,
    },
    introSection: {
      marginBottom: spacing.sectionGap,
    },
    introTitle: {
      fontSize: sizes.sectionTitle,
      fontWeight: weights.bold,
      color: colors.accent,
      textAlign: "center",
      letterSpacing: 2,
      marginBottom: spacing.rowGap,
    },
    introText: {
      fontSize: sizes.body,
      color: colors.text,
      lineHeight: lineHeights.relaxed,
      textAlign: "justify",
    },
    planDescription: {
      fontSize: sizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.relaxed,
      textAlign: "center",
      fontStyle: "italic",
    },
    metadataSection: {
      marginBottom: spacing.rowGap,
    },
    metadataRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.columnGap,
      marginBottom: spacing.rowGap,
      flexWrap: "wrap",
    },
    metadataCard: {
      backgroundColor: headerBackground,
      borderRadius: cards.radius,
      borderWidth: cards.borderWidth,
      borderColor: accentBorder,
      padding: spacing.cardPadding,
      minWidth: 110,
      alignItems: "center",
    },
    metadataCardLabel: {
      fontSize: sizes.label,
      color: colors.accent,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 4,
      fontWeight: weights.semibold,
    },
    metadataCardValue: {
      fontSize: sizes.body,
      color: colors.text,
      textAlign: "center",
      fontWeight: weights.medium,
    },
    tag: {
      fontSize: sizes.label,
      color: colors.accent,
      backgroundColor: accentSoft,
      borderRadius: 6,
      borderWidth: cards.borderWidth,
      borderColor: accentBorder,
      paddingVertical: 4,
      paddingHorizontal: 10,
      fontWeight: weights.medium,
      letterSpacing: 0.3,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 6,
    },
    tagsSection: {
      marginTop: spacing.rowGap,
      marginBottom: spacing.rowGap,
    },
    notesSection: {
      marginTop: spacing.rowGap,
      marginBottom: spacing.sectionGap,
      padding: spacing.cardPadding,
      backgroundColor: accentSoft,
      borderRadius: cards.radius,
      borderWidth: cards.borderWidth,
      borderColor: accentBorder,
    },
    notesTitle: {
      fontSize: sizes.label,
      color: colors.accent,
      fontWeight: weights.bold,
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    notesText: {
      fontSize: sizes.body,
      color: colors.text,
      lineHeight: lineHeights.relaxed,
    },
    metadataLabel: {
      fontSize: sizes.label,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    metadataValue: {
      fontSize: sizes.bodySmall,
      color: colors.text,
      marginTop: 4,
    },
    indexSection: {
      marginTop: spacing.sectionGap,
    },
    indexHeader: {
      marginBottom: spacing.rowGap,
      borderBottomWidth: 2,
      borderBottomColor: colors.accent,
      paddingBottom: spacing.rowGap,
    },
    indexTitle: {
      fontSize: sizes.sectionTitle,
      fontWeight: weights.bold,
      color: colors.text,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    indexSubtitle: {
      fontSize: sizes.bodySmall,
      color: colors.textSecondary,
      marginTop: 4,
      letterSpacing: 0.5,
    },
    indexGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.columnGap,
    },
    indexCard: {
      width: "47%",
      backgroundColor: colors.surface,
      borderRadius: cards.elevatedRadius,
      borderWidth: cards.borderWidth,
      borderColor: cardBorder,
      padding: spacing.cardPadding,
      marginBottom: spacing.rowGap,
      textDecoration: "none",
    },
    indexCardTitle: {
      fontSize: sizes.cardTitle,
      fontWeight: weights.bold,
      color: colors.accent,
      marginBottom: 6,
      letterSpacing: 0.8,
    },
    indexCardDescription: {
      fontSize: sizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.normal,
    },
    weekSection: {
      marginBottom: spacing.sectionGap,
    },
    weekHeader: {
      marginBottom: spacing.rowGap,
    },
    weekTitle: {
      fontSize: sizes.sectionTitle,
      fontWeight: weights.bold,
      color: colors.accentStrong,
    },
    weekSubtitle: {
      fontSize: sizes.body,
      color: colors.textSecondary,
      marginTop: 6,
      lineHeight: lineHeights.normal,
    },
    backToIndex: {
      marginTop: spacing.rowGap,
      color: colors.accent,
      fontSize: sizes.bodySmall,
      textDecoration: "none",
    },
    dayContainer: {
      backgroundColor: colors.surface,
      borderRadius: cards.elevatedRadius,
      borderWidth: cards.borderWidth,
      borderColor: cardBorder,
      padding: spacing.cardPadding,
      marginBottom: spacing.cardGap,
      pageBreakInside: "avoid",
      breakInside: "avoid",
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.rowGap,
    },
    dayName: {
      fontSize: sizes.cardTitle,
      fontWeight: weights.semibold,
      color: colors.text,
    },
    dayType: {
      fontSize: sizes.label,
      fontWeight: weights.bold,
      paddingVertical: spacing.badgePaddingY,
      paddingHorizontal: spacing.badgePaddingX,
      borderRadius: 9999,
      textTransform: "uppercase",
    },
    dayTypeTraining: {
      backgroundColor: accentSoft,
      color: colors.accent,
      borderWidth: cards.borderWidth,
      borderColor: accentBorder,
    },
    dayTypeRest: {
      backgroundColor: hexToRgba(colors.textSecondary, 0.12),
      color: colors.textSecondary,
      borderWidth: cards.borderWidth,
      borderColor: hexToRgba(colors.textSecondary, 0.35),
    },
    restMessage: {
      fontSize: sizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.normal,
    },
    table: {
      marginTop: spacing.rowGap,
      borderRadius: cards.radius,
      overflow: "hidden",
      borderWidth: cards.borderWidth,
      borderColor: cardBorder,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: hexToRgba(colors.borderLight, 0.5),
    },
    tableHeaderRow: {
      backgroundColor: headerBackground,
    },
    tableCell: {
      flexGrow: 1,
      paddingVertical: spacing.tableCellPadding,
      paddingHorizontal: spacing.tableCellPadding,
      fontSize: sizes.bodySmall,
      color: colors.text,
      flexWrap: "wrap",
    },
    exerciseCol: {
      flexBasis: "24%",
      minWidth: 120,
    },
    seriesCol: {
      flexBasis: "8%",
      minWidth: 34,
      textAlign: "center",
    },
    repsCol: {
      flexBasis: "8%",
      minWidth: 34,
      textAlign: "center",
    },
    restCol: {
      flexBasis: "8%",
      minWidth: 34,
      textAlign: "center",
    },
    durationCol: {
      flexBasis: "9%",
      minWidth: 36,
      textAlign: "center",
    },
    rirCol: {
      flexBasis: "8%",
      minWidth: 34,
      textAlign: "center",
    },
    tempoCol: {
      flexBasis: "10%",
      minWidth: 42,
      textAlign: "center",
    },
    notesCol: {
      flexBasis: "20%",
      minWidth: 90,
    },
    videoCol: {
      flexBasis: "7%",
      minWidth: 40,
      textAlign: "center",
    },
    videoLink: {
      color: colors.accent,
      textDecoration: "none",
      fontWeight: weights.semibold,
    },
    videoButton: {
      backgroundColor: accentSoft,
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 6,
      textAlign: "center",
    },
    tableRowAlternate: {
      backgroundColor: headerBackground,
    },
    notesList: {
      marginTop: spacing.rowGap,
    },
    noteItem: {
      fontSize: sizes.bodySmall,
      color: colors.textSecondary,
      marginBottom: 4,
      lineHeight: lineHeights.normal,
    },
    noteBullet: {
      marginRight: 6,
      color: colors.accent,
      fontWeight: weights.bold,
    },
    progressWrapper: {
      flexDirection: "column",
    },
    progressTitle: {
      fontSize: sizes.sectionTitle,
      fontWeight: weights.bold,
      color: colors.accentStrong,
      marginBottom: spacing.sectionGap,
    },
    progressSection: {
      backgroundColor: colors.surface,
      borderRadius: cards.elevatedRadius,
      borderWidth: cards.borderWidth,
      borderColor: cardBorder,
      padding: spacing.cardPadding,
      marginBottom: spacing.cardGap,
    },
    progressSectionTitle: {
      fontSize: sizes.cardTitle,
      fontWeight: weights.semibold,
      color: colors.text,
      marginBottom: spacing.rowGap,
    },
    progressParagraph: {
      fontSize: sizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.normal,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: spacing.rowGap,
    },
    metricCard: {
      width: "48%",
      backgroundColor: headerBackground,
      borderRadius: cards.radius,
      padding: spacing.cardPadding,
      marginBottom: spacing.rowGap,
      marginRight: spacing.rowGap,
      borderWidth: cards.borderWidth,
      borderColor: cardBorder,
    },
    metricLabel: {
      fontSize: sizes.label,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    metricValue: {
      fontSize: sizes.body,
      color: colors.text,
      marginTop: 4,
    },
  });
};

export default createBaseStyles;
