export const mockRoutines = [
  {
    id: 1,
    name: "Masculino Volumen FST-7 5x/semana",
    title: "Masculino Volumen FST-7 5x/semana",
    genre: "Masculino",
    gender: "Masculino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    description:
      "Programa intensivo orientado a hipertrofia con bloques FST-7, control del tempo y seguimiento semanal de cargas.",
    frequency: 5,
    durationWeeks: 6,
    level: "Intermedio",
    days: [
      {
        id: "fst7-dia-1",
        name: "Día 1 - Pecho y Tríceps",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "fst7-press-plano",
            name: "Press banca con barra",
            sets: "4",
            reps: "8-10",
            rest: "90s",
            rir: "2",
            tempo: "2-0-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Foco en control excéntrico y bloqueo suave",
          },
          {
            id: "fst7-fondos",
            name: "Fondos en paralelas asistidos",
            sets: "3",
            reps: "12-15",
            rest: "75s",
            rir: "1",
            tempo: "2-1-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Agregar carga si se llega cómodo al rango alto",
          },
        ],
      },
      {
        id: "fst7-dia-2",
        name: "Día 2 - Espalda y Bíceps",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "fst7-dominadas-pronadas",
            name: "Dominadas pronadas",
            sets: "4",
            reps: "6-8",
            rest: "120s",
            rir: "2",
            tempo: "2-1-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Extender completo sin perder tensión escapular",
          },
          {
            id: "fst7-remopendlay",
            name: "Remo Pendlay",
            sets: "4",
            reps: "8-10",
            rest: "90s",
            rir: "1",
            tempo: "2-0-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Explosivo en fase concéntrica, control total en la bajada",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "fst7-week-1",
        title: "Semana 1",
        summary:
          "Introducción al bloque FST-7 con control técnico, foco en progresión lineal y selección de cargas moderadas.",
        notes: "Registrar RIR en movimientos principales para ajustar la semana siguiente.",
        days: [
          {
            id: "fst7-week-1-day-1",
            name: "Día 1 - Pecho y Tríceps",
            type: "ENTRENAMIENTO",
            recoveryNote: "Trabajo de movilidad torácica 5 minutos post sesión",
            exercises: [
              {
                id: "fst7-week-1-press-plano",
                name: "Press banca con barra",
                sets: "4",
                reps: "8-10",
                rest: "90s",
                rir: "2",
                tempo: "2-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Progresión lineal de cargas semana a semana",
              },
              {
                id: "fst7-week-1-crossover",
                name: "Crossover en polea alta",
                sets: "3",
                reps: "15",
                rest: "60s",
                rir: "1",
                tempo: "2-1-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener 2 segundos de contracción máxima",
              },
            ],
          },
          {
            id: "fst7-week-1-day-2",
            name: "Día 2 - Espalda y Bíceps",
            type: "ENTRENAMIENTO",
            recoveryNote: "Trabajo respiratorio nasal 3 series de 2 minutos",
            exercises: [
              {
                id: "fst7-week-1-dominadas",
                name: "Dominadas pronadas",
                sets: "4",
                reps: "6-8",
                rest: "120s",
                rir: "2",
                tempo: "2-1-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Agregar lastre si se completan 8 repeticiones con RIR 2",
              },
              {
                id: "fst7-week-1-facepull",
                name: "Face pull en polea",
                sets: "3",
                reps: "15",
                rest: "60s",
                rir: "1",
                tempo: "2-1-2",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Pausa de 1 segundo con escápulas juntas",
              },
            ],
          },
        ],
      },
      {
        id: "fst7-week-2",
        title: "Semana 2",
        summary: "Incremento del volumen total y estrategias de pre-agotamiento controlado.",
        notes: "Sumar series sólo si el RIR se mantiene por encima de 1.",
        days: [
          {
            id: "fst7-week-2-day-1",
            name: "Día 3 - Piernas y Core",
            type: "ENTRENAMIENTO",
            recoveryNote: "Finalizar con 8 minutos de bici a intensidad suave",
            exercises: [
              {
                id: "fst7-week-2-sentadilla",
                name: "Sentadilla trasera",
                sets: "4",
                reps: "6-8",
                rest: "150s",
                rir: "2",
                tempo: "3-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener la columna neutra y velocidad controlada",
              },
              {
                id: "fst7-week-2-curlfemoral",
                name: "Curl femoral tumbado",
                sets: "3",
                reps: "12-15",
                rest: "75s",
                rir: "1",
                tempo: "2-1-2",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Pausar 1 segundo en máxima flexión",
              },
            ],
          },
        ],
      },
    ],
    tags: ["fst-7", "hipertrofia", "superseries"],
    price: 18500,
    plan: "Premium",
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    author: "Matías Zaccaro",
    notes:
      "Rutina orientada a atletas intermedios con seguimiento de RIR y sobrecarga progresiva semanal.",
    createdAt: "2025-08-22",
    updatedAt: "2025-11-05",
  },
  {
    id: 2,
    name: "Femenino Definición Funcional 3x/semana",
    title: "Femenino Definición Funcional 3x/semana",
    genre: "Femenino",
    gender: "Femenino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    description:
      "Entrenamiento funcional con énfasis en estabilidad, trabajo unilateral y circuitos metabólicos controlados.",
    frequency: 3,
    durationWeeks: 6,
    level: "Inicial",
    days: [
      {
        id: "definicion-dia-1",
        name: "Día 1 - Tren Inferior + Core",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "definicion-sentadilla-goblet",
            name: "Sentadilla goblet",
            sets: "3",
            reps: "12-15",
            rest: "60s",
            rir: "1",
            tempo: "3-0-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Controlar la respiración y mantener rodillas alineadas",
          },
          {
            id: "definicion-zancadas",
            name: "Zancadas caminando",
            sets: "3",
            reps: "14 por pierna",
            rest: "60s",
            rir: "2",
            tempo: "2-0-2",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Agregar mancuernas livianas si es necesario",
          },
        ],
      },
      {
        id: "definicion-dia-2",
        name: "Día 2 - Tren Superior + Metabólico",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "definicion-press-militar",
            name: "Press militar con mancuernas",
            sets: "3",
            reps: "10-12",
            rest: "75s",
            rir: "1",
            tempo: "2-0-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Evitar arquear la zona lumbar",
          },
          {
            id: "definicion-burpees",
            name: "Burpees controlados",
            sets: "3",
            reps: "12",
            rest: "45s",
            rir: "2",
            tempo: "Controlado",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Mantener ritmo constante sin perder técnica",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "definicion-week-1",
        title: "Semana 1",
        summary:
          "Adaptación metabólica con énfasis en técnica y control postural durante los circuitos.",
        notes: "Registrar percepción subjetiva de esfuerzo en escala 1-10.",
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
                sets: "3",
                reps: "12-15",
                rest: "60s",
                rir: "1",
                tempo: "3-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener peso centrado en media planta",
              },
            ],
          },
          {
            id: "definicion-week-1-day-2",
            name: "Día 2 - Tren Superior + Metabólico",
            type: "ENTRENAMIENTO",
            recoveryNote: "Caminata suave 8 minutos post sesión",
            exercises: [
              {
                id: "definicion-week-1-press-militar",
                name: "Press militar con mancuernas",
                sets: "3",
                reps: "10-12",
                rest: "75s",
                rir: "1",
                tempo: "2-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener abdomen firme durante todo el movimiento",
              },
            ],
          },
        ],
      },
    ],
    tags: ["definición", "funcional", "metabólico"],
    price: 13800,
    plan: "Essential",
    image:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1200&q=80",
    author: "Lucía Fernández",
    notes:
      "Programa orientado a recomposición corporal combinando fuerza, core y bloques metabólicos.",
    createdAt: "2025-07-18",
    updatedAt: "2025-10-27",
  },
  {
    id: 3,
    name: "Masculino Cutting Metabólico 5x/semana",
    title: "Masculino Cutting Metabólico 5x/semana",
    genre: "Masculino",
    gender: "Masculino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    description:
      "Secuencias de intervalos de alta intensidad combinados con trabajo de fuerza neural para sostener masa magra.",
    frequency: 5,
    durationWeeks: 8,
    level: "Avanzado",
    days: [
      {
        id: "cutting-dia-1",
        name: "Día 1 - Fuerza + HIIT",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "cutting-peso-muerto",
            name: "Peso muerto rumano",
            sets: "4",
            reps: "8-10",
            rest: "90s",
            rir: "2",
            tempo: "3-0-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Mantener activación de dorsales durante todo el recorrido",
          },
          {
            id: "cutting-assaultbike",
            name: "Assault bike intervalos",
            sets: "5",
            reps: "40s trabajo / 20s pausa",
            rest: "20s",
            rir: "3",
            tempo: "Controlado",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Mantener potencia constante sin perder técnica",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "cutting-week-1",
        title: "Semana 1",
        summary:
          "Bloque de adaptación a intervalos metabólicos con control de descansos y foco en potencia aeróbica.",
        notes: "No superar RIR 3 en movimientos compuestos la primera semana.",
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
    tags: ["metabólico", "hiit", "cutting"],
    price: 17200,
    plan: "Premium",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    author: "Matías Zaccaro",
    notes:
      "Progresión mixta alternando estímulos neurales, trabajo HIIT y control de cargas para preservar fuerza.",
    createdAt: "2025-09-04",
    updatedAt: "2025-11-04",
  },
  {
    id: 4,
    name: "Funcional Mixto Fuerza & Movilidad 4x/semana",
    title: "Funcional Mixto Fuerza & Movilidad 4x/semana",
    genre: "Mixto",
    gender: "Mixto",
    objective: "Recomposición (Fuerza y Movilidad)",
    description:
      "Ciclo funcional para mejorar fuerza general, control motor y movilidad articular con sesiones híbridas.",
    frequency: 4,
    durationWeeks: 5,
    level: "Intermedio",
    days: [
      {
        id: "mixto-dia-1",
        name: "Día 1 - Fuerza total",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "mixto-front-squat",
            name: "Front squat con pausa",
            sets: "4",
            reps: "6",
            rest: "120s",
            rir: "2",
            tempo: "3-2-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Pausa de 2 segundos en el punto más bajo",
          },
          {
            id: "mixto-row-unilateral",
            name: "Remo unilateral con kettlebell",
            sets: "3",
            reps: "12 por lado",
            rest: "75s",
            rir: "1",
            tempo: "2-1-2",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Buscar estabilidad en cadera y hombro",
          },
        ],
      },
      {
        id: "mixto-dia-2",
        name: "Día 2 - Movilidad + Core",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "mixto-flows",
            name: "Flow de movilidad torácica",
            sets: "3",
            reps: "6 secuencias",
            rest: "60s",
            rir: "S/D",
            tempo: "Fluido",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Mantener respiración nasal",
          },
          {
            id: "mixto-planchas",
            name: "Plancha lateral con abducción",
            sets: "3",
            reps: "10 por lado",
            rest: "45s",
            rir: "2",
            tempo: "2-1-2",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Cadera alineada y abdomen firme",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "mixto-week-1",
        title: "Semana 1",
        summary:
          "Establecimiento de patrones básicos de fuerza y movilidad con seguimiento de estabilidad central.",
        notes: "Registrar movilidad percibida al finalizar cada sesión.",
        days: [
          {
            id: "mixto-week-1-day-1",
            name: "Día 1 - Fuerza total",
            type: "ENTRENAMIENTO",
            recoveryNote: "Realizar liberación miofascial de tren inferior",
            exercises: [
              {
                id: "mixto-week-1-front-squat",
                name: "Front squat con pausa",
                sets: "4",
                reps: "6",
                rest: "120s",
                rir: "2",
                tempo: "3-2-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Pausa controlada con respiración nasal",
              },
            ],
          },
          {
            id: "mixto-week-1-day-2",
            name: "Día 2 - Movilidad + Core",
            type: "ENTRENAMIENTO",
            recoveryNote: "Respiración diafragmática 3 series",
            exercises: [
              {
                id: "mixto-week-1-planchas",
                name: "Plancha lateral con abducción",
                sets: "3",
                reps: "10 por lado",
                rest: "45s",
                rir: "2",
                tempo: "2-1-2",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Control de cadera todo el rango",
              },
            ],
          },
        ],
      },
    ],
    tags: ["funcional", "movilidad", "core"],
    price: 11200,
    plan: "Basic",
    image:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80",
    author: "Santiago Herrera",
    notes:
      "Ciclo diseñado para públicos mixtos que buscan ganar fuerza funcional y rango articular.",
    createdAt: "2025-06-15",
    updatedAt: "2025-10-10",
  },
  {
    id: 5,
    name: "Running Performance & Strength 4x/semana",
    title: "Running Performance & Strength 4x/semana",
    genre: "Mixto",
    gender: "Mixto",
    objective: "Resistencia (Potencia Aeróbica)",
    description:
      "Bloque híbrido para corredores que combina trabajos de pista, gimnasio y técnica de carrera.",
    frequency: 4,
    durationWeeks: 8,
    level: "Intermedio",
    days: [
      {
        id: "running-dia-1",
        name: "Día 1 - Técnica + Gimnasio",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "running-skipping",
            name: "Drills de skipping y técnica",
            sets: "4",
            reps: "40m",
            rest: "60s",
            rir: "S/D",
            tempo: "Dinámico",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Foco en postura y brace abdominal",
          },
          {
            id: "running-sentadilla-bulgar",
            name: "Sentadilla búlgara",
            sets: "3",
            reps: "10 por pierna",
            rest: "75s",
            rir: "2",
            tempo: "2-1-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Controlar rodilla alineada",
          },
        ],
      },
      {
        id: "running-dia-2",
        name: "Día 2 - Series en pista",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "running-series400",
            name: "6x400m controlados",
            sets: "6",
            reps: "400m",
            rest: "90s",
            rir: "3",
            tempo: "Competitivo",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Buscar ritmo constante y técnica de brace",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "running-week-1",
        title: "Semana 1",
        summary:
          "Construcción de base aeróbica con recordatorios técnicos y fuerza unilateral.",
        notes: "Registrar tiempos de pista y HR promedio.",
        days: [
          {
            id: "running-week-1-day-1",
            name: "Día 1 - Técnica + Gimnasio",
            type: "ENTRENAMIENTO",
            recoveryNote: "Estiramiento activo de flexores de cadera",
            exercises: [
              {
                id: "running-week-1-skipping",
                name: "Drills de skipping y técnica",
                sets: "4",
                reps: "40m",
                rest: "60s",
                rir: "S/D",
                tempo: "Dinámico",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Mantener cadera alta",
              },
            ],
          },
        ],
      },
    ],
    tags: ["running", "resistencia", "fuerza"],
    price: 12500,
    plan: "Essential",
    image:
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1200&q=80",
    author: "Carla Méndez",
    notes:
      "Plan para runners que necesitan sostener fuerza estructural y calidad de zancada.",
    createdAt: "2025-07-30",
    updatedAt: "2025-10-30",
  },
  {
    id: 6,
    name: "Powerbuilding Elite 6x/semana",
    title: "Powerbuilding Elite 6x/semana",
    genre: "Masculino",
    gender: "Masculino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    description:
      "Microciclos combinando fuerza pesada y accesorios de hipertrofia con seguimiento de velocidad de ejecución.",
    frequency: 6,
    durationWeeks: 8,
    level: "Avanzado",
    days: [
      {
        id: "power-dia-1",
        name: "Día 1 - Press banca pesado",
        type: "ENTRENAMIENTO",
        exercises: [
          {
            id: "power-bench-max",
            name: "Press banca pesado",
            sets: "5",
            reps: "5",
            rest: "180s",
            rir: "1",
            tempo: "2-0-1",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Rastrear velocidad con encoder o app",
          },
          {
            id: "power-press-inclinado",
            name: "Press inclinado mancuernas",
            sets: "4",
            reps: "10",
            rest: "90s",
            rir: "1",
            tempo: "2-1-2",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            note: "Mantener congestión controlada",
          },
        ],
      },
    ],
    weeks: [
      {
        id: "power-week-1",
        title: "Semana 1",
        summary:
          "Arranque del ciclo con énfasis en fuerza máxima y control de volumen accesorio.",
        notes: "Registrar velocidad promedio de la serie más pesada.",
        days: [
          {
            id: "power-week-1-day-1",
            name: "Día 1 - Press banca pesado",
            type: "ENTRENAMIENTO",
            recoveryNote: "Movilidad escapular y banda elástica",
            exercises: [
              {
                id: "power-week-1-bench",
                name: "Press banca pesado",
                sets: "5",
                reps: "5",
                rest: "180s",
                rir: "1",
                tempo: "2-0-1",
                video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                note: "Aplicar tempo constante",
              },
            ],
          },
        ],
      },
    ],
    tags: ["powerbuilding", "fuerza", "hipertrofia"],
    price: 19000,
    plan: "Premium",
    image:
      "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=80",
    author: "Matías Zaccaro",
    notes:
      "Ciclo avanzado con periodización conjugada para atletas experimentados.",
    createdAt: "2025-08-05",
    updatedAt: "2025-11-08",
  },
];

