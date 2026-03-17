const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeExercise = (exercise, blockTitle) => {
  const variant = exercise?.variantes?.[0] || {};
  const series = variant.series ?? exercise.series ?? "";
  const reps = variant.reps ?? exercise.reps ?? "";
  const descanso = variant.descanso ?? exercise.descanso ?? "";
  
  // Soportar tanto RIR como RPE
  const rir = variant.rir ?? exercise.rir ?? variant.rpe ?? exercise.rpe ?? "";
  
  const tempo = variant.tempo ?? exercise.tempo ?? variant.cadencia ?? exercise.cadencia ?? "";
  
  // Nuevos campos agregados del formato del editor
  const duracion = exercise.duracion ?? "";
  const cues = exercise.cues ?? "";
  const progresion = exercise.progresion ?? "";

  const videoUrl = exercise?.videoUrl || exercise?.youtubeLink || exercise?.video || exercise?.link || "";

  const baseNotes = [
    blockTitle && blockTitle !== "Entrenamiento"
      ? `Bloque: ${blockTitle}`
      : null,
  ]
    .concat(toArray(exercise?.notes || exercise?.notas))
    .concat(cues ? [`Cues: ${cues}`] : [])
    .concat(progresion ? [`Progresión: ${progresion}`] : [])
    .filter(Boolean)
    // Filtramos cualquier nota que coincida exactamente con la URL del video para que no se vea duplicada abajo
    .filter(note => note.trim() !== videoUrl.trim());

  return {
    name:
      exercise?.ejercicio || exercise?.title || exercise?.name || exercise?.nombre || "Ejercicio",
    series: series ? String(series) : "",
    reps: reps ? String(reps) : "",
    descanso: descanso ? String(descanso) : "",
    duracion: duracion ? String(duracion) : "",
    rir: (rir === 0 || rir) ? String(rir) : "",
    tempo: (tempo === 0 || tempo) ? String(tempo) : "",
    videoUrl,
    notes: baseNotes,
  };
};

const normalizeDay = (day, index) => {
  const dayName = day?.name || day?.title || day?.titulo || day?.nombre || `Día ${index + 1}`;
  const type = (
    day?.type ||
    day?.tipo ||
    day?.estado ||
    "ENTRENAMIENTO"
  ).toUpperCase();
  const recoveryMessage =
    day?.recoveryMessage ||
    day?.mensajeRecuperacion ||
    day?.notaRecuperacion ||
    "Recuperación activa y movilidad ligera recomendada.";

  let exercises = [];
  if (Array.isArray(day?.exercises)) {
    exercises = day.exercises.map((exercise) => normalizeExercise(exercise));
  } else if (Array.isArray(day?.bloques)) {
    // Formato del editor: bloques con ejercicios
    exercises = day.bloques.flatMap((block) =>
      (block?.ejercicios || block?.items || []).map((exercise) =>
        normalizeExercise(exercise, block?.titulo || block?.tipo),
      ),
    );
  } else if (
    Array.isArray(day?.entradaEnCalor) ||
    Array.isArray(day?.entrenamiento)
  ) {
    const warmup = (day?.entradaEnCalor || []).map((exercise) =>
      normalizeExercise(exercise, "Entrada en calor"),
    );
    const training = (day?.entrenamiento || []).map((exercise) =>
      normalizeExercise(exercise),
    );
    exercises = [...warmup, ...training];
  }

  const exerciseNotes = exercises.flatMap((exercise) => exercise.notes || []);

  return {
    name: dayName,
    type,
    exercises,
    notes: [
      ...new Set([...exerciseNotes, ...toArray(day?.notes || day?.notas)]),
    ],
    recoveryMessage,
  };
};

const normalizeWeek = (week, index) => {
  const weekNumber = index + 1;
  const weekTitle =
    week?.title || week?.nombre || week?.titulo || `Semana ${weekNumber}`;
  const daysSource = week?.days || week?.dias || [];

  const normalizedDays = daysSource.map((day, dayIndex) =>
    normalizeDay(day, dayIndex),
  );

  return {
    number: weekNumber,
    title: weekTitle,
    summary: week?.summary || week?.descripcionCorta || week?.description || "",
    notes: toArray(week?.notes || week?.descripcion || week?.descripcionLarga),
    days: normalizedDays,
  };
};

const normalizeProgress = (plan) => {
  if (!plan) return null;
  const notes = toArray(
    plan?.progressNotes || plan?.seguimiento || plan?.notes || "",
  );
  const metrics = Array.isArray(plan?.progressMetrics || plan?.metricas)
    ? plan.progressMetrics || plan.metricas
    : [];

  if (!notes.length && (!metrics || !metrics.length)) {
    return null;
  }

  return {
    notes,
    metrics: metrics
      .map((metric) => ({
        label: metric?.label || metric?.nombre || "",
        value: metric?.value || metric?.valor || "",
      }))
      .filter((metric) => metric.label || metric.value),
  };
};

export const normalizePlanData = async (planData) => {
  // Soportar tanto formato plano como formato con 'meta'
  const metadata = planData?.meta || planData || {};
  const weeksSource = planData?.weeks || planData?.semanas || metadata?.weeks || metadata?.semanas;
  const daysFallback = planData?.days || planData?.dias || metadata?.days || metadata?.dias;

  let weeks = [];
  if (Array.isArray(weeksSource) && weeksSource.length) {
    weeks = weeksSource.map((week, index) => normalizeWeek(week, index));
  } else if (Array.isArray(daysFallback) && daysFallback.length) {
    weeks = [
      normalizeWeek(
        {
          title: "Semana 1",
          description: metadata?.notes || metadata?.notas,
          days: daysFallback,
        },
        0,
      ),
    ];
  } else {
    weeks = [normalizeWeek({ title: "Semana 1", days: [] }, 0)];
  }

  const progressSource =
    metadata?.progress ||
    (metadata?.progressNotes || metadata?.progressMetrics ? metadata : null);

  // Extract and normalize tags
  const tagsRaw = metadata?.tags || planData?.tags || "";
  const tagsArray = Array.isArray(tagsRaw) 
    ? tagsRaw 
    : String(tagsRaw).split(",").map((tag) => tag.trim()).filter(Boolean);

  return {
    // Keep existing fields for backward compatibility
    title:
      metadata?.name ||
      metadata?.planName ||
      metadata?.title ||
      metadata?.nombre ||
      planData?.nombre ||
      "Plan de entrenamiento",
    user: metadata?.user || metadata?.usuario || metadata?.clientName || "",
    duration: metadata?.duration || metadata?.duracion || "",
    frequency:
      metadata?.frequency || metadata?.frecuencia
        ? String(metadata.frequency || metadata.frecuencia)
        : "",
    objective: metadata?.objective || metadata?.objetivo || metadata?.foco || "",

    // Add new metadata fields for enhanced PDF
    image: "",  // No images in PDF
    description: metadata?.description || metadata?.descripcion || "",
    level: metadata?.level || metadata?.nivel || "",
    author: metadata?.author || metadata?.coach || metadata?.trainer || metadata?.autor || "",
    durationWeeks: metadata?.durationWeeks || metadata?.semanas || metadata?.duracion || "",
    equipment: metadata?.equipment || metadata?.equipamiento || "",
    tags: tagsArray,
    notes: metadata?.notes || metadata?.notas || "",

    weeks,
    progress: normalizeProgress(progressSource),
  };
};
