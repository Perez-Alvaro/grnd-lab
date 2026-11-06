/**
 * tests/e2e/tier2_boundary/b4_routine_boundary.test.js
 * Tier 2 — Boundary & Corner Cases: Routine Schema & Adversarial Payloads [U-01]
 * Source: docs/CAMPOS_VALIDACION.md
 */

import { assert, assertEqual } from '../helpers/assertions.js';
import { validateWorkoutRoutine } from '../helpers/contracts.js';

export const tests = [
  {
    id: 'B4-01',
    name: 'Validation boundary: routine without metadata object is rejected',
    feature: 'F4',
    tier: 2,
    fn: async () => {
      const invalidPlan = {
        weeks: [
          {
            days: [
              {
                name: 'Día 1',
                exercises: [{ name: 'Sentadilla', sets: 4, reps: 8, rest: 120, tempo: '3-0-1-0' }],
              },
            ],
          },
        ],
      };
      const result = validateWorkoutRoutine(invalidPlan);
      assertEqual(result.valid, false, 'Expected validation to fail without metadata');
      assert(result.errors.some((e) => e.includes('metadata')), 'Error message must mention metadata');
    },
  },
  {
    id: 'B4-02',
    name: 'Validation boundary: routine with empty weeks array is rejected',
    feature: 'F4',
    tier: 2,
    fn: async () => {
      const invalidPlan = {
        metadata: { title: 'Rutina Vacía' },
        weeks: [],
      };
      const result = validateWorkoutRoutine(invalidPlan);
      assertEqual(result.valid, false, 'Expected validation to fail with empty weeks');
    },
  },
  {
    id: 'B4-03',
    name: 'Forbidden field boundary: exercise containing "cadencia" instead of "tempo" is rejected',
    feature: 'F4',
    tier: 2,
    fn: async () => {
      const invalidPlan = {
        metadata: { title: 'Rutina con Cadencia Prohibida' },
        weeks: [
          {
            days: [
              {
                name: 'Día 1',
                exercises: [
                  {
                    name: 'Press de Banca',
                    sets: 3,
                    reps: 10,
                    rest: 90,
                    cadencia: '2-0-2-0', // FORBIDDEN: CAMPOS_VALIDACION requires 'tempo'
                  },
                ],
              },
            ],
          },
        ],
      };
      const result = validateWorkoutRoutine(invalidPlan);
      assertEqual(result.valid, false, 'Expected rejection of forbidden key "cadencia"');
      assert(result.errors.some((e) => e.includes('cadencia')), 'Error must mention cadencia');
    },
  },
  {
    id: 'B4-04',
    name: 'Forbidden field boundary: exercise containing "duration" or "duracion" is rejected',
    feature: 'F4',
    tier: 2,
    fn: async () => {
      const invalidPlan = {
        metadata: { title: 'Rutina con Duración Prohibida' },
        weeks: [
          {
            days: [
              {
                name: 'Día 1',
                exercises: [
                  {
                    name: 'Plank',
                    sets: 3,
                    reps: 1,
                    rest: 60,
                    tempo: '1-0-1-0',
                    duration: '60s', // FORBIDDEN
                  },
                ],
              },
            ],
          },
        ],
      };
      const result = validateWorkoutRoutine(invalidPlan);
      assertEqual(result.valid, false, 'Expected rejection of forbidden key "duration"');
    },
  },
  {
    id: 'B4-05',
    name: 'Numeric boundary: negative or zero sets/reps are rejected',
    feature: 'F4',
    tier: 2,
    fn: async () => {
      const invalidPlan = {
        metadata: { title: 'Rutina con Sets Negativos' },
        weeks: [
          {
            days: [
              {
                name: 'Día 1',
                exercises: [
                  {
                    name: 'Dominadas',
                    sets: -3,
                    reps: 0,
                    rest: -30,
                    tempo: '2-0-1-0',
                  },
                ],
              },
            ],
          },
        ],
      };
      const result = validateWorkoutRoutine(invalidPlan);
      assertEqual(result.valid, false, 'Expected rejection of negative numbers');
    },
  },
  {
    id: 'B4-06',
    name: 'Missing name boundary: exercise without name is rejected',
    feature: 'F4',
    tier: 2,
    fn: async () => {
      const invalidPlan = {
        metadata: { title: 'Rutina Sin Nombre de Ejercicio' },
        weeks: [
          {
            days: [
              {
                name: 'Día 1',
                exercises: [
                  {
                    sets: 3,
                    reps: 10,
                    rest: 60,
                    tempo: '2-0-1-0',
                  },
                ],
              },
            ],
          },
        ],
      };
      const result = validateWorkoutRoutine(invalidPlan);
      assertEqual(result.valid, false, 'Expected rejection of exercise without name');
    },
  },
];
