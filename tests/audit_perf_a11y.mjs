/**
 * tests/audit_perf_a11y.mjs
 * Comprehensive Empirical Verification Suite for Agente 4: Performance, Assets & Accessibility (A11y).
 * Run via: node tests/audit_perf_a11y.mjs
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('  AGENTE 4: PERF, ASSETS & A11Y EMPIRICAL AUDIT     ');
console.log('====================================================\n');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}: ${err.message}`);
    failed++;
    failures.push({ name, err });
  }
}

// ---------------------------------------------------------------------------
// 1. DOTGRID KILL-SWITCH & REDUCED MOTION AUDIT
// ---------------------------------------------------------------------------
console.log('--- 1. DOTGRID CANVAS KILL-SWITCH & REDUCED MOTION ---');

const dotGridPath = path.join(rootDir, 'src', 'components', 'ui', 'DotGrid.jsx');
const dotGridContent = fs.readFileSync(dotGridPath, 'utf8');

test('DotGrid.jsx defines checkDisabled with mobile (<768px) and prefers-reduced-motion checks', () => {
  assert.ok(dotGridContent.includes('const checkDisabled'), 'Must define checkDisabled');
  assert.ok(dotGridContent.includes('innerWidth < 768'), 'Must check window.innerWidth < 768');
  assert.ok(dotGridContent.includes('prefers-reduced-motion: reduce'), 'Must check prefers-reduced-motion media query');
});

test('DotGrid.jsx manages isDisabled state and listens to resize and media query changes', () => {
  assert.ok(dotGridContent.includes('const [isDisabled, setIsDisabled] = useState(checkDisabled)'), 'Must initialize isDisabled state with checkDisabled');
  assert.ok(dotGridContent.includes("window.addEventListener('resize', updateDisabled)"), 'Must attach resize listener');
  assert.ok(dotGridContent.includes("window.removeEventListener('resize', updateDisabled)"), 'Must cleanup resize listener');
  assert.ok(dotGridContent.includes("mql.addEventListener('change', updateDisabled)") || dotGridContent.includes("mql?.addEventListener('change', updateDisabled)"), 'Must attach reduced motion media query listener');
});

test('DotGrid.jsx cancels requestAnimationFrame on effect cleanup and disables rAF loop when disabled', () => {
  assert.ok(dotGridContent.includes('cancelAnimationFrame(rafId)'), 'Must cancel active requestAnimationFrame on cleanup');
  assert.ok(dotGridContent.includes('if (isDisabled || !circlePath)'), 'Must guard animation loop when isDisabled is true');
  assert.ok(dotGridContent.includes('ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)'), 'Must clear canvas when disabled');
});

test('DotGrid.jsx skips buildGrid and pointer event listeners when isDisabled is true', () => {
  assert.ok(dotGridContent.includes('if (isDisabled) return;\n        buildGrid()') || dotGridContent.includes('if (isDisabled) return;\r\n        buildGrid()'), 'buildGrid effect must guard isDisabled');
  assert.ok(dotGridContent.includes('if (isDisabled) return;\n\n        const onMove') || dotGridContent.includes('if (isDisabled) return;\r\n\r\n        const onMove'), 'pointer events effect must guard isDisabled');
});

// ---------------------------------------------------------------------------
// 2. HOMESAAS HERO DOT PATTERN & RESPONSIVE RENDER
// ---------------------------------------------------------------------------
console.log('\n--- 2. HOMESAAS HERO BACKGROUND & STATIC MOBILE DOT PATTERN ---');

const homeSaaSPath = path.join(rootDir, 'src', 'pages', 'HomeSaaS.jsx');
const homeSaaSContent = fs.readFileSync(homeSaaSPath, 'utf8');

test('HomeSaaS.jsx HeroSection renders static CSS dot pattern on mobile (<md)', () => {
  assert.ok(homeSaaSContent.includes('block md:hidden absolute inset-0'), 'Static dot pattern must be block on mobile and hidden on md+');
  assert.ok(homeSaaSContent.includes('radial-gradient(rgb(var(--c-border-strong)) 1.2px, transparent 1.2px)'), 'Must use lightweight radial-gradient dots');
  assert.ok(homeSaaSContent.includes("backgroundSize: '20px 20px'"), 'Must set 20px 20px backgroundSize');
  assert.ok(homeSaaSContent.includes('aria-hidden="true"'), 'Static dot background must have aria-hidden="true"');
});

test('HomeSaaS.jsx HeroSection renders DotGrid with hidden md:block', () => {
  assert.ok(homeSaaSContent.includes('<DotGrid\n                    className="hidden md:block"') || homeSaaSContent.includes('<DotGrid\r\n                    className="hidden md:block"'), 'DotGrid must be hidden on mobile and only block on md+');
});

// ---------------------------------------------------------------------------
// 3. IMAGES, LCP & CLS ATTRIBUTES AUDIT
// ---------------------------------------------------------------------------
console.log('\n--- 3. IMAGES, LCP & CLS ATTRIBUTES AUDIT ---');

test('Hero editor image /assets/editor.png has fetchpriority="high", dimensions, aspect ratio, and async decoding', () => {
  assert.ok(homeSaaSContent.includes('src="/assets/editor.png"'), 'Must reference editor.png');
  assert.ok(homeSaaSContent.includes('fetchPriority="high"') || homeSaaSContent.includes('fetchpriority="high"'), 'Must have fetchPriority="high"');
  assert.ok(homeSaaSContent.includes('width={1919}') && homeSaaSContent.includes('height={910}'), 'Must have explicit width={1919} height={910}');
  assert.ok(homeSaaSContent.includes('aspect-[1919/910]'), 'Must have aspect-[1919/910]');
  assert.ok(homeSaaSContent.includes('decoding="async"'), 'Must have decoding="async"');
  assert.ok(homeSaaSContent.includes('loading="eager"'), 'Must have loading="eager" for above-the-fold LCP image');
});

test('Below-the-fold /assets/paso-2.png has width, height, aspect ratio, lazy loading, and async decoding', () => {
  assert.ok(homeSaaSContent.includes('src="/assets/paso-2.png"'), 'Must reference paso-2.png');
  assert.ok(homeSaaSContent.includes('width={703}') && homeSaaSContent.includes('height={900}'), 'Must have explicit width={703} height={900}');
  assert.ok(homeSaaSContent.includes('aspect-[703/900]'), 'Must have aspect-[703/900]');
  assert.ok(homeSaaSContent.includes('loading="lazy"'), 'Must have loading="lazy"');
  assert.ok(homeSaaSContent.includes('decoding="async"'), 'Must have decoding="async"');
});

test('Below-the-fold /assets/herobg.png is rendered as img with explicit width, height, lazy loading, and async decoding', () => {
  assert.ok(homeSaaSContent.includes('src="/assets/herobg.png"'), 'Must reference herobg.png');
  assert.ok(homeSaaSContent.includes('width={1920}') && homeSaaSContent.includes('height={1080}'), 'Must have explicit width={1920} height={1080}');
  assert.ok(homeSaaSContent.includes('loading="lazy"'), 'Must have loading="lazy"');
  assert.ok(homeSaaSContent.includes('decoding="async"'), 'Must have decoding="async"');
});

test('Navbar and footer logos have explicit width, height, and async decoding', () => {
  const logoMatches = homeSaaSContent.match(/src="\/mz-logo-mark\.PNG"/g) || [];
  assert.ok(logoMatches.length >= 2, 'Must have at least 2 logo instances in HomeSaaS (navbar and footer)');
  assert.ok(homeSaaSContent.includes('width={144}') && homeSaaSContent.includes('height={36}'), 'Logo must have explicit dimensions');
  assert.ok(homeSaaSContent.includes('decoding="async"'), 'Logo must have decoding="async"');
});

// ---------------------------------------------------------------------------
// 4. ACCESSIBILITY: WCAG AA COLOR CONTRAST (>= 4.5:1)
// ---------------------------------------------------------------------------
console.log('\n--- 4. ACCESSIBILITY: WCAG AA COLOR CONTRAST ---');

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = relativeLuminance(...rgb1) + 0.05;
  const l2 = relativeLuminance(...rgb2) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

const themeCss = fs.readFileSync(path.join(rootDir, 'src', 'styles', 'theme.css'), 'utf8');

function extractRgbVar(varName) {
  const regex = new RegExp(`${varName}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+)`);
  const match = themeCss.match(regex);
  assert.ok(match, `Could not find RGB values for ${varName} in theme.css`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

const cBg = extractRgbVar('--c-bg'); // [247, 248, 250]
const cSurface = extractRgbVar('--c-surface'); // [255, 255, 255]
const cTextPrimary = extractRgbVar('--c-text-primary');
const cTextSecondary = extractRgbVar('--c-text-secondary');
const cTextTertiary = extractRgbVar('--c-text-tertiary');
const cTextAccent = extractRgbVar('--c-text-accent');

test('--c-text-primary satisfies WCAG AA contrast against --c-bg and --c-surface (>= 4.5:1)', () => {
  const ratioBg = contrastRatio(cTextPrimary, cBg);
  const ratioSurface = contrastRatio(cTextPrimary, cSurface);
  console.log(`    Primary text ratio vs bg: ${ratioBg.toFixed(2)}:1, vs surface: ${ratioSurface.toFixed(2)}:1`);
  assert.ok(ratioBg >= 4.5, `Primary text against bg must be >= 4.5:1, got ${ratioBg}`);
  assert.ok(ratioSurface >= 4.5, `Primary text against surface must be >= 4.5:1, got ${ratioSurface}`);
});

test('--c-text-secondary satisfies WCAG AA contrast against --c-bg and --c-surface (>= 4.5:1)', () => {
  const ratioBg = contrastRatio(cTextSecondary, cBg);
  const ratioSurface = contrastRatio(cTextSecondary, cSurface);
  console.log(`    Secondary text ratio vs bg: ${ratioBg.toFixed(2)}:1, vs surface: ${ratioSurface.toFixed(2)}:1`);
  assert.ok(ratioBg >= 4.5, `Secondary text against bg must be >= 4.5:1, got ${ratioBg}`);
  assert.ok(ratioSurface >= 4.5, `Secondary text against surface must be >= 4.5:1, got ${ratioSurface}`);
});

test('--c-text-tertiary satisfies WCAG AA contrast against --c-bg and --c-surface (>= 4.5:1)', () => {
  const ratioBg = contrastRatio(cTextTertiary, cBg);
  const ratioSurface = contrastRatio(cTextTertiary, cSurface);
  console.log(`    Tertiary text ratio vs bg: ${ratioBg.toFixed(2)}:1, vs surface: ${ratioSurface.toFixed(2)}:1`);
  assert.ok(ratioBg >= 4.5, `Tertiary text against bg must be >= 4.5:1, got ${ratioBg}`);
  assert.ok(ratioSurface >= 4.5, `Tertiary text against surface must be >= 4.5:1, got ${ratioSurface}`);
});

test('--c-text-accent satisfies WCAG AA contrast against --c-bg and --c-surface (>= 4.5:1)', () => {
  const ratioBg = contrastRatio(cTextAccent, cBg);
  const ratioSurface = contrastRatio(cTextAccent, cSurface);
  console.log(`    Accent text ratio vs bg: ${ratioBg.toFixed(2)}:1, vs surface: ${ratioSurface.toFixed(2)}:1`);
  assert.ok(ratioBg >= 4.5, `Accent text against bg must be >= 4.5:1, got ${ratioBg}`);
  assert.ok(ratioSurface >= 4.5, `Accent text against surface must be >= 4.5:1, got ${ratioSurface}`);
});

// ---------------------------------------------------------------------------
// 5. ACCESSIBILITY: TOUCH HITBOXES (>= 44x44px) & ARIA LABELS
// ---------------------------------------------------------------------------
console.log('\n--- 5. TOUCH HITBOXES & ARIA LABELS ---');

test('Navbar brand button and desktop nav links have min 44px touch hitbox', () => {
  assert.ok(homeSaaSContent.includes('aria-label="Mock - Inicio"'), 'Brand button must have aria-label');
  assert.ok(homeSaaSContent.includes('min-h-[44px] min-w-[44px]'), 'Brand button must have min 44x44px hitbox');
  assert.ok(homeSaaSContent.includes('min-h-[44px] flex items-center px-2'), 'Desktop nav links must have min-h-[44px]');
});

test('Navbar mobile buttons and toggle have min 44x44px touch hitbox and dynamic aria-label', () => {
  assert.ok(homeSaaSContent.includes('h-10 min-h-[44px] min-w-[44px]'), 'Mobile action button must have min-h-[44px] min-w-[44px]');
  assert.ok(homeSaaSContent.includes('aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}'), 'Mobile menu toggle must have descriptive dynamic aria-label');
  assert.ok(homeSaaSContent.includes('min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary'), 'Toggle must have min-w-[44px] min-h-[44px]');
});

test('Plan Inicial CTA and footer copy email buttons have min 44px touch hitbox', () => {
  assert.ok(homeSaaSContent.includes('py-1 px-2 min-h-[44px]'), 'Plan Inicial button and footer copy button must have min-h-[44px]');
});

test('StickyMobileCTA button has min 44px touch hitbox', () => {
  assert.ok(homeSaaSContent.includes('h-11 min-h-[44px] px-4'), 'StickyMobileCTA button must have h-11 min-h-[44px]');
});

test('Modal and LoginModal close buttons have min 44x44px hitbox and descriptive aria-labels', () => {
  const modalContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'ui', 'Modal.jsx'), 'utf8');
  assert.ok(modalContent.includes('min-h-[44px] min-w-[44px]'), 'Modal close button must have min 44x44px hitbox');
  assert.ok(modalContent.includes('aria-label="Cerrar modal"'), 'Modal close button must have aria-label="Cerrar modal"');

  const loginModalContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Auth', 'LoginModal.jsx'), 'utf8');
  assert.ok(loginModalContent.includes('min-w-[44px] min-h-[44px]'), 'LoginModal close button must have min 44x44px hitbox');
  assert.ok(loginModalContent.includes('aria-label="Cerrar modal"'), 'LoginModal close button must have aria-label="Cerrar modal"');
  assert.ok(loginModalContent.includes("aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}"), 'Password toggle must have descriptive aria-label');
});

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n====================================================');
console.log(`Total tests:  ${passed + failed}`);
console.log(`Passed tests: ${passed}`);
console.log(`Failed tests: ${failed}`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL AGENTE 4 PERF & A11Y AUDIT TESTS PASSED WITH 100% SUCCESS.\n');
  process.exit(0);
}