export const mockSales = [
  {
    id: 101,
    routineId: 1,
    userEmail: "carlos.rodriguez@example.com",
    plan: "Premium",
    planType: "premium",
    amount: 18500,
    date: "2025-11-01",
    status: "completed",
  },
  {
    id: 102,
    routineId: 2,
    userEmail: "maria.perez@example.com",
    plan: "Essential",
    planType: "essential",
    amount: 12200,
    date: "2025-11-04",
    status: "completed",
  },
  {
    id: 103,
    routineId: 3,
    userEmail: "juan.gonzalez@example.com",
    plan: "Premium",
    planType: "premium",
    amount: 17200,
    date: "2025-11-08",
    status: "completed",
  },
  {
    id: 104,
    routineId: 4,
    userEmail: "andrea.lopez@example.com",
    plan: "Basic",
    planType: "basic",
    amount: 9900,
    date: "2025-11-12",
    status: "completed",
  },
  {
    id: 105,
    routineId: 5,
    userEmail: "federico.sanchez@example.com",
    plan: "Essential",
    planType: "essential",
    amount: 13000,
    date: "2025-11-16",
    status: "completed",
  },
  {
    id: 106,
    routineId: 6,
    userEmail: "laura.martinez@example.com",
    plan: "Premium",
    planType: "premium",
    amount: 19000,
    date: "2025-11-20",
    status: "completed",
  },
  {
    id: 107,
    routineId: 1,
    userEmail: "esteban.ramos@example.com",
    plan: "Premium",
    planType: "premium",
    amount: 16800,
    date: "2025-11-25",
    status: "completed",
  },
  {
    id: 108,
    routineId: 2,
    userEmail: "luisa.garcia@example.com",
    plan: "Essential",
    planType: "essential",
    amount: 11800,
    date: "2025-10-24",
    status: "completed",
  },
  {
    id: 109,
    routineId: 3,
    userEmail: "fernando.alvarez@example.com",
    plan: "Premium",
    planType: "premium",
    amount: 16000,
    date: "2025-10-18",
    status: "completed",
  },
  {
    id: 110,
    routineId: 5,
    userEmail: "sofia.navarro@example.com",
    plan: "Essential",
    planType: "essential",
    amount: 12500,
    date: "2025-10-11",
    status: "completed",
  },
  {
    id: 111,
    routineId: 4,
    userEmail: "martin.castillo@example.com",
    plan: "Basic",
    amount: 10500,
    date: "2025-10-02",
    status: "completed",
  },
  {
    id: 112,
    routineId: 6,
    userEmail: "agustina.prieto@example.com",
    plan: "Premium",
    amount: 18000,
    date: "2025-10-06",
    status: "completed",
  },
];

