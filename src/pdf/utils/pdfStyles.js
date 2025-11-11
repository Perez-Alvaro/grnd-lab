import { StyleSheet } from "@react-pdf/renderer";

export const palette = {
  background: "#202020",
  card: "#2D2D2D",
  neutral: "#787878",
  accent: "#B5FF00",
  secondary: "#DBFE52",
  text: "#FFFFFF",
};

export const spacing = {
  pagePadding: 36,
  sectionGap: 24,
  dayGap: 16,
  indexCardPadding: 16,
  tableCellPadding: 8,
};

export const typography = {
  base: 12,
  small: 10,
  medium: 14,
  large: 20,
  xlarge: 28,
};

export const createBaseStyles = () =>
  StyleSheet.create({
    page: {
      padding: spacing.pagePadding,
      backgroundColor: palette.background,
      fontFamily: "Helvetica",
      fontSize: typography.base,
      color: palette.text,
    },
    coverWrapper: {
      flexDirection: "column",
      justifyContent: "space-between",
      flexGrow: 1,
    },
    coverHeader: {
      marginBottom: spacing.sectionGap,
    },
    planTitle: {
      fontSize: typography.xlarge,
      fontWeight: 700,
      color: palette.secondary,
    },
    planMetadata: {
      marginTop: 12,
    },
    metadataLabel: {
      fontSize: typography.small,
      color: palette.neutral,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    metadataValue: {
      fontSize: typography.medium,
      color: palette.text,
      marginTop: 4,
    },
    indexSection: {
      marginTop: spacing.sectionGap,
    },
    indexTitle: {
      fontSize: typography.large,
      fontWeight: 600,
      marginBottom: 12,
    },
    indexGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    indexCard: {
      width: "48%",
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.2)",
      padding: spacing.indexCardPadding,
      marginBottom: spacing.dayGap,
      marginRight: 12,
      textDecoration: "none",
    },
    indexCardTitle: {
      fontSize: typography.medium,
      fontWeight: 600,
      color: palette.accent,
      marginBottom: 6,
    },
    indexCardDescription: {
      fontSize: typography.base,
      color: palette.neutral,
      lineHeight: 1.4,
    },
    weekSection: {
      marginBottom: spacing.sectionGap,
    },
    weekHeader: {
      marginBottom: spacing.dayGap,
    },
    weekTitle: {
      fontSize: typography.large,
      fontWeight: 700,
      color: palette.secondary,
    },
    weekSubtitle: {
      fontSize: typography.base,
      color: palette.neutral,
      marginTop: 6,
      lineHeight: 1.5,
    },
    backToIndex: {
      marginTop: 10,
      color: palette.accent,
      fontSize: typography.base,
      textDecoration: "none",
    },
    dayContainer: {
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.2)",
      padding: spacing.indexCardPadding,
      marginBottom: spacing.dayGap,
      pageBreakInside: "avoid",
      breakInside: "avoid",
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    dayName: {
      fontSize: typography.medium,
      fontWeight: 600,
      color: palette.text,
    },
    dayType: {
      fontSize: typography.small,
      fontWeight: 700,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 9999,
      textTransform: "uppercase",
    },
    dayTypeTraining: {
      backgroundColor: "rgba(203,255,0,0.15)",
      color: palette.accent,
      borderWidth: 1,
      borderColor: "rgba(203,255,0,0.35)",
    },
    dayTypeRest: {
      backgroundColor: "rgba(120,120,120,0.15)",
      color: palette.neutral,
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.35)",
    },
    restMessage: {
      fontSize: typography.base,
      color: palette.neutral,
      lineHeight: 1.5,
    },
    table: {
      marginTop: 8,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.25)",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(120,120,120,0.2)",
    },
    tableHeaderRow: {
      backgroundColor: "rgba(45,45,45,0.75)",
    },
    tableCell: {
      flexGrow: 1,
      paddingVertical: spacing.tableCellPadding,
      paddingHorizontal: spacing.tableCellPadding,
      fontSize: typography.small,
      color: palette.text,
    },
    exerciseCol: {
      flexBasis: "32%",
      minWidth: 140,
    },
    seriesCol: {
      flexBasis: "11%",
      minWidth: 40,
      textAlign: "center",
    },
    repsCol: {
      flexBasis: "11%",
      minWidth: 40,
      textAlign: "center",
    },
    restCol: {
      flexBasis: "12%",
      minWidth: 48,
      textAlign: "center",
    },
    rirCol: {
      flexBasis: "10%",
      minWidth: 40,
      textAlign: "center",
    },
    tempoCol: {
      flexBasis: "12%",
      minWidth: 56,
      textAlign: "center",
    },
    videoCol: {
      flexBasis: "12%",
      minWidth: 48,
      textAlign: "center",
    },
    videoLink: {
      color: palette.accent,
      textDecoration: "none",
      fontWeight: 600,
    },
    tableRowAlternate: {
      backgroundColor: "rgba(32,32,32,0.8)",
    },
    notesList: {
      marginTop: 12,
    },
    noteItem: {
      fontSize: typography.small,
      color: palette.neutral,
      marginBottom: 4,
      lineHeight: 1.4,
    },
    noteBullet: {
      marginRight: 6,
      color: palette.accent,
      fontWeight: 700,
    },
    progressWrapper: {
      flexDirection: "column",
    },
    progressTitle: {
      fontSize: typography.large,
      fontWeight: 700,
      color: palette.secondary,
      marginBottom: 16,
    },
    progressSection: {
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.2)",
      padding: spacing.indexCardPadding,
      marginBottom: spacing.dayGap,
    },
    progressSectionTitle: {
      fontSize: typography.medium,
      fontWeight: 600,
      color: palette.text,
      marginBottom: 8,
    },
    progressParagraph: {
      fontSize: typography.base,
      color: palette.neutral,
      lineHeight: 1.5,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    metricCard: {
      width: "48%",
      backgroundColor: "rgba(45,45,45,0.75)",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      marginRight: 12,
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.2)",
    },
    metricLabel: {
      fontSize: typography.small,
      color: palette.neutral,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    metricValue: {
      fontSize: typography.medium,
      color: palette.text,
      marginTop: 4,
    },
  });
