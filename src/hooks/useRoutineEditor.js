import { useState, useEffect, useMemo, useRef, useCallback } from "react";

const createId = () => Math.random().toString(36).slice(2, 10);

const defaultDayLabels = ["Lunes", "Miércoles", "Viernes"];

export const createExercise = () => ({
  id: createId(),
  name: "",
  sets: "",
  reps: "",
  rest: "",
  rir: "",
  tempo: "",
  video: "",
  note: "",
});

export const createDay = (label = "Día 1") => ({
  id: createId(),
  name: label,
  type: "ENTRENAMIENTO",
  recoveryNote: "",
  exercises: [createExercise()],
});

export const createEmptyWeek = (number = 1) => ({
  id: createId(),
  title: `Semana ${number}`,
  summary: "",
  notes: "",
  days: defaultDayLabels.map((dayLabel) => createDay(dayLabel)),
});

const cloneExercise = (exercise) => ({
  ...exercise,
  id: createId(),
});

const cloneDay = (day) => ({
  ...day,
  id: createId(),
  exercises: day.exercises.map(cloneExercise),
});

const cloneWeek = (week) => ({
  ...week,
  id: createId(),
  days: week.days.map(cloneDay),
});

const parseTags = (value) =>
  value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

const adjustDuration = (metadata, previousWeekCount, nextWeekCount) => {
  const currentDuration = parseInt(metadata.durationWeeks, 10);
  if (
    !metadata.durationWeeks ||
    Number.isNaN(currentDuration) ||
    currentDuration === previousWeekCount
  ) {
    return { ...metadata, durationWeeks: String(nextWeekCount) };
  }
  return metadata;
};

const convertLegacyExercise = (exercise) => {
  const variant = Array.isArray(exercise?.variantes)
    ? exercise.variantes[0] || {}
    : {};

  const noteValue = exercise?.notes || exercise?.note || exercise?.notas || "";

  return {
    id: createId(),
    name: exercise?.ejercicio || exercise?.name || "",
    sets: variant.series || exercise?.series || exercise?.sets || "",
    reps: variant.reps || exercise?.reps || "",
    rest: variant.descanso || exercise?.descanso || exercise?.rest || "",
    rir: variant.rir || exercise?.rir || "",
    tempo: variant.cadencia || exercise?.cadencia || exercise?.tempo || "",
    video: exercise?.videoUrl || exercise?.youtubeLink || exercise?.video || "",
    note: noteValue,
  };
};

const convertLegacyDay = (day, index = 0) => {
  const type = (
    day?.type ||
    day?.estado ||
    day?.tipo ||
    "ENTRENAMIENTO"
  ).toUpperCase();
  const bloques = Array.isArray(day?.bloques) ? day.bloques : [];
  const legacyExercises = bloques.length
    ? bloques.flatMap((block) =>
      (block?.items || []).map(convertLegacyExercise),
    )
    : Array.isArray(day?.exercises)
      ? day.exercises.map(convertLegacyExercise)
      : Array.isArray(day?.ejercicios)
        ? day.ejercicios.map(convertLegacyExercise)
        : [];

  return {
    id: createId(),
    name: day?.title || day?.name || day?.nombre || `Día ${index + 1}`,
    type,
    recoveryNote:
      day?.recoveryMessage ||
      day?.mensajeRecuperacion ||
      day?.notes ||
      day?.notas ||
      "",
    exercises: legacyExercises.length ? legacyExercises : [createExercise()],
  };
};

const convertLegacyWeek = (week, index = 0) => {
  const daysSource = Array.isArray(week?.days)
    ? week.days
    : Array.isArray(week?.dias)
      ? week.dias
      : [];

  const convertedDays = daysSource.map((day, dayIndex) =>
    convertLegacyDay(day, dayIndex),
  );

  return {
    id: createId(),
    title: week?.title || week?.nombre || week?.titulo || `Semana ${index + 1}`,
    summary: week?.summary || week?.descripcionCorta || week?.description || "",
    notes: Array.isArray(week?.notes)
      ? week.notes.filter(Boolean).join("\n")
      : week?.notes || week?.descripcion || "",
    days: convertedDays.length ? convertedDays : [createDay()],
  };
};

