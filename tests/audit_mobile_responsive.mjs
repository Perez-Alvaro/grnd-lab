import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('====================================================');
console.log('  MOBILE-FIRST RESPONSIVE AUDIT & INTEGRITY SUITE   ');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// 1. Viewport Meta in index.html
test('index.html has viewport-fit=cover for mobile safe areas', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('viewport-fit=cover'), 'index.html must include viewport-fit=cover');
});

// 2. HomeSaaS Hero Title
test('HomeSaaS.jsx uses responsive title scaling down to 320px', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('text-3xl sm:text-5xl lg:text-6xl'), 'Hero title should use text-3xl on small mobile');
});

// 3. HomeSaaS Hero PDF Badge on Mobile
test('HomeSaaS.jsx provides mobile-accessible PDF export badge', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('sm:hidden mt-3 flex items-center justify-center gap-2.5'), 'Mobile PDF badge must be present');
});

// 4. HomeSaaS Messy Excel Mockup Scroll Indicator
test('HomeSaaS.jsx MessyExcelMockup has mobile scroll indicator', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('Deslizá para ver más →'), 'Spreadsheet must inform mobile users of horizontal scroll');
});

// 5. RoutineEditor Bottom Safe Area & Content Padding
test('RoutineEditor.jsx has generous mobile bottom padding to prevent bar overlap', () => {
  const content = fs.readFileSync('src/pages/RoutineEditor.jsx', 'utf8');
  assert.ok(content.includes('pb-36 sm:p-6 lg:pb-8'), 'Content container must have pb-36 on mobile');
  assert.ok(content.includes('safe-area-inset-bottom'), 'Bottom bar must respect safe-area-inset-bottom');
});

// 6. WeekEditor DayRow Reorder Controls
test('WeekEditor.jsx DayRow uses responsive compact reorder buttons on mobile', () => {
  const content = fs.readFileSync('src/components/Trainer/editor/WeekEditor.jsx', 'utf8');
  assert.ok(content.includes('h-8 w-8 sm:h-11 sm:w-11'), 'DayRow reorder buttons must scale down to h-8 w-8 on mobile');
});

// 7. DayEditor Container Padding
test('DayEditor.jsx uses compact padding on mobile', () => {
  const content = fs.readFileSync('src/components/Trainer/editor/DayEditor.jsx', 'utf8');
  assert.ok(content.includes('p-3.5 sm:p-5'), 'DayEditor should use p-3.5 on mobile');
});

// 8. ExerciseEditor Stepper Responsive Sizing
test('ExerciseEditor.jsx Stepper scales down on mobile to avoid input crushing', () => {
  const content = fs.readFileSync('src/components/Trainer/editor/ExerciseEditor.jsx', 'utf8');
  assert.ok(content.includes('h-8 w-8 sm:h-11 sm:w-11'), 'Stepper buttons must scale down to h-8 w-8 on mobile');
  assert.ok(content.includes('h-9 sm:h-11 min-w-[32px]'), 'Stepper input must have min-w-[32px]');
});

// 9. ExerciseEditor RIR/Rest/Tempo Grid
test('ExerciseEditor.jsx RIR/Rest/Tempo uses responsive 2-column mobile grid', () => {
  const content = fs.readFileSync('src/components/Trainer/editor/ExerciseEditor.jsx', 'utf8');
  assert.ok(content.includes('grid grid-cols-2 sm:grid-cols-3'), 'Parameters must use grid-cols-2 on mobile');
});

// 10. MealEditor Variants Macros Grid
test('MealEditor.jsx variants macros grid uses responsive 2-column mobile grid', () => {
  const content = fs.readFileSync('src/components/Trainer/editor/MealEditor.jsx', 'utf8');
  assert.ok(content.includes('grid grid-cols-2 sm:grid-cols-4'), 'Variants macros must use grid-cols-2 on mobile');
});

// 11. WeekPreview Metrics Grid
test('WeekPreview.jsx metrics grid wraps on mobile without truncating units', () => {
  const content = fs.readFileSync('src/components/Trainer/preview/WeekPreview.jsx', 'utf8');
  assert.ok(content.includes('grid grid-cols-3 sm:grid-cols-5'), 'Week preview metrics must use grid-cols-3 on mobile');
});

