export const routines = [
  {
    id: 1,
    title: "Masculino Volumen FST-7 4x/semana",
    name: "Masculino Volumen FST-7 4x/semana",
    genre: "Masculino",
    gender: "Masculino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    description:
      "Programa orientado a fuerza e hipertrofia con bloques FST-7 y progresión controlada de cargas.",
    weeks: 4,
    duration: 4,
    durationWeeks: 4,
    days: [
      {
        id: "fst7-dia-1",
        name: "Día 1 - Pecho y Tríceps",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "fst7-press-banca",
            name: "Press banca",
            series: 4,
            sets: 4,
            reps: "8-10",
            rir: 2,
            tempo: "2-0-1",
            rest: "90s",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            notes: "Superserie con press inclinado",
          },
          {
            id: "fst7-press-inclinado",
            name: "Press inclinado mancuernas",
            series: 4,
            sets: 4,
            reps: "10-12",
            rir: 1,
            tempo: "2-1-1",
            rest: "75s",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            notes: "Recorrido completo controlado",
          },
        ],
      },
      {
        id: "fst7-dia-2",
        name: "Día 2 - Espalda y Bíceps",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "fst7-dominadas",
            name: "Dominadas",
            series: 4,
            sets: 4,
            reps: "8",
            rir: 2,
            tempo: "2-1-1",
            rest: "120s",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            notes: "Mantener core firme y pausa arriba",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "fst7-week-1",
        title: "Semana 1",
        summary:
          "Introducción al bloque FST-7 con foco en control técnico y volumen base.",
        notes: "Priorizar RIR 2 en compuestos",
        days: [
          {
            id: "fst7-week-1-day-1",
            name: "Día 1 - Pecho y Tríceps",
            type: "ENTRENAMIENTO",
            recoveryNote: "Activar manguito rotador antes del entrenamiento",
            exercises: [
              {
                id: "fst7-week-1-press-banca",
                name: "Press banca",
                sets: "4",
                reps: "8-10",
                rest: "90s",
                rir: "2",
                tempo: "2-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Superserie con press inclinado",
              },
              {
                id: "fst7-week-1-press-inclinado",
                name: "Press inclinado mancuernas",
                sets: "4",
                reps: "10-12",
                rest: "75s",
                rir: "1",
                tempo: "2-1-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Recorrido completo controlado",
              },
            ],
          },
        ],
      },
    ],
    tags: ["fst-7", "hipertrofia", "superseries"],
    price: 14000,
    plan: "Premium",
    image: "/img/fst7.jpg",
    author: "Matías Zaccaro",
    notes:
      "Rutina enfocada en hipertrofia con técnicas FST-7. Ajustar cargas semanalmente manteniendo el RIR objetivo.",
  },
  {
    id: 2,
    title: "Femenino Definición Funcional 3x/semana",
    name: "Femenino Definición Funcional 3x/semana",
    genre: "Femenino",
    gender: "Femenino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    description:
      "Entrenamiento orientado a recomposición corporal con circuitos híbridos y foco en técnica.",
    weeks: 6,
    duration: 6,
    durationWeeks: 6,
    days: [
      {
        id: "definicion-dia-1",
        name: "Día 1 - Tren Inferior + Core",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "definicion-sentadilla",
            name: "Sentadilla goblet",
            series: 4,
            sets: 4,
            reps: "12",
            rir: 1,
            tempo: "3-0-1",
            rest: "75s",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            notes: "Mantener peso centrado en media planta",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "definicion-week-1",
        title: "Semana 1",
        summary:
          "Adaptación metabólica con énfasis en control postural y técnica base.",
        notes: "Registrar percepción de esfuerzo en escala 1-10",
        days: [
          {
            id: "definicion-week-1-day-1",
            name: "Día 1 - Tren Inferior + Core",
            type: "ENTRENAMIENTO",
            recoveryNote: "Finalizar con respiración diafragmática",
            exercises: [
              {
                id: "definicion-week-1-sentadilla",
                name: "Sentadilla goblet",
                sets: "4",
                reps: "12",
                rest: "75s",
                rir: "1",
                tempo: "3-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener peso centrado en media planta",
              },
            ],
          },
        ],
      },
    ],
    tags: ["funcional", "definicion"],
    price: 12000,
    plan: "Essential",
    image: "/img/definicion.jpg",
    author: "Matías Zaccaro",
    notes:
      "Rutina enfocada en recomposición corporal con trabajo intermitente y educación respiratoria.",
  },
  {
    id: 3,
    title: "Masculino Cutting Metabólico 5x/semana",
    name: "Masculino Cutting Metabólico 5x/semana",
    genre: "Masculino",
    gender: "Masculino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    description:
      "Secuencias de intervalos de alta intensidad combinados con trabajo de fuerza neural.",
    weeks: 8,
    duration: 8,
    durationWeeks: 8,
    days: [
      {
        id: "cutting-dia-1",
        name: "Día 1 - Fuerza + HIIT",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "cutting-peso-muerto",
            name: "Peso muerto rumano",
            series: 4,
            sets: 4,
            reps: "10",
            rir: 2,
            tempo: "3-0-1",
            rest: "90s",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            notes: "Mantener activación de dorsales",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "cutting-week-1",
        title: "Semana 1",
        summary:
          "Introducción a intervalos metabólicos con control de descansos.",
        notes: "No superar RIR 3 en movimientos compuestos",
        days: [
          {
            id: "cutting-week-1-day-1",
            name: "Día 1 - Fuerza + HIIT",
            type: "ENTRENAMIENTO",
            recoveryNote: "5 minutos de caminata post sesión",
            exercises: [
              {
                id: "cutting-week-1-peso-muerto",
                name: "Peso muerto rumano",
                sets: "4",
                reps: "10",
                rest: "90s",
                rir: "2",
                tempo: "3-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener activación de dorsales",
              },
            ],
          },
        ],
      },
    ],
    tags: ["metabolico", "hiit"],
    price: 15000,
    plan: "Premium",
    image: "/img/cutting.jpg",
    author: "Matías Zaccaro",
    notes:
      "Progresión mixta con alternancia de estímulos neuronales y trabajo cardiovascular.",
  },
];

export const sales = [
  {
    id: 1,
    routineId: 1,
    userEmail: "juan.gonzalez@example.com",
    plan: "Premium",
    amount: 14000,
    date: "2025-03-01",
    status: "completed",
  },
  {
    id: 2,
    routineId: 2,
    userEmail: "maria.perez@example.com",
    plan: "Essential",
    amount: 12000,
    date: "2025-03-15",
    status: "completed",
  },
  {
    id: 3,
    routineId: 3,
    userEmail: "carlos.rodriguez@example.com",
    plan: "Premium",
    amount: 15000,
    date: "2025-04-10",
    status: "completed",
  },
];

export const users = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "González",
    email: "juan.gonzalez@example.com",
    gender: "Masculino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    plan: "Premium",
    createdAt: "2025-03-01",
    routines: [1],
  },
  {
    id: 2,
    firstName: "María",
    lastName: "Pérez",
    email: "maria.perez@example.com",
    gender: "Femenino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    plan: "Essential",
    createdAt: "2025-03-12",
    routines: [2],
  },
  {
    id: 3,
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    gender: "Masculino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    plan: "Premium",
    createdAt: "2025-04-07",
    routines: [3],
  },
];

const mockData = {
  routines,
  sales,
  users,
};

export default mockData;
