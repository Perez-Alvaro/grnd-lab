-- ===================================
-- SCRIPT DE DATOS DE PRUEBA
-- ===================================
-- Ejecutar DESPUÉS de 001_initial_schema.sql

-- ===================================
-- 1. RUTINA DE VOLUMEN (MASCULINO)
-- ===================================

-- Producto (rutina)
INSERT INTO products (id, type, name, slug, description, price, active, featured)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'routine',
  'Masculino Volumen FST-7 5x/semana',
  'masculino-volumen-fst7-5x-semana',
  'Programa intensivo orientado a hipertrofia con bloques FST-7, control del tempo y seguimiento semanal de cargas.',
  15000.00,
  true,
  true
);

-- Detalles de rutina
INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, weeks)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'male',
  'muscle_gain',
  'intermediate',
  5,
  6,
  '[
    {
      "weekNumber": 1,
      "title": "Semana 1",
      "summary": "Introducción al bloque FST-7 con control técnico",
      "notes": "Registrar RIR en movimientos principales",
      "days": [
        {
          "dayNumber": 1,
          "name": "Día 1 - Pecho y Tríceps",
          "type": "ENTRENAMIENTO",
          "recoveryNote": "Trabajo de movilidad torácica 5 minutos post sesión",
          "exercises": [
            {
              "name": "Press banca con barra",
              "sets": 4,
              "reps": "8-10",
              "rest": "90s",
              "rir": 2,
              "tempo": "2-0-1",
              "notes": "Foco en control excéntrico y bloqueo suave"
            },
            {
              "name": "Press inclinado con mancuernas",
              "sets": 3,
              "reps": "10-12",
              "rest": "75s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Máxima contracción en el pico"
            },
            {
              "name": "Fondos en paralelas",
              "sets": 3,
              "reps": "12-15",
              "rest": "75s",
              "rir": 1,
              "tempo": "2-1-1",
              "notes": "Agregar carga si es necesario"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Día 2 - Espalda y Bíceps",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Dominadas pronadas",
              "sets": 4,
              "reps": "6-8",
              "rest": "120s",
              "rir": 2,
              "tempo": "2-1-1",
              "notes": "Extender completo sin perder tensión"
            },
            {
              "name": "Remo Pendlay",
              "sets": 4,
              "reps": "8-10",
              "rest": "90s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Explosivo en concéntrica"
            },
            {
              "name": "Curl con barra Z",
              "sets": 3,
              "reps": "10-12",
              "rest": "60s",
              "rir": 1,
              "tempo": "2-0-2",
              "notes": "Sin balanceo del tronco"
            }
          ]
        },
        {
          "dayNumber": 3,
          "name": "Día 3 - Pierna Completa",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Sentadilla trasera",
              "sets": 4,
              "reps": "6-8",
              "rest": "180s",
              "rir": 2,
              "tempo": "3-0-1",
              "notes": "Profundidad completa, rodillas alienadas"
            },
            {
              "name": "Peso muerto rumano",
              "sets": 4,
              "reps": "8-10",
              "rest": "120s",
              "rir": 1,
              "tempo": "2-0-2",
              "notes": "Tensión constante en isquios"
            },
            {
              "name": "Prensa 45°",
              "sets": 3,
              "reps": "12-15",
              "rest": "90s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Apoyo total de los pies"
            }
          ]
        },
        {
          "dayNumber": 4,
          "name": "Día 4 - Hombros",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Press militar con barra",
              "sets": 4,
              "reps": "6-8",
              "rest": "120s",
              "rir": 2,
              "tempo": "2-0-1",
              "notes": "Core activado, no arquear espalda"
            },
            {
              "name": "Elevaciones laterales",
              "sets": 3,
              "reps": "12-15",
              "rest": "60s",
              "rir": 1,
              "tempo": "2-1-2",
              "notes": "Control en la bajada"
            },
            {
              "name": "Face pulls",
              "sets": 3,
              "reps": "15-20",
              "rest": "60s",
              "rir": 0,
              "tempo": "1-1-1",
              "notes": "Estabilidad escapular"
            }
          ]
        },
        {
          "dayNumber": 5,
          "name": "Día 5 - Brazos FST-7",
          "type": "ENTRENAMIENTO",
          "recoveryNote": "Estiramientos activos de brazos 10 minutos",
          "exercises": [
            {
              "name": "Curl con mancuernas alterno",
              "sets": 3,
              "reps": "8-10",
              "rest": "75s",
              "rir": 1,
              "tempo": "2-0-2",
              "notes": "Supinación completa en el pico"
            },
            {
              "name": "Press francés con barra",
              "sets": 3,
              "reps": "10-12",
              "rest": "75s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Codos fijos, solo movimiento de antebrazo"
            },
            {
              "name": "Curl en polea baja (FST-7)",
              "sets": 7,
              "reps": "12",
              "rest": "30s",
              "rir": 0,
              "tempo": "2-1-1",
              "notes": "Series consecutivas con descanso mínimo"
            },
            {
              "name": "Extensiones en polea (FST-7)",
              "sets": 7,
              "reps": "12",
              "rest": "30s",
              "rir": 0,
              "tempo": "2-1-1",
              "notes": "Bomba muscular máxima"
            }
          ]
        }
      ]
    }
  ]'::jsonb
);

