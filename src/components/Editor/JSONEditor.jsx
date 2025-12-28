/**
 * JSON Editor Component - Split View
 * Panel izquierdo: Editor de JSON
 * Panel derecho: Vista previa visual
 */

import { useState, useEffect, useCallback } from 'react';
import { Code, Eye, AlertCircle, CheckCircle } from 'lucide-react';

export default function JSONEditor({ value, onChange, className = '' }) {
    const [jsonText, setJsonText] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');

    // Inicializar con el valor actual
    useEffect(() => {
        if (value) {
            try {
                setJsonText(JSON.stringify(value, null, 2));
                setIsValid(true);
                setError('');
            } catch (e) {
                setError('Error al formatear JSON inicial');
            }
        }
    }, []);

    // Validar y actualizar JSON en tiempo real
    const handleJsonChange = useCallback((newText) => {
        setJsonText(newText);

        try {
            const parsed = JSON.parse(newText);
            setIsValid(true);
            setError('');

            // Llamar al onChange solo si el JSON es válido
            if (onChange) {
                onChange(parsed);
            }
        } catch (e) {
            setIsValid(false);
            setError(e.message);
            // No bloqueamos, solo mostramos el error
        }
    }, [onChange]);

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Header con indicador de validación */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0A0A0A] border-b border-[#2E2E2E]">
                <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-text-primary">Editor JSON</span>
                </div>

                <div className="flex items-center gap-2">
                    {isValid ? (
                        <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Válido</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-yellow-500">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs">Error de sintaxis</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor de texto */}
            <div className="flex-1 relative">
                <textarea
                    value={jsonText}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    className="w-full h-full p-4 bg-[#0A0A0A] text-text-primary font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="Pega aquí el JSON generado por la IA..."
                    spellCheck={false}
                    style={{
                        tabSize: 2,
                        lineHeight: '1.5',
                    }}
                />

                {/* Número de líneas (opcional, mejora la UX) */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0E0E0E] border-r border-[#2E2E2E] pointer-events-none select-none">
                    {jsonText.split('\n').map((_, index) => (
                        <div
                            key={index}
                            className="text-xs text-text-muted text-right pr-2"
                            style={{ lineHeight: '1.5rem', height: '1.5rem', fontSize: '0.75rem' }}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mensaje de error (si existe) */}
            {!isValid && error && (
                <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20 text-yellow-500 text-xs">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="font-mono">{error}</span>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="px-4 py-2 bg-[#0E0E0E] border-t border-[#2E2E2E] text-text-muted text-xs">
                <div className="flex items-center gap-4">
                    <span>💡 Tip: Pega el JSON de la IA y verás la vista previa en tiempo real</span>
                </div>
            </div>
        </div>
    );
}
