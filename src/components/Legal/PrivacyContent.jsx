/**
 * src/components/Legal/PrivacyContent.jsx
 * Render web de la Política de Privacidad conforme a la Ley 25.326.
 *
 * El texto y las cláusulas provienen de src/lib/privacyPolicy.js,
 * asegurando fuente única de verdad legal en toda la plataforma.
 */

import {
  PRIVACY_TITLE,
  PRIVACY_INTRO,
  PRIVACY_VERSION,
  PRIVACY_SECTIONS,
} from '../../lib/privacyPolicy.js';

export default function PrivacyContent({ showTitle = true, className = '' }) {
  return (
    <article className={`text-text-secondary ${className}`}>
      {showTitle && (
        <header className="border-b-2 border-text-primary pb-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary font-display">
            {PRIVACY_TITLE}
          </h1>
          <p className="mt-1 text-xs text-text-quaternary">
            Conforme a la Ley Nacional de Protección de los Datos Personales N° 25.326 (República Argentina)
          </p>
        </header>
      )}

      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {PRIVACY_INTRO}
      </p>

      <ol className="mt-6 space-y-6">
        {PRIVACY_SECTIONS.map((sec) => (
          <li key={sec.id} className="rounded-lg bg-primary-bg/40 p-4 border border-border/50">
            <h2 className="text-base font-semibold text-text-primary font-display">
              {sec.titulo}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary whitespace-pre-line">
              {sec.cuerpo}
            </p>
            {sec.base && (
              <p className="mt-2 text-xs italic text-text-tertiary">
                Fundamento legal: {sec.base}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-lg border border-accent/30 bg-accent/5 p-4">
        <h3 className="text-sm font-semibold text-accent">
          Canal de Atención de Derechos ARCO y Consultas
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          Para ejercer sus derechos de acceso, rectificación, actualización o supresión conforme a los artículos 14 y 16 de la Ley 25.326, envíe una comunicación con acreditación de identidad a{' '}
          <a
            href="mailto:privacidad@mock.app"
            className="text-accent underline font-medium hover:text-accent-light"
          >
            privacidad@mock.app
          </a>
          .
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-text-quaternary">
        Mock — Política de Privacidad v{PRIVACY_VERSION}. República Argentina.
      </p>
    </article>
  );
}
