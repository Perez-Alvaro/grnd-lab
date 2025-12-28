import { StyleSheet } from "@react-pdf/renderer";
import { themeColors } from "@/styles/theme.js";

export const palette = {
  background: themeColors.surfaceAlt,
  card: themeColors.surface,
  neutral: "#787878",
  accent: "#0ef2a0", // Dashboard accent color
  secondary: "#00c0a3", // Darker shade of accent
  text: themeColors.text,
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
      color: palette.text,
      textAlign: "center",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    headerSection: {
      marginBottom: 20,
    },
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: palette.accent,
      marginVertical: 16,
    },
    notesDivider: {
      width: "100%",
      height: 1,
      backgroundColor: palette.accent,
      marginTop: 6,
      marginBottom: 10,
      opacity: 0.3,
    },
    introSection: {
      marginBottom: 24,
    },
    introTitle: {
      fontSize: typography.large,
      fontWeight: 700,
      color: palette.accent,
      textAlign: "center",
      letterSpacing: 2,
      marginBottom: 12,
    },
    introText: {
      fontSize: typography.base,
      color: palette.text,
      lineHeight: 1.7,
      textAlign: "justify",
    },
    planDescription: {
      fontSize: typography.base,
      color: palette.neutral,
      lineHeight: 1.6,
      textAlign: "center",
      fontStyle: "italic",
    },
    metadataSection: {
      marginBottom: 12,
    },
    metadataRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginBottom: 10,
      flexWrap: "wrap",
    },
    metadataCard: {
      backgroundColor: "rgba(32,32,32,0.95)",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "rgba(14,242,160,0.15)",
      padding: 12,
      minWidth: 100,
      alignItems: "center",
    },
    metadataCardLabel: {
      fontSize: typography.small - 1,
      color: palette.accent,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 4,
      fontWeight: 600,
    },
    metadataCardValue: {
      fontSize: typography.base,
      color: palette.text,
      textAlign: "center",
      fontWeight: 500,
    },
    tag: {
      fontSize: typography.small - 1,
      color: palette.accent,
      backgroundColor: "rgba(14,242,160,0.08)",
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "rgba(14,242,160,0.2)",
      paddingVertical: 4,
      paddingHorizontal: 10,
      fontWeight: 500,
      letterSpacing: 0.3,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 6,
    },
    tagsSection: {
      marginTop: 16,
      marginBottom: 16,
    },
    notesSection: {
      marginTop: 18,
      marginBottom: 20,
      padding: 14,
      backgroundColor: "rgba(14,242,160,0.05)",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "rgba(14,242,160,0.25)",
    },
    notesTitle: {
      fontSize: typography.small,
      color: palette.accent,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    notesText: {
      fontSize: typography.base,
      color: palette.text,
      lineHeight: 1.6,
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
    indexHeader: {
      marginBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: palette.accent,
      paddingBottom: 8,
    },
    indexTitle: {
      fontSize: typography.large,
      fontWeight: 700,
      color: palette.text,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    indexSubtitle: {
      fontSize: typography.small,
      color: palette.neutral,
      marginTop: 4,
      letterSpacing: 0.5,
    },
    indexGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    indexCard: {
      width: "47%",
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(120,120,120,0.2)",
      padding: spacing.indexCardPadding,
      marginBottom: 12,
      textDecoration: "none",
    },
    indexCardTitle: {
      fontSize: typography.medium,
      fontWeight: 700,
      color: palette.accent,
      marginBottom: 6,
      letterSpacing: 0.8,
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
      backgroundColor: "rgba(14,242,160,0.15)",
      color: palette.accent,
      borderWidth: 1,
      borderColor: "rgba(14,242,160,0.35)",
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
      flexBasis: "10%",
      minWidth: 40,
      textAlign: "center",
    },
    durationCol: {
      flexBasis: "10%",
      minWidth: 40,
      textAlign: "center",
    },
    rirCol: {
      flexBasis: "10%",
      minWidth: 40,
      textAlign: "center",
    },
    tempoCol: {
      flexBasis: "11%",
      minWidth: 48,
      textAlign: "center",
    },
    videoCol: {
      flexBasis: "11%",
      minWidth: 44,
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
