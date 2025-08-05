export const mockTemplates = [
  {
    id: 1,
    gender: 'male',
    frequency: 3,
    objective: 'volume',
    name: 'Male Volume 3x/week',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10' },
      { name: 'Squats', sets: 4, reps: '8-10' },
      { name: 'Deadlift', sets: 3, reps: '6-8' },
      { name: 'Pull-ups', sets: 3, reps: '8-12' }
    ],
    notes: 'Focus on progressive overload. Rest 2-3 minutes between sets.',
    youtubeLink: 'https://youtube.com/watch?v=example1'
  },
  {
    id: 2,
    gender: 'female',
    frequency: 3,
    objective: 'fat_loss',
    name: 'Female Fat Loss 3x/week',
    exercises: [
      { name: 'Goblet Squats', sets: 3, reps: '12-15' },
      { name: 'Push-ups', sets: 3, reps: '8-12' },
      { name: 'Plank', sets: 3, reps: '30-60sec' },
      { name: 'Mountain Climbers', sets: 3, reps: '20-30' }
    ],
    notes: 'Keep rest periods short (60-90 seconds). Focus on form and control.',
    youtubeLink: 'https://youtube.com/watch?v=example2'
  },
  {
    id: 3,
    gender: 'male',
    frequency: 5,
    objective: 'volume',
    name: 'Male Volume 5x/week',
    exercises: [
      { name: 'Bench Press', sets: 5, reps: '6-8' },
      { name: 'Incline DB Press', sets: 4, reps: '8-10' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10' },
      { name: 'Overhead Press', sets: 4, reps: '8-10' }
    ],
    notes: 'Advanced split routine. Ensure adequate recovery between sessions.',
    youtubeLink: 'https://youtube.com/watch?v=example3'
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
  }
];