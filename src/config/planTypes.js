/**
 * src/config/planTypes.js
 * Registry central que parametriza el editor por `planType` ('workout' | 'nutrition').
 *
 * Un mismo motor semana → día → hoja se reutiliza para rutinas y para nutrición;
 * lo único que cambia es la HOJA (exercise vs meal), las preguntas del onboarding,
 * el generador de Prompt Maestro, la capa de persistencia y las etiquetas de UI.
 *
 * Consumido por: onboarding parametrizado, editor de hoja, preview y persistencia.
 * Los campos `ItemEditor`, `Preview` e `importFromAI` se cablean en Fase 3 (UI);
 * por ahora quedan como null para no romper el build.
 */
import { generateAIPrompt } from '../utils/promptGenerator.js';
import { generateNutritionPrompt } from '../lib/nutritionPromptGenerator.js';
import { WORKOUT_STEPS } from '../constants/workoutOnboarding.js';
import { NUTRITION_STEPS } from '../constants/nutritionOnboarding.js';
import { listRoutines, getRoutine, saveRoutine, deleteRoutine } from '../lib/routines.js';
import {
  listNutritionPlans, getNutritionPlan, saveNutritionPlan, deleteNutritionPlan,
} from '../lib/nutritionPlans.js';
import { nutritionAIToEditor, universalImportNutrition } from '../lib/transformers/nutritionTransformer.js';
import { universalImport } from '../lib/transformers/routineTransformer.js';
import ExerciseEditor from '../components/Trainer/editor/ExerciseEditor.jsx';
import MealEditor from '../components/Trainer/editor/MealEditor.jsx';
import RoutinePreview from '../components/Trainer/preview/RoutinePreview.jsx';
import NutritionPreview from '../components/Trainer/preview/NutritionPreview.jsx';

export const generateNutritionPlanPDF = async (plan) => {
  const { generateNutritionPlanPDF: renderPDF } = await import('../pdf/NutritionPlanRenderer.jsx');
  return renderPDF(plan);
};

const createId = () => Math.random().toString(36).slice(2, 10);

// ── Factories de la hoja (leaf) ─────────────────────────────
// Rutina: ejercicio (idéntico a createExercise de useRoutineEditor).
export const createExerciseLeaf = () => ({
  id: createId(),
  name: '', sets: '', reps: '', rest: '', rir: '', tempo: '', video: '', note: '',
});

// Nutrición: comida (la hoja atómica; sin sub-ítems por alimento).
export const createMealLeaf = () => ({
  id: createId(),
  name: '', hora: '', kcal: '', proteina_g: '', carbos_g: '', grasas_g: '',
  ingredientes: '', preparacion: '', sustituciones: '',
  videoUrl: '', nota_timing: '', variantes: [],
});

export const PLAN_TYPES = {
  workout: {
    id: 'workout',
    // Etiquetas de UI
    labels: {
      singular: 'rutina',
      plural: 'rutinas',
      title: 'Rutinas',
      newItem: 'Nueva rutina',
      editorSubtitle: 'Editor de rutinas',
      untitled: 'Rutina sin título',
    },
    // Onboarding + Prompt Maestro
    steps: WORKOUT_STEPS,
    generatePrompt: generateAIPrompt,
    hasManualForm: true,       // muestra el toggle IA/formulario manual
    // Persistencia (tabla routines)
    lib: { list: listRoutines, get: getRoutine, save: saveRoutine, remove: deleteRoutine },
    // Hoja del árbol (leaf) + cómo la renderiza el DayEditor genérico
    leaf: {
      key: 'exercises',        // day.exercises
      create: createExerciseLeaf,
      ItemEditor: ExerciseEditor,
      labelSingular: 'ejercicio',
      labelPlural: 'ejercicios',
      addLabel: 'Agregar ejercicio',
      showDayType: true,       // select Entrenamiento/Descanso
      showWarmup: true,        // tabla de entrada en calor
    },
    // normalizeImport: null → el hook usa buildInitialPlan (formato IA rutinas).
    normalizeImport: null,
    importFromAI: universalImport,
    Preview: RoutinePreview,
    // PDF: null → usa el modal de rutina (mobile/desktop) existente.
    pdfExport: null,
  },

  nutrition: {
    id: 'nutrition',
    labels: {
      singular: 'plan nutricional',
      plural: 'planes nutricionales',
      title: 'Nutrición',
      newItem: 'Nuevo plan nutricional',
      editorSubtitle: 'Editor de planes nutricionales',
      untitled: 'Plan nutricional sin título',
    },
    steps: NUTRITION_STEPS,
    generatePrompt: generateNutritionPrompt,
    hasManualForm: false,      // solo asistente IA (no hay formulario manual espejo)
    lib: {
      list: listNutritionPlans,
      get: getNutritionPlan,
      save: saveNutritionPlan,
      remove: deleteNutritionPlan,
    },
    leaf: {
      key: 'meals',            // day.meals
      create: createMealLeaf,
      ItemEditor: MealEditor,
      labelSingular: 'comida',
      labelPlural: 'comidas',
      addLabel: 'Agregar comida',
      showDayType: false,      // los días de nutrición no tienen tipo entreno/descanso
      showWarmup: false,
    },
    // normalizeImport: transformer propio (JSON extendido → árbol con meals).
    normalizeImport: nutritionAIToEditor,
    importFromAI: universalImportNutrition,
    Preview: NutritionPreview,
    // PDF: exportación directa (una sola variante, react-pdf).
    pdfExport: async (plan) => {
      const { generateNutritionPlanPDF: renderPDF } = await import('../pdf/NutritionPlanRenderer.jsx');
      return renderPDF(plan);
    },
    pdfGenerator: async (plan) => {
      const { generateNutritionPlanPDF: renderPDF } = await import('../pdf/NutritionPlanRenderer.jsx');
      return renderPDF(plan);
    },
  },
};

/** Alias de PLAN_TYPES para compatibilidad */
export const workoutTypes = PLAN_TYPES;

/** Devuelve la config de un planType, con fallback a 'workout'. */
export const getPlanTypeConfig = (planType) => PLAN_TYPES[planType] || PLAN_TYPES.workout;

export default PLAN_TYPES;
