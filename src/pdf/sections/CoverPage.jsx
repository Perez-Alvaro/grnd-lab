import { View, Text, Link, Image } from "@react-pdf/renderer";
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
  const frequencyValue = plan.frequency ? String(plan.frequency) : "";
  const frequencyText = frequencyValue
    ? frequencyValue.includes("semana")
      ? frequencyValue
      : `${frequencyValue}x/semana`
    : "—";

  const metadataItems = [
    { label: "OBJETIVO", value: objectiveLabel },
    { label: "NIVEL", value: plan.level },
    { label: "GÉNERO", value: plan.gender || plan.genre },
    { label: "DURACIÓN", value: durationText !== "—" ? durationText : "" },
    { label: "FRECUENCIA", value: frequencyText !== "—" ? frequencyText : "" },
    { label: "EQUIPO", value: plan.equipment },
    { label: "COACH", value: plan.author || plan.user },
    { label: "PRECIO", value: plan.price },
  ].filter((item) => item.value);

  const metadataRows = metadataItems.reduce((rows, item, index) => {
    const rowIndex = Math.floor(index / 3);
    if (!rows[rowIndex]) rows[rowIndex] = [];
    rows[rowIndex].push(item);
    return rows;
  }, []);

  return (
    <View style={styles.coverWrapper} id={INDEX_ANCHOR}>
      <View style={styles.coverHeader}>
        {plan.image ? <Image src={plan.image} style={styles.coverImage} /> : null}
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          {plan.description && (
            <Text style={styles.planDescription}>{plan.description}</Text>
          )}
        </View>

        {/* Metadata Section */}
        <View style={styles.metadataSection}>
          {metadataRows.map((row, idx) => (
            <MetadataRow key={`metadata-row-${idx}`} items={row} styles={styles} />
          ))}
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
