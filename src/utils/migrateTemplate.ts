/* eslint-disable @typescript-eslint/no-explicit-any */

const emptyVariant = {
  series: '',
  reps: '',
  descanso: '',
  cadencia: 'S/D',
  rir: 'S/D'
};

const emptyExercise = {
  ejercicio: '',
  variantes: [{ ...emptyVariant }],
  videoUrl: '',
  notes: ''
};

const emptyBlock = {
  titulo: 'Entrenamiento',
  tipo: 'normal',
  color: '',
  items: [{ ...emptyExercise }]
};

export default function migrateTemplate(tmpl: any) {
  if (!tmpl) {
    return { days: [{ title: 'Día 1', bloques: [{ ...emptyBlock }] }] };
  }
  if (tmpl.days && tmpl.days.every((d: any) => d.bloques)) {
    return tmpl;
  }

  const convert = (ex: any) => ({
    ejercicio: ex.name || ex.ejercicio || '',
    variantes: [
      {
        series: ex.sets != null ? String(ex.sets) : ex.series || '',
        reps: ex.reps || '',
        descanso: ex.rest || ex.descanso || '',
        cadencia: ex.cadence || ex.cadencia || 'S/D',
        rir: ex.rir != null ? String(ex.rir) : ex.rir || 'S/D'
      }
    ],
    videoUrl: ex.youtubeLink || ex.videoUrl || '',
    notes: ex.notes || ex.notas || ''
  });

  const days = (tmpl.days || [{ title: 'Día 1', warmup: tmpl.warmup || [], exercises: tmpl.exercises || [] }]).map(
    (day: any, i: number) => {
      if (day.bloques) return day;
      const items: any[] = [];
      if (day.warmup) items.push(...day.warmup.map(convert));
      if (day.exercises) items.push(...day.exercises.map(convert));
      return {
        title: day.title || `Día ${i + 1}`,
        bloques: [{ ...emptyBlock, items: items.length ? items : [{ ...emptyExercise }] }]
      };
    }
  );

  return { ...tmpl, days };
}
