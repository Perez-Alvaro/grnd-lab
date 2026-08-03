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

// Config de hoja por defecto (rutinas). Se puede overridear por planType para
// reutilizar TODO el motor semana→día→hoja con otra hoja (ej: nutrición → meals).
const WORKOUT_LEAF = { key: "exercises", create: createExercise };

export const createDay = (label = "Día 1", leaf = WORKOUT_LEAF) => ({
  id: createId(),
  name: label,
  type: "ENTRENAMIENTO",
  recoveryNote: "",
  warmupExercises: [],
  [leaf.key]: [leaf.create()],
});

export const createEmptyWeek = (number = 1, leaf = WORKOUT_LEAF) => ({
  id: createId(),
  title: `Semana ${number}`,
  summary: "",
  notes: "",
  days: defaultDayLabels.map((dayLabel) => createDay(dayLabel, leaf)),
});

const cloneDay = (day, leaf = WORKOUT_LEAF) => ({
  ...day,
  id: createId(),
  warmupExercises: (day.warmupExercises || []).map((ex) => ({ ...ex })),
  [leaf.key]: (day[leaf.key] || []).map((item) => ({ ...item, id: createId() })),
});

const cloneWeek = (week, leaf = WORKOUT_LEAF) => ({
  ...week,
  id: createId(),
  days: week.days.map((day) => cloneDay(day, leaf)),
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

const normalizeUrlValue = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return `https://${trimmed}`;
};

const convertLegacyExercise = (exercise) => {
  const variant = Array.isArray(exercise?.variantes)
    ? exercise.variantes[0] || {}
    : {};

  const noteValue = exercise?.notes || exercise?.note || exercise?.notas || "";
  const rawVideoUrl = exercise?.videoUrl || exercise?.youtubeLink || exercise?.video || "";

  return {
    id: createId(),
    name: exercise?.ejercicio || exercise?.name || "",
    sets: variant.series || exercise?.series || exercise?.sets || "",
    reps: variant.reps || exercise?.reps || "",
    rest: variant.descanso || exercise?.descanso || exercise?.rest || "",
    rir: variant.rir || exercise?.rir || "",
    tempo: variant.cadencia || exercise?.cadencia || exercise?.tempo || "",
    video: normalizeUrlValue(rawVideoUrl),
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

  // Extraer warmup exercises del formato IA (warmup) o legacy (entradaEnCalor)
  const warmupSource = day?.warmup || day?.warmupExercises || day?.entradaEnCalor || [];
  const warmupExercises = Array.isArray(warmupSource)
    ? warmupSource.map(ex => ({
      name: ex.name || ex.nombre || '',
      duration: ex.duration || ex.duracion || '',
      notes: ex.notes || ex.notas || '',
    }))
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
    warmupExercises,
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

export const buildInitialPlan = (template, leaf = WORKOUT_LEAF) => {
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
      weeks: [createEmptyWeek(1, leaf)],
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
    weeks: convertedWeeks.length ? convertedWeeks : [createEmptyWeek(1, leaf)],
  };
};

// La clave incluye el tipo de hoja (exercises = rutina, meals = nutrición) para
// que el borrador de rutina y el de nutrición NO colisionen: ambos usan
// templateId=null al crear, así que sin esto compartían "plan-editor-draft-new"
// y al volver de la IA un editor restauraba el borrador del otro.
/**
 * Fusiona la metadata previa (lo que cargó el coach en la encuesta) con la que
 * trae un plan importado de la IA. Regla: se parte de la previa y se superponen
 * SOLO los valores no vacíos del import; el título y el autor que escribió el
 * coach ganan siempre si existen (la IA no repite el nombre interno del plan,
 * así que sin esto el import lo pisaba con "" y se perdía el título del PDF).
 */
export const mergeImportedMetadata = (prevMetadata = {}, importedMetadata = {}) => {
  const merged = { ...prevMetadata };
  for (const [k, v] of Object.entries(importedMetadata)) {
    const isEmpty =
      v == null ||
      v === "" ||
      (Array.isArray(v) && v.length === 0) ||
      (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);
    if (!isEmpty) merged[k] = v;
  }
  merged.name = prevMetadata.name || importedMetadata.name || "";
  merged.author = prevMetadata.author || importedMetadata.author || "";
  return merged;
};

const buildDraftKey = (templateId, leafKey = "exercises") =>
  `plan-editor-draft-${leafKey}-${templateId || "new"}`;

const PLAN_VALIDATION_MESSAGES = {
  NAME: "El plan debe tener un nombre.",
};

export const useRoutineEditor = ({
  template,
  templateId,
  existingTemplate,
  // Config de hoja (leaf). Por defecto = rutina (exercises). Para nutrición se
  // pasa leafKey:'meals' + createLeaf:createMealLeaf + normalizeImport propio.
  leafKey = "exercises",
  createLeaf = createExercise,
  normalizeImport = null,
} = {}) => {
  const leaf = useMemo(() => ({ key: leafKey, create: createLeaf }), [leafKey, createLeaf]);
  const basePlan = useMemo(() => buildInitialPlan(template, leaf), [template, leaf]);
  const [plan, setPlan] = useState(basePlan);
  const [dirty, setDirty] = useState(false);
  const draftKey = useMemo(() => buildDraftKey(templateId, leafKey), [templateId, leafKey]);
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
          // Sanitizar el draft: fusionar con el estado inicial para garantizar
          // que todos los campos de metadata existan con sus tipos correctos.
          // Esto evita crashes cuando drafts guardados con versiones anteriores
          // tienen campos nulos, indefinidos o con tipos incorrectos.
          const sanitized = {
            ...parsed,
            metadata: {
              name: "", gender: "", objective: "", durationWeeks: "1",
              frequency: "", level: "", description: "", notes: "",
              author: "", tags: "", image: "", price: "",
              ...parsed.metadata,
              // Forzar strings en campos que deben ser strings
              tags: parsed.metadata?.tags ?? "",
              notes: parsed.metadata?.notes ?? "",
              description: parsed.metadata?.description ?? "",
              author: parsed.metadata?.author ?? "",
              image: parsed.metadata?.image ?? "",
              price: parsed.metadata?.price != null ? String(parsed.metadata.price) : "",
            },
          };
          setPlan(sanitized);
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
      const nextWeeks = [...prev.weeks, createEmptyWeek(nextWeekNumber, leaf)];
      const metadata = adjustDuration(
        prev.metadata,
        prev.weeks.length,
        nextWeeks.length,
      );
      return { ...prev, weeks: nextWeeks, metadata };
    });
  }, [applyPlanChange, leaf]);

  const duplicateWeek = useCallback(
    (weekId) => {
      return applyPlanChange((prev) => {
        const index = prev.weeks.findIndex((week) => week.id === weekId);
        if (index === -1) return prev;
        const duplicated = cloneWeek(prev.weeks[index], leaf);
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
    [applyPlanChange, leaf],
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
        days: [...week.days, createDay(`Día ${week.days.length + 1}`, leaf)],
      }));
    },
    [updateWeek, leaf],
  );

  const duplicateDay = useCallback(
    (weekId, dayId) => {
      return updateWeek(weekId, (week) => {
        const index = week.days.findIndex((day) => day.id === dayId);
        if (index === -1) return week;
        const duplicated = cloneDay(week.days[index], leaf);
        duplicated.name = `${duplicated.name} (copia)`;
        const days = [...week.days];
        days.splice(index + 1, 0, duplicated);
        return { ...week, days };
      });
    },
    [updateWeek, leaf],
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

  // Reordenamiento por lista de ids (para drag-and-drop): recibe el orden final
  // y reacomoda el array. Devuelve el estado previo si la lista no coincide.
  const setWeeksOrder = useCallback(
    (orderedIds) => {
      return applyPlanChange((prev) => {
        const byId = new Map(prev.weeks.map((w) => [w.id, w]));
        const next = orderedIds.map((id) => byId.get(id)).filter(Boolean);
        if (next.length !== prev.weeks.length) return prev;
        const unchanged = next.every((w, idx) => w === prev.weeks[idx]);
        if (unchanged) return prev;
        return { ...prev, weeks: next };
      });
    },
    [applyPlanChange],
  );

  const setDaysOrder = useCallback(
    (weekId, orderedIds) => {
      return updateWeek(weekId, (week) => {
        const byId = new Map(week.days.map((d) => [d.id, d]));
        const next = orderedIds.map((id) => byId.get(id)).filter(Boolean);
        if (next.length !== week.days.length) return week;
        const unchanged = next.every((d, idx) => d === week.days[idx]);
        if (unchanged) return week;
        return { ...week, days: next };
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

  // ── CRUD de la hoja (leaf) ────────────────────────────────
  // Nombres conservados (updateExercise*/addExercise…) para no romper el
  // PlanContext existente; internamente operan sobre day[leaf.key], así que
  // sirven igual para 'exercises' (rutina) y 'meals' (nutrición).
  const updateExerciseField = useCallback(
    (weekId, dayId, exerciseId, field, value) => {
      return updateDay(weekId, dayId, (day) => {
        let changed = false;
        const items = (day[leaf.key] || []).map((exercise) => {
          if (exercise.id !== exerciseId) return exercise;
          if (exercise[field] === value) return exercise;
          changed = true;
          return { ...exercise, [field]: value };
        });
        if (!changed) return day;
        return { ...day, [leaf.key]: items };
      });
    },
    [updateDay, leaf],
  );

  const addExercise = useCallback(
    (weekId, dayId) => {
      return updateDay(weekId, dayId, (day) => ({
        ...day,
        [leaf.key]: [...(day[leaf.key] || []), leaf.create()],
      }));
    },
    [updateDay, leaf],
  );

  const duplicateExercise = useCallback(
    (weekId, dayId, exerciseId) => {
      return updateDay(weekId, dayId, (day) => {
        const items = day[leaf.key] || [];
        const index = items.findIndex((exercise) => exercise.id === exerciseId);
        if (index === -1) return day;
        const duplicated = { ...items[index], id: createId() };
        duplicated.name = `${duplicated.name || "Ítem"} (copia)`;
        const next = [...items];
        next.splice(index + 1, 0, duplicated);
        return { ...day, [leaf.key]: next };
      });
    },
    [updateDay, leaf],
  );

  const removeExercise = useCallback(
    (weekId, dayId, exerciseId) => {
      const changed = updateDay(weekId, dayId, (day) => {
        const items = day[leaf.key] || [];
        const next = items.filter((exercise) => exercise.id !== exerciseId);
        return next.length === items.length ? day : { ...day, [leaf.key]: next };
      });
      return { success: changed, error: null };
    },
    [updateDay, leaf],
  );

  const markAsSaved = useCallback(() => {
    setDirty(false);
    localStorage.removeItem(draftKey);
  }, [draftKey]);

  const loadPlan = useCallback((newPlan) => {
    if (!newPlan) {
      throw new Error("Invalid plan structure");
    }
    // Normaliza el plan importado. Para rutina usa buildInitialPlan (formato IA
    // legacy); para nutrición se inyecta normalizeImport (transformer propio).
    const normalizedPlan = normalizeImport
      ? normalizeImport(newPlan)
      : buildInitialPlan(newPlan, leaf);

    // Importar reemplaza las semanas (eso viene de la IA), pero NO debe borrar
    // la metadata que cargó el coach en la encuesta (sobre todo el título).
    setPlan((prev) => ({
      ...normalizedPlan,
      metadata: mergeImportedMetadata(prev.metadata, normalizedPlan.metadata || {}),
    }));
    setDirty(true);
  }, [normalizeImport, leaf]);

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
        if (day.type === "ENTRENAMIENTO" && !(day[leaf.key] || []).length) {
          errors.push(PLAN_VALIDATION_MESSAGES.EXERCISES);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors: Array.from(new Set(errors)),
    };
  }, [plan, leaf]);

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
          exercises: (day.exercises || []).map((exercise) => ({
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
                items: (day.exercises || []).map((exercise) => ({
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
            : (day.exercises || []).map((exercise) => ({
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
    setWeeksOrder,
    setDaysOrder,
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
