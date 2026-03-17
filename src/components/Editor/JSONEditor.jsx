/**
 * JSON Editor Component - Split View
 * Panel izquierdo: Editor de JSON
 * Panel derecho: Vista previa visual
 */

import { useState, useEffect, useCallback } from 'react';
import { Code, Eye, AlertCircle, CheckCircle } from 'lucide-react';

// Limpia el JSON de formatos comunes (markdown code blocks, espacios, textos adicionales)
const cleanJSONText = (text) => {
  let cleaned = text.trim();

  // 1. Remover bloques de código markdown (```json ... ``` o solo ``` ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  // 2. Remover textos típicos de introducción que agregan las IAs
  const introPhrases = [
    /^```[\s\n]*/i,  // bloques de código simples
    /^aquí\s+est[aá]\s+(tu|el|su)\s+?.*/i,  // "Aquí está tu JSON"
    /^el\s+json\s+que\s+solicitaste/i,  // "El JSON que solicitaste"
    /^la\s+rutina\s+/i,  // "La rutina creada"
    /^tu\s+rutina\s+de\s+/i,  // "Tu rutina de entrenamiento"
    /^he\s+creado/i,  // "He creado"
    /^he\s+generado/i,  // "He generado"
    /^listo[,:]?\s+/i,  // "Listo:"
    /^espero\s+que/i,  // "Espero que"
    /^éxito[,:]?\s+/i,  // "Éxito:"
  ];

  // 3. Remover textos típicos de cierre que agregan las IAs
  const outroPhrases = [
    /[\s\n]*¡éxito\!?$/i,  // "¡Éxito!"
    /[\s\n]*espero\s+que\s+.*$/i,  // "Espero que funcione"
    /[\s\n]*suerte\s+.*$/i,  // "Suerte!"
    /[\s\n]*buena\s+suerte.*$/i,  // "Buena suerte"
    /[\s\n]*cualquier\s+duda.*$/i,  // "Cualquier duda..."
    /[\s\n]*si\s+necesitas.*$/i,  // "Si necesitas..."
    /[\s\n]*```+\s*$/i,  // bloques de código al final
    /[\s\n]+$/,  // espacios y saltos al final
  ];

  // Aplicar limpieza de frases introductorias
  introPhrases.forEach(regex => {
    cleaned = cleaned.replace(regex, '');
  });

  // Aplicar limpieza de frases de cierre
  outroPhrases.forEach(regex => {
    cleaned = cleaned.replace(regex, '');
  });

  // 4. Remover espacios en blanco nuevamente
  cleaned = cleaned.trim();

  // 5. Si el JSON está envuelto en comillas simples o dobles, removerlas
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1);
  }

  // 6. Asegurarse de que empiece con { o [ y termine con } o ]
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  // Encontrar cuál corchete abre primero
  let startIndex = -1;
  if (firstBrace !== -1 && firstBracket !== -1) {
    startIndex = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
  } else if (firstBracket !== -1) {
    startIndex = firstBracket;
  }

  // Encontrar el último corchete de cierre (} o ])
  let endIndex = -1;
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');

  if (lastBrace !== -1 && lastBracket !== -1) {
    endIndex = Math.max(lastBrace, lastBracket);
  } else if (lastBrace !== -1) {
    endIndex = lastBrace;
  } else if (lastBracket !== -1) {
    endIndex = lastBracket;
  }

  // Si encontramos corchetes válidos, tomar solo el contenido entre ellos
  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    cleaned = cleaned.substring(startIndex, endIndex + 1);
  }

  return cleaned.trim();
};

// Detecta si parece ser el prompt maestro en lugar del JSON
const looksLikePrompt = (text) => {
  const prompts = [
    'ERES UN ENTRENADOR',
    'TU MISIÓN',
    'CLIENTE Y CONTEXTO',
    'ESTRUCTURA REQUERIDA',
    'REGLAS DE GENERACIÓN',
    'FORMAS DE ENTRENAMIENTO',
    'INSTRUCCIONES CRÍTICAS',
    'FORMATO DE RESPUESTA',
    'MOTIVACIÓN GOGGINS',
    'CAMPOS OBLIGATORIOS',
  ];
  return prompts.some(phrase => text.toUpperCase().includes(phrase));
};

