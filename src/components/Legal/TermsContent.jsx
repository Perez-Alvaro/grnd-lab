/**
 * src/components/Legal/TermsContent.jsx
 * Render web de los Términos y Condiciones.
 *
 * El texto sale de src/lib/legalTerms.js — la MISMA fuente que imprime el PDF,
 * así lo que el coach acepta al registrarse es literalmente lo que después
 * aparece en los planes que entrega.
 */
import {
  buildTermsClauses,
  TERMS_TITLE,
  TERMS_INTRO,
  TERMS_ACCEPTANCE,
  TERMS_VERSION,
} from '../../lib/legalTerms.js';

export default function TermsContent({ variant = 'general', showTitle = true }) {
  const clausulas = buildTermsClauses({ variant });

  return (
    <article className="text-text-secondary">
      {showTitle && (
        <header className="border-b-2 border-text-primary pb-2">
          <h2 className="text-base font-bold tracking-wide text-text-primary font-display">
            {TERMS_TITLE}
          </h2>
        </header>
      )}
      <p className="mt-3 text-xs text-text-tertiary">{TERMS_INTRO}</p>

      <ol className="mt-5 space-y-5">
        {clausulas.map((c) => (
          <li key={c.n}>
            <h3 className="text-sm font-semibold text-text-primary">
              {c.n}. {c.titulo}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{c.cuerpo}</p>
            <p className="mt-1.5 text-xs italic text-text-tertiary">Fundamento: {c.base}</p>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-md border border-border p-4">
        <p className="text-sm leading-relaxed text-text-secondary">
          <span className="font-semibold text-text-primary">Aceptación. </span>
          {TERMS_ACCEPTANCE}
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-text-quaternary">
        Mock — Términos y condiciones v{TERMS_VERSION}. República Argentina.
      </p>
    </article>
  );
}