export const buildInitialPlan = (template) => {
  if (!template) {
    return {
      metadata: {
        name: "",
        gender: "",
        objective: "",
        durationWeeks: "1",
        frequency: "",
        level: "",
        description: "",
        notes: "",
        author: "",
        tags: "",
        image: "",
        price: "",
      },
      weeks: [createEmptyWeek(1)],
    };
  }

  // Detectar si el JSON tiene metadata anidado o campos en raíz
  const meta = template?.metadata || {};
  const hasNestedMetadata = Object.keys(meta).length > 0;

  const weeksSource =
    Array.isArray(template?.weeks) && template.weeks.length
      ? template.weeks
      : [
        {
          title: "Semana 1",
          summary: template?.summary || "",
          notes: template?.notes || "",
          days: template?.days || [],
        },
      ];

  const convertedWeeks = weeksSource.map((week, index) =>
    convertLegacyWeek(week, index),
  );

  const tagsString = Array.isArray(template?.tags)
    ? template.tags.join(", ")
    : hasNestedMetadata && meta.tags
      ? meta.tags
      : template?.tags || "";

  return {
    metadata: {
      name: template?.name || meta?.name || "",
      gender: hasNestedMetadata ? meta?.gender || "" : template?.gender || "",
      objective: hasNestedMetadata ? meta?.objective || "" : template?.objective || template?.objetivo || "",
      durationWeeks: hasNestedMetadata
        ? meta?.durationWeeks || String(convertedWeeks.length || 1)
        : template?.duration
          ? String(template.duration)
          : template?.duracion
            ? String(template.duracion)
            : String(convertedWeeks.length || 1),
      frequency: hasNestedMetadata
        ? meta?.frequency || ""
        : template?.frequency
          ? String(template.frequency)
          : template?.frecuencia
            ? String(template.frecuencia).replace(/[^0-9]/g, "") ||
            String(template.frecuencia)
            : "",
      level: hasNestedMetadata ? meta?.level || "" : template?.level || template?.nivel || "",
      description: template?.description || meta?.description || template?.descripcion || template?.summary || "",
      notes: hasNestedMetadata ? meta?.notes || "" : template?.notes || template?.notas || "",
      author: hasNestedMetadata ? meta?.author || "" : template?.author || template?.coach || template?.autor || "",
      tags: tagsString,
      image: hasNestedMetadata ? meta?.image || "" : template?.image || template?.cover || template?.portada || "",
      price:
        hasNestedMetadata
          ? meta?.price != null
            ? String(meta.price)
            : ""
          : template?.price != null
            ? String(template.price)
            : template?.precio != null
              ? String(template.precio)
              : "",
    },
    weeks: convertedWeeks.length ? convertedWeeks : [createEmptyWeek(1)],
  };
};

const buildDraftKey = (templateId) =>
  `plan-editor-draft-${templateId || "new"}`;

const PLAN_VALIDATION_MESSAGES = {
  NAME: "El plan debe tener un nombre.",
};

