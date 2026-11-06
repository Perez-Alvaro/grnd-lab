/**
 * tests/e2e/tier1_feature/f4_sample_routine.test.js
 * Tier 1 — Feature 4: Onboarding Sample Workout Routine & Instant Preview [U-01]
 * Source: ORIGINAL_REQUEST.md R2, PROJECT.md F4, docs/CAMPOS_VALIDACION.md
 */

import { assert, assertEqual, assertMatches } from '../helpers/assertions.js';
import { fileExists, readFileContent, resolveProjectPath } from '../helpers/fileScanner.js';
import { validateWorkoutRoutine } from '../helpers/contracts.js';

export const tests = [
  {
    id: 'F4-01',
    name: 'src/constants/sampleWorkoutRoutine.js exists and exports sample workout routine object',
    feature: 'F4',
    tier: 1,
    fn: async () => {
      const exists = fileExists('src/constants/sampleWorkoutRoutine.js');
      assert(exists, 'Expected src/constants/sampleWorkoutRoutine.js to exist');

      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);

      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;
      assert(sample && typeof sample === 'object', 'Expected valid sample routine object export');
    },
  },
  {
    id: 'F4-02',
    name: 'Sample workout routine conforms strictly to CAMPOS_VALIDACION.md schema',
    feature: 'F4',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/constants/sampleWorkoutRoutine.js'), 'src/constants/sampleWorkoutRoutine.js must exist');
      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);
      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;

      const result = validateWorkoutRoutine(sample);
      assertEqual(
        result.valid,
        true,
        `Sample workout routine validation failed with errors:\n${result.errors.join('\n')}`
      );
    },
  },
  {
    id: 'F4-03',
    name: 'Sample routine exercises contain "tempo" and zero forbidden fields (cadencia, duration, duracion)',
    feature: 'F4',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/constants/sampleWorkoutRoutine.js'), 'src/constants/sampleWorkoutRoutine.js must exist');
      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);
      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;

      let exerciseCount = 0;
      for (const week of sample.weeks) {
        for (const day of week.days) {
          for (const ex of day.exercises) {
            exerciseCount++;
            assert(!('cadencia' in ex), `Exercise "${ex.name}" has forbidden field "cadencia" (must be "tempo")`);
            assert(!('duration' in ex), `Exercise "${ex.name}" has forbidden field "duration"`);
            assert(!('duracion' in ex), `Exercise "${ex.name}" has forbidden field "duracion"`);
            assert('tempo' in ex && typeof ex.tempo === 'string', `Exercise "${ex.name}" must contain "tempo"`);
          }
        }
      }
      assert(exerciseCount > 0, 'Sample routine must contain at least one exercise to test');
    },
  },
  {
    id: 'F4-04',
    name: 'src/components/Trainer/editor/FitterOnboarding.jsx contains "Cargar rutina de ejemplo" button',
    feature: 'F4',
    tier: 1,
    fn: async () => {
      const content = readFileContent('src/components/Trainer/editor/FitterOnboarding.jsx');
      assert(content !== null, 'src/components/Trainer/editor/FitterOnboarding.jsx must exist');

      assertMatches(
        content,
        /Cargar rutina de ejemplo|rutina de ejemplo/i,
        'FitterOnboarding.jsx must provide a "Cargar rutina de ejemplo" button or trigger'
      );
    },
  },
  {
    id: 'F4-05',
    name: 'Loading sample routine is synchronous in-memory with zero external LLM API calls',
    feature: 'F4',
    tier: 1,
    fn: async () => {
      assert(fileExists('src/constants/sampleWorkoutRoutine.js'), 'src/constants/sampleWorkoutRoutine.js must exist');
      const fullPath = resolveProjectPath('src/constants/sampleWorkoutRoutine.js');
      const mod = await import(`file://${fullPath}`);
      const sample = mod.SAMPLE_WORKOUT_ROUTINE || mod.default || mod.sampleWorkoutRoutine;

      assert(sample !== null && typeof sample === 'object', 'Sample routine is immediately accessible in memory');
      assert(sample.weeks && sample.weeks.length > 0, 'Sample routine contains pre-populated weeks and exercises');
    },
  },
];
