import { StyleSheet, View, Text, Link } from "@react-pdf/renderer";
import { INDEX_ANCHOR, weekLinkTarget } from "../utils/pdfAnchors.js";
import { TRAINING_GOAL_LABELS } from "../../constants/objectives.js";

const localStyles = StyleSheet.create({
  brandTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#2E4A5F",
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
});

const MetadataRow = ({ items, styles }) => (
  <View style={styles.metadataRow}>
    {items.filter((item) => item.value).map((item, idx) => (
      <View key={idx} style={styles.metadataCard}>
        <Text style={styles.metadataCardLabel}>{item.label}</Text>
        <Text style={styles.metadataCardValue}>{item.value}</Text>
      </View>
    ))}
  </View>
);

const Tags = ({ tags, styles }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <View style={styles.tagsContainer}>
      {tags.map((tag, idx) => (
        <Text key={idx} style={styles.tag}>
          #{tag}
        </Text>
      ))}
    </View>
  );
};

const CoverPage = ({ plan, styles }) => {
  // Resolve white-label coach brand name
  const cleanBrand = (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : null);
  const brandName =
    cleanBrand(plan.brandName) ||
    cleanBrand(plan.metadata?.brandName) ||
    cleanBrand(plan.metadata?.author) ||
    cleanBrand(plan.metadata?.coach) ||
    cleanBrand(plan.author) ||
    cleanBrand(plan.coach) ||
    (typeof window !== "undefined" && cleanBrand(window?.localStorage?.getItem?.("mock:coach-brand-name"))) ||
    "Mock";

  // Format objective label
  const objectiveLabel = TRAINING_GOAL_LABELS[plan.objective] || plan.objective;

  // Format duration
  const durationText = plan.durationWeeks
    ? `${plan.durationWeeks} ${plan.durationWeeks === "1" ? "semana" : "semanas"}`
    : plan.duration || "—";

  // Format frequency
  const frequencyText = plan.frequency ? `${plan.frequency}x/semana` : "—";

  return (
    <View style={styles.coverWrapper} id={INDEX_ANCHOR}>
      <View style={styles.coverHeader}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[localStyles.brandTitle, styles.brandTitle]}>
            {String(brandName).toUpperCase()}
          </Text>
          <Text style={styles.planTitle}>{plan.title}</Text>
          {plan.description ? (
            <Text style={styles.planDescription}>{plan.description}</Text>
          ) : null}
        </View>

        {/* Metadata Section */}
        <View style={styles.metadataSection}>
          {/* First row: Objetivo, Nivel, Género */}
          {(objectiveLabel || plan.level || plan.gender || plan.genre) ? (
            <MetadataRow
              items={[
                { label: "OBJETIVO", value: objectiveLabel },
                { label: "NIVEL", value: plan.level },
                { label: "GÉNERO", value: plan.gender || plan.genre },
              ]}
              styles={styles}
            />
          ) : null}

          {/* Second row: Duration, Frequency, Coach / Marca */}
          {(durationText !== "—" || frequencyText !== "—" || brandName || plan.author || plan.user) ? (
            <MetadataRow
              items={[
                { label: "DURACIÓN", value: durationText },
                { label: "FRECUENCIA", value: frequencyText },
                { label: "COACH / MARCA", value: brandName !== "Mock" ? brandName : (plan.author || plan.user || "Mock") },
              ]}
              styles={styles}
            />
          ) : null}
        </View>

        {/* Tags */}
        {plan.tags && plan.tags.length > 0 ? (
          <View style={styles.tagsSection}>
            <Tags tags={plan.tags} styles={styles} />
          </View>
        ) : null}

        {/* General Notes */}
        {plan.notes ? (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>NOTAS GENERALES</Text>
            <View style={styles.notesDivider} />
            <Text style={styles.notesText}>{plan.notes}</Text>
          </View>
        ) : null}
      </View>

      {/* Week Index */}
      <View style={styles.indexSection}>
        <View style={styles.indexHeader}>
          <Text style={styles.indexTitle}>CONTENIDO DEL PROGRAMA</Text>
          <Text style={styles.indexSubtitle}>
            {plan.weeks.length} {plan.weeks.length === 1 ? "semana" : "semanas"} de entrenamiento
          </Text>
        </View>
        <View style={styles.indexGrid}>
          {plan.weeks.map((week) => (
            <Link
              key={week.number}
              src={weekLinkTarget(week.number)}
              style={styles.indexCard}
              wrap={false}
            >
              <Text style={styles.indexCardTitle}>{`SEMANA ${week.number}`}</Text>
              <Text style={styles.indexCardDescription}>
                {week.summary ||
                  week.notes?.[0] ||
                  "Programa de entrenamiento detallado"}
              </Text>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
};

export default CoverPage;
