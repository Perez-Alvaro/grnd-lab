import { StyleSheet, View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget, weekAnchorId } from "../utils/pdfAnchors.js";
import { buildExerciseVideoUrl } from "../../lib/recipeSearch.js";

const localStyles = StyleSheet.create({
  runningHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 6,
    marginBottom: 10,
  },
  runningHeaderBrand: {
    fontSize: 9,
    fontWeight: 700,
    color: "#2E4A5F",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  runningHeaderLink: {
    fontSize: 9,
    color: "#6E6E6E",
    textDecoration: "none",
  },
});

const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return `https://${trimmed}`;
};

const formatNotes = (notes) => {
  if (!notes) return "";
  if (Array.isArray(notes)) return notes.filter(Boolean).join("\n");
  return String(notes);
};

const ExerciseTable = ({ exercises, styles }) => {
  if (!exercises || !exercises.length) return null;
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]} wrap={false} minPresenceAhead={40}>
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
        const videoUrl = buildExerciseVideoUrl(exercise);
        const hasNotes = !!(exercise.notes || exercise.note);

        const rows = [
          <View
            key={`${name}-${idx}`}
            wrap={false}
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
                src={normalizeUrl(videoUrl)}
                style={[styles.tableCell, styles.videoCol, styles.videoLink]}
              >
                <Text>VER VIDEO</Text>
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
              wrap={false}
              style={[
                styles.tableRow,
                styles.exerciseNotesRow,
                idx % 2 === 0 ? null : styles.tableRowAlternate,
              ]}
            >
              <Text style={[styles.tableCell, styles.exerciseNotesCell]}>
                Notas: {formatNotes(exercise.notes || exercise.note)}
              </Text>
            </View>
          );
        }

        return rows;
      }).flat()}
    </View>
  );
};

const WarmupTable = ({ warmupExercises, dayNumber, styles }) => {
  if (!warmupExercises || !warmupExercises.length) return null;
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={[styles.dayName, { fontSize: 9, marginBottom: 3, opacity: 0.75 }]}>
        Entrada en calor del Día {dayNumber}
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeaderRow]} wrap={false} minPresenceAhead={40}>
          <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 3 }]}>Ejercicio</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>Duración</Text>
          <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 4 }]}>Notas</Text>
        </View>
        {warmupExercises.map((ex, idx) => (
          <View
            key={`warmup-${idx}`}
            wrap={false}
            style={[styles.tableRow, idx % 2 !== 0 ? styles.tableRowAlternate : null]}
          >
            <Text style={[styles.tableCell, { flex: 3 }]}>{ex.name || "—"}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{ex.duration || "—"}</Text>
            <Text style={[styles.tableCell, { flex: 4 }]}>{formatNotes(ex.notes) || "—"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// La card del día ya no necesita heurísticas de salto: cada día vive en su
// propia <Page> con altura dinámica (ver PlanRenderer + pageSizing), así que
// nunca se corta. wrap={false} garantiza que react-pdf no lo intente paginar.
const DayBlock = ({ day, dayNumber, styles }) => {
  const isRestDay = day.type === "DESCANSO";

  return (
    <View style={styles.dayContainer} wrap={false}>
      <View style={styles.dayHeader} wrap={false}>
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
        <>
          <WarmupTable
            warmupExercises={day.warmupExercises}
            dayNumber={dayNumber}
            styles={styles}
          />
          <ExerciseTable exercises={day.exercises} styles={styles} />
        </>
      )}
    </View>
  );
};

/** Encabezado de semana (con anchor del índice). Solo en el primer día de la semana. */
const WeekHeader = ({ week, styles }) => (
  <View style={styles.weekHeader} id={weekAnchorId(week.number)} wrap={false}>
    <Text style={styles.weekTitle}>{week.title}</Text>
    {week.notes && week.notes.length ? (
      <Text style={styles.weekSubtitle}>{week.notes.join("\n")}</Text>
    ) : null}
    <Link src={indexLinkTarget()} style={styles.backToIndex}>
      Volver al índice
    </Link>
  </View>
);

/**
 * Contenido de la página de UN día de entrenamiento: encabezado de semana
 * (opcional, solo el primer día) + la card del día. Va dentro de una <Page>
 * de altura dinámica en PlanRenderer.
 */
export const WorkoutDayContent = ({
  week,
  day,
  dayNumber,
  showWeekHeader = false,
  brandName,
  styles,
}) => {
  const cleanBrand = (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : null);
  const resolvedBrand =
    cleanBrand(brandName) ||
    cleanBrand(week?.brandName) ||
    (typeof window !== "undefined" && cleanBrand(window?.localStorage?.getItem?.("mock:coach-brand-name"))) ||
    "Mock";
  const weekTitle = week?.title || `Semana ${week?.number || 1}`;

  return (
    <>
      <View style={[localStyles.runningHeader, styles?.runningHeader]} wrap={false}>
        <Text style={[localStyles.runningHeaderBrand, styles?.runningHeaderBrand]}>
          {`${resolvedBrand} · ${day.name} · ${weekTitle}`}
        </Text>
        <Link src={indexLinkTarget()} style={[localStyles.runningHeaderLink, styles?.runningHeaderLink]}>
          Volver al índice
        </Link>
      </View>
      {showWeekHeader ? <WeekHeader week={week} styles={styles} /> : null}
      <DayBlock day={day} dayNumber={dayNumber} styles={styles} />
    </>
  );
};

/** Contenido mínimo para una semana sin días: mantiene vivo el anchor del índice. */
export const EmptyWeekContent = ({ week, styles }) => (
  <>
    <WeekHeader week={week} styles={styles} />
    <Text style={styles.restMessage}>Sin días cargados.</Text>
  </>
);

export default WorkoutDayContent;
