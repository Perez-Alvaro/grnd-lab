import { buildExerciseVideoUrl } from "../../lib/recipeSearch.js";

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
  const duracion = variant.duracion ?? exercise.duracion ?? "";
  const rir = variant.rir ?? exercise.rir ?? "";
  const tempo = variant.cadencia ?? exercise.cadencia ?? "";

  const notesList = [
    ...(blockTitle ? [`Bloque: ${blockTitle}`] : []),
    ...toArray(exercise?.notes || exercise?.note || exercise?.notas),
    ...toArray(variant?.cues || exercise?.cues),
    ...toArray(variant?.progresion || exercise?.progresion),
  ];

  const baseNotes = notesList.join("\n");
  const name = exercise?.ejercicio || exercise?.title || exercise?.name || exercise?.nombre || "Ejercicio";

  return {
    name,
    series: series ? String(series) : "",
    reps: reps ? String(reps) : "",
    descanso: descanso ? String(descanso) : "",
    duracion: duracion ? String(duracion) : "",
    rir: (rir === 0 || rir) ? String(rir) : "",
    tempo: (tempo === 0 || tempo) ? String(tempo) : "",
    videoUrl: buildExerciseVideoUrl(exercise?.videoUrl || exercise?.youtubeLink || exercise?.video || name),
    notes: baseNotes,
  };
};

const normalizeWarmupExercise = (exercise) => ({
  name:
    exercise?.name || exercise?.ejercicio || exercise?.nombre || exercise?.title || "Ejercicio",
  duration:
    exercise?.duration || exercise?.duracion || exercise?.reps || exercise?.tiempo || "",
  notes: toArray(exercise?.notes || exercise?.notas).join(" "),
});

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

  // Entrada en calor: formato del editor (warmupExercises) o legacy (entradaEnCalor).
  // Va a su propia tabla en el PDF, no mezclada con los ejercicios principales.
  const warmupSource = Array.isArray(day?.warmupExercises)
    ? day.warmupExercises
    : Array.isArray(day?.entradaEnCalor)
      ? day.entradaEnCalor
      : [];
  const warmupExercises = warmupSource.map(normalizeWarmupExercise);

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
  } else if (Array.isArray(day?.entrenamiento)) {
    exercises = day.entrenamiento.map((exercise) => normalizeExercise(exercise));
  }

  const exerciseNotes = exercises.flatMap((exercise) => exercise.notes || []);

  return {
    name: dayName,
    type,
    exercises,
    warmupExercises,
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

export const resolveBrandName = (input = {}) => {
  if (!input || typeof input !== "object") return "Mock";
  const meta = input?.metadata || input?.meta || input;

  const clean = (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : null);

  const candidate =
    clean(meta?.brandName) ||
    clean(input?.brandName) ||
    clean(meta?.marca) ||
    clean(meta?.author) ||
    clean(input?.author) ||
    clean(meta?.coach) ||
    clean(input?.coach) ||
    clean(meta?.trainer) ||
    clean(meta?.autor) ||
    clean(input?.userName) ||
    clean(input?.user);

  if (candidate) return candidate;

  if (typeof window !== "undefined" && window?.localStorage) {
    try {
      const stored = window.localStorage.getItem("mock:coach-brand-name");
      const cleanedStored = clean(stored);
      if (cleanedStored) {
        return cleanedStored;
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
  }

  return "Mock";
};

export const resolveBrandLogo = (planData) => {
  const meta = planData?.meta || planData?.metadata || {};
  const clean = (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : null);

  const candidate =
    clean(meta?.brandLogo) ||
    clean(planData?.brandLogo) ||
    clean(meta?.logo) ||
    clean(planData?.logo);

  if (candidate) return candidate;

  if (typeof window !== "undefined" && window?.localStorage) {
    try {
      const stored = window.localStorage.getItem("mock:coach-brand-logo");
      const cleanedStored = clean(stored);
      if (cleanedStored) return cleanedStored;
    } catch {
      // Ignore localStorage read errors
    }
  }

  return null;
};

export const normalizePlanData = async (planData) => {
  // Soportar tanto formato plano como formato con 'meta'
  const metadata = planData?.meta || planData || {};
  const brandName = resolveBrandName(planData);
  const brandLogo = resolveBrandLogo(planData);
  const weeksSource = planData?.weeks || planData?.semanas || metadata?.weeks || metadata?.semanas;
  const daysFallback = planData?.days || planData?.dias || metadata?.days || metadata?.dias;

  let weeks = [];
  if (Array.isArray(weeksSource) && weeksSource.length) {
    weeks = weeksSource.map((week, index) => {
      const normalized = normalizeWeek(week, index);
      return { ...normalized, brandName };
    });
  } else if (Array.isArray(daysFallback) && daysFallback.length) {
    weeks = [
      {
        ...normalizeWeek(
          {
            title: "Semana 1",
            description: metadata?.notes || metadata?.notas,
            days: daysFallback,
          },
          0,
        ),
        brandName,
      },
    ];
  } else {
    weeks = [{ ...normalizeWeek({ title: "Semana 1", days: [] }, 0), brandName }];
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
    brandName,
    brandLogo,
    author: metadata?.author || metadata?.coach || metadata?.trainer || metadata?.autor || brandName || "",
    durationWeeks: metadata?.durationWeeks || metadata?.semanas || metadata?.duracion || "",
    equipment: metadata?.equipment || metadata?.equipamiento || "",
    tags: tagsArray,
    notes: metadata?.notes || metadata?.notas || "",

    weeks,
    progress: normalizeProgress(progressSource),
  };
};
