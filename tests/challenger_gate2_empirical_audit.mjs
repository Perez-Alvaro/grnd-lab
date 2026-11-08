/**
 * tests/challenger_gate2_empirical_audit.mjs
 * Comprehensive Empirical Verification & Adversarial Stress Suite for Gate 2.
 * Run via: node tests/challenger_gate2_empirical_audit.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failureDetails.push({ name, error: err });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('====================================================');
console.log('  GATE 2 EMPIRICAL AUDIT & STRESS TESTING HARNESS');
console.log('====================================================\n');

// ---------------------------------------------------------------------------
// 1. BUNDLE COMPILATION & PRELOAD INTEGRITY
// ---------------------------------------------------------------------------
console.log('--- 1. BUNDLE COMPILATION & PRELOAD INTEGRITY ---');

const distHtmlPath = path.join(rootDir, 'dist', 'index.html');
const distAssetsDir = path.join(rootDir, 'dist', 'assets');

runTest('dist/index.html exists', () => {
  assert(fs.existsSync(distHtmlPath), 'dist/index.html must exist (run npm run build first)');
});

const htmlContent = fs.readFileSync(distHtmlPath, 'utf-8');

runTest('dist/index.html has zero modulepreload tags for pdf-engine', () => {
  const matches = htmlContent.match(/<link[^>]+rel=["']modulepreload["'][^>]*pdf-engine[^>]*>/gi);
  assert(!matches || matches.length === 0, `Found modulepreload for pdf-engine: ${JSON.stringify(matches)}`);
});

runTest('dist/index.html has zero modulepreload tags for jspdf-engine', () => {
  const matches = htmlContent.match(/<link[^>]+rel=["']modulepreload["'][^>]*jspdf-engine[^>]*>/gi);
  assert(!matches || matches.length === 0, `Found modulepreload for jspdf-engine: ${JSON.stringify(matches)}`);
});

runTest('dist/index.html has zero preload/prefetch tags for pdf-engine or jspdf-engine', () => {
  const matches = htmlContent.match(/<link[^>]+(pdf-engine|jspdf-engine)[^>]*>/gi);
  assert(!matches || matches.length === 0, `Found link tags referencing pdf chunks: ${JSON.stringify(matches)}`);
});

// Inspect all modulepreload tags in index.html
runTest('dist/index.html modulepreloads only permitted vendor chunks', () => {
  const preloadTags = htmlContent.match(/<link[^>]+rel=["']modulepreload["'][^>]*>/gi) || [];
  console.log(`    Found ${preloadTags.length} modulepreload tag(s):`);
  preloadTags.forEach((t) => console.log(`      ${t}`));
  
  for (const tag of preloadTags) {
    assert(!tag.includes('pdf'), `Disallowed pdf modulepreload found: ${tag}`);
    assert(!tag.includes('jspdf'), `Disallowed jspdf modulepreload found: ${tag}`);
    assert(!tag.includes('html2canvas'), `Disallowed html2canvas modulepreload found: ${tag}`);
  }
});

// Locate entry JS file
const assetFiles = fs.readdirSync(distAssetsDir);
const entryJsFile = assetFiles.find((f) => f.startsWith('index-') && f.endsWith('.js'));
const vendorJsFile = assetFiles.find((f) => f.startsWith('vendor-') && f.endsWith('.js'));
const pdfEngineJsFile = assetFiles.find((f) => f.startsWith('pdf-engine-') && f.endsWith('.js'));
const jspdfEngineJsFile = assetFiles.find((f) => f.startsWith('jspdf-engine-') && f.endsWith('.js'));

runTest('Entry and separated chunks exist in dist/assets', () => {
  assert(entryJsFile, 'Entry chunk index-*.js must exist');
  assert(vendorJsFile, 'Vendor chunk vendor-*.js must exist');
  assert(pdfEngineJsFile, 'pdf-engine chunk pdf-engine-*.js must exist');
  assert(jspdfEngineJsFile, 'jspdf-engine chunk jspdf-engine-*.js must exist');
  console.log(`    Entry: ${entryJsFile}`);
  console.log(`    Vendor: ${vendorJsFile}`);
  console.log(`    PDF Engine: ${pdfEngineJsFile}`);
  console.log(`    jsPDF Engine: ${jspdfEngineJsFile}`);
});

const entryJsContent = fs.readFileSync(path.join(distAssetsDir, entryJsFile), 'utf-8');

runTest('Entry chunk index-*.js has zero static imports of pdf-engine or jspdf-engine', () => {
  // Check static imports (import ... from '...' or import"...")
  const staticImports = entryJsContent.match(/import\s*.*?from\s*["'][^"']+["']/g) || [];
  const staticPdfImports = staticImports.filter((imp) => imp.includes('pdf-engine') || imp.includes('jspdf-engine'));
  assert(staticPdfImports.length === 0, `Found static PDF imports in entry chunk: ${staticPdfImports.join(', ')}`);
});

runTest('Entry chunk index-*.js does not inline @react-pdf/renderer or jspdf code', () => {
  // Check that heavy PDF libraries are not bundled inside index.js
  // jspdf contains recognizable signatures like jsPDF or jsPDFAPI
  assert(!entryJsContent.includes('jsPDFAPI'), 'jsPDF core appears to be bundled into entry chunk');
  // @react-pdf/renderer contains PDFDocument, StyleSheet, etc.
  assert(!entryJsContent.includes('PDFViewer'), 'PDFViewer appears in entry chunk');
});

const vendorJsContent = fs.readFileSync(path.join(distAssetsDir, vendorJsFile), 'utf-8');

runTest('Vendor chunk vendor-*.js does not contain @react-pdf/renderer or jspdf code', () => {
  assert(!vendorJsContent.includes('jsPDFAPI'), 'jsPDF core appears to be in vendor chunk');
  assert(!vendorJsContent.includes('@react-pdf'), '@react-pdf appears in vendor chunk');
});

runTest('pdf-engine chunk size and content verification', () => {
  const stat = fs.statSync(path.join(distAssetsDir, pdfEngineJsFile));
  console.log(`    pdf-engine size: ${(stat.size / 1024).toFixed(2)} KB`);
  assert(stat.size > 500 * 1024, `Expected pdf-engine chunk to be > 500 KB, got ${(stat.size / 1024).toFixed(2)} KB`);
});

runTest('jspdf-engine chunk size and content verification', () => {
  const stat = fs.statSync(path.join(distAssetsDir, jspdfEngineJsFile));
  console.log(`    jspdf-engine size: ${(stat.size / 1024).toFixed(2)} KB`);
  assert(stat.size > 200 * 1024, `Expected jspdf-engine chunk to be > 200 KB, got ${(stat.size / 1024).toFixed(2)} KB`);
});

// ---------------------------------------------------------------------------
// 2. SAMPLE ROUTINE SCHEMA & CONTENT AUDIT (4 WEEKS / 92 EXERCISES)
// ---------------------------------------------------------------------------
console.log('\n--- 2. SAMPLE ROUTINE SCHEMA & CONTENT AUDIT ---');

const sampleRoutineModule = await import('../src/constants/sampleWorkoutRoutine.js');
const routine = sampleRoutineModule.SAMPLE_WORKOUT_ROUTINE;

runTest('SAMPLE_WORKOUT_ROUTINE is exported and is an object', () => {
  assert(routine && typeof routine === 'object', 'SAMPLE_WORKOUT_ROUTINE must be a valid object');
});

runTest('Sample routine metadata contains all required fields', () => {
  assert(routine.metadata, 'Routine must have metadata object');
  const requiredMeta = ['title', 'author', 'brandName', 'objective', 'level', 'frequency', 'durationWeeks', 'notes'];
  for (const field of requiredMeta) {
    assert(routine.metadata[field] !== undefined && routine.metadata[field] !== null, `Missing metadata field: ${field}`);
    assert(String(routine.metadata[field]).trim().length > 0, `Empty metadata field: ${field}`);
  }
  assert(routine.metadata.durationWeeks === '4' || routine.metadata.durationWeeks === 4, 'durationWeeks must be 4');
});

runTest('Sample routine has exactly 4 weeks', () => {
  assert(Array.isArray(routine.weeks), 'routine.weeks must be an array');
  assert(routine.weeks.length === 4, `Expected exactly 4 weeks, got ${routine.weeks.length}`);
});

let totalExerciseCount = 0;
const allowedExerciseFields = new Set(['id', 'name', 'sets', 'reps', 'rir', 'rest', 'tempo', 'video', 'note']);
const forbiddenFields = ['duration', 'duracion', 'cadencia'];

runTest('Sample routine weeks, days, and exercises schema validation', () => {
  const seenWeekIds = new Set();
  const seenDayIds = new Set();
  const seenExIds = new Set();

  routine.weeks.forEach((week, wIdx) => {
    assert(week.id, `Week ${wIdx + 1} missing id`);
    assert(!seenWeekIds.has(week.id), `Duplicate week id: ${week.id}`);
    seenWeekIds.add(week.id);

    assert(week.title, `Week ${wIdx + 1} missing title`);
    assert(Array.isArray(week.days), `Week ${wIdx + 1} days must be an array`);
    assert(week.days.length > 0, `Week ${wIdx + 1} must have days`);

    week.days.forEach((day, dIdx) => {
      assert(day.id, `Week ${wIdx + 1} Day ${dIdx + 1} missing id`);
      assert(!seenDayIds.has(day.id), `Duplicate day id: ${day.id}`);
      seenDayIds.add(day.id);

      assert(day.name, `Week ${wIdx + 1} Day ${dIdx + 1} missing name`);
      assert(day.type, `Week ${wIdx + 1} Day ${dIdx + 1} missing type`);
      assert(Array.isArray(day.exercises), `Week ${wIdx + 1} Day ${dIdx + 1} exercises must be an array`);

      // Warmup exercises check (if present)
      if (day.warmupExercises) {
        assert(Array.isArray(day.warmupExercises), `Warmup exercises must be an array`);
        day.warmupExercises.forEach((wm) => {
          assert(wm.name && wm.name.trim().length > 0, `Warmup missing name`);
        });
      }

      day.exercises.forEach((ex, eIdx) => {
        totalExerciseCount++;
        const exContext = `Week ${wIdx + 1} Day ${dIdx + 1} Ex ${eIdx + 1} ("${ex.name || 'unnamed'}")`;

        // Check required fields
        assert(ex.id && ex.id.trim().length > 0, `${exContext} missing id`);
        assert(!seenExIds.has(ex.id), `Duplicate exercise id: ${ex.id}`);
        seenExIds.add(ex.id);

        assert(ex.name && ex.name.trim().length > 0, `${exContext} missing name`);
        assert(ex.sets && String(ex.sets).trim().length > 0, `${exContext} missing sets`);
        assert(ex.reps && String(ex.reps).trim().length > 0, `${exContext} missing reps`);
        assert(ex.rest && String(ex.rest).trim().length > 0, `${exContext} missing rest`);
        assert(ex.tempo && String(ex.tempo).trim().length > 0, `${exContext} missing tempo`);

        // Check forbidden fields
        for (const forbidden of forbiddenFields) {
          assert(!(forbidden in ex), `${exContext} contains forbidden field: "${forbidden}"`);
        }

        // Check tempo format (e.g., 3-1-1-0 or 2-0-1 or 2-0-1-0)
        assert(/^(\d(-\d){2,3})$/.test(ex.tempo), `${exContext} has invalid tempo format: "${ex.tempo}"`);

        // Check sets format
        assert(/^(\d+)(\s*[x-]\s*\d+)?$/.test(ex.sets), `${exContext} has invalid sets format: "${ex.sets}"`);

        // Check for any rogue fields not in allowedExerciseFields
        const keys = Object.keys(ex);
        for (const k of keys) {
          assert(allowedExerciseFields.has(k), `${exContext} has unrecognized field: "${k}"`);
        }
      });
    });
  });
});

runTest('Total exercise count across all 4 weeks is EXACTLY 92', () => {
  console.log(`    Total exercises counted: ${totalExerciseCount}`);
  assert(totalExerciseCount === 92, `Expected exactly 92 exercises, but counted ${totalExerciseCount}`);
});

// ---------------------------------------------------------------------------
// 2b. SAMPLE NUTRITION PLAN SCHEMA & PROMPT CONFORMANCE AUDIT
// ---------------------------------------------------------------------------
console.log('\n--- 2b. SAMPLE NUTRITION PLAN SCHEMA & PROMPT CONFORMANCE AUDIT ---');

const sampleNutritionModule = await import('../src/constants/sampleNutritionPlan.js');
const nutritionPlan = sampleNutritionModule.SAMPLE_NUTRITION_PLAN;
const nutritionTransformerModule = await import('../src/lib/transformers/nutritionTransformer.js');
const { universalImportNutrition } = nutritionTransformerModule;
const nutritionPromptModule = await import('../src/lib/nutritionPromptGenerator.js');
const { generateNutritionPrompt } = nutritionPromptModule;

runTest('SAMPLE_NUTRITION_PLAN is exported and is an object', () => {
  assert(nutritionPlan && typeof nutritionPlan === 'object', 'SAMPLE_NUTRITION_PLAN must be a valid object');
});

runTest('SAMPLE_NUTRITION_PLAN matches Prompt Maestro JSON schema', () => {
  assert(nutritionPlan.planMeta, 'Must have planMeta');
  assert(typeof nutritionPlan.planMeta.targetKcal === 'number', 'planMeta.targetKcal must be a number');
  assert(typeof nutritionPlan.planMeta.proteina_g === 'number', 'planMeta.proteina_g must be a number');
  assert(typeof nutritionPlan.planMeta.carbos_g === 'number', 'planMeta.carbos_g must be a number');
  assert(typeof nutritionPlan.planMeta.grasas_g === 'number', 'planMeta.grasas_g must be a number');
  assert(Array.isArray(nutritionPlan.weeks), 'Must have weeks array');
  assert(nutritionPlan.weeks.length === 1, 'Sample plan must have 1 week with 7 days');
  assert(nutritionPlan.weeks[0].days.length === 7, `Expected 7 days, got ${nutritionPlan.weeks[0].days.length}`);
  assert(Array.isArray(nutritionPlan.mealPrepGuide), 'Must have mealPrepGuide array');
  assert(nutritionPlan.shoppingList && typeof nutritionPlan.shoppingList === 'object', 'Must have shoppingList object');
  assert(Array.isArray(nutritionPlan.notas_semana), 'Must have notas_semana array');
});

runTest('All meals contain dual measurement (grams and relative portions)', () => {
  let mealCount = 0;
  nutritionPlan.weeks[0].days.forEach((day, dIdx) => {
    assert(day.meals && day.meals.length > 0, `Day ${dIdx + 1} has no meals`);
    day.meals.forEach((meal, mIdx) => {
      mealCount++;
      const mContext = `Day ${dIdx + 1} Meal ${mIdx + 1} ("${meal.name}")`;
      assert(meal.ingredientes && meal.ingredientes.trim().length > 0, `${mContext} missing ingredientes`);
      // Check dual measurement format: grams/ml and relative portion in parentheses
      assert(meal.ingredientes.includes('(') && meal.ingredientes.includes(')'), `${mContext} ingredientes must include relative portion in parentheses`);
      assert(meal.ingredientes.includes('g') || meal.ingredientes.includes('ml'), `${mContext} ingredientes must include grams or ml`);
    });
  });
  console.log(`    Validated dual measurements across ${mealCount} meals.`);
});

runTest('universalImportNutrition successfully processes SAMPLE_NUTRITION_PLAN', () => {
  const result = universalImportNutrition(nutritionPlan);
  assert(result.success, `Import failed: ${result.errors?.join(', ')}`);
  assert(result.data.weeks[0].days.length === 7, 'Imported plan must have 7 days');
  assert(result.data.metadata.shoppingList, 'Imported plan must preserve shoppingList');
  assert(result.data.metadata.mealPrepGuide, 'Imported plan must preserve mealPrepGuide');
  assert(result.data.metadata.quickReference?.length === 7, 'Imported plan must derive 7 days in quickReference');
});

runTest('generateNutritionPrompt mandates grams and relative portions in instructions', () => {
  const prompt = generateNutritionPrompt({ name: 'Test Plan', autor: 'Test' });
  assert(prompt.includes('GRAMOS + PORCIONES RELATIVAS CASERAS'), 'Prompt must contain relative portions rule title');
  assert(prompt.includes('taza al ras'), 'Prompt must include taza relative measure example');
  assert(prompt.includes('cucharada sopera'), 'Prompt must include cucharada relative measure example');
  assert(prompt.includes('palma de la mano'), 'Prompt must include palma de la mano relative measure example');
});

// ---------------------------------------------------------------------------
// 3. TRANSFORMER COMPATIBILITY & REVERSIBILITY
// ---------------------------------------------------------------------------
console.log('\n--- 3. TRANSFORMER COMPATIBILITY & REVERSIBILITY ---');

const transformerModule = await import('../src/lib/transformers/routineTransformer.js');
const { editorToExport, importToEditor, universalImport } = transformerModule;

runTest('editorToExport produces clean export without duration or duracion', () => {
  const exported = editorToExport(routine);
  assert(exported && Array.isArray(exported.semanas), 'Export must have semanas array');
  
  let exportExerciseCount = 0;
  for (const semana of exported.semanas) {
    for (const dia of semana.dias || []) {
      for (const bloque of dia.bloques || []) {
        for (const ex of bloque.ejercicios || []) {
          exportExerciseCount++;
          assert(!('duration' in ex), `Exported exercise has forbidden duration: ${ex.nombre}`);
          assert(!('duracion' in ex), `Exported exercise has forbidden duracion: ${ex.nombre}`);
          assert('tempo' in ex, `Exported exercise missing tempo: ${ex.nombre}`);
        }
      }
    }
  }
  assert(exportExerciseCount === 92, `Exported exercise count must be 92, got ${exportExerciseCount}`);
});

runTest('universalImport with AI format strips legacy duration/duracion and maps cadencia to tempo', () => {
  const legacyAiPayload = {
    name: 'Legacy AI Test Plan',
    metadata: { author: 'Legacy Coach', durationWeeks: '1' },
    weeks: [
      {
        name: 'Semana 1',
        days: [
          {
            name: 'Día 1',
            type: 'training',
            exercises: [
              {
                name: 'Press Banca',
                sets: '4',
                reps: '8',
                cadencia: '3-0-1-0',
                duracion: '45s',
                rest: '90s',
                notes: 'Técnica estricta',
              },
            ],
          },
        ],
      },
    ],
  };

  const importResult = universalImport(legacyAiPayload);
  assert(importResult.success === true, `universalImport failed: ${JSON.stringify(importResult.errors)}`);
  const exercise = importResult.data.weeks[0].days[0].exercises[0];

  assert(!('duration' in exercise), 'importFromAIFormat must NOT include duration');
  assert(!('duracion' in exercise), 'importFromAIFormat must NOT include duracion');
  assert(exercise.tempo === '3-0-1-0', `Expected tempo to be '3-0-1-0' mapped from cadencia, got: '${exercise.tempo}'`);
});

runTest('universalImport with Spanish format strips legacy duration/duracion and maps cadencia to tempo', () => {
  const spanishPayload = {
    id: 'test-123',
    meta: {
      nombre: 'Rutina Test',
      foco: 'Fuerza',
      nivel: 'Intermedio',
      duracion: 1,
      frecuencia: 3,
      equipamiento: 'Gimnasio',
      autor: 'Coach Test'
    },
    semanas: [
      {
        id: 'sem-1',
        nombre: 'Semana 1',
        dias: [
          {
            id: 'dia-1',
            nombre: 'Día 1',
            tipo: 'ENTRENAMIENTO',
            bloques: [
              {
                id: 'b-1',
                tipo: 'ENTRENAMIENTO',
                ejercicios: [
                  {
                    id: 'ex-1',
                    nombre: 'Sentadilla',
                    series: 3,
                    reps: '5',
                    descanso: '2min',
                    rpe: '8',
                    cadencia: '2-0-2-0',
                    duracion: '60s'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const importResult = universalImport(spanishPayload);
  assert(importResult.success === true, `importToEditor failed: ${JSON.stringify(importResult.errors)}`);
  const exercise = importResult.data.weeks[0].days[0].exercises[0];

  assert(!('duration' in exercise), 'importToEditor must NOT include duration');
  assert(!('duracion' in exercise), 'importToEditor must NOT include duracion');
  assert(exercise.tempo === '2-0-2-0', `Expected tempo '2-0-2-0', got: '${exercise.tempo}'`);
});

// ---------------------------------------------------------------------------
// 4. ADVERSARIAL BRAND RESOLUTION & WHITESPACE STRESS TESTING
// ---------------------------------------------------------------------------
console.log('\n--- 4. ADVERSARIAL BRAND RESOLUTION & WHITESPACE STRESS TESTING ---');

const pdfLayoutModule = await import('../src/pdf/utils/pdfLayout.js');
const { resolveBrandName } = pdfLayoutModule;

runTest('resolveBrandName trims leading and trailing whitespace', () => {
  const result = resolveBrandName({ metadata: { brandName: '   Elite Coach   ' } });
  assert(result === 'Elite Coach', `Expected 'Elite Coach', got '${result}'`);
});

runTest('resolveBrandName ignores whitespace-only brandName and falls back to author', () => {
  const result = resolveBrandName({ metadata: { brandName: '   \t\n   ', author: 'Author Name' } });
  assert(result === 'Author Name', `Expected 'Author Name', got '${result}'`);
});

runTest('resolveBrandName handles non-breaking spaces and unicode whitespace', () => {
  // \u00A0 is non-breaking space
  const result = resolveBrandName({ metadata: { brandName: '\u00A0\u00A0\u00A0', author: 'Coach X' } });
  assert(result === 'Coach X', `Expected fallback to 'Coach X', got '${result}'`);
});

runTest('resolveBrandName handles null, undefined, empty metadata, numbers, booleans', () => {
  assert(resolveBrandName(null) === 'Mock', 'null plan must return Mock');
  assert(resolveBrandName({}) === 'Mock', 'empty plan must return Mock');
  assert(resolveBrandName({ metadata: {} }) === 'Mock', 'empty metadata must return Mock');
  assert(resolveBrandName({ metadata: { brandName: 12345, author: 'Valid Author' } }) === 'Valid Author', 'numeric brandName must fallback');
  assert(resolveBrandName({ metadata: { brandName: false, author: 'Valid Author' } }) === 'Valid Author', 'boolean brandName must fallback');
});

runTest('resolveBrandName handles special characters and emojis cleanly', () => {
  const brand = '⚡ PowerFit <Latam> & Gym™ #1';
  const result = resolveBrandName({ metadata: { brandName: `  ${brand}  ` } });
  assert(result === brand, `Expected '${brand}', got '${result}'`);
});

runTest('resolveBrandName handles very long strings (10,000 characters)', () => {
  const longBrand = 'A'.repeat(10000);
  const result = resolveBrandName({ metadata: { brandName: `  ${longBrand}  ` } });
  assert(result.length === 10000 && result === longBrand, 'Long string should be trimmed without crashing');
});

// ---------------------------------------------------------------------------
// 5. STATIC IMPORT LEAK ANALYSIS ACROSS ALL APP ENTRY POINTS
// ---------------------------------------------------------------------------
console.log('\n--- 5. STATIC IMPORT LEAK ANALYSIS ACROSS ALL APP ENTRY POINTS ---');

const appJsPath = path.join(rootDir, 'src', 'App.jsx');
const appJsContent = fs.readFileSync(appJsPath, 'utf-8');

runTest('src/App.jsx does not statically import any PDF or editor heavy components', () => {
  const staticImports = appJsContent.match(/import\s+.*?from\s+['"][^'"]+['"]/g) || [];
  for (const imp of staticImports) {
    assert(!imp.includes('PlanRenderer'), `App.jsx statically imports PlanRenderer: ${imp}`);
    assert(!imp.includes('NutritionPlanRenderer'), `App.jsx statically imports NutritionPlanRenderer: ${imp}`);
    assert(!imp.includes('pdfGeneratorMobile'), `App.jsx statically imports pdfGeneratorMobile: ${imp}`);
    assert(!imp.includes('RoutineEditor'), `App.jsx statically imports RoutineEditor: ${imp}`);
  }
});

const homeSaaSPath = path.join(rootDir, 'src', 'pages', 'HomeSaaS.jsx');
const homeSaaSContent = fs.readFileSync(homeSaaSPath, 'utf-8');

runTest('src/pages/HomeSaaS.jsx does not statically import any PDF components or libraries', () => {
  const staticImports = homeSaaSContent.match(/import\s+.*?from\s+['"][^'"]+['"]/g) || [];
  for (const imp of staticImports) {
    assert(!imp.includes('pdf'), `HomeSaaS.jsx statically imports PDF: ${imp}`);
    assert(!imp.includes('jspdf'), `HomeSaaS.jsx statically imports jspdf: ${imp}`);
  }
});

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n====================================================');
console.log('  CHALLENGER AUDIT SUMMARY');
console.log('====================================================');
console.log(`Total tests:  ${totalTests}`);
console.log(`Passed tests: ${passedTests}`);
console.log(`Failed tests: ${failedTests}`);

if (failedTests > 0) {
  console.log('\nFailures:');
  failureDetails.forEach((f) => console.log(`- ${f.name}: ${f.error.message}`));
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL AUDIT TESTS PASSED WITH 100% SUCCESS.');
  process.exit(0);
}
