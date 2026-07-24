import { View, Text, Link } from "@react-pdf/renderer";
import { indexLinkTarget, weekAnchorId } from "../utils/pdfAnchors.js";

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

// ── Keep-together ────────────────────────────────────────────
// Cada día se imprime ENTERO en una página (salta a la siguiente si no entra
// en lo que queda). Solo un día más alto que una página completa fluye con
// filas atómicas, para no recortarse. La estimación sobreestima a propósito.
const estimateDayHeight = (day) => {
  if (day.type === "DESCANSO") return 90;
  let h = 90; // padding de la card + header del día
  const warmup = day.warmupExercises || [];
  if (warmup.length) {
    h += 60; // título + header de tabla de entrada en calor
    for (const w of warmup) {
      h += Math.max(1, Math.ceil(formatNotes(w.notes).length / 42)) * 16 + 14;
    }
  }
  const exercises = day.exercises || [];
  if (exercises.length) {
    h += 40; // header de la tabla
    for (const ex of exercises) {
      const nameLines = Math.max(1, Math.ceil((ex.name || "").length / 24));
      h += nameLines * 15 + 17;
      const notes = formatNotes(ex.notes || ex.note);
      if (notes) h += Math.ceil(notes.length / 80) * 15 + 17;
    }
  }
  return h;
};

// Página A4 útil ≈ 770pt; margen de seguridad amplio
const MAX_KEEP_TOGETHER = 640;

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
        const videoUrl = exercise.video || exercise.videoUrl;
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

const DayBlock = ({ day, dayNumber, styles }) => {
  const isRestDay = day.type === "DESCANSO";

  const keepTogether = estimateDayHeight(day) <= MAX_KEEP_TOGETHER;

  return (
    <View style={styles.dayContainer} wrap={!keepTogether} minPresenceAhead={110}>
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
      <DayBlock key={`${week.number}-${idx}`} day={day} dayNumber={day.dayNumber ?? idx + 1} styles={styles} />
    ))}
  </View>
);

export default WeekSection;
