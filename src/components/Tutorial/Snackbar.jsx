/**
 * Snackbar - Sistema de notificaciones toast para BaseRutina
 * Feedback visual de acciones del usuario
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within SnackbarProvider');
    }
    return context;
};

const SNACKBAR_TYPES = {
    success: {
        icon: CheckCircle2,
        bgColor: 'bg-success/10',
        borderColor: 'border-success/30',
        textColor: 'text-success',
        iconColor: 'text-success',
    },
    error: {
        icon: XCircle,
        bgColor: 'bg-error/10',
        borderColor: 'border-error/30',
        textColor: 'text-error',
        iconColor: 'text-error',
    },
    warning: {
        icon: AlertCircle,
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/30',
        textColor: 'text-warning',
        iconColor: 'text-warning',
    },
    info: {
        icon: Info,
        bgColor: 'bg-info/10',
        borderColor: 'border-info/30',
        textColor: 'text-info',
        iconColor: 'text-info',
    },
};

function Snackbar({ id, message, type = 'info', duration = 5000, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const config = SNACKBAR_TYPES[type] || SNACKBAR_TYPES.info;
    const Icon = config.icon;

    useEffect(() => {
        // Fade in
        const showTimer = setTimeout(() => setIsVisible(true), 10);

        // Auto dismiss
        const dismissTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(dismissTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Match animation duration
    };

    return (
        <div
            className={`
        flex items-start gap-3 min-w-[320px] max-w-md p-4 
        rounded-lg border ${config.bgColor} ${config.borderColor}
        backdrop-blur-sm shadow-lg
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
            role="alert"
        >
            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

            <div className="flex-1 min-w-0">
                <p className={`text-sm ${config.textColor} leading-relaxed`}>
                    {message}
                </p>
            </div>

            <button
                onClick={handleClose}
                className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Cerrar"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export function SnackbarProvider({ children }) {
    const [snackbars, setSnackbars] = useState([]);

    const showSnackbar = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        setSnackbars((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeSnackbar = (id) => {
        setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
    };

    // Métodos de conveniencia
    const success = (message, duration) => showSnackbar(message, 'success', duration);
    const error = (message, duration) => showSnackbar(message, 'error', duration);
    const warning = (message, duration) => showSnackbar(message, 'warning', duration);
    const info = (message, duration) => showSnackbar(message, 'info', duration);

    return (
        <SnackbarContext.Provider value={{ showSnackbar, success, error, warning, info }}>
            {children}

            {/* Snackbar Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {snackbars.map((snackbar) => (
                    <div key={snackbar.id} className="pointer-events-auto">
                        <Snackbar
                            id={snackbar.id}
                            message={snackbar.message}
                            type={snackbar.type}
                            duration={snackbar.duration}
                            onClose={removeSnackbar}
                        />
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
}

// Mensajes predefinidos del tutorial
export const TUTORIAL_SNACKBARS = {
    promptCopied: 'Prompt copiado al portapapeles. ¡Pégalo en ChatGPT, Claude o Gemini!',
    jsonLoaded: 'Estructura JSON detectada y cargada con éxito.',
    jsonError: 'Error en el formato JSON. Revisa el código pegado.',
    pdfExported: 'PDF exportado correctamente. ¡Listo para compartir!',
    jsonExported: 'JSON exportado. Puedes reutilizarlo cuando quieras.',
};
