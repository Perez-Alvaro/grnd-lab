import { View, Text } from "@react-pdf/renderer";

const ProgressPage = ({ progress, styles }) => {
  if (!progress) return null;

  const hasMetrics =
    Array.isArray(progress.metrics) && progress.metrics.length > 0;
  const hasNotes = Array.isArray(progress.notes) && progress.notes.length > 0;

  if (!hasMetrics && !hasNotes) return null;

  return (
    <View style={styles.progressWrapper}>
      <Text style={styles.progressTitle}>Seguimiento y notas</Text>

      {hasNotes ? (
        <View style={styles.progressSection}>
          <Text style={styles.progressSectionTitle}>Notas generales</Text>
          {progress.notes.map((note, idx) => (
            <Text key={idx} style={styles.progressParagraph}>
              {note}
            </Text>
          ))}
        </View>
      ) : null}

      {hasMetrics ? (
        <View style={styles.progressSection}>
          <Text style={styles.progressSectionTitle}>Indicadores clave</Text>
          <View style={styles.metricsGrid}>
            {progress.metrics.map((metric, idx) => (
              <View key={idx} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value || "-"}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default ProgressPage;