export default function JSONEditor({ value, onChange, className = '' }) {
    const [jsonText, setJsonText] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState('');
    const [helpMessage, setHelpMessage] = useState('');
    const [cleanedInfo, setCleanedInfo] = useState('');

    // Inicializar con el valor actual
    useEffect(() => {
        if (value) {
            try {
                setJsonText(JSON.stringify(value, null, 2));
                setIsValid(true);
                setError('');
                setHelpMessage('');
                setCleanedInfo('');
            } catch (e) {
                setError('Error al formatear JSON inicial');
            }
        }
    }, []);

    // Validar y actualizar JSON en tiempo real
    const handleJsonChange = useCallback((newText) => {
        setJsonText(newText);

        // Detectar si pegó el prompt maestro
        if (looksLikePrompt(newText)) {
            setIsValid(false);
            setError('');
            setHelpMessage('⚠️ Parece que pegaste el PROMPT MAESTRO en lugar del JSON. Aquí está el flujo correcto:');
            setCleanedInfo('');
            return;
        }

        // Limpiar el JSON (remover markdown, espacios, etc)
        const cleaned = cleanJSONText(newText);

        // Mostrar info si se removió contenido
        if (newText !== cleaned) {
            const charsRemoved = newText.length - cleaned.length;
            setCleanedInfo(`✓ Se limpiaron ${charsRemoved} caracteres (markdown, espacios, textos adicionales)`);
        } else {
            setCleanedInfo('');
        }

        try {
            const parsed = JSON.parse(cleaned);
            setJsonText(cleaned); // Actualizar con el texto limpio
            setIsValid(true);
            setError('');
            setHelpMessage('');

            // Llamar al onChange solo si el JSON es válido
            if (onChange) {
                onChange(parsed);
            }
        } catch (e) {
            setIsValid(false);
            setHelpMessage('');

            // Error específico si contiene texto extra
            if (newText.includes('```')) {
                setError('Detectado bloque de código markdown (```). Se intentó limpiar automáticamente. Si persiste el error, copia solo el JSON puro.');
            } else if (newText.length > cleaned.length) {
                setError(`JSON con contenido adicional. Se removieron ${newText.length - cleaned.length} caracteres. Verifica que sea solo JSON.`);
            } else {
                setError(`Sintaxis JSON inválida: ${e.message}`);
            }
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
                            <span className="text-xs">{helpMessage ? 'Espera instrucciones' : 'Error de sintaxis'}</span>
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

            {/* Mensaje de ayuda si detecta prompt maestro */}
            {helpMessage && (
                <div className="px-4 py-3 bg-blue-500/10 border-t border-blue-500/20 text-blue-400 text-xs space-y-2 max-h-32 overflow-y-auto">
                    <div className="font-semibold">{helpMessage}</div>
                    <ol className="list-decimal list-inside space-y-1 text-blue-300 text-xs">
                        <li>Haz click en "Copiar Prompt para IA"</li>
                        <li>Abre ChatGPT, Claude o tu IA favorita</li>
                        <li>Pega el Prompt Maestro completo</li>
                        <li>La IA responderá solo con JSON</li>
                        <li>Copia SOLO el JSON (sin bloques ```json``` de la IA)</li>
                        <li>Pégalo aquí en el editor</li>
                    </ol>
                </div>
            )}

            {/* Mensaje de error (si existe) */}
            {!isValid && error && !helpMessage && (
                <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20 text-yellow-500 text-xs">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <span className="font-mono block">{error}</span>
                            <span className="text-yellow-400 mt-1 block">💡 Pega solo el JSON que generó la IA, sin markdown (```)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Tips */}
            <div className="px-4 py-2 bg-[#0E0E0E] border-t border-[#2E2E2E] text-text-muted text-xs">
                <div className="flex items-center justify-between">
                    <span>💡 Tip: Copia el JSON limpio que genera la IA (sin bloques de código markdown)</span>
                    {cleanedInfo && (
                        <span className="text-green-400 text-xs font-medium">{cleanedInfo}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
