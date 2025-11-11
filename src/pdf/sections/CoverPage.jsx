import { View, Text, Link } from "@react-pdf/renderer";
import { INDEX_ANCHOR, weekLinkTarget } from "../utils/pdfAnchors.js";

const renderMetadataItem = (styles, label, value) => {
  if (!value) return null;
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.metadataLabel}>{label}</Text>
      <Text style={styles.metadataValue}>{value}</Text>
    </View>
  );
};

const CoverPage = ({ plan, styles }) => (
  <View style={styles.coverWrapper} id={INDEX_ANCHOR}>
    <View style={styles.coverHeader}>
      <Text style={styles.planTitle}>{plan.title}</Text>
      <View style={styles.planMetadata}>
        {renderMetadataItem(styles, "Usuario", plan.user)}
        {renderMetadataItem(styles, "Duración", plan.duration)}
        {renderMetadataItem(styles, "Frecuencia", plan.frequency)}
        {renderMetadataItem(styles, "Objetivo", plan.objective)}
      </View>
    </View>

    <View style={styles.indexSection}>
      <Text style={styles.indexTitle}>Índice interactivo</Text>
      <View style={styles.indexGrid}>
        {plan.weeks.map((week) => (
          <Link
            key={week.number}
            src={weekLinkTarget(week.number)}
            style={styles.indexCard}
          >
            <Text style={styles.indexCardTitle}>{`Semana ${week.number}`}</Text>
            <Text style={styles.indexCardDescription}>
              {week.summary ||
                week.notes?.[0] ||
                "Revisa el detalle semanal del entrenamiento."}
            </Text>
          </Link>
        ))}
      </View>
    </View>
  </View>
);

export default CoverPage;
