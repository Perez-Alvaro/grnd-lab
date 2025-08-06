import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const palette = {

  white: '#FFFFFF',
  grayLight: '#F8F9FA',
  gray: '#DEE2E6',
  grayDark: '#343A40'


};

const createStyles = (format = 'mobile') => {
  const isMobile = format === 'mobile';
  const baseFont = isMobile ? 13 : 10;
  const headerFont = isMobile ? 16 : 14;


  return StyleSheet.create({
    page: {
      padding: 24,
      fontFamily: 'Helvetica',
      fontSize: baseFont,

      color: palette.grayDark,
      backgroundColor: palette.white
    },
    header: {
      backgroundColor: palette.grayLight,
      padding: 8,
      textAlign: 'center',
      borderRadius: 6,
      marginBottom: 12

    },
    headerTitle: {
      fontSize: headerFont,
      fontWeight: 'bold',

      color: palette.grayDark
    },
    headerSub: {
      fontSize: baseFont - 1,
      color: palette.grayDark,
      marginTop: 2

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

      borderRadius: 6

    },
    tableRow: {
      flexDirection: 'row'
    },
    tableColHeader: {
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: palette.gray,
      backgroundColor: palette.grayLight
    },
    tableCol: {



      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: palette.gray
    },
    tableCellHeader: {
      margin: 4,

      fontSize: baseFont - 1,
      fontWeight: 'bold',
      color: palette.grayDark
    },
    tableCell: {
      margin: 4,
      fontSize: baseFont - 2,
      color: palette.grayDark

    },
    footer: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      right: 24,
      textAlign: 'center',

      fontSize: baseFont - 3,
      color: palette.grayDark
    }
  });
};

function renderTable(exercises, styles) {
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableColHeader, { width: '25%' }]}>
          <Text style={styles.tableCellHeader}>Ejercicio</Text>
        </View>
        <View style={[styles.tableColHeader, { width: '10%' }]}>
          <Text style={styles.tableCellHeader}>Series</Text>
        </View>
        <View style={[styles.tableColHeader, { width: '10%' }]}>
          <Text style={styles.tableCellHeader}>Reps</Text>
        </View>
        <View style={[styles.tableColHeader, { width: '15%' }]}>
          <Text style={styles.tableCellHeader}>Descanso</Text>
        </View>
        <View style={[styles.tableColHeader, { width: '15%' }]}>
          <Text style={styles.tableCellHeader}>Cadencia</Text>
        </View>
        <View style={[styles.tableColHeader, { width: '10%' }]}>
          <Text style={styles.tableCellHeader}>RIR</Text>
        </View>
        <View style={[styles.tableColHeader, { width: '15%' }]}>
          <Text style={styles.tableCellHeader}>Notas</Text>
        </View>
      </View>
      {exercises.map((ex, idx) => (
        <View key={idx} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>{ex.name}</Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>{ex.sets}</Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>{ex.reps}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>{ex.rest || '-'}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>{ex.cadence || '-'}</Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>{ex.rir || '-'}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>{ex.notes || ''}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}


function RoutineDocument({ template, userInfo, orientation, format }) {
  const styles = createStyles(format);

  return (
    <Document>
      <Page size="A4" orientation={orientation} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{template.name}</Text>
          <Text style={styles.headerSub}>{`${template.frequency} días/semana • ${template.objective}`}</Text>

        </View>

        {template.notes && (
          <View>
            <Text style={styles.sectionTitle}>Notas de entrenamiento</Text>
            <Text style={styles.tableCell}>{template.notes}</Text>

          </View>
        )}

        {template.warmup && template.warmup.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Entrada en calor</Text>
            {renderTable(template.warmup, styles)}
          </View>
        )}

        {template.exercises && template.exercises.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Entrenamiento</Text>
            {renderTable(template.exercises, styles)}
          </View>
        )}


        <Text style={styles.footer}>
          {`Generado con FitPlan Selector`}
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

