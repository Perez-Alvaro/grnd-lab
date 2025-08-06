export const mockTemplates = [
  {
    id: 1,
    gender: 'male',
    frequency: 3,
    objective: 'volume',
    name: 'Masculino Volumen 3x/semana',
    tags: ['pecho', 'piernas', 'fuerza'],
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example1' },
      { name: 'Squats', sets: 4, reps: '8-10', rest: '120s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example1' },
      { name: 'Deadlift', sets: 3, reps: '6-8', rest: '180s', cadence: '2-1-2', rir: '1', youtubeLink: 'https://youtube.com/watch?v=example1' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '90s', cadence: '2-0-2', rir: '2', youtubeLink: 'https://youtube.com/watch?v=example1' }
    ],
    notes: 'Enfócate en la sobrecarga progresiva. Descansa 2-3 minutos entre series.',
  },
  {
    id: 2,
    gender: 'female',
    frequency: 3,
    objective: 'fat_loss',
    name: 'Femenino Pérdida de Grasa 3x/semana',
    tags: ['cardio', 'core', 'full body'],
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: '60s', cadence: '2-0-2', rir: '2', youtubeLink: 'https://youtube.com/watch?v=example2' },
      { name: 'Push-ups', sets: 3, reps: '8-12', rest: '60s', cadence: '2-0-2', rir: '2', youtubeLink: 'https://youtube.com/watch?v=example2' },
      { name: 'Plank', sets: 3, reps: '30-60sec', rest: '45s', cadence: 'isometría', rir: '2', youtubeLink: 'https://youtube.com/watch?v=example2' },
      { name: 'Mountain Climbers', sets: 3, reps: '20-30', rest: '45s', cadence: 'rápido', rir: '2', youtubeLink: 'https://youtube.com/watch?v=example2' }
    ],
    notes: 'Mantén descansos cortos (60-90 segundos). Enfócate en la técnica y el control.',
  },
  {
    id: 3,
    gender: 'male',
    frequency: 5,
    objective: 'volume',
    name: 'Masculino Volumen 5x/semana',
    tags: ['torso', 'volumen', 'avanzado'],
    exercises: [
      { name: 'Bench Press', sets: 5, reps: '6-8', rest: '180s', cadence: '2-1-2', rir: '1', youtubeLink: 'https://youtube.com/watch?v=example3' },
      { name: 'Incline DB Press', sets: 4, reps: '8-10', rest: '90s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example3' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '120s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example3' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '90s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example3' }
    ],
    notes: 'Rutina dividida avanzada. Asegura una recuperación adecuada entre sesiones.',
  },
  {
    id: 4,
    gender: 'female',
    frequency: 4,
    objective: 'volume',
    name: 'Femenino Glúteos y Piernas 4x/semana',
    tags: ['gluteos', 'piernas', 'hipertrofia'],
    exercises: [
      { name: 'Sentadillas búlgaras', sets: 4, reps: '10-12', rest: '90s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example4' },
      { name: 'Peso muerto rumano', sets: 4, reps: '8-10', rest: '120s', cadence: '2-1-2', rir: '1', youtubeLink: 'https://youtube.com/watch?v=example4' },
      { name: 'Hip thrust con barra', sets: 4, reps: '10-12', rest: '90s', cadence: '1-0-1', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example4' }
    ],
    notes: 'Metéle con ganas y no te olvides de elongar al final.',
  },
  {
    id: 5,
    gender: 'male',
    frequency: 4,
    objective: 'maintenance',
    name: 'Masculino Torso-Pierna 4x/semana',
    tags: ['fuerza', 'torso-pierna', 'simple'],
    exercises: [
      { name: 'Press militar', sets: 4, reps: '6-8', rest: '120s', cadence: '2-1-2', rir: '1', youtubeLink: 'https://youtube.com/watch?v=example5' },
      { name: 'Dominadas', sets: 4, reps: '8-10', rest: '90s', cadence: '2-0-2', rir: '1-2', youtubeLink: 'https://youtube.com/watch?v=example5' },
      { name: 'Zancadas caminando', sets: 3, reps: '20 pasos', rest: '60s', cadence: 'controlado', rir: '2', youtubeLink: 'https://youtube.com/watch?v=example5' }
    ],
    notes: 'Rutina tranqui para mantenerte en forma sin quemarte la cabeza.',
  }
];

export const mockUsers = [
  {
    id: 1,
    email: 'john@example.com',
    gender: 'male',
    frequency: 3,
    objective: 'volume',
    plan: 'basic',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    email: 'jane@example.com',
    gender: 'female',
    frequency: 3,
    objective: 'fat_loss',
    plan: 'premium',
    createdAt: '2024-01-14'
  },
  {
    id: 3,
    email: 'marce@ejemplo.com',
    gender: 'male',
    frequency: 4,
    objective: 'maintenance',
    plan: 'basic',
    createdAt: '2024-02-10'
  },
  {
    id: 4,
    email: 'luli@ejemplo.com',
    gender: 'female',
    frequency: 4,
    objective: 'volume',
    plan: 'premium',
    createdAt: '2024-02-12'
  },
  {
    id: 5,
    email: 'pablo.cba@correo.com',
    gender: 'male',
    frequency: 5,
    objective: 'volume',
    plan: 'basic',
    createdAt: '2024-02-18'
  },
  {
    id: 6,
    email: 'rochi@correo.com',
    gender: 'female',
    frequency: 2,
    objective: 'fat_loss',
    plan: 'premium',
    createdAt: '2024-02-20'
  }
];

export const mockSales = [
  {
    id: 1,
    userEmail: 'john@example.com',
    plan: 'basic',
    amount: 29.99,
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: 2,
    userEmail: 'jane@example.com',
    plan: 'premium',
    amount: 79.99,
    date: '2024-01-14',
    status: 'completed'
  },
  {
    id: 3,
    userEmail: 'marce@ejemplo.com',
    plan: 'basic',
    amount: 29.99,
    date: '2024-02-10',
    status: 'completed'
  },
  {
    id: 4,
    userEmail: 'luli@ejemplo.com',
    plan: 'premium',
    amount: 79.99,
    date: '2024-02-12',
    status: 'completed'
  },
  {
    id: 5,
    userEmail: 'pablo.cba@correo.com',
    plan: 'basic',
    amount: 29.99,
    date: '2024-02-18',
    status: 'completed'
  },
  {
    id: 6,
    userEmail: 'rochi@correo.com',
    plan: 'premium',
    amount: 79.99,
    date: '2024-02-20',
    status: 'completed'
  }
];