import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  memo
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  FileDown,
  Save,
  ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';
import EditorActionBar from '../components/editor/EditorActionBar.jsx';
import migrateTemplate from '../utils/migrateTemplate.ts';
import usePDFExport from '../pdf/hooks/usePDFExport.js';
import { toast } from '../utils/toast.js';

const createId = () => Math.random().toString(36).slice(2, 10);

const defaultDayLabels = ['Lunes', 'Miércoles', 'Viernes'];

const createExercise = () => ({
  id: createId(),
  name: '',
  sets: '',
  reps: '',
  rest: '',
  rir: '',
  tempo: '',
  video: '',
  note: ''
});

const createDay = (label = 'Día 1') => ({
  id: createId(),
  name: label,
  type: 'ENTRENAMIENTO',
  recoveryNote: '',
  exercises: [createExercise()]
});

const createEmptyWeek = (number = 1) => ({
  id: createId(),
  title: `Semana ${number}`,
  summary: '',
  notes: '',
  days: defaultDayLabels.map(label => createDay(label))
});

const cloneExercise = exercise => ({
  ...exercise,
  id: createId()
});

const cloneDay = day => ({
  ...day,
  id: createId(),
  exercises: day.exercises.map(cloneExercise)
});

const cloneWeek = week => ({
  ...week,
  id: createId(),
  days: week.days.map(cloneDay)
});

const parseTags = value =>
  value
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);

const adjustDuration = (metadata, previousWeekCount, nextWeekCount) => {
  const currentDuration = parseInt(metadata.durationWeeks, 10);
  if (!metadata.durationWeeks || Number.isNaN(currentDuration) || currentDuration === previousWeekCount) {
    return { ...metadata, durationWeeks: String(nextWeekCount) };
  }
  return metadata;
};

const convertLegacyExercise = exercise => {
  const variant = Array.isArray(exercise?.variantes) ? exercise.variantes[0] || {} : {};
  return {
    id: createId(),
    name: exercise?.ejercicio || exercise?.name || '',
    sets: variant.series || exercise?.series || exercise?.sets || '',
    reps: variant.reps || exercise?.reps || '',
    rest: variant.descanso || exercise?.descanso || exercise?.rest || '',
    rir: variant.rir || exercise?.rir || '',
    tempo: variant.cadencia || exercise?.cadencia || exercise?.tempo || '',
    video: exercise?.videoUrl || exercise?.youtubeLink || exercise?.video || '',
    note: exercise?.notes || exercise?.note || exercise?.notas || ''
  };
};

const convertLegacyDay = (day, index = 0) => {
  const type = (day?.type || day?.estado || day?.tipo || 'ENTRENAMIENTO').toUpperCase();
  const bloques = Array.isArray(day?.bloques) ? day.bloques : [];
  const legacyExercises = bloques.length
    ? bloques.flatMap(block => (block?.items || []).map(convertLegacyExercise))
    : Array.isArray(day?.exercises)
      ? day.exercises.map(convertLegacyExercise)
      : [];

  return {
    id: createId(),
    name: day?.title || day?.name || `Día ${index + 1}`,
    type,
    recoveryNote: day?.recoveryMessage || day?.mensajeRecuperacion || day?.notes || day?.notas || '',
    exercises: legacyExercises.length ? legacyExercises : [createExercise()]
  };
};

const convertLegacyWeek = (week, index = 0) => {
  const daysSource = Array.isArray(week?.days)
    ? week.days
    : Array.isArray(week?.dias)
      ? week.dias
      : [];

  const convertedDays = daysSource.map((day, dayIndex) => convertLegacyDay(day, dayIndex));

  return {
    id: createId(),
    title: week?.title || week?.nombre || week?.titulo || `Semana ${index + 1}`,
    summary: week?.summary || week?.descripcionCorta || week?.description || '',
    notes: Array.isArray(week?.notes)
      ? week.notes.filter(Boolean).join('\n')
      : week?.notes || week?.descripcion || '',
    days: convertedDays.length ? convertedDays : [createDay()]
  };
};

