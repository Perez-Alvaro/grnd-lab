-- =====================================================
-- SEED: Rutinas Mock para Testing
-- Fecha: 2025-01-24
-- Descripción: Rutinas completas y realistas para todas las combinaciones
-- =====================================================

-- Limpiar datos anteriores (opcional, comentar si no quieres borrar)
-- DELETE FROM routines;
-- DELETE FROM products WHERE type = 'routine';

-- =====================================================
-- RUTINA 1: Masculino - Volumen (Fuerza e Hipertrofia)
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  -- Insertar producto
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Volumen FST-7 4x/semana',
    'masculino-volumen-fst7-4x',
    'Programa de hipertrofia con técnicas FST-7 para máxima congestión muscular. Enfoque en compound movements y trabajo de volumen controlado.',
    24900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'
  ) RETURNING id INTO product_id;

  -- Insertar rutina
  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'muscle_gain',
    'intermediate',
    4,
    6,
    ARRAY['fst-7', 'hipertrofia', 'volumen', 'compound'],
    '[
      {
        "title": "Semana 1 - Fase de Adaptación",
        "summary": "Introducción al volumen con énfasis en técnica perfecta",
        "notes": "Controlar RIR estrictamente. Priorizar conexión mente-músculo.",
        "days": [
          {
            "name": "Día 1 - Pecho y Tríceps",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press Banca con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "2-3",
                "rest": "2min",
                "tempo": "3-0-1",
                "video": "https://youtube.com/watch?v=example1",
                "note": "Ejercicio principal. Mantener escápulas retraídas."
              },
              {
                "name": "Press Inclinado con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Inclinación 30-45 grados. Full ROM."
              },
              {
                "name": "Aperturas en Polea Alta",
                "sets": "3",
                "reps": "12-15",
                "rir": "1-2",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Squeeze al final del movimiento."
              },
              {
                "name": "Press Francés con Barra Z",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Codos fijos. Evitar hiperextensión."
              },
              {
                "name": "Extensiones de Tríceps en Polea (FST-7)",
                "sets": "7",
                "reps": "12-15",
                "rir": "1",
                "rest": "30-45s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Técnica FST-7. Descansos cortos y control total."
              }
            ]
          },
          {
            "name": "Día 2 - Espalda y Bíceps",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Peso Muerto Convencional",
                "sets": "4",
                "reps": "6-8",
                "rir": "3",
                "rest": "3min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Ejercicio rey. Bracing correcto y espalda neutra."
              },
              {
                "name": "Dominadas Pronas",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Si es necesario usar banda de asistencia."
              },
              {
                "name": "Remo con Barra",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Tronco a 45 grados. Llevar barra al abdomen bajo."
              },
              {
                "name": "Curl con Barra Z",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Sin balanceo. Codos pegados al cuerpo."
              },
              {
                "name": "Curl Martillo con Mancuernas (FST-7)",
                "sets": "7",
                "reps": "12-15",
                "rir": "1",
                "rest": "30-45s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Serie FST-7 para bombeo final."
              }
            ]
          },
          {
            "name": "Día 3 - Descanso Activo",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Pierna Completa",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Sentadilla con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "2-3",
                "rest": "3min",
                "tempo": "3-0-1",
                "video": "",
                "note": "Profundidad completa (ATG si movilidad permite)."
              },
              {
                "name": "Prensa de Pierna 45°",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-2",
                "video": "",
                "note": "Pies ancho de hombros. Rodillas alineadas con pies."
              },
              {
                "name": "Peso Muerto Rumano",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "2min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Énfasis en isquios. Caderas atrás."
              },
              {
                "name": "Curl Femoral Acostado",
                "sets": "3",
                "reps": "12-15",
                "rir": "1-2",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Contraer glúteos para aislar femoral."
              },
              {
                "name": "Extensión de Cuádriceps (FST-7)",
                "sets": "7",
                "reps": "15-20",
                "rir": "1",
                "rest": "30-45s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Serie FST-7. Bombeo intenso."
              }
            ]
          },
          {
            "name": "Día 5 - Hombro y Accesorios",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press Militar con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "2-3",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Core activado. Sin arquear lumbar."
              },
              {
                "name": "Elevaciones Laterales con Mancuernas",
                "sets": "4",
                "reps": "12-15",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Codos ligeramente flexionados. Control en bajada."
              },
              {
                "name": "Pájaros en Peck Deck",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Deltoides posterior. Escápulas retraídas."
              },
              {
                "name": "Elevaciones Frontales Alternas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Sin impulso. Hasta altura de ojos."
              },
              {
                "name": "Elevaciones Laterales en Polea (FST-7)",
                "sets": "7",
                "reps": "15-20",
                "rir": "1",
                "rest": "30-45s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Serie FST-7 final. Congestión máxima."
              }
            ]
          }
        ]
      },
      {
        "title": "Semana 2-4 - Fase de Volumen",
        "summary": "Incremento progresivo de volumen e intensidad",
        "notes": "Agregar 2.5-5kg en ejercicios principales si se cumplió RIR objetivo.",
        "days": []
      },
      {
        "title": "Semana 5-6 - Fase de Consolidación",
        "summary": "Mantener intensidad, optimizar recuperación",
        "notes": "Última fase antes del deload. Escuchar al cuerpo.",
        "days": []
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 2: Femenino - Pérdida de Grasa
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Definición 4x/semana',
    'femenino-definicion-4x',
    'Programa metabólico de fuerza con énfasis en glúteo, pierna y core. Incluye circuitos HIIT y work capacity.',
    21900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'fat_loss',
    'intermediate',
    4,
    8,
    ARRAY['definición', 'glúteo', 'hiit', 'metabolic'],
    '[
      {
        "title": "Semana 1 - Fase de Adaptación Metabólica",
        "summary": "Introducción al trabajo metabólico con fuerza",
        "notes": "Controlar técnica antes que velocidad en HIIT.",
        "days": [
          {
            "name": "Día 1 - Lower Power + HIIT",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Hip Thrust con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-1-1",
                "video": "",
                "note": "Ejercicio principal. Squeeze de 1 seg en contracción."
              },
              {
                "name": "Sentadilla Búlgara",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Cada pierna. Rodilla no debe pasar punta de pie."
              },
              {
                "name": "Peso Muerto Rumano con Mancuernas",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "3-0-2",
                "video": "",
                "note": "Activación de isquios y glúteo."
              },
              {
                "name": "Abducción de Cadera en Máquina",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Glúteo medio. Importante para estabilidad."
              },
              {
                "name": "Finisher HIIT: Bici Assault",
                "sets": "5",
                "reps": "30s ON / 30s OFF",
                "rir": "Max",
                "rest": "30s",
                "tempo": "",
                "video": "",
                "note": "Esfuerzo máximo en los 30s de trabajo."
              }
            ]
          },
          {
            "name": "Día 2 - Upper Strength + Core",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press de Banca con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Rango completo de movimiento."
              },
              {
                "name": "Remo en Polea Baja",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Escápulas retraídas al final."
              },
              {
                "name": "Press Arnold Sentado",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Deltoides anterior y lateral."
              },
              {
                "name": "Plancha Frontal + Lateral (Superset)",
                "sets": "3",
                "reps": "45-60s cada",
                "rir": "Fallo",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Core activado. Sin arquear lumbar."
              },
              {
                "name": "Mountain Climbers",
                "sets": "3",
                "reps": "20-30",
                "rir": "Max",
                "rest": "45s",
                "tempo": "",
                "video": "",
                "note": "Metabolic finisher. Velocidad controlada."
              }
            ]
          },
          {
            "name": "Día 3 - Descanso Activo / Yoga",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Lower Hypertrophy + Metabolic",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Prensa Inclinada 45°",
                "sets": "4",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Pies anchos para activar más glúteo."
              },
              {
                "name": "Step Ups con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cada pierna. Impulso con talón."
              },
              {
                "name": "Good Mornings con Barra",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "3-0-2",
                "video": "",
                "note": "Cadena posterior. Rodillas semiflexionadas."
              },
              {
                "name": "Curl Femoral Acostado",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Isquios. Contraer glúteos."
              },
              {
                "name": "Circuito Metabólico: KB Swings + Burpees",
                "sets": "4",
                "reps": "15 + 10",
                "rir": "Max",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "4 rondas sin pausa entre ejercicios."
              }
            ]
          },
          {
            "name": "Día 5 - Full Body Circuit",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Goblet Squat",
                "sets": "3",
                "reps": "15",
                "rir": "2",
                "rest": "0",
                "tempo": "2-0-2",
                "video": "",
                "note": "Circuito sin descanso entre ejercicios."
              },
              {
                "name": "Push Ups",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "0",
                "tempo": "2-0-1",
                "video": "",
                "note": "Rodillas en piso si es necesario."
              },
              {
                "name": "Walking Lunges",
                "sets": "3",
                "reps": "20",
                "rir": "2",
                "rest": "0",
                "tempo": "1-0-1",
                "video": "",
                "note": "10 cada pierna."
              },
              {
                "name": "Remo Invertido",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-1-1",
                "video": "",
                "note": "Fin de circuito. Descansar 2min y repetir."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 3: Masculino - Resistencia (Potencia Aeróbica)
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Resistencia y Conditioning 5x/semana',
    'masculino-resistencia-5x',
    'Programa de alta frecuencia enfocado en capacidad de trabajo, resistencia muscular y cardiovascular. Ideal para deportes funcionales.',
    23900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'endurance',
    'advanced',
    5,
    4,
    ARRAY['resistencia', 'conditioning', 'crossfit', 'functional'],
    '[
      {
        "title": "Semana 1-2 - Base Aeróbica",
        "summary": "Construcción de capacidad de trabajo",
        "notes": "Mantener FC en zona 2-3. No exceder 80% FCMax.",
        "days": [
          {
            "name": "Día 1 - Strength + Engine Work",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Back Squat",
                "sets": "5",
                "reps": "5",
                "rir": "3",
                "rest": "3min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Fuerza base. 75-80% 1RM."
              },
              {
                "name": "EMOM 15min: 5 Burpees + 10 KBS",
                "sets": "15",
                "reps": "5 + 10",
                "rir": "",
                "rest": "EMOM",
                "tempo": "",
                "video": "",
                "note": "Cada minuto ejecutar 5 burpees + 10 KB swings."
              }
            ]
          },
          {
            "name": "Día 2 - HIIT Metcon",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "AMRAP 20min: 400m Run + 15 Box Jump + 20 Wall Balls",
                "sets": "AMRAP",
                "reps": "Max Rondas",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Tantas rondas como sea posible en 20 minutos."
              }
            ]
          },
          {
            "name": "Día 3 - Active Recovery",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Gymnastics + Monostructural",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Pull Ups",
                "sets": "5",
                "reps": "Max-2",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Repeticiones máximas menos 2."
              },
              {
                "name": "Ring Dips",
                "sets": "5",
                "reps": "Max-2",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Usar banda si es necesario."
              },
              {
                "name": "Assault Bike Intervals",
                "sets": "8",
                "reps": "1min ON / 1min OFF",
                "rir": "Max",
                "rest": "1min",
                "tempo": "",
                "video": "",
                "note": "Esfuerzo 85-90% en cada intervalo."
              }
            ]
          },
          {
            "name": "Día 5 - Long Chipper",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "For Time: 100 DU + 50 T2B + 40 WB + 30 Box + 20 HSPU",
                "sets": "1",
                "reps": "For Time",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Completar lo más rápido posible. Cap: 25min."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 4: Femenino - Recomposición (Fuerza y Movilidad)
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Fuerza y Movilidad 3x/semana',
    'femenino-fuerza-movilidad-3x',
    'Programa de fuerza con énfasis en movimientos funcionales y trabajo de movilidad. Ideal para mejorar composición corporal y calidad de movimiento.',
    19900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'strength',
    'beginner',
    3,
    8,
    ARRAY['fuerza', 'movilidad', 'funcional', 'principiante'],
    '[
      {
        "title": "Semana 1-3 - Fase de Fundamentación",
        "summary": "Aprendizaje de patrones de movimiento",
        "notes": "Priorizar técnica sobre peso. Video recomendado para cada ejercicio.",
        "days": [
          {
            "name": "Día 1 - Lower Push + Movilidad",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Goblet Squat",
                "sets": "4",
                "reps": "10-12",
                "rir": "3",
                "rest": "2min",
                "tempo": "3-1-1",
                "video": "",
                "note": "Aprender patrón de sentadilla. Descenso lento."
              },
              {
                "name": "Hip Thrust con Peso Corporal",
                "sets": "3",
                "reps": "15-20",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-2-1",
                "video": "",
                "note": "Activación de glúteos. Squeeze de 2 seg."
              },
              {
                "name": "Zancadas Estáticas",
                "sets": "3",
                "reps": "10",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Cada pierna. Rodilla a 90 grados."
              },
              {
                "name": "90/90 Hip Stretch",
                "sets": "3",
                "reps": "60s cada lado",
                "rir": "",
                "rest": "30s",
                "tempo": "",
                "video": "",
                "note": "Movilidad de cadera. Respirar profundo."
              }
            ]
          },
          {
            "name": "Día 2 - Upper Pull + Core",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Dominadas Asistidas",
                "sets": "4",
                "reps": "6-8",
                "rir": "3",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Usar banda de asistencia. Objetivo: chin por encima barra."
              },
              {
                "name": "Remo con Mancuernas",
                "sets": "3",
                "reps": "12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Cada brazo. Codo pegado al cuerpo."
              },
              {
                "name": "Face Pulls",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Salud de hombro. Rotación externa."
              },
              {
                "name": "Dead Bug",
                "sets": "3",
                "reps": "10",
                "rir": "2",
                "rest": "60s",
                "tempo": "slow",
                "video": "",
                "note": "Anti-extensión lumbar. Core activado."
              },
              {
                "name": "Bird Dog",
                "sets": "3",
                "reps": "8",
                "rir": "2",
                "rest": "60s",
                "tempo": "slow",
                "video": "",
                "note": "Cada lado. Mantener neutro espinal."
              }
            ]
          },
          {
            "name": "Día 3 - Full Body + Mobility Flow",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Peso Muerto con Kettlebell",
                "sets": "4",
                "reps": "10",
                "rir": "3",
                "rest": "2min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Patrón de bisagra. Caderas atrás."
              },
              {
                "name": "Press de Hombro con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Core estable. Sin arquear espalda."
              },
              {
                "name": "Step Ups",
                "sets": "3",
                "reps": "10",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cada pierna. Impulso con talón."
              },
              {
                "name": "Yoga Flow: Perro-Cobra-Niño",
                "sets": "3",
                "reps": "5 respiraciones cada",
                "rir": "",
                "rest": "0",
                "tempo": "",
                "video": "",
                "note": "Movilidad de columna. Fluir con respiración."
              },
              {
                "name": "World Greatest Stretch",
                "sets": "2",
                "reps": "5 cada lado",
                "rir": "",
                "rest": "30s",
                "tempo": "",
                "video": "",
                "note": "Movilidad multi-planar. Lento y controlado."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 5: Masculino - Fuerza Pura (Powerlifting)
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Powerlifting 4x/semana',
    'masculino-powerlifting-4x',
    'Programa de fuerza máxima centrado en los Big 3: Sentadilla, Press Banca y Peso Muerto. Periodización lineal.',
    26900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'strength',
    'advanced',
    4,
    12,
    ARRAY['powerlifting', 'fuerza', 'big3', 'periodización'],
    '[
      {
        "title": "Semana 1-4 - Fase de Acumulación",
        "summary": "Construcción de base con volumen moderado",
        "notes": "Intensidad 70-80% 1RM. Enfoque en técnica perfecta.",
        "days": [
          {
            "name": "Día 1 - Squat Day",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Back Squat",
                "sets": "5",
                "reps": "5",
                "rir": "2-3",
                "rest": "5min",
                "tempo": "3-0-X",
                "video": "",
                "note": "75% 1RM. Profundidad legal powerlifting."
              },
              {
                "name": "Front Squat",
                "sets": "3",
                "reps": "6-8",
                "rir": "3",
                "rest": "3min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Trabajo accesorio de cuádriceps."
              },
              {
                "name": "Bulgarian Split Squat",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-2",
                "video": "",
                "note": "Unilateral. Corregir desbalances."
              },
              {
                "name": "Leg Curl",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Prevención de lesiones."
              },
              {
                "name": "Abs Wheel Rollout",
                "sets": "3",
                "reps": "10-15",
                "rir": "2",
                "rest": "60s",
                "tempo": "slow",
                "video": "",
                "note": "Core strength para estabilidad."
              }
            ]
          },
          {
            "name": "Día 2 - Bench Day",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Bench Press (Competition Grip)",
                "sets": "5",
                "reps": "5",
                "rir": "2-3",
                "rest": "5min",
                "tempo": "2-1-X",
                "video": "",
                "note": "Pausa en pecho. Técnica de competición."
              },
              {
                "name": "Close Grip Bench Press",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Desarrollo de tríceps."
              },
              {
                "name": "Incline Dumbbell Press",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-2",
                "video": "",
                "note": "Pectoral superior."
              },
              {
                "name": "Dips (Weighted)",
                "sets": "3",
                "reps": "8-12",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Añadir peso si es posible."
              },
              {
                "name": "Triceps Pushdown",
                "sets": "3",
                "reps": "12-15",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Aislamiento de tríceps."
              }
            ]
          },
          {
            "name": "Día 3 - Descanso",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Deadlift Day",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Conventional Deadlift",
                "sets": "5",
                "reps": "5",
                "rir": "2-3",
                "rest": "5min",
                "tempo": "1-0-X",
                "video": "",
                "note": "Setup perfecto. Sin bounce."
              },
              {
                "name": "Romanian Deadlift",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "3min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Desarrollo de isquios."
              },
              {
                "name": "Barbell Row",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-1-1",
                "video": "",
                "note": "Espalda media y baja."
              },
              {
                "name": "Pull Ups (Weighted)",
                "sets": "3",
                "reps": "6-8",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Lat development."
              },
              {
                "name": "Farmer Walks",
                "sets": "3",
                "reps": "40m",
                "rir": "2",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "Grip strength y core."
              }
            ]
          },
          {
            "name": "Día 5 - Upper Accessories",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Overhead Press",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Fuerza de hombros."
              },
              {
                "name": "Cable Rows",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Volumen para espalda."
              },
              {
                "name": "Lateral Raises",
                "sets": "4",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Deltoides laterales."
              },
              {
                "name": "Barbell Curl",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Desarrollo de bíceps."
              },
              {
                "name": "Face Pulls",
                "sets": "3",
                "reps": "20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Salud de hombros."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 6: Femenino - Principiante Total Body
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Principiante 3x/semana',
    'femenino-principiante-3x',
    'Programa completo para comenzar en el gimnasio. Movimientos básicos, énfasis en técnica y construcción de confianza.',
    17900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'muscle_gain',
    'beginner',
    3,
    8,
    ARRAY['principiante', 'fullbody', 'básico', 'técnica'],
    '[
      {
        "title": "Semana 1-4 - Aprendizaje de Movimientos",
        "summary": "Dominar patrones básicos de movimiento",
        "notes": "No hay prisa. Técnica perfecta antes de agregar peso.",
        "days": [
          {
            "name": "Día 1 - Full Body A",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Goblet Squat",
                "sets": "3",
                "reps": "12-15",
                "rir": "3-4",
                "rest": "90s",
                "tempo": "3-1-1",
                "video": "",
                "note": "Aprender patrón de sentadilla."
              },
              {
                "name": "Push Ups (Rodillas)",
                "sets": "3",
                "reps": "8-12",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Progresión hacia push ups completas."
              },
              {
                "name": "Remo con Mancuerna",
                "sets": "3",
                "reps": "12",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Cada brazo. Banco para apoyo."
              },
              {
                "name": "Hip Thrust (Peso Corporal)",
                "sets": "3",
                "reps": "15-20",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-2-1",
                "note": "Activación de glúteos."
              },
              {
                "name": "Plancha",
                "sets": "3",
                "reps": "20-30s",
                "rir": "Fallo",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Línea recta desde cabeza a talones."
              }
            ]
          },
          {
            "name": "Día 2 - Descanso o Caminata",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 3 - Full Body B",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Peso Muerto con Kettlebell",
                "sets": "3",
                "reps": "12-15",
                "rir": "3",
                "rest": "2min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Patrón de bisagra de cadera."
              },
              {
                "name": "Press de Hombro con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Sentada en banco con respaldo."
              },
              {
                "name": "Lat Pulldown",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Progresión hacia dominadas."
              },
              {
                "name": "Zancadas Estáticas",
                "sets": "3",
                "reps": "10",
                "rir": "3",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Cada pierna. Sin peso al inicio."
              },
              {
                "name": "Dead Bug",
                "sets": "3",
                "reps": "10",
                "rir": "2",
                "rest": "60s",
                "tempo": "slow",
                "video": "",
                "note": "Control de core y respiración."
              }
            ]
          },
          {
            "name": "Día 4-5 - Descanso",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 6 - Full Body C",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Step Ups",
                "sets": "3",
                "reps": "10",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cada pierna. Banco o cajón."
              },
              {
                "name": "Press de Banca con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Rango completo."
              },
              {
                "name": "Remo en Polea Baja",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Escápulas retraídas."
              },
              {
                "name": "Glute Bridge",
                "sets": "3",
                "reps": "15-20",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-2-1",
                "video": "",
                "note": "Squeeze en la parte superior."
              },
              {
                "name": "Side Plank",
                "sets": "3",
                "reps": "20s cada lado",
                "rir": "Fallo",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Oblicuos y estabilidad lateral."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 7: Masculino - Principiante Volumen
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Principiante Volumen 3x/semana',
    'masculino-principiante-volumen-3x',
    'Programa de iniciación enfocado en ganancia muscular. Push/Pull/Legs para principiantes con progresión lineal.',
    18900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'muscle_gain',
    'beginner',
    3,
    8,
    ARRAY['principiante', 'ppl', 'volumen', 'mass'],
    '[
      {
        "title": "Semana 1-8 - Construcción de Base",
        "summary": "Aprende los fundamentals y construye músculo",
        "notes": "Incrementar peso cada semana si se cumple objetivo de reps.",
        "days": [
          {
            "name": "Día 1 - Push (Pecho, Hombro, Tríceps)",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press Banca con Barra",
                "sets": "3",
                "reps": "8-10",
                "rir": "3",
                "rest": "2min",
                "tempo": "3-0-1",
                "video": "",
                "note": "Ejercicio principal. Empezar ligero."
              },
              {
                "name": "Press Inclinado con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Pecho superior."
              },
              {
                "name": "Press Militar con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Sentado con respaldo."
              },
              {
                "name": "Extensiones de Tríceps en Polea",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Codos fijos."
              }
            ]
          },
          {
            "name": "Día 2 - Descanso",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 3 - Pull (Espalda, Bíceps)",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Peso Muerto Convencional",
                "sets": "3",
                "reps": "6-8",
                "rir": "3",
                "rest": "3min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Técnica perfecta. Empezar liviano."
              },
              {
                "name": "Lat Pulldown",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Agarre amplio."
              },
              {
                "name": "Remo con Barra",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-1-1",
                "video": "",
                "note": "Tronco a 45 grados."
              },
              {
                "name": "Curl con Barra",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Sin balanceo."
              },
              {
                "name": "Curl Martillo",
                "sets": "3",
                "reps": "12-15",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Braquial y braquiorradial."
              }
            ]
          },
          {
            "name": "Día 4-5 - Descanso",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 6 - Legs (Pierna Completa)",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Sentadilla con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "3",
                "rest": "3min",
                "tempo": "3-0-1",
                "video": "",
                "note": "Rey de ejercicios. Profundidad máxima."
              },
              {
                "name": "Prensa de Pierna",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-2",
                "video": "",
                "note": "Pies ancho de hombros."
              },
              {
                "name": "Curl Femoral",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Isquiotibiales."
              },
              {
                "name": "Extensión de Cuádriceps",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Squeeze en contracción."
              },
              {
                "name": "Elevación de Talones",
                "sets": "4",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-2-1",
                "video": "",
                "note": "Gemelos. Rango completo."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 8: Femenino - Avanzado Glúteo Focus
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Glúteo Avanzado 5x/semana',
    'femenino-gluteo-avanzado-5x',
    'Programa especializado en desarrollo de glúteo con alta frecuencia. Incluye hip thrust, RDL y accesorios específicos.',
    27900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'muscle_gain',
    'advanced',
    5,
    8,
    ARRAY['glúteo', 'hipertrofia', 'lower', 'especializado'],
    '[
      {
        "title": "Semana 1-4 - Fase de Volumen",
        "summary": "Máximo volumen para glúteo e isquios",
        "notes": "5 días de entrenamiento. Prioridad en lower body.",
        "days": [
          {
            "name": "Día 1 - Lower Power (Glúteo Heavy)",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Hip Thrust con Barra (Heavy)",
                "sets": "5",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-2-1",
                "video": "",
                "note": "Trabajo pesado. Squeeze máximo."
              },
              {
                "name": "Sentadilla Sumo",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "3-0-1",
                "video": "",
                "note": "Stance amplio para glúteo."
              },
              {
                "name": "Single Leg Hip Thrust",
                "sets": "3",
                "reps": "10",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Cada pierna. Corrección de asimetrías."
              },
              {
                "name": "Cable Pull Through",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Activación posterior."
              }
            ]
          },
          {
            "name": "Día 2 - Upper + Core",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press Banca con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Mantener tren superior."
              },
              {
                "name": "Remo en Máquina",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Espalda media."
              },
              {
                "name": "Elevaciones Laterales",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Hombros."
              },
              {
                "name": "Pallof Press",
                "sets": "3",
                "reps": "12",
                "rir": "2",
                "rest": "60s",
                "tempo": "slow",
                "video": "",
                "note": "Anti-rotación core."
              }
            ]
          },
          {
            "name": "Día 3 - Lower Hypertrophy (Volumen)",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Sentadilla Búlgara con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "3-0-1",
                "video": "",
                "note": "Cada pierna. Déficit para mayor rango."
              },
              {
                "name": "RDL con Barra",
                "sets": "4",
                "reps": "10-12",
                "rir": "2",
                "rest": "2min",
                "tempo": "3-1-2",
                "video": "",
                "note": "Estiramiento máximo de isquios."
              },
              {
                "name": "Hip Thrust con Banda (Pump)",
                "sets": "3",
                "reps": "20-25",
                "rir": "1",
                "rest": "90s",
                "tempo": "1-2-1",
                "video": "",
                "note": "Trabajo de bombeo con banda."
              },
              {
                "name": "Abductor Machine",
                "sets": "4",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-2-2",
                "video": "",
                "note": "Glúteo medio. Pausa en contracción."
              },
              {
                "name": "Adductor Machine",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Aductores. Balance muscular."
              }
            ]
          },
          {
            "name": "Día 4 - Descanso Activo",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 5 - Lower Posterior Chain",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Peso Muerto Rumano (Heavy)",
                "sets": "5",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "3-1-2",
                "video": "",
                "note": "Cadena posterior. Trabajo pesado."
              },
              {
                "name": "Back Extension a 45° (Weighted)",
                "sets": "4",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Glúteos e isquios. Disco en pecho."
              },
              {
                "name": "Nordic Hamstring Curl",
                "sets": "3",
                "reps": "6-8",
                "rir": "Fallo",
                "rest": "2min",
                "tempo": "3-0-X",
                "video": "",
                "note": "Excéntrico de isquios. Asistir si necesario."
              },
              {
                "name": "Kickbacks en Polea",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-2-1",
                "video": "",
                "note": "Cada pierna. Aislamiento de glúteo."
              }
            ]
          },
          {
            "name": "Día 6 - Upper Pump + Abs",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Push Ups",
                "sets": "3",
                "reps": "Max",
                "rir": "Fallo",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Trabajo de empuje."
              },
              {
                "name": "Lat Pulldown",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Dorsales."
              },
              {
                "name": "Face Pulls",
                "sets": "3",
                "reps": "20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Deltoides posterior."
              },
              {
                "name": "Hanging Leg Raises",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "60s",
                "tempo": "1-0-2",
                "video": "",
                "note": "Abdomen bajo."
              },
              {
                "name": "Russian Twists",
                "sets": "3",
                "reps": "30",
                "rir": "1",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Oblicuos."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 9: Masculino - Intermedio Pérdida Grasa
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Definición 5x/semana',
    'masculino-definicion-5x',
    'Programa de cutting con alta frecuencia. Combina fuerza con trabajo metabólico para maximizar pérdida de grasa manteniendo masa.',
    24900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'fat_loss',
    'intermediate',
    5,
    8,
    ARRAY['cutting', 'definición', 'metabólico', 'hiit'],
    '[
      {
        "title": "Semana 1-8 - Fase de Definición",
        "summary": "Máxima quema de grasa preservando músculo",
        "notes": "Mantener proteína alta. Déficit calórico moderado.",
        "days": [
          {
            "name": "Día 1 - Upper Power + Finisher",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press Banca",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Mantener fuerza en déficit."
              },
              {
                "name": "Remo con Barra",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-1-1",
                "video": "",
                "note": "Fuerza de tracción."
              },
              {
                "name": "Press Militar",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Hombros."
              },
              {
                "name": "Dominadas",
                "sets": "3",
                "reps": "Max",
                "rir": "Fallo",
                "rest": "90s",
                "tempo": "2-0-X",
                "video": "",
                "note": "Al fallo técnico."
              },
              {
                "name": "HIIT Finisher: Remo + Burpees",
                "sets": "5",
                "reps": "20 cal + 10 burpees",
                "rir": "Max",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "5 rondas. Máximo esfuerzo."
              }
            ]
          },
          {
            "name": "Día 2 - Lower Power + Metcon",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Sentadilla",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "3-0-1",
                "video": "",
                "note": "Preservar fuerza."
              },
              {
                "name": "Peso Muerto Rumano",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Cadena posterior."
              },
              {
                "name": "Sentadilla Búlgara",
                "sets": "3",
                "reps": "10",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cada pierna."
              },
              {
                "name": "Metcon: KB Swings + Jump Rope",
                "sets": "4",
                "reps": "20 swings + 50 saltos",
                "rir": "Max",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Circuito metabólico."
              }
            ]
          },
          {
            "name": "Día 3 - HIIT Cardio",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Bike Sprints",
                "sets": "10",
                "reps": "30s ON / 90s OFF",
                "rir": "Max",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "Sprint máximo 30 segundos."
              },
              {
                "name": "Core Circuit: Plank + Crunch + Bicycle",
                "sets": "3",
                "reps": "30s cada",
                "rir": "Max",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Sin descanso entre ejercicios."
              }
            ]
          },
          {
            "name": "Día 4 - Upper Hypertrophy + EMOM",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Press Inclinado",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Volumen moderado."
              },
              {
                "name": "Remo en Polea",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Espalda media."
              },
              {
                "name": "Elevaciones Laterales",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Pump hombros."
              },
              {
                "name": "Curl + Tríceps (Superset)",
                "sets": "3",
                "reps": "12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Sin descanso entre ejercicios."
              },
              {
                "name": "EMOM 12min: 10 Push Ups + 10 Remo Invertido",
                "sets": "12",
                "reps": "10+10",
                "rir": "Max",
                "rest": "EMOM",
                "tempo": "",
                "video": "",
                "note": "Cada minuto."
              }
            ]
          },
          {
            "name": "Día 5 - Lower + Full Body Circuit",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Front Squat",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cuádriceps."
              },
              {
                "name": "Peso Muerto",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-2",
                "video": "",
                "note": "Cadena posterior."
              },
              {
                "name": "Circuito: WB + Box + Burpees + DU",
                "sets": "4",
                "reps": "15+15+10+30",
                "rir": "Max",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Wall balls, box jumps, burpees, double unders."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 10: Masculino - Avanzado Resistencia CrossFit
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino CrossFit 6x/semana',
    'masculino-crossfit-6x',
    'Programa avanzado de CrossFit con periodización. Incluye gymnastics, weightlifting y metcons variados.',
    29900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'endurance',
    'advanced',
    6,
    8,
    ARRAY['crossfit', 'competición', 'gymnastics', 'weightlifting'],
    '[
      {
        "title": "Semana 1-4 - Base Building",
        "summary": "Construcción de capacidad aeróbica y fuerza",
        "notes": "Volumen alto. Técnica perfecta en todos los movimientos.",
        "days": [
          {
            "name": "Día 1 - Heavy Day",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Clean & Jerk (Heavy Single)",
                "sets": "1",
                "reps": "1 (work up to 85%)",
                "rir": "N/A",
                "rest": "3-5min",
                "tempo": "",
                "video": "",
                "note": "Trabajo hasta single pesado."
              },
              {
                "name": "Front Squat",
                "sets": "5",
                "reps": "3",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-0-X",
                "video": "",
                "note": "80-85% 1RM."
              },
              {
                "name": "MetCon: AMRAP 12min",
                "sets": "AMRAP",
                "reps": "9 T2B + 15 WB + 200m Run",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Tantas rondas como sea posible."
              }
            ]
          },
          {
            "name": "Día 2 - Engine Work",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Snatch (Technique)",
                "sets": "Every 90s x 10",
                "reps": "1 rep @ 70%",
                "rir": "N/A",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "Trabajo técnico."
              },
              {
                "name": "MetCon: 3 Rounds For Time",
                "sets": "3",
                "reps": "400m Run + 30 KBS + 20 Box",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Cap: 18 minutos."
              },
              {
                "name": "Accessory: Strict HSPU",
                "sets": "5",
                "reps": "Max-2",
                "rir": "2",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Trabajo de empuje vertical."
              }
            ]
          },
          {
            "name": "Día 3 - Active Recovery / Swim",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Gymnastics Focus",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Muscle Ups",
                "sets": "EMOM 10min",
                "reps": "2-3 reps",
                "rir": "2-3",
                "rest": "EMOM",
                "tempo": "",
                "video": "",
                "note": "Cada minuto. Técnica perfecta."
              },
              {
                "name": "Chest to Bar Pull Ups",
                "sets": "5",
                "reps": "Max-2",
                "rir": "2",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Kipping permitido."
              },
              {
                "name": "Handstand Walk Practice",
                "sets": "10min",
                "reps": "EMOM 10m walk",
                "rir": "N/A",
                "rest": "EMOM",
                "tempo": "",
                "video": "",
                "note": "Práctica de habilidad."
              },
              {
                "name": "MetCon: For Time",
                "sets": "1",
                "reps": "21-15-9: Thrusters + Bar Facing Burpees",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Clásico Fran variation. Cap: 12min."
              }
            ]
          },
          {
            "name": "Día 5 - Stamina Day",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Deadlift",
                "sets": "5",
                "reps": "5",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-0-X",
                "video": "",
                "note": "75-80% 1RM."
              },
              {
                "name": "MetCon: EMOM 20min",
                "sets": "20",
                "reps": "Min 1: 15 cal Row, Min 2: 10 T2B, Min 3: 8 Cleans, Min 4: Rest",
                "rir": "Max",
                "rest": "Every 4th min",
                "tempo": "",
                "video": "",
                "note": "Rotación de 4 estaciones cada 20min."
              }
            ]
          },
          {
            "name": "Día 6 - Long Chipper / Partner WOD",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "For Time (solo o con partner)",
                "sets": "1",
                "reps": "100 DU + 80 WB + 60 C2B + 40 S2OH + 20 MU",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Long chipper. Cap: 35 minutos. Escalar según nivel."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 11: Femenino - Intermedio Tonificación
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Tonificación 4x/semana',
    'femenino-tonificacion-4x',
    'Programa balanceado para tonificar y definir. Combina fuerza con circuitos metabólicos para esculpir el cuerpo.',
    22900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'fat_loss',
    'intermediate',
    4,
    8,
    ARRAY['tonificación', 'definición', 'circuitos', 'femenino'],
    '[
      {
        "title": "Semana 1-8 - Recomposición y Definición",
        "summary": "Construye músculo mientras pierdes grasa",
        "notes": "Nutrición clave. Proteína 1.8g/kg peso corporal.",
        "days": [
          {
            "name": "Día 1 - Lower Strength + HIIT",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Hip Thrust con Barra",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-2-1",
                "video": "",
                "note": "Ejercicio principal de glúteo."
              },
              {
                "name": "Goblet Squat",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "3-0-1",
                "video": "",
                "note": "Control en descenso."
              },
              {
                "name": "Peso Muerto Rumano",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "3-0-2",
                "video": "",
                "note": "Isquios y glúteo."
              },
              {
                "name": "Walking Lunges",
                "sets": "3",
                "reps": "20 (10c/u)",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Con mancuernas."
              },
              {
                "name": "HIIT: Bike Intervals",
                "sets": "6",
                "reps": "30s ON / 60s OFF",
                "rir": "Max",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Esfuerzo máximo en intervalos."
              }
            ]
          },
          {
            "name": "Día 2 - Upper + Core Circuit",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Push Ups (Elevadas si necesario)",
                "sets": "4",
                "reps": "10-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Empuje horizontal."
              },
              {
                "name": "Lat Pulldown",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Espalda."
              },
              {
                "name": "Press de Hombro con Mancuernas",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Deltoides."
              },
              {
                "name": "Remo con Mancuernas",
                "sets": "3",
                "reps": "12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Cada brazo."
              },
              {
                "name": "Core Circuit: Plank + Bicycle + Leg Raise",
                "sets": "3",
                "reps": "30s + 20 + 12",
                "rir": "Max",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "Sin descanso entre ejercicios del circuito."
              }
            ]
          },
          {
            "name": "Día 3 - Descanso / Yoga",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Full Body Circuit",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Circuito 1: Squat + Push Up + Plank",
                "sets": "4",
                "reps": "15 + 12 + 30s",
                "rir": "Max",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Sin descanso dentro del circuito."
              },
              {
                "name": "Circuito 2: Deadlift + Row + Bicycle",
                "sets": "4",
                "reps": "12 + 12 + 20",
                "rir": "Max",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Sin descanso dentro del circuito."
              },
              {
                "name": "Finisher: Burpees",
                "sets": "3",
                "reps": "10",
                "rir": "Max",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Explosividad."
              }
            ]
          },
          {
            "name": "Día 5 - Lower Pump + Abs",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Sentadilla Sumo",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Alto reps para bombeo."
              },
              {
                "name": "Step Ups con Mancuernas",
                "sets": "3",
                "reps": "12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cada pierna."
              },
              {
                "name": "Curl Femoral",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-2-2",
                "video": "",
                "note": "Tempo lento para congestión."
              },
              {
                "name": "Abductor + Adductor (Superset)",
                "sets": "3",
                "reps": "20 cada",
                "rir": "1",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Sin descanso entre máquinas."
              },
              {
                "name": "Abs Superset: Crunch + Plank",
                "sets": "4",
                "reps": "20 + 45s",
                "rir": "Max",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Finisher de abdomen."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 12: Masculino - Principiante Fuerza
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Fuerza Principiante 3x/semana',
    'masculino-fuerza-principiante-3x',
    'Programa Starting Strength modificado. Énfasis en los compound lifts con progresión lineal simple.',
    16900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1574680088814-a4c066c8d7c8?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'strength',
    'beginner',
    3,
    12,
    ARRAY['fuerza', 'principiante', 'compounds', 'lineal'],
    '[
      {
        "title": "Semana 1-12 - Progresión Lineal",
        "summary": "Aprende los lifts fundamentales y gana fuerza",
        "notes": "Incrementar 2.5-5kg cada sesión si se completan todas las reps.",
        "days": [
          {
            "name": "Día A - Squat, Bench, Deadlift",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Back Squat",
                "sets": "3",
                "reps": "5",
                "rir": "3",
                "rest": "3min",
                "tempo": "3-0-X",
                "video": "",
                "note": "Ejercicio principal. Empezar con barra sola."
              },
              {
                "name": "Bench Press",
                "sets": "3",
                "reps": "5",
                "rir": "3",
                "rest": "3min",
                "tempo": "2-1-X",
                "video": "",
                "note": "Pausa en pecho."
              },
              {
                "name": "Deadlift",
                "sets": "1",
                "reps": "5",
                "rir": "3",
                "rest": "N/A",
                "tempo": "1-0-X",
                "video": "",
                "note": "Solo 1 set de trabajo. Reset cada rep."
              },
              {
                "name": "Plancha",
                "sets": "3",
                "reps": "45s",
                "rir": "Fallo",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Core stability."
              }
            ]
          },
          {
            "name": "Día B - Squat, Press, Power Clean",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Back Squat",
                "sets": "3",
                "reps": "5",
                "rir": "3",
                "rest": "3min",
                "tempo": "3-0-X",
                "video": "",
                "note": "Mismo que día A pero con progresión."
              },
              {
                "name": "Overhead Press",
                "sets": "3",
                "reps": "5",
                "rir": "3",
                "rest": "3min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Press de hombro estricto."
              },
              {
                "name": "Power Clean (Technique)",
                "sets": "5",
                "reps": "3",
                "rir": "N/A",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Trabajo técnico. Peso ligero."
              },
              {
                "name": "Pull Ups o Lat Pulldown",
                "sets": "3",
                "reps": "Max o 10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Asistidas si es necesario."
              }
            ]
          },
          {
            "name": "Día C - Descanso",
            "type": "DESCANSO",
            "exercises": []
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 13: Femenino - Avanzado Resistencia
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Resistencia Avanzada 5x/semana',
    'femenino-resistencia-avanzada-5x',
    'Programa de alta capacidad de trabajo. Combina fuerza gimnástica con metcons intensos. Para atletas funcionales.',
    26900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'endurance',
    'advanced',
    5,
    8,
    ARRAY['resistencia', 'conditioning', 'metcon', 'gymnastics'],
    '[
      {
        "title": "Semana 1-8 - Work Capacity",
        "summary": "Máxima capacidad aeróbica y anaeróbica",
        "notes": "Alta frecuencia. Priorizar recuperación y sueño.",
        "days": [
          {
            "name": "Día 1 - Lower Strength + Metcon",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Back Squat",
                "sets": "5",
                "reps": "5",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Fuerza base."
              },
              {
                "name": "MetCon: AMRAP 15min",
                "sets": "AMRAP",
                "reps": "10 Box + 15 KBS + 20 DU",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Tantas rondas como sea posible."
              }
            ]
          },
          {
            "name": "Día 2 - Gymnastics + Engine",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Pull Ups",
                "sets": "5",
                "reps": "Max-1",
                "rir": "1",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Kipping permitido."
              },
              {
                "name": "Handstand Push Ups",
                "sets": "5",
                "reps": "Max-2",
                "rir": "2",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Escalar con pike push ups."
              },
              {
                "name": "Rowing Intervals",
                "sets": "8",
                "reps": "500m",
                "rir": "Max",
                "rest": "90s",
                "tempo": "",
                "video": "",
                "note": "Mantener pace consistente."
              }
            ]
          },
          {
            "name": "Día 3 - Active Recovery",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Heavy Day + Short Metcon",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Deadlift",
                "sets": "5",
                "reps": "3",
                "rir": "2",
                "rest": "3min",
                "tempo": "1-0-X",
                "video": "",
                "note": "Trabajo pesado."
              },
              {
                "name": "Shoulder Press",
                "sets": "5",
                "reps": "5",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Fuerza de press."
              },
              {
                "name": "MetCon: 5 RFT",
                "sets": "5",
                "reps": "10 Thrusters + 15 T2B",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "5 rounds for time. Cap: 15min."
              }
            ]
          },
          {
            "name": "Día 5 - Long Chipper",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "For Time",
                "sets": "1",
                "reps": "50-40-30-20-10: WB + Box + C2B + SDHP + Burpees",
                "rir": "Max",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Chipper largo. Cap: 30min."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 14: Masculino - Intermedio Upper/Lower
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Masculino Upper/Lower 4x/semana',
    'masculino-upper-lower-4x',
    'Split clásico Upper/Lower para desarrollo muscular balanceado. Ideal para intermedios buscando hipertrofia.',
    23900.00,
    true,
    false,
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'male',
    'muscle_gain',
    'intermediate',
    4,
    8,
    ARRAY['upper-lower', 'hipertrofia', 'volumen', 'split'],
    '[
      {
        "title": "Semana 1-8 - Hipertrofia Balanceada",
        "summary": "Desarrollo muscular completo con split Upper/Lower",
        "notes": "2 días upper, 2 días lower por semana.",
        "days": [
          {
            "name": "Día 1 - Upper Power",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Bench Press",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "3-0-X",
                "video": "",
                "note": "Fuerza en empuje horizontal."
              },
              {
                "name": "Barbell Row",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "2-1-1",
                "video": "",
                "note": "Fuerza en tracción."
              },
              {
                "name": "Overhead Press",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Press vertical."
              },
              {
                "name": "Pull Ups (Weighted)",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-X",
                "video": "",
                "note": "Añadir peso si es posible."
              },
              {
                "name": "Dips",
                "sets": "3",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Tríceps y pecho."
              }
            ]
          },
          {
            "name": "Día 2 - Lower Power",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Back Squat",
                "sets": "4",
                "reps": "6-8",
                "rir": "2",
                "rest": "3min",
                "tempo": "3-0-X",
                "video": "",
                "note": "Movimiento rey."
              },
              {
                "name": "Romanian Deadlift",
                "sets": "4",
                "reps": "8-10",
                "rir": "2",
                "rest": "3min",
                "tempo": "3-0-2",
                "video": "",
                "note": "Cadena posterior."
              },
              {
                "name": "Front Squat",
                "sets": "3",
                "reps": "8-10",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-1",
                "video": "",
                "note": "Cuádriceps."
              },
              {
                "name": "Leg Curl",
                "sets": "3",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Isquios."
              },
              {
                "name": "Calf Raises",
                "sets": "4",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-2-1",
                "video": "",
                "note": "Gemelos."
              }
            ]
          },
          {
            "name": "Día 3 - Descanso",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 4 - Upper Hypertrophy",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Incline Dumbbell Press",
                "sets": "4",
                "reps": "10-12",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Pecho superior."
              },
              {
                "name": "Cable Row",
                "sets": "4",
                "reps": "12-15",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Espalda media."
              },
              {
                "name": "Lateral Raises",
                "sets": "4",
                "reps": "15-20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Deltoides laterales."
              },
              {
                "name": "Face Pulls",
                "sets": "3",
                "reps": "20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Deltoides posterior."
              },
              {
                "name": "Barbell Curl",
                "sets": "3",
                "reps": "12-15",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Bíceps."
              },
              {
                "name": "Triceps Overhead Extension",
                "sets": "3",
                "reps": "12-15",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Tríceps."
              }
            ]
          },
          {
            "name": "Día 5 - Lower Hypertrophy",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Leg Press",
                "sets": "4",
                "reps": "12-15",
                "rir": "2",
                "rest": "2min",
                "tempo": "2-0-2",
                "video": "",
                "note": "Cuádriceps y glúteos."
              },
              {
                "name": "Walking Lunges",
                "sets": "3",
                "reps": "12 c/u",
                "rir": "2",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Con mancuernas."
              },
              {
                "name": "Leg Extension",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Cuádriceps aislado."
              },
              {
                "name": "Leg Curl",
                "sets": "3",
                "reps": "15-20",
                "rir": "1",
                "rest": "90s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Isquios."
              },
              {
                "name": "Seated Calf Raises",
                "sets": "4",
                "reps": "20",
                "rir": "1",
                "rest": "60s",
                "tempo": "2-2-1",
                "video": "",
                "note": "Sóleo."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- RUTINA 15: Femenino - Principiante Pérdida de Grasa
-- =====================================================
DO $$
DECLARE
  product_id UUID;
BEGIN
  INSERT INTO products (type, name, slug, description, price, active, featured, image_url)
  VALUES (
    'routine',
    'Femenino Pérdida de Grasa Principiante 3x/semana',
    'femenino-perdida-grasa-principiante-3x',
    'Programa suave de introducción a fitness. Combina fuerza básica con cardio moderado. Ideal para comenzar.',
    18900.00,
    true,
    true,
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'
  ) RETURNING id INTO product_id;

  INSERT INTO routines (id, gender, objective, level, frequency, duration_weeks, tags, weeks)
  VALUES (
    product_id,
    'female',
    'fat_loss',
    'beginner',
    3,
    8,
    ARRAY['principiante', 'pérdida-grasa', 'cardio', 'básico'],
    '[
      {
        "title": "Semana 1-8 - Introducción al Fitness",
        "summary": "Aprende movimientos básicos y quema calorías",
        "notes": "Progresión lenta. Escuchar al cuerpo. Hidratación clave.",
        "days": [
          {
            "name": "Día 1 - Full Body + Cardio Ligero",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Sentadilla con Peso Corporal",
                "sets": "3",
                "reps": "15",
                "rir": "3-4",
                "rest": "90s",
                "tempo": "3-0-1",
                "video": "",
                "note": "Aprender patrón de movimiento."
              },
              {
                "name": "Push Ups en Rodillas",
                "sets": "3",
                "reps": "10",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-0-1",
                "video": "",
                "note": "Control en descenso."
              },
              {
                "name": "Peso Muerto con Mancuernas Ligeras",
                "sets": "3",
                "reps": "12",
                "rir": "3",
                "rest": "90s",
                "tempo": "3-0-2",
                "video": "",
                "note": "Bisagra de cadera."
              },
              {
                "name": "Plancha",
                "sets": "3",
                "reps": "20-30s",
                "rir": "Fallo",
                "rest": "60s",
                "tempo": "",
                "video": "",
                "note": "Core estable."
              },
              {
                "name": "Caminata en Cinta",
                "sets": "1",
                "reps": "15-20min",
                "rir": "Moderado",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Inclinación 5-10%. Pace conversacional."
              }
            ]
          },
          {
            "name": "Día 2 - Descanso o Caminata",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 3 - Circuit Training",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Circuito 1: Goblet Squat + Step Ups + Glute Bridge",
                "sets": "3",
                "reps": "12 + 10c/u + 15",
                "rir": "Moderado",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Sin descanso dentro del circuito."
              },
              {
                "name": "Circuito 2: Lat Pulldown + Press Hombro + Plank",
                "sets": "3",
                "reps": "12 + 12 + 30s",
                "rir": "Moderado",
                "rest": "2min",
                "tempo": "",
                "video": "",
                "note": "Sin descanso dentro del circuito."
              },
              {
                "name": "Bicicleta Estática",
                "sets": "1",
                "reps": "10min",
                "rir": "Ligero",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Cool down."
              }
            ]
          },
          {
            "name": "Día 4-5 - Descanso",
            "type": "DESCANSO",
            "exercises": []
          },
          {
            "name": "Día 6 - Full Body + LISS",
            "type": "ENTRENAMIENTO",
            "exercises": [
              {
                "name": "Zancadas Estáticas",
                "sets": "3",
                "reps": "10 c/u",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-0-2",
                "video": "",
                "note": "Sin peso al inicio."
              },
              {
                "name": "Remo con Banda o Mancuerna",
                "sets": "3",
                "reps": "12 c/u",
                "rir": "3",
                "rest": "90s",
                "tempo": "2-1-1",
                "video": "",
                "note": "Cada brazo."
              },
              {
                "name": "Elevaciones Laterales Ligeras",
                "sets": "3",
                "reps": "15",
                "rir": "2",
                "rest": "60s",
                "tempo": "2-1-2",
                "video": "",
                "note": "Hombros."
              },
              {
                "name": "Bird Dog",
                "sets": "3",
                "reps": "10 c/u",
                "rir": "2",
                "rest": "60s",
                "tempo": "slow",
                "video": "",
                "note": "Core y estabilidad."
              },
              {
                "name": "LISS Cardio: Elíptica o Bici",
                "sets": "1",
                "reps": "20min",
                "rir": "Ligero",
                "rest": "N/A",
                "tempo": "",
                "video": "",
                "note": "Ritmo cardíaco constante. Zona 2."
              }
            ]
          }
        ]
      }
    ]'::jsonb
  );
END $$;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT
  p.name,
  r.gender,
  r.objective,
  r.level,
  r.frequency,
  r.duration_weeks,
  array_length(r.tags, 1) as num_tags,
  jsonb_array_length(r.weeks) as num_weeks
FROM products p
JOIN routines r ON p.id = r.id
WHERE p.type = 'routine'
ORDER BY p.created_at DESC
LIMIT 20;
