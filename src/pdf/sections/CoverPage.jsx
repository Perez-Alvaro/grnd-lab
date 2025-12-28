import { View, Text, Link } from "@react-pdf/renderer";
import { INDEX_ANCHOR, weekLinkTarget } from "../utils/pdfAnchors.js";
import { TRAINING_GOAL_LABELS } from "../../constants/objectives.js";

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
          <Text style={styles.planTitle}>{plan.title}</Text>
          {plan.description && (
            <Text style={styles.planDescription}>{plan.description}</Text>
          )}
        </View>

        {/* Metadata Section */}
        <View style={styles.metadataSection}>
          {/* First row: Objective and Level */}
          {(objectiveLabel || plan.level) && (
            <MetadataRow
              items={[
                { label: "OBJETIVO", value: objectiveLabel },
                { label: "NIVEL", value: plan.level },
              ]}
              styles={styles}
            />
          )}

          {/* Second row: Duration, Frequency, Coach */}
          {(durationText !== "—" || frequencyText !== "—" || plan.author || plan.user) && (
            <MetadataRow
              items={[
                { label: "DURACIÓN", value: durationText },
                { label: "FRECUENCIA", value: frequencyText },
                { label: "COACH", value: plan.author || plan.user },
              ]}
              styles={styles}
            />
          )}
        </View>

        {/* Tags */}
        {plan.tags && plan.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Tags tags={plan.tags} styles={styles} />
          </View>
        )}

        {/* General Notes */}
        {plan.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>NOTAS GENERALES</Text>
            <View style={styles.notesDivider} />
            <Text style={styles.notesText}>{plan.notes}</Text>
          </View>
        )}
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
