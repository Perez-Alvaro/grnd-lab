import { Document, Page, View, Text, StyleSheet, Link, pdf } from '@react-pdf/renderer';

const palette = {
  background: '#202020',
  card: '#2D2D2D',
  neutral: '#787878',
  accent: '#CBFF00',
  secondary: '#DBFE52',
  text: '#FFFFFF',
};

const createStyles = (format = 'desktop') => {
  const isMobile = format === 'mobile';
  return StyleSheet.create({
    page: {
      padding: isMobile ? 24 : 36,
      backgroundColor: palette.background,
      fontFamily: 'Helvetica',
      fontSize: 14,
      color: palette.text,
    },
    header: {
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: palette.text,
    },
    headerSub: {
      fontSize: 12,
      color: palette.neutral,
      marginTop: 4,
    },
    separator: {
      height: 1,
      backgroundColor: '#2D2D2D',
      marginTop: 4,
      marginBottom: 16,
    },
    dayTitle: {
      fontSize: isMobile ? 20 : 22,
      fontWeight: 600,
      color: palette.accent,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: palette.text,
      marginBottom: 8,
      marginTop: 8,
    },
    card: {
      backgroundColor: palette.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(120,120,120,0.2)',
      padding: isMobile ? 16 : 20,
      marginBottom: 16,
    },
    topRow: {
      flexDirection: isMobile ? 'column' : 'row',
      gap: 12,
      alignItems: 'center',
    },
    title: {
      fontSize: isMobile ? 18 : 20,
      fontWeight: 600,
      color: palette.text,
      flexGrow: 1,
      marginTop: isMobile ? 8 : 0,
    },
    videoButton: {
      backgroundColor: palette.accent,
      color: palette.background,
      paddingVertical: isMobile ? 4 : 6,
      paddingHorizontal: isMobile ? 6 : 8,
      borderRadius: 6,
      fontSize: isMobile ? 12 : 13,
      textDecoration: 'none',
    },
    metricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    metricItem: {
      width: isMobile ? '48%' : '18%',
      marginBottom: 8,
    },
    metricLabel: {
      fontSize: isMobile ? 12 : 13,
      color: '#A0A0A0',
    },
    metricValue: {
      fontSize: 16,
      color: '#F0F0F0',
    },
    notes: {
      fontSize: isMobile ? 13 : 14,
      color: '#CFCFCF',
      marginTop: 8,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(120,120,120,0.2)',
      marginVertical: 8,
    },
  });
};

const Metric = ({ label, value, styles }) => (
  <View style={styles.metricItem}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value || '-'}</Text>
  </View>
);

const ExerciseCard = ({ exercise, format, styles }) => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <Text style={styles.title}>{exercise.title}</Text>
      {exercise.videoUrl ? (
        <Link src={exercise.videoUrl} style={styles.videoButton}>
          Ver video
        </Link>
      ) : null}
    </View>
    {exercise.variants && exercise.variants.length > 0 ? (
      exercise.variants.map((variant, idx) => (
        <View key={idx}>
          {idx > 0 && <View style={styles.divider} />}
          <View style={styles.metricsRow}>
            <Metric label="Series" value={variant.series} styles={styles} />
            <Metric label="Rep." value={variant.reps} styles={styles} />
            <Metric label="Desc." value={variant.descanso} styles={styles} />
            <Metric label="Cadencia" value={variant.cadencia} styles={styles} />
            <Metric label="RIR" value={variant.rir} styles={styles} />
          </View>
          {variant.notas ? <Text style={styles.notes}>{variant.notas}</Text> : null}
        </View>
      ))
    ) : (
      <>
        <View style={styles.metricsRow}>
          <Metric label="Series" value={exercise.series} styles={styles} />
          <Metric label="Rep." value={exercise.reps} styles={styles} />
          <Metric label="Desc." value={exercise.descanso} styles={styles} />
          <Metric label="Cadencia" value={exercise.cadencia} styles={styles} />
          <Metric label="RIR" value={exercise.rir} styles={styles} />
        </View>
        {exercise.notas ? <Text style={styles.notes}>{exercise.notas}</Text> : null}
      </>
    )}
  </View>
);

const DaySection = ({ dia, format, styles }) => (
  <View style={{ marginBottom: 24 }}>
    <Text style={styles.dayTitle}>{dia.titulo}</Text>
    {dia.entradaEnCalor && dia.entradaEnCalor.length > 0 && (
      <View>
        <Text style={styles.sectionTitle}>Entrada en calor</Text>
        {dia.entradaEnCalor.map((ex, idx) => (
          <ExerciseCard key={`w-${idx}`} exercise={ex} format={format} styles={styles} />
        ))}
      </View>
    )}
    {dia.entrenamiento && dia.entrenamiento.length > 0 && (
      <View>
        <Text style={styles.sectionTitle}>Entrenamiento</Text>
        {dia.entrenamiento.map((ex, idx) => (
          <ExerciseCard key={`e-${idx}`} exercise={ex} format={format} styles={styles} />
        ))}
      </View>
    )}
  </View>
);

const PdfDocument = ({ data, format = 'desktop' }) => {
  const styles = createStyles(format);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.planName && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rutina – {data.planName}</Text>
            {(data.clientName || data.objective || data.frecuencia) && (
              <Text style={styles.headerSub}>
                {[data.clientName, data.objective, data.frecuencia].filter(Boolean).join(' • ')}
              </Text>
            )}
            <View style={styles.separator} />
          </View>
        )}
        {data.dias.map((dia, idx) => (
          <DaySection key={idx} dia={dia} format={format} styles={styles} />
        ))}
      </Page>
    </Document>
  );
};

export async function generateRoutinePdf(data, format = 'desktop') {
  const blob = await pdf(<PdfDocument data={data} format={format} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(data.planName || 'rutina').replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return blob;
}

