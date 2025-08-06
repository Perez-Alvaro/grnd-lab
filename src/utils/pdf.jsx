import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const palette = {
  jet: '#2D2D2D',
  lime: '#CBFF00',
  chartreuse: '#DBFE52',
  gray: '#787878'
};

const createStyles = (format = 'mobile') => {
  const isMobile = format === 'mobile';
  const baseFont = isMobile ? 12 : 10;
  const headerFont = isMobile ? 18 : 16;

  return StyleSheet.create({
    page: {
      padding: 24,
      fontFamily: 'Helvetica',
      fontSize: baseFont,
      color: palette.jet
    },
    header: {
      backgroundColor: palette.jet,
      padding: 12,
      textAlign: 'center',
      borderRadius: 4,
      marginBottom: 16
    },
    headerTitle: {
      fontSize: headerFont,
      fontWeight: 'bold',
      color: palette.lime
    },
    headerSub: {
      fontSize: baseFont,
      color: palette.chartreuse,
      marginTop: 4
    },
    sectionTitle: {
      fontSize: headerFont - 2,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 16
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: palette.gray,
      borderRadius: 4
    },
    tableRow: {
      flexDirection: 'row'
    },
    tableColHeader: {
      width: '25%',
      backgroundColor: palette.jet,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: palette.gray
    },
    tableCol: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: palette.gray
    },
    tableCellHeader: {
      margin: 4,
      fontSize: baseFont,
      fontWeight: 'bold',
      color: palette.lime
    },
    tableCell: {
      margin: 4,
      fontSize: baseFont - 1,
      color: '#555'
    },
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      right: 24,
      textAlign: 'center',
      fontSize: baseFont - 2,
      color: '#555'
    }
  });
};

function RoutineDocument({ template, userInfo, orientation, format }) {
  const styles = createStyles(format);

  return (
    <Document>
      <Page size="A4" orientation={orientation} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{template.name}</Text>
          <Text style={styles.headerSub}>{`${template.frequency} días/semana • ${template.objective}`}</Text>
          <Text style={styles.headerSub}>{new Date().toLocaleDateString()}</Text>
          {userInfo && (
            <Text style={styles.headerSub}>{`Para: ${userInfo.firstName} ${userInfo.lastName}`}</Text>
          )}
        </View>

        {template.notes && (
          <View>
            <Text style={styles.sectionTitle}>Notas de entrenamiento</Text>
            <Text style={styles.tableCell}>{template.notes}</Text>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Ejercicios</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '40%' }]}>
                <Text style={styles.tableCellHeader}>Ejercicio</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Series x Reps</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Descanso</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Notas</Text>
              </View>
            </View>
            {template.exercises.map((ex, idx) => (
              <View key={idx} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '40%' }]}>
                  <Text style={styles.tableCell}>{ex.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{`${ex.sets}x${ex.reps}`}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{ex.rest || '-'}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>
                    {[ex.cadence && `Cadencia: ${ex.cadence}`, ex.rir && `RIR: ${ex.rir}`, ex.notes]
                      .filter(Boolean)
                      .join(' | ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>
          {`Generado para ${userInfo ? userInfo.firstName : 'usuario'} con FitPlan Selector`}
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadRoutinePDF(
  template,
  userInfo = null,
  orientation = 'portrait',
  format = 'mobile'
) {
  const blob = await pdf(
    <RoutineDocument
      template={template}
      userInfo={userInfo}
      orientation={orientation}
      format={format}
    />
  ).toBlob();
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

