const fs = require('fs');

function ex(ejercicio, series, reps, descanso, cadencia, rir, notas, videoUrl = '') {
  return {
    ejercicio,
    variantes: [{ series, reps, descanso, cadencia, rir, notas, videoUrl }],
    notes: ''
  };
}

function day(title, items, blockTitle = 'Entrenamiento') {
  return { title, bloques: [{ titulo: blockTitle, items }] };
}

function multiDay(title, blocks) {
  return { title, bloques: blocks };
}

function program(gender, objective, frequency, days) {
  return {
    id: `${gender}-${objective}-${frequency}`,
    gender,
    objective,
    frequency,
    name: `${objective} ${frequency}d`,
    tags: [],
    days
  };
}

function makeProgramsForGender(gender) {
  const data = {};

  // Hypertrophy programs
  data.hypertrophy = {
    3: program(gender, 'hypertrophy', 3, [
      day('Día 1', [
        ex('Sentadilla con barra', 4, '8-10', '90s', '2-0-2', 2, 'Mantener columna neutra'),
        ex('Press banca', 4, '8-10', '90s', '2-0-2', 2, 'Ritmo controlado'),
        ex('Remo con barra', 3, '8-12', '90s', '2-0-2', 2, 'Codos cerca del cuerpo'),
        ex('Estocadas con mancuernas', 3, '10-12', '60s', '2-0-2', 1, 'Paso largo y estable'),
        ex('Plancha', 3, '30s', '45s', 'isometría', 2, 'Core firme')
      ]),
      day('Día 2', [
        ex('Peso muerto rumano', 4, '8-10', '90s', '2-0-2', 2, 'Caderas atrás'),
        ex('Press militar', 4, '8-10', '90s', '2-0-2', 2, 'Bloquear sin hiperextender'),
        ex('Dominadas asistidas', 3, '8-12', '90s', '2-0-2', 1, 'Depresión escapular'),
        ex('Fondos en paralelas', 3, '10-12', '60s', '2-0-2', 1, 'Rango completo'),
        ex('Pallof press', 3, '12', '45s', '2-0-2', 1, 'No rotar el tronco')
      ]),
      day('Día 3', [
        ex('Sentadilla frontal', 4, '8-10', '90s', '2-0-2', 2, 'Mantener torso vertical'),
        ex('Press banca inclinado con mancuernas', 4, '8-10', '90s', '2-0-2', 2, 'Controlar descenso'),
        ex('Jalón al pecho', 3, '8-12', '90s', '2-0-2', 2, 'Tirar con dorsales'),
        ex('Hip thrust', 3, '10-12', '60s', '2-0-2', 1, 'Extensión completa'),
        ex('Elevaciones laterales', 3, '12-15', '45s', '2-0-2', 1, 'Hombros abajo')
      ])
    ]),
    4: program(gender, 'hypertrophy', 4, [
      day('Día 1 - Torso', [
        ex('Press banca', 4, '6-8', '120s', '2-0-2', 2, 'Progresar carga'),
        ex('Remo con barra', 4, '8-10', '90s', '2-0-2', 2, 'Evitar balanceo'),
        ex('Press inclinado con mancuernas', 3, '10-12', '90s', '2-0-2', 2, 'Controlar tempo'),
        ex('Jalón al pecho', 3, '10-12', '90s', '2-0-2', 2, 'Tirar con dorsales'),
        ex('Face pulls', 3, '12-15', '60s', '2-0-2', 1, 'Enfocar escápulas')
      ]),
      day('Día 2 - Pierna', [
        ex('Sentadilla con barra', 4, '6-8', '120s', '2-0-2', 2, 'Profundidad adecuada'),
        ex('Peso muerto rumano', 3, '8-10', '90s', '2-0-2', 2, 'Caderas atrás'),
        ex('Prensa de piernas', 3, '10-12', '90s', '2-0-2', 2, 'Empujar con talones'),
        ex('Elevaciones de talón', 3, '12-15', '45s', '2-0-2', 1, 'Pausar arriba'),
        ex('Plancha lateral', 3, '30s', '30s', 'isometría', 2, 'Cadera alta')
      ]),
      day('Día 3 - Torso', [
        ex('Press militar', 3, '8-10', '90s', '2-0-2', 2, 'No arquear la espalda'),
        ex('Dominadas asistidas', 3, '8-10', '90s', '2-0-2', 1, 'Pecho hacia la barra'),
        ex('Press banca con agarre cerrado', 3, '10-12', '90s', '2-0-2', 2, 'Controlar codos'),
        ex('Remo en máquina', 3, '10-12', '90s', '2-0-2', 2, 'Escápulas juntas'),
        ex('Elevaciones laterales', 3, '15', '45s', '2-0-2', 1, 'No subir hombros')
      ]),
      day('Día 4 - Pierna', [
        ex('Peso muerto', 3, '6-8', '120s', '2-0-2', 2, 'Espalda recta'),
        ex('Zancadas caminando', 3, '10-12', '90s', '2-0-2', 1, 'Paso largo'),
        ex('Curl femoral', 3, '10-12', '90s', '2-0-2', 2, 'No arquear la espalda'),
        ex('Hip thrust', 3, '12', '90s', '2-0-2', 1, 'Pausar arriba'),
        ex('Crunch colgado', 3, '15', '45s', '2-0-2', 1, 'Controlar movimiento')
      ])
    ]),
    5: program(gender, 'hypertrophy', 5, [
      day('Día 1 - Push', [
        ex('Press banca', 4, '6-8', '120s', '2-0-2', 2, 'Progresar carga'),
        ex('Press militar', 3, '8-10', '90s', '2-0-2', 2, 'Bloquear sin hiperextender'),
        ex('Press inclinado con mancuernas', 3, '10-12', '90s', '2-0-2', 2, 'Controlar tempo'),
        ex('Elevaciones laterales', 3, '12-15', '45s', '2-0-2', 1, 'Hombros abajo'),
        ex('Extensión de tríceps en polea', 3, '12-15', '60s', '2-0-2', 1, 'Codos fijos')
      ]),
      day('Día 2 - Pull', [
        ex('Peso muerto', 3, '5-6', '150s', '2-0-2', 2, 'Espalda neutra'),
        ex('Remo con barra', 4, '8-10', '90s', '2-0-2', 2, 'Evitar balanceo'),
        ex('Dominadas', 3, '8-10', '90s', '2-0-2', 1, 'Depresión escapular'),
        ex('Face pulls', 3, '12-15', '60s', '2-0-2', 1, 'Escápulas juntas'),
        ex('Curl bíceps con barra', 3, '10-12', '60s', '2-0-2', 1, 'Codos pegados')
      ]),
      day('Día 3 - Legs', [
        ex('Sentadilla con barra', 4, '6-8', '120s', '2-0-2', 2, 'Profundidad adecuada'),
        ex('Peso muerto rumano', 3, '8-10', '90s', '2-0-2', 2, 'Caderas atrás'),
        ex('Prensa de piernas', 3, '10-12', '90s', '2-0-2', 2, 'Empujar con talones'),
        ex('Elevaciones de talón', 3, '12-15', '60s', '2-0-2', 1, 'Pausar arriba'),
        ex('Crunch', 3, '15', '45s', '2-0-2', 1, 'Controlar movimiento')
      ]),
      day('Día 4 - Upper', [
        ex('Press banca inclinado', 4, '8-10', '90s', '2-0-2', 2, 'Controlar descenso'),
        ex('Remo con mancuernas', 4, '8-10', '90s', '2-0-2', 2, 'Codos cerca del cuerpo'),
        ex('Fondos en paralelas', 3, '10-12', '60s', '2-0-2', 1, 'Rango completo'),
        ex('Jalón al pecho', 3, '10-12', '90s', '2-0-2', 2, 'Tirar con dorsales'),
        ex('Curl bíceps alterno', 3, '12', '60s', '2-0-2', 1, 'Controlar tempo')
      ]),
      day('Día 5 - Lower', [
        ex('Sentadilla frontal', 4, '8-10', '90s', '2-0-2', 2, 'Mantener torso vertical'),
        ex('Hip thrust', 3, '10-12', '90s', '2-0-2', 1, 'Extensión completa'),
        ex('Curl femoral', 3, '10-12', '90s', '2-0-2', 2, 'No arquear la espalda'),
        ex('Zancadas', 3, '12', '60s', '2-0-2', 1, 'Paso largo'),
        ex('Plancha', 3, '40s', '30s', 'isometría', 1, 'Core firme')
      ])
    ])
  };

  // Strength programs
  data.strength = {
    3: program(gender, 'strength', 3, [
      day('Día 1', [
        ex('Sentadilla con barra', 5, '5', '180s', '2-0-1', 2, 'Pesado'),
        ex('Press banca', 5, '5', '180s', '2-0-1', 2, 'Pausa al pecho'),
        ex('Remo con barra', 4, '5', '150s', '2-0-1', 2, 'Controlar core'),
        ex('Fondos lastrados', 3, '6', '120s', '2-0-1', 1, 'Rango completo')
      ]),
      day('Día 2', [
        ex('Peso muerto', 5, '3', '240s', '2-0-1', 2, 'Barra pegada al cuerpo'),
        ex('Press militar', 5, '5', '180s', '2-0-1', 2, 'No hiperextender'),
        ex('Dominadas lastradas', 4, '5', '150s', '2-0-1', 1, 'Mentón sobre la barra'),
        ex('Buenos días', 3, '6', '150s', '2-0-1', 1, 'Caderas atrás')
      ]),
      day('Día 3', [
        ex('Sentadilla frontal', 5, '3', '240s', '2-0-1', 2, 'Torso vertical'),
        ex('Press banca agarre cerrado', 5, '3', '240s', '2-0-1', 2, 'Pausa al pecho'),
        ex('Peso muerto rumano', 4, '5', '180s', '2-0-1', 2, 'Espalda neutra'),
        ex('Remo con barra invertido', 3, '6', '150s', '2-0-1', 1, 'Controlar cuerpo')
      ])
    ]),
    4: program(gender, 'strength', 4, [
      day('Día 1 - Upper pesado', [
        ex('Press banca', 5, '3', '240s', '2-0-1', 2, 'Pesado'),
        ex('Remo con barra', 5, '5', '180s', '2-0-1', 2, 'Control de core'),
        ex('Press militar', 4, '5', '180s', '2-0-1', 2, 'Bloquear arriba'),
        ex('Dominadas lastradas', 4, '5', '150s', '2-0-1', 1, 'Mentón sobre la barra')
      ]),
      day('Día 2 - Lower pesado', [
        ex('Sentadilla', 5, '3', '240s', '2-0-1', 2, 'Profundidad completa'),
        ex('Peso muerto', 5, '3', '240s', '2-0-1', 2, 'Caderas y hombros juntos'),
        ex('Sentadilla frontal', 4, '5', '180s', '2-0-1', 2, 'Torso vertical'),
        ex('Hip thrust pesado', 4, '6', '180s', '2-0-1', 1, 'Pausar arriba')
      ]),
      day('Día 3 - Upper volumen', [
        ex('Press banca', 4, '5', '180s', '2-0-1', 2, 'Técnica estricta'),
        ex('Remo con barra', 4, '5', '180s', '2-0-1', 2, 'Controlar velocidad'),
        ex('Press militar', 4, '5', '180s', '2-0-1', 2, 'Sin balanceo'),
        ex('Dominadas', 4, '5', '150s', '2-0-1', 1, 'Hombros abajo')
      ]),
      day('Día 4 - Lower volumen', [
        ex('Sentadilla', 4, '5', '180s', '2-0-1', 2, 'Subir rápido'),
        ex('Peso muerto', 4, '5', '180s', '2-0-1', 2, 'Barra pegada'),
        ex('Prensa de piernas', 4, '6', '150s', '2-0-1', 1, 'Profundidad completa'),
        ex('Peso muerto rumano', 4, '6', '150s', '2-0-1', 1, 'Estirar isquios')
      ])
    ]),
    5: program(gender, 'strength', 5, [
      day('Día 1 - Sentadilla', [
        ex('Sentadilla', 5, '5', '180s', '2-0-1', 2, 'Pesado'),
        ex('Prensa de piernas', 4, '6', '150s', '2-0-1', 2, 'Profundidad'),
        ex('Peso muerto rumano', 4, '6', '150s', '2-0-1', 2, 'Estirar isquios'),
        ex('Curl femoral', 3, '8', '120s', '2-0-1', 1, 'Controlar tempo')
      ]),
      day('Día 2 - Press banca', [
        ex('Press banca', 5, '5', '180s', '2-0-1', 2, 'Pausa al pecho'),
        ex('Press militar', 4, '6', '150s', '2-0-1', 2, 'Bloquear arriba'),
        ex('Press inclinado', 4, '6', '150s', '2-0-1', 2, 'Controlar descenso'),
        ex('Extensión de tríceps', 3, '8', '120s', '2-0-1', 1, 'Codos fijos')
      ]),
      day('Día 3 - Peso muerto', [
        ex('Peso muerto', 5, '3', '240s', '2-0-1', 2, 'Barra pegada al cuerpo'),
        ex('Peso muerto con déficit', 4, '5', '180s', '2-0-1', 2, 'Caderas abajo'),
        ex('Remo con barra', 4, '6', '150s', '2-0-1', 2, 'Controlar core'),
        ex('Encogimientos con barra', 3, '8', '120s', '2-0-1', 1, 'Pausa arriba')
      ]),
      day('Día 4 - Press militar', [
        ex('Press militar', 5, '5', '180s', '2-0-1', 2, 'Pesado'),
        ex('Dominadas', 4, '6', '150s', '2-0-1', 1, 'Mentón sobre la barra'),
        ex('Press banca con agarre cerrado', 4, '6', '150s', '2-0-1', 2, 'Pausa al pecho'),
        ex('Face pulls', 3, '10', '120s', '2-0-1', 1, 'Escápulas juntas')
      ]),
      day('Día 5 - Accesorios', [
        ex('Peso muerto rumano', 4, '6', '150s', '2-0-1', 2, 'Estirar isquios'),
        ex('Fondos lastrados', 4, '6', '150s', '2-0-1', 1, 'Rango completo'),
        ex('Remo con barra invertido', 4, '6', '150s', '2-0-1', 1, 'Controlar cuerpo'),
        ex('Plancha', 3, '60s', '90s', 'isometría', 1, 'Core firme')
      ])
    ])
  };

  // Fat loss programs
  data.fat_loss = {
    3: program(gender, 'fat_loss', 3, [
      multiDay('Día 1', [
        { titulo: 'Entrenamiento', items: [
          ex('Sentadilla goblet', 3, '10-12', '60s', '2-0-2', 2, 'Mantener torso erguido'),
          ex('Press banca con mancuernas', 3, '10-12', '60s', '2-0-2', 2, 'Ritmo controlado'),
          ex('Remo con mancuernas', 3, '10-12', '60s', '2-0-2', 2, 'Escápulas juntas'),
          ex('Zancadas', 2, '12', '45s', '2-0-2', 1, 'Paso largo')
        ] },
        { titulo: 'Circuito', items: [
          ex('Saltos de cuerda', 3, '1min', '30s', 'rápido', 3, 'Mantener ritmo'),
          ex('Burpees', 3, '12', '30s', 'rápido', 3, 'Tocar pecho al suelo')
        ] }
      ]),
      multiDay('Día 2', [
        { titulo: 'Entrenamiento', items: [
          ex('Peso muerto rumano', 3, '10-12', '60s', '2-0-2', 2, 'Caderas atrás'),
          ex('Press militar con mancuernas', 3, '10-12', '60s', '2-0-2', 2, 'No arquear'),
          ex('Dominadas asistidas', 3, '8-10', '60s', '2-0-2', 1, 'Depresión escapular'),
          ex('Fondos en banco', 2, '12', '45s', '2-0-2', 1, 'Rango completo')
        ] },
        { titulo: 'Circuito', items: [
          ex('Bike erg', 6, '30s', '30s', 'rápido', 3, 'Sprint'),
          ex('Plancha', 3, '30s', '15s', 'isometría', 2, 'Core firme')
        ] }
      ]),
      multiDay('Día 3', [
        { titulo: 'Entrenamiento', items: [
          ex('Sentadilla con salto', 3, '10', '60s', 'rápido', 2, 'Amortiguar aterrizaje'),
          ex('Press banca', 3, '8-10', '60s', '2-0-2', 2, 'Controlado'),
          ex('Remo con barra', 3, '8-10', '60s', '2-0-2', 2, 'Codos cerca'),
          ex('Curl bíceps', 2, '12', '45s', '2-0-2', 1, 'Codos fijos')
        ] },
        { titulo: 'Circuito', items: [
          ex('Caminata inclinada', 1, '10min', '0s', 'continuo', 3, 'Ritmo constante')
        ] }
      ])
    ]),
    4: program(gender, 'fat_loss', 4, [
      multiDay('Día 1 - Torso', [
        { titulo: 'Entrenamiento', items: [
          ex('Press banca', 3, '8-10', '60s', '2-0-2', 2, 'Ritmo controlado'),
          ex('Jalón al pecho', 3, '10-12', '60s', '2-0-2', 2, 'Tirar con dorsales'),
          ex('Press inclinado con mancuernas', 3, '10-12', '60s', '2-0-2', 2, 'Controlar tempo'),
          ex('Remo con cable', 3, '10-12', '60s', '2-0-2', 2, 'Escápulas juntas')
        ] },
        { titulo: 'Finisher', items: [
          ex('Battle ropes', 4, '30s', '30s', 'rápido', 3, 'Ritmo alto')
        ] }
      ]),
      multiDay('Día 2 - Pierna', [
        { titulo: 'Entrenamiento', items: [
          ex('Sentadilla', 3, '8-10', '60s', '2-0-2', 2, 'Profundidad'),
          ex('Peso muerto rumano', 3, '8-10', '60s', '2-0-2', 2, 'Caderas atrás'),
          ex('Prensa', 3, '12', '60s', '2-0-2', 1, 'Empujar con talones'),
          ex('Curl femoral', 3, '12', '60s', '2-0-2', 1, 'Control')
        ] },
        { titulo: 'Finisher', items: [
          ex('Sprints en bici', 6, '20s', '40s', 'rápido', 3, 'Total esfuerzo')
        ] }
      ]),
      multiDay('Día 3 - Torso', [
        { titulo: 'Entrenamiento', items: [
          ex('Press militar', 3, '8-10', '60s', '2-0-2', 2, 'No arquear'),
          ex('Dominadas', 3, '8-10', '60s', '2-0-2', 1, 'Pecho a la barra'),
          ex('Fondos', 3, '10-12', '60s', '2-0-2', 1, 'Rango completo'),
          ex('Remo con mancuernas', 3, '10-12', '60s', '2-0-2', 2, 'Escápulas juntas')
        ] },
        { titulo: 'Finisher', items: [
          ex('Row erg', 5, '1min', '30s', 'moderado', 3, 'Mantener ritmo')
        ] }
      ]),
      multiDay('Día 4 - Pierna', [
        { titulo: 'Entrenamiento', items: [
          ex('Sentadilla frontal', 3, '8-10', '60s', '2-0-2', 2, 'Torso vertical'),
          ex('Zancadas', 3, '12', '60s', '2-0-2', 1, 'Paso largo'),
          ex('Hip thrust', 3, '12', '60s', '2-0-2', 1, 'Pausar arriba'),
          ex('Elevaciones de talón', 3, '15', '45s', '2-0-2', 1, 'Pausar')
        ] },
        { titulo: 'Finisher', items: [
          ex('Circuito de planchas', 3, '30s c/u', '15s', 'isometría', 2, 'Core firme')
        ] }
      ])
    ]),
    5: program(gender, 'fat_loss', 5, [
      multiDay('Día 1 - Push', [
        { titulo: 'Entrenamiento', items: [
          ex('Press banca', 3, '8-10', '60s', '2-0-2', 2, 'Control'),
          ex('Press militar', 3, '10', '60s', '2-0-2', 2, 'No arquear'),
          ex('Press inclinado', 3, '12', '60s', '2-0-2', 1, 'Rango completo'),
          ex('Extensión tríceps', 3, '12', '45s', '2-0-2', 1, 'Codos fijos')
        ] },
        { titulo: 'Finisher', items: [
          ex('Cuerda', 5, '1min', '30s', 'rápido', 3, 'Ritmo alto')
        ] }
      ]),
      multiDay('Día 2 - Pull', [
        { titulo: 'Entrenamiento', items: [
          ex('Dominadas', 3, '8-10', '60s', '2-0-2', 1, 'Pecho a la barra'),
          ex('Remo con barra', 3, '10', '60s', '2-0-2', 2, 'Control'),
          ex('Face pulls', 3, '12', '45s', '2-0-2', 1, 'Escápulas juntas'),
          ex('Curl bíceps', 3, '12', '45s', '2-0-2', 1, 'Codos fijos')
        ] },
        { titulo: 'Finisher', items: [
          ex('Remo erg', 6, '30s', '30s', 'rápido', 3, 'Sprint')
        ] }
      ]),
      multiDay('Día 3 - Legs', [
        { titulo: 'Entrenamiento', items: [
          ex('Sentadilla', 3, '8-10', '60s', '2-0-2', 2, 'Profundidad'),
          ex('Peso muerto rumano', 3, '10', '60s', '2-0-2', 2, 'Caderas atrás'),
          ex('Prensa', 3, '12', '60s', '2-0-2', 1, 'Empujar con talones'),
          ex('Curl femoral', 3, '12', '45s', '2-0-2', 1, 'Control')
        ] },
        { titulo: 'Finisher', items: [
          ex('Bike erg', 8, '20s', '40s', 'rápido', 3, 'Esfuerzo total')
        ] }
      ]),
      multiDay('Día 4 - Upper', [
        { titulo: 'Entrenamiento', items: [
          ex('Press inclinado', 3, '10', '60s', '2-0-2', 2, 'Control'),
          ex('Jalón al pecho', 3, '10', '60s', '2-0-2', 2, 'Tirar con dorsales'),
          ex('Fondos', 3, '12', '45s', '2-0-2', 1, 'Rango completo'),
          ex('Remo con mancuernas', 3, '12', '45s', '2-0-2', 1, 'Escápulas juntas')
        ] },
        { titulo: 'Finisher', items: [
          ex('Battle ropes', 5, '30s', '30s', 'rápido', 3, 'Mantener intensidad')
        ] }
      ]),
      multiDay('Día 5 - Cardio', [
        { titulo: 'Cardio', items: [
          ex('Carrera continua', 1, '30min', '0s', 'moderado', 3, 'Zona 2')
        ] }
      ])
    ])
  };

  // Power/athlete programs
  data.power = {
    3: program(gender, 'power', 3, [
      day('Día 1', [
        ex('Power clean', 5, '3', '180s', 'explosivo', 2, 'Tirar rápido'),
        ex('Sentadilla frontal', 4, '3-5', '150s', '1-0-1', 2, 'Torso vertical'),
        ex('Press banca', 4, '3-5', '150s', '1-0-1', 2, 'Movilidad rápida'),
        ex('Saltos pliométricos', 3, '5', '60s', 'explosivo', 2, 'Máxima altura')
      ]),
      day('Día 2', [
        ex('Snatch pull', 5, '3', '180s', 'explosivo', 2, 'Extensión completa'),
        ex('Peso muerto', 4, '3-5', '150s', '1-0-1', 2, 'Barra pegada'),
        ex('Push press', 4, '3-5', '150s', 'explosivo', 2, 'Impulsar con piernas'),
        ex('Sprints', 6, '40m', '90s', 'rápido', 3, 'Máxima velocidad')
      ]),
      day('Día 3', [
        ex('Power jerk', 5, '2-3', '180s', 'explosivo', 2, 'Recepción firme'),
        ex('Sentadilla trasera', 4, '3-5', '150s', '1-0-1', 2, 'Explosiva'),
        ex('Remo explosivo', 4, '3-5', '150s', '1-0-1', 2, 'Tirar rápido'),
        ex('Saltos al cajón', 3, '5', '60s', 'explosivo', 2, 'Aterrizaje suave')
      ])
    ]),
    4: program(gender, 'power', 4, [
      day('Día 1 - Upper', [
        ex('Push press', 5, '3', '180s', 'explosivo', 2, 'Impulsar con piernas'),
        ex('Press banca velocidad', 4, '3', '120s', 'explosivo', 2, 'Barra rápida'),
        ex('Remo pendlay', 4, '5', '120s', 'explosivo', 2, 'Control'),
        ex('Lanzamiento de balón medicinal', 3, '5', '60s', 'explosivo', 2, 'Máxima potencia')
      ]),
      day('Día 2 - Lower', [
        ex('Power clean', 5, '3', '180s', 'explosivo', 2, 'Tirar rápido'),
        ex('Sentadilla', 4, '3-5', '150s', '1-0-1', 2, 'Subir rápido'),
        ex('Peso muerto', 4, '3-5', '150s', '1-0-1', 2, 'Caderas y hombros juntos'),
        ex('Saltos laterales', 3, '5', '60s', 'explosivo', 2, 'Amortiguar')
      ]),
      day('Día 3 - Upper', [
        ex('Jerk', 5, '2-3', '180s', 'explosivo', 2, 'Recepción firme'),
        ex('Dominadas explosivas', 4, '5', '120s', 'explosivo', 2, 'Pecho a la barra'),
        ex('Fondos explosivos', 4, '5', '120s', 'explosivo', 2, 'Subir rápido'),
        ex('Sprints', 6, '30m', '90s', 'rápido', 3, 'Máxima velocidad')
      ]),
      day('Día 4 - Lower', [
        ex('Snatch', 5, '2-3', '180s', 'explosivo', 2, 'Extensión completa'),
        ex('Sentadilla frontal', 4, '3-5', '150s', '1-0-1', 2, 'Torso vertical'),
        ex('Peso muerto rumano', 4, '5', '120s', '1-0-1', 2, 'Controlar descenso'),
        ex('Saltos profundos', 3, '5', '60s', 'explosivo', 2, 'Máxima altura')
      ])
    ]),
    5: program(gender, 'power', 5, [
      day('Día 1 - Push', [
        ex('Push press', 5, '3', '180s', 'explosivo', 2, 'Impulsar con piernas'),
        ex('Press banca velocidad', 4, '3', '120s', 'explosivo', 2, 'Barra rápida'),
        ex('Fondos explosivos', 4, '5', '120s', 'explosivo', 2, 'Subir rápido'),
        ex('Lanzamiento de balón', 3, '5', '60s', 'explosivo', 2, 'Potencia')
      ]),
      day('Día 2 - Pull', [
        ex('Power clean', 5, '3', '180s', 'explosivo', 2, 'Tirar rápido'),
        ex('Remo pendlay', 4, '5', '120s', 'explosivo', 2, 'Control'),
        ex('Dominadas explosivas', 4, '5', '120s', 'explosivo', 2, 'Pecho a la barra'),
        ex('Sprints', 6, '30m', '90s', 'rápido', 3, 'Máxima velocidad')
      ]),
      day('Día 3 - Legs', [
        ex('Snatch', 5, '2-3', '180s', 'explosivo', 2, 'Extensión completa'),
        ex('Sentadilla', 4, '3-5', '150s', '1-0-1', 2, 'Explosiva'),
        ex('Peso muerto', 4, '3-5', '150s', '1-0-1', 2, 'Barra pegada'),
        ex('Saltos al cajón', 3, '5', '60s', 'explosivo', 2, 'Aterrizaje suave')
      ]),
      day('Día 4 - Upper', [
        ex('Jerk', 5, '2-3', '180s', 'explosivo', 2, 'Recepción firme'),
        ex('Press militar velocidad', 4, '3', '120s', 'explosivo', 2, 'Barra rápida'),
        ex('Remo con barra explosivo', 4, '5', '120s', '1-0-1', 2, 'Tirar rápido'),
        ex('Lanzamiento de balón lateral', 3, '5', '60s', 'explosivo', 2, 'Rotar cadera')
      ]),
      day('Día 5 - Recovery', [
        ex('Sprints', 10, '40m', '90s', 'rápido', 3, 'Esfuerzo máximo')
      ])
    ])
  };

  // Functional / Calisthenics programs
  data.functional = {
    3: program(gender, 'functional', 3, [
      day('Día 1', [
        ex('Dominadas', 3, '8-12', '60s', '2-0-2', 1, 'Control corporal'),
        ex('Flexiones', 3, '12-15', '60s', '2-0-2', 1, 'Cuerpo recto'),
        ex('Sentadilla a una pierna asistida', 3, '6-8', '60s', '2-0-2', 2, 'Mantener equilibrio'),
        ex('Plancha con elevación de brazo', 3, '10', '45s', '2-0-2', 1, 'Hips quietos')
      ]),
      day('Día 2', [
        ex('Remo invertido', 3, '10-12', '60s', '2-0-2', 1, 'Escápulas juntas'),
        ex('Dips en paralelas', 3, '8-12', '60s', '2-0-2', 1, 'Rango completo'),
        ex('Zancadas con peso corporal', 3, '12-15', '60s', '2-0-2', 1, 'Paso controlado'),
        ex('Hollow body hold', 3, '30s', '45s', 'isometría', 1, 'Baja espalda pegada')
      ]),
      day('Día 3', [
        ex('Handstand asistido', 3, '30s', '60s', 'isometría', 2, 'Alinear cuerpo'),
        ex('Pull over en barra', 3, '6-8', '90s', '2-0-2', 2, 'Explosivo'),
        ex('Puente de glúteo a una pierna', 3, '12', '60s', '2-0-2', 1, 'Hips nivelados'),
        ex('Farmer walk', 3, '40m', '60s', 'controlado', 1, 'Postura erguida')
      ])
    ]),
    4: program(gender, 'functional', 4, [
      day('Día 1 - Upper', [
        ex('Dominadas', 3, '8-12', '60s', '2-0-2', 1, 'Control corporal'),
        ex('Flexiones con palmada', 3, '8-10', '60s', 'explosivo', 2, 'Potencia'),
        ex('Remo invertido', 3, '10-12', '60s', '2-0-2', 1, 'Escápulas juntas'),
        ex('Plancha lateral', 3, '30s', '30s', 'isometría', 1, 'Cadera alta')
      ]),
      day('Día 2 - Lower', [
        ex('Sentadilla a una pierna', 3, '6-8', '60s', '2-0-2', 2, 'Equilibrio'),
        ex('Puente de glúteo a una pierna', 3, '12', '60s', '2-0-2', 1, 'Hips nivelados'),
        ex('Step ups', 3, '12', '60s', '2-0-2', 1, 'Apoyar toda la planta'),
        ex('Plancha con toques de hombro', 3, '20', '45s', 'controlado', 1, 'Hips quietos')
      ]),
      day('Día 3 - Upper', [
        ex('Muscle up asistido', 3, '5-6', '90s', 'explosivo', 2, 'Transición suave'),
        ex('Flexiones en anillas', 3, '10', '60s', '2-0-2', 2, 'Core firme'),
        ex('Face pulls con banda', 3, '15', '45s', '2-0-2', 1, 'Escápulas juntas'),
        ex('Hollow body hold', 3, '30s', '45s', 'isometría', 1, 'Baja espalda pegada')
      ]),
      day('Día 4 - Lower', [
        ex('Saltos al cajón', 3, '10', '60s', 'explosivo', 2, 'Máxima altura'),
        ex('Zancadas caminando', 3, '20', '60s', '2-0-2', 1, 'Paso largo'),
        ex('Sentadilla isométrica en pared', 3, '40s', '45s', 'isometría', 1, 'Rodillas a 90°'),
        ex('Farmer walk', 3, '40m', '60s', 'controlado', 1, 'Postura erguida')
      ])
    ]),
    5: program(gender, 'functional', 5, [
      day('Día 1 - Push', [
        ex('Flexiones con palmada', 3, '8-10', '60s', 'explosivo', 2, 'Potencia'),
        ex('Dips en anillas', 3, '8-12', '60s', '2-0-2', 1, 'Control corporal'),
        ex('Plancha con elevación de brazo', 3, '10', '45s', '2-0-2', 1, 'Hips quietos'),
        ex('Fondos pike', 3, '10-12', '60s', '2-0-2', 2, 'Range completo')
      ]),
      day('Día 2 - Pull', [
        ex('Dominadas', 3, '8-12', '60s', '2-0-2', 1, 'Control'),
        ex('Remo invertido', 3, '12', '60s', '2-0-2', 1, 'Escápulas juntas'),
        ex('Curl con banda', 3, '15', '45s', '2-0-2', 1, 'Codos fijos'),
        ex('Hollow body pull', 3, '8', '60s', '2-0-2', 2, 'Transición suave')
      ]),
      day('Día 3 - Legs', [
        ex('Sentadilla a una pierna', 3, '6-8', '60s', '2-0-2', 2, 'Equilibrio'),
        ex('Step ups', 3, '15', '60s', '2-0-2', 1, 'Apoyar toda la planta'),
        ex('Puente de glúteo', 3, '15', '60s', '2-0-2', 1, 'Pausar arriba'),
        ex('Plancha lateral', 3, '30s', '30s', 'isometría', 1, 'Cadera alta')
      ]),
      day('Día 4 - Core y estabilidad', [
        ex('Walkouts', 3, '8', '60s', '2-0-2', 1, 'Mantener control'),
        ex('Plancha con toques de hombro', 3, '20', '45s', 'controlado', 1, 'Hips quietos'),
        ex('Superman hold', 3, '30s', '45s', 'isometría', 1, 'Extender bien'),
        ex('Farmer walk', 3, '50m', '60s', 'controlado', 1, 'Postura erguida')
      ]),
      day('Día 5 - Skills', [
        ex('Handstand libre', 5, 'práctica', '60s', 'controlado', 1, 'Alinear cuerpo'),
        ex('Muscle up', 5, 'práctica', '90s', 'explosivo', 2, 'Transición fluida')
      ])
    ])
  };

  // Hybrid programs (strength + cardio)
  data.hybrid = {
    3: program(gender, 'hybrid', 3, [
      day('Día 1 - Fuerza', [
        ex('Sentadilla', 4, '6-8', '120s', '2-0-2', 2, 'Profundidad completa'),
        ex('Press banca', 4, '6-8', '120s', '2-0-2', 2, 'Pausa al pecho'),
        ex('Remo con barra', 3, '8-10', '90s', '2-0-2', 2, 'Escápulas juntas'),
        ex('Plancha', 3, '40s', '45s', 'isometría', 1, 'Core firme')
      ]),
      day('Día 2 - Cardio', [
        ex('Carrera continua', 1, '40min', '0s', 'moderado', 3, 'Zona 2')
      ]),
      day('Día 3 - Fuerza', [
        ex('Peso muerto', 4, '6', '120s', '2-0-2', 2, 'Espalda recta'),
        ex('Press militar', 4, '6-8', '120s', '2-0-2', 2, 'No arquear'),
        ex('Dominadas', 3, '8-10', '90s', '2-0-2', 1, 'Depresión escapular'),
        ex('Hip thrust', 3, '10-12', '90s', '2-0-2', 1, 'Extensión completa')
      ])
    ]),
    4: program(gender, 'hybrid', 4, [
      day('Día 1 - Upper fuerza', [
        ex('Press banca', 4, '5-6', '150s', '2-0-1', 2, 'Progresar carga'),
        ex('Remo con barra', 4, '6-8', '120s', '2-0-2', 2, 'Control core'),
        ex('Press inclinado', 3, '8-10', '90s', '2-0-2', 2, 'Ritmo controlado'),
        ex('Face pulls', 3, '12', '60s', '2-0-2', 1, 'Escápulas juntas')
      ]),
      day('Día 2 - Cardio Z2', [
        ex('Ciclismo', 1, '50min', '0s', 'moderado', 3, 'Zona 2')
      ]),
      day('Día 3 - Lower fuerza', [
        ex('Sentadilla', 4, '5-6', '150s', '2-0-1', 2, 'Profundidad'),
        ex('Peso muerto rumano', 4, '6-8', '120s', '2-0-2', 2, 'Caderas atrás'),
        ex('Prensa', 3, '10', '90s', '2-0-2', 2, 'Empujar con talones'),
        ex('Curl femoral', 3, '10', '90s', '2-0-2', 2, 'Control')
      ]),
      day('Día 4 - Intervalos', [
        ex('Sprints', 8, '20s', '40s', 'rápido', 3, 'Esfuerzo total')
      ])
    ]),
    5: program(gender, 'hybrid', 5, [
      day('Día 1 - Push fuerza', [
        ex('Press banca', 4, '5-6', '150s', '2-0-1', 2, 'Progresar carga'),
        ex('Press militar', 4, '6-8', '120s', '2-0-2', 2, 'No arquear'),
        ex('Fondos', 3, '8-10', '90s', '2-0-2', 1, 'Rango completo'),
        ex('Extensión tríceps', 3, '12', '60s', '2-0-2', 1, 'Codos fijos')
      ]),
      day('Día 2 - Cardio Z2', [
        ex('Carrera continua', 1, '45min', '0s', 'moderado', 3, 'Zona 2')
      ]),
      day('Día 3 - Pull fuerza', [
        ex('Peso muerto', 4, '5', '180s', '2-0-1', 2, 'Barra pegada'),
        ex('Dominadas', 4, '6-8', '120s', '2-0-2', 1, 'Depresión escapular'),
        ex('Remo con barra', 3, '8-10', '90s', '2-0-2', 2, 'Escápulas juntas'),
        ex('Curl bíceps', 3, '12', '60s', '2-0-2', 1, 'Control')
      ]),
      day('Día 4 - Legs fuerza', [
        ex('Sentadilla', 4, '5-6', '150s', '2-0-1', 2, 'Profundidad completa'),
        ex('Peso muerto rumano', 4, '6-8', '120s', '2-0-2', 2, 'Caderas atrás'),
        ex('Prensa', 3, '10', '90s', '2-0-2', 2, 'Empujar con talones'),
        ex('Plancha', 3, '45s', '45s', 'isometría', 1, 'Core firme')
      ]),
      day('Día 5 - Intervalos', [
        ex('Bike erg', 10, '20s', '40s', 'rápido', 3, 'Esfuerzo total')
      ])
    ])
  };

  // Swimmers (dryland)
  data.swimmers = {
    3: program(gender, 'swimmers', 3, [
      day('Día 1 - Dryland', [
        ex('Face pulls', 3, '15', '45s', '2-0-2', 1, 'Escápulas juntas'),
        ex('YTWL con mancuernas', 3, '12', '45s', '2-0-2', 1, 'Control'),
        ex('Puente de glúteo', 3, '12', '60s', '2-0-2', 1, 'Pausar arriba'),
        ex('Pallof press', 3, '12', '45s', '2-0-2', 1, 'No rotar el tronco')
      ]),
      day('Día 2 - Fuerza general', [
        ex('Sentadilla frontal', 3, '6-8', '90s', '2-0-2', 2, 'Torso vertical'),
        ex('Press banca', 3, '6-8', '90s', '2-0-2', 2, 'Pausa al pecho'),
        ex('Remo con barra', 3, '8-10', '90s', '2-0-2', 2, 'Escápulas juntas'),
        ex('Plancha', 3, '40s', '30s', 'isometría', 1, 'Core firme')
      ]),
      day('Día 3 - Dryland', [
        ex('Rotaciones externas con banda', 3, '15', '45s', '2-0-2', 1, 'Codo pegado'),
        ex('Hip thrust', 3, '10', '60s', '2-0-2', 1, 'Extensión completa'),
        ex('Nordic curl asistido', 3, '6-8', '90s', '2-0-2', 2, 'Control descenso'),
        ex('Plancha lateral con rotación', 3, '12', '45s', 'controlado', 1, 'Hips estables')
      ])
    ]),
    4: program(gender, 'swimmers', 4, [
      day('Día 1 - Dryland', [
        ex('Face pulls', 3, '15', '45s', '2-0-2', 1, 'Escápulas juntas'),
        ex('YTWL con mancuernas', 3, '12', '45s', '2-0-2', 1, 'Control'),
        ex('Puente de glúteo', 3, '12', '60s', '2-0-2', 1, 'Pausar arriba'),
        ex('Pallof press', 3, '12', '45s', '2-0-2', 1, 'No rotar')
      ]),
      day('Día 2 - Fuerza', [
        ex('Sentadilla', 3, '6-8', '90s', '2-0-2', 2, 'Profundidad'),
        ex('Press banca', 3, '6-8', '90s', '2-0-2', 2, 'Pausa'),
        ex('Remo con barra', 3, '8-10', '90s', '2-0-2', 2, 'Escápulas'),
        ex('Plancha', 3, '45s', '30s', 'isometría', 1, 'Core firme')
      ]),
      day('Día 3 - Dryland', [
        ex('Rotaciones externas con banda', 3, '15', '45s', '2-0-2', 1, 'Codo pegado'),
        ex('Hip thrust', 3, '10', '60s', '2-0-2', 1, 'Extensión completa'),
        ex('Nordic curl asistido', 3, '6-8', '90s', '2-0-2', 2, 'Control'),
        ex('Plancha lateral con rotación', 3, '12', '45s', 'controlado', 1, 'Hips estables')
      ]),
      day('Día 4 - Fuerza', [
        ex('Peso muerto rumano', 3, '6-8', '90s', '2-0-2', 2, 'Caderas atrás'),
        ex('Press militar', 3, '6-8', '90s', '2-0-2', 2, 'No arquear'),
        ex('Dominadas', 3, '8-10', '90s', '2-0-2', 1, 'Depresión escapular'),
        ex('Plancha con toques de hombro', 3, '20', '30s', 'controlado', 1, 'Hips quietos')
      ])
    ]),
    5: program(gender, 'swimmers', 5, [
      day('Día 1 - Dryland', [
        ex('Face pulls', 3, '15', '45s', '2-0-2', 1, 'Escápulas juntas'),
        ex('YTWL', 3, '12', '45s', '2-0-2', 1, 'Control'),
        ex('Puente de glúteo', 3, '12', '60s', '2-0-2', 1, 'Pausar arriba'),
        ex('Pallof press', 3, '12', '45s', '2-0-2', 1, 'No rotar')
      ]),
      day('Día 2 - Fuerza', [
        ex('Sentadilla', 3, '6-8', '90s', '2-0-2', 2, 'Profundidad'),
        ex('Press banca', 3, '6-8', '90s', '2-0-2', 2, 'Pausa'),
        ex('Remo con barra', 3, '8-10', '90s', '2-0-2', 2, 'Escápulas'),
        ex('Plancha', 3, '45s', '30s', 'isometría', 1, 'Core firme')
      ]),
      day('Día 3 - Dryland', [
        ex('Rotaciones externas con banda', 3, '15', '45s', '2-0-2', 1, 'Codo pegado'),
        ex('Hip thrust', 3, '10', '60s', '2-0-2', 1, 'Extensión completa'),
        ex('Nordic curl asistido', 3, '6-8', '90s', '2-0-2', 2, 'Control'),
        ex('Plancha lateral con rotación', 3, '12', '45s', 'controlado', 1, 'Hips estables')
      ]),
      day('Día 4 - Fuerza', [
        ex('Peso muerto rumano', 3, '6-8', '90s', '2-0-2', 2, 'Caderas atrás'),
        ex('Press militar', 3, '6-8', '90s', '2-0-2', 2, 'No arquear'),
        ex('Dominadas', 3, '8-10', '90s', '2-0-2', 1, 'Depresión escapular'),
        ex('Plancha con toques de hombro', 3, '20', '30s', 'controlado', 1, 'Hips quietos')
      ]),
      day('Día 5 - Dryland', [
        ex('Face pulls', 3, '15', '45s', '2-0-2', 1, 'Escápulas juntas'),
        ex('Bridge isométrico', 3, '30s', '45s', 'isometría', 1, 'Hips arriba'),
        ex('Pallof press', 3, '12', '45s', '2-0-2', 1, 'No rotar'),
        ex('Rotaciones torácicas', 3, '12', '30s', 'controlado', 1, 'Movilidad')
      ])
    ])
  };

  return data;
}

const genders = ['male', 'female'];
const result = {};
for (const g of genders) {
  result[g] = makeProgramsForGender(g);
}

fs.writeFileSync('src/data/mockPrograms.json', JSON.stringify(result, null, 2));
