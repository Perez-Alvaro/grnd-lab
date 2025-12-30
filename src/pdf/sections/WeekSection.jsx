import { Fragment } from "react";
import { View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget, weekAnchorId } from "../utils/pdfAnchors.js";

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

  const formatValue = (value) =>
    value === 0 || value ? String(value) : "—";

  const formatNotes = (value) => {
    if (!value) return "—";
    if (Array.isArray(value)) {
      const filtered = value.filter(Boolean);
      return filtered.length ? filtered.join(" • ") : "—";
    }
    return String(value);
  };

  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        <Text style={[styles.tableCell, styles.exerciseCol]}>Ejercicio</Text>
        <Text style={[styles.tableCell, styles.seriesCol]}>Series</Text>
        <Text style={[styles.tableCell, styles.repsCol]}>Reps</Text>
        <Text style={[styles.tableCell, styles.restCol]}>Desc</Text>
        <Text style={[styles.tableCell, styles.durationCol]}>Dur</Text>
        <Text style={[styles.tableCell, styles.rirCol]}>RIR</Text>
        <Text style={[styles.tableCell, styles.tempoCol]}>Cadencia</Text>
        <Text style={[styles.tableCell, styles.notesCol]}>Notas</Text>
        <Text style={[styles.tableCell, styles.videoCol]}>Video</Text>
      </View>
      {exercises.map((exercise, idx) => {
        const name = exercise.name || "—";
        const setsValue = exercise.series ?? exercise.sets;
        const sets = formatValue(setsValue);
        const repsValue = exercise.reps;
        const reps = formatValue(repsValue);
        const restValue = exercise.rest ?? exercise.descanso;
        const rest = formatValue(restValue);
        const durationValue = exercise.duracion ?? exercise.duration ?? exercise.tiempo;
        const duration = formatValue(durationValue);
        const rir = formatValue(exercise.rir);
        const tempoValue = exercise.tempo ?? exercise.cadencia;
        const tempo = formatValue(tempoValue);
        const videoUrl = exercise.video || exercise.videoUrl;
        const notes = formatNotes(exercise.notes);

        return (
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
            <Text style={[styles.tableCell, styles.durationCol]}>{duration}</Text>
            <Text style={[styles.tableCell, styles.rirCol]}>{rir}</Text>
            <Text style={[styles.tableCell, styles.tempoCol]}>{tempo}</Text>
            <Text style={[styles.tableCell, styles.notesCol]}>{notes}</Text>
            {videoUrl ? (
              <Link
                src={videoUrl}
                style={[
                  styles.tableCell,
                  styles.videoCol,
                  styles.videoLink,
                  styles.videoButton,
                ]}
              >
                Ver video
              </Link>
            ) : (
              <Text style={[styles.tableCell, styles.videoCol]}>—</Text>
            )}
          </View>
        );
      })}
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
        <Fragment>
          <ExerciseTable exercises={day.exercises} styles={styles} />
          <DayNotes notes={day.notes} styles={styles} />
        </Fragment>
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
