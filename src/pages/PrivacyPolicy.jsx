/**
 * src/pages/PrivacyPolicy.jsx
 * Standalone page for Mock's Privacy Policy under Ley 25.326.
 * Accessible via /politica-de-privacidad and /privacy.
 */

import { Link } from 'react-router-dom';
import { IconArrowLeft, IconBolt } from '@tabler/icons-react';
import PrivacyContent from '../components/Legal/PrivacyContent.jsx';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-primary-bg text-text-primary flex flex-col">
      {/* Top navigation header */}
      <header className="border-b border-border bg-primary-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            <IconArrowLeft stroke={1.75} className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>

          <Link to="/" className="flex items-center" title="Ir al inicio de Mock">
            <img
              src="/mz-logo-mark.PNG"
              alt="Mock"
              className="h-8 w-auto object-contain mix-blend-multiply"
            />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 sm:py-14">
        <div className="rounded-2xl border border-border bg-primary-surface p-6 sm:p-10 shadow-xl">
          <PrivacyContent showTitle={true} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-primary-surface py-6 text-center text-xs text-text-quaternary">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Mock. Todos los derechos reservados.</p>
          <Link to="/" className="hover:text-text-primary transition-colors">
            Ir al inicio de Mock
          </Link>
        </div>
      </footer>
    </div>
  );
}
