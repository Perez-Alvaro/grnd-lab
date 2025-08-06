import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 16,
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16
  },
  exercise: {
    marginBottom: 8
  },
  exerciseName: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  exerciseDetail: {
    fontSize: 10,
    color: '#555'
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    textAlign: 'center',
    fontSize: 10,
    color: '#555'
  }
});

function RoutineDocument({ template, userInfo, orientation }) {
  return (
    <Document>
      <Page size="A4" orientation={orientation} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>FitPlan Selector</Text>
          <Text style={styles.subTitle}>{new Date().toLocaleDateString()}</Text>
        </View>

        <Text style={styles.sectionTitle}>{template.name}</Text>
        <Text style={styles.subTitle}>{`${template.frequency} días/semana • ${template.objective}`}</Text>

        {userInfo && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.exerciseDetail}>{`Para: ${userInfo.firstName} ${userInfo.lastName}`}</Text>
            <Text style={styles.exerciseDetail}>{userInfo.email}</Text>
          </View>
        )}

        {template.notes && (
          <View>
            <Text style={styles.sectionTitle}>Notas de entrenamiento</Text>
            <Text style={styles.exerciseDetail}>{template.notes}</Text>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Ejercicios</Text>
          {template.exercises.map((ex, idx) => (
            <View key={idx} style={styles.exercise}>
              <Text style={styles.exerciseName}>{`${idx + 1}. ${ex.name}`}</Text>
              <Text style={styles.exerciseDetail}>{`${ex.sets} x ${ex.reps}`}</Text>
              {ex.rest && <Text style={styles.exerciseDetail}>{`Descanso: ${ex.rest}`}</Text>}
              {ex.cadence && <Text style={styles.exerciseDetail}>{`Cadencia: ${ex.cadence}`}</Text>}
              {ex.rir && <Text style={styles.exerciseDetail}>{`RIR: ${ex.rir}`}</Text>}
              {ex.youtubeLink && <Text style={styles.exerciseDetail}>{`Video: ${ex.youtubeLink}`}</Text>}
              {ex.notes && <Text style={styles.exerciseDetail}>{ex.notes}</Text>}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          {`Generado para ${userInfo ? userInfo.firstName : 'usuario'} con FitPlan Selector`}
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadRoutinePDF(template, userInfo = null, orientation = 'portrait') {
  const blob = await pdf(<RoutineDocument template={template} userInfo={userInfo} orientation={orientation} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${template.name.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return blob;
}
