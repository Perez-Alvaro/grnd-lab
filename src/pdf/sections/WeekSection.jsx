import { Fragment } from 'react';
import { View, Text, Link } from '@react-pdf/renderer';
import { indexLinkTarget, weekAnchorId } from '../utils/pdfLinks.js';

const DayNotes = ({ notes, styles }) => {
  if (!notes || !notes.length) return null;
  return (
    <View style={styles.notesList}>
      {notes.map((note, idx) => (
        <Text key={idx} style={styles.noteItem}>
          <Text style={styles.noteBullet}>•</Text>
          {note}
        </Text>
      ))}
    </View>
  );
};

const ExerciseTable = ({ exercises, styles }) => {
  if (!exercises || !exercises.length) return null;
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        <Text style={[styles.tableCell, styles.exerciseCol]}>Ejercicio</Text>
        <Text style={[styles.tableCell, styles.seriesCol]}>Series</Text>
        <Text style={[styles.tableCell, styles.repsCol]}>Reps</Text>
        <Text style={[styles.tableCell, styles.restCol]}>Desc</Text>
        <Text style={[styles.tableCell, styles.videoCol]}>Video</Text>
      </View>
      {exercises.map((exercise, idx) => (
        <View
          key={`${exercise.name}-${idx}`}
          style={[
            styles.tableRow,
            idx % 2 === 0 ? null : styles.tableRowAlternate,
          ]}
        >
          <Text style={[styles.tableCell, styles.exerciseCol]}>{exercise.name}</Text>
          <Text style={[styles.tableCell, styles.seriesCol]}>{exercise.series || '-'}</Text>
          <Text style={[styles.tableCell, styles.repsCol]}>{exercise.reps || '-'}</Text>
          <Text style={[styles.tableCell, styles.restCol]}>{exercise.descanso || '-'}</Text>
          {exercise.videoUrl ? (
            <Link src={exercise.videoUrl} style={[styles.tableCell, styles.videoCol, styles.videoLink]}>
              Ver
            </Link>
          ) : (
            <Text style={[styles.tableCell, styles.videoCol]}>-</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const DayBlock = ({ day, styles }) => {
  const isRestDay = day.type === 'DESCANSO';

  return (
    <View style={styles.dayContainer} wrap={false}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayName}>{day.name}</Text>
        <Text
          style={[
            styles.dayType,
            isRestDay ? styles.dayTypeRest : styles.dayTypeTraining,
          ]}
        >
          {isRestDay ? 'Descanso' : 'Entrenamiento'}
        </Text>
      </View>
      {isRestDay ? (
        <Text style={styles.restMessage}>{day.recoveryMessage}</Text>
      ) : (
        <Fragment>
          <ExerciseTable exercises={day.exercises} styles={styles} />
          <DayNotes notes={day.notes} styles={styles} />
        </Fragment>
      )}
    </View>
  );
};

const WeekSection = ({ week, styles, breakBefore = false }) => (
  <View style={styles.weekSection} break={breakBefore} id={weekAnchorId(week.number)}>
    <View style={styles.weekHeader}>
      <Text style={styles.weekTitle}>{week.title}</Text>
      {week.notes && week.notes.length ? (
        <Text style={styles.weekSubtitle}>{week.notes.join('\n')}</Text>
      ) : null}
      <Link src={indexLinkTarget()} style={styles.backToIndex}>
        Volver al índice
      </Link>
    </View>
    {week.days.map((day, idx) => (
      <DayBlock key={`${week.number}-${idx}`} day={day} styles={styles} />
    ))}
  </View>
);

export default WeekSection;