-- ===================================
-- 2. RUTINA DE DEFINICIÓN (FEMENINO)
-- ===================================

-- Producto (rutina)
INSERT INTO products (id, type, name, slug, description, price, active, featured)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'routine',
  'Femenino Definición 3x/semana',
  'femenino-definicion-3x-semana',
  'Entrenamiento funcional con énfasis en estabilidad, trabajo unilateral y circuitos metabólicos controlados.',
  12000.00,
  true,
  true
);

-- Detalles de rutina
INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, weeks)
VALUES (
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'female',
  'fat_loss',
  'beginner',
  3,
  6,
  '[
    {
      "weekNumber": 1,
      "title": "Semana 1",
      "summary": "Adaptación al protocolo de entrenamiento funcional",
      "notes": "Enfocarse en la técnica, no en la carga",
      "days": [
        {
          "dayNumber": 1,
          "name": "Día 1 - Tren Inferior + Core",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Sentadilla goblet",
              "sets": 3,
              "reps": "12-15",
              "rest": "60s",
              "rir": 1,
              "tempo": "3-0-1",
              "notes": "Controlar respiración y rodillas alineadas"
            },
            {
              "name": "Zancadas caminando",
              "sets": 3,
              "reps": "14 por pierna",
              "rest": "60s",
              "rir": 2,
              "tempo": "2-0-2",
              "notes": "Agregar mancuernas si es necesario"
            },
            {
              "name": "Puente de glúteos",
              "sets": 3,
              "reps": "15-20",
              "rest": "45s",
              "rir": 0,
              "tempo": "2-2-1",
              "notes": "Contracción máxima en la cima"
            },
            {
              "name": "Plancha frontal",
              "sets": 3,
              "reps": "30-45s",
              "rest": "60s",
              "rir": 0,
              "tempo": "isométrico",
              "notes": "Alineación perfecta de columna"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Día 2 - Tren Superior + Metabólico",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Press militar con mancuernas",
              "sets": 3,
              "reps": "10-12",
              "rest": "75s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "No arquear la espalda"
            },
            {
              "name": "Remo con mancuernas",
              "sets": 3,
              "reps": "12 por brazo",
              "rest": "60s",
              "rir": 1,
              "tempo": "2-1-1",
              "notes": "Codo pegado al cuerpo"
            },
            {
              "name": "Flexiones de rodillas",
              "sets": 3,
              "reps": "10-15",
              "rest": "60s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Progresar a flexiones completas"
            },
            {
              "name": "Burpees modificados",
              "sets": 3,
              "reps": "10",
              "rest": "90s",
              "rir": 2,
              "tempo": "controlado",
              "notes": "Mantener ritmo constante"
            }
          ]
        },
        {
          "dayNumber": 3,
          "name": "Día 3 - Full Body + Cardio",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Peso muerto con mancuernas",
              "sets": 3,
              "reps": "10-12",
              "rest": "90s",
              "rir": 1,
              "tempo": "3-0-1",
              "notes": "Espalda neutra, bisagra de cadera"
            },
            {
              "name": "Press de pecho con mancuernas",
              "sets": 3,
              "reps": "10-12",
              "rest": "75s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Rango completo de movimiento"
            },
            {
              "name": "Step ups alternados",
              "sets": 3,
              "reps": "12 por pierna",
              "rest": "60s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Impulso desde talón"
            },
            {
              "name": "Mountain climbers",
              "sets": 3,
              "reps": "20 totales",
              "rest": "60s",
              "rir": 1,
              "tempo": "controlado",
              "notes": "Core activado constantemente"
            }
          ]
        }
      ]
    }
  ]'::jsonb
);