// 12. PDFExportModal Mobile Accessibility
test('PDFExportModal.jsx has max-h-90dvh and mobile touch targets', () => {
  const content = fs.readFileSync('src/components/Editor/PDFExportModal.jsx', 'utf8');
  assert.ok(content.includes('max-h-[90dvh] overflow-y-auto'), 'Modal must have max-h-[90dvh] and scroll');
});

// 13. HomeSaaS Content Sections Scroll Margin Anchor
test('HomeSaaS.jsx #problema, #servicios, #how-it-works have scroll-mt-20', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('id="problema"\n            className="scroll-mt-20') || content.includes('id="problema" className="scroll-mt-20') || content.includes('id="problema"\r\n            className="scroll-mt-20'), '#problema must have scroll-mt-20');
  assert.ok(content.includes('id="servicios"\n            className="scroll-mt-20') || content.includes('id="servicios" className="scroll-mt-20') || content.includes('id="servicios"\r\n            className="scroll-mt-20'), '#servicios must have scroll-mt-20');
  assert.ok(content.includes('id="how-it-works"\n            className="scroll-mt-20') || content.includes('id="how-it-works" className="scroll-mt-20') || content.includes('id="how-it-works"\r\n            className="scroll-mt-20'), '#how-it-works must have scroll-mt-20');
});

// 14. HomeSaaS #problema Column Overflow & Mobile Swipe Carousel
test('HomeSaaS.jsx #problema has min-w-0 overflow-hidden and mobile swipe carousel with dots', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('lg:col-span-6 min-w-0 overflow-hidden'), 'Mockup column must have min-w-0 overflow-hidden');
  assert.ok(content.includes('snap-x snap-mandatory flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none'), 'Mobile pain points must use swipe carousel');
  assert.ok(content.includes('activePainIndex'), 'Pain carousel must track active slide with dot indicators');
});

// 15. HomeSaaS #servicios Compact Padding and Lazy Loaded Image
test('HomeSaaS.jsx #servicios uses compact py-10 lg:py-20 and lazy image with dimensions', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('py-10 lg:py-20'), '#servicios must have py-10 lg:py-20 padding');
  assert.ok(content.includes('mb-6 lg:mb-12'), '#servicios header must have mb-6 lg:mb-12');
  assert.ok(content.includes('src="/assets/paso-2.png"'), '#servicios must include paso-2.png');
  assert.ok(content.includes('width={703}') && content.includes('height={900}'), 'paso-2.png must have explicit width and height');
  assert.ok(content.includes('aspect-[703/900]'), 'paso-2.png must have explicit aspect-ratio');
});

// 16. HomeSaaS #how-it-works 3 Sketch Steps and Mobile Stepper
test('HomeSaaS.jsx #how-it-works has mobile 1-2-3 progress pills and sketch-aligned 3 steps', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes("title: 'Respondé las preguntas'"), 'Step 1 title must match sketch');
  assert.ok(content.includes("title: 'Copiá y pegá en la IA que quieras'"), 'Step 2 title must match sketch');
  assert.ok(content.includes("title: 'Volvé, pegá la respuesta y listo'"), 'Step 3 title must match sketch');
  assert.ok(content.includes('Mobile visual 1 → 2 → 3 progress stepper pills'), 'Must include mobile visual 1-2-3 stepper');
});

// 17. HomeSaaS #pricing Mobile Segmented Toggle, Active Pro on Top, Compact Free Tier & ARS Badges
test('HomeSaaS.jsx #pricing has mobile segmented toggle, active Pro on top, compact free banner & ARS badges', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes("billingCycle === 'monthly'"), 'Pricing toggle must support monthly billing switch');
  assert.ok(content.includes("billingCycle === 'annual'"), 'Pricing toggle must support annual billing switch');
  assert.ok(content.includes('Ahorrás 33%'), 'Pricing toggle must display 33% savings badge');
  assert.ok(content.includes('¿Querés empezar sin costo?'), 'Must render compact Plan Inicial banner');
  assert.ok(content.includes('Plan Inicial: 3 rutinas gratis sin tarjeta'), 'Compact banner must inform about 3 free routines');
  assert.ok(content.includes('Cobro en pesos (ARS) por transferencia bancaria (CBU/CVU) o Mercado Pago'), 'Must render ARS CBU/CVU/MP trust badge');
  assert.ok(content.includes('Sin débitos automáticos sorpresa ni impuestos al dólar'), 'Must render no surprise debit badge');
  assert.ok(content.includes('hidden md:grid md:grid-cols-3'), 'Desktop view must retain 3 side-by-side columns intact');
});