export const mockUsers = [
  {
    id: 1,
    firstName: "Carlos",
    lastName: "Rodríguez",
    email: "carlos.rodriguez@example.com",
    gender: "Masculino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    plan: "Premium",
    createdAt: "2025-08-28",
    routines: [1, 6],
  },
  {
    id: 2,
    firstName: "María",
    lastName: "Pérez",
    email: "maria.perez@example.com",
    gender: "Femenino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    plan: "Essential",
    createdAt: "2025-09-02",
    routines: [2],
  },
  {
    id: 3,
    firstName: "Juan",
    lastName: "González",
    email: "juan.gonzalez@example.com",
    gender: "Masculino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    plan: "Premium",
    createdAt: "2025-09-12",
    routines: [3],
  },
  {
    id: 4,
    firstName: "Andrea",
    lastName: "López",
    email: "andrea.lopez@example.com",
    gender: "Femenino",
    objective: "Recomposición (Fuerza y Movilidad)",
    plan: "Basic",
    createdAt: "2025-09-18",
    routines: [4],
  },
  {
    id: 5,
    firstName: "Federico",
    lastName: "Sánchez",
    email: "federico.sanchez@example.com",
    gender: "Masculino",
    objective: "Resistencia (Potencia Aeróbica)",
    plan: "Essential",
    createdAt: "2025-09-22",
    routines: [5],
  },
  {
    id: 6,
    firstName: "Laura",
    lastName: "Martínez",
    email: "laura.martinez@example.com",
    gender: "Femenino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    plan: "Premium",
    createdAt: "2025-09-26",
    routines: [6],
  },
  {
    id: 7,
    firstName: "Esteban",
    lastName: "Ramos",
    email: "esteban.ramos@example.com",
    gender: "Masculino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    plan: "Premium",
    createdAt: "2025-10-03",
    routines: [1],
  },
  {
    id: 8,
    firstName: "Luisa",
    lastName: "García",
    email: "luisa.garcia@example.com",
    gender: "Femenino",
    objective: "Pérdida de Grasa (Fuerza y Resistencia)",
    plan: "Essential",
    createdAt: "2025-10-07",
    routines: [2],
  },
  {
    id: 9,
    firstName: "Agustina",
    lastName: "Prieto",
    email: "agustina.prieto@example.com",
    gender: "Femenino",
    objective: "Volumen (Fuerza e Hipertrofia)",
    plan: "Premium",
    createdAt: "2025-10-10",
    routines: [6],
  },
  {
    id: 10,
    firstName: "Martín",
    lastName: "Castillo",
    email: "martin.castillo@example.com",
    gender: "Masculino",
    objective: "Recomposición (Fuerza y Movilidad)",
    plan: "Basic",
    createdAt: "2025-10-14",
    routines: [4],
  },
];

