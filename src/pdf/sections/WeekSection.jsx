import { View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget, weekAnchorId } from "../utils/pdfAnchors.js";

const ExerciseTable = ({ exercises, styles }) => {
  if (!exercises || !exercises.length) return null;
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        <Text
          style={[styles.tableCell, styles.tableHeaderCell, styles.exerciseCol]}
        >
          Ejercicio
        </Text>
        <Text
          style={[styles.tableCell, styles.tableHeaderCell, styles.seriesCol]}
        >
          Series
        </Text>
        <Text
          style={[styles.tableCell, styles.tableHeaderCell, styles.repsCol]}
        >
          Reps
        </Text>
        <Text
          style={[styles.tableCell, styles.tableHeaderCell, styles.restCol]}
        >
          Desc
        </Text>
        <Text style={[styles.tableCell, styles.tableHeaderCell, styles.rirCol]}>
          RIR
        </Text>
        <Text
          style={[styles.tableCell, styles.tableHeaderCell, styles.tempoCol]}
        >
          Cadencia
        </Text>
        <Text
          style={[styles.tableCell, styles.tableHeaderCell, styles.videoCol]}
        >
          Video
        </Text>
      </View>
      {exercises.map((exercise, idx) => {
        const name = exercise.name || "—";
        const setsValue = exercise.series ?? exercise.sets;
        const sets = setsValue === 0 || setsValue ? setsValue : "–";
        const repsValue = exercise.reps;
        const reps = repsValue === 0 || repsValue ? repsValue : "–";
        const restValue = exercise.rest ?? exercise.descanso;
        const rest = restValue === 0 || restValue ? restValue : "–";
        const rir = exercise.rir === 0 || exercise.rir ? exercise.rir : "–";
        const tempoValue = exercise.tempo ?? exercise.cadencia;
        const tempo = tempoValue === 0 || tempoValue ? tempoValue : "–";
        const videoUrl = exercise.video || exercise.videoUrl;
        const hasNotes = !!(exercise.notes || exercise.note);

        const rows = [
          <View
            key={`${name}-${idx}`}
            style={[
              styles.tableRow,
              idx % 2 === 0 ? null : styles.tableRowAlternate,
            ]}
          >
            <Text style={[styles.tableCell, styles.exerciseCol]}>{name}</Text>
            <Text style={[styles.tableCell, styles.seriesCol]}>{sets}</Text>
            <Text style={[styles.tableCell, styles.repsCol]}>{reps}</Text>
            <Text style={[styles.tableCell, styles.restCol]}>{rest}</Text>
            <Text style={[styles.tableCell, styles.rirCol]}>{rir}</Text>
            <Text style={[styles.tableCell, styles.tempoCol]}>{tempo}</Text>
            {videoUrl ? (
              <Link
                src={videoUrl}
                style={[styles.tableCell, styles.videoCol, styles.videoLink]}
              >
                Ver
              </Link>
            ) : (
              <Text style={[styles.tableCell, styles.videoCol]}>-</Text>
            )}
          </View>
        ];

        if (hasNotes) {
          rows.push(
            <View
              key={`${name}-${idx}-notes`}
              style={[
                styles.tableRow,
                styles.exerciseNotesRow,
                idx % 2 === 0 ? null : styles.tableRowAlternate,
              ]}
            >
              <Text style={[styles.tableCell, styles.exerciseNotesCell]}>
                Notas: {exercise.notes || exercise.note}
              </Text>
            </View>
          );
        }

        return rows;
      }).flat()}
    </View>
  );
};

const DayBlock = ({ day, styles }) => {
  const isRestDay = day.type === "DESCANSO";

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
          {isRestDay ? "Descanso" : "Entrenamiento"}
        </Text>
      </View>
      {isRestDay ? (
        <Text style={styles.restMessage}>{day.recoveryMessage}</Text>
      ) : (
        <ExerciseTable exercises={day.exercises} styles={styles} />
      )}
    </View>
  );
};

const WeekSection = ({ week, styles, breakBefore = false }) => (
  <View
    style={styles.weekSection}
    break={breakBefore}
    id={weekAnchorId(week.number)}
  >
    <View style={styles.weekHeader}>
      <Text style={styles.weekTitle}>{week.title}</Text>
      {week.notes && week.notes.length ? (
        <Text style={styles.weekSubtitle}>{week.notes.join("\n")}</Text>
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
