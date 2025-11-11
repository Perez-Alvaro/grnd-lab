const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeExercise = (exercise, blockTitle) => {
  const variant = exercise?.variantes?.[0] || {};
  const series = variant.series ?? exercise.series ?? '';
  const reps = variant.reps ?? exercise.reps ?? '';
  const descanso = variant.descanso ?? exercise.descanso ?? '';

  const baseNotes = [blockTitle && blockTitle !== 'Entrenamiento' ? `Bloque: ${blockTitle}` : null]
    .concat(toArray(exercise?.notes || exercise?.notas))
    .filter(Boolean);

  return {
    name: exercise?.ejercicio || exercise?.title || exercise?.name || 'Ejercicio',
    series: series ? String(series) : '',
    reps: reps ? String(reps) : '',
    descanso: descanso ? String(descanso) : '',
    videoUrl: exercise?.videoUrl || exercise?.youtubeLink || exercise?.video || '',
    notes: baseNotes,
  };
};

const normalizeDay = (day, index) => {
  const dayName = day?.name || day?.title || day?.titulo || `Día ${index + 1}`;
  const type = (day?.type || day?.tipo || day?.estado || 'ENTRENAMIENTO').toUpperCase();
  const recoveryMessage =
    day?.recoveryMessage || day?.mensajeRecuperacion || 'Recuperación activa y movilidad ligera recomendada.';

  let exercises = [];
  if (Array.isArray(day?.exercises)) {
    exercises = day.exercises.map((exercise) => normalizeExercise(exercise));
  } else if (Array.isArray(day?.bloques)) {
    exercises = day.bloques.flatMap((block) =>
      (block?.items || []).map((exercise) => normalizeExercise(exercise, block?.titulo))
    );
  } else if (Array.isArray(day?.entradaEnCalor) || Array.isArray(day?.entrenamiento)) {
    const warmup = (day?.entradaEnCalor || []).map((exercise) => normalizeExercise(exercise, 'Entrada en calor'));
    const training = (day?.entrenamiento || []).map((exercise) => normalizeExercise(exercise));
    exercises = [...warmup, ...training];
  }

  const exerciseNotes = exercises.flatMap((exercise) => exercise.notes || []);

  return {
    name: dayName,
    type,
    exercises,
    notes: [...new Set([...exerciseNotes, ...toArray(day?.notes || day?.notas)])],
    recoveryMessage,
  };
};

const normalizeWeek = (week, index) => {
  const weekNumber = index + 1;
  const weekTitle = week?.title || week?.nombre || week?.titulo || `Semana ${weekNumber}`;
  const daysSource = week?.days || week?.dias || [];

  const normalizedDays = daysSource.map((day, dayIndex) => normalizeDay(day, dayIndex));

  return {
    number: weekNumber,
    title: weekTitle,
    summary: week?.summary || week?.descripcionCorta || week?.description || '',
    notes: toArray(week?.notes || week?.descripcion || week?.descripcionLarga),
    days: normalizedDays,
  };
};

const normalizeProgress = (plan) => {
  if (!plan) return null;
  const notes = toArray(plan?.progressNotes || plan?.seguimiento || plan?.notes || '');
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
        label: metric?.label || metric?.nombre || '',
        value: metric?.value || metric?.valor || '',
      }))
      .filter((metric) => metric.label || metric.value),
  };
};

export const normalizePlanData = (planData) => {
  const metadata = planData || {};
  const weeksSource = metadata?.weeks || metadata?.semanas;
  const daysFallback = metadata?.days || metadata?.dias;

  let weeks = [];
  if (Array.isArray(weeksSource) && weeksSource.length) {
    weeks = weeksSource.map((week, index) => normalizeWeek(week, index));
  } else if (Array.isArray(daysFallback) && daysFallback.length) {
    weeks = [
      normalizeWeek(
        {
          title: 'Semana 1',
          description: metadata?.notes,
          days: daysFallback,
        },
        0
      ),
    ];
  } else {
    weeks = [normalizeWeek({ title: 'Semana 1', days: [] }, 0)];
  }

  const progressSource = metadata?.progress
    || (metadata?.progressNotes || metadata?.progressMetrics ? metadata : null);

  return {
    title: metadata?.planName || metadata?.title || metadata?.nombre || 'Plan de entrenamiento',
    user: metadata?.user || metadata?.usuario || metadata?.clientName || '',
    duration: metadata?.duration || metadata?.duracion || '',
    frequency:
      metadata?.frequency || metadata?.frecuencia
        ? String(metadata.frequency || metadata.frecuencia)
        : '',
    objective: metadata?.objective || metadata?.objetivo || '',
    weeks,
    progress: normalizeProgress(progressSource),
  };
};