const buildInitialPlan = template => {
  if (!template) {
    return {
      metadata: {
        name: '',
        gender: '',
        objective: '',
        durationWeeks: '1',
        frequency: '',
        notes: '',
        author: '',
        tags: ''
      },
      weeks: [createEmptyWeek(1)]
    };
  }

  const weeksSource = Array.isArray(template?.weeks) && template.weeks.length
    ? template.weeks
    : [{
      title: 'Semana 1',
      summary: template?.summary || '',
      notes: template?.notes || '',
      days: template?.days || []
    }];

  const convertedWeeks = weeksSource.map((week, index) => convertLegacyWeek(week, index));

  const tagsString = Array.isArray(template?.tags) ? template.tags.join(', ') : template?.tags || '';

  return {
    metadata: {
      name: template?.name || '',
      gender: template?.gender || '',
      objective: template?.objective || '',
      durationWeeks: template?.duration ? String(template.duration) : String(convertedWeeks.length || 1),
      frequency: template?.frequency ? String(template.frequency) : '',
      notes: template?.notes || '',
      author: template?.author || template?.coach || '',
      tags: tagsString
    },
    weeks: convertedWeeks.length ? convertedWeeks : [createEmptyWeek(1)]
  };
};

const PlanPreview = memo(function PlanPreview({ plan }) {
  const tags = useMemo(
    () =>
      plan.metadata.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    [plan.metadata.tags]
  );

  return (
    <div className="bg-[#202020] border border-[#787878]/20 rounded-2xl p-6 space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-[#CBFF00]">
          {plan.metadata.name || 'Plan sin título'}
        </h2>
        <div className="flex flex-wrap justify-center gap-2 text-xs uppercase tracking-wider text-[#787878]">
          {plan.metadata.objective && (
            <span className="bg-[#787878]/20 border border-[#787878]/20 rounded-full px-3 py-1 capitalize">
              {plan.metadata.objective}
            </span>
          )}
          {plan.metadata.frequency && (
            <span className="bg-[#787878]/20 border border-[#787878]/20 rounded-full px-3 py-1">
              {plan.metadata.frequency}x semana
            </span>
          )}
          {plan.metadata.durationWeeks && (
            <span className="bg-[#787878]/20 border border-[#787878]/20 rounded-full px-3 py-1">
              {plan.metadata.durationWeeks} semanas
            </span>
          )}
          {plan.metadata.author && (
            <span className="bg-[#787878]/20 border border-[#787878]/20 rounded-full px-3 py-1 capitalize">
              {plan.metadata.author}
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 text-[11px] text-[#787878]">
            {tags.map(tag => (
              <span
                key={tag}
                className="bg-[#787878]/10 border border-[#787878]/20 rounded-full px-2 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {plan.metadata.notes && (
        <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-xl p-4 text-left">
          <h3 className="text-sm font-semibold text-[#CBFF00] mb-2">Notas generales</h3>
          <p className="text-sm text-[#C9C9C9] whitespace-pre-line">{plan.metadata.notes}</p>
        </div>
      )}

      <div className="space-y-5">
        {plan.weeks.map((week, index) => (
          <div key={week.id} className="border border-[#787878]/20 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-[#CBFF00]">
                {week.title || `Semana ${index + 1}`}
              </h3>
              {week.summary && (
                <p className="text-sm text-[#C9C9C9] mt-1">{week.summary}</p>
              )}
              {week.notes && (
                <div className="mt-3 bg-[#1A1A1A] border border-[#787878]/20 rounded-lg p-3">
                  <h4 className="text-xs uppercase tracking-wide text-[#787878] mb-1">
                    Notas de la semana
                  </h4>
                  <p className="text-sm text-[#C9C9C9] whitespace-pre-line">{week.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {week.days.map(day => (
                <div
                  key={day.id}
                  className="bg-[#1A1A1A] border border-[#787878]/20 rounded-lg p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        {day.name}
                      </h4>
                      {day.type === 'DESCANSO' && day.recoveryNote && (
                        <p className="text-sm text-[#787878]">{day.recoveryNote}</p>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      day.type === 'DESCANSO'
                        ? 'bg-[#787878]/20 text-[#A1A1A1]'
                        : 'bg-[#CBFF00]/20 text-[#CBFF00]'
                    }`}>
                      {day.type}
                    </span>
                  </div>

                  {day.type === 'ENTRENAMIENTO' && (
                    <div className="space-y-3">
                      <div className="hidden lg:grid grid-cols-12 gap-3 text-[11px] uppercase tracking-wide text-[#787878]">
                        <span className="col-span-4">Ejercicio</span>
                        <span>Series</span>
                        <span>Reps</span>
                        <span>Desc</span>
                        <span>RIR</span>
                        <span>Cadencia</span>
                        <span className="col-span-3">Video</span>
                      </div>
                      {day.exercises.map(exercise => (
                        <div key={exercise.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                          <div className="lg:col-span-4">
                            <p className="text-sm font-medium text-white">{exercise.name || '—'}</p>
                          </div>
                          <div className="flex items-center gap-2 lg:col-span-1 text-sm text-[#C9C9C9]">
                            <span className="lg:hidden text-xs uppercase text-[#787878]">Series:</span>
                            <span>{exercise.sets || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 lg:col-span-1 text-sm text-[#C9C9C9]">
                            <span className="lg:hidden text-xs uppercase text-[#787878]">Reps:</span>
                            <span>{exercise.reps || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 lg:col-span-1 text-sm text-[#C9C9C9]">
                            <span className="lg:hidden text-xs uppercase text-[#787878]">Desc:</span>
                            <span>{exercise.rest || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 lg:col-span-1 text-sm text-[#C9C9C9]">
                            <span className="lg:hidden text-xs uppercase text-[#787878]">RIR:</span>
                            <span>{exercise.rir || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 lg:col-span-1 text-sm text-[#C9C9C9]">
                            <span className="lg:hidden text-xs uppercase text-[#787878]">Cadencia:</span>
                            <span>{exercise.tempo || '—'}</span>
                          </div>
                          <div className="lg:col-span-3">
                            {exercise.video ? (
                              <a
                                href={exercise.video}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-[#CBFF00] hover:underline break-words"
                              >
                                {exercise.video}
                              </a>
                            ) : (
                              <span className="text-sm text-[#787878]">Sin video</span>
                            )}
                          </div>
                          {exercise.note && (
                            <div className="lg:col-span-12">
                              <p className="text-xs uppercase text-[#787878]">Notas</p>
                              <p className="text-sm text-[#C9C9C9] whitespace-pre-line">{exercise.note}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default function TemplatesEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const exportPlan = usePDFExport();

  const existing = id ? state.templates.find(t => String(t.id) === String(id)) : null;

  const migratedTemplate = useMemo(() => migrateTemplate(existing), [existing]);
  const basePlan = useMemo(() => buildInitialPlan(migratedTemplate), [migratedTemplate]);

  const draftKey = useMemo(() => `plan-editor-draft-${id || 'new'}`, [id]);

  const [plan, setPlan] = useState(basePlan);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setPlan(basePlan);
    setDirty(false);
  }, [basePlan]);

  const restoredDraftRef = useRef(false);

  useEffect(() => {
    restoredDraftRef.current = false;
  }, [draftKey]);

  useEffect(() => {
    if (restoredDraftRef.current) return;
    try {
      const stored = localStorage.getItem(draftKey);
      if (stored) {
        if (window.confirm('¿Desea recuperar el borrador guardado automáticamente?')) {
          const parsed = JSON.parse(stored);
          if (parsed?.metadata && parsed?.weeks) {
            setPlan(parsed);
            setDirty(true);
          }
        } else {
          localStorage.removeItem(draftKey);
        }
      }
    } catch (error) {
      console.error('Error restoring draft', error);
      localStorage.removeItem(draftKey);
    }
    restoredDraftRef.current = true;
  }, [draftKey]);

  useEffect(() => {
    if (!dirty) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(plan));
    } catch (error) {
      console.error('Error saving draft', error);
    }
  }, [plan, dirty, draftKey]);

  useEffect(() => {
    const handleBeforeUnload = event => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  const applyPlanChange = useCallback(mutator => {
    let hasChanged = false;
    setPlan(prev => {
      const next = mutator(prev);
      if (next === prev) {
        return prev;
      }
      hasChanged = true;
      return next;
    });
    if (hasChanged) {
      setDirty(true);
    }
  }, []);

  const handleMetadataChange = useCallback(
    (field, value) => {
      applyPlanChange(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [field]: value
        }
      }));
    },
    [applyPlanChange]
  );

  const updateWeek = useCallback(
    (weekId, mutator) => {
      applyPlanChange(prev => {
        let changed = false;
        const weeks = prev.weeks.map(week => {
          if (week.id !== weekId) return week;
          const updated = mutator(week);
          if (updated !== week) changed = true;
          return updated;
        });
        if (!changed) return prev;
        return { ...prev, weeks };
      });
    },
    [applyPlanChange]
  );

  const updateDay = useCallback(
    (weekId, dayId, mutator) => {
      updateWeek(weekId, week => {
        let changed = false;
        const days = week.days.map(day => {
          if (day.id !== dayId) return day;
          const updated = mutator(day);
          if (updated !== day) changed = true;
          return updated;
        });
        if (!changed) return week;
        return { ...week, days };
      });
    },
    [updateWeek]
  );

  const addWeek = useCallback(() => {
    applyPlanChange(prev => {
      const nextWeeks = [...prev.weeks, createEmptyWeek(prev.weeks.length + 1)];
      const metadata = adjustDuration(prev.metadata, prev.weeks.length, nextWeeks.length);
      return { ...prev, weeks: nextWeeks, metadata };
    });
  }, [applyPlanChange]);

  const duplicateWeek = useCallback(
    weekId => {
      applyPlanChange(prev => {
        const index = prev.weeks.findIndex(week => week.id === weekId);
        if (index === -1) return prev;
        const duplicated = cloneWeek(prev.weeks[index]);
        duplicated.title = `${duplicated.title || `Semana ${index + 1}`} (copia)`;
        const nextWeeks = [...prev.weeks];
        nextWeeks.splice(index + 1, 0, duplicated);
        const metadata = adjustDuration(prev.metadata, prev.weeks.length, nextWeeks.length);
        return { ...prev, weeks: nextWeeks, metadata };
      });
    },
    [applyPlanChange]
  );

  const removeWeek = useCallback(
    weekId => {
      applyPlanChange(prev => {
        if (prev.weeks.length === 1) {
          toast.error('El plan debe tener al menos una semana.');
          return prev;
        }
        const nextWeeks = prev.weeks.filter(week => week.id !== weekId);
        if (nextWeeks.length === prev.weeks.length) return prev;
        const metadata = adjustDuration(prev.metadata, prev.weeks.length, nextWeeks.length);
        return { ...prev, weeks: nextWeeks, metadata };
      });
    },
    [applyPlanChange]
  );

  const addDay = useCallback(
    weekId => {
      updateWeek(weekId, week => ({
        ...week,
        days: [...week.days, createDay(`Día ${week.days.length + 1}`)]
      }));
    },
    [updateWeek]
  );

  const duplicateDay = useCallback(
    (weekId, dayId) => {
      updateWeek(weekId, week => {
        const index = week.days.findIndex(day => day.id === dayId);
        if (index === -1) return week;
        const duplicated = cloneDay(week.days[index]);
        duplicated.name = `${duplicated.name} (copia)`;
        const days = [...week.days];
        days.splice(index + 1, 0, duplicated);
        return { ...week, days };
      });
    },
    [updateWeek]
  );

  const removeDay = useCallback(
    (weekId, dayId) => {
      updateWeek(weekId, week => {
        if (week.days.length === 1) {
          toast.error('Cada semana debe tener al menos un día.');
          return week;
        }
        const days = week.days.filter(day => day.id !== dayId);
        return days.length === week.days.length ? week : { ...week, days };
      });
    },
    [updateWeek]
  );

  const handleWeekFieldChange = useCallback(
    (weekId, field, value) => {
      updateWeek(weekId, week => {
        if (week[field] === value) return week;
        return { ...week, [field]: value };
      });
    },
    [updateWeek]
  );

  const handleDayFieldChange = useCallback(
    (weekId, dayId, field, value) => {
      updateDay(weekId, dayId, day => {
        if (day[field] === value) return day;
        return { ...day, [field]: value };
      });
    },
    [updateDay]
  );

  const handleDayTypeChange = useCallback(
    (weekId, dayId, value) => {
      updateDay(weekId, dayId, day => {
        if (day.type === value) return day;
        const next = {
          ...day,
          type: value
        };
        if (value === 'DESCANSO' && !day.recoveryNote) {
          next.recoveryNote = 'Recuperación activa, movilidad suave y respiración profunda.';
        }
        return next;
      });
    },
    [updateDay]
  );

  const updateExerciseField = useCallback(
    (weekId, dayId, exerciseId, field, value) => {
      updateDay(weekId, dayId, day => {
        let changed = false;
        const exercises = day.exercises.map(exercise => {
          if (exercise.id !== exerciseId) return exercise;
          if (exercise[field] === value) return exercise;
          changed = true;
          return { ...exercise, [field]: value };
        });
        if (!changed) return day;
        return { ...day, exercises };
      });
    },
    [updateDay]
  );

  const addExercise = useCallback(
    (weekId, dayId) => {
      updateDay(weekId, dayId, day => ({
        ...day,
        exercises: [...day.exercises, createExercise()]
      }));
    },
    [updateDay]
  );

  const duplicateExercise = useCallback(
    (weekId, dayId, exerciseId) => {
      updateDay(weekId, dayId, day => {
        const index = day.exercises.findIndex(exercise => exercise.id === exerciseId);
        if (index === -1) return day;
        const duplicated = cloneExercise(day.exercises[index]);
        duplicated.name = `${duplicated.name || 'Ejercicio'} (copia)`;
        const exercises = [...day.exercises];
        exercises.splice(index + 1, 0, duplicated);
        return { ...day, exercises };
      });
    },
    [updateDay]
  );

  const removeExercise = useCallback(
    (weekId, dayId, exerciseId) => {
      updateDay(weekId, dayId, day => {
        if (day.exercises.length === 1) {
          toast.error('Agrega otro ejercicio antes de eliminar este.');
          return day;
        }
        const exercises = day.exercises.filter(exercise => exercise.id !== exerciseId);
        return exercises.length === day.exercises.length ? day : { ...day, exercises };
      });
    },
    [updateDay]
  );

  const weekRefs = useRef({});
  const registerWeekRef = useCallback(weekId => node => {
    if (node) {
      weekRefs.current[weekId] = node;
    } else {
      delete weekRefs.current[weekId];
    }
  }, []);

  const scrollToWeek = useCallback(weekId => {
    const node = weekRefs.current[weekId];
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const indexRef = useRef(null);
  const scrollToIndex = useCallback(() => {
    if (indexRef.current) {
      indexRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const planForPdf = useMemo(() => ({
    planName: plan.metadata.name,
    objective: plan.metadata.objective,
    duration: plan.metadata.durationWeeks,
    frequency: plan.metadata.frequency ? `${plan.metadata.frequency} días/semana` : '',
    author: plan.metadata.author,
    notes: plan.metadata.notes,
    weeks: plan.weeks.map((week, index) => ({
      title: week.title || `Semana ${index + 1}`,
      summary: week.summary,
      notes: week.notes,
      days: week.days.map(day => ({
        name: day.name,
        type: day.type,
        recoveryMessage: day.recoveryNote,
        notes: day.recoveryNote,
        exercises: day.exercises.map(exercise => ({
          name: exercise.name,
          series: exercise.sets,
          reps: exercise.reps,
          descanso: exercise.rest,
          rir: exercise.rir,
          cadencia: exercise.tempo,
          videoUrl: exercise.video,
          notes: exercise.note
        }))
      }))
    }))
  }), [plan]);

  const buildTemplatePayload = useCallback(() => {
    const tags = parseTags(plan.metadata.tags);
    const flattenedDays = plan.weeks.flatMap(week =>
      week.days.map(day => ({
        title: day.name,
        type: day.type,
        notes: day.recoveryNote,
        bloques:
          day.type === 'DESCANSO'
            ? []
            : [
                {
                  titulo: 'Entrenamiento',
                  color: '',
                  items: day.exercises.map(exercise => ({
                    ejercicio: exercise.name,
                    variantes: [
                      {
                        series: exercise.sets,
                        reps: exercise.reps,
                        descanso: exercise.rest,
                        cadencia: exercise.tempo,
                        rir: exercise.rir
                      }
                    ],
                    videoUrl: exercise.video,
                    notes: exercise.note
                  }))
                }
              ]
      }))
    );

    const now = new Date().toISOString();
    const baseId = existing?.id ? existing.id : Date.now();

    return {
      id: baseId,
      name: plan.metadata.name || 'Plan sin título',
      gender: plan.metadata.gender || existing?.gender || '',
      frequency: plan.metadata.frequency ? Number(plan.metadata.frequency) : '',
      objective: plan.metadata.objective || existing?.objective || '',
      tags,
      notes: plan.metadata.notes,
      author: plan.metadata.author,
      duration: plan.metadata.durationWeeks,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      weeks: plan.weeks.map((week, index) => ({
        id: week.id,
        title: week.title || `Semana ${index + 1}`,
        summary: week.summary,
        notes: week.notes,
        days: week.days.map(day => ({
          id: day.id,
          name: day.name,
          type: day.type,
          recoveryMessage: day.recoveryNote,
          exercises: day.exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.name,
            series: exercise.sets,
            reps: exercise.reps,
            descanso: exercise.rest,
            rir: exercise.rir,
            cadencia: exercise.tempo,
            videoUrl: exercise.video,
            notes: exercise.note
          }))
        }))
      })),
      days: flattenedDays
    };
  }, [existing, plan]);

  const handleSaveTemplate = useCallback(() => {
    if (!plan.metadata.name) {
      toast.error('Asigna un nombre al plan antes de guardar.');
      return;
    }
    if (!plan.metadata.objective) {
      toast.error('Seleccioná un objetivo para el plan.');
      return;
    }

    const payload = buildTemplatePayload();

    if (existing) {
      dispatch({ type: 'UPDATE_TEMPLATE', payload });
      toast.success('Plantilla actualizada correctamente.');
    } else {
      dispatch({ type: 'ADD_TEMPLATE', payload });
      toast.success('Plantilla creada correctamente.');
      if (!id || id === 'nueva') {
        navigate(`/admin/plantillas/${payload.id}/editar`, { replace: true });
      }
    }
    setDirty(false);
    localStorage.removeItem(draftKey);
  }, [buildTemplatePayload, dispatch, existing, id, navigate, plan.metadata.name, plan.metadata.objective, draftKey]);

  const handleExportPdf = useCallback(() => {
    exportPlan(planForPdf);
  }, [exportPlan, planForPdf]);

  const handleBack = useCallback(() => {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Desea salir igualmente?')) {
      return;
    }
    navigate('/admin');
  }, [dirty, navigate]);

  useEffect(() => {
    const handleKeyDown = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleSaveTemplate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveTemplate]);

  const isEditing = Boolean(existing);
  const previewPlan = useMemo(() => ({ metadata: plan.metadata, weeks: plan.weeks }), [plan.metadata, plan.weeks]);

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-[#787878]/30 bg-[#1A1A1A] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D2D2D] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
            <h1 className="text-2xl font-bold">Editor de Planes</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#CBFF00] px-4 py-2 font-semibold text-[#1A1A1A] hover:bg-[#DBFE52] transition-colors"
            >
              <Save className="h-4 w-4" />
              {isEditing ? 'Actualizar plantilla' : 'Guardar plantilla'}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-2 rounded-xl border border-[#CBFF00]/40 bg-[#1A1A1A] px-4 py-2 font-semibold text-[#CBFF00] hover:border-[#CBFF00] hover:text-black hover:bg-[#CBFF00] transition-colors"
            >
              <FileDown className="h-4 w-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <section className="bg-[#202020] border border-[#787878]/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-[#CBFF00]" />
                <h2 className="text-lg font-semibold">Información del plan</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Nombre del plan
                  </label>
                  <input
                    type="text"
                    value={plan.metadata.name}
                    onChange={event => handleMetadataChange('name', event.target.value)}
                    placeholder="ej. Hipertrofia Intermedia 4 semanas"
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Objetivo
                  </label>
                  <select
                    value={plan.metadata.objective}
                    onChange={event => handleMetadataChange('objective', event.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  >
                    <option value="">Seleccioná un objetivo</option>
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="fuerza">Fuerza</option>
                    <option value="resistencia">Resistencia</option>
                    <option value="pérdida de grasa">Pérdida de grasa</option>
                    <option value="salud general">Salud general</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Duración (semanas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plan.metadata.durationWeeks}
                    onChange={event => handleMetadataChange('durationWeeks', event.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Frecuencia semanal
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={plan.metadata.frequency}
                    onChange={event => handleMetadataChange('frequency', event.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Género objetivo
                  </label>
                  <select
                    value={plan.metadata.gender}
                    onChange={event => handleMetadataChange('gender', event.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  >
                    <option value="">Todos</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Autor / Coach
                  </label>
                  <input
                    type="text"
                    value={plan.metadata.author}
                    onChange={event => handleMetadataChange('author', event.target.value)}
                    placeholder="Nombre del entrenador"
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={plan.metadata.tags}
                    onChange={event => handleMetadataChange('tags', event.target.value)}
                    placeholder="ej. torso/pierna, avanzado, volumen"
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#787878] mb-2">
                    Notas generales del plan
                  </label>
                  <textarea
                    rows={4}
                    value={plan.metadata.notes}
                    onChange={event => handleMetadataChange('notes', event.target.value)}
                    placeholder="Introduce pautas generales, recomendaciones de progresión, recordatorios de recuperación..."
                    className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </section>

            <section
              ref={indexRef}
              id="indice-semanas"
              className="bg-[#202020] border border-[#787878]/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Índice del plan</h2>
                <span className="text-sm text-[#787878]">{plan.weeks.length} semanas</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {plan.weeks.map((week, index) => (
                  <button
                    key={week.id}
                    type="button"
                    onClick={() => scrollToWeek(week.id)}
                    className="group rounded-2xl border border-[#787878]/30 bg-[#1A1A1A] p-4 text-left transition-colors hover:border-[#CBFF00]/50 hover:bg-[#242424]"
                  >
                    <p className="text-sm font-semibold text-white">{week.title || `Semana ${index + 1}`}</p>
                    <p className="text-xs text-[#787878] mt-1">
                      {week.summary || 'Añadí una descripción corta'}
                    </p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={addWeek}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#787878]/40 bg-[#1A1A1A] p-4 text-sm font-semibold text-[#CBFF00] hover:border-[#CBFF00] hover:bg-[#242424] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar semana
                </button>
              </div>
            </section>

            {plan.weeks.map((week, index) => (
              <section
                key={week.id}
                ref={registerWeekRef(week.id)}
                id={`semana-${index + 1}`}
                className="bg-[#202020] border border-[#787878]/20 rounded-2xl"
              >
                <div className="flex flex-col gap-4 border-b border-[#787878]/20 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#787878]">Semana {index + 1}</p>
                    <h2 className="text-xl font-semibold text-white">
                      {week.title || `Semana ${index + 1}`}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateWeek(week.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#787878]/40 px-3 py-2 text-sm text-[#CBFF00] hover:border-[#CBFF00] transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicar semana
                    </button>
                    <button
                      type="button"
                      onClick={() => removeWeek(week.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:border-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar semana
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[#787878] mb-2">
                        Nombre o foco de la semana
                      </label>
                      <input
                        type="text"
                        value={week.title}
                        onChange={event => handleWeekFieldChange(week.id, 'title', event.target.value)}
                        placeholder={`Semana ${index + 1}`}
                        className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#787878] mb-2">
                        Resumen corto
                      </label>
                      <input
                        type="text"
                        value={week.summary}
                        onChange={event => handleWeekFieldChange(week.id, 'summary', event.target.value)}
                        placeholder="Ej. Introducción al volumen, progresión lineal"
                        className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#787878] mb-2">
                        Notas semanales / progresión
                      </label>
                      <textarea
                        rows={3}
                        value={week.notes}
                        onChange={event => handleWeekFieldChange(week.id, 'notes', event.target.value)}
                        placeholder="Describe los objetivos de la semana, puntos clave de técnica, ajustes de carga..."
                        className="w-full bg-[#1A1A1A] border border-[#787878]/30 rounded-xl px-4 py-3 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {week.days.map((day, dayIndex) => (
                      <div key={day.id} className="bg-[#1A1A1A] border border-[#787878]/30 rounded-2xl p-5 space-y-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#787878] mb-1">
                                Nombre del día
                              </label>
                              <input
                                type="text"
                                value={day.name}
                                onChange={event => handleDayFieldChange(week.id, day.id, 'name', event.target.value)}
                                placeholder={`Día ${dayIndex + 1}`}
                                className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs uppercase tracking-wide text-[#787878] mb-1">
                                Tipo de día
                              </label>
                              <select
                                value={day.type}
                                onChange={event => handleDayTypeChange(week.id, day.id, event.target.value)}
                                className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                              >
                                <option value="ENTRENAMIENTO">ENTRENAMIENTO</option>
                                <option value="DESCANSO">DESCANSO</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => duplicateDay(week.id, day.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#787878]/40 px-3 py-2 text-xs text-[#CBFF00] hover:border-[#CBFF00] transition-colors"
                            >
                              <Copy className="h-4 w-4" /> Duplicar
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDay(week.id, day.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400 hover:border-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" /> Eliminar
                            </button>
                          </div>
                        </div>

                        {day.type === 'DESCANSO' ? (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-[#787878]">
                              Mensaje de recuperación o recomendaciones
                            </label>
                            <textarea
                              rows={3}
                              value={day.recoveryNote}
                              onChange={event => handleDayFieldChange(week.id, day.id, 'recoveryNote', event.target.value)}
                              className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
                              placeholder="Ej. Movilidad articular ligera, caminata 20', respiración diafragmática."
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="hidden lg:grid grid-cols-12 gap-3 text-[11px] uppercase tracking-wide text-[#787878]">
                              <span className="col-span-4">Ejercicio</span>
                              <span>Series</span>
                              <span>Reps</span>
                              <span>Desc</span>
                              <span>RIR</span>
                              <span>Cadencia</span>
                              <span className="col-span-3">Video</span>
                            </div>
                            {day.exercises.map(exercise => (
                              <div key={exercise.id} className="space-y-3">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                                  <div className="lg:col-span-4">
                                    <label className="lg:hidden text-xs uppercase tracking-wide text-[#787878] mb-1">
                                      Ejercicio
                                    </label>
                                    <input
                                      type="text"
                                      value={exercise.name}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'name', event.target.value)}
                                      placeholder="Nombre del ejercicio"
                                      className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                                    <label className="text-xs uppercase tracking-wide text-[#787878]">Series</label>
                                    <input
                                      type="text"
                                      value={exercise.sets}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'sets', event.target.value)}
                                      className="col-span-2 bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                                    <label className="text-xs uppercase tracking-wide text-[#787878]">Reps</label>
                                    <input
                                      type="text"
                                      value={exercise.reps}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'reps', event.target.value)}
                                      className="col-span-2 bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                                    <label className="text-xs uppercase tracking-wide text-[#787878]">Desc</label>
                                    <input
                                      type="text"
                                      value={exercise.rest}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'rest', event.target.value)}
                                      className="col-span-2 bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                                    <label className="text-xs uppercase tracking-wide text-[#787878]">RIR</label>
                                    <input
                                      type="text"
                                      value={exercise.rir}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'rir', event.target.value)}
                                      className="col-span-2 bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                                    <label className="text-xs uppercase tracking-wide text-[#787878]">Cadencia</label>
                                    <input
                                      type="text"
                                      value={exercise.tempo}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'tempo', event.target.value)}
                                      className="col-span-2 bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="lg:col-span-3">
                                    <label className="text-xs uppercase tracking-wide text-[#787878] mb-1 lg:hidden">
                                      Video o recurso
                                    </label>
                                    <input
                                      type="url"
                                      value={exercise.video}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'video', event.target.value)}
                                      placeholder="URL del video"
                                      className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                                    />
                                  </div>
                                  <div className="lg:col-span-12">
                                    <label className="text-xs uppercase tracking-wide text-[#787878] mb-1">
                                      Notas específicas
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={exercise.note}
                                      onChange={event => updateExerciseField(week.id, day.id, exercise.id, 'note', event.target.value)}
                                      className="w-full bg-[#202020] border border-[#787878]/30 rounded-lg px-3 py-2 text-white focus:border-[#CBFF00] focus:outline-none transition-colors resize-none"
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => duplicateExercise(week.id, day.id, exercise.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-[#787878]/40 px-3 py-1 text-xs text-[#CBFF00] hover:border-[#CBFF00] transition-colors"
                                  >
                                    <Copy className="h-4 w-4" /> Duplicar ejercicio
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeExercise(week.id, day.id, exercise.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:border-red-400 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" /> Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addExercise(week.id, day.id)}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#CBFF00] hover:text-[#DBFE52]"
                            >
                              <Plus className="h-4 w-4" /> Agregar ejercicio
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => addDay(week.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#787878]/40 px-4 py-2 text-sm font-semibold text-[#CBFF00] hover:border-[#CBFF00] hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Plus className="h-4 w-4" /> Agregar día
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={scrollToIndex}
                      className="text-sm text-[#787878] hover:text-[#CBFF00] transition-colors"
                    >
                      Volver al índice ↑
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:w-1/3 space-y-4">
            <div className="sticky top-6 space-y-4">
              <h2 className="text-lg font-semibold">Vista previa del plan</h2>
              <PlanPreview plan={previewPlan} />
            </div>
          </aside>
        </div>
      </div>

      <EditorActionBar
        dirty={dirty}
        onSave={handleSaveTemplate}
        onPdf={handleExportPdf}
        onBack={handleBack}
      />
    </>
  );
}

