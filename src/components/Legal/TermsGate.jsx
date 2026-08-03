/**
 * src/components/Legal/TermsGate.jsx
 * Compuerta de aceptación de los Términos y Condiciones.
 *
 * Cubre los dos casos que el checkbox del registro no alcanza:
 *   • Usuarios que ya existían antes de que hubiera T&C.
 *   • Altas donde la aceptación no se pudo grabar en el momento (por ejemplo,
 *     cuando la cuenta necesita confirmación por email y todavía no hay sesión).
 *   • Cambios de versión del texto (TERMS_VERSION).
 *
 * Es bloqueante a propósito: sin aceptar no se usa la app. No tiene botón de
 * cerrar ni se cierra con Escape; la única salida alternativa es cerrar sesión.
 */
import { useCallback, useEffect, useState } from 'react';
import { IconFileText } from '@tabler/icons-react';
import { useAuth } from '../../store/authStore.jsx';
import { getMyTermsStatus, acceptTerms } from '../../lib/terms.js';
import { Button } from '../ui';
import TermsContent from './TermsContent.jsx';

export default function TermsGate() {
  const { user, logout } = useAuth();
  const [pendiente, setPendiente] = useState(false);
  const [aceptando, setAceptando] = useState(false);
  const [marcado, setMarcado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let vivo = true;
    if (!user) {
      setPendiente(false);
      return undefined;
    }
    getMyTermsStatus()
      .then((s) => { if (vivo) setPendiente(s.pendiente); })
      .catch(() => { if (vivo) setPendiente(false); }); // ante duda, no bloquear
    return () => { vivo = false; };
  }, [user]);

  const confirmar = useCallback(async () => {
    setAceptando(true);
    setError('');
    try {
      await acceptTerms();
      setPendiente(false);
    } catch (e) {
      setError(e.message || 'No se pudo registrar la aceptación. Probá de nuevo.');
    } finally {
      setAceptando(false);
    }
  }, []);

  if (!user || !pendiente) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-gate-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-md border border-border bg-primary-surface shadow-2xl">
        <header className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-accent/10">
            <IconFileText stroke={1.75} className="h-5 w-5 text-accent" />
          </div>
          <div className="min-w-0">
            <h2 id="terms-gate-title" className="text-base font-bold text-text-primary font-display">
              Actualizamos los términos y condiciones
            </h2>
            <p className="mt-0.5 text-sm text-text-tertiary">
              Para seguir usando Mock necesitamos que los leas y los aceptes.
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <TermsContent showTitle={false} />
        </div>

        <footer className="space-y-3 border-t border-border px-5 py-4 sm:px-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={marcado}
              onChange={(e) => setMarcado(e.target.checked)}
              disabled={aceptando}
              className="mt-0.5 h-5 w-5 flex-shrink-0 accent-accent"
            />
            <span className="text-xs leading-relaxed text-text-secondary">
              Leí y acepto los términos y condiciones. Entiendo que Mock es una herramienta
              de asistencia y que soy el único responsable profesional de los planes que
              genere y entregue.
            </span>
          </label>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={logout} disabled={aceptando} className="w-full sm:w-auto">
              Cerrar sesión
            </Button>
            <Button onClick={confirmar} loading={aceptando} disabled={!marcado} className="w-full sm:w-auto">
              Aceptar y continuar
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