const toMonthKey = (date) => date.slice(0, 7);

const aggregateSalesByMonth = (sales) => {
  const summary = new Map();
  sales.forEach((sale) => {
    const key = toMonthKey(sale.date);
    if (!summary.has(key)) {
      summary.set(key, { revenue: 0, downloads: 0 });
    }
    const monthData = summary.get(key);
    monthData.revenue += sale.amount;
    monthData.downloads += 1;
  });
  return summary;
};

const calculateVariation = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : null;
  }
  return ((current - previous) / previous) * 100;
};

export const buildMockMetrics = (
  sales = mockSales,
  routines = mockRoutines,
  users = mockUsers,
) => {
  const salesByMonth = aggregateSalesByMonth(sales);
  const monthKeys = Array.from(salesByMonth.keys()).sort();
  const latestMonthKey = monthKeys.length
    ? monthKeys[monthKeys.length - 1]
    : null;
  const previousMonthKey = monthKeys.length > 1
    ? monthKeys[monthKeys.length - 2]
    : null;

  const totalIngresos = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const ingresosMensuales = latestMonthKey
    ? salesByMonth.get(latestMonthKey)?.revenue ?? 0
    : 0;
  const descargasMes = latestMonthKey
    ? salesByMonth.get(latestMonthKey)?.downloads ?? 0
    : 0;

  const ingresosPrevios = previousMonthKey
    ? salesByMonth.get(previousMonthKey)?.revenue ?? 0
    : 0;
  const descargasPrevias = previousMonthKey
    ? salesByMonth.get(previousMonthKey)?.downloads ?? 0
    : 0;

  const ticketPromedio = sales.length ? totalIngresos / sales.length : 0;

  const seriesMensuales = monthKeys.map((key) => ({
    key,
    revenue: salesByMonth.get(key)?.revenue ?? 0,
    downloads: salesByMonth.get(key)?.downloads ?? 0,
  }));

  return {
    totalUsuarios: users.length,
    totalIngresos,
    ingresosMensuales,
    rutinasActivas: routines.length,
    descargasMes,
    ticketPromedio,
    variacionIngresos: calculateVariation(ingresosMensuales, ingresosPrevios),
    variacionDescargas: calculateVariation(descargasMes, descargasPrevias),
    meses: {
      actual: latestMonthKey,
      anterior: previousMonthKey,
    },
    seriesMensuales,
  };
};

export const mockMetrics = buildMockMetrics();

export const mockCommunityMembers = [
  {
    nombre: "Carlos Rodríguez",
    email: "carlos@example.com",
    telefono: "+5493515555555",
  },
];

export const mockStore = {
  routines: mockRoutines,
  sales: mockSales,
  users: mockUsers,
  communityMembers: mockCommunityMembers,
};

export default mockStore;
