/**
 * STEPS del onboarding de RUTINAS. Extraído de FitterOnboarding para que el
 * onboarding pueda parametrizarse por planType (mismo shape que NUTRITION_STEPS).
 */
import { TRAINING_GOALS } from './objectives.js';

export const WORKOUT_STEPS = [
  { id: 'name', section: 'La rutina', field: 'name', kind: 'text', required: true,
    q: '¿Cómo se va a llamar la rutina?', sub: 'Un nombre para identificarla.',
    placeholder: 'Ej: Volumen FST-7 · 4 días' },
  { id: 'gender', section: 'El atleta', field: 'gender', kind: 'chips', required: true,
    q: '¿Para quién es?',
    options: [{ v: 'Masculino' }, { v: 'Femenino' }] },
  { id: 'level', section: 'El atleta', field: 'level', kind: 'chips', required: true,
    q: '¿Qué nivel tiene tu cliente?',
    options: [{ v: 'Principiante' }, { v: 'Intermedio' }, { v: 'Avanzado' }, { v: 'Todos los niveles', label: 'Todos' }] },
  { id: 'frequency', section: 'El entrenamiento', field: 'frequency', kind: 'chips', required: true, suffix: ' días',
    q: '¿Cuántos días por semana entrena?',
    options: [{ v: '2' }, { v: '3' }, { v: '4' }, { v: '5' }, { v: '6' }] },
  { id: 'objective', section: 'El entrenamiento', field: 'objective', kind: 'chips', required: true,
    q: '¿Cuál es el objetivo principal?',
    options: TRAINING_GOALS.map((g) => ({ v: g.value, label: g.label })) },
  // 1 a 6 semanas. Arriba de 6 la IA se queda sin tokens de salida y empieza a
  // copiar y pegar semanas iguales en vez de progresar el plan.
  { id: 'durationWeeks', section: 'El entrenamiento', field: 'durationWeeks', kind: 'chips', required: true, suffix: ' sem',
    q: '¿Cuántas semanas dura el plan?',
    sub: 'Un bloque corto y bien progresado rinde más que doce semanas repetidas.',
    options: [{ v: '1' }, { v: '2' }, { v: '3' }, { v: '4' }, { v: '5' }, { v: '6' }] },
  { id: 'description', section: 'El entrenamiento', field: 'description', kind: 'textarea', required: true,
    q: 'Contá el método de entrenamiento',
    sub: 'Tiempo de sesión, volumen, técnicas. Cuanto más claro, mejor arma la IA.',
    placeholder: 'Ej: Hipertrofia FST-7. Sesiones 60-75 min. 4 series por ejercicio, 3-4 ejercicios por grupo.' },
  { id: 'author', section: 'Últimos detalles', field: 'author', kind: 'text', required: false,
    q: '¿Quién firma la rutina?', sub: 'Opcional.', placeholder: 'Ej: Coach MZ' },
  { id: 'notes', section: 'Últimos detalles', field: 'notes', kind: 'textarea', required: false,
    q: '¿Algo a evitar o tener en cuenta?',
    sub: 'Lesiones, ejercicios a evitar, preferencias. Opcional.',
    placeholder: 'Ej: molestia en hombro derecho, evitar press militar' },
  { id: 'complete', kind: 'completion',
    q: '¡Listo! Generá la rutina', sub: 'Abrí tu IA con el prompt y traé el resultado.' },
];

export default WORKOUT_STEPS;