export const useRoutineEditor = ({
  template,
  templateId,
  existingTemplate,
}) => {
  const basePlan = useMemo(() => buildInitialPlan(template), [template]);
  const [plan, setPlan] = useState(basePlan);
  const [dirty, setDirty] = useState(false);
  const draftKey = useMemo(() => buildDraftKey(templateId), [templateId]);
  const restoredDraftRef = useRef(false);

  useEffect(() => {
    setPlan(basePlan);
    setDirty(false);
    restoredDraftRef.current = false;
  }, [basePlan]);

  useEffect(() => {
    if (restoredDraftRef.current) return;
    try {
      const stored = localStorage.getItem(draftKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.metadata && parsed?.weeks) {
          setPlan(parsed);
          setDirty(true);
        }
      }
    } catch (error) {
      console.error("Error restoring draft", error);
      localStorage.removeItem(draftKey);
    }
    restoredDraftRef.current = true;
  }, [draftKey]);

  useEffect(() => {
    if (!dirty) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(plan));
    } catch (error) {
      console.error("Error saving draft", error);
    }
  }, [plan, dirty, draftKey]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const applyPlanChange = useCallback((mutator) => {
    let hasChanged = false;
    setPlan((prev) => {
      const next = mutator(prev);
      if (!next || next === prev) {
        return prev;
      }
      hasChanged = true;
      return next;
    });
    if (hasChanged) {
      setDirty(true);
    }
    return hasChanged;
  }, []);

  const updateMetadata = useCallback(
    (field, value) => {
      return applyPlanChange((prev) => {
        if (prev.metadata[field] === value) return prev;
        return {
          ...prev,
          metadata: {
            ...prev.metadata,
            [field]: value,
          },
        };
      });
    },
    [applyPlanChange],
  );

  const updateWeek = useCallback(
    (weekId, updater) => {
      return applyPlanChange((prev) => {
        const weeks = prev.weeks.map((week) => {
          if (week.id !== weekId) return week;
          const nextWeek = updater(week);
          return nextWeek === week ? week : nextWeek;
        });
        const hasChanged = weeks.some(
          (week, index) => week !== prev.weeks[index],
        );
        if (!hasChanged) return prev;
        return {
          ...prev,
          weeks,
        };
      });
    },
    [applyPlanChange],
  );

  const updateDay = useCallback(
    (weekId, dayId, updater) => {
      return updateWeek(weekId, (week) => {
        const days = week.days.map((day) => {
          if (day.id !== dayId) return day;
          const nextDay = updater(day);
          return nextDay === day ? day : nextDay;
        });
        const hasChanged = days.some((day, index) => day !== week.days[index]);
        if (!hasChanged) return week;
        return { ...week, days };
      });
    },
    [updateWeek],
  );

  const addWeek = useCallback(() => {
    return applyPlanChange((prev) => {
      const nextWeekNumber = prev.weeks.length + 1;
      const nextWeeks = [...prev.weeks, createEmptyWeek(nextWeekNumber)];
      const metadata = adjustDuration(
        prev.metadata,
        prev.weeks.length,
        nextWeeks.length,
      );
      return { ...prev, weeks: nextWeeks, metadata };
    });
  }, [applyPlanChange]);

  const duplicateWeek = useCallback(
    (weekId) => {
      return applyPlanChange((prev) => {
        const index = prev.weeks.findIndex((week) => week.id === weekId);
        if (index === -1) return prev;
        const duplicated = cloneWeek(prev.weeks[index]);
        duplicated.title = `${duplicated.title || `Semana ${index + 1}`} (copia)`;
        const weeks = [...prev.weeks];
        weeks.splice(index + 1, 0, duplicated);
        const metadata = adjustDuration(
          prev.metadata,
          prev.weeks.length,
          weeks.length,
        );
        return { ...prev, weeks, metadata };
      });
    },
    [applyPlanChange],
  );

  const removeWeek = useCallback(
    (weekId) => {
      const changed = applyPlanChange((prev) => {
        const nextWeeks = prev.weeks.filter((week) => week.id !== weekId);
        if (nextWeeks.length === prev.weeks.length) return prev;
        const metadata = adjustDuration(
          prev.metadata,
          prev.weeks.length,
          nextWeeks.length,
        );
        return { ...prev, weeks: nextWeeks, metadata };
      });
      return { success: changed, error: null };
    },
    [applyPlanChange],
  );

  const addDay = useCallback(
    (weekId) => {
      return updateWeek(weekId, (week) => ({
        ...week,
        days: [...week.days, createDay(`Día ${week.days.length + 1}`)],
      }));
    },
    [updateWeek],
  );

  const duplicateDay = useCallback(
    (weekId, dayId) => {
      return updateWeek(weekId, (week) => {
        const index = week.days.findIndex((day) => day.id === dayId);
        if (index === -1) return week;
        const duplicated = cloneDay(week.days[index]);
        duplicated.name = `${duplicated.name} (copia)`;
        const days = [...week.days];
        days.splice(index + 1, 0, duplicated);
        return { ...week, days };
      });
    },
    [updateWeek],
  );

  const removeDay = useCallback(
    (weekId, dayId) => {
      const changed = updateWeek(weekId, (week) => {
        const days = week.days.filter((day) => day.id !== dayId);
        return days.length === week.days.length ? week : { ...week, days };
      });
      return { success: changed, error: null };
    },
    [updateWeek],
  );

  const reorderDay = useCallback(
    (weekId, fromIndex, toIndex) => {
      return updateWeek(weekId, (week) => {
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= week.days.length ||
          toIndex >= week.days.length
        ) {
          return week;
        }
        const days = [...week.days];
        const [moved] = days.splice(fromIndex, 1);
        days.splice(toIndex, 0, moved);
        return { ...week, days };
      });
    },
    [updateWeek],
  );

  const updateWeekField = useCallback(
    (weekId, field, value) => {
      return updateWeek(weekId, (week) => {
        if (week[field] === value) return week;
        return { ...week, [field]: value };
      });
    },
    [updateWeek],
  );

  const updateDayField = useCallback(
    (weekId, dayId, field, value) => {
      return updateDay(weekId, dayId, (day) => {
        if (day[field] === value) return day;
        return { ...day, [field]: value };
      });
    },
    [updateDay],
  );

  const setDayType = useCallback(
    (weekId, dayId, value) => {
      return updateDay(weekId, dayId, (day) => {
        if (day.type === value) return day;
        const next = {
          ...day,
          type: value,
        };
        if (value === "DESCANSO" && !day.recoveryNote) {
          next.recoveryNote =
            "Recuperación activa, movilidad suave y respiración profunda.";
        }
        return next;
      });
    },
    [updateDay],
  );

  const updateExerciseField = useCallback(
    (weekId, dayId, exerciseId, field, value) => {
      return updateDay(weekId, dayId, (day) => {
        let changed = false;
        const exercises = day.exercises.map((exercise) => {
          if (exercise.id !== exerciseId) return exercise;
          if (exercise[field] === value) return exercise;
          changed = true;
          return { ...exercise, [field]: value };
        });
        if (!changed) return day;
        return { ...day, exercises };
      });
    },
    [updateDay],
  );

  const addExercise = useCallback(
    (weekId, dayId) => {
      return updateDay(weekId, dayId, (day) => ({
        ...day,
        exercises: [...day.exercises, createExercise()],
      }));
    },
    [updateDay],
  );

  const duplicateExercise = useCallback(
    (weekId, dayId, exerciseId) => {
      return updateDay(weekId, dayId, (day) => {
        const index = day.exercises.findIndex(
          (exercise) => exercise.id === exerciseId,
        );
        if (index === -1) return day;
        const duplicated = cloneExercise(day.exercises[index]);
        duplicated.name = `${duplicated.name || "Ejercicio"} (copia)`;
        const exercises = [...day.exercises];
        exercises.splice(index + 1, 0, duplicated);
        return { ...day, exercises };
      });
    },
    [updateDay],
  );

  const removeExercise = useCallback(
    (weekId, dayId, exerciseId) => {
      const changed = updateDay(weekId, dayId, (day) => {
        const exercises = day.exercises.filter(
          (exercise) => exercise.id !== exerciseId,
        );
        return exercises.length === day.exercises.length
          ? day
          : { ...day, exercises };
      });
      return { success: changed, error: null };
    },
    [updateDay],
  );

  const markAsSaved = useCallback(() => {
    setDirty(false);
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  const loadPlan = useCallback((newPlan) => {
    if (!newPlan) {
      throw new Error("Invalid plan structure");
    }
    // Convertir el plan importado usando buildInitialPlan para normalizar campos
    const normalizedPlan = buildInitialPlan(newPlan);
    setPlan(normalizedPlan);
    setDirty(true);
  }, []);

  const validatePlan = useCallback(() => {
    const errors = [];
    if (!plan.metadata.name?.trim()) {
      errors.push(PLAN_VALIDATION_MESSAGES.NAME);
    }

    if (!plan.weeks.length) {
      errors.push(PLAN_VALIDATION_MESSAGES.WEEKS);
    }

    plan.weeks.forEach((week) => {
      if (!week.days.length) {
        errors.push(PLAN_VALIDATION_MESSAGES.DAYS);
        return;
      }
      week.days.forEach((day) => {
        if (day.type === "ENTRENAMIENTO" && !day.exercises.length) {
          errors.push(PLAN_VALIDATION_MESSAGES.EXERCISES);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors: Array.from(new Set(errors)),
    };
  }, [plan]);

  const planForPdf = useMemo(
    () => ({
      name: plan.metadata.name,  // Para PDF Mobile
      title: plan.metadata.name,  // Para PDF Desktop (@react-pdf)
      planName: plan.metadata.name,  // Compatibilidad legacy
      objective: plan.metadata.objective,
      duration: plan.metadata.durationWeeks,
      durationWeeks: plan.metadata.durationWeeks,  // Para PDF Mobile
      frequency: plan.metadata.frequency,  // Valor numérico directo
      gender: plan.metadata.gender,  // Para metadata
      author: plan.metadata.author,
      coach: plan.metadata.author,  // Alias
      notes: plan.metadata.notes,
      description: plan.metadata.description,
      level: plan.metadata.level,
      weeks: plan.weeks.map((week, index) => ({
        weekNumber: index + 1,  // Para PDF Mobile
        number: index + 1,  // Para PDF Desktop
        title: week.title || `Semana ${index + 1}`,
        name: week.title || `Semana ${index + 1}`,  // Alias
        summary: week.summary,
        notes: week.notes,
        days: week.days.map((day) => ({
          name: day.name,
          type: day.type,
          recoveryMessage: day.recoveryNote,
          recoveryNote: day.recoveryNote,  // Alias
          notes: day.recoveryNote,
          exercises: day.exercises.map((exercise) => ({
            name: exercise.name,
            // Campos legacy primero (lo que esperan los PDFs)
            series: exercise.sets,
            descanso: exercise.rest,
            cadencia: exercise.tempo,
            videoUrl: exercise.video,
            // Aliases para compatibilidad
            sets: exercise.sets,
            reps: exercise.reps,
            rest: exercise.rest,
            rir: exercise.rir,
            tempo: exercise.tempo,
            video: exercise.video,
            notes: exercise.note,
            note: exercise.note,
          })),
        })),
      })),
    }),
    [plan],
  );

  const buildTemplatePayload = useCallback(() => {
    const tags = parseTags(plan.metadata.tags);
    const flattenedDays = plan.weeks.flatMap((week) =>
      week.days.map((day) => ({
        title: day.name,
        type: day.type,
        notes: day.recoveryNote,
        bloques:
          day.type === "DESCANSO"
            ? []
            : [
              {
                titulo: "Entrenamiento",
                color: "",
                items: day.exercises.map((exercise) => ({
                  ejercicio: exercise.name,
                  variantes: [
                    {
                      series: exercise.sets,
                      reps: exercise.reps,
                      descanso: exercise.rest,
                      cadencia: exercise.tempo,
                      rir: exercise.rir,
                    },
                  ],
                  videoUrl: exercise.video,
                  notes: exercise.note,
                })),
              },
            ],
      })),
    );

    const now = new Date().toISOString();
    const baseId = existingTemplate?.id ? existingTemplate.id : Date.now();

    return {
      id: baseId,
      name: plan.metadata.name || "Plan sin título",
      gender: plan.metadata.gender || existingTemplate?.gender || "",
      frequency: plan.metadata.frequency ? Number(plan.metadata.frequency) : "",
      objective: plan.metadata.objective || existingTemplate?.objective || "",
      level: plan.metadata.level || existingTemplate?.level || "",
      tags,
      description: plan.metadata.description,
      notes: plan.metadata.notes,
      author: plan.metadata.author,
      durationWeeks: Number(plan.metadata.durationWeeks) || 1, // ✅ Cambiado de "duration" a "durationWeeks"
      image: plan.metadata.image,
      price:
        plan.metadata.price && !Number.isNaN(Number(plan.metadata.price))
          ? Number(plan.metadata.price)
          : existingTemplate?.price || 0,
      createdAt: existingTemplate?.createdAt || now,
      updatedAt: now,
      weeks: plan.weeks.map((week, index) => ({
        weekNumber: index + 1, // ✅ Cambiado de "number" a "weekNumber"
        title: week.title || `Semana ${index + 1}`,
        summary: week.summary || "",
        notes: week.notes || "",
        days: week.days.map((day, dayIndex) => ({
          dayNumber: dayIndex + 1, // ✅ Agregado dayNumber
          name: day.name, // ✅ Cambiado de "title" a "name"
          type: day.type,
          recoveryNote: day.recoveryNote || "", // ✅ Cambiado de "notes" a "recoveryNote"
          exercises: day.type === "DESCANSO"
            ? []
            : day.exercises.map((exercise) => ({
              name: exercise.name,
              sets: Number(exercise.sets) || 0,
              reps: exercise.reps || "",
              rest: exercise.rest || "",
              rir: Number(exercise.rir) || 0,
              tempo: exercise.tempo || "",
              videoUrl: exercise.video || "",
              notes: exercise.note || "",
            })),
        })),
      })),
      days: flattenedDays,
    };
  }, [plan, existingTemplate]);

  return {
    plan,
    metadata: plan.metadata,
    weeks: plan.weeks,
    dirty,
    draftKey,
    updateMetadata,
    addWeek,
    duplicateWeek,
    removeWeek,
    addDay,
    duplicateDay,
    removeDay,
    reorderDay,
    updateWeekField,
    updateDayField,
    setDayType,
    addExercise,
    duplicateExercise,
    removeExercise,
    updateExerciseField,
    markAsSaved,
    loadPlan,
    validatePlan,
    planForPdf,
    buildTemplatePayload,
  };
};

export default useRoutineEditor;