-- ===================================
-- 3. RUTINA UNISEX DE FUERZA
-- ===================================

-- Producto (rutina)
INSERT INTO products (id, type, name, slug, description, price, active)
VALUES (
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'routine',
  'Unisex Fuerza 4x/semana',
  'unisex-fuerza-4x-semana',
  'Programa de fuerza basado en los 3 grandes movimientos: sentadilla, press de banca y peso muerto.',
  18000.00,
  true
);

-- Detalles de rutina
INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, weeks)
VALUES (
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'unisex',
  'strength',
  'advanced',
  4,
  8,
  '[
    {
      "weekNumber": 1,
      "title": "Semana 1 - Fase de Adaptación",
      "summary": "Introducción al programa de fuerza con cargas moderadas",
      "notes": "Establecer RM (repeticiones máximas) en los grandes movimientos",
      "days": [
        {
          "dayNumber": 1,
          "name": "Día 1 - Sentadilla Principal",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Sentadilla trasera",
              "sets": 5,
              "reps": "5",
              "rest": "3-5min",
              "rir": 2,
              "tempo": "3-0-X",
              "notes": "75% del 1RM aproximadamente"
            },
            {
              "name": "Sentadilla frontal",
              "sets": 3,
              "reps": "8",
              "rest": "2-3min",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Trabajo accesorio de cuádriceps"
            },
            {
              "name": "Buenos días",
              "sets": 3,
              "reps": "10",
              "rest": "90s",
              "rir": 1,
              "tempo": "2-0-2",
              "notes": "Fortalecer cadena posterior"
            }
          ]
        },
        {
          "dayNumber": 2,
          "name": "Día 2 - Press de Banca Principal",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Press de banca plano",
              "sets": 5,
              "reps": "5",
              "rest": "3-5min",
              "rir": 2,
              "tempo": "2-0-X",
              "notes": "75% del 1RM aproximadamente"
            },
            {
              "name": "Press inclinado",
              "sets": 3,
              "reps": "8",
              "rest": "2min",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Desarrollo de pecho superior"
            },
            {
              "name": "Press militar",
              "sets": 3,
              "reps": "6",
              "rest": "2min",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Fuerza de hombros"
            }
          ]
        },
        {
          "dayNumber": 3,
          "name": "Día 3 - Peso Muerto Principal",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Peso muerto convencional",
              "sets": 5,
              "reps": "5",
              "rest": "3-5min",
              "rir": 2,
              "tempo": "1-0-X",
              "notes": "75% del 1RM aproximadamente"
            },
            {
              "name": "Peso muerto rumano",
              "sets": 3,
              "reps": "8",
              "rest": "2min",
              "rir": 1,
              "tempo": "3-0-1",
              "notes": "Énfasis en isquiotibiales"
            },
            {
              "name": "Remo con barra",
              "sets": 4,
              "reps": "6",
              "rest": "2min",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Fortalecer espalda media"
            }
          ]
        },
        {
          "dayNumber": 4,
          "name": "Día 4 - Día de Accesorios",
          "type": "ENTRENAMIENTO",
          "exercises": [
            {
              "name": "Sentadilla búlgara",
              "sets": 3,
              "reps": "8 por pierna",
              "rest": "90s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Corrección de desbalances"
            },
            {
              "name": "Fondos en paralelas",
              "sets": 3,
              "reps": "10",
              "rest": "90s",
              "rir": 1,
              "tempo": "2-0-1",
              "notes": "Desarrollo de tríceps"
            },
            {
              "name": "Dominadas",
              "sets": 3,
              "reps": "8",
              "rest": "90s",
              "rir": 1,
              "tempo": "2-1-1",
              "notes": "Fuerza de tracción vertical"
            },
            {
              "name": "Plancha frontal",
              "sets": 3,
              "reps": "60s",
              "rest": "60s",
              "rir": 0,
              "tempo": "isométrico",
              "notes": "Estabilidad de core"
            }
          ]
        }
      ]
    }
  ]'::jsonb
);

-- ===================================
-- VERIFICACIÓN
-- ===================================

-- Ver todos los productos creados
SELECT id, name, type, price, active, featured
FROM products
ORDER BY created_at DESC;

-- Ver detalles de rutinas
SELECT
  p.name,
  r.gender,
  r.objective,
  r.level,
  r.frequency,
  r.duration_weeks
FROM products p
JOIN routines r ON r.id = p.id
WHERE p.type = 'routine';
