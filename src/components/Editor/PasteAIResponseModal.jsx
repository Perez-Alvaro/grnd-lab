import { useState, useCallback, useEffect } from 'react';
import { IconClipboardText, IconAlertCircle, IconSparkles, IconUpload, IconCheck } from '@tabler/icons-react';
import Modal, { ModalFooter } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { universalImport } from '../../lib/transformers/routineTransformer.js';
import { parsePlanJSON } from '../../lib/planJson.js';

export default function PasteAIResponseModal({ open, onClose, onImport, planNoun = 'rutina' }) {
    const [rawText, setRawText] = useState('');
    const [error, setError] = useState('');
    const [pastedAuto, setPastedAuto] = useState(false);
    const [showFileFallback, setShowFileFallback] = useState(false);

    // Intentar leer automáticamente el portapapeles al abrir el modal si está disponible
    useEffect(() => {
        if (!open) {
            setRawText('');
            setError('');
            setPastedAuto(false);
            setShowFileFallback(false);
            return;
        }

        let isMounted = true;
        const tryAutoPaste = async () => {
            try {
                if (navigator?.clipboard?.readText) {
                    const text = await navigator.clipboard.readText();
                    if (isMounted && text && text.trim().startsWith('{')) {
                        setRawText(text.trim());
                        setPastedAuto(true);
                    }
                }
            } catch {
                // Permiso denegado o no soportado: el usuario pega manualmente
            }
        };

        tryAutoPaste();
        return () => { isMounted = false; };
    }, [open]);

    const handleProcessText = useCallback((textToProcess) => {
        const text = (textToProcess ?? rawText).trim();
        if (!text) {
            setError('Pegá la respuesta de la IA para continuar.');
            return;
        }

        setError('');
        const parsed = parsePlanJSON(text);
        if (!parsed.ok) {
            setError(parsed.error || 'No se pudo interpretar el formato. Asegurate de copiar desde la primera { hasta la última }.');
            return;
        }

        const result = universalImport(parsed.data);
        if (!result.success || !result.data) {
            setError(result.errors?.[0] || 'El JSON de la IA no contiene una estructura de rutina o plan válida.');
            return;
        }

        onImport(result.data);
        onClose();
    }, [rawText, onImport, onClose]);

    const handlePasteFromClipboardBtn = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                setRawText(text.trim());
                setPastedAuto(true);
                handleProcessText(text.trim());
            } else {
                setError('El portapapeles está vacío. Copiá primero la respuesta de la IA.');
            }
        } catch {
            setError('No pudimos acceder automáticamente al portapapeles. Pegá el texto con Ctrl/Cmd + V en el campo.');
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            setRawText(text);
            handleProcessText(text);
        } catch (err) {
            setError(`Error al leer el archivo: ${err.message}`);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Pegar respuesta de la IA`}
            size="md"
        >
            <div className="space-y-4">
                <div className="flex items-start gap-2.5 rounded-xl bg-accent/10 border border-accent/25 p-3.5">
                    <IconSparkles stroke={1.75} className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                        Copiá la respuesta completa de tu IA y pegala acá (con el botón o <strong className="text-text-primary">Ctrl/Cmd+V</strong>).
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            Respuesta de la IA (JSON)
                        </label>
                        <button
                            type="button"
                            onClick={handlePasteFromClipboardBtn}
                            className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                        >
                            <IconClipboardText stroke={1.75} className="h-3.5 w-3.5" />
                            Pegar desde portapapeles
                        </button>
                    </div>

                    <textarea
                        value={rawText}
                        onChange={(e) => {
                            setRawText(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder={`Pegá acá lo que te respondió ChatGPT, Claude o Gemini…`}
                        className="w-full min-h-[170px] max-h-[40vh] rounded-xl border border-border bg-primary-bg p-3.5 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-y"
                        autoFocus
                    />
                </div>

                {pastedAuto && (
                    <div className="flex items-center gap-2 text-xs text-accent font-medium">
                        <IconCheck stroke={2} className="h-4 w-4" />
                        <span>Detectamos y pegamos el contenido de tu portapapeles automáticamente.</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                        <IconAlertCircle stroke={1.75} className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                    </div>
                )}

                {/* Alternativa secundaria: archivo JSON */}
                <div className="pt-2 border-t border-border/50 text-right">
                    {!showFileFallback ? (
                        <button
                            type="button"
                            onClick={() => setShowFileFallback(true)}
                            className="text-[11px] text-text-tertiary hover:text-text-secondary transition-colors underline"
                        >
                            ¿Tenés un archivo .json guardado? Subir archivo
                        </button>
                    ) : (
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-text-tertiary">Seleccionar archivo .json:</span>
                            <label className="cursor-pointer font-semibold text-accent hover:underline inline-flex items-center gap-1">
                                <IconUpload stroke={1.75} className="h-3.5 w-3.5" />
                                <span>Examinar archivo</span>
                                <input
                                    type="file"
                                    accept="application/json,.json"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    variant="accent"
                    onClick={() => handleProcessText()}
                    disabled={!rawText.trim()}
                    className="min-h-[40px] px-5 text-sm font-bold"
                >
                    <IconClipboardText stroke={1.75} className="h-4 w-4" />
                    <span>Cargar {planNoun}</span>
                </Button>
            </ModalFooter>
        </Modal>
    );
}