// 18. HomeSaaS Section Anchors & IDs with scroll-mt-20
test('HomeSaaS.jsx has scroll-mt-20 on all target sections and #benefits alias', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('id="problema"') && content.includes('scroll-mt-20'), '#problema must have scroll-mt-20');
  assert.ok(content.includes('id="servicios"') && content.includes('scroll-mt-20'), '#servicios must have scroll-mt-20');
  assert.ok(content.includes('id="benefits"') && content.includes('scroll-mt-20'), '#benefits must exist and have scroll-mt-20');
  assert.ok(content.includes('id="how-it-works"') && content.includes('scroll-mt-20'), '#how-it-works must have scroll-mt-20');
  assert.ok(content.includes('id="pricing"') && content.includes('scroll-mt-20'), '#pricing must have scroll-mt-20');
  assert.ok(content.includes('id="faq"') && content.includes('scroll-mt-20'), '#faq must have scroll-mt-20');
  assert.ok(content.includes('id="contact"') && content.includes('scroll-mt-20'), '#contact must have scroll-mt-20');
});

// 19. FAQ Component Touch Safety & Min 48px Hitbox
test('FAQ.jsx has touch-safe styles, min-h-[48px], p-4, chevron rotation, and default open', () => {
  const faqContent = fs.readFileSync('src/components/ui/FAQ.jsx', 'utf8');
  assert.ok(faqContent.includes('min-h-[48px]'), 'FAQ buttons must have min-h-[48px]');
  assert.ok(faqContent.includes('p-4'), 'FAQ buttons must have p-4 padding');
  assert.ok(faqContent.includes('rotate-180'), 'FAQ chevron must have rotate-180 for active state');
  assert.ok(faqContent.includes('defaultOpen = 0'), 'FAQ must default to first question open');
  assert.ok(faqContent.includes('sm:hover:'), 'FAQ hover styles must be touch-safe (scoped to desktop hover)');
});

// 20. Sticky Mobile CTA Bar Component
test('HomeSaaS.jsx includes StickyMobileCTA with safe areas, scroll trigger, and onSignup', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('function StickyMobileCTA'), 'StickyMobileCTA component must be defined');
  assert.ok(content.includes('window.scrollY > 450'), 'StickyMobileCTA must trigger when scrollY > 450');
  assert.ok(content.includes('fixed bottom-0 left-0 right-0 z-40'), 'StickyMobileCTA must be fixed at bottom');
  assert.ok(content.includes('pb-[max(0.75rem,env(safe-area-inset-bottom))]'), 'StickyMobileCTA must handle iOS safe area inset');
  assert.ok(content.includes('BaseRutina'), 'StickyMobileCTA must display BaseRutina brand name');
  assert.ok(content.includes('3 rutinas gratis · Sin tarjeta'), 'StickyMobileCTA must highlight free offer without credit card');
  assert.ok(content.includes('Probar gratis'), 'StickyMobileCTA must feature Probar gratis action button');
  assert.ok(content.includes('<StickyMobileCTA'), 'StickyMobileCTA must be mounted in HomeSaaS');
});

// 21. Footer Mobile Spacing & Link Hitboxes
test('HomeSaaS.jsx footer has pb-24 md:pb-12 and min 44px link touch targets', () => {
  const content = fs.readFileSync('src/pages/HomeSaaS.jsx', 'utf8');
  assert.ok(content.includes('pb-24 md:pb-12'), 'Footer must have pb-24 on mobile to prevent Sticky CTA overlap');
  assert.ok(content.includes('py-2.5 px-2'), 'Footer links must have py-2.5 px-2 for touch hitbox');
  assert.ok(content.includes('min-h-[44px]'), 'Footer links must guarantee min-h-[44px]');
  assert.ok(content.includes('cGVyZXphbHZhcm9yYXVsMjZAZ21haWwuY29t'), 'Footer email must be perezalvaroraul26@gmail.com');
});

console.log('\n====================================================');
console.log(`Total tests:  ${passed + failed}`);
console.log(`Passed tests: ${passed}`);
console.log(`Failed tests: ${failed}`);
console.log('====================================================\n');

if (failed > 0) process.exit(1);

