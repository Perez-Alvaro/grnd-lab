import React from 'react';
import { X, Smartphone, Monitor } from 'lucide-react';
import { Button } from '../ui';

/**
 * Modal para seleccionar el tipo de exportación PDF
 * @param {boolean} open - Si el modal está abierto
 * @param {function} onClose - Callback para cerrar el modal
 * @param {function} onSelectType - Callback cuando se selecciona un tipo (recibe 'mobile' o 'desktop')
 */
export default function PDFExportModal({ open, onClose, onSelectType }) {
    if (!open) return null;

    const handleSelect = (type) => {
        onSelectType(type);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-primary-surface rounded-2xl shadow-2xl border border-border p-6 mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary font-display">
                        Exportar rutina a PDF
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-surface-alt transition-colors text-text-tertiary hover:text-text-primary"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-6">
                    Selecciona el formato de exportación según tu preferencia:
                </p>

                {/* Options */}
                <div className="space-y-3">
                    {/* Mobile Option */}
                    <button
                        onClick={() => handleSelect('mobile')}
                        className="w-full p-4 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-surface-elevated transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                <Smartphone className="h-6 w-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-text-primary">
                                        Formato Mobile
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/10 text-red-600 font-medium">
                                        En desarrollo!
                                    </span>
                                </div>
                                <p className="text-sm text-text-tertiary">
                                    Diseño tipo tarjetas premium, optimizado para móviles con índice interactivo
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Desktop Option */}
                    <button
                        onClick={() => handleSelect('desktop')}
                        className="w-full p-4 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-surface-elevated transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                <Monitor className="h-6 w-6" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-text-primary mb-1">
                                    Formato Desktop
                                </h3>
                                <span className="px-2 py-0.5 text-xs rounded-md bg-green-500/10 text-green-600 font-medium">
                                        Recomendado
                                    </span>
                                <p className="text-sm text-text-tertiary">
                                    Diseño clásico en tabla, compacto y fácil de imprimir, con indice interactivo
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Cancel Button */}
                <div className="mt-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="w-full"
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
